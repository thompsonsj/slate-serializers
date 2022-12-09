import { htmlToSlate, slateDemoHtmlToSlateConfig } from '../../../src'

describe('inline code and pre HTML elements', () => {
  // all fixtures should give the same Slate result
  // slate demo is configured to translate `code=true`
  // to `<pre><code>...</code></pre>

  // htmlparser2 seems to separate out `pre` into a new
  // block but keeps `code` tags inline. A workaround for
  // this scenario (hacky, but works) uses regex to replace
  // `pre` tags with `code`.

  // It is not possible to achieve this when the DOM is
  // parsed because this is the stage where the paragraph
  // is broken.
  const slate = [
    {
      type: 'paragraph',
      children: [
        {
          text: 'This is editable '
        },
        {
          text: 'rich',
          bold: true
        },
        {
          text: ' text, '
        },
        {
          text: 'much',
          italic: true
        },
        {
          text: ' better than a '
        },
        {
          text: '<textarea>',
          code: true
        },
        {
          text: '!'
        }
      ]
    }
  ]
  it('can handle inline code tags', () => {
    const html = '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <code>&lt;textarea&gt;</code>!</p>'
    expect(htmlToSlate(html, slateDemoHtmlToSlateConfig)).toEqual(slate)
  })

  it('can handle duplicate inline code tags', () => {
    const html = '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <code><code>&lt;textarea&gt;</code></code>!</p>'
    expect(htmlToSlate(html, slateDemoHtmlToSlateConfig)).toEqual(slate)
  })

  it('can handle inline code tags', () => {
    const html = '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <pre>&lt;textarea&gt;</pre>!</p>'
    expect(htmlToSlate(html, slateDemoHtmlToSlateConfig)).toEqual(slate)
  })

  it('can handle inline code and pre tags', () => {
    const html = '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <pre><code>&lt;textarea&gt;</code></pre>!</p>'
    expect(htmlToSlate(html, slateDemoHtmlToSlateConfig)).toEqual(slate)
  })
})

describe('translates `text-align` style attributes', () => {
  it('adds right align to paragraphs', () => {
    const html = '<p style="text-align: right;">This is a right aligned paragraph.</p>'
    const slate = [
      {
        align: "right",
        children: [
          {
            text: "This is a right aligned paragraph.",
          },
        ],
        type: "paragraph",
      },
    ]
    expect(htmlToSlate(html, slateDemoHtmlToSlateConfig)).toEqual(slate)
  })

  it('adds justify align to blockquotes', () => {
    const html = '<blockquote style="text-align: justify;">This is a justified blockquote.</blockquote>'
    const slate = [
      {
        align: "justify",
        children: [
          {
            text: "This is a justified blockquote.",
          },
        ],
        type: "block-quote",
      },
    ]
    expect(htmlToSlate(html, slateDemoHtmlToSlateConfig)).toEqual(slate)
  })

  it('adds left align to a list item', () => {
    const html = '<ul><li style="text-align: justify;">This is a left aligned list item.</li></ul>'
    const slate = [
      {
        children: [
          {
            align: "justify",
            children: [
              {
                text: "This is a left aligned list item."
              }
            ],
            type: "list-item",
          },
        ],
        type: "bulleted-list",
      },
    ]
    expect(htmlToSlate(html, slateDemoHtmlToSlateConfig)).toEqual(slate)
  })
})