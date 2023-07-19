import { ChildNode, Element } from 'domhandler'
import { slateToDomConfig } from '@slate-serializers/dom'
import { config as htmlToSlateConfig } from '../htmlToSlate/config/default'
import { transformStyleObjectToString, transformStyleStringToObject } from '@slate-serializers/utilities'

interface Ifixture {
  name: string
  html: string
  slate: object[]
}

export const slateToDomConfigStyleObject = {
  ...slateToDomConfig,
  elementTransforms: {
    ...slateToDomConfig.elementTransforms,
    p: ({ node, children }: { node?: any; children?: ChildNode[] }) => {
      const style = transformStyleObjectToString(node.style)
      return new Element(
        'p',
        {
          ...(style && { style }),
        },
        children,
      )
    },
  },
  markTransforms: {
    ...slateToDomConfig.markTransforms,
    style: ({ node }: { node?: any }) => {
      return new Element('span', {
        style: transformStyleObjectToString(node.style),
      })
    },
  },
}

export const htmlToSlateConfigStyleObject = {
  ...htmlToSlateConfig,
  elementTags: {
    ...htmlToSlateConfig.elementTags,
    p: (el: any) => {
      const style = el.attribs.style && transformStyleStringToObject(el.attribs.style)
      return {
        type: 'p',
        ...(style && { style })
      }
    }
  },
  textTags: {
    ...htmlToSlateConfig.textTags,
    span: (el: any) => {
      const style = el.attribs.style && transformStyleStringToObject(el.attribs.style)
      return (style && { style }) || {}
    }
  },
}

export const fixtures: Ifixture[] = [
  {
    name: 'p tag element transform',
    html: '<p style="font-size: 96px; --text-color: #DD3A0A; @media screen { z-index: 1; color: var(--text-color) }"><strong>Paragraph</strong></p>',
    slate: [
      {
        type: 'p',
        style: {
          fontSize: '96px',
          '--text-color': '#DD3A0A',
          '@media screen': {
            zIndex: 1,
            color: 'var(--text-color)',
          },
        },
        children: [
          {
            bold: true,
            text: 'Paragraph',
          },
        ],
      },
    ]
  },
  {
    name: 'mark transform',
    html: '<p><span style="font-size: 96px; --text-color: #DD3A0A; @media screen { z-index: 1; color: var(--text-color) }"><strong>Paragraph</strong></span></p>',
    slate: [
      {
        type: 'p',
        children: [
          {
            bold: true,
            style: {
              fontSize: '96px',
              '--text-color': '#DD3A0A',
              '@media screen': {
                zIndex: 1,
                color: 'var(--text-color)',
              },
            },
            text: 'Paragraph',
          },
        ],
      },
    ]
  },
  {
    name: 'mark transforms on multiple marks',
    html: '<p>This is editable <span style="font-size: 20px; font-weight: 600; text-decoration: underline dotted"><strong>rich</strong></span> text, <span style="text-decoration: underline"><i>much</i></span> better than a <span style="color: red"><pre><code>&lt;textarea&gt;</code></pre></span>!</p>',
    slate: [
      {
        type: 'p',
        children: [
          {
            text: 'This is editable ',
          },
          {
            text: 'rich',
            bold: true,
            style: {
              fontSize: '20px',
              fontWeight: 600,
              textDecoration: 'underline dotted',
            },
          },
          {
            text: ' text, ',
          },
          {
            text: 'much',
            italic: true,
            style: {
              textDecoration: 'underline',
            },
          },
          {
            text: ' better than a ',
          },
          {
            text: '<textarea>',
            code: true,
            style: {
              color: 'red',
            },
          },
          {
            text: '!',
          },
        ],
      },
    ]
  },
]
