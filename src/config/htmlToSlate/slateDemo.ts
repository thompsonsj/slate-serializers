import { getAttributeValue } from 'domutils'
import { HtmlToSlateConfig } from '../../'
import { renameTag } from '../../utilities/update-html'
import { parseStyleCssText } from '../../utilities'

export const config: HtmlToSlateConfig = {
  elementTags: {
    a: (el) => ({
      type: 'link',
      newTab: el && getAttributeValue(el, 'target') === '_blank',
      url: el && getAttributeValue(el, 'href'),
    }),
    blockquote: () => ({ type: 'block-quote' }),
    h1: () => ({ type: 'heading-one' }),
    h2: () => ({ type: 'heading-two' }),
    li: () => ({ type: 'list-item' }),
    ol: () => ({ type: 'numbered-list' }),
    p: (el) => {
      const cssText = el && getAttributeValue(el, 'style')
      if (cssText) {
        const css = parseStyleCssText(cssText)
        if (css.textAlign) {
          return {
            type: 'paragraph',
            align: css.textAlign
          }
        }
      }
      return { 
        type: 'paragraph'
      }
    },
    ul: () => ({ type: 'bulleted-list' }),
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
  htmlPreProcessString: (html) => html.replace(/<pre[^>]*>/g,'<code>').replace(/<\/pre>/g,'</code>'),
  htmlUpdaterMap: {
    ...renameTag('pre', 'code')
  },
  filterWhitespaceNodes: true,
}

