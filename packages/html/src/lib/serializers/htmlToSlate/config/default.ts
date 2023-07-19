import { getAttributeValue } from 'domutils'
import { Config } from './types'
import { extractCssFromStyle } from '@slate-serializers/dom'

export const config: Config = {
  elementAttributeTransform: ({ el }) => {
    const attrs: { [key: string]: string }  = {}
    const elementStyleMap: { [key: string]: string } = {
      align: 'textAlign',
    }
    Object.keys(elementStyleMap).forEach((slateKey) => {
      const cssProperty = elementStyleMap[slateKey]
      const cssValue = extractCssFromStyle(el, cssProperty)
      if (cssValue) {
        attrs[slateKey] = cssValue
      }
    })
    return attrs
  },
  elementTags: {
    a: (el) => ({
      type: 'link',
      newTab: el && getAttributeValue(el, 'target') === '_blank',
      url: el && getAttributeValue(el, 'href'),
    }),
    blockquote: () => ({ type: 'blockquote' }),
    h1: () => ({ type: 'h1' }),
    h2: () => ({ type: 'h2' }),
    h3: () => ({ type: 'h3' }),
    h4: () => ({ type: 'h4' }),
    h5: () => ({ type: 'h5' }),
    h6: () => ({ type: 'h6' }),
    li: () => ({ type: 'li' }),
    ol: () => ({ type: 'ol' }),
    p: () => ({ type: 'p' }),
    ul: () => ({ type: 'ul' }),
  },
  textTags: {
    code: () => ({ code: true }),
    pre: () => ({ code: true }),
    del: () => ({ strikethrough: true }),
    em: () => ({ italic: true }),
    i: () => ({ italic: true }),
    s: () => ({ strikethrough: true }),
    strong: () => ({ bold: true }),
    u: () => ({ underline: true }),
  },
  htmlPreProcessString: (html) => html.replace(/<pre[^>]*>/g, '<code>').replace(/<\/pre>/g, '</code>'),
  filterWhitespaceNodes: true,
  convertBrToLineBreak: true,
}
