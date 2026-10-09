import serializer from 'dom-serializer'
import { Element } from 'domhandler'
import type { ChildNode } from 'domhandler'
import { slateToDom } from './dom'
import { config as slateToDomConfig } from './config/default'
import { config as payloadSlateToDomConfig } from './config/payload'
import { config as slateDemoSlateToDomConfig } from './config/slateDemo'

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
    expect(serializer(slateToDom(inlineCode))).toEqual(html)
    expect(serializer(slateToDom(inlineCode, slateToDomConfig))).toEqual(html)
    expect(serializer(slateToDom(inlineCode, payloadSlateToDomConfig))).toEqual(html)
    expect(serializer(slateToDom(inlineCode, slateDemoSlateToDomConfig))).toEqual('Use <code>npm</code> here.')
  })

  it('combines with other marks', () => {
    expect(serializer(slateToDom(boldAndCode))).toEqual('<p>Use <strong><code>npm</code></strong> here.</p>')
  })

  it('still wraps a code-block element in pre and code', () => {
    const slate = [
      {
        type: 'code-block',
        children: [{ text: 'const a = 1' }],
      },
    ]
    const config = {
      ...slateToDomConfig,
      elementTransforms: {
        ...slateToDomConfig.elementTransforms,
        'code-block': ({ children = [] }: { children?: ChildNode[] }) =>
          new Element('pre', {}, [new Element('code', {}, children)]),
      },
    }
    expect(serializer(slateToDom(slate, config))).toEqual('<pre><code>const a = 1</code></pre>')
  })
})
