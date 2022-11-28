import { config as defaultConfig, Config } from './default'
import { Element } from 'domhandler'

/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */

export const config: Config = {
  ...defaultConfig,
  elementTransforms: {
    ...defaultConfig.elementTransforms,
    link: (node, children = []) => {
      const attrs: any = {}
      if (node.linkType) {
        attrs['data-link-type'] = node.linkType
      }
      if (node.newTab) {
        attrs.target = '_blank'
      }
      return new Element(
        'a',
        {
          href: node.url,
          ...attrs,
        },
        children,
      )
    },
  },
}
