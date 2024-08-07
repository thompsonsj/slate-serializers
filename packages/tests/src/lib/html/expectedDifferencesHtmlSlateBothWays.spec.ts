import { htmlToSlate, slateToHtml, payloadHtmlToSlateConfig } from '@slate-serializers/html'

import { combinedFixtures } from './../tests'

import { slateToDomConfig, payloadSlateToDomConfig } from '@slate-serializers/dom'

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
    expect(slateToHtml(slate, payloadSlateToDomConfig)).toEqual(html)
  })

  it('htmlToSlate adds a custom data attribute', () => {
    expect(htmlToSlate(html, payloadHtmlToSlateConfig)).toEqual(slate)
  })
})
