import serializer from 'dom-serializer'
import { Document, Element, Text } from 'domhandler'
import { getName } from 'domutils'

import type { AnyNode } from 'domhandler'
import type { Config } from '../config/types'
import { convertSlate } from './convert-slate'

const html = (node: AnyNode | ArrayLike<AnyNode>) => serializer(node as AnyNode)

describe('convertSlate', () => {
  it('prefers customElementTransforms over config.elementTransforms over elementMap', () => {
    const config: Config = {
      markMap: {},
      elementMap: {
        p: 'p',
      },
      elementTransforms: {
        p: ({ children = [] }) => new Element('div', {}, children),
      },
    }

    const node = {
      type: 'p',
      children: [{ text: 'Hello' }],
    }

    const out = convertSlate({
      node,
      config,
      customElementTransforms: {
        p: ({ children = [] }: { children?: any[] }) => new Element('section', {}, children),
      },
    })

    expect(html(out)).toEqual('<section>Hello</section>')
  })

  it('encodes entities inside <pre> when alwaysEncodeCodeEntities is enabled', () => {
    const config: Config = {
      markMap: {
        code: ['pre', 'code'],
      },
      elementMap: {},
      elementTransforms: {},
      encodeEntities: false,
      alwaysEncodeBreakingEntities: false,
      alwaysEncodeCodeEntities: true,
      convertLineBreakToBr: false,
    }

    const node = {
      text: `2 & 1 < 3 > 0`,
      code: true,
    }

    const out = convertSlate({ node, config })
    const doc = out as unknown as Document
    expect(doc.children).toHaveLength(1)
    const pre = doc.children[0] as Element
    expect(getName(pre)).toEqual('pre')
    expect(pre.children).toHaveLength(1)
    const code = pre.children[0] as Element
    expect(getName(code)).toEqual('code')
    expect(code.children).toHaveLength(1)
    const text = code.children[0] as Text
    expect(text.data).toEqual('2 &amp; 1 &lt; 3 &gt; 0')
  })

  it('adds a trailing <br> between sibling inline nodes when enabled', () => {
    const config: Config = {
      markMap: {},
      elementMap: {},
      elementTransforms: {},
      convertLineBreakToBr: true,
    }

    const first = convertSlate({
      node: { children: [{ text: 'a' }] },
      config,
      isLastNodeInDocument: false,
    })
    const last = convertSlate({
      node: { children: [{ text: 'b' }] },
      config,
      isLastNodeInDocument: true,
    })

    expect(html(first)).toEqual('a<br>')
    expect(html(last)).toEqual('b')
  })
})

