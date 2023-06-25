import React from 'react'
import renderer from 'react-test-renderer';
import { fixtures as elementFixtures } from '../combined/fixtures/elementTags'
import { fixtures as textFixtures } from '../combined/fixtures/textTags'
import { SlateToReact } from '../../../src/serializers/slateToReact'

describe('Slate JSON to React transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        // console.log((<SlateToReact node={fixture.slate} />).props, (<SlateToReact node={fixture.slate} />).props.node.map((node: any) => node.children))
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
})