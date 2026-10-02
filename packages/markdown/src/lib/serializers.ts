import { config as defaultConfig } from './config/default'
import { Config, MarkdownElement } from './config/types'
import { codeSpan, delimiterRole, escapeLineStarts, escapeText, fenceInfo, image, link } from './utilities'

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
const HTML_TAGS: Record<string, { open: string; close: string }> = {
  strong: { open: '<strong>', close: '</strong>' },
  emphasis: { open: '<em>', close: '</em>' },
  strikethrough: { open: '<del>', close: '</del>' },
}

const isText = (node: SlateNode): boolean => !!node && typeof node.text === 'string'
const isElement = (node: SlateNode): boolean => !!node && Array.isArray(node.children)

const plainText = (node: SlateNode): string =>
  isText(node) ? node.text : isElement(node) ? node.children.map(plainText).join('') : ''

const indent = (lines: string[], width: number): string[] => lines.map((line) => (line ? ' '.repeat(width) + line : line))

const longestBacktickRun = (text: string): number =>
  Math.max(0, ...(text.match(/`+/g) || []).map((run) => run.length))

/** Join adjacent code leaves with the same marks: separate code spans side by side would merge into a broken one. */
const mergeCodeLeaves = (nodes: SlateNode[], marks: string[], isCode: (node: SlateNode) => boolean): SlateNode[] => {
  const merged: SlateNode[] = []
  for (const node of nodes) {
    const previous = merged[merged.length - 1]
    if (
      isText(node) &&
      isText(previous) &&
      isCode(node) &&
      isCode(previous) &&
      marks.every((mark) => !node[mark] === !previous[mark])
    ) {
      merged[merged.length - 1] = { ...previous, text: previous.text + node.text }
    } else {
      merged.push(node)
    }
  }
  return merged
}

class Serializer {
  private readonly cache = new WeakMap<SlateNode[], Map<string, string>>()

  constructor(private readonly config: Config) {}

  /** Serialize each children array once per context, even when a transform reads `children` and then falls back. */
  private memo(nodes: SlateNode[], key: string, serialize: () => string): string {
    let entries = this.cache.get(nodes)
    if (!entries) {
      entries = new Map()
      this.cache.set(nodes, entries)
    }
    let markdown = entries.get(key)
    if (markdown === undefined) {
      markdown = serialize()
      entries.set(key, markdown)
    }
    return markdown
  }

  private element(node: SlateNode): MarkdownElement | undefined {
    return node ? this.config.elementMap[node.type] : undefined
  }

  /** Run the node's custom transform, if any. Children are serialized only if the transform reads them. */
  private applyTransform(node: SlateNode, serializeChildren: () => string): string | undefined {
    const transform = this.config.elementTransforms?.[node.type]
    return transform?.({
      node,
      get children() {
        return serializeChildren()
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
    return this.memo(nodes, inListItem ? 'list-item' : 'blocks', () => this.serializeBlocks(nodes, inListItem))
  }

  private hasInline(nodes: SlateNode[]): boolean {
    return nodes.some((node) => this.isInline(node, false))
  }

  private serializeBlocks(nodes: SlateNode[], inListItem: boolean): string {
    const besideInline = this.hasInline(nodes)
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
    return this.hasInline(node.children) ? this.inline(node.children) : this.blocks(node.children)
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
    for (const child of items) {
      if (!isElement(child) && !isText(child)) {
        continue
      }
      // Text directly inside a list is not valid Slate, but keep it as an item of its own rather than dropping it.
      const item = isElement(child) ? child : { children: [child] }
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
      const serializeChildren = () => this.blocks(node.children, { inListItem: true })
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
    return `${fence}${fenceInfo(node.language ?? node.lang)}\n${content}\n${fence}`
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
   * non-whitespace, and code is applied per leaf because code spans cannot contain markup. A delimiter pair that
   * CommonMark would not parse in its position (e.g. `a**`code`**b`) is written as HTML instead.
   */
  inline(nodes: SlateNode[]): string {
    return this.memo(nodes, 'inline', () => this.serializeInline(nodes))
  }

  private serializeInline(nodes: SlateNode[]): string {
    const marks = Object.keys(this.config.markMap)
    const isCode = (node: SlateNode) => marks.some((mark) => node[mark] && this.config.markMap[mark] === 'code')
    const wrappingMarks = marks.filter((mark) => this.config.markMap[mark] !== 'code')
    const open: { mark: string; index: number; html?: { open: string; close: string } }[] = []
    let out = ''

    /** Close marks above `depth`. `next` is the character that will follow (`undefined` at the end). */
    const closeTo = (depth: number, next: string | undefined) => {
      while (open.length > depth) {
        const { mark, index, html } = open.pop() as (typeof open)[number]
        const whitespace = out.match(/(?:[^\S\n]|\\\n)+$/)?.[0] ?? ''
        let body = out.slice(0, out.length - whitespace.length)
        const delimiters = this.delimiters(mark)
        const fallback = HTML_TAGS[this.config.markMap[mark] as string]
        const kind = delimiters.open[0]
        const following = whitespace[0] ?? next
        if (html) {
          out = body + html.close + whitespace
          continue
        }
        // Adjacent runs of the same character merge (`**` + `*` → `***`) and often parse as the wrong marks.
        if (
          fallback &&
          (kind === following ||
            !(
              delimiterRole(body[index - 1], body[index + delimiters.open.length], kind).opens &&
              delimiterRole(body[body.length - 1], following, kind).closes
            ))
        ) {
          body = body.slice(0, index) + fallback.open + body.slice(index + delimiters.open.length)
          out = body + fallback.close + whitespace
        } else {
          out = body + delimiters.close + whitespace
        }
      }
    }

    for (const node of mergeCodeLeaves(nodes, marks, isCode)) {
      if (!isText(node)) {
        const markdown = isElement(node) ? this.inlineElement(node) : ''
        closeTo(0, markdown[0])
        out += markdown
        continue
      }
      if (node.text === '') {
        continue
      }
      const active = wrappingMarks.filter((mark) => node[mark])
      let lead = ''
      let core: string
      let trail = ''
      if (isCode(node)) {
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
      while (keep < open.length && active.includes(open[keep].mark)) {
        keep++
      }
      // Delimiters about to open are punctuation, which is all the flanking rules need to know about them.
      closeTo(keep, lead[0] ?? (keep < active.length ? '*' : core[0]))
      out += lead
      for (const mark of active) {
        if (!open.some((entry) => entry.mark === mark)) {
          const delimiters = this.delimiters(mark)
          const fallback = HTML_TAGS[this.config.markMap[mark] as string]
          // `**` then `*` is one `***` run; open the inner mark as HTML instead.
          if (fallback && out[out.length - 1] === delimiters.open[0]) {
            open.push({ mark, index: out.length, html: fallback })
            out += fallback.open
          } else {
            open.push({ mark, index: out.length })
            out += delimiters.open
          }
        }
      }
      out += core + trail
    }
    closeTo(0, undefined)
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
