import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Element } from '@slate-serializers/dom'
import { SlateToReact } from '../react'
import { config as defaultReactConfig } from '../config/default'
import type { Config as SlateToReactConfig } from '../config/types'

describe('SlateToReact style attributes', () => {
  it('applies default align as a React style object', () => {
    const slate = [
      {
        type: 'p',
        align: 'right',
        children: [{ text: 'Aligned' }],
      },
    ]

    const { container } = render(<SlateToReact node={slate} />)
    expect(container.querySelector('p')).toHaveAttribute('style', expect.stringContaining('text-align: right'))
  })

  it('converts CSS style strings from elementAttributeTransform', () => {
    const config: SlateToReactConfig = {
      ...defaultReactConfig,
      elementAttributeTransform: () => ({
        style: 'color: red; font-size: 20px',
      }),
    }

    const slate = [
      {
        type: 'p',
        children: [{ text: 'Colored' }],
      },
    ]

    const { container } = render(<SlateToReact node={slate} config={config} />)
    const style = container.querySelector('p')?.getAttribute('style') || ''
    expect(style).toContain('color: red')
    expect(style).toContain('font-size: 20px')
  })

  it('applies mark style transforms as React style objects', () => {
    const config: SlateToReactConfig = {
      ...defaultReactConfig,
      markTransforms: {
        style: ({ node }) =>
          new Element('span', {
            style: `color: ${(node as { style?: { color?: string } }).style?.color};`,
          }),
      },
    }

    const slate = [
      {
        type: 'p',
        children: [
          {
            text: 'Highlighted',
            style: { color: 'red' },
          },
        ],
      },
    ]

    const { container } = render(<SlateToReact node={slate} config={config} />)
    expect(container.querySelector('span')).toHaveAttribute('style', expect.stringContaining('color: red'))
  })
})
