/** Markdown constructs that a Slate element type can be mapped to. */
export type MarkdownElement =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'blockquote'
  | 'ul'
  | 'ol'
  | 'li'
  /** A GFM task list item. Reads `checked` from the node. */
  | 'task'
  | 'link'
  | 'image'
  | 'line-break'
  | 'hr'
  /** Fenced code block. Reads `language` (or `lang`) from the node; child elements are treated as lines. */
  | 'code-block'
  | 'table'
  /** Wrapper around table rows, such as `thead` or `tbody`. */
  | 'table-section'
  | 'table-row'
  | 'table-cell'

/** Markdown syntax for a Slate mark, or a pair of strings (e.g. HTML tags) for marks Markdown has no syntax for. */
export type MarkdownMark = 'strong' | 'emphasis' | 'strikethrough' | 'code' | { open: string; close: string }

export type ElementTransform = ({
  node,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any
  /** The node's children, already serialized to Markdown. */
  children: string
}) => string | undefined

export interface Config {
  /** Map Slate element types to Markdown constructs. */
  elementMap: { [type: string]: MarkdownElement }
  /** Map Slate marks (leaf properties such as `bold`) to Markdown syntax. Earlier entries wrap later ones. */
  markMap: { [mark: string]: MarkdownMark }
  /** Custom output for element types. Return `undefined` to fall back to `elementMap`. */
  elementTransforms?: { [type: string]: ElementTransform }
  /** @default '*' */
  emphasisDelimiter?: '*' | '_'
  /** @default '-' */
  bulletMarker?: '-' | '*' | '+'
  /** Escape characters in text that Markdown would otherwise treat as syntax. @default true */
  escape?: boolean
}
