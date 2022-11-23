import { slateToHtml } from '.'
import { fixtures as elementFixtures } from '../../__tests__/fixtures/elementTags'
import { fixtures as textFixtures } from '../../__tests__/fixtures/textTags'

describe('Slate JSON to HTML transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (let i = 0; i < fixtures.length; i++) {
      it(`${fixtures[i].name}`, () => {
        expect(slateToHtml(fixtures[i].slate)).toEqual(fixtures[i].html)
      })
    }
  })
  describe('Text tags', () => {
    const fixtures = textFixtures
    for (let i = 0; i < fixtures.length; i++) {
      it(`${fixtures[i].name}`, () => {
        expect(slateToHtml(fixtures[i].slate)).toEqual(fixtures[i].html)
      })
    }
  })
})
