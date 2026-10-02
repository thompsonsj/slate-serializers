import { slateToMarkdown } from '../serializers'
import { config as defaultConfig } from '../config/default'
import { render } from './render'

const text = (value: string) => ({ text: value })
const p = (value: string) => ({ type: 'p', children: [text(value)] })
const li = (...children: object[]) => ({ type: 'li', children })

describe('paragraphs and headings', () => {
  it('separates blocks with a blank line', () => {
    const output = slateToMarkdown([p('a'), p('b')])
    expect(output).toBe('a\n\nb')
    expect(render(output)).toBe('<p>a</p><p>b</p>')
  })

  it('drops empty paragraphs', () => {
    expect(slateToMarkdown([p('a'), p(''), p('b')])).toBe('a\n\nb')
  })

  it.each([1, 2, 3, 4, 5, 6])('serializes h%i', (level) => {
    const output = slateToMarkdown([{ type: `h${level}`, children: [text('Title')] }])
    expect(output).toBe(`${'#'.repeat(level)} Title`)
    expect(render(output)).toBe(`<h${level}>Title</h${level}>`)
  })

  it('maps slate example heading names', () => {
    expect(slateToMarkdown([{ type: 'heading-two', children: [text('Title')] }])).toBe('## Title')
  })

  it('replaces line breaks in headings with spaces', () => {
    expect(slateToMarkdown([{ type: 'h1', children: [text('a\nb')] }])).toBe('# a b')
  })

  it('drops an empty heading', () => {
    expect(slateToMarkdown([{ type: 'h1', children: [{ text: '' }] }])).toBe('')
  })

  it('escapes a trailing # so it is not read as a closing sequence', () => {
    const output = slateToMarkdown([{ type: 'h1', children: [text('Issue #')] }])
    expect(render(output)).toBe('<h1>Issue #</h1>')
  })

  it('keeps # inside words in headings', () => {
    expect(render(slateToMarkdown([{ type: 'h2', children: [text('C#')] }]))).toBe('<h2>C#</h2>')
  })

  it('treats top-level text as a paragraph', () => {
    expect(slateToMarkdown([text('a')])).toBe('a')
  })

  it('accepts a single node', () => {
    expect(slateToMarkdown(p('a'))).toBe('a')
  })

  it('returns an empty string for missing input and skips null children', () => {
    expect(slateToMarkdown(undefined)).toBe('')
    expect(slateToMarkdown([null, p('a'), { type: 'p', children: [null, text('b')] }])).toBe('a\n\nb')
  })
})

describe('block quotes', () => {
  it('prefixes every line', () => {
    const output = slateToMarkdown([{ type: 'blockquote', children: [p('a'), p('b')] }])
    expect(output).toBe('> a\n>\n> b')
    expect(render(output)).toBe('<blockquote><p>a</p><p>b</p></blockquote>')
  })

  it('wraps inline children in a paragraph', () => {
    expect(render(slateToMarkdown([{ type: 'quote', children: [text('a')] }]))).toBe('<blockquote><p>a</p></blockquote>')
  })

  it('drops an empty block quote', () => {
    expect(slateToMarkdown([{ type: 'blockquote', children: [] }])).toBe('')
  })

  it('nests block quotes and lists', () => {
    const output = slateToMarkdown([
      { type: 'blockquote', children: [{ type: 'blockquote', children: [p('a')] }, { type: 'ul', children: [li(text('b'))] }] },
    ])
    expect(render(output)).toBe('<blockquote><blockquote><p>a</p></blockquote><ul><li>b</li></ul></blockquote>')
  })
})

describe('lists', () => {
  it('serializes a bullet list', () => {
    const output = slateToMarkdown([{ type: 'ul', children: [li(text('a')), li(text('b'))] }])
    expect(output).toBe('- a\n- b')
    expect(render(output)).toBe('<ul><li>a</li><li>b</li></ul>')
  })

  it('serializes an ordered list, honouring start', () => {
    const output = slateToMarkdown([{ type: 'ol', start: 3, children: [li(text('a')), li(text('b'))] }])
    expect(output).toBe('3. a\n4. b')
    expect(render(output)).toBe('<ol start="3"><li>a</li><li>b</li></ol>')
  })

  it('nests a list inside an item', () => {
    const output = slateToMarkdown([
      { type: 'ul', children: [li(text('a'), { type: 'ol', children: [li(text('b')), li(text('c'))] }), li(text('d'))] },
    ])
    expect(output).toBe('- a\n  1. b\n  2. c\n- d')
    expect(render(output)).toBe('<ul><li>a\n<ol><li>b</li><li>c</li></ol></li><li>d</li></ul>')
  })

  it('nests a list placed directly inside a list under the previous item', () => {
    const output = slateToMarkdown([
      { type: 'ol', children: [li(text('a')), { type: 'ul', children: [li(text('b'))] }, li(text('c'))] },
    ])
    expect(output).toBe('1. a\n   - b\n2. c')
    expect(render(output)).toBe('<ol><li>a\n<ul><li>b</li></ul></li><li>c</li></ol>')
  })

  it('indents paragraphs inside items', () => {
    const output = slateToMarkdown([{ type: 'ul', children: [li(p('a'), p('b'))] }])
    expect(output).toBe('- a\n\n  b')
    expect(render(output)).toBe('<ul><li><p>a</p><p>b</p></li></ul>')
  })

  it('keeps adjacent lists of the same kind separate', () => {
    const output = slateToMarkdown([
      { type: 'ul', children: [li(text('a'))] },
      { type: 'ul', children: [li(text('b'))] },
    ])
    expect(render(output)).toBe('<ul><li>a</li></ul><!-- --><ul><li>b</li></ul>')
  })

  it('uses the configured bullet marker', () => {
    const output = slateToMarkdown([{ type: 'ul', children: [li(text('a'))] }], {
      ...defaultConfig,
      bulletMarker: '*',
    })
    expect(output).toBe('* a')
  })

  it('uses the default bullet marker when the config omits it', () => {
    const config = { ...defaultConfig }
    delete config.bulletMarker
    expect(slateToMarkdown([{ type: 'ul', children: [li(text('a'))] }], config)).toBe('- a')
  })

  it('keeps text and skips empty children inside a list', () => {
    expect(slateToMarkdown([{ type: 'ul', children: [null, text('a'), { type: 'p', children: [text('b')] }] }])).toBe(
      '- a\n- b',
    )
  })

  it('serializes an empty list item as a marker', () => {
    expect(slateToMarkdown([{ type: 'ul', children: [li(text(''))] }])).toBe('-')
  })

  it('maps slate example list names', () => {
    const output = slateToMarkdown([
      { type: 'numbered-list', children: [{ type: 'list-item', children: [text('a')] }] },
      { type: 'bulleted-list', children: [{ type: 'list-item', children: [text('b')] }] },
    ])
    expect(render(output)).toBe('<ol><li>a</li></ol><ul><li>b</li></ul>')
  })
})

describe('task lists', () => {
  it('serializes consecutive check-list items as one list', () => {
    const output = slateToMarkdown([
      { type: 'check-list-item', checked: true, children: [text('done')] },
      { type: 'check-list-item', checked: false, children: [text('todo')] },
    ])
    expect(output).toBe('- [x] done\n- [ ] todo')
    expect(render(output)).toBe('<ul><li>[x] done</li><li>[ ] todo</li></ul>')
  })

  it('serializes list items with a checked property', () => {
    const output = slateToMarkdown([{ type: 'ul', children: [{ type: 'li', checked: true, children: [text('a')] }, li(text('b'))] }])
    expect(output).toBe('- [x] a\n- b')
  })

  it('keeps a task list separate from a bullet list before it', () => {
    const output = slateToMarkdown([
      { type: 'ul', children: [li(text('a'))] },
      { type: 'check-list-item', checked: false, children: [text('b')] },
    ])
    expect(render(output)).toBe('<ul><li>a</li></ul><!-- --><ul><li>[ ] b</li></ul>')
  })
})

describe('code blocks and thematic breaks', () => {
  it('serializes code lines with a language', () => {
    const output = slateToMarkdown([
      {
        type: 'code-block',
        language: 'ts',
        children: [
          { type: 'code-line', children: [text('const a = 1 * 2')] },
          { type: 'code-line', children: [text('<b>')] },
        ],
      },
    ])
    expect(output).toBe('```ts\nconst a = 1 * 2\n<b>\n```')
    expect(render(output)).toBe('<pre><code class="language-ts">const a = 1 * 2\n&lt;b&gt;\n</code></pre>')
  })

  it('serializes a code block with text children', () => {
    expect(slateToMarkdown([{ type: 'code-block', children: [text('a\nb')] }])).toBe('```\na\nb\n```')
  })

  it('reads lang and strips backticks and line breaks from the info string', () => {
    const output = slateToMarkdown([{ type: 'code-block', lang: 'ts\n```\nhtml', children: [text('a')] }])
    expect(output).toBe('```ts\na\n```')
    expect(render(output)).toBe('<pre><code class="language-ts">a\n</code></pre>')
  })

  it('uses a longer fence when the code contains a fence', () => {
    const output = slateToMarkdown([{ type: 'code-block', children: [text('```\nx\n```')] }])
    expect(render(output)).toBe('<pre><code>```\nx\n```\n</code></pre>')
  })

  it('serializes a thematic break', () => {
    const output = slateToMarkdown([p('a'), { type: 'hr', children: [text('')] }, p('b')])
    expect(output).toBe('a\n\n---\n\nb')
    expect(render(output)).toBe('<p>a</p><hr><p>b</p>')
  })
})

describe('tables', () => {
  const cell = (type: string, value: string, extra = {}) => ({ type, ...extra, children: [text(value)] })

  it('uses the first row as the header', () => {
    const output = slateToMarkdown([
      {
        type: 'table',
        children: [
          { type: 'tr', children: [cell('th', 'Name'), cell('th', 'Qty')] },
          { type: 'tr', children: [cell('td', 'a'), cell('td', '1')] },
        ],
      },
    ])
    expect(output).toBe('| Name | Qty |\n| --- | --- |\n| a | 1 |')
    expect(render(output)).toBe(
      '<table><thead><tr><th>Name</th><th>Qty</th></tr></thead><tbody><tr><td>a</td><td>1</td></tr></tbody></table>',
    )
  })

  it('reads rows from thead and tbody, and column alignment from the first row', () => {
    const output = slateToMarkdown([
      {
        type: 'table',
        children: [
          { type: 'thead', children: [{ type: 'tr', children: [cell('th', 'L', { align: 'left' }), cell('th', 'C', { align: 'center' }), cell('th', 'R', { align: 'right' })] }] },
          { type: 'tbody', children: [{ type: 'tr', children: [cell('td', '1'), cell('td', '2'), cell('td', '3')] }] },
        ],
      },
    ])
    expect(output.split('\n')[1]).toBe('| :--- | :---: | ---: |')
    expect(render(output)).toContain('<th style="text-align:center">C</th>')
  })

  it('reads textAlign when align is absent', () => {
    const output = slateToMarkdown([
      {
        type: 'table',
        children: [
          { type: 'tr', children: [cell('th', 'A', { textAlign: 'center' })] },
          { type: 'tr', children: [cell('td', '1')] },
        ],
      },
    ])
    expect(output.split('\n')[1]).toBe('| :---: |')
  })

  it('escapes pipes and converts line breaks in cells', () => {
    const output = slateToMarkdown([
      { type: 'table', children: [{ type: 'tr', children: [cell('th', 'a | b')] }, { type: 'tr', children: [cell('td', 'c\nd')] }] },
    ])
    expect(render(output)).toBe('<table><thead><tr><th>a | b</th></tr></thead><tbody><tr><td>c<br>d</td></tr></tbody></table>')
  })

  it('pads short rows', () => {
    const output = slateToMarkdown([
      { type: 'table', children: [{ type: 'tr', children: [cell('th', 'a'), cell('th', 'b')] }, { type: 'tr', children: [cell('td', '1')] }] },
    ])
    expect(output.split('\n')[2]).toBe('| 1 |  |')
  })

  it('maps slate example table names and keeps marks in cells', () => {
    const output = slateToMarkdown([
      {
        type: 'table',
        children: [
          { type: 'table-row', children: [{ type: 'table-header-cell', children: [{ text: 'H', bold: true }] }] },
          { type: 'table-row', children: [cell('table-cell', 'x')] },
        ],
      },
    ])
    expect(render(output)).toBe('<table><thead><tr><th><strong>H</strong></th></tr></thead><tbody><tr><td>x</td></tr></tbody></table>')
  })

  it('outputs nothing for an empty table', () => {
    expect(slateToMarkdown([{ type: 'table', children: [] }])).toBe('')
  })
})

describe('unmapped elements', () => {
  it('serializes an unmapped wrapper around blocks as its blocks', () => {
    expect(slateToMarkdown([{ type: 'div', children: [p('a'), p('b')] }])).toBe('a\n\nb')
  })

  it('treats an unmapped element beside text as inline', () => {
    expect(slateToMarkdown([{ type: 'p', children: [text('a '), { type: 'span', children: [{ text: 'b', bold: true }] }] }])).toBe(
      'a **b**',
    )
  })

  it('serializes an unmapped element with inline children as a paragraph', () => {
    expect(slateToMarkdown([{ children: [text('a')] }, { type: 'mystery', children: [text('b')] }])).toBe('a\n\nb')
  })
})
