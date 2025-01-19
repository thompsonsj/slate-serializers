import { slateToHtml, htmlToSlateConfig, HtmlToSlateConfig, htmlToSlate } from '@slate-serializers/html'
import { Element } from 'domhandler'
import { SlateToDomConfig, slateToDomConfig } from '@slate-serializers/dom'
import { transformStyleStringToObject } from '@slate-serializers/utilities'
import { stylesMixedInFixtures as fixtures } from '../tests'

export const slateToDomConfigStyleObject: SlateToDomConfig = {
  ...slateToDomConfig,
  markTransforms: {
    ...slateToDomConfig.markTransforms,
    backgroundColor: ({ node }) => {
      return new Element('span', {
        style: `background-color:${node.backgroundColor};`
      })
    },
    color: ({ node }) => {
      return new Element('span', {
        style: `color:${node.color};`
      })
    },
    fontFamily: ({ node }) => {
      return new Element('span', {
        style: `font-family:${node.fontFamily};`
      })
    },
    fontSize: ({ node }) => {
      return new Element('span', {
        style: `font-size:${node.fontSize};`
      })
    }
  },
  defaultTag: 'p',
}

export const htmlToSlateConfigStyleObject: HtmlToSlateConfig = {
  ...htmlToSlateConfig,
  textTags: {
    ...htmlToSlateConfig.textTags,
    span: (el) => {
      const style = el?.attribs && transformStyleStringToObject(el.attribs['style'] || ``)
      return {
        ...(style && style)
      }
    }
  },
}

describe('styles as attributes on a leaf', () => {
  for (const fixture of fixtures) {
    it(`${fixture.name}`, () => {
      expect(slateToHtml(fixture.slate, slateToDomConfigStyleObject )).toEqual(fixture.html)
      expect(htmlToSlate(fixture.html, htmlToSlateConfigStyleObject)).toEqual(fixture.slate)
    })
  }
})
