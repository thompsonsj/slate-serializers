// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  htmlToSlate,
  HtmlToSlateConfig,
  htmlToSlateConfig,
} from '@slate-serializers/html';
import { getAttributeValue } from 'domutils';

describe('htmlToSlate configuration: elementAttributeTransform', () => {
  it('converts element tags to Slate nodes from the default configuration', () => {
    const html =
      '<h1 id="h1-1">Heading 1</h1><p id="p-1">Paragraph 1</p><h2 id="h2-1">Lists</h2><ul id="ul-1"><li id="li-1">Unordered list item 1</li><li id="li-2">Unordered list item 2</li></ul><ol id="ol-1"><li id="li-3">Ordered list item 1</li><li id="li-4">Ordered list item 2</li></ol><h2 id="h2-2">Quotes</h2><blockquote id="blockquote-1">Quote</blockquote>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      elementAttributeTransform: ({ el }) => {
        const attribs: { [key: string]: string } = {};
        const id = getAttributeValue(el, 'id');
        if (id) {
          attribs['id'] = id;
        }
        return attribs;
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
          "id": "h1-1",
          "type": "h1",
        },
        {
          "children": [
            {
              "text": "Paragraph 1",
            },
          ],
          "id": "p-1",
          "type": "p",
        },
        {
          "children": [
            {
              "text": "Lists",
            },
          ],
          "id": "h2-1",
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
              "id": "li-1",
              "type": "li",
            },
            {
              "children": [
                {
                  "text": "Unordered list item 2",
                },
              ],
              "id": "li-2",
              "type": "li",
            },
          ],
          "id": "ul-1",
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
              "id": "li-3",
              "type": "li",
            },
            {
              "children": [
                {
                  "text": "Ordered list item 2",
                },
              ],
              "id": "li-4",
              "type": "li",
            },
          ],
          "id": "ol-1",
          "type": "ol",
        },
        {
          "children": [
            {
              "text": "Quotes",
            },
          ],
          "id": "h2-2",
          "type": "h2",
        },
        {
          "children": [
            {
              "text": "Quote",
            },
          ],
          "id": "blockquote-1",
          "type": "blockquote",
        },
      ]
    `);
  });
});
