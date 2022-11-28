import { htmlToSlate, slateToHtml } from '../'
import { fixtures as combinedFixtures } from './fixtures/combined'
import { Element } from 'domhandler'
import { getAttributeValue } from 'domutils'
import { config as slateToDomConfig, Config as SlateToDomConfig } from '../config/slateToDom/default'
import { config as htmlToSlateConfig, Config as HtmlToSlateConfig } from '../config/htmlToSlate/default'

describe('HTML to Slate JSON transforms', () => {
  describe('Combined', () => {
    const fixtures = combinedFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(slateToHtml(fixture.slateOriginal, {...slateToDomConfig, enforceTopLevelPTags: true })).toEqual(fixture.html)
        expect(htmlToSlate(fixture.html)).toEqual(fixture.slateReserialized)
        expect(slateToHtml(fixture.slateReserialized)).toEqual(fixture.html)
      })
    }
  })
})

describe('attribute mapping', () => {
  const customSlatetoDomConfig: SlateToDomConfig = {
    ...slateToDomConfig,
    elementTransforms: {
      ...slateToDomConfig.elementTransforms,
      link: (node, children= []) => {
        let attrs: any = {}
        if (node.linkType) {
          attrs['data-link-type'] = node.linkType
        }
        if (node.newTab) {
          attrs.target = '_blank'
        }
        return new Element(
          'a',
          {
            href: node.url,
            ...attrs,
          },
          children,
        )
      }
    }
  }
  const customHtmlToSlateConfig: HtmlToSlateConfig = {
    ...htmlToSlateConfig,
    elementTags: {
      ...htmlToSlateConfig.elementTags,
      a: (el) => ({
        type: 'link',
        linkType: el && getAttributeValue(el, 'data-link-type'),
        newTab: el && getAttributeValue(el, 'target') === '_blank',
        url: el && getAttributeValue(el, 'href'),
      }),
    }
  }
  const slate = [
    {
      children: [
        {
          text: 'Some text before an inline link ',
        },
        {
          type: 'link',
          linkType: 'custom',
          url: 'https://github.com/thompsonsj/slate-serializers',
          newTab: true,
          children: [
            {
              text: 'slate-serializers | GitHub',
            },
          ],
        },
        {
          text: '.',
        },
      ],
      type: 'p',
    },
  ]
  const html =
    '<p>Some text before an inline link <a href="https://github.com/thompsonsj/slate-serializers" data-link-type="custom" target="_blank">slate-serializers | GitHub</a>.</p>'

  it('slateToHtml adds a custom data attribute', () => {
    expect(
      slateToHtml(slate, customSlatetoDomConfig),
    ).toEqual(html)
  })

  it('htmlToSlate adds a custom data attribute', () => {
    expect(
      htmlToSlate(html, customHtmlToSlateConfig),
    ).toEqual(slate)
  })
})
