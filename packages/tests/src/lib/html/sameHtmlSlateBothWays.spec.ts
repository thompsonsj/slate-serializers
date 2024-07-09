import { htmlToSlate, slateToHtml } from '@slate-serializers/html'
import { elementFixtures, textFixtures } from '../tests'

/**
 * Run tests both ways by using the same fixtures
 *
 * * textFixtures
 * * elementFixtures
 *
 * Test we get expected results in all fixtures using
 * * htmlToSlate
 * * slateToHtml
 */

describe('HTML to Slate JSON transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(htmlToSlate(fixture.html)).toEqual(fixture.slate)
      })
    }
  })
  describe('Text tags', () => {
    const fixtures = textFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(htmlToSlate(fixture.html)).toEqual(fixture.slate)
      })
    }
  })
})

describe('Slate JSON to HTML transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        expect(slateToHtml(fixture.slate)).toEqual(fixture.htmlFromSlate || fixture.html)
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
})
