import { Element, Text } from 'domhandler'
import { config as defaultConfig } from './default'
import { SlateToDomConfig } from '../..'
import { styleToString } from '@slate-serializers/utilities';

/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */

export const config: SlateToDomConfig = {
  ...defaultConfig,
  elementAttributeTransform: ({ node }) => {
    if (node.align || node.textAlign) {
      return {
        style: styleToString({
          ['text-align']: node.align || node.textAlign,
        })
      }
    }
    return
  },
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
    upload: ({ node }) => {
      if (node.value?.mimeType && node.value?.url) {
        if (node.value?.mimeType.match(/^image/)) {
          return new Element('img', {
            src: node.value?.url,
          })
        }
        return new Element(
          'a',
          {
            href: node.value?.url,
          },
          [new Text(node.value?.filename)],
        )
      }
      return
    },
  },
  defaultTag: 'p',
}
