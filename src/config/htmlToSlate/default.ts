import { getAttributeValue } from 'domutils'
import { Element } from 'domhandler'

interface ItagMap {
  [key: string]: (a?: Element) => object
}

export interface Config {
  elementTags: ItagMap
  textTags: ItagMap
}

export const config: Config = {
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
}
