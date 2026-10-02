import MarkdownIt = require('markdown-it')
import { parseDocument } from 'htmlparser2'
import { ChildNode } from 'domhandler'
import { slateToMarkdown } from '../serializers'
import { config as defaultConfig } from '../config/default'

/**
 * Serialize paragraphs of randomly marked leaves, render them with markdown-it and check that every character comes
 * back with exactly the marks it had. The generator is seeded, so failures are reproducible.
 */

const md = new MarkdownIt({ html: true })
const MARKS = ['bold', 'italic', 'strikethrough', 'code']
const TAGS: Record<string, string> = { strong: 'bold', em: 'italic', s: 'strikethrough', del: 'strikethrough', code: 'code' }
const WORDS = ['a', 'bc', 'de f', 'g h i', '(j)', 'k.', '"l"', '*m*', '_n_', '`o`', '~p~', 'q-r', '[s]', '<t>', '&u;']

const random = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647

const markedCharacters = (markdown: string): string[] => {
  const characters: string[] = []
  const walk = (nodes: ChildNode[], marks: string[]) => {
    for (const node of nodes) {
      if (node.type === 'text') {
        characters.push(...[...node.data].map((char) => `${char}:${[...marks].sort().join(',')}`))
      } else if ('children' in node) {
        const mark = 'name' in node ? TAGS[node.name] : undefined
        walk(node.children, mark && !marks.includes(mark) ? [...marks, mark] : marks)
      }
    }
  }
  walk(parseDocument(md.render(markdown), { decodeEntities: true }).children, [])
  return characters.filter((character) => !/^\s/.test(character))
}

describe.each([
  ['* emphasis', defaultConfig],
  ['_ emphasis', { ...defaultConfig, emphasisDelimiter: '_' as const }],
])('random marked text with %s', (_, config) => {
  it('renders every character with its marks', () => {
    const next = random(42)
    const pick = <T>(items: T[]): T => items[Math.floor(next() * items.length)]
    const failures: string[] = []
    for (let i = 0; i < 2000; i++) {
      const leaves = Array.from({ length: 1 + Math.floor(next() * 5) }, () => {
        const leaf: { text: string; [mark: string]: unknown } = {
          text: pick(['', ' ']) + pick(WORDS) + pick(['', '', ' ']),
        }
        MARKS.filter(() => next() < 0.35).forEach((mark) => (leaf[mark] = true))
        return leaf
      })
      const markdown = slateToMarkdown([{ type: 'p', children: leaves }], config)
      const expected = leaves.flatMap((leaf) =>
        [...leaf.text]
          .filter((char) => char !== ' ')
          .map((char) => `${char}:${MARKS.filter((mark) => leaf[mark]).sort().join(',')}`),
      )
      if (JSON.stringify(markedCharacters(markdown)) !== JSON.stringify(expected)) {
        failures.push(`${JSON.stringify(leaves)}\n  => ${JSON.stringify(markdown)}`)
      }
    }
    expect(failures.slice(0, 5)).toEqual([])
  })
})
