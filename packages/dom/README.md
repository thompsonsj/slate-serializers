# @slate-serializers/dom

Convert [Slate](https://www.npmjs.com/package/slate) JSON to a [`domhandler`](https://github.com/fb55/domhandler) document tree (the same DOM model used by [`htmlparser2`](https://github.com/fb55/htmlparser2) / [`html-entities`](https://github.com/mdevils/html-entities)).

It is used by [`@slate-serializers/html`](https://www.npmjs.com/package/@slate-serializers/html) (`slateToHtml`) before serializing to an HTML string. Use **`slateToDom` directly** when you want to inspect or manipulate the tree (e.g. with [`domutils`](https://github.com/fb55/domutils)) before calling `dom-serializer` yourself.

**Live examples:** [slateToDom on the demo site](https://thompsonsj.github.io/slate-serializers-demo/slate-to-dom/docs).

## Install

```bash
npm install @slate-serializers/dom
```

## Usage

```ts
import { slateToDomConfig, slateToDom } from '@slate-serializers/dom'

const slate = [
  {
    type: 'h1',
    children: [{ text: 'Heading 1' }],
  },
]

const dom = slateToDom(slate, slateToDomConfig)
```

## Configuration

- **`SlateToDomConfig`** — `markMap`, `elementMap`, `elementTransforms`, `markTransforms`, `elementAttributeTransform`, and formatting options. See [slateToDom configuration](https://github.com/thompsonsj/slate-serializers/blob/main/docs/config/slateToDom.md) in the repo and the [interactive docs](https://thompsonsj.github.io/slate-serializers-demo/slate-to-dom/docs).

### DOM helpers from this package

`Element` and `Text` are **re-exported** from `domhandler` so you can use **`new Element(...)`** without adding `domhandler` only for the constructor:

```ts
import { Element, type SlateToDomConfig } from '@slate-serializers/dom'
```

`ChildNode` is available as **`import type { ChildNode }`** only.

## Engineering

See [Engineering decisions](https://github.com/thompsonsj/slate-serializers/blob/main/docs/engineering.md).
