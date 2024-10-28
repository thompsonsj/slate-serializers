// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  htmlToSlate,
  htmlToSlateConfig,
  payloadHtmlToSlateConfig,
} from '@slate-serializers/html';

describe('htmlToSlate whitespace handling', () => {
  describe('inline formatting context', () => {
    /**
     * inline formatting example from mdn web docs
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
     *
     * <h1>◦◦◦Hello◦⏎
     * ⇥⇥⇥⇥<span>◦World!</span>⇥◦◦</h1>
     */
    it('processes the hello world example in the same way as mdn docs', () => {
      const fixture = `<h1>   Hello 
        <span> World!</span>   </h1>`
      const expected = [
        {
          children: [
            {
              text: `Hello `,
            },
            {
              children: [
                {
                  text: ' World!',
                },
              ],
              type: 'span',
            },
          ],
          type: 'h1',
        },
      ]
      // extend the config to handle span tags
      const config = {
        ...htmlToSlateConfig,
        elementTags: {
          ...htmlToSlateConfig.elementTags,
          span: () => ({ type: 'span' }),
        },
      }
      expect(htmlToSlate(fixture, config)).toEqual(expected)
    })
  })

  describe('block formatting context', () => {
    it('processes the hello world example in the same way as mdn docs', () => {
      const fixture = `  <div>  Hello  </div>

    <div>  World!   </div> . 
`
      const expected = [
        {
          children: [
            {
              text: 'Hello',
            },
          ],
          type: 'div',
        },
        {
          children: [
            {
              text: 'World!',
            },
          ],
          type: 'div',
        },
        {
          children: [
            {
              text: ` . `,
            },
          ],
        },
      ]
      // extend the config to handle span tags
      const config = {
        ...htmlToSlateConfig,
        elementTags: {
          ...htmlToSlateConfig.elementTags,
          div: () => ({ type: 'div' }),
        },
      }
      expect(htmlToSlate(fixture, config)).toEqual(expected)
    })

    it('preserves white space in the mdn docs hello world example if trimWhitespace is disabled', () => {
      const fixture = `<h1>   Hello 
        <span> World!</span>   </h1>`
      const expected = [
        {
          children: [
            {
              text: `Hello          `,
            },
            {
              children: [
                {
                  text: ' World!',
                },
              ],
              type: 'span',
            },
          ],
          type: 'h1',
        },
      ]
      // extend the config to handle span tags
      const config = {
        ...htmlToSlateConfig,
        elementTags: {
          ...htmlToSlateConfig.elementTags,
          span: () => ({ type: 'span' }),
        },
        trimWhiteSpace: false,
      }
      expect(htmlToSlate(fixture, config)).toEqual(expected)
    })

    /**
     * @see https://github.com/fb55/htmlparser2/issues/90
     */
    it('processes the example from htmlparser2 #90', () => {
      const fixture = '<p>foo<b> <i>bar</i></b></p>'
      const expected = [
        {
          children: [
            {
              text: 'foo',
            },
            {
              text: ' ',
            },
            {
              italic: true,
              text: 'bar',
            },
          ],
          type: 'p',
        },
      ]
      expect(htmlToSlate(fixture)).toEqual(expected)
    })
  })

  describe('preserve formatting context', () => {
    it('preserves whitespace for pre tags', () => {
      const fixture = `<pre>  two spaces before
      then spaces and a line break with a space after. </pre>`
      const expected = [
        {
          children: [
            {
              code: true,
              text: `  two spaces before
      then spaces and a line break with a space after. `,
            },
          ],
        },
      ]
      expect(htmlToSlate(fixture)).toEqual(expected)
    })

    it('removes non-mapped block elements containing whitespace only', () => {
      const fixture =
        '<div>Für Ihre Sicherheit&nbsp;</div>\n<div>  </div>\n<div>Bitte beachten Sie die Ansagen der Besatzung</div>'
      const expected = [
        {
          children: [
            {
              text: 'Für Ihre Sicherheit',
            },
          ],
        },
        {
          children: [
            {
              text: 'Bitte beachten Sie die Ansagen der Besatzung',
            },
          ],
        },
      ]
      expect(htmlToSlate(fixture, payloadHtmlToSlateConfig)).toEqual(expected)
    })

    it('does not remove non-mapped block elements with text contents consisting of a non-breaking line space', () => {
      const fixture =
        '<div>Für Ihre Sicherheit&nbsp;</div>\n<div>&nbsp;</div>\n<div>Bitte beachten Sie die Ansagen der Besatzung</div>'
      const expected = [
        {
          children: [
            {
              text: 'Für Ihre Sicherheit',
            },
          ],
        },
        {
          children: [
            {
              text: 'Bitte beachten Sie die Ansagen der Besatzung',
            },
          ],
        },
      ]
      expect(htmlToSlate(fixture, payloadHtmlToSlateConfig)).toEqual(expected)
    })
  })
})
