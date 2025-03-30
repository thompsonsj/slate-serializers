import renderer from 'react-test-renderer'
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
      const tree = renderer.create(<SlateToReact node={fixture.slate} config={reactConfig} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  }
})
