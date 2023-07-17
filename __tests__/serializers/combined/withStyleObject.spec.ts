import { htmlToSlate, slateToHtml } from '../../../src'
import { fixtures, slateToDomConfigStyleObject, htmlToSlateConfigStyleObject } from './fixtures/withStyleObject'


describe('style attribute css transforms with postcss', () => {
  for (const fixture of fixtures) {
    it(`${fixture.name}`, () => {
      expect(slateToHtml(fixture.slate, slateToDomConfigStyleObject )).toEqual(fixture.html)
      expect(htmlToSlate(fixture.html, htmlToSlateConfigStyleObject)).toEqual(fixture.slate)
    })
  }
})
