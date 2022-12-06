import { HtmlToSlateConfig } from '../../'

export const config: HtmlToSlateConfig = {
  elementStyleMap: {
    align: 'textAlign',
  },
  elementTags: {
    blockquote: () => ({
      type: 'block-quote',
    }),
    h1: () => ({
      type: 'heading-one',
    }),
    h2: () => ({
      type: 'heading-two',
    }),
    li: () => ({
      type: 'list-item',
    }),
    ol: () => ({
      type: 'numbered-list',
    }),
    ul: () => ({
      type: 'bulleted-list',
    }),
    p: () => ({
      type: 'paragraph',
    }),
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
}
