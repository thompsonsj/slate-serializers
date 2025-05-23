// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  htmlToSlate,
  HtmlToSlateConfig,
  htmlToSlateConfig,
} from '@slate-serializers/html';
import { Element } from 'domhandler';
import { findOne, getAttributeValue, textContent } from 'domutils';

describe('htmlToSlate configuration: htmlUpdaterMap', () => {
  it('converts element tags to Slate nodes from the default configuration', () => {
    const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        div: (el) => ({
          ...(el && {
            class: getAttributeValue(el, 'class'),
          }),
          type: 'div',
        }),
      },
      htmlUpdaterMap: {
        ['p']: (paragraph) => {
          return new Element('div', { ['class']: 'paragraph-wrapper' }, [
            paragraph,
          ]);
        },
      },
    };
    expect(htmlToSlate(html, config)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "text": "Paragraph 1",
                },
              ],
              "type": "p",
            },
          ],
          "class": "paragraph-wrapper",
          "type": "div",
        },
        {
          "children": [
            {
              "children": [
                {
                  "text": "Paragraph 2",
                },
              ],
              "type": "p",
            },
          ],
          "class": "paragraph-wrapper",
          "type": "div",
        },
      ]
    `);
  });

  it('extracts data from HTML elements nested in a parent `figure` HTML element and maps to a single Slate node', () => {
    const html =
      '<figure><img src="https://example.com/image.jpg" alt="An image alt text" /><figcaption>An image caption</figcaption></figure>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        figure: (el) => ({
          ...(el && {
            url: el?.attribs['data-src'],
            caption: el?.attribs['data-caption'],
            alt: el?.attribs['data-alt'],
          }),
          type: 'image',
        }),
      },
      htmlUpdaterMap: {
        figure: (el) => {
          // strip all the child nodes from figures with images to make them flat for the elementMap
          const caption = findOne((node) => node.name === 'figcaption', [el]);
          const img = findOne((node) => node.name === 'img', [el]);
          if (!img) {
            return el;
          }
          const src = img.attribs['src'];
          const alt = img.attribs['alt'];
          return new Element(
            'figure',
            {
              ...el.attribs,
              'data-caption': caption ? textContent(caption) : '',
              'data-src': src,
              'data-alt': alt,
              'data-type': 'image',
            },
            []
          );
        },
      },
    };
    expect(htmlToSlate(html, config)).toMatchInlineSnapshot(`
      [
        {
          "alt": "An image alt text",
          "caption": "An image caption",
          "children": [
            {
              "text": "",
            },
          ],
          "type": "image",
          "url": "https://example.com/image.jpg",
        },
      ]
    `);
  });

  it('extracts data from HTML elements nested in a parent `figure` HTML element and maps to a single Slate node: simplified', () => {
    const html =
      '<figure><img src="https://example.com/image.jpg" alt="Alt text" /></figure>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        figure: (el) => ({
          ...(el && el.attribs),
          type: 'image',
        }),
      },
      htmlUpdaterMap: {
        figure: (el) => {
          const img = findOne((node) => node.name === 'img', [el]);
          if (!img) {
            return el;
          }
          const src = img.attribs['src'];
          const alt = img.attribs['alt'];
          return new Element(
            'figure',
            {
              ...el.attribs,
              'data-src': src,
              'data-alt': alt,
            },
            []
          );
        },
      },
    };
    expect(htmlToSlate(html, config)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "text": "",
            },
          ],
          "data-alt": "Alt text",
          "data-src": "https://example.com/image.jpg",
          "type": "image",
        },
      ]
    `);
  });
});
