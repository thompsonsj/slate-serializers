# @slate-serializers/markdown

Convert Slate JSON to [GitHub Flavored Markdown](https://github.github.com/gfm/).

**npm:** [@slate-serializers/markdown](https://www.npmjs.com/package/@slate-serializers/markdown)

- Headings, paragraphs, block quotes, bullet and ordered lists (nested), task lists, code blocks, thematic breaks, tables with column alignment, links and images.
- Bold, italic, strikethrough and inline code. Marks with no Markdown syntax (underline, subscript, superscript) are written as HTML tags, which GFM allows.
- Text is escaped so characters such as `*`, `_`, `[` or a leading `1.` stay literal.
- No runtime dependencies.

## Usage

```ts
import { slateToMarkdown } from '@slate-serializers/markdown'

const slate = [
  { type: 'h1', children: [{ text: 'Heading 1' }] },
  {
    type: 'p',
    children: [
      { text: 'A paragraph with ' },
      { text: 'bold', bold: true },
      { text: ' text and a ' },
      { type: 'link', url: 'https://docs.slatejs.org', children: [{ text: 'link' }] },
      { text: '.' },
    ],
  },
  {
    type: 'ul',
    children: [
      { type: 'li', children: [{ text: 'One' }] },
      { type: 'li', children: [{ text: 'Two' }] },
    ],
  },
]

slateToMarkdown(slate)
// # Heading 1
//
// A paragraph with **bold** text and a [link](https://docs.slatejs.org).
//
// - One
// - Two
```

The default configuration understands the element names used by the other `@slate-serializers` packages (`p`, `h1`, `ul`, `li`, `blockquote`, `link`, …) and by the [Slate examples](https://www.slatejs.org/examples/richtext) (`paragraph`, `heading-one`, `bulleted-list`, `list-item`, `block-quote`, `check-list-item`, `table-row`, …).

### Payload CMS

```ts
import { slateToMarkdown, payloadSlateToMarkdownConfig } from '@slate-serializers/markdown'

slateToMarkdown(slate, payloadSlateToMarkdownConfig)
```

Adds support for Payload `upload` elements: images become `![alt](url)` and other files become links.

## Configuration

Spread the default configuration and override what you need.

```ts
import { slateToMarkdown, slateToMarkdownConfig, SlateToMarkdownConfig } from '@slate-serializers/markdown'

const config: SlateToMarkdownConfig = {
  ...slateToMarkdownConfig,
  elementMap: { ...slateToMarkdownConfig.elementMap, title: 'h1' },
  markMap: { ...slateToMarkdownConfig.markMap, highlight: { open: '<mark>', close: '</mark>' } },
  elementTransforms: {
    mention: ({ node }) => `@${node.username}`,
    callout: ({ node, children }) => `> **${node.kind}:** ${children}`,
  },
}
```

| Option | Default | Description |
| - | - | - |
| `elementMap` | see [default.ts](./src/lib/config/default.ts) | Map a Slate element `type` to a Markdown construct: `paragraph`, `h1`–`h6`, `blockquote`, `ul`, `ol`, `li`, `task`, `link`, `image`, `line-break`, `hr`, `code-block`, `table`, `table-section`, `table-row` or `table-cell`. |
| `markMap` | `bold`, `italic`, `strikethrough`, `code`, and HTML for `underline`, `subscript`, `superscript` | Map a leaf property to `strong`, `emphasis`, `strikethrough`, `code`, or `{ open, close }` strings. Earlier entries wrap later ones. |
| `elementTransforms` | `{}` | Custom output per element `type`. Receives the `node` and its `children` already serialized to Markdown. Return `undefined` to fall back to `elementMap`. |
| `emphasisDelimiter` | `'*'` | `'*'` or `'_'`. `*` also works inside words. |
| `bulletMarker` | `'-'` | `'-'`, `'*'` or `'+'`. |
| `escape` | `true` | Escape text that Markdown would treat as syntax. Set to `false` if your text already contains Markdown. |

### Node properties

| Construct | Properties read from the node |
| - | - |
| `link` | `url` (or `href`) |
| `image` | `url` (or `src`), `alt` (or `caption`, or the node's text) |
| `ol` | `start` |
| `li`, `task` | `checked` (a boolean makes the item a task list item) |
| `code-block` | `language` (or `lang`). Child elements (e.g. `code-line`) become lines. |
| `table-cell` | `align` (or `textAlign`) on the first row sets the column alignment |

### Behaviour

- Blocks are separated by a blank line. Empty paragraphs are dropped, because Markdown cannot represent them.
- A `\n` in text becomes a hard line break (`\` at the end of the line). In table cells it becomes `<br>`.
- The first table row is the header row. Content that tables cannot hold, such as lists, is joined with `<br>`.
- Elements that are not in `elementMap` are treated as inline when they sit beside text, and as a wrapper around their children otherwise.
- Link attributes Markdown has no syntax for, such as `newTab`, are ignored. Use `elementTransforms` to output HTML instead.
- When CommonMark would not parse a `*`, `**` or `~~` pair in its position (for example bold next to italic, or bold code next to letters), the serializer writes the equivalent HTML tag instead.
- Escaping keeps Markdown syntax in text literal. It is not HTML sanitization: custom transforms, `{ open, close }` marks and URLs are emitted as given. Sanitize the result if you render untrusted documents as HTML.
