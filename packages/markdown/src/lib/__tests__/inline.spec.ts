import { slateToMarkdown } from '../serializers'
import { config as defaultConfig } from '../config/default'
import { render } from './render'

const p = (...children: object[]) => [{ type: 'p', children }]

describe('marks', () => {
  it.each([
    ['bold', { bold: true }, '**a**', '<p><strong>a</strong></p>'],
    ['italic', { italic: true }, '*a*', '<p><em>a</em></p>'],
    ['strikethrough', { strikethrough: true }, '~~a~~', '<p><s>a</s></p>'],
    ['code', { code: true }, '`a`', '<p><code>a</code></p>'],
    ['underline (HTML)', { underline: true }, '<u>a</u>', '<p><u>a</u></p>'],
    ['subscript (HTML)', { subscript: true }, '<sub>a</sub>', '<p><sub>a</sub></p>'],
    ['superscript (HTML)', { superscript: true }, '<sup>a</sup>', '<p><sup>a</sup></p>'],
  ])('%s', (_name, marks, markdown, html) => {
    const output = slateToMarkdown(p({ text: 'a', ...marks }))
    expect(output).toBe(markdown)
    expect(render(output)).toBe(html)
  })

  it('nests marks on one leaf', () => {
    const output = slateToMarkdown(p({ text: 'a', bold: true, italic: true, strikethrough: true }))
    expect(output).toBe('***~~a~~***')
    expect(render(output)).toBe('<p><em><strong><s>a</s></strong></em></p>')
  })

  it('keeps a mark open across adjacent leaves', () => {
    const output = slateToMarkdown(p({ text: 'a ', bold: true }, { text: 'b', bold: true, italic: true }, { text: ' c', bold: true }))
    expect(output).toBe('**a *b* c**')
    expect(render(output)).toBe('<p><strong>a <em>b</em> c</strong></p>')
  })

  it('closes and reopens marks to keep them nested', () => {
    const output = slateToMarkdown(p({ text: 'a', bold: true, italic: true }, { text: 'b', italic: true }))
    expect(render(output)).toBe('<p><em><strong>a</strong></em><em>b</em></p>')
  })

  it('handles bold followed directly by italic', () => {
    const output = slateToMarkdown(p({ text: 'a', bold: true }, { text: 'b', italic: true }))
    expect(output).toBe('**a***b*')
    expect(render(output)).toBe('<p><strong>a</strong><em>b</em></p>')
  })

  it('handles italic followed directly by bold', () => {
    const output = slateToMarkdown(p({ text: 'a', italic: true }, { text: 'b', bold: true }))
    expect(render(output)).toBe('<p><em>a</em><strong>b</strong></p>')
  })

  it('supports emphasis inside a word', () => {
    const output = slateToMarkdown(p({ text: 'un' }, { text: 'frigging', italic: true }, { text: 'believable' }))
    expect(render(output)).toBe('<p>un<em>frigging</em>believable</p>')
  })

  it('moves whitespace outside delimiters', () => {
    const output = slateToMarkdown(p({ text: 'a' }, { text: ' b ', bold: true }, { text: 'c' }))
    expect(output).toBe('a **b** c')
    expect(render(output)).toBe('<p>a <strong>b</strong> c</p>')
  })

  it('does not emit empty delimiters for whitespace-only leaves', () => {
    const output = slateToMarkdown(p({ text: 'a' }, { text: '  ', bold: true }, { text: 'b' }))
    expect(output).toBe('a  b')
  })

  it('keeps a mark open across a whitespace-only leaf', () => {
    const output = slateToMarkdown(p({ text: 'a', bold: true }, { text: ' ' }, { text: 'b', bold: true }))
    expect(output).toBe('**a b**')
  })

  it('applies other marks around code', () => {
    const output = slateToMarkdown(p({ text: 'x', bold: true, code: true }))
    expect(output).toBe('**`x`**')
    expect(render(output)).toBe('<p><strong><code>x</code></strong></p>')
  })

  it('does not escape code', () => {
    const output = slateToMarkdown(p({ text: 'a*b_c<d>', code: true }))
    expect(render(output)).toBe('<p><code>a*b_c&lt;d&gt;</code></p>')
  })

  it('uses a longer fence when code contains backticks', () => {
    const output = slateToMarkdown(p({ text: 'a`b', code: true }))
    expect(output).toBe('``a`b``')
    expect(render(output)).toBe('<p><code>a`b</code></p>')
  })

  it('pads code that starts with a backtick', () => {
    const output = slateToMarkdown(p({ text: '`a', code: true }))
    expect(render(output)).toBe('<p><code>`a</code></p>')
  })

  it('uses _ for emphasis when configured', () => {
    const output = slateToMarkdown(p({ text: 'a', italic: true }), {
      ...defaultConfig,
      emphasisDelimiter: '_',
    })
    expect(output).toBe('_a_')
  })
})

describe('escaping', () => {
  it.each([
    ['emphasis characters', '*a* _b_', '<p>*a* _b_</p>'],
    ['strong', '**a**', '<p>**a**</p>'],
    ['strikethrough', '~~a~~', '<p>~~a~~</p>'],
    ['code', '`a`', '<p>`a`</p>'],
    ['links', '[a](b)', '<p>[a](b)</p>'],
    ['images', '![a](b)', '<p>![a](b)</p>'],
    ['HTML', '<div>a</div>', '<p>&lt;div&gt;a&lt;/div&gt;</p>'],
    ['autolinks', '<https://example.com>', '<p>&lt;https://example.com&gt;</p>'],
    ['entities', '&amp; &#35;', '<p>&amp;amp; &amp;#35;</p>'],
    ['backslashes', 'a\\*b', '<p>a\\*b</p>'],
    ['a heading', '# a', '<p># a</p>'],
    ['a block quote', '> a', '<p>&gt; a</p>'],
    ['a bullet list', '- a', '<p>- a</p>'],
    ['a plus list', '+ a', '<p>+ a</p>'],
    ['an ordered list', '1. a', '<p>1. a</p>'],
    ['an ordered list with a parenthesis', '1) a', '<p>1) a</p>'],
    ['a thematic break', '---', '<p>---</p>'],
    ['indented code', '    a', '<p>a</p>'],
  ])('%s', (_name, text, html) => {
    expect(render(slateToMarkdown(p({ text })))).toBe(html)
  })

  it('escapes line-start syntax after a line break', () => {
    const output = slateToMarkdown(p({ text: 'a\n# b\n- c' }))
    expect(render(output)).toBe('<p>a<br># b<br>- c</p>')
  })

  it('leaves text alone when escape is false', () => {
    const output = slateToMarkdown(p({ text: '*a* # b' }), { ...defaultConfig, escape: false })
    expect(output).toBe('*a* # b')
  })
})

describe('line breaks', () => {
  it('converts \\n to a hard break', () => {
    const output = slateToMarkdown(p({ text: 'a\nb' }))
    expect(output).toBe('a\\\nb')
    expect(render(output)).toBe('<p>a<br>b</p>')
  })

  it('keeps a hard break inside a mark valid', () => {
    const output = slateToMarkdown(p({ text: 'a\n', bold: true }, { text: 'b' }))
    expect(render(output)).toBe('<p><strong>a</strong><br>b</p>')
  })

  it('drops line breaks at the start and end of a paragraph', () => {
    expect(slateToMarkdown(p({ text: '\na\n' }))).toBe('a')
  })

  it('maps a br element to a hard break', () => {
    const output = slateToMarkdown(p({ text: 'a' }, { type: 'br', children: [{ text: '' }] }, { text: 'b' }))
    expect(render(output)).toBe('<p>a<br>b</p>')
  })
})

describe('links and images', () => {
  it('serializes a link with marks', () => {
    const output = slateToMarkdown(
      p({ text: 'see ' }, { type: 'link', url: 'https://example.com', children: [{ text: 'here', bold: true }] }),
    )
    expect(output).toBe('see [**here**](https://example.com)')
    expect(render(output)).toBe('<p>see <a href="https://example.com"><strong>here</strong></a></p>')
  })

  it('wraps URLs with spaces or parentheses in angle brackets', () => {
    const output = slateToMarkdown(p({ type: 'link', url: 'https://example.com/a b(c)', children: [{ text: 'x' }] }))
    expect(output).toBe('[x](<https://example.com/a b(c)>)')
    expect(render(output)).toBe('<p><a href="https://example.com/a%20b(c)">x</a></p>')
  })

  it('uses the URL as text for an empty link', () => {
    const output = slateToMarkdown(p({ type: 'link', url: 'https://example.com', children: [{ text: '' }] }))
    expect(render(output)).toBe('<p><a href="https://example.com">https://example.com</a></p>')
  })

  it('outputs only the text of a link without a URL', () => {
    expect(slateToMarkdown(p({ type: 'link', children: [{ text: 'x' }] }))).toBe('x')
  })

  it('closes marks around a link', () => {
    const output = slateToMarkdown(
      p({ text: 'a ', bold: true }, { type: 'link', url: '/x', children: [{ text: 'b' }] }, { text: ' c', bold: true }),
    )
    expect(render(output)).toBe('<p><strong>a</strong> <a href="/x">b</a> <strong>c</strong></p>')
  })

  it('serializes a top-level image', () => {
    const output = slateToMarkdown([{ type: 'image', url: '/a.png', alt: 'An [image]', children: [{ text: '' }] }])
    expect(output).toBe('![An \\[image\\]](/a.png)')
    expect(render(output)).toBe('<p><img src="/a.png" alt="An [image]"></p>')
  })
})
