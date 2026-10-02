export { slateToMarkdown } from './lib/serializers'
export { config as slateToMarkdownConfig } from './lib/config/default'
export { config as payloadSlateToMarkdownConfig } from './lib/config/payload'
export type {
  Config as SlateToMarkdownConfig,
  ElementTransform as MarkdownElementTransform,
  MarkdownElement,
  MarkdownMark,
} from './lib/config/types'
export { escapeText, formatUrl, codeSpan, fenceInfo } from './lib/utilities'
