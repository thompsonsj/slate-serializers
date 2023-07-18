import { Config } from './types'
import { config as defaultConfig } from './default'
import { getAttributeValue } from 'domutils'

/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */

export const config: Config = {
  ...defaultConfig,
  elementTags: {
    ...defaultConfig.elementTags,
    a: (el) => ({
      type: 'link',
      linkType: el && getAttributeValue(el, 'data-link-type'),
      newTab: el && getAttributeValue(el, 'target') === '_blank',
      url: el && getAttributeValue(el, 'href'),
    }),
  },
}
