import { getAttributeValue } from 'domutils';
import {
  htmlToSlate,
  htmlToSlateConfig,
  slateToHtml,
  type HtmlToSlateConfig,
  SlateToHtmlConfig,
  slateToHtmlConfig,
} from '../../html';
import {
  transformStyleObjectToString,
  transformStyleStringToObject,
} from '@slate-serializers/utilities';

const fixture =
  '<h2 style="text-align: center;"><span style="font-size: 14pt;"><b>Introduce MacBook Air 2017 MQD42</b></span></h2>\n<p><img class="aligncenter wp-image-3372" src="https://example.com/media/macbook-air-2017-mqd42-1.jpg" alt="" width="900" height="577" /></p>\n';

describe('issue #120', () => {
  it('generates expected htmlToSlate output', () => {
    const slate = htmlToSlate(fixture);
    expect(slate).toMatchInlineSnapshot(`
      [
        {
          "align": "center",
          "children": [
            {
              "text": "Introduce MacBook Air 2017 MQD42",
            },
          ],
          "type": "h2",
        },
        {
          "children": [
            {
              "text": "",
            },
          ],
          "type": "p",
        },
      ]
    `);
  });

  it('generates expected htmlToSlate output with an elementTransform', () => {
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        img: (el) => ({
          type: 'image',
          src: el && getAttributeValue(el, 'src'),
          width: el && getAttributeValue(el, 'width'),
          height: el && getAttributeValue(el, 'height'),
        }),
      },
    };
    const slate = htmlToSlate(fixture, config);
    expect(slate).toMatchInlineSnapshot(`
      [
        {
          "align": "center",
          "children": [
            {
              "text": "Introduce MacBook Air 2017 MQD42",
            },
          ],
          "type": "h2",
        },
        {
          "children": [
            {
              "children": [
                {
                  "text": "",
                },
              ],
              "height": "577",
              "src": "https://example.com/media/macbook-air-2017-mqd42-1.jpg",
              "type": "image",
              "width": "900",
            },
          ],
          "type": "p",
        },
      ]
    `);
  });
});
