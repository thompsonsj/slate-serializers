import { getAttributeValue } from 'domutils'
import { HtmlToSlateConfig } from '../../'
import { renameTag } from '../../utilities/update-html'

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
    p: () => ({ type: 'paragraph' }),
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

