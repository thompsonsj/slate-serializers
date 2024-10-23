import { Element } from 'domhandler'
import { slateToHtml, slateToHtmlConfig, SlateToHtmlConfig } from "@slate-serializers/html"

describe("slateToHtml markTransforms", () => {
  it('processes a mark transform', () => {
    const html = '<p><span style="font-size:96px;"><strong>Paragraph</strong></span></p>'
    const slate = [
      {
        type: 'p',
        children: [
          {
            bold: true,
            fontSize: '96px',
            text: 'Paragraph',
          },
        ],
      },
    ]
    const config: SlateToHtmlConfig = {
      ...slateToHtmlConfig,
      markTransforms: {
        ...slateToHtmlConfig.markTransforms,
        fontSize: ({ node }) => {
          return new Element('span', {
            style: `font-size:${node.fontSize};`,
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})
