import { slateToHtml } from "../../../src"

describe('slateToHtml expected behaviour', () => {
  it('encodes HTML entities', () => {
    const html = `<h1>What&apos;s Heading 1</h1>`
    const slate = [
      {
        children: [
          {
            text: "What's Heading 1",
          },
        ],
        type: 'h1',
      },
    ]
    expect(slateToHtml(slate)).toEqual(html)
  })
})
