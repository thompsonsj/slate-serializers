// eslint-disable-next-line @nx/enforce-module-boundaries
import { config as slateToReactConfig } from './default'
import { payloadSlateToDomConfig } from '@slate-serializers/dom'
import { Config as SlateToReactConfig } from './types'

/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */
export const config: SlateToReactConfig = {
  markMap: payloadSlateToDomConfig.markMap,
  elementMap: payloadSlateToDomConfig.elementMap,
  elementAttributeTransform: payloadSlateToDomConfig.elementAttributeTransform,
  defaultTag: payloadSlateToDomConfig.defaultTag,
  encodeEntities: payloadSlateToDomConfig.encodeEntities,
  alwaysEncodeBreakingEntities: payloadSlateToDomConfig.alwaysEncodeBreakingEntities,
  alwaysEncodeCodeEntities: payloadSlateToDomConfig.alwaysEncodeCodeEntities,
  convertLineBreakToBr: payloadSlateToDomConfig.convertLineBreakToBr,
  elementTransforms: {
    ...slateToReactConfig.elementTransforms,
    link: ({ node, children = [] }) => {
      const attrs: {[key: string]: string} = {}
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
}
