import { slateToHtml, slateDemoSlateToDomConfig } from '../../../src'

describe('slateToHtml expected behaviour', () => {
  it('adds the `text-align:right;` css property/value to style', () => {
    const html = '<p style="text-align:right;">This is a right aligned paragraph.</p>'
    const slate = [
      {
        align: 'right',
        children: [
          {
            text: 'This is a right aligned paragraph.',
          },
        ],
        type: 'paragraph',
      },
    ]
    expect(slateToHtml(slate, slateDemoSlateToDomConfig)).toEqual(html)
  })

  it('does not add empty style attributes', () => {
    const html = '<p>This is a right aligned paragraph.</p>'
    const slate = [
      {
        children: [
          {
            text: 'This is a right aligned paragraph.',
          },
        ],
        type: 'paragraph',
      },
    ]
    expect(slateToHtml(slate, slateDemoSlateToDomConfig)).toEqual(html)
  })
})
