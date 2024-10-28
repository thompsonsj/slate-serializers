// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  htmlToSlate,
  HtmlToSlateConfig,
  htmlToSlateConfig,
} from '@slate-serializers/html';
import { Element } from 'domhandler';
import { getAttributeValue } from 'domutils';

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
});
