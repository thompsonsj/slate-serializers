import { Element } from 'domhandler'
import { slateToHtml, payloadSlateToHtmlConfig, type ElementTransform } from '@slate-serializers/html'

describe('slateToHtml: Payload CMS config', () => {
  it('adds text alignment', () => {
    const html = '<p style="text-align:left;">Left aligned.</p><p style="text-align:center;">Center aligned.</p><p style="text-align:right;">Right aligned.</p>'
    const slate = [
      {
        "children": [
          {
            "text": "Left aligned."
          }
        ],
        "textAlign": "left"
      },
      {
        "children": [
          {
            "text": "Center aligned."
          }
        ],
        "textAlign": "center"
      },
      {
        "children": [
          {
            "text": "Right aligned."
          }
        ],
        "textAlign": "right"
      },
    ]
    expect(slateToHtml(slate, payloadSlateToHtmlConfig)).toEqual(html)
  })

  it('renders an upload field as an `img` HTML element if an image', () => {
    const html = '<img src="/images/pink-hour-au-cafe-bataclan-paris.jpg">'
    const slate = [
      {
        children: [
          {
            text: '',
          },
        ],
        type: 'upload',
        value: {
          id: '63389d417e803d5394b17873',
          filename: 'pink-hour-au-cafe-bataclan-paris.jpg',
          mimeType: 'image/jpeg',
          filesize: 240029,
          width: 1500,
          height: 844,
          createdAt: '2022-10-01T20:04:17.576Z',
          updatedAt: '2022-10-01T20:04:17.576Z',
          url: '/images/pink-hour-au-cafe-bataclan-paris.jpg',
        },
        relationTo: 'images',
      },
    ]
    expect(slateToHtml(slate, payloadSlateToHtmlConfig)).toEqual(html)
  })

  it('renders an upload field as an `a` HTML element if not an image', () => {
    const html = '<a href="/images/sample.pdf">sample.pdf</a>'
    const slate = [
      {
        children: [
          {
            text: '',
          },
        ],
        type: 'upload',
        value: {
          id: '64986c58bc75f7c64b244c24',
          filename: 'sample.pdf',
          mimeType: 'application/pdf',
          filesize: 3028,
          createdAt: '2023-06-25T16:33:28.780Z',
          updatedAt: '2023-06-25T16:33:28.780Z',
          url: '/images/sample.pdf',
        },
        relationTo: 'images',
      },
    ]
    expect(slateToHtml(slate, payloadSlateToHtmlConfig)).toEqual(html)
  })

  it('renders an upload field as an `img` HTML element with a custom transform', () => {
    const html =
      '<img class="object-cover object-center group-hover:opacity-75" src="https://myapp.payloadcms.app//images/pink-hour-au-cafe-bataclan-paris.jpg">'
    const slate = [
      {
        children: [
          {
            text: '',
          },
        ],
        type: 'upload',
        value: {
          id: '63389d417e803d5394b17873',
          filename: 'pink-hour-au-cafe-bataclan-paris.jpg',
          mimeType: 'image/jpeg',
          filesize: 240029,
          width: 1500,
          height: 844,
          createdAt: '2022-10-01T20:04:17.576Z',
          updatedAt: '2022-10-01T20:04:17.576Z',
          url: '/images/pink-hour-au-cafe-bataclan-paris.jpg',
        },
        relationTo: 'images',
      },
    ]
    const uploadTransform: ElementTransform = ({ node }) => {
      if (node.value?.mimeType && node.value?.url) {
        if (node.value?.mimeType.match(/^image/)) {
          return new Element('img', {
            class: 'object-cover object-center group-hover:opacity-75',
            src: `https://myapp.payloadcms.app/${node.value?.url}`,
          })
        }
      }
      return
    }

    const config = {
      ...payloadSlateToHtmlConfig,
      elementTransforms: {
        ...payloadSlateToHtmlConfig.elementTransforms,
        upload: uploadTransform,
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})
