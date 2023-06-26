import React from 'react'
import { config as defaultConfig } from './default'
import { SlateToReactConfig } from '../../react'

/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */

export const config: SlateToReactConfig = {
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
      return (
        <a href={node.url} {...attrs}>
          {children}
        </a>
      )
    },
  },
}
