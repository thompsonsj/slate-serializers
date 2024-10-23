import { ChildNode, Element, Text } from 'domhandler'
import { find } from 'domutils'
import { slateToHtml } from '.'
import { slateToHtmlConfig } from '@slate-serializers/html'
import { isEmptyObject, styleMapToAttribs } from '@slate-serializers/dom'

describe('custom config', () => {
  
  // can this be replaced by mapTransforms?
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
      ...slateToHtmlConfig,
      elementAttributeTransform: ({ node }: { node: any }) => {
        const elementStyleMap: { [key: string]: string } = {
          fontSize: 'font-size',
        }
        const attribs = styleMapToAttribs({elementStyleMap, node})      
        return isEmptyObject(attribs) ? {} : attribs
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
      ...slateToHtmlConfig,
      markMap: {
        ...slateToHtmlConfig.markMap,
        subscript: ['sub'],
      },
      markTransforms: {
        ...slateToHtmlConfig.markTransforms,
        style: ({ node }: { node?: any }) => {
          return new Element('span', {
            ...(node.style?.fontSize && { style: `font-size:${node.style.fontSize};` }),
          })
        },
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('demo for issue #75', () => {
    const html = '<placeholder><strong>${name}</strong></placeholder>'
    const slate = [
      {
        type: 'placeholder',
        value: 'name',
        children: [
          {
            text: 'name',
            bold: true,
          },
        ],
      },
    ]
    const config = {
      ...slateToHtmlConfig,
      elementTransforms: {
        ...slateToHtmlConfig.elementTransforms,
        placeholder: ({ node, children = [] }: { node?: any; children?: ChildNode[] }) => {
          // find the first text element - limit to 10 levels deep
          const textElement = find((child) => child.type === 'text', children, true, 10)
          // if a text element is found, replace the text with the value
          if (textElement.length > 0) {
            const value = `${'${' + node.value + '}'}`
            // note that we can assume textElement[0] is a Text node because we found it above
            ;(textElement[0] as Text).data = value
          }
          return new Element('placeholder', {}, children)
        },
      },
      encodeEntities: false,
      alwaysEncodeBreakingEntities: true,
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
    expect(slateToHtml(slate, { ...slateToHtmlConfig, convertLineBreakToBr: true })).toEqual(html)
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
    expect(slateToHtml(slate, { ...slateToHtmlConfig, convertLineBreakToBr: true })).toEqual(html)
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
    expect(slateToHtml(slate, { ...slateToHtmlConfig, convertLineBreakToBr: true })).toEqual(html)
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
    expect(slateToHtml(slate, { ...slateToHtmlConfig, convertLineBreakToBr: true })).toEqual(html)
  })
})

describe('edge cases', () => {
  it('handles null value for slate', () => {
    const slate: any = null
    const html = ''
    expect(slateToHtml(slate)).toEqual(html)
  })
})
