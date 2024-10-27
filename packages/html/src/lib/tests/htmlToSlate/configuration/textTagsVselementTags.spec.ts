import {
  htmlToSlate,
  HtmlToSlateConfig,
  htmlToSlateConfig,
} from '@slate-serializers/html';
import { getAttributeValue } from 'domutils';

describe('htmlToSlate configuration: textTags & elementTags', () => {
  it('converts element/text tags and their attributes to Slate nodes/node attributes using a custom configuration', () => {
    const html =
      '<article id="main"><p>Published: <time datetime="2016-01-20"><strong>20 January 2016</strong></time></p></article>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      textTags: {
        ...htmlToSlateConfig.textTags,
        time: (el) => ({
          ...(el && {
            datetime: getAttributeValue(el, 'datetime'),
          }),
          time: true,
        }),
      },
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
                  "text": "Published: ",
                },
                {
                  "bold": true,
                  "datetime": "2016-01-20",
                  "text": "20 January 2016",
                  "time": true,
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
