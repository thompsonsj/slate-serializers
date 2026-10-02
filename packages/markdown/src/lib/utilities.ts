/** Escape inline characters that Markdown would treat as syntax. Line-start syntax is handled by `escapeLineStarts`. */
export const escapeText = (text: string): string =>
  text.replace(/[\\`*_[\]<~]/g, '\\$&').replace(/&(?=#?[a-zA-Z0-9]+;)/g, '\\&')

/** Escape characters at the start of a line that would begin a heading, quote, list, or setext underline. */
export const escapeLineStarts = (markdown: string): string =>
  markdown
    .split('\n')
    .map((line) =>
      line
        // Four leading spaces would start an indented code block.
        .replace(/^[ \t]+/, '')
        .replace(/^(#{1,6}(?=[ \t]|$)|>|[-+](?=[ \t]|$)|=+(?=[ \t]*$)|-+(?=[ \t]*$))/, '\\$1')
        .replace(/^(\d{1,9})([.)])(?=[ \t]|$)/, '$1\\$2'),
    )
    .join('\n')

/** Wrap text in a code span, using a backtick fence longer than any backtick run inside it. */
export const codeSpan = (text: string): string => {
  const content = text.replace(/\n/g, ' ')
  const longestRun = Math.max(0, ...(content.match(/`+/g) || []).map((run) => run.length))
  const fence = '`'.repeat(longestRun + 1)
  const pad = /^`|`$/.test(content) || (/^ .*[^ ].* $/.test(content)) ? ' ' : ''
  return `${fence}${pad}${content}${pad}${fence}`
}

/** Format a link or image destination, using angle brackets when it contains characters that would end it early. */
export const formatUrl = (url: string): string =>
  url === '' || /[\s()<>]/.test(url) ? `<${url.replace(/[<>\n]/g, (c) => encodeURIComponent(c))}>` : url

/** A Markdown link. `text` is used as is, so escape plain text with `escapeText` first. */
export const link = (text: string, url: string): string => `[${text}](${formatUrl(url)})`

/** A Markdown image. `alt` is plain text and is escaped. */
export const image = (alt: string, url: string): string =>
  `![${escapeText(alt.replace(/\s+/g, ' ').trim())}](${formatUrl(url)})`

const PUNCTUATION = /[\p{P}\p{S}]/u
// `undefined` is the start or end of the text, which CommonMark treats like whitespace.
const isWhitespace = (char: string | undefined) => char === undefined || /\s/u.test(char)
const isPunctuation = (char: string | undefined) => char !== undefined && PUNCTUATION.test(char)

/**
 * Whether a delimiter run (e.g. `**`) between `before` and `after` can only open or only close emphasis, following the
 * CommonMark flanking rules. A run that could do both is ambiguous and may pair with the wrong delimiter, so neither is
 * reported for it. https://spec.commonmark.org/0.31.2/#left-flanking-delimiter-run
 */
export const delimiterRole = (
  before: string | undefined,
  after: string | undefined,
  delimiter = '*',
): { opens: boolean; closes: boolean } => {
  const leftFlanking = !isWhitespace(after) && (!isPunctuation(after) || isWhitespace(before) || isPunctuation(before))
  const rightFlanking = !isWhitespace(before) && (!isPunctuation(before) || isWhitespace(after) || isPunctuation(after))
  // `_` cannot open (or close) when it is also the other kind of flanking run, unless the far side is punctuation.
  if (delimiter === '_') {
    return {
      opens: leftFlanking && (!rightFlanking || isPunctuation(before)),
      closes: rightFlanking && (!leftFlanking || isPunctuation(after)),
    }
  }
  return { opens: leftFlanking, closes: rightFlanking }
}

/** A fenced-code info string. Line breaks, backticks and markup would end the opening fence or inject HTML. */
export const fenceInfo = (value: unknown): string =>
  String(value ?? '')
    .split(/\r?\n/)[0]
    .replace(/[`<>"'\\]/g, '')
    .trim()
