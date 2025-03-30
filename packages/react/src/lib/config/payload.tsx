// eslint-disable-next-line @nx/enforce-module-boundaries
import { slateToReactConfig } from '@slate-serializers/react'
import { payloadSlateToDomConfig } from '@slate-serializers/dom'
import { Config as SlateToReactConfig } from './types'
import { ulid } from 'ulidx'

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
        <a key={ulid()} href={node.url} {...attrs}>
          {children}
        </a>
      )
    },
  },
}
