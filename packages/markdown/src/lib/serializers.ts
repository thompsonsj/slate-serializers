import { config as defaultConfig } from './config/default'
import { Config, MarkdownElement } from './config/types'
import { codeSpan, escapeLineStarts, escapeText, image, link } from './utilities'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SlateNode = any

interface Block {
  markdown: string
  element?: MarkdownElement
}

const HARD_BREAK = '\\\n'
const HARD_BREAKS = /\\\n/g
const INLINE_ELEMENTS: MarkdownElement[] = ['link', 'image', 'line-break']
const LISTS: (MarkdownElement | undefined)[] = ['ul', 'ol']
const BULLETED: (MarkdownElement | undefined)[] = ['ul', 'li', 'task']

const isText = (node: SlateNode): boolean => !!node && typeof node.text === 'string'
const isElement = (node: SlateNode): boolean => !!node && Array.isArray(node.children)

const plainText = (node: SlateNode): string =>
  isText(node) ? node.text : isElement(node) ? node.children.map(plainText).join('') : ''

const indent = (lines: string[], width: number): string[] => lines.map((line) => (line ? ' '.repeat(width) + line : line))

const longestBacktickRun = (text: string): number =>
  Math.max(0, ...(text.match(/`+/g) || []).map((run) => run.length))

class Serializer {
  constructor(private readonly config: Config) {}

  private element(node: SlateNode): MarkdownElement | undefined {
    return node ? this.config.elementMap[node.type] : undefined
  }

  /** Run the node's custom transform, if any. Children are serialized only if the transform reads them. */
  private applyTransform(node: SlateNode, serializeChildren: () => string): string | undefined {
    const transform = node ? this.config.elementTransforms?.[node.type] : undefined
    if (!transform) {
      return undefined
    }
    let children: string | undefined
    return transform({
      node,
      get children() {
        return (children ??= serializeChildren())
      },
    })
  }

  /**
   * Known inline elements are inline. Elements the config doesn't map (e.g. `span` or `div`) are inline when they sit
   * beside text or inline elements, and blocks otherwise.
   */
  private isInline(node: SlateNode, besideInline: boolean): boolean {
    if (isText(node)) {
      return true
    }
    const element = this.element(node)
    return element ? INLINE_ELEMENTS.includes(element) : besideInline
  }

  /** Serialize siblings as blocks separated by blank lines. Consecutive inline nodes form one paragraph. */
  blocks(nodes: SlateNode[], { inListItem = false } = {}): string {
    const besideInline = nodes.some((node) => isText(node) || INLINE_ELEMENTS.includes(this.element(node) as MarkdownElement))
    const parts: Block[] = []
    let run: SlateNode[] = []
    const flush = () => {
      if (run.length) {
        parts.push({ markdown: this.paragraph(run), element: 'paragraph' })
        run = []
      }
    }
    for (const node of nodes) {
      if (this.isInline(node, besideInline)) {
        run.push(node)
      } else if (isElement(node)) {
        flush()
        parts.push({ markdown: this.block(node), element: this.element(node) })
      }
    }
    flush()

    const nonEmpty = parts.filter((part) => part.markdown !== '')
    return nonEmpty
      .map((part, i) => {
        const previous = nonEmpty[i - 1]
        if (!previous) {
          return part.markdown
        }
        if (previous.element === 'task' && part.element === 'task') {
          return `\n${part.markdown}`
        }
        if (inListItem && previous.element === 'paragraph' && LISTS.includes(part.element)) {
          return `\n${part.markdown}`
        }
        // Adjacent lists with the same kind of marker would merge into one.
        if (
          (previous.element === 'ol' && part.element === 'ol') ||
          (BULLETED.includes(previous.element) && BULLETED.includes(part.element))
        ) {
          return `\n\n<!-- -->\n\n${part.markdown}`
        }
        return `\n\n${part.markdown}`
      })
      .join('')
  }

  private children(node: SlateNode): string {
    const besideInline = node.children.some((child: SlateNode) => this.isInline(child, false))
    return besideInline ? this.inline(node.children) : this.blocks(node.children)
  }

  private block(node: SlateNode): string {
    const custom = this.applyTransform(node, () => this.children(node))
    if (custom !== undefined) {
      return custom
    }
    const element = this.element(node)
    switch (element) {
      case 'paragraph':
        return this.paragraph(node.children)
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return this.heading(Number(element[1]), node.children)
      case 'blockquote':
        return this.blockquote(node.children)
      case 'ul':
      case 'ol':
        return this.list(node.children, element === 'ol', Number(node.start ?? 1))
      case 'li':
      case 'task':
        return this.list([node], false, 1)
      case 'code-block':
        return this.codeBlock(node)
      case 'hr':
        return '---'
      case 'table':
        return this.table(node)
      default:
        return this.blocks(node.children)
    }
  }

  private paragraph(nodes: SlateNode[]): string {
    const markdown = this.inline(nodes)
      .replace(/^(?:\\\n|\s)+/, '')
      .replace(/(?:\\\n|\s)+$/, '')
    return this.config.escape === false ? markdown : escapeLineStarts(markdown)
  }

  private heading(level: number, nodes: SlateNode[]): string {
    const text = this.inline(nodes).replace(HARD_BREAKS, ' ').trim()
    if (text === '') {
      return ''
    }
    // A trailing run of `#` would be read as a closing sequence.
    return `${'#'.repeat(level)} ${text.replace(/(^|[ \t])(#+)$/, '$1\\$2')}`
  }

  private blockquote(nodes: SlateNode[]): string {
    const content = this.blocks(nodes)
    return content === ''
      ? ''
      : content
          .split('\n')
          .map((line) => (line ? `> ${line}` : '>'))
          .join('\n')
  }

  private list(items: SlateNode[], ordered: boolean, start: number): string {
    const lines: string[] = []
    let number = start
    let lastWidth = 0
    for (const item of items) {
      if (!isElement(item)) {
        continue
      }
      // A list placed directly inside a list belongs to the previous item.
      if (LISTS.includes(this.element(item)) && lines.length) {
        lines.push(...indent(this.block(item).split('\n'), lastWidth))
        continue
      }
      const marker = ordered ? `${number++}.` : this.config.bulletMarker ?? '-'
      lastWidth = marker.length + 1
      lines.push(...this.listItem(marker, item))
    }
    return lines.join('\n')
  }

  private listItem(marker: string, node: SlateNode): string[] {
    const element = this.element(node)
    let content: string
    if (element && element !== 'li' && element !== 'task') {
      content = this.block(node)
    } else {
      let children: string | undefined
      const serializeChildren = () => (children ??= this.blocks(node.children, { inListItem: true }))
      content = this.applyTransform(node, serializeChildren) ?? serializeChildren()
    }
    if (element === 'task' || typeof node.checked === 'boolean') {
      content = `[${node.checked ? 'x' : ' '}] ${content}`
    }
    const [first, ...rest] = content.split('\n')
    return [first ? `${marker} ${first}` : marker, ...indent(rest, marker.length + 1)]
  }

  private codeBlock(node: SlateNode): string {
    const content = node.children.some(isElement)
      ? node.children.map(plainText).join('\n')
      : plainText(node)
    const fence = '`'.repeat(Math.max(3, longestBacktickRun(content) + 1))
    const language = node.language ?? node.lang ?? ''
    return `${fence}${language}\n${content}\n${fence}`
  }

  private tableRows(node: SlateNode): SlateNode[] {
    return node.children
      .filter(isElement)
      .flatMap((child: SlateNode) => (this.element(child) === 'table-section' ? this.tableRows(child) : [child]))
  }

  private table(node: SlateNode): string {
    const rows: SlateNode[][] = this.tableRows(node).map((row) => row.children.filter(isElement))
    const width = Math.max(0, ...rows.map((cells) => cells.length))
    if (width === 0) {
      return ''
    }
    const columns = Array.from({ length: width }, (_, i) => i)
    const text = rows.map((cells) => columns.map((i) => (cells[i] ? this.tableCell(cells[i]) : '')))
    const delimiters = columns.map((i) => {
      const align = rows[0][i]?.align ?? rows[0][i]?.textAlign
      return align === 'center' ? ':---:' : align === 'right' ? '---:' : align === 'left' ? ':---' : '---'
    })
    const row = (values: string[]) => `| ${values.join(' | ')} |`
    return [row(text[0]), row(delimiters), ...text.slice(1).map(row)].join('\n')
  }

  private tableCell(node: SlateNode): string {
    return this.blocks(node.children)
      .replace(HARD_BREAKS, '<br>')
      .replace(/\n+/g, '<br>')
      .replace(/\|/g, '\\|')
  }

  private text(text: string): string {
    return (this.config.escape === false ? text : escapeText(text)).replace(/\n/g, HARD_BREAK)
  }

  private delimiters(mark: string): { open: string; close: string } {
    const syntax = this.config.markMap[mark]
    if (typeof syntax === 'object') {
      return syntax
    }
    const delimiter =
      syntax === 'strong' ? '**' : syntax === 'strikethrough' ? '~~' : this.config.emphasisDelimiter ?? '*'
    return { open: delimiter, close: delimiter }
  }

  /**
   * Serialize inline content. Marks shared by adjacent leaves stay open across them, delimiters are kept next to
   * non-whitespace (as CommonMark requires), and code is applied per leaf because code spans cannot contain markup.
   */
  inline(nodes: SlateNode[]): string {
    const marks = Object.keys(this.config.markMap)
    const codeMarks = marks.filter((mark) => this.config.markMap[mark] === 'code')
    const wrappingMarks = marks.filter((mark) => this.config.markMap[mark] !== 'code')
    const open: string[] = []
    let out = ''

    const closeTo = (depth: number) => {
      while (open.length > depth) {
        const mark = open.pop() as string
        const whitespace = out.match(/(?:[^\S\n]|\\\n)+$/)?.[0] ?? ''
        out = out.slice(0, out.length - whitespace.length) + this.delimiters(mark).close + whitespace
      }
    }

    for (const node of nodes) {
      if (!isText(node)) {
        closeTo(0)
        out += isElement(node) ? this.inlineElement(node) : ''
        continue
      }
      if (node.text === '') {
        continue
      }
      const active = wrappingMarks.filter((mark) => node[mark])
      let lead = ''
      let core: string
      let trail = ''
      if (codeMarks.some((mark) => node[mark])) {
        core = codeSpan(node.text)
      } else {
        const [, leading, middle, trailing] = node.text.match(/^(\s*)([\s\S]*?)(\s*)$/) as string[]
        lead = this.text(leading)
        core = this.text(middle)
        trail = this.text(trailing)
      }
      if (core === '') {
        out += lead + trail
        continue
      }
      let keep = 0
      while (keep < open.length && active.includes(open[keep])) {
        keep++
      }
      closeTo(keep)
      out += lead
      for (const mark of active) {
        if (!open.includes(mark)) {
          out += this.delimiters(mark).open
          open.push(mark)
        }
      }
      out += core + trail
    }
    closeTo(0)
    return out
  }

  private inlineElement(node: SlateNode): string {
    const custom = this.applyTransform(node, () => this.inline(node.children))
    if (custom !== undefined) {
      return custom
    }
    switch (this.element(node)) {
      case 'link': {
        const text = this.inline(node.children)
        const url = node.url ?? node.href
        if (!url) {
          return text
        }
        return link(text || escapeText(url), url)
      }
      case 'image': {
        const url = node.url ?? node.src
        return url ? image(node.alt ?? node.caption ?? plainText(node), url) : ''
      }
      case 'line-break':
        return HARD_BREAK
      default:
        return this.inline(node.children)
    }
  }
}

/** Serialize Slate nodes to a (GitHub Flavored) Markdown string. */
export const slateToMarkdown = (nodes: SlateNode[] | SlateNode, config: Config = defaultConfig): string =>
  nodes == null ? '' : new Serializer(config).blocks(Array.isArray(nodes) ? nodes : [nodes])
