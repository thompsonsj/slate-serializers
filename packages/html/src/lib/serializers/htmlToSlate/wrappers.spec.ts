import { htmlToSlate } from '.'

describe('htmlToSlate top-level wrapper elements', () => {
  it('lifts blocks out of an unmapped <div>', () => {
    expect(htmlToSlate('<div><p>a</p><p>b</p></div>')).toEqual([
      { type: 'p', children: [{ text: 'a' }] },
      { type: 'p', children: [{ text: 'b' }] },
    ])
  })

  it('lifts blocks out of nested wrappers', () => {
    expect(htmlToSlate('<article><section><h1>t</h1><p>a</p></section></article><p>b</p>')).toEqual([
      { type: 'h1', children: [{ text: 't' }] },
      { type: 'p', children: [{ text: 'a' }] },
      { type: 'p', children: [{ text: 'b' }] },
    ])
  })

  it('lifts blocks out of a mark wrapper and keeps the mark on the text', () => {
    expect(htmlToSlate('<strong><p>a</p><p>b</p></strong>')).toEqual([
      { type: 'p', children: [{ text: 'a', bold: true }] },
      { type: 'p', children: [{ text: 'b', bold: true }] },
    ])
  })

  it('ignores <head> content in a full document such as a Word paste', () => {
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

  it('keeps a wrapped link inside a block', () => {
    expect(htmlToSlate('<div><a href="/x">x</a></div>')).toEqual([
      { children: [{ type: 'link', newTab: false, url: '/x', children: [{ text: 'x' }] }] },
    ])
  })

  it('keeps several wrapped links inside one block', () => {
    expect(htmlToSlate('<b><a href="/x">x</a> <a href="/y">y</a></b>')).toEqual([
      {
        children: [
          { type: 'link', newTab: false, url: '/x', children: [{ text: 'x', bold: true }] },
          { text: ' ', bold: true },
          { type: 'link', newTab: false, url: '/y', children: [{ text: 'y', bold: true }] },
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

  it('keeps mixed text and block content in one block', () => {
    expect(htmlToSlate('<div>x<p>a</p></div>')).toEqual([
      { children: [{ text: 'x' }, { type: 'p', children: [{ text: 'a' }] }] },
    ])
  })
})
