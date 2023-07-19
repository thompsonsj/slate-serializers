import renderer from 'react-test-renderer'
import { SlateToReact } from './serializers'
import { styleObjectFixtures } from '@slate-serializers/tests'
import { config as defaultReactConfig } from './config/default'
import { Config as SlateToReactConfig } from './config/types'
import { transformStyleObjectToString } from '@slate-serializers/utilities'

const reactConfig: SlateToReactConfig = {
  ...defaultReactConfig,
  dom: {
    ...defaultReactConfig.dom,
    elementAttributeTransform: ({ node }) => {
      const style = transformStyleObjectToString(node.style)
      return style ? { style } : undefined
    }
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
