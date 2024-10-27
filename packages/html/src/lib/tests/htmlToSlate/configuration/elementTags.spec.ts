import {
  htmlToSlate,
  HtmlToSlateConfig,
  htmlToSlateConfig,
} from '@slate-serializers/html';
import { getAttributeValue } from 'domutils';

describe('htmlToSlate configuration: elementTags', () => {
  it('converts element tags to Slate nodes from the default configuration', () => {
    const html =
      '<h1>Heading 1</h1><p>Paragraph 1</p><h2>Lists</h2><ul><li>Unordered list item 1</li><li>Unordered list item 2</li></ul><ol><li>Ordered list item 1</li><li>Ordered list item 2</li></ol><h2>Quotes</h2><blockquote>Quote</blockquote>';
    expect(htmlToSlate(html)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "text": "Heading 1",
            },
          ],
          "type": "h1",
        },
        {
          "children": [
            {
              "text": "Paragraph 1",
            },
          ],
          "type": "p",
        },
        {
          "children": [
            {
              "text": "Lists",
            },
          ],
          "type": "h2",
        },
        {
          "children": [
            {
              "children": [
                {
                  "text": "Unordered list item 1",
                },
              ],
              "type": "li",
            },
            {
              "children": [
                {
                  "text": "Unordered list item 2",
                },
              ],
              "type": "li",
            },
          ],
          "type": "ul",
        },
        {
          "children": [
            {
              "children": [
                {
                  "text": "Ordered list item 1",
                },
              ],
              "type": "li",
            },
            {
              "children": [
                {
                  "text": "Ordered list item 2",
                },
              ],
              "type": "li",
            },
          ],
          "type": "ol",
        },
        {
          "children": [
            {
              "text": "Quotes",
            },
          ],
          "type": "h2",
        },
        {
          "children": [
            {
              "text": "Quote",
            },
          ],
          "type": "blockquote",
        },
      ]
    `);
  });

  it('converts element tags to Slate nodes using a custom configuration', () => {
    const html = '<h1>Heading 1</h1>';
    const config = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        h1: () => ({ type: 'heading-one' }),
      },
    };
    expect(htmlToSlate(html, config)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "text": "Heading 1",
            },
          ],
          "type": "heading-one",
        },
      ]
    `);
  });

  it('converts element tags and their attributes to Slate nodes using a custom configuration', () => {
    const html =
      '<article id="main"><p>Paragraph inside an article<p></article>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        article: (el) => ({
          ...(el && {
            id: getAttributeValue(el, 'id'),
          }),
          type: 'article',
        }),
      },
    };
    expect(htmlToSlate(html, config)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "children": [
                {
                  "text": "Paragraph inside an article",
                },
              ],
              "type": "p",
            },
            {
              "children": [
                {
                  "text": "",
                },
              ],
              "type": "p",
            },
          ],
          "id": "main",
          "type": "article",
        },
      ]
    `);
  });
});
