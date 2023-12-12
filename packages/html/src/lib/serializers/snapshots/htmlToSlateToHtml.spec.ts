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

const fixture = `<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <pre><code>&lt;textarea&gt;</code></pre>!</p>

<p>Since it&apos;s rich text, you can do things like turn a selection of text <strong>bold</strong>, or add a semantically rendered block quote in the middle of the page, like this:</p>

<blockquote>A wise quote.</blockquote>

<p style="text-align:center;">Try it out for yourself!</p>`;

describe('Slate JS example', () => {
  const slate = htmlToSlate(fixture);

  it('generates expected htmlToSlate output', () => {
    expect(slate).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "text": "This is editable ",
            },
            {
              "bold": true,
              "text": "rich",
            },
            {
              "text": " text, ",
            },
            {
              "italic": true,
              "text": "much",
            },
            {
              "text": " better than a ",
            },
            {
              "code": true,
              "text": "<textarea>",
            },
            {
              "text": "!",
            },
          ],
          "type": "p",
        },
        {
          "children": [
            {
              "text": "Since it's rich text, you can do things like turn a selection of text ",
            },
            {
              "bold": true,
              "text": "bold",
            },
            {
              "text": ", or add a semantically rendered block quote in the middle of the page, like this:",
            },
          ],
          "type": "p",
        },
        {
          "children": [
            {
              "text": "A wise quote.",
            },
          ],
          "type": "blockquote",
        },
        {
          "align": "center",
          "children": [
            {
              "text": "Try it out for yourself!",
            },
          ],
          "type": "p",
        },
      ]
    `);
  });

  it('generates expected slateToHtml output', () => {
    expect(slateToHtml(slate)).toMatchInlineSnapshot(
      `"<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <pre><code>&lt;textarea&gt;</code></pre>!</p><p>Since it's rich text, you can do things like turn a selection of text <strong>bold</strong>, or add a semantically rendered block quote in the middle of the page, like this:</p><blockquote>A wise quote.</blockquote><p style="text-align:center;">Try it out for yourself!</p>"`
    );
  });
});

describe('Slate JS example - with style utilities', () => {
  const config: HtmlToSlateConfig = {
    ...htmlToSlateConfig,
    elementAttributeTransform: ({ el }) => {
      const style =
        el.attribs['style'] &&
        transformStyleStringToObject(el.attribs['style']);
      return {
        ...(style && { style }),
      };
    },
  };
  const slate = htmlToSlate(fixture, config);

  it('generates expected htmlToSlate output', () => {
    expect(slate).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "text": "This is editable ",
            },
            {
              "bold": true,
              "text": "rich",
            },
            {
              "text": " text, ",
            },
            {
              "italic": true,
              "text": "much",
            },
            {
              "text": " better than a ",
            },
            {
              "code": true,
              "text": "<textarea>",
            },
            {
              "text": "!",
            },
          ],
          "type": "p",
        },
        {
          "children": [
            {
              "text": "Since it's rich text, you can do things like turn a selection of text ",
            },
            {
              "bold": true,
              "text": "bold",
            },
            {
              "text": ", or add a semantically rendered block quote in the middle of the page, like this:",
            },
          ],
          "type": "p",
        },
        {
          "children": [
            {
              "text": "A wise quote.",
            },
          ],
          "type": "blockquote",
        },
        {
          "children": [
            {
              "text": "Try it out for yourself!",
            },
          ],
          "style": {
            "textAlign": "center",
          },
          "type": "p",
        },
      ]
    `);
  });

  it('generates expected slateToHtml output', () => {
    const config: SlateToHtmlConfig = {
      ...slateToHtmlConfig,
      elementAttributeTransform: ({ node }) => {
        if (node.style) {
          return {
            style: transformStyleObjectToString(node.style),
          };
        }
        return undefined;
      },
    };

    expect(slateToHtml(slate, config)).toMatchInlineSnapshot(
      `"<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <pre><code>&lt;textarea&gt;</code></pre>!</p><p>Since it's rich text, you can do things like turn a selection of text <strong>bold</strong>, or add a semantically rendered block quote in the middle of the page, like this:</p><blockquote>A wise quote.</blockquote><p style="text-align: center">Try it out for yourself!</p>"`
    );
  });
});
