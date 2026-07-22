import { htmlToSlate } from '.'

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

describe('gatherTextMarkAttributes branching', () => {
  it('applies marks to sibling children under a shared parent', () => {
    const html = '<p><strong><em>a</em><u>b</u></strong></p>'
    expect(htmlToSlate(html)).toEqual([
      {
        type: 'p',
        children: [
          { text: 'a', bold: true, italic: true },
          { text: 'b', bold: true, underline: true },
        ],
      },
    ])
  })

  it('applies marks when plain text and nested marks are siblings', () => {
    const html = '<p><strong>plain <em>nested</em></strong></p>'
    expect(htmlToSlate(html)).toEqual([
      {
        type: 'p',
        children: [
          { text: 'plain ', bold: true },
          { text: 'nested', bold: true, italic: true },
        ],
      },
    ])
  })

  it('gathers attributes through a deep single-child mark chain', () => {
    const html = '<p><strong><em><u><s>deep</s></u></em></strong></p>'
    expect(htmlToSlate(html)).toEqual([
      {
        type: 'p',
        children: [
          {
            text: 'deep',
            bold: true,
            italic: true,
            underline: true,
            strikethrough: true,
          },
        ],
      },
    ])
  })
})

describe('htmlToSlate edge inputs', () => {
  it('ignores comment nodes', () => {
    expect(htmlToSlate('<!-- note --><p>Hi</p>')).toEqual([
      {
        type: 'p',
        children: [{ text: 'Hi' }],
      },
    ])
  })

  it('treats body as a fragment wrapper (children stay nested under the fragment)', () => {
    // htmlparser2 + slate-hyperscript leave body as an untyped fragment node.
    expect(htmlToSlate('<body><p>One</p><p>Two</p></body>')).toEqual([
      {
        children: [
          {
            type: 'p',
            children: [{ text: 'One' }],
          },
          {
            type: 'p',
            children: [{ text: 'Two' }],
          },
        ],
      },
    ])
  })
})
