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
