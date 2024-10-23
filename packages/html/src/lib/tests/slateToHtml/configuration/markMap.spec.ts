import { slateToHtml, slateToHtmlConfig } from '@slate-serializers/html'

describe("slateToHtml markMap", () => {
  it('processes a mark map value', () => {
    const html = '<p><sub>Subscript text</sub></p>'
    const slate = [
      {
        type: 'p',
        children: [
          {
            text: 'Subscript text',
            subScript: true,
          },
        ],
      },
    ]
    const config = {
      ...slateToHtmlConfig,
      markMap: {
        subScript: ['sub'],
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})
