import { HtmlToSlateConfig } from '../../'
import { config as defaultConfig } from './default'

export const config: HtmlToSlateConfig = {
  ...defaultConfig,
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
}
