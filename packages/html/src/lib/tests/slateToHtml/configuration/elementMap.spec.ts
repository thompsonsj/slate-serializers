import { slateToHtml, slateToHtmlConfig } from '@slate-serializers/html'

describe("slateToHtml elementMap", () => {
  it('processes an element map value', () => {
    const html = '<h1>Heading 1</h1>'
    const slate = [
      {
        type: 'heading-one',
        children: [
          {
            text: 'Heading 1',
          },
        ],
      },
    ]
    const config = {
      ...slateToHtmlConfig,
      elementMap: {
        ['heading-one']: 'h1',
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})
