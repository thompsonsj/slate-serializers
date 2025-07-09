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
            [],
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
            [],
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

  it('can be used to remove a parent node', () => {
    const html =
      '<div class="lexical-table-container"><table class="lexical-table" style="border-collapse: collapse;"><tr class="lexical-table-row"><th class="lexical-table-cell lexical-table-cell-header-1">Texte pour la cellule \'en-tête 1</th><th class="lexical-table-cell lexical-table-cell-header-1">Texte pour la cellule d\'en-tête 2</th></tr><tr class="lexical-table-row"><td class="lexical-table-cell lexical-table-cell-header-0">Texte de la cellule du tableau, ligne 1, col 1</td><td class="lexical-table-cell lexical-table-cell-header-0">Texte de la cellule du tableau, ligne 1, col 2</td></tr></table></div>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        table: () => ({ type: 'table' }),
        tr: () => ({ type: 'table-row' }),
        td: () => ({ type: 'table-cell' }),
        th: () => ({ type: 'table-header-cell' }),
      },
      htmlUpdaterMap: {
        div: (el) => {
          // is this is a direct parent of a table
          const table = findOne((node) => node.name === 'table', [el]);
          if (table) {
            return table;
          }
          return el;
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
                  "children": [
                    {
                      "text": "Texte pour la cellule 'en-tête 1",
                    },
                  ],
                  "type": "table-header-cell",
                },
                {
                  "children": [
                    {
                      "text": "Texte pour la cellule d'en-tête 2",
                    },
                  ],
                  "type": "table-header-cell",
                },
              ],
              "type": "table-row",
            },
            {
              "children": [
                {
                  "children": [
                    {
                      "text": "Texte de la cellule du tableau, ligne 1, col 1",
                    },
                  ],
                  "type": "table-cell",
                },
                {
                  "children": [
                    {
                      "text": "Texte de la cellule du tableau, ligne 1, col 2",
                    },
                  ],
                  "type": "table-cell",
                },
              ],
              "type": "table-row",
            },
          ],
          "type": "table",
        },
      ]
    `);
  });
});
