// eslint-disable-next-line @nx/enforce-module-boundaries
import { htmlToSlate, htmlToSlateConfig } from '@slate-serializers/html'

const blockConfig = {
  ...htmlToSlateConfig,
  brStrategy: 'block' as const,
}

const newlineConfig = {
  ...htmlToSlateConfig,
  brStrategy: 'newline' as const,
}

describe('htmlToSlate configuration: brStrategy', () => {
  describe('top-level text with <br>', () => {
    const html = 'Line 1<br />Line 2'

    it('block (default): empty text node becomes its own block between lines', () => {
      expect(htmlToSlate(html, blockConfig)).toEqual([
        {
          children: [{ text: 'Line 1' }],
        },
        {
          children: [{ text: '' }],
        },
        {
          children: [{ text: 'Line 2' }],
        },
      ])
    })

    it('newline: coalesces into a single default block with \\n in the text', () => {
      expect(htmlToSlate(html, newlineConfig)).toEqual([
        {
          children: [{ text: 'Line 1\nLine 2' }],
        },
      ])
    })
  })

  describe('double <br> between plain text', () => {
    const html = 'Line 1<br /><br />Line 2'

    it('block: two empty blocks between lines', () => {
      expect(htmlToSlate(html, blockConfig)).toEqual([
        {
          children: [{ text: 'Line 1' }],
        },
        {
          children: [{ text: '' }],
        },
        {
          children: [{ text: '' }],
        },
        {
          children: [{ text: 'Line 2' }],
        },
      ])
    })

    it('newline: single block with \\n\\n between lines', () => {
      expect(htmlToSlate(html, newlineConfig)).toEqual([
        {
          children: [{ text: 'Line 1\n\nLine 2' }],
        },
      ])
    })
  })

  describe('<br> inside a paragraph', () => {
    const html = '<p>Paragraph with line<br /><br />breaks.</p>'

    it('block: separate \\n text leaves (historical behavior)', () => {
      expect(htmlToSlate(html, blockConfig)).toEqual([
        {
          type: 'p',
          children: [
            { text: 'Paragraph with line' },
            { text: '\n' },
            { text: '\n' },
            { text: 'breaks.' },
          ],
        },
      ])
    })

    it('newline: coalesces plain-text leaves including breaks', () => {
      expect(htmlToSlate(html, newlineConfig)).toEqual([
        {
          type: 'p',
          children: [{ text: 'Paragraph with line\n\nbreaks.' }],
        },
      ])
    })
  })

  describe('<br> between marked inline and link', () => {
    const html = '<p><strong>Line 1</strong><br /><br /><a href="/x">Line 2</a></p>'

    it('block: \\n leaves between bold and link', () => {
      expect(htmlToSlate(html, blockConfig)).toEqual([
        {
          type: 'p',
          children: [
            { bold: true, text: 'Line 1' },
            { text: '\n' },
            { text: '\n' },
            {
              type: 'link',
              newTab: false,
              url: '/x',
              children: [{ text: 'Line 2' }],
            },
          ],
        },
      ])
    })

    it('newline: coalesces adjacent \\n leaves but keeps marks/elements separate', () => {
      expect(htmlToSlate(html, newlineConfig)).toEqual([
        {
          type: 'p',
          children: [
            { bold: true, text: 'Line 1' },
            { text: '\n\n' },
            {
              type: 'link',
              newTab: false,
              url: '/x',
              children: [{ text: 'Line 2' }],
            },
          ],
        },
      ])
    })
  })

  describe('<br> run before a following block element', () => {
    const html = 'Line 1<br /><br /><p>Line 2</p>'

    it('block: empty break blocks then the paragraph', () => {
      expect(htmlToSlate(html, blockConfig)).toEqual([
        {
          children: [{ text: 'Line 1' }],
        },
        {
          children: [{ text: '' }],
        },
        {
          children: [{ text: '' }],
        },
        {
          type: 'p',
          children: [{ text: 'Line 2' }],
        },
      ])
    })

    it('newline: collapses the br run to a single \\n before the paragraph', () => {
      expect(htmlToSlate(html, newlineConfig)).toEqual([
        {
          children: [{ text: 'Line 1\n' }],
        },
        {
          type: 'p',
          children: [{ text: 'Line 2' }],
        },
      ])
    })
  })

  it('defaults to block when brStrategy is omitted', () => {
    const html = 'Line 1<br />Line 2'
    expect(htmlToSlate(html, { ...htmlToSlateConfig, brStrategy: undefined })).toEqual(
      htmlToSlate(html, blockConfig),
    )
  })
})
