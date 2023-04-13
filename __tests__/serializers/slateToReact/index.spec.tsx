import React, { ReactElement, ReactNode, JSXElementConstructor } from 'react'
import { Element } from "domhandler"
import { getName } from 'domutils'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

const domElementToReactElement = (element: Element): ReactElement<any, string | JSXElementConstructor<any>> => React.createElement(
  getName(element),
  { className: 'greeting' },
  "Heading"
)

describe("React conversion", () => {
  test("convert domhandler element to React element", async () => {
    const element = new Element('h1', {
      
    })
    // ARRANGE
    render(domElementToReactElement(element))

    // ACT
    await screen.findByRole('heading')

    // ASSERT
    expect(screen.getByRole('heading')).toHaveTextContent('Heading')
  })
})
