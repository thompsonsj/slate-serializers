import { slateToHtml } from '.'

describe('Slate JSON to HTML transforms', () => {
  it('converts a sequence of basic text elements', () => {
    const expected = `<h1>Heading 1</h1><p>Paragraph 1</p>`
    const fixture = [
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
    expect(slateToHtml(fixture)).toEqual(expected)
  })

  it('handles links', () => {
    const expected = `<a href="https://github.com/thompsonsj/slate-serializers">Slate Serializers | GitHub</a>`
    const fixture = [
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
    expect(slateToHtml(fixture)).toEqual(expected)
  })

  it('handles unordered lists', () => {
    const expected = `<ul><li>Item 1</li><li>Item 2</li></ul>`
    const fixture = [
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
    expect(slateToHtml(fixture)).toEqual(expected)
  })
})
