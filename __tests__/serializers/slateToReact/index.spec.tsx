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

  it('can handle inline code tags', () => {
    const html =
      '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a <pre><code>&lt;textarea&gt;</code></pre>!</p>'
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
    render(<SlateToReact node={slate} />)

    expect(screen.getByText('much').tagName).toBe('I')
  })
})
