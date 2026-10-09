import { Element } from 'domhandler'
import type { ChildNode } from 'domhandler'
import {
  htmlToSlate,
  payloadSlateToHtmlConfig,
  slateDemoSlateToHtmlConfig,
  slateToHtml,
  slateToHtmlConfig,
} from '@slate-serializers/html'

const inlineCode = [
  {
    type: 'p',
    children: [{ text: 'Use ' }, { text: 'npm', code: true }, { text: ' here.' }],
  },
]

const boldAndCode = [
  {
    type: 'p',
    children: [{ text: 'Use ' }, { text: 'npm', bold: true, code: true }, { text: ' here.' }],
  },
]

describe('code mark', () => {
  it('renders as inline code inside a paragraph', () => {
    const html = '<p>Use <code>npm</code> here.</p>'
    expect(slateToHtml(inlineCode)).toEqual(html)
    expect(slateToHtml(inlineCode, slateToHtmlConfig)).toEqual(html)
    expect(slateToHtml(inlineCode, payloadSlateToHtmlConfig)).toEqual(html)
    expect(slateToHtml(inlineCode, slateDemoSlateToHtmlConfig)).toEqual('Use <code>npm</code> here.')
  })

  it('combines with other marks', () => {
    expect(slateToHtml(boldAndCode)).toEqual('<p>Use <strong><code>npm</code></strong> here.</p>')
  })

  it('round-trips a paragraph that already uses inline code', () => {
    const html = '<p>Use <code>npm</code> here.</p>'
    expect(htmlToSlate(html)).toEqual(inlineCode)
    expect(slateToHtml(htmlToSlate(html))).toEqual(html)
  })

  it('still wraps a code-block element in pre and code', () => {
    const html = '<pre><code>const a = 1</code></pre>'
    const slate = [
      {
        type: 'code-block',
        children: [{ text: 'const a = 1' }],
      },
    ]
    const config = {
      ...slateToHtmlConfig,
      elementTransforms: {
        ...slateToHtmlConfig.elementTransforms,
        'code-block': ({ children = [] }: { children?: ChildNode[] }) =>
          new Element('pre', {}, [new Element('code', {}, children)]),
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})
