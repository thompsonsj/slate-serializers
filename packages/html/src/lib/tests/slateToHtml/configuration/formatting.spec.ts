import { slateToHtml, slateToHtmlConfig } from "@slate-serializers/html"

describe("slateToHtml formatting", () => {
  describe("Formatting: default config", () => {
    it('does not encode HTML entities', () => {
      const html = `<h1>What's Heading 1</h1>`
      const slate = [
        {
          children: [
            {
              text: "What's Heading 1",
            },
          ],
          type: 'h1',
        },
      ]
      expect(slateToHtml(slate)).toEqual(html)
    })

    it('encodes HTML entities if encodeEntities is true', () => {
      const html = `<h1>What&apos;s Heading 1</h1>`
      const slate = [
        {
          children: [
            {
              text: "What's Heading 1",
            },
          ],
          type: 'h1',
        },
      ]
      expect(slateToHtml(slate, {
        ...slateToHtmlConfig,
        encodeEntities: true,
      })).toEqual(html)
    })

    /**
     * @see https://www.w3.org/International/questions/qa-escapes#use
     */
    it('encodes `breaking` HTML entities', () => {
      const html = `<p>2 &gt; 1 but is &lt; 3 &amp; it can break HTML</p>`
      const slate = [
        {
          children: [
            {
              text: '2 > 1 but is < 3 & it can break HTML',
            },
          ],
          type: 'p',
        },
      ]
      expect(slateToHtml(slate)).toEqual(html)
    })

    it('encodes `non breaking` HTML entities', () => {
      const html = `<p>The company’s priority is 'inside sales' and changing the spelling of cafe to café.</p>`
      const slate = [
        {
          children: [
            {
              text: "The company’s priority is 'inside sales' and changing the spelling of cafe to café.",
            },
          ],
          type: 'p',
        },
      ]
      expect(slateToHtml(slate)).toEqual(html)
    })

    it('can handle inline code tags', () => {
      const html =
        '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <pre><code>&lt;textarea&gt;</code></pre>!</p>'
      const slate = [
        {
          type: 'p',
          children: [
            {
              text: 'This is editable ',
            },
            {
              text: 'rich',
              bold: true,
            },
            {
              text: ' text, ',
            },
            {
              text: 'much',
              italic: true,
            },
            {
              text: ' better than a ',
            },
            {
              text: '<textarea>',
              code: true,
            },
            {
              text: '!',
            },
          ],
        },
      ]
      expect(slateToHtml(slate)).toEqual(html)
    })
  })

  describe("Formatting: custom config", () => {
    it('encodes `breaking` HTML entities only if option is active', () => {
      const html = `<p>2 &gt; 1 but is &lt; 3 &amp; it can break HTML</p><p>The company’s priority is 'inside sales' and changing the spelling of cafe to café.</p>`
      const slate = [
        {
          children: [
            {
              text: '2 > 1 but is < 3 & it can break HTML',
            },
          ],
          type: 'p',
        },
        {
          children: [
            {
              text: "The company’s priority is 'inside sales' and changing the spelling of cafe to café.",
            },
          ],
          type: 'p',
        },
      ]
      expect(
        slateToHtml(slate, {
          ...slateToHtmlConfig,
          encodeEntities: false,
          alwaysEncodeBreakingEntities: true,
        }),
      ).toEqual(html)
    })

    it('does not encode HTML entities with the appropriate option', () => {
      const html = `<h1>What's Heading 1</h1>`
      const slate = [
        {
          children: [
            {
              text: "What's Heading 1",
            },
          ],
          type: 'h1',
        },
      ]
      expect(slateToHtml(slate, { ...slateToHtmlConfig, encodeEntities: false })).toEqual(html)
    })

    it('respects the alwaysEncodeCodeEntities option if encodeEntities is false', () => {
      const html = '<p>Regular text &amp; <pre><code>&lt;textarea&gt;</code></pre>.</p>'
      const slate = [
        {
          type: 'p',
          children: [
            {
              text: 'Regular text & ',
            },
            {
              text: '<textarea>',
              code: true,
            },
            {
              text: '.',
            },
          ],
        },
      ]
      expect(slateToHtml(slate, { ...slateToHtmlConfig, encodeEntities: false, alwaysEncodeCodeEntities: true })).toEqual(
        html,
      )
    })
  })
})
