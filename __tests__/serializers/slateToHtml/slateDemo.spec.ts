import { slateToHtml, slateDemoSlateToDomConfig } from "../../../src"

describe('slateToHtml expected behaviour', () => {
  it('encodes HTML entities', () => {
    const html = '<p style="text-align:right;">This is a right aligned paragraph.</p>'
    const slate = [
      {
        align: "right",
        children: [
          {
            text: "This is a right aligned paragraph.",
          },
        ],
        type: "paragraph",
      },
    ]
    expect(slateToHtml(slate, slateDemoSlateToDomConfig)).toEqual(html)
  })
})
