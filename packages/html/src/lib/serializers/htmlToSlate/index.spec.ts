import { htmlToSlate } from '.'
import { config as htmlToSlateConfig } from './config/default'
import { config as payloadHtmlToSlateConfig } from './config/payload'

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
      const expected: any[] = [
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
      const expected: any[] = [
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
      const expected: any[] = [
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
      const expected: any[] = [
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
      const expected: any[] = [
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
      const expected: any[] = [
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
      const expected: any[] = [
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

describe('inline code and pre HTML elements', () => {
  it('can handle inline code tags', () => {
    const html =
      '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <code>&lt;textarea&gt;</code>!</p>'
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
    expect(htmlToSlate(html)).toEqual(slate)
  })

  it('can handle duplicate inline code tags', () => {
    const html =
      '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <code><code>&lt;textarea&gt;</code></code>!</p>'
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
    expect(htmlToSlate(html)).toEqual(slate)
  })
})

describe('normalize slate JSON object', () => {
  /**
   * @see https://docs.slatejs.org/concepts/11-normalizing
   */
  describe('ensure empty children have an empty text node', () => {
    it('adds an empty text node for an invalid paragraph', () => {
      const html = '<p>'
      const slate: any[] = [
        {
          children: [
            {
              text: '',
            },
          ],
          type: 'p',
        },
      ]
      expect(htmlToSlate(html)).toEqual(slate)
    })
  })
})

describe('empty content', () => {
  describe('ensure empty children have an empty text node', () => {
    it('adds an empty text node for an invalid paragraph', () => {
      const html = '<p></p>'
      const slate: any[] = [
        {
          children: [
            {
              text: '',
            },
          ],
          type: 'p',
        },
      ]
      expect(htmlToSlate(html)).toEqual(slate)
    })

    it('converts a br tag to a line break', () => {
      const html = 'Line 1<br />Line 2'
      const slate: any[] = [
        {
          children: [
            {
              text: 'Line 1',
            },
          ],
        },
        {
          children: [
            {
              text: '',
            },
          ],
        },
        {
          children: [
            {
              text: 'Line 2',
            },
          ],
        },
      ]
      expect(htmlToSlate(html)).toEqual(slate)
    })

    it('converts a br tag in a paragraph to a line break', () => {
      const html = '<p>Paragraph with line<br /><br />breaks.</p>'
      const slate: any[] = [
        {
          children: [
            {
              text: 'Paragraph with line',
            },
            {
              text: '\n',
            },
            {
              text: '\n',
            },
            {
              text: 'breaks.',
            },
          ],
          type: 'p',
        },
      ]
      expect(htmlToSlate(html)).toEqual(slate)
    })

    it('does nothing with a br tag if convertBrToLineBreak is false', () => {
      const html = '<br />'
      const slate: any[] = []
      expect(htmlToSlate(html, { ...htmlToSlateConfig, convertBrToLineBreak: false })).toEqual(slate)
    })

    it('converts a br tag to a slate node if defined as an element tag', () => {
      const html = '<br />'
      const slate: any[] = [
        {
          children: [
            {
              text: '',
            },
          ],
          type: 'br',
        },
      ]
      expect(
        htmlToSlate(html, {
          ...htmlToSlateConfig,
          convertBrToLineBreak: false,
          elementTags: {
            ...htmlToSlateConfig.elementTags,
            br: () => ({ type: 'br' }),
          },
        }),
      ).toEqual(slate)
    })

    it('adds an empty text element in place of a br tag as a line break', () => {
      const html = 'Line 1<br>\n<span>Line 2</span>'
      const slate: any[] = [
        {
          children: [
            {
              text: 'Line 1',
            },
          ],
        },
        {
          children: [
            {
              text: '',
            },
          ],
        },
        {
          children: [
            {
              text: 'Line 2',
            },
          ],
        },
      ]
      expect(
        htmlToSlate(html, {
          ...htmlToSlateConfig,
          convertBrToLineBreak: true,
        }),
      ).toEqual(slate)
    })

    it('adds a line break in place of a br tag inside of a block element', () => {
      const html = '<p>Line 1<br>\n<span>Line 2</span></p>'
      const slate: any[] = [
        {
          type: 'p',
          children: [
            {
              text: 'Line 1',
            },
            {
              text: '\n',
            },
            {
              text: 'Line 2',
            },
          ],
        },
      ]
      expect(
        htmlToSlate(html, {
          ...htmlToSlateConfig,
          convertBrToLineBreak: true,
        }),
      ).toEqual(slate)
    })
  })
})

describe('nested text formatting elements', () => {
  it('converts many nested formatting elements', () => {
    const html =
      '<p><u><em><strong>Our S</strong></em></u><strong>ervi</strong><u><em><strong>ce</strong></em></u><em><strong>s </strong></em><em>A</em><u><em>nd</em></u><u><em><strong> </strong></em></u>Mo<u><em><strong>re</strong></em></u></p>'
    const slate = [
      {
        children: [
          {
            bold: true,
            italic: true,
            text: 'Our S',
            underline: true,
          },
          {
            bold: true,
            text: 'ervi',
          },
          {
            bold: true,
            italic: true,
            text: 'ce',
            underline: true,
          },
          {
            bold: true,
            italic: true,
            text: 's ',
          },
          {
            italic: true,
            text: 'A',
          },
          {
            italic: true,
            text: 'nd',
            underline: true,
          },
          {
            bold: true,
            italic: true,
            text: ' ',
            underline: true,
          },
          {
            text: 'Mo',
          },
          {
            bold: true,
            italic: true,
            text: 're',
            underline: true,
          },
        ],
        type: 'p',
      },
    ]
    expect(htmlToSlate(html)).toEqual(slate)
  })
})
