import MarkdownIt = require('markdown-it')
import { parseDocument } from 'htmlparser2'
import { textContent } from 'domutils'
import { payloadSlateToMarkdownConfig, slateToMarkdown, slateToMarkdownConfig } from '@slate-serializers/markdown'
import { combinedFixtures, elementFixtures, styleObjectFixtures, stylesMixedInFixtures, textFixtures } from '../tests'

const md = new MarkdownIt({ html: true })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slateText = (node: any): string => (typeof node.text === 'string' ? node.text : (node.children ?? []).map(slateText).join(''))
const withoutWhitespace = (text: string) => text.replace(/\s+/g, '')

const fixtureSets = {
  combined: combinedFixtures,
  element: elementFixtures,
  text: textFixtures,
  styleObject: styleObjectFixtures,
  stylesMixedIn: stylesMixedInFixtures,
}

describe.each([
  ['default config', slateToMarkdownConfig],
  ['Payload config', payloadSlateToMarkdownConfig],
])('slateToMarkdown with the %s', (_name, config) => {
  describe.each(Object.entries(fixtureSets))('%s fixtures', (_set, fixtures) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    it.each(fixtures.map((fixture: any) => [fixture.name, fixture.slate ?? fixture.slateOriginal] as const))('%s', (_fixture, slate) => {
      const markdown = slateToMarkdown(slate, config)
      expect(markdown).toMatchSnapshot()
      // Rendering the Markdown gives back all of the Slate text: nothing is lost or mangled by escaping.
      const rendered = textContent(parseDocument(md.render(markdown)))
      expect(withoutWhitespace(rendered)).toBe(withoutWhitespace(slate.map(slateText).join('')))
    })
  })
})
