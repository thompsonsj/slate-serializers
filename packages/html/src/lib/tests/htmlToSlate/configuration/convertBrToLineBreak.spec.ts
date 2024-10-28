// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  htmlToSlate,
  htmlToSlateConfig,
} from '@slate-serializers/html';
import { Descendant } from 'slate';

describe("htmlToSlate configuration: convertBrToLineBreak", () => {
  it('converts a br tag to a line break', () => {
    const html = 'Line 1<br />Line 2'
    const slate = [
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
    const slate = [
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
    const slate: Descendant[] = []
    expect(htmlToSlate(html, { ...htmlToSlateConfig, convertBrToLineBreak: false })).toEqual(slate)
  })

  it('converts a br tag to a slate node if defined as an element tag', () => {
    const html = '<br />'
    const slate = [
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
    const slate = [
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
    const slate = [
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
