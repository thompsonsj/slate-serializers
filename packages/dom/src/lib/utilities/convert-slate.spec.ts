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

  it('applies elementAttributeTransform to mapped elements', () => {
    const config: Config = {
      markMap: {},
      elementMap: { p: 'p' },
      elementTransforms: {},
      elementAttributeTransform: ({ node }: { node: any }) => {
        return node.id ? { 'data-id': String(node.id) } : undefined
      },
    }

    const out = convertSlate({
      node: { type: 'p', id: 123, children: [{ text: 'x' }] },
      config,
    })

    expect(html(out)).toEqual('<p data-id="123">x</p>')
  })

  it('splits text on \\n into <br> when convertLineBreakToBr is enabled', () => {
    const config: Config = {
      markMap: {},
      elementMap: {},
      elementTransforms: {},
      convertLineBreakToBr: true,
    }

    const out = convertSlate({
      node: { text: 'a\nb' },
      config,
    })

    expect(html(out)).toEqual('a<br>b')
  })

  it('uses defaultTag for nodes without type', () => {
    const config: Config = {
      markMap: {},
      elementMap: {},
      elementTransforms: {},
      defaultTag: 'p',
    }

    const out = convertSlate({
      node: { children: [{ text: 'hi' }] },
      config,
    })

    expect(html(out)).toEqual('<p>hi</p>')
  })

  it('nests marks in markMap order', () => {
    const config: Config = {
      markMap: {
        bold: ['strong'],
        italic: ['i'],
      },
      elementMap: {},
      elementTransforms: {},
      convertLineBreakToBr: false,
    }

    const out = convertSlate({
      node: { text: 't', bold: true, italic: true },
      config,
    })

    // markMap iteration order is the insertion order of keys: bold then italic.
    expect(html(out)).toEqual('<strong><i>t</i></strong>')
  })

  it('when both breaking-entity and code-entity encoding are enabled, pre/code text is encoded once in Text.data', () => {
    const config: Config = {
      markMap: {
        code: ['pre', 'code'],
      },
      elementMap: {},
      elementTransforms: {},
      encodeEntities: false,
      alwaysEncodeBreakingEntities: true,
      alwaysEncodeCodeEntities: true,
      convertLineBreakToBr: false,
    }

    const out = convertSlate({
      node: { text: '2 & 1 < 3 > 0', code: true },
      config,
    }) as unknown as Document

    const pre = out.children[0] as Element
    const code = pre.children[0] as Element
    const text = code.children[0] as Text

    // We assert on Text.data (DOM content), not on the serialized HTML string, to avoid
    // double-encoding artifacts when serializing already-escaped entities.
    expect(text.data).toEqual('2 &amp; 1 &lt; 3 &gt; 0')
  })

  it('markTransforms can override markMap tag behavior', () => {
    const config: Config = {
      markMap: {
        bold: ['strong'],
      },
      markTransforms: {
        // Override the default <strong> element creation.
        strong: () => new Element('b', {}, []),
        // Add a custom mark driven by a Slate leaf prop.
        fontSize: ({ node }) =>
          node ? new Element('span', { style: `font-size:${(node as any).fontSize};` }, []) : undefined,
      },
      elementMap: {},
      elementTransforms: {},
      convertLineBreakToBr: false,
    }

    const out = convertSlate({
      node: { text: 't', bold: true, fontSize: '12px' },
      config,
    })

    // markTransforms (matching Slate props) are applied first, then markMap tags (which can be
    // overridden by markTransforms[tagName]).
    expect(html(out)).toEqual('<span style="font-size:12px;"><b>t</b></span>')
  })

  it('markTransforms can override only one tag in a multi-tag markMap entry', () => {
    const config: Config = {
      markMap: {
        codeMark: ['pre', 'code'],
      },
      markTransforms: {
        // Override only the inner <code> tag.
        code: () => new Element('kbd', {}, []),
      },
      elementMap: {},
      elementTransforms: {},
      convertLineBreakToBr: false,
    }

    const out = convertSlate({
      node: { text: 'x', codeMark: true },
      config,
    })

    expect(html(out)).toEqual('<pre><kbd>x</kbd></pre>')
  })

  it('does not emit attributes when elementAttributeTransform returns empty or undefined', () => {
    const base: Omit<Config, 'elementAttributeTransform'> = {
      markMap: {},
      elementMap: { p: 'p' },
      elementTransforms: {},
    }

    const outUndefined = convertSlate({
      node: { type: 'p', children: [{ text: 'x' }] },
      config: {
        ...base,
        elementAttributeTransform: () => undefined,
      },
    })
    expect(html(outUndefined)).toEqual('<p>x</p>')

    const outEmpty = convertSlate({
      node: { type: 'p', children: [{ text: 'x' }] },
      config: {
        ...base,
        elementAttributeTransform: () => ({}),
      },
    })
    expect(html(outEmpty)).toEqual('<p>x</p>')
  })

  it('markTransforms can be applied both by Slate prop keys and by markMap tagName overrides', () => {
    const config: Config = {
      markMap: {
        // A mark that uses a tagName that also has a transform.
        code: ['pre', 'code'],
      },
      markTransforms: {
        // Applied because Slate leaf has `code: true` (markTransformKeys).
        code: () => new Element('kbd', {}, []),
      },
      elementMap: {},
      elementTransforms: {},
      convertLineBreakToBr: false,
    }

    const out = convertSlate({
      node: { text: 'x', code: true },
      config,
    })

    // `code` is applied twice:
    // - once because the Slate leaf has `code: true` (markTransforms.code)
    // - once because markMap includes tagName `code`, and markTransforms['code'] overrides tag creation
    expect(html(out)).toEqual('<kbd><pre><kbd>x</kbd></pre></kbd>')
  })

  it('elementAttributeTransform attribs are passed into elementTransforms and can be overridden by the transform result', () => {
    const config: Config = {
      markMap: {},
      elementMap: {
        p: 'p',
      },
      elementAttributeTransform: ({ node }: { node: any }) => {
        return node.id ? { 'data-id': String(node.id), class: 'from-attribute-transform' } : undefined
      },
      elementTransforms: {
        p: ({ attribs, children = [] }) => {
          // ElementTransform receives attribs with elementAttributeTransform already applied.
          return new Element(
            'p',
            {
              ...attribs,
              // Override one attr
              class: 'from-element-transform',
            },
            children,
          )
        },
      },
    }

    const out = convertSlate({
      node: { type: 'p', id: 1, children: [{ text: 'x' }] },
      config,
    })

    expect(html(out)).toEqual('<p data-id="1" class="from-element-transform">x</p>')
  })

  it('customElementTransforms receive attribs and can override elementTransforms and elementMap', () => {
    const config: Config = {
      markMap: {},
      elementMap: {
        p: 'p',
      },
      elementAttributeTransform: () => ({ class: 'from-attribute-transform' }),
      elementTransforms: {
        p: ({ attribs, children = [] }) => new Element('p', { ...attribs, class: 'from-element-transform' }, children),
      },
    }

    const out = convertSlate({
      node: { type: 'p', children: [{ text: 'x' }] },
      config,
      customElementTransforms: {
        p: ({ attribs, children = [] }: { attribs: any; children?: any[] }) =>
          new Element('p', { ...attribs, class: 'from-custom-transform' }, children),
      },
    })

    expect(html(out)).toEqual('<p class="from-custom-transform">x</p>')
  })

  it('falls back to elementMap when elementTransforms returns undefined', () => {
    const config: Config = {
      markMap: {},
      elementMap: {
        p: 'p',
      },
      elementTransforms: {
        p: () => undefined,
      },
    }

    const out = convertSlate({
      node: { type: 'p', children: [{ text: 'x' }] },
      config,
    })

    expect(html(out)).toEqual('<p>x</p>')
  })

  it('falls back to defaultTag when no type and no mapping exists', () => {
    const config: Config = {
      markMap: {},
      elementMap: {},
      elementTransforms: {},
      defaultTag: 'div',
    }

    const out = convertSlate({
      node: { children: [{ text: 'x' }] },
      config,
    })

    expect(html(out)).toEqual('<div>x</div>')
  })
})

