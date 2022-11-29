import { slateToHtml, slateToDomConfig } from "../../../src"

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

  it('does not encode HTML entities with the appropriate option', () => {
    const html = `<h1>What's Heading 1</h1>`
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
    expect(slateToHtml(slate, { ...slateToDomConfig, encodeEntities: false })).toEqual(html)
  })
})
