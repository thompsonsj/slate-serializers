import React from 'react'
import Button from './testComponents/Button'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { SlateToReact } from '../serializers'
import { config as defaultReactConfig } from '../config/default'
import { Config as SlateToReactConfig } from '../config/types'

afterEach(cleanup)

const defaultProps = {
  onClick: jest.fn(),
  children: <>Submit</>,
}

describe('simple button tests', () => {
  test('button renders with correct text', () => {
    const { queryByText, rerender } = render(<Button {...defaultProps} />)
    expect(queryByText('Submit')).toBeTruthy()

    // Change props
    rerender(<Button {...defaultProps} children={<>Go</>} />)
    expect(queryByText('Go')).toBeTruthy()
  })

  test('calls correct function on click', () => {
    const onClick = jest.fn()
    const { getByText } = render(<Button {...defaultProps} onClick={onClick} />)
    fireEvent.click(getByText('Submit'))
    expect(onClick).toHaveBeenCalled()
  })
})

describe('slateToReact: map element to button component', () => {
  it('renders a custom button', () => {
    const onClick = jest.fn()
    const slate = [
      {
        children: [
          {
            text: 'Paragraph',
          },
        ],
        type: 'p',
      },
      {
        children: [
          {
            text: 'Submit',
          },
        ],
        type: 'button',
      },
    ]

    const reactConfig: SlateToReactConfig = {
      ...defaultReactConfig,
      react: {
        elementTransforms: {
          ...defaultReactConfig.react.elementTransforms,
          button: ({ node, children = [] }) => {
            return <Button onClick={onClick}>{children}</Button>
          },
        },
      },
    }

    const { getByText } = render(<SlateToReact node={slate} config={reactConfig} />)
    fireEvent.click(getByText('Submit'))
    expect(onClick).toHaveBeenCalled()
  })
})
