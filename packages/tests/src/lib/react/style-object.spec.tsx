import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { SlateToReact, slateToReactConfig as defaultReactConfig, SlateToReactConfig } from '@slate-serializers/react'
import { styleObjectFixtures } from './../tests'
import { transformStyleObjectToString } from '@slate-serializers/utilities'

const reactConfig: SlateToReactConfig = {
  ...defaultReactConfig,
  elementAttributeTransform: ({ node }) => {
    const style = transformStyleObjectToString(node.style)
    return style ? { style } : undefined
  }
}

describe('style attribute css transforms with postcss', () => {
  for (const fixture of styleObjectFixtures) {
    it(`${fixture.name}`, () => {
      const tree = render(<SlateToReact node={fixture.slate} config={reactConfig} />)
      expect(tree.container).toMatchSnapshot()
    })
  }
})
