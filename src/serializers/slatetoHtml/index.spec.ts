import { slateToHtml } from '.'
import { fixtures as elementFixtures } from '../../__tests__/fixtures/elementTags'
import { fixtures as textFixtures } from '../../__tests__/fixtures/textTags'
import { fixtures as combinedFixtures } from '../../__tests__/fixtures/combined'

describe('Slate JSON to HTML transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(slateToHtml(fixture.slate)).toEqual(fixture.html)
      })
    }
  })
  describe('Text tags', () => {
    const fixtures = textFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(slateToHtml(fixture.slate)).toEqual(fixture.html)
      })
    }
  })
  describe('Combined', () => {
    const fixtures = combinedFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(slateToHtml(fixture.slate)).toEqual(fixture.html)
      })
    }
  })
})
