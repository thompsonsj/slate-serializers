# slateToMarkdown configuration

**Interactive:** [slateToMarkdown on the demo site](https://thompsonsj.github.io/slate-serializers-demo/slate-to-markdown/docs). **npm:** [@slate-serializers/markdown README](https://github.com/thompsonsj/slate-serializers/blob/main/packages/markdown/README.md).

`slateToMarkdown` takes a single config object (`SlateToMarkdownConfig`). Spread `slateToMarkdownConfig` or `payloadSlateToMarkdownConfig` and override the keys you need.

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

## elementMap

Map a Slate element `type` to a Markdown construct: `paragraph`, `h1`–`h6`, `blockquote`, `ul`, `ol`, `li`, `task`, `link`, `image`, `line-break`, `hr`, `code-block`, `table`, `table-section`, `table-row`, or `table-cell`.

Defaults cover both the names used by the other `@slate-serializers` packages (`p`, `h1`, `ul`, `li`, …) and the [Slate examples](https://www.slatejs.org/examples/richtext) (`paragraph`, `heading-one`, `bulleted-list`, `check-list-item`, …). See [default.ts](https://github.com/thompsonsj/slate-serializers/blob/main/packages/markdown/src/lib/config/default.ts).

## markMap

Map a leaf property to `strong`, `emphasis`, `strikethrough`, `code`, or `{ open, close }` strings (for marks Markdown has no syntax for, such as underline). Earlier entries wrap later ones.

## elementTransforms

Custom output per element `type`. The function receives the Slate `node` and `children` already serialized to Markdown. Return `undefined` to fall back to `elementMap`.

A new `elementTransforms` object replaces the base map. If you start from `payloadSlateToMarkdownConfig`, spread `payloadSlateToMarkdownConfig.elementTransforms` before adding your own entries, or the `upload` transform is dropped.

## Other options

| Option | Default | Description |
| - | - | - |
| `emphasisDelimiter` | `'*'` | `'*'` or `'_'`. `*` also works inside words. |
| `bulletMarker` | `'-'` | `'-'`, `'*'` or `'+'`. |
| `escape` | `true` | Escape text that Markdown would treat as syntax. Set to `false` if your text already contains Markdown. |

Payload `upload` nodes are handled by `payloadSlateToMarkdownConfig` when the node has a URL: images become `![alt](url)`, other files become links. With no URL the transform returns `undefined` and serialization falls back to `elementMap`.

Escaping keeps Markdown syntax in text literal. It is not HTML sanitization: custom transforms, `{ open, close }` marks, and URLs are emitted as given.
