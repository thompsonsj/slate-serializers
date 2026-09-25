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

  it('maps <strike> to strikethrough', () => {
    expect(htmlToSlate('<p><strike>gone</strike></p>')).toEqual([
      { type: 'p', children: [{ text: 'gone', strikethrough: true }] },
    ])
  })
})
