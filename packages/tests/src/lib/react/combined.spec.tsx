import React from 'react'
import renderer from 'react-test-renderer'
import { combinedFixtures, elementFixtures, textFixtures } from '../tests'
import { SlateToReact } from '@slate-serializers/react'

describe('Slate JSON to React transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = renderer.create(<SlateToReact node={fixture.slate} />).toJSON()
        expect(tree).toMatchSnapshot()
      })
    }
  })
  describe('Text tags', () => {
    const fixtures = textFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = renderer.create(<SlateToReact node={fixture.slate} />).toJSON()
        expect(tree).toMatchSnapshot()
      })
    }
  })
  describe('Combined', () => {
    const fixtures = combinedFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = renderer.create(<SlateToReact node={fixture.slateOriginal} />).toJSON()
        expect(tree).toMatchSnapshot()
      })
    }
  })
})
