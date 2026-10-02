import MarkdownIt = require('markdown-it')

const md = new MarkdownIt({ html: true })

/** Render Markdown to HTML with a CommonMark + GFM (tables, strikethrough) parser, without newlines between tags. */
export const render = (markdown: string): string => md.render(markdown).replace(/>\n(<|\S)/g, '>$1').trim()
