import { Element } from 'domhandler'
import { config as defaultConfig } from './default'
import { SlateToDomConfig } from '../..'

/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */

export const config: SlateToDomConfig = {
  ...defaultConfig,
  elementTransforms: {
    ...defaultConfig.elementTransforms,
    link: ({ node, children = [] }) => {
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
  defaultTag: 'p',
}
