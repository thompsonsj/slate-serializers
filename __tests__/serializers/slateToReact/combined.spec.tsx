import React from 'react'
import renderer from 'react-test-renderer';
import { fixtures as elementFixtures } from '../combined/fixtures/elementTags'
import { fixtures as textFixtures } from '../combined/fixtures/textTags'
import { fixtures as combinedFixtures } from '../combined/fixtures/combined'
import { SlateToReact } from '../../../src/serializers/slateToReact'

describe('Slate JSON to React transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = renderer
          .create(<SlateToReact node={fixture.slate} />)
          .toJSON();
        expect(tree).toMatchSnapshot();
      })
    }
  })
  describe('Text tags', () => {
    const fixtures = textFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = renderer
          .create(<SlateToReact node={fixture.slate} />)
          .toJSON();
        expect(tree).toMatchSnapshot();
      })
    }
  })
  describe('Combined', () => {
    const fixtures = combinedFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = renderer
          .create(<SlateToReact node={fixture.slateOriginal} />)
          .toJSON();
        expect(tree).toMatchSnapshot();
      })
    }
  })
})