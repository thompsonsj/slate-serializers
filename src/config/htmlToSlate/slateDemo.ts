import { HtmlToSlateConfig } from '../../'
import { removeEmpty } from '../../utilities'
import { extractCssFromStyle } from '../../utilities/domhandler'

export const config: HtmlToSlateConfig = {
  elementTags: {
    blockquote: (el) => (
      removeEmpty({
        align: el && extractCssFromStyle(el, 'textAlign'),
        type: 'block-quote',
      })
    ),
    h1: (el) => (
      removeEmpty({
        align: el && extractCssFromStyle(el, 'textAlign'),
        type: 'heading-one',
      })
    ),
    h2: (el) => (
      removeEmpty({
        align: el && extractCssFromStyle(el, 'textAlign'),
        type: 'heading-two',
      })
    ),
    li: (el) => (
      removeEmpty({
        align: el && extractCssFromStyle(el, 'textAlign'),
        type: 'list-item',
      })
    ),
    ol: (el) => (
      removeEmpty({
        align: el && extractCssFromStyle(el, 'textAlign'),
        type: 'numbered-list',
      })
    ),
    p: (el) => (
      removeEmpty({
        align: el && extractCssFromStyle(el, 'textAlign'),
        type: 'paragraph',
      })
    ),
    ul: (el) => (
      removeEmpty({
        align: el && extractCssFromStyle(el, 'textAlign'),
        type: 'bulleted-list',
      })
    ),
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
  filterWhitespaceNodes: true,
}

