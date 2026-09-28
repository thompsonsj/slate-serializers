import '@testing-library/jest-dom'
import { Fragment } from 'react'
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

describe('SlateToReact children passed to custom element transforms', () => {
  const capture = (node: any[]) => {
    const seen: any[] = []
    const config: SlateToReactConfig = {
      ...defaultReactConfig,
      elementTransforms: {
        ...defaultReactConfig.elementTransforms,
        probe: ({ children }) => {
          seen.push(children)
          return <div>{children}</div>
        },
      },
    }
    render(<SlateToReact node={node} config={config} />)
    return seen[0]
  }

  it('keeps one entry per Slate child, with element types unchanged', () => {
    const children = capture([
      { type: 'probe', children: [{ text: 'a' }, { type: 'link', url: '/', children: [{ text: 'l' }] }, { text: 'b', bold: true }] },
    ])
    expect(children).toHaveLength(3)
    expect(Array.isArray(children[0])).toBe(true)
    expect(children[1].type).toBe('a')
    expect(children[2][0].type).toBe('strong')
  })

  it('passes an empty array when the node has no children', () => {
    expect(capture([{ type: 'probe', children: [] }])).toEqual([])
  })
})

describe('SlateToReact keys from custom element transforms', () => {
  const config: SlateToReactConfig = {
    ...defaultReactConfig,
    elementTransforms: {
      ...defaultReactConfig.elementTransforms,
      card: ({ node, children }) => (
        <li key={node.id} data-id={node.id}>
          {children}
        </li>
      ),
    },
  }
  const list = (ids: string[]) => [
    {
      type: 'ul',
      children: ids.map((id) => ({ type: 'card', id, children: [{ text: id }, { text: '!', bold: true }] })),
    },
  ]

  it('keeps supplied keys so reordered elements keep their DOM nodes', () => {
    const { container, rerender } = render(<SlateToReact node={list(['a', 'b'])} config={config} />)
    const a = container.querySelector('[data-id="a"]')
    const b = container.querySelector('[data-id="b"]')
    rerender(<SlateToReact node={list(['b', 'a'])} config={config} />)
    expect(container.querySelector('[data-id="a"]')).toBe(a)
    expect(container.querySelector('[data-id="b"]')).toBe(b)
    expect(container.innerHTML).toEqual(
      '<ul><li data-id="b">b<strong>!</strong></li><li data-id="a">a<strong>!</strong></li></ul>',
    )
  })

  it('keeps a supplied Fragment key that uses the fallback prefix', () => {
    const prefixed: SlateToReactConfig = {
      ...config,
      elementTransforms: {
        ...config.elementTransforms,
        card: ({ node, children }) => (
          <Fragment key={`slate-serializers-card-${node.id}`}>
            <li data-id={node.id}>{children}</li>
          </Fragment>
        ),
      },
    }
    const { container, rerender } = render(<SlateToReact node={list(['a', 'b'])} config={prefixed} />)
    const a = container.querySelector('[data-id="a"]')
    rerender(<SlateToReact node={list(['b', 'a'])} config={prefixed} />)
    expect(container.querySelector('[data-id="a"]')).toBe(a)
  })

  it('does not collide supplied keys with fallback keys', () => {
    const colliding: SlateToReactConfig = {
      ...config,
      elementTransforms: {
        ...config.elementTransforms,
        card: ({ node, children }) => <li key={`slate-serializers-${node.id}`}>{children}</li>,
      },
    }
    const node = [
      { type: 'ul', children: [{ type: 'card', id: '0', children: [{ text: 'a' }] }, { type: 'li', children: [{ text: 'b' }] }] },
    ]
    const { container, errors } = renderCapturingErrors(<SlateToReact node={node} config={colliding} />)
    expect(errors.filter((e) => e.includes('same key') || e.includes('"key" prop'))).toEqual([])
    expect(container.innerHTML).toEqual('<ul><li>a</li><li>b</li></ul>')
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

  it('maps hyphenated and other aliased attribute names', () => {
    const aliasConfig: SlateToReactConfig = {
      ...defaultReactConfig,
      elementMap: { ...defaultReactConfig.elementMap, form: 'form', span: 'span' },
      elementAttributeTransform: ({ node }) => {
        if (node.type === 'form') return { 'accept-charset': 'utf-8' }
        if (node.type === 'span') return { charset: 'utf-8', 'http-equiv': 'refresh' }
        return undefined
      },
    }
    const { container, errors } = renderCapturingErrors(
      <SlateToReact
        node={[
          { type: 'form', children: [{ text: 'f' }] },
          { type: 'span', children: [{ text: 's' }] },
        ]}
        config={aliasConfig}
      />,
    )
    expect(errors.filter((e) => e.includes('Invalid DOM property'))).toEqual([])
    expect(container.querySelector('form')).toHaveAttribute('accept-charset', 'utf-8')
    expect(container.querySelector('span')).toHaveAttribute('charset', 'utf-8')
    expect(container.querySelector('span')).toHaveAttribute('http-equiv', 'refresh')
  })
})
