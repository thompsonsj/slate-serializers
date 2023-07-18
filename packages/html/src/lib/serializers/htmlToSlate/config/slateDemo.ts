import { Config } from './types'
import { config as defaultConfig } from './default'

export const config: Config = {
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
