import { htmlToSlate } from '../../../src/serializers/htmlToSlate'

describe('htmlToSlate expected behaviour', () => {
  it('ignores non-HTML line breaks and extra spaces', () => {
    const fixture = `<h1>Heading 1</h1>
    <p>Paragraph 1</p>`
    const expected = [
      {
        children: [
          {
            text: 'Heading 1',
          },
        ],
        type: 'h1',
      },
      {
        children: [
          {
            text: '\n    ',
          },
        ],
      },
      {
        children: [
          {
            text: 'Paragraph 1',
          },
        ],
        type: 'p',
      },
    ]
    expect(htmlToSlate(fixture)).toEqual(expected)
  })

  // this seems to be a side effect of using htmlparser2
  // I haven't included this logic anywhere.
  it('decodes HTML entities', () => {
    const fixture = `<h1>What&#39;s Heading 1</h1>`
    const expected = [
      {
        children: [
          {
            text: "What's Heading 1",
          },
        ],
        type: 'h1',
      },
    ]
    expect(htmlToSlate(fixture)).toEqual(expected)
  })
})
