export type Context = 'preserve' | 'block' | 'inline' | ''

// See: <https://html.spec.whatwg.org/#the-css-user-agent-style-sheet-and-presentational-hints>
// From: https://www.npmjs.com/package/rehype-minify-whitespace
const blocks = [
  'address', // Flow content.
  'article', // Sections and headings.
  'aside', // Sections and headings.
  'blockquote', // Flow content.
  'body', // Page.
  'br', // Contribute whitespace intrinsically.
  'caption', // Similar to block.
  'center', // Flow content, legacy.
  'col', // Similar to block.
  'colgroup', // Similar to block.
  'dd', // Lists.
  'dialog', // Flow content.
  'dir', // Lists, legacy.
  'div', // Flow content.
  'dl', // Lists.
  'dt', // Lists.
  'figcaption', // Flow content.
  'figure', // Flow content.
  'footer', // Flow content.
  'form', // Flow content.
  'h1', // Sections and headings.
  'h2', // Sections and headings.
  'h3', // Sections and headings.
  'h4', // Sections and headings.
  'h5', // Sections and headings.
  'h6', // Sections and headings.
  'head', // Page.
  'header', // Flow content.
  'hgroup', // Sections and headings.
  'hr', // Flow content.
  'html', // Page.
  'legend', // Flow content.
  'li', // Block-like.
  'li', // Similar to block.
  'listing', // Flow content, legacy
  'main', // Flow content.
  'menu', // Lists.
  'nav', // Sections and headings.
  'ol', // Lists.
  'optgroup', // Similar to block.
  'option', // Similar to block.
  'p', // Flow content.
  'plaintext', // Flow content, legacy
  'pre', // Flow content.
  'section', // Sections and headings.
  'summary', // Similar to block.
  'table', // Similar to block.
  'tbody', // Similar to block.
  'td', // Block-like.
  'td', // Similar to block.
  'tfoot', // Similar to block.
  'th', // Block-like.
  'th', // Similar to block.
  'thead', // Similar to block.
  'tr', // Similar to block.
  'ul', // Lists.
  'wbr', // Contribute whitespace intrinsically.
  'xmp', // Flow content, legacy
]

const isBlock = (tagName: string) => {
  return blocks.includes(tagName)
}


interface IprocessTextValue {
  text: string
  context?: Context
  isInlineStart?: boolean
  isInlineEnd?: boolean
  isNextSiblingBlock?: boolean
  shouldTrimWhiteSpace?: boolean
}

export const processTextValue = ({
  text,
  context = '',
  isInlineStart = false,
  isInlineEnd = false,
  isNextSiblingBlock = false,
  shouldTrimWhiteSpace = true
}: IprocessTextValue): string => {
  let parsed = text
  if (context === 'preserve') {
    return parsed
  }
  parsed = minifyText(parsed, shouldTrimWhiteSpace)
  if (context === 'block') {
    // is this the start of inline content after a block element?
    if (isInlineStart) {
      parsed = parsed.trimStart()
    }
    // is this the end of inline content in a block element?
    if (isInlineEnd || isNextSiblingBlock) {
      parsed = parsed.trimEnd()
    }
  }
  return parsed
}

export const minifyText = (str: string, shouldTrimWhiteSpace: boolean) => {
  return shouldTrimWhiteSpace ? reduceToSingleSpaces(replaceNewlines(str)) : replaceNewlines(str)
}

const replaceNewlines = (str: string) => {
  return str.replace(/(?:\r\n|\r|\n)/g, ' ')
}

const reduceToSingleSpaces = (str: string) => {
  return str.replace(/ +(?= )/g, '')
}

export const isAllWhitespace = (str: string) => {
  return !/[^\t\n\r ]/.test(str)
}

export const getContext = (tagName: string): Context => {
  if (!tagName || tagName.trim() === '') {
    return ''
  }
  if (preserveWhitespace(tagName)) {
    return 'preserve'
  }
  if (isBlock(tagName)) {
    return 'block'
  }
  return 'inline'
}

const preserveWhitespace = (tagName: string) => {
  return ['code', 'pre', 'xmp'].includes(tagName)
}
