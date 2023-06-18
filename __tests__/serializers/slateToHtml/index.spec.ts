import { ChildNode, Element } from 'domhandler'
import { slateToHtml, slateToDomConfig } from '../../../src'

const postcss = require('postcss')
const postcssJs = require('postcss-js')

describe('slateToHtml expected behaviour', () => {
  it('encodes HTML entities', () => {
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
    expect(slateToHtml(slate)).toEqual(html)
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
    const html = `<p>The company&#x2019;s priority is &apos;inside sales&apos; and changing the spelling of cafe to caf&#xe9;.</p>`
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
        ...slateToDomConfig,
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
    expect(slateToHtml(slate, { ...slateToDomConfig, encodeEntities: false })).toEqual(html)
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

describe('custom config', () => {
  it('respects the alwaysEncodeCodeEntities option if encodeEntities is false', () => {
    const html = '<p>Regular text & <pre><code>&lt;textarea&gt;</code></pre>.</p>'
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
    expect(slateToHtml(slate, { ...slateToDomConfig, encodeEntities: false, alwaysEncodeCodeEntities: true })).toEqual(
      html,
    )
  })

  it('processes an element map value', () => {
    const html = '<h1>Heading 1</h1>'
    const slate = [
      {
        type: 'heading-one',
        children: [
          {
            text: 'Heading 1',
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      elementMap: {
        ['heading-one']: 'h1',
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('processes an element transform', () => {
    const html = '<p>Paragraph</p><img src="https://picsum.photos/id/237/200/300">'
    const slate = [
      {
        type: 'p',
        children: [
          {
            text: 'Paragraph',
          },
        ],
      },
      {
        type: 'image',
        url: 'https://picsum.photos/id/237/200/300',
      },
    ]
    const config = {
      ...slateToDomConfig,
      elementTransforms: {
        ...slateToDomConfig.elementTransforms,
        image: ({ node }: { node?: any }) => {
          return new Element('img', {
            src: node.url,
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('maps Slate attribute to inline style from element style map', () => {
    const html = '<p style="font-size:96px;"><strong>Paragraph</strong></p>'
    const slate = [
      {
        type: 'p',
        fontSize: '96px',
        children: [
          {
            bold: true,
            text: 'Paragraph',
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      elementStyleMap: {
        fontSize: 'font-size',
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('processes a mark map value', () => {
    const html = '<p><sub>Subscript text</sub></p>'
    const slate = [
      {
        type: 'p',
        children: [
          {
            text: 'Subscript text',
            subScript: true,
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      markMap: {
        subScript: ['sub'],
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('processes a mark transform', () => {
    const html = '<p><span style="font-size:96px;"><strong>Paragraph</strong></span></p>'
    const slate = [
      {
        type: 'p',
        children: [
          {
            bold: true,
            fontSize: '96px',
            text: 'Paragraph',
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      markTransforms: {
        ...slateToDomConfig.markTransforms,
        fontSize: ({ node }: { node?: any }) => {
          return new Element('span', {
            style: `font-size:${node.fontSize};`,
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('demo for issue #59', () => {
    const html = '<p><span style="font-size:20px;"><strong><sub>Paragraph</sub></strong></span></p>'
    const slate = [
      {
        type: 'p',
        children: [
          {
            bold: true,
            style: {
              fontSize: '20px',
            },
            subscript: true,
            text: 'Paragraph',
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      markMap: {
        ...slateToDomConfig.markMap,
        subscript: ['sub'],
      },
      markTransforms: {
        ...slateToDomConfig.markTransforms,
        style: ({ node }: { node?: any }) => {
          return new Element('span', {
            ...(node.style?.fontSize && { style: `font-size:${node.style.fontSize};` }),
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})

describe('style attribute css transforms with postcss', () => {
  const transformStyleObjectToString = (style: { [key: string]: any }) => {
    const postcssOptions = {
      parser: postcssJs,
      from: undefined,
    }
    return postcss()
      .process(style, postcssOptions)
      .css.replace(/(\r\n|\n|\r)/gm, ' ')
      .replace(/\s\s+/g, ' ')
  }

  it('element transforms', () => {
    const html =
      '<p style="font-size: 96px; --text-color: #DD3A0A; @media screen { z-index: 1; color: var(--text-color) }"><strong>Paragraph</strong></p>'
    const slate = [
      {
        type: 'p',
        style: {
          fontSize: '96px',
          '--text-color': '#DD3A0A',
          '@media screen': {
            zIndex: '1',
            color: 'var(--text-color)',
          },
        },
        children: [
          {
            bold: true,
            text: 'Paragraph',
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      elementTransforms: {
        ...slateToDomConfig.elementTransforms,
        p: ({ node, children }: { node?: any; children?: ChildNode[] }) => {
          return new Element(
            'p',
            {
              style: transformStyleObjectToString(node.style),
            },
            children,
          )
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('mark transforms', () => {
    const html =
      '<p><span style="font-size: 96px; --text-color: #DD3A0A; @media screen { z-index: 1; color: var(--text-color) }"><strong>Paragraph</strong></span></p>'
    const slate = [
      {
        type: 'p',
        children: [
          {
            bold: true,
            style: {
              fontSize: '96px',
              '--text-color': '#DD3A0A',
              '@media screen': {
                zIndex: '1',
                color: 'var(--text-color)',
              },
            },
            text: 'Paragraph',
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      markTransforms: {
        ...slateToDomConfig.markTransforms,
        style: ({ node }: { node?: any }) => {
          return new Element('span', {
            style: transformStyleObjectToString(node.style),
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('mark transforms on multiple marks', () => {
    const html =
      '<p>This is editable <span style="font-size: 20px; font-weight: 600; text-decoration: underline dotted"><strong>rich</strong></span> text, <span style="text-decoration: underline"><i>much</i></span> better than a <span style="color: red"><pre><code>&lt;textarea&gt;</code></pre></span>!</p>'
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
            style: {
              fontSize: '20px',
              fontWeight: 600,
              textDecoration: 'underline dotted',
            },
          },
          {
            text: ' text, ',
          },
          {
            text: 'much',
            italic: true,
            style: {
              textDecoration: 'underline',
            },
          },
          {
            text: ' better than a ',
          },
          {
            text: '<textarea>',
            code: true,
            style: {
              color: 'red',
            },
          },
          {
            text: '!',
          },
        ],
      },
    ]
    const config = {
      ...slateToDomConfig,
      markTransforms: {
        ...slateToDomConfig.markTransforms,
        style: ({ node }: { node?: any }) => {
          return new Element('span', {
            style: transformStyleObjectToString(node.style),
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
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
      expect(slateToHtml(slate)).toEqual(html)
    })

    it('adds an empty text node for an invalid paragraph', () => {
      const html = ''
      const slate: any[] = [
        {
          children: [],
          type: 'br',
        },
      ]
      expect(slateToHtml(slate)).toEqual(html)
    })
  })
})

describe('line breaks', () => {
  it('does nothing with a line break if convertLineBreakToBr is false', () => {
    const slate: any[] = [
      {
        children: [
          {
            text: 'Paragraph with \n line',
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
    const html = '<p>Paragraph with \n line\n\nbreaks.</p>'
    expect(slateToHtml(slate)).toEqual(html)
  })

  it('adds br tag between text elements', () => {
    const slate: any[] = [
      {
        children: [
          {
            text: 'Paragraph 1',
          },
        ],
      },
      {
        children: [
          {
            text: 'Paragraph 2',
          },
        ],
      },
    ]
    const html = 'Paragraph 1<br>Paragraph 2'
    expect(slateToHtml(slate, { ...slateToDomConfig, convertLineBreakToBr: true })).toEqual(html)
  })

  it('does not add br tag after a block level element', () => {
    const slate: any[] = [
      {
        type: 'p',
        children: [
          {
            text: 'Paragraph 1',
          },
        ],
      },
      {
        children: [
          {
            text: 'Paragraph 2',
          },
        ],
      },
    ]
    const html = '<p>Paragraph 1</p>Paragraph 2'
    expect(slateToHtml(slate)).toEqual(html)
  })

  it('converts a line break to a br tag', () => {
    const slate: any[] = [
      {
        children: [
          {
            text: '\n',
          },
        ],
      },
    ]
    const html = '<br>'
    expect(slateToHtml(slate, { ...slateToDomConfig, convertLineBreakToBr: true })).toEqual(html)
  })

  it('converts a line break in a paragraph to a br tag', () => {
    const slate: any[] = [
      {
        children: [
          {
            text: 'Paragraph with \n line',
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
    const html = '<p>Paragraph with <br> line<br><br>breaks.</p>'
    expect(slateToHtml(slate, { ...slateToDomConfig, convertLineBreakToBr: true })).toEqual(html)
  })

  it('does not insert a br tag after an inline element', () => {
    const slate: any[] = [
      {
        type: 'div',
        style: { padding: '10px' },
        children: [
          {
            type: 'link',
            children: [{ text: 'Mojo Nomad' }],
          },
          {
            text: ' was born from a desire to create',
          },
        ],
      },
    ]
    const html = '<a href>Mojo Nomad</a> was born from a desire to create'
    expect(slateToHtml(slate, { ...slateToDomConfig, convertLineBreakToBr: true })).toEqual(html)
  })
})

describe('edge cases', () => {
  it('handles null value for slate', () => {
    const slate: any = null
    const html = ''
    expect(slateToHtml(slate)).toEqual(html)
  })
})
