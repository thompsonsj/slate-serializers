import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { combinedFixtures, elementFixtures, textFixtures } from '../tests'
import { SlateToReact, payloadSlateToReactConfig } from '@slate-serializers/react'

describe('Slate JSON to React transforms', () => {
  describe('Element tags', () => {
    const fixtures = elementFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = render(<SlateToReact node={fixture.slate} config={payloadSlateToReactConfig} />)
        expect(tree.container).toMatchSnapshot()
      })
    }
  })
  describe('Text tags', () => {
    const fixtures = textFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = render(<SlateToReact node={fixture.slate} config={payloadSlateToReactConfig} />)
        expect(tree.container).toMatchSnapshot()
      })
    }
  })
  describe('Combined', () => {
    const fixtures = combinedFixtures
    for (const fixture of fixtures) {
      it(`${fixture.name}`, () => {
        const tree = render(<SlateToReact node={fixture.slateOriginal} config={payloadSlateToReactConfig} />)
        expect(tree.container).toMatchSnapshot()
      })
    }
  })
})
