import { slateToHtml, htmlToSlateConfig, HtmlToSlateConfig } from '@slate-serializers/html'
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
  elementTags: {
    ...htmlToSlateConfig.elementTags,
    p: (el) => {
      const style = el?.attribs && transformStyleStringToObject(`el?.attribs`)
      return {
        type: 'p',
        ...(style && { style })
      }
    }
  },
}

describe('mixed in style attribute css transforms with postcss', () => {
  for (const fixture of fixtures) {
    it(`${fixture.name}`, () => {
      console.log('alright?')
      expect(slateToHtml(fixture.slate, slateToDomConfigStyleObject )).toEqual(fixture.html)
      //expect(htmlToSlate(fixture.html, htmlToSlateConfigStyleObject)).toEqual(fixture.slate)
    })
  }
})
