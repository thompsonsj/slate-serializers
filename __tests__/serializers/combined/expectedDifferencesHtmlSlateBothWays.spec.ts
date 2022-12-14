import { htmlToSlate, slateToHtml } from '../../../src'
import { fixtures as combinedFixtures } from './fixtures/combined'

import { config as slateToDomConfig } from '../../../src/config/slateToDom/default'
import { config as slateToDomPayloadConfig } from '../../../src/config/slateToDom/payload'
import { config as htmlToSlatePayloadConfig } from '../../../src/config/htmlToSlate/payload'

describe('HTML to Slate JSON transforms', () => {
  describe('Combined', () => {
    const fixtures = combinedFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(slateToHtml(fixture.slateOriginal, { ...slateToDomConfig, defaultTag: 'p' })).toEqual(fixture.html)
        expect(htmlToSlate(fixture.html)).toEqual(fixture.slateReserialized)
        expect(slateToHtml(fixture.slateReserialized)).toEqual(fixture.html)
      })
    }
  })
})

describe('attribute mapping', () => {
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
    expect(slateToHtml(slate, slateToDomPayloadConfig)).toEqual(html)
  })

  it('htmlToSlate adds a custom data attribute', () => {
    expect(htmlToSlate(html, htmlToSlatePayloadConfig)).toEqual(slate)
  })
})
