import { config as defaultConfig } from './default'
import { payloadSlateToDomConfig } from '@slate-serializers/dom'
import { Config as SlateToReactConfig } from './types'

/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */

export const config: SlateToReactConfig = {
  ...defaultConfig,
  dom: payloadSlateToDomConfig,
  react: {
    elementTransforms: {
      ...defaultConfig.react.elementTransforms,
      link: ({ node, children = [] }) => {
        const attrs: any = {}
        if (node.linkType) {
          attrs['data-link-type'] = node.linkType
        }
        if (node.newTab) {
          attrs.target = '_blank'
        }
        return (
          <a href={node.url} {...attrs}>
            {children}
          </a>
        )
      },
    },
  },
}
