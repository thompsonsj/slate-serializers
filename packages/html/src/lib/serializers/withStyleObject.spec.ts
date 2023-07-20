import { htmlToSlate } from './htmlToSlate'
import { slateToHtml } from './slateToHtml'
import { ChildNode, Element } from 'domhandler'
import { slateToDomConfig } from '@slate-serializers/dom'
import { config as htmlToSlateConfig } from './htmlToSlate/config/default'
import { transformStyleObjectToString, transformStyleStringToObject } from '@slate-serializers/utilities'
import { styleObjectFixtures as fixtures } from '@slate-serializers/tests'

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

describe('style attribute css transforms with postcss', () => {
  for (const fixture of fixtures) {
    it(`${fixture.name}`, () => {
      expect(slateToHtml(fixture.slate, slateToDomConfigStyleObject )).toEqual(fixture.html)
      expect(htmlToSlate(fixture.html, htmlToSlateConfigStyleObject)).toEqual(fixture.slate)
    })
  }
})
