import { htmlToSlate } from '.'
import { config as payloadConfig } from './config/payload'

describe('htmlToSlate default textTags', () => {
  it('maps <b> to bold', () => {
    expect(htmlToSlate('<p>a <b>bold</b> word</p>')).toEqual([
      { type: 'p', children: [{ text: 'a ' }, { text: 'bold', bold: true }, { text: ' word' }] },
    ])
  })

  it('maps <b> to bold in the Payload config', () => {
    expect(htmlToSlate('<p><b>bold</b></p>', payloadConfig)).toEqual([
      { type: 'p', children: [{ text: 'bold', bold: true }] },
    ])
  })

  it('combines <b> with other marks', () => {
    expect(htmlToSlate('<p><b><i>both</i></b></p>')).toEqual([
      { type: 'p', children: [{ text: 'both', bold: true, italic: true }] },
    ])
  })

  it.each(['normal', '400', '300'])('does not mark <b style="font-weight:%s"> as bold', (weight) => {
    expect(htmlToSlate(`<p><b style="font-weight:${weight}">plain</b></p>`)).toEqual([
      { type: 'p', children: [{ text: 'plain' }] },
    ])
  })

  it('treats <b style="font-weight:700"> as bold', () => {
    expect(htmlToSlate('<p><b style="font-weight:700">heavy</b></p>')).toEqual([
      { type: 'p', children: [{ text: 'heavy', bold: true }] },
    ])
  })

  it('does not bold a Google Docs paste wrapper, but keeps inner formatting', () => {
    const html =
      '<b style="font-weight:normal;" id="docs-internal-guid-abc"><p>plain <strong>strong</strong></p><p>second</p></b>'
    expect(htmlToSlate(html)).toEqual([
      { type: 'p', children: [{ text: 'plain ' }, { text: 'strong', bold: true }] },
      { type: 'p', children: [{ text: 'second' }] },
    ])
  })

  it('maps <strike> to strikethrough', () => {
    expect(htmlToSlate('<p><strike>gone</strike></p>')).toEqual([
      { type: 'p', children: [{ text: 'gone', strikethrough: true }] },
    ])
  })
})
