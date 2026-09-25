import { htmlToSlate } from '.'
import { config as htmlToSlateConfig } from './config/default'
import { config as payloadConfig } from './config/payload'

describe('htmlToSlate top-level wrapper elements', () => {
  it('moves block-level children of an unmapped <div> to the top level', () => {
    expect(htmlToSlate('<div><p>a</p><p>b</p></div>')).toEqual([
      { type: 'p', children: [{ text: 'a' }] },
      { type: 'p', children: [{ text: 'b' }] },
    ])
  })

  it('moves block-level children of nested unmapped elements to the top level', () => {
    expect(htmlToSlate('<article><section><h1>t</h1><p>a</p></section></article><p>b</p>')).toEqual([
      { type: 'h1', children: [{ text: 't' }] },
      { type: 'p', children: [{ text: 'a' }] },
      { type: 'p', children: [{ text: 'b' }] },
    ])
  })

  it('moves block-level children of a mark element to the top level and keeps the mark on the text', () => {
    expect(htmlToSlate('<strong><p>a</p><p>b</p></strong>')).toEqual([
      { type: 'p', children: [{ text: 'a', bold: true }] },
      { type: 'p', children: [{ text: 'b', bold: true }] },
    ])
  })

  it('ignores <head> content in a full HTML document', () => {
    const html =
      '<html><head><meta charset="utf-8"><title>Doc title</title><style>p { color: red }</style></head>' +
      '<body><!--StartFragment--><p>a</p><p>b</p><!--EndFragment--></body></html>'
    expect(htmlToSlate(html)).toEqual([
      { type: 'p', children: [{ text: 'a' }] },
      { type: 'p', children: [{ text: 'b' }] },
    ])
  })

  it('ignores whitespace between wrapped blocks', () => {
    expect(htmlToSlate('<div>\n  <p>a</p>\n  <p>b</p>\n</div>')).toEqual([
      { type: 'p', children: [{ text: 'a' }] },
      { type: 'p', children: [{ text: 'b' }] },
    ])
  })

  it('still wraps inline-only content in a default block', () => {
    expect(htmlToSlate('<div>plain <strong>text</strong></div>')).toEqual([
      { children: [{ text: 'plain ' }, { text: 'text', bold: true }] },
    ])
  })

  it('moves block-level children when an unmapped element beside them produces no content', () => {
    expect(htmlToSlate('<div><img src="a.png"><p>a</p><span></span><script>x()</script><!-- c --></div>')).toEqual([
      { type: 'p', children: [{ text: 'a' }] },
    ])
  })

  it('does not lift when a mapped element beside the blocks is not a block', () => {
    const config = {
      ...htmlToSlateConfig,
      elementTags: {
        ...htmlToSlateConfig.elementTags,
        img: () => ({ type: 'image' }),
      },
    }
    expect(htmlToSlate('<div><img src="a.png"><p>a</p></div>', config)).toEqual([
      {
        children: [
          { type: 'image', children: [{ text: '' }] },
          { type: 'p', children: [{ text: 'a' }] },
        ],
      },
    ])
  })

  it('keeps a wrapped link inside a block', () => {
    expect(htmlToSlate('<div><a href="/x">x</a></div>')).toEqual([
      {
        children: [{ type: 'link', newTab: false, url: '/x', children: [{ text: 'x' }] }],
      },
    ])
  })

  it('keeps several wrapped links inside one block', () => {
    expect(htmlToSlate('<b><a href="/x">x</a> <a href="/y">y</a></b>')).toEqual([
      {
        children: [
          {
            type: 'link',
            newTab: false,
            url: '/x',
            children: [{ text: 'x', bold: true }],
          },
          { text: ' ', bold: true },
          {
            type: 'link',
            newTab: false,
            url: '/y',
            children: [{ text: 'y', bold: true }],
          },
        ],
      },
    ])
  })

  it('does not lift when a link sits beside a block', () => {
    expect(htmlToSlate('<div><p>a</p><a href="/x">x</a></div>')).toEqual([
      {
        children: [
          { type: 'p', children: [{ text: 'a' }] },
          { type: 'link', newTab: false, url: '/x', children: [{ text: 'x' }] },
        ],
      },
    ])
  })

  it('lifts when liftWrappedBlocks is not set on a custom config', () => {
    const config = { ...htmlToSlateConfig }
    delete config.liftWrappedBlocks
    expect(htmlToSlate('<div><p>a</p></div>', config)).toEqual([{ type: 'p', children: [{ text: 'a' }] }])
  })

  it('keeps mixed text and block content in one block', () => {
    expect(htmlToSlate('<div>x<p>a</p></div>')).toEqual([
      { children: [{ text: 'x' }, { type: 'p', children: [{ text: 'a' }] }] },
    ])
  })
})

describe('htmlToSlate with liftWrappedBlocks: false', () => {
  const p = (text: string, marks = {}) => ({
    type: 'p',
    children: [{ text, ...marks }],
  })

  const cases: [string, string, unknown[]][] = [
    ['an unmapped <div>', '<div><p>a</p><p>b</p></div>', [{ children: [p('a'), p('b')] }]],
    [
      'nested wrappers',
      '<article><section><h1>t</h1><p>a</p></section></article><p>b</p>',
      [{ children: [{ type: 'h1', children: [{ text: 't' }] }, p('a')] }, p('b')],
    ],
    [
      'a mark wrapper',
      '<strong><p>a</p><p>b</p></strong>',
      [{ children: [p('a', { bold: true }), p('b', { bold: true })] }],
    ],
    [
      'a <body> with comments',
      '<body><!--StartFragment--><p>a</p><p>b</p><!--EndFragment--></body>',
      [{ children: [p('a'), p('b')] }],
    ],
    ['whitespace between blocks', '<div>\n  <p>a</p>\n  <p>b</p>\n</div>', [{ children: [p('a'), p('b')] }]],
    [
      'unmapped elements that produce no content',
      '<div><img src="a.png"><p>a</p><span></span><script>x()</script><!-- c --></div>',
      [{ children: [p('a')] }],
    ],
    [
      'lists and blockquotes',
      '<section><ul><li>a</li></ul><blockquote>q</blockquote></section>',
      [
        {
          children: [
            {
              type: 'ul',
              children: [{ type: 'li', children: [{ text: 'a' }] }],
            },
            { type: 'blockquote', children: [{ text: 'q' }] },
          ],
        },
      ],
    ],
  ]

  describe.each([
    ['default config', htmlToSlateConfig],
    ['Payload config', payloadConfig],
  ])('%s', (_name, baseConfig) => {
    const config = { ...baseConfig, liftWrappedBlocks: false }

    it.each(cases)('keeps block-level children nested inside %s', (_case, html, expected) => {
      expect(htmlToSlate(html, config)).toEqual(expected)
    })
  })

  it('still ignores <head> content in a full HTML document', () => {
    const html = '<html><head><title>Doc title</title></head><body><p>a</p></body></html>'
    expect(htmlToSlate(html, { ...htmlToSlateConfig, liftWrappedBlocks: false })).toEqual([{ children: [p('a')] }])
  })

  it('leaves content that is never lifted unchanged', () => {
    const config = { ...htmlToSlateConfig, liftWrappedBlocks: false }
    for (const html of [
      '<div>plain <strong>text</strong></div>',
      '<div><a href="/x">x</a></div>',
      '<div>x<p>a</p></div>',
      '<p>a</p><p>b</p>',
    ]) {
      expect(htmlToSlate(html, config)).toEqual(htmlToSlate(html))
    }
  })
})
