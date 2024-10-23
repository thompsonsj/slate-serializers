import { Element } from 'domhandler'
import { slateToHtml, slateToHtmlConfig } from "@slate-serializers/html"

describe("slateToHtml elementTransforms", () => {
  it('processes an element transform', () => {
    const html = '<p>Paragraph</p><img src="https://picsum.photos/id/237/200/300">'
    const slate = [
      {
        type: 'p',
        children: [
          {
            text: 'Paragraph',
          },
        ],
      },
      {
        type: 'image',
        url: 'https://picsum.photos/id/237/200/300',
      },
    ]
    const config = {
      ...slateToHtmlConfig,
      elementTransforms: {
        ...slateToHtmlConfig.elementTransforms,
        image: ({ node }: { node?: any }) => {
          return new Element('img', {
            src: node.url,
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})
