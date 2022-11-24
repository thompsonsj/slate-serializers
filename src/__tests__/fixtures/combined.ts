/**
 * More complex examples
 *
 * * serialize original Slate objects to HTML
 * * serializing the same HTML back to Slate
 * * serialize our generated Slate object back to HTML
 *
 * Our Slate object can differ from the original. We
 * have to add p tags to the top level to get a result
 * that we can convert back and forth. Without this,
 * logic gets too complex - we need to scan siblings,
 * and consider line breaks in the resulting HTML.
 * e.g. `Paragraph 1.Paragraph 2`.
 *
 * These tests ensure, despite the differences, the
 * resulting HTML is consistent whether from an
 * original Slate object or our 'p' tag version.
 */

// code/pre logic breaks this. Work code/pre into the text tag function in the htmlToSlate file.
// e.g. cannot handle converting back to `<p>Install <pre><code>slate-serializers</code></pre> via npm to convert between Slate and JSON.</p>`, need to look at the way htmlparser2 handles these elements.

interface Ifixture {
  name: string
  html: string
  slateOriginal: object[]
  slateReserialized: object[]
}

export const fixtures: Ifixture[] = [
  {
    name: 'larger document 1',
    html: '<h2>Heading 2</h2><p>A regular paragraph.</p><p>A <strong>paragraph</strong> with <strong><i>various</i></strong> text <s>marks</s>.</p><h3>Heading 3</h3><ul><li><strong>Item 1</strong>: From a list</li><li><strong>Item 2</strong>: From a list</li></ul><p><a href="https://docs.slatejs.org/">Find out more about Slate</a>.</p><h4>Heading 4</h4>',
    slateOriginal: [
      {
        children: [
          {
            text: 'Heading 2',
          },
        ],
        type: 'h2',
      },
      {
        children: [
          {
            text: 'A regular paragraph.',
          },
        ],
      },
      {
        children: [
          {
            text: 'A ',
          },
          {
            text: 'paragraph',
            bold: true,
          },
          {
            text: ' with ',
          },
          {
            text: 'various',
            bold: true,
            italic: true,
          },
          {
            text: ' text ',
          },
          {
            text: 'marks',
            strikethrough: true,
          },
          {
            text: '.',
          },
        ],
      },
      {
        children: [
          {
            text: 'Heading 3',
          },
        ],
        type: 'h3',
      },
      {
        type: 'ul',
        children: [
          {
            children: [
              {
                text: 'Item 1',
                bold: true,
              },
              {
                text: ': From a list',
              },
            ],
            type: 'li',
          },
          {
            children: [
              {
                text: 'Item 2',
                bold: true,
              },
              {
                text: ': From a list',
              },
            ],
            type: 'li',
          },
        ],
      },
      {
        children: [
          {
            text: '',
          },
          {
            type: 'link',
            linkType: 'custom',
            url: 'https://docs.slatejs.org/',
            children: [
              {
                text: 'Find out more about Slate',
              },
            ],
          },
          {
            text: '.',
          },
        ],
      },
      {
        children: [
          {
            text: 'Heading 4',
          },
        ],
        type: 'h4',
      },
    ],
    slateReserialized: [
      {
        children: [
          {
            text: 'Heading 2',
          },
        ],
        type: 'h2',
      },
      {
        children: [
          {
            text: 'A regular paragraph.',
          },
        ],
        type: 'p',
      },
      {
        children: [
          {
            text: 'A ',
          },
          {
            bold: true,
            text: 'paragraph',
          },
          {
            text: ' with ',
          },
          {
            bold: true,
            italic: true,
            text: 'various',
          },
          {
            text: ' text ',
          },
          {
            strikethrough: true,
            text: 'marks',
          },
          {
            text: '.',
          },
        ],
        type: 'p',
      },
      {
        children: [
          {
            text: 'Heading 3',
          },
        ],
        type: 'h3',
      },
      {
        children: [
          {
            children: [
              {
                bold: true,
                text: 'Item 1',
              },
              {
                text: ': From a list',
              },
            ],
            type: 'li',
          },
          {
            children: [
              {
                bold: true,
                text: 'Item 2',
              },
              {
                text: ': From a list',
              },
            ],
            type: 'li',
          },
        ],
        type: 'ul',
      },
      {
        children: [
          {
            children: [
              {
                text: 'Find out more about Slate',
              },
            ],
            newTab: false,
            type: 'link',
            url: 'https://docs.slatejs.org/',
          },
          {
            text: '.',
          },
        ],
        type: 'p',
      },
      {
        children: [
          {
            text: 'Heading 4',
          },
        ],
        type: 'h4',
      },
    ],
  },
]
