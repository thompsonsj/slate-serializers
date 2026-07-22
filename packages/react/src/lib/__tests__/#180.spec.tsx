import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Element } from '@slate-serializers/dom'
import { SlateToReact } from '../react'
import { config as defaultReactConfig } from '../config/default'
import type { Config as SlateToReactConfig } from '../config/types'

/**
 * Regression coverage for https://github.com/thompsonsj/slate-serializers/issues/180
 * Leaf/element styles (e.g. color) should reach React as style props via transforms.
 */
describe('#180 leaf and element styles in SlateToReact', () => {
  it('renders leaf style.color via markTransforms.style', () => {
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
        children: [{ text: 'Painted', style: { color: '#f00' } }],
      },
    ]

    const { container } = render(<SlateToReact node={slate} config={config} />)
    expect(container.querySelector('span')).toHaveAttribute('style', expect.stringMatching(/color:\s*(#f00|rgb\(255,\s*0,\s*0\))/i))
    expect(container.querySelector('span')).toHaveTextContent('Painted')
  })

  it('renders leaf color via markTransforms.color', () => {
    const config: SlateToReactConfig = {
      ...defaultReactConfig,
      markTransforms: {
        color: ({ node }) =>
          new Element('span', {
            style: `color:${(node as { color?: string }).color};`,
          }),
      },
    }

    const slate = [
      {
        type: 'p',
        children: [{ text: 'Tinted', color: 'red' }],
      },
    ]

    const { container } = render(<SlateToReact node={slate} config={config} />)
    expect(container.querySelector('span')).toHaveAttribute('style', expect.stringContaining('color: red'))
  })

  it('renders element-level style from elementAttributeTransform', () => {
    const config: SlateToReactConfig = {
      ...defaultReactConfig,
      elementAttributeTransform: ({ node }) => {
        const style = (node as { style?: { color?: string } }).style
        return style?.color ? { style: `color: ${style.color};` } : {}
      },
    }

    const slate = [
      {
        type: 'p',
        style: { color: 'blue' },
        children: [{ text: 'Block colored' }],
      },
    ]

    const { container } = render(<SlateToReact node={slate} config={config} />)
    expect(container.querySelector('p')).toHaveAttribute('style', expect.stringContaining('color: blue'))
  })
})
