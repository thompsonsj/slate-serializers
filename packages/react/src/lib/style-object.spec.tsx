import renderer from 'react-test-renderer'
import { SlateToReact } from './serializers'
import { styleObjectFixtures } from '@slate-serializers/tests'

describe('style attribute css transforms with postcss', () => {
  for (const fixture of styleObjectFixtures) {
    it(`${fixture.name}`, () => {
      const tree = renderer.create(<SlateToReact node={fixture.slate} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  }
})
