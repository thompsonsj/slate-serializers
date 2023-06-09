import React from 'react'
import renderer from 'react-test-renderer';
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

    const tree = renderer
      .create(<SlateToReact node={slate} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
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
    const tree = renderer
      .create(<SlateToReact node={slate} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})
