import { config as defaultConfig } from './default'
import { Config } from './types'
import { escapeText, image, link } from '../utilities'

/**
 * Configuration for Payload CMS (Slate rich text).
 */
export const config: Config = {
  ...defaultConfig,
  elementTransforms: {
    ...defaultConfig.elementTransforms,
    upload: ({ node }) => {
      const url = node.value?.url
      if (!url) {
        return undefined
      }
      const label: string = node.value?.alt || node.value?.filename || ''
      return node.value?.mimeType?.match(/^image/) ? image(label, url) : link(escapeText(label || url), url)
    },
  },
}
