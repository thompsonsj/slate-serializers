import React, { ReactElement, ReactNode, JSXElementConstructor } from 'react'
import { Element } from "domhandler"
import { getName } from 'domutils'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { SlateToReact } from '../../../src/serializers/slateToReact'

describe("React conversion", () => {
  test("convert domhandler element to React element", async () => {
    const slate = [
      {
        children: [
          {
            text: "Paragraph",
          },
        ],
        type: 'p',
      },
    ]

    render(<SlateToReact node={slate} />)

    expect(screen.getByText('Paragraph').tagName).toBe('P')
  })
})
