import { combinedFixtures, elementFixtures, textFixtures } from '@slate-serializers/tests'
import { slateToTemplate } from '../serializers'
import { config as payloadSlateToTemplateConfig } from '../config/payload'

describe('Slate JSON to React transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = slateToTemplate(fixture.slate, payloadSlateToTemplateConfig)
        expect(tree).toMatchSnapshot()
      })
    }
  })
  describe('Text tags', () => {
    const fixtures = textFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = slateToTemplate(fixture.slate, payloadSlateToTemplateConfig)
        expect(tree).toMatchSnapshot()
      })
    }
  })
  describe('Combined', () => {
    const fixtures = combinedFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = slateToTemplate(fixture.slateOriginal, payloadSlateToTemplateConfig)
        expect(tree).toMatchSnapshot()
      })
    }
  })
})
