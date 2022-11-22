import { htmlToSlate } from '.'

describe('Housekeeping', () => {
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

describe('HTML to Slate JSON transforms', () => {
  it('converts a sequence of basic text elements', () => {
    const fixture = `<h1>Heading 1</h1><p>Paragraph 1</p>`
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
            text: 'Paragraph 1',
          },
        ],
        type: 'p',
      },
    ]
    expect(htmlToSlate(fixture)).toEqual(expected)
  })

  it('handles links', () => {
    const fixture = `<a href="https://github.com/thompsonsj/slate-serializers">Slate Serializers | GitHub</a>`
    const expected = [
      {
        children: [
          {
            text: 'Slate Serializers | GitHub',
          },
        ],
        newTab: false,
        type: 'link',
        url: 'https://github.com/thompsonsj/slate-serializers',
      },
    ]
    expect(htmlToSlate(fixture)).toEqual(expected)
  })

  it('handles unordered lists', () => {
    const fixture = `<ul><li>Item 1</li><li>Item 2</li></ul>`
    const expected = [
      {
        children: [
          {
            children: [
              {
                text: 'Item 1',
              },
            ],
            type: 'li',
          },
          {
            children: [
              {
                text: 'Item 2',
              },
            ],
            type: 'li',
          },
        ],
        type: 'ul',
      },
    ]
    expect(htmlToSlate(fixture)).toEqual(expected)
  })
})
