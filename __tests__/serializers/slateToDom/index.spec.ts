import { slateToDom } from '../../../src'
import { selectAll } from 'css-select'
import { parseDocument } from 'htmlparser2'
import { replaceElement } from 'domutils'
import { Element, Node } from 'domhandler'
import serializer from 'dom-serializer'

describe('slateToDom expected behaviour', () => {
  it('can modify resulting DOM document object', () => {
    const html = `<h2 class=\"heading-two\">Heading 2</h2><p>Paragraph.</p><h2 class=\"heading-two\">Second Heading 2</h2>`
    const slate = [
      {
        children: [
          {
            text: 'Heading 2',
          },
        ],
        type: 'h2',
      },
      {
        children: [
          {
            text: 'Paragraph.',
          },
        ],
        type: 'p',
      },
      {
        children: [
          {
            text: 'Second Heading 2',
          },
        ],
        type: 'h2',
      },
    ]
    // serializer and parseDocument are required operations before
    // replaceElement will take effect. This negates the usefulness
    // of slateToDom in this use case.
    const document = parseDocument(serializer(slateToDom(slate)))
    selectAll<Node, Node>('h2', document as any).forEach((element: any) => {
      replaceElement(element, new Element('h2', { ...element.attribs, class: 'heading-two' }, element.children))
    })
    expect(serializer(document)).toEqual(html)
  })
})
