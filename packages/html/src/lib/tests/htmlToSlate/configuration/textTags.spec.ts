import {
  htmlToSlate,
  HtmlToSlateConfig,
  htmlToSlateConfig,
} from '@slate-serializers/html';

describe('htmlToSlate configuration: textTags', () => {
  it('converts text tags to Slate node attributes from the default configuration', () => {
    const html =
      '<p><strong>I am bold text</strong> whereas <strong><i>I am italic bold text with the last </i></strong><strong><i><s>four words having strikethrough</s></i></strong>.</p>';
    expect(htmlToSlate(html)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "bold": true,
              "text": "I am bold text",
            },
            {
              "text": " whereas ",
            },
            {
              "bold": true,
              "italic": true,
              "text": "I am italic bold text with the last ",
            },
            {
              "bold": true,
              "italic": true,
              "strikethrough": true,
              "text": "four words having strikethrough",
            },
            {
              "text": ".",
            },
          ],
          "type": "p",
        },
      ]
    `);
  });

  it('converts text tags to Slate node attributes using a custom configuration', () => {
    const html =
      '<p><strong>I am bold text</strong> whereas <sub><strong><i>I am subscript italic bold text</i></strong></sub>.</p>';
    const config = {
      ...htmlToSlateConfig,
      textTags: {
        ...htmlToSlateConfig.textTags,
        sub: () => ({ subscript: true }),
      },
    };
    expect(htmlToSlate(html, config)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "bold": true,
              "text": "I am bold text",
            },
            {
              "text": " whereas ",
            },
            {
              "bold": true,
              "italic": true,
              "subscript": true,
              "text": "I am subscript italic bold text",
            },
            {
              "text": ".",
            },
          ],
          "type": "p",
        },
      ]
    `);
  });

  it('converts text tags and their attributes to Slate node attributes using a custom configuration', () => {
    const html =
      '<p>Published: <time datetime="2016-01-20">20 January 2016</time></p>';
    const config: HtmlToSlateConfig = {
      ...htmlToSlateConfig,
      textTags: {
        ...htmlToSlateConfig.textTags,
        time: (el) => ({
          ...(el?.attribs?.['datetime'] && {
            datetime: el.attribs['datetime'],
          }),
          time: true,
        }),
      },
    };
    expect(htmlToSlate(html, config)).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "text": "Published: ",
            },
            {
              "datetime": "2016-01-20",
              "text": "20 January 2016",
              "time": true,
            },
          ],
          "type": "p",
        },
      ]
    `);
  });
});
