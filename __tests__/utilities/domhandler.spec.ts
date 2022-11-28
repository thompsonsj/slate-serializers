import { nestedMarkElementsString } from '../../src/utilities/domhandler'

/**
 * Helper functions for domhandler
 */

describe('nestedMarkElementsString', () => {
  it('nests text in 1 mark element', () => {
    expect(nestedMarkElementsString(['u'], 'Unarticulated Annotation text')).toEqual(
      '<u>Unarticulated Annotation text</u>',
    )
  })

  it('nests text in 2 mark elements', () => {
    expect(nestedMarkElementsString(['u', 'i'], 'Unarticulated Annotation, and Idiomatic Text text')).toEqual(
      '<u><i>Unarticulated Annotation, and Idiomatic Text text</i></u>',
    )
  })

  it('nests text in 3 mark elements', () => {
    expect(
      nestedMarkElementsString(
        ['u', 'i', 'strong'],
        'Strong Importance, Unarticulated Annotation, and Idiomatic Text text',
      ),
    ).toEqual('<u><i><strong>Strong Importance, Unarticulated Annotation, and Idiomatic Text text</strong></i></u>')
  })

  it('nests text in 4 mark elements', () => {
    expect(
      nestedMarkElementsString(
        ['u', 'i', 'strong', 's'],
        'Strong Importance, Unarticulated Annotation, Idiomatic Text and Strikethrough text',
      ),
    ).toEqual(
      '<u><i><strong><s>Strong Importance, Unarticulated Annotation, Idiomatic Text and Strikethrough text</s></strong></i></u>',
    )
  })
})
