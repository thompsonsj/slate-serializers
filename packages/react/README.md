# @slate-serializers/react

Render [Slate](https://www.npmjs.com/package/slate) JSON as **React** elements using the same mental model as [`slateToHtml`](https://www.npmjs.com/package/@slate-serializers/html).

**Live examples:** [SlateToReact docs](https://thompsonsj.github.io/slate-serializers-demo/slate-to-react/docs) on the demo site ([source](https://github.com/thompsonsj/slate-serializers-demo)).

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [Configuration (flat API)](#configuration-flat-api)
- [Relationship to `slateToHtml`](#relationship-to-slatetohtml)
- [Engineering](#engineering)

## Install

```bash
npm install @slate-serializers/react
# peer: react, react-dom (same range as your app)
```

## Usage

```tsx
import { SlateToReact } from '@slate-serializers/react'

const value = [
  {
    type: 'h1',
    children: [{ text: 'Heading' }],
  },
]

export function Example() {
  return <SlateToReact node={value} />
}
```

- **`node`** — Slate value as an **array** of top-level blocks (same shape you pass to other serializers in this repo).
- **`config`** — optional; defaults to `slateToReactConfig` (aligned with the [Slate serialization guide](https://docs.slatejs.org/concepts/10-serializing#deserializing)).

### Payload CMS

```tsx
import { SlateToReact, payloadSlateToReactConfig } from '@slate-serializers/react'

<SlateToReact node={value} config={payloadSlateToReactConfig} />
```

## Configuration (flat API)

`SlateToReact` uses a **single flat object** for configuration: the **same top-level keys** as [`slateToHtml`](https://www.npmjs.com/package/@slate-serializers/html) / [`SlateToDomConfig`](https://www.npmjs.com/package/@slate-serializers/dom) (`markMap`, `elementMap`, `elementAttributeTransform`, `defaultTag`, entity / line-break options, etc.), plus:

| Key | Role in React |
| --- | --- |
| **`elementTransforms`** | **Required** in the type. Each entry maps a Slate block `type` to a function that returns a **React node** (JSX or `React.createElement`). Replaces / augments `elementMap` for those types. |
| **`markMap`** | Maps Slate leaf properties to **tag names** for inline marks. Those tags are turned into DOM-like nodes, then into React. |

`SlateToReactConfig` extends the DOM [`BaseConfig`](https://github.com/thompsonsj/slate-serializers/blob/main/packages/dom/src/lib/config/types.ts) and types `elementTransforms` / optional `markTransforms` as returning **`ReactNode`**, not [`domhandler`](https://github.com/fb55/domhandler) `Element`s.

### `markTransforms` vs `markMap`

Internally, `SlateToReact` runs the shared DOM converter with **DOM** `elementTransforms` / `markTransforms` cleared so that **block-level** output is driven only by your **React** `elementTransforms`. **Inline marks** use **`markMap`** (and the default DOM behavior for simple tags), not the DOM serializer’s `markTransforms`.

- For **custom per-mark DOM** logic (returning `new Element(...)`), use **`slateToHtml`** from `@slate-serializers/html`.
- For **React** output, prefer **`markMap`** and, where needed, custom **`elementTransforms`** for blocks.

See the demo section [“Custom DOM `markTransforms`…”](https://thompsonsj.github.io/slate-serializers-demo/slate-to-react/docs) for a concrete explanation.

### Example: custom block component

```tsx
import { type SlateToReactConfig, SlateToReact, slateToReactConfig } from '@slate-serializers/react'

const config: SlateToReactConfig = {
  ...slateToReactConfig,
  elementTransforms: {
    ...slateToReactConfig.elementTransforms,
    callout: ({ children }) => <aside className="callout">{children}</aside>,
  },
}

<SlateToReact node={value} config={config} />
```

## Relationship to `slateToHtml`

| | `slateToHtml` | `SlateToReact` |
| --- | --- | --- |
| Output | HTML string | React tree |
| `elementTransforms` | Returns `domhandler` `Element` (use `import { Element } from '@slate-serializers/dom'`) | Returns `ReactNode` |
| Shared options | `markMap`, `elementMap`, encoding flags, etc. | Same keys, one config object |

## Engineering

For parser choices, whitespace, and compatibility, see [Engineering decisions](https://github.com/thompsonsj/slate-serializers/blob/main/docs/engineering.md).

## Repo layout

This package lives in the [`slate-serializers`](https://github.com/thompsonsj/slate-serializers) monorepo. Issue tracker: [slate-serializers on GitHub](https://github.com/thompsonsj/slate-serializers/issues).
