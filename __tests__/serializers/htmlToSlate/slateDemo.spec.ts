import { htmlToSlate, slateDemoHtmlToSlateConfig } from '../../../src'

describe('inline code and pre HTML elements', () => {
  // all fixtures should give the same Slate result
  // slate demo is configured to translate `code=true`
  // to `<pre><code>...</code></pre>

  // htmlparser2 seems to separate out `pre` into a new
  // block but keeps `code` tags inline. A simple
  // pre -> code replacement in the config ensures
  // Slate JSON condenses down to a node with
  // `code=true` in any of the following scenarios.
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
          text: '&lt;textarea&gt;',
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