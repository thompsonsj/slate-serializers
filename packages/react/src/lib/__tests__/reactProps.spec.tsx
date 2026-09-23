import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { SlateToReact } from '../react'
import { config as defaultReactConfig } from '../config/default'
import { config as payloadReactConfig } from '../config/payload'
import type { Config as SlateToReactConfig } from '../config/types'

const renderCapturingErrors = (ui: React.ReactElement) => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  try {
    const result = render(ui)
    return { ...result, errors: spy.mock.calls.map((args) => args.map(String).join(' ')) }
  } finally {
    spy.mockRestore()
  }
}

describe('SlateToReact list keys', () => {
  it.each([
    ['a single paragraph', [{ type: 'p', children: [{ text: 'a' }] }]],
    ['multiple marked leaves', [{ type: 'p', children: [{ text: 'a' }, { text: 'b', bold: true, italic: true }] }]],
    ['a line break', [{ type: 'p', children: [{ text: 'a\nb' }] }]],
    [
      'nested lists',
      [{ type: 'ul', children: [{ type: 'li', children: [{ text: 'a' }] }, { type: 'li', children: [{ text: 'b' }] }] }],
    ],
    [
      'a link element transform',
      [{ type: 'p', children: [{ text: 'a ' }, { type: 'link', url: '/x', children: [{ text: 'l' }, { text: 'm', bold: true }] }] }],
    ],
    ['a quote element transform', [{ type: 'quote', children: [{ text: 'q' }, { text: 'r', italic: true }] }]],
    ['a node with no type', [{ children: [{ text: 'a' }, { text: 'b' }] }]],
  ])('renders %s without key warnings', (_label, node) => {
    const { errors } = renderCapturingErrors(<SlateToReact node={node} />)
    expect(errors.filter((e) => e.includes('"key" prop'))).toEqual([])
  })

  it('renders the Payload config without key warnings', () => {
    const node = [
      { children: [{ text: 'a' }, { text: 'b', bold: true }] },
      { type: 'link', linkType: 'custom', url: '/x', children: [{ text: 'l' }] },
    ]
    const { errors } = renderCapturingErrors(<SlateToReact node={node} config={payloadReactConfig} />)
    expect(errors.filter((e) => e.includes('"key" prop'))).toEqual([])
  })

  it('renders marks, line breaks and element transforms', () => {
    const node = [
      { type: 'p', children: [{ text: 'a ' }, { text: 'b', bold: true }, { text: '\nc' }] },
      { type: 'quote', children: [{ text: 'q' }] },
    ]
    const config: SlateToReactConfig = { ...defaultReactConfig, convertLineBreakToBr: true }
    const { container } = render(<SlateToReact node={node} config={config} />)
    expect(container.innerHTML).toEqual(
      '<p>a <strong>b</strong><br>c</p><blockquote><p>q</p></blockquote>',
    )
  })
})

describe('SlateToReact convertLineBreakToBr', () => {
  const config: SlateToReactConfig = { ...defaultReactConfig, convertLineBreakToBr: true }

  it('renders \\n as <br>, matching slateToHtml', () => {
    const { container } = render(<SlateToReact node={[{ type: 'p', children: [{ text: 'a\nb\nc' }] }]} config={config} />)
    expect(container.innerHTML).toEqual('<p>a<br>b<br>c</p>')
  })

  it('renders <br> inside marks', () => {
    const { container } = render(
      <SlateToReact node={[{ type: 'p', children: [{ text: 'a\nb', bold: true }] }]} config={config} />,
    )
    expect(container.innerHTML).toEqual('<p><strong>a</strong><br><strong>b</strong></p>')
  })

  it('leaves \\n as text when the option is off', () => {
    const { container } = render(<SlateToReact node={[{ type: 'p', children: [{ text: 'a\nb' }] }]} />)
    expect(container.innerHTML).toEqual('<p>a\nb</p>')
  })
})

describe('SlateToReact attribute names', () => {
  const config: SlateToReactConfig = {
    ...defaultReactConfig,
    elementMap: { ...defaultReactConfig.elementMap, td: 'td', label: 'label' },
    elementAttributeTransform: ({ node }) => {
      if (node.type === 'td') return { colspan: '2', rowspan: '3' }
      if (node.type === 'label') return { for: 'field', tabindex: '0', 'data-id': 'x', 'aria-label': 'L', class: 'c' }
      return undefined
    },
  }
  const node = [
    { type: 'td', children: [{ text: 't' }] },
    { type: 'label', children: [{ text: 'l' }] },
  ]

  it('maps HTML attribute names to React props without warnings', () => {
    const { container, errors } = renderCapturingErrors(
      <table>
        <tbody>
          <tr>
            <SlateToReact node={node.slice(0, 1)} config={config} />
          </tr>
        </tbody>
      </table>,
    )
    expect(errors.filter((e) => e.includes('Invalid DOM property'))).toEqual([])
    const td = container.querySelector('td')
    expect(td).toHaveAttribute('colspan', '2')
    expect(td).toHaveAttribute('rowspan', '3')
  })

  it('keeps for, tabindex, data-*, aria-* and class attributes', () => {
    const { container, errors } = renderCapturingErrors(<SlateToReact node={node.slice(1)} config={config} />)
    expect(errors.filter((e) => e.includes('Invalid DOM property'))).toEqual([])
    const label = container.querySelector('label')
    expect(label).toHaveAttribute('for', 'field')
    expect(label).toHaveAttribute('tabindex', '0')
    expect(label).toHaveAttribute('data-id', 'x')
    expect(label).toHaveAttribute('aria-label', 'L')
    expect(label).toHaveClass('c')
  })
})
