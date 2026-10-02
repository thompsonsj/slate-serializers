import { slateToMarkdown } from '../serializers'
import { config as defaultConfig } from '../config/default'
import { config as payloadConfig } from '../config/payload'
import { Config } from '../config/types'
import { render } from './render'

describe('elementTransforms', () => {
  it('replaces the output for a block type', () => {
    const config: Config = {
      ...defaultConfig,
      elementTransforms: { callout: ({ node, children }) => `> **${node.kind}:** ${children}` },
    }
    const output = slateToMarkdown([{ type: 'callout', kind: 'Note', children: [{ text: 'Read this' }] }], config)
    expect(output).toBe('> **Note:** Read this')
  })

  it('passes block children already serialized', () => {
    const config: Config = {
      ...defaultConfig,
      elementTransforms: { details: ({ children }) => `<details>\n\n${children}\n\n</details>` },
    }
    const output = slateToMarkdown([{ type: 'details', children: [{ type: 'p', children: [{ text: 'a' }] }, { type: 'ul', children: [{ type: 'li', children: [{ text: 'b' }] }] }] }], config)
    expect(output).toBe('<details>\n\na\n\n- b\n\n</details>')
  })

  it('replaces the output for an inline type', () => {
    const config: Config = {
      ...defaultConfig,
      elementTransforms: { mention: ({ node }) => `@${node.username}` },
    }
    const output = slateToMarkdown([{ type: 'p', children: [{ text: 'hi ' }, { type: 'mention', username: 'sam', children: [{ text: '' }] }] }], config)
    expect(output).toBe('hi @sam')
  })

  it('falls back to elementMap when a transform returns undefined', () => {
    const config: Config = {
      ...defaultConfig,
      elementTransforms: { link: ({ node }) => (node.internal ? `[[${node.url}]]` : undefined) },
    }
    const output = slateToMarkdown(
      [{ type: 'p', children: [{ type: 'link', internal: true, url: 'Home', children: [{ text: 'x' }] }, { text: ' ' }, { type: 'link', url: '/y', children: [{ text: 'y' }] }] }],
      config,
    )
    expect(output).toBe('[[Home]] [y](/y)')
  })

  it('serializes children once when a transform reads them and then falls back', () => {
    let serializations = 0
    const config: Config = {
      ...defaultConfig,
      elementTransforms: {
        counted: () => {
          serializations++
          return 'x'
        },
        blockquote: ({ children }) => (children ? undefined : undefined),
      },
    }
    expect(
      slateToMarkdown(
        [{ type: 'blockquote', children: [{ type: 'p', children: [{ type: 'counted', children: [{ text: '' }] }] }] }],
        config,
      ),
    ).toBe('> x')
    expect(serializations).toBe(1)
  })

  it('does not serialize children for a transform that does not read them', () => {
    let serializations = 0
    const config: Config = {
      ...defaultConfig,
      elementTransforms: {
        counted: () => {
          serializations++
          return ''
        },
        skip: () => undefined,
      },
    }
    // The fallback serializes the children once; the transform never asked for them.
    slateToMarkdown([{ type: 'skip', children: [{ type: 'p', children: [{ type: 'counted', children: [{ text: '' }] }] }] }], config)
    expect(serializations).toBe(1)
  })

  it('can transform list items', () => {
    const config: Config = { ...defaultConfig, elementTransforms: { li: ({ children }) => children.toUpperCase() } }
    expect(slateToMarkdown([{ type: 'ul', children: [{ type: 'li', children: [{ text: 'a' }] }] }], config)).toBe('- A')
  })
})

describe('elementMap and markMap', () => {
  it('maps a custom element type', () => {
    const config: Config = { ...defaultConfig, elementMap: { ...defaultConfig.elementMap, title: 'h1' } }
    expect(slateToMarkdown([{ type: 'title', children: [{ text: 'a' }] }], config)).toBe('# a')
  })

  it('maps a custom mark to a pair of strings', () => {
    const config: Config = { ...defaultConfig, markMap: { ...defaultConfig.markMap, highlight: { open: '<mark>', close: '</mark>' } } }
    const output = slateToMarkdown([{ type: 'p', children: [{ text: 'a', highlight: true }] }], config)
    expect(render(output)).toBe('<p><mark>a</mark></p>')
  })

  it('ignores marks that are not mapped', () => {
    expect(slateToMarkdown([{ type: 'p', children: [{ text: 'a', glow: true }] }])).toBe('a')
  })
})

describe('Payload config', () => {
  it('serializes image uploads', () => {
    const output = slateToMarkdown(
      [{ type: 'upload', value: { url: '/media/a.png', mimeType: 'image/png', filename: 'a.png' }, children: [{ text: '' }] }],
      payloadConfig,
    )
    expect(output).toBe('![a.png](/media/a.png)')
  })

  it('serializes other uploads as links', () => {
    const output = slateToMarkdown(
      [{ type: 'upload', value: { url: '/media/a_b.pdf', mimeType: 'application/pdf', filename: 'a_b.pdf' }, children: [{ text: '' }] }],
      payloadConfig,
    )
    expect(output).toBe('[a\\_b.pdf](/media/a_b.pdf)')
    expect(render(output)).toBe('<p><a href="/media/a_b.pdf">a_b.pdf</a></p>')
  })

  it('falls back when an upload has no URL', () => {
    expect(slateToMarkdown([{ type: 'upload', children: [{ text: '' }] }], payloadConfig)).toBe('')
    expect(slateToMarkdown([{ type: 'upload', value: {}, children: [{ text: '' }] }], payloadConfig)).toBe('')
  })

  it('uses alt text for image uploads and treats a missing mime type as a file', () => {
    expect(
      slateToMarkdown(
        [{ type: 'upload', value: { url: '/hero.png', mimeType: 'image/jpeg', alt: 'Hero' }, children: [{ text: '' }] }],
        payloadConfig,
      ),
    ).toBe('![Hero](/hero.png)')
    expect(
      slateToMarkdown(
        [{ type: 'upload', value: { url: '/a.bin', filename: 'a.bin' }, children: [{ text: '' }] }],
        payloadConfig,
      ),
    ).toBe('[a.bin](/a.bin)')
    expect(
      slateToMarkdown([{ type: 'upload', value: { url: '/a.bin' }, children: [{ text: '' }] }], payloadConfig),
    ).toBe('[/a.bin](/a.bin)')
  })

  it('serializes a typical Payload document', () => {
    const output = slateToMarkdown(
      [
        { type: 'h2', children: [{ text: 'Heading' }] },
        {
          children: [
            { text: 'Paragraph with a ' },
            { type: 'link', linkType: 'custom', url: 'https://payloadcms.com', newTab: true, children: [{ text: 'link' }] },
            { text: ' and ' },
            { text: 'bold', bold: true },
            { text: ' text.' },
          ],
        },
        { type: 'ol', children: [{ type: 'li', children: [{ text: 'One' }] }, { type: 'li', children: [{ text: 'Two' }] }] },
        { type: 'blockquote', children: [{ text: 'Quote' }] },
      ],
      payloadConfig,
    )
    expect(output).toBe(
      '## Heading\n\nParagraph with a [link](https://payloadcms.com) and **bold** text.\n\n1. One\n2. Two\n\n> Quote',
    )
  })
})
