import { Element } from 'domhandler'
import { nestedMarkElementsString } from '../../src/utilities/domhandler'

/**
 * Helper functions for domhandler
 */

describe('nestedMarkElementsString', () => {
  it('nests text in 1 mark element', () => {
    expect(nestedMarkElementsString([new Element('u', {})], 'Unarticulated Annotation text')).toEqual(
      '<u>Unarticulated Annotation text</u>',
    )
  })

  it('nests text in 2 mark elements', () => {
    expect(
      nestedMarkElementsString(
        [new Element('u', {}), new Element('i', {})],
        'Unarticulated Annotation, and Idiomatic Text text',
      ),
    ).toEqual('<u><i>Unarticulated Annotation, and Idiomatic Text text</i></u>')
  })

  it('nests text in 3 mark elements', () => {
    expect(
      nestedMarkElementsString(
        [new Element('u', {}), new Element('i', {}), new Element('strong', {})],
        'Strong Importance, Unarticulated Annotation, and Idiomatic Text text',
      ),
    ).toEqual('<u><i><strong>Strong Importance, Unarticulated Annotation, and Idiomatic Text text</strong></i></u>')
  })

  it('nests text in 4 mark elements', () => {
    expect(
      nestedMarkElementsString(
        [new Element('u', {}), new Element('i', {}), new Element('strong', {}), new Element('s', {})],
        'Strong Importance, Unarticulated Annotation, Idiomatic Text and Strikethrough text',
      ),
    ).toEqual(
      '<u><i><strong><s>Strong Importance, Unarticulated Annotation, Idiomatic Text and Strikethrough text</s></strong></i></u>',
    )
  })
})
