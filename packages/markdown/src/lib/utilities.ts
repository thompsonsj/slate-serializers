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

export const link = (text: string, url: string): string => `[${text}](${formatUrl(url)})`

export const image = (alt: string, url: string): string => `![${alt.replace(/[\\[\]]/g, '\\$&')}](${formatUrl(url)})`
