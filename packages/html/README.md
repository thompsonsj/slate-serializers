# @slate-serializers/html

Convert [Slate](https://www.npmjs.com/package/slate) JSON objects to HTML and vice versa.

View demos and documentation at [https://thompsonsj.github.io/slate-serializers-demo](https://thompsonsj.github.io/slate-serializers-demo).

## Table of contents

- [Engineering](#engineering)
- [Install](#install)
- [Usage](#usage)
  - [slateToHtml](#slatetohtml)
  - [htmlToSlate](#htmltoslate)

## Engineering

For details on how all serializers work, see [Engineering decisions](https://github.com/thompsonsj/slate-serializers/blob/main/docs/engineering.md).

## Install

```bash
yarn add @slate-serializers/html
# or
npm install @slate-serializers/html
```

## Usage

### slateToHtml

```ts
import { slateToHtml } from '@slate-serializers/html'

const slate = [
  {
    children: [
      {
        text: 'Heading 1',
      },
    ],
    type: 'h1',
  },
  {
    children: [
      {
        text: 'Paragraph 1',
      },
    ],
    type: 'p',
  },
]

const serializedToHtml = slateToHtml(slate)
// output
// <h1>Heading 1</h1><p>Paragraph 1</p>
```

#### Configuration

By default, `slateToHtml` incorporates transformation rules based on the example in [Deserializing | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#deserializing).

##### Payload CMS

If you are using [Payload CMS](https://payloadcms.com/), import the Payload configuration file and pass it as a parameter to the serializer.

```ts
import { slateToHtml, payloadSlateToHtmlConfig } from '@slate-serializers/html'

const slate = [
  {
    children: [
      {
        text: 'Heading 1',
      },
    ],
    type: 'h1',
  },
]

const serializedToHtml = slateToHtml(slate, payloadSlateToHtmlConfig)
```

##### Custom configuration

You can create your own configuration file that implements your schema. See [packages/dom/src/lib/config/payload.ts](https://github.com/thompsonsj/slate-serializers/blob/main/packages/dom/src/lib/config/payload.ts) for an example of how to extend the default configuration or copy [packages/dom/src/lib/config/default.ts](https://github.com/thompsonsj/slate-serializers/blob/main/packages/dom/src/lib/config/default.ts) and rewrite it as appropriate.

| Option  | Description | Default |
| - | - | - |
| `markMap` | Map Slate JSON properties to HTML formatting element tags. Accepts an array of HTML element tag names. | See [default config](https://github.com/thompsonsj/slate-serializers/blob/main/packages/dom/src/lib/config/default.ts). Example: `{ code: ['pre', 'code'], /* ... */ }` |
| `elementMap` | Map Slate JSON `type` values to HTML element tags. Use `elementTransforms` for more control over the returned element. | See [default config](https://github.com/thompsonsj/slate-serializers/blob/main/packages/dom/src/lib/config/default.ts). Example: `{ paragraph: 'p', /* ... */ }` |
| `markTransforms` | Define transform functions for Slate JSON properties. Overrides and corresponding values in `markMap`. | ``{ fontSize: ({ node }) => { return new Element('span', { style: `font-size:${node.fontSize};` }) } }`` |
| `elementTransforms` | Define transform functions for Slate JSON node types. Overrides and corresponding values in `elementMap`. | See [default config](https://github.com/thompsonsj/slate-serializers/blob/main/packages/dom/src/lib/config/default.ts). |
| `encodeEntities` | See [cheeriojs/dom-serializer - encodeEntities](https://github.com/cheeriojs/dom-serializer#encodeentities) | `true` |
| `alwaysEncodeBreakingEntities` | Encode `&`, `<` and `>` regardless of other option settings. | `false` |
| `alwaysEncodeCodeEntities` | Encode entities in `<pre>` tags regardless of other option settings. | `true` |
| `convertLineBreakToBr` | Convert `\n` line breaks in Slate text nodes to an HTML `<br>` element. | `true` |


### htmlToSlate

```ts
import { htmlToSlate } from '@slate-serializers/html'

const html = `<h1>Heading 1</h1><p>Paragraph 1</p>`

const serializedToSlate = htmlToSlate(html)
// output
/*
[
  {
    children: [
      {
        text: 'Heading 1',
      },
    ],
    type: 'h1',
  },
  {
    children: [
      {
        text: 'Paragraph 1',
      },
    ],
    type: 'p',
  },
]
/*
```

#### Configuration

By default, `htmlToSlate` incorporates transformation rules based on the example in [HTML | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#html).

##### Payload CMS

If you are using [Payload CMS](https://payloadcms.com/), import the Payload configuration file and pass it as a parameter to the serializer.

```ts
import { htmlToSlate, payloadHtmlToSlateConfig } from '@slate-serializers/html'

const html = `<h1>Heading 1</h1><p>Paragraph 1</p>`

const serializedToSlate = htmlToSlate(html, payloadHtmlToSlateConfig)
```

#### Options

Create your own configuration file that implements your schema.

- See [packages/html/src/lib/serializers/htmlToSlate/config/payload.ts](https://github.com/thompsonsj/slate-serializers/blob/main/packages/html/src/lib/serializers/htmlToSlate/config/payload.ts) for an example of how to extend the default configuration; or
- copy [packages/html/src/lib/serializers/htmlToSlate/config/default.ts](https://github.com/thompsonsj/slate-serializers/blob/main/packages/html/src/lib/serializers/htmlToSlate/config/default.ts) and rewrite it as appropriate.

For more detailed documentation and examples, see [htmlToSlate | `slate-serializers`](https://thompsonsj.github.io/slate-serializers-demo/html-to-slate/docs).

| Option  | Description | Default |
| - | - | - |
| `textTags` | Define transform functions for HTML formatting elements. | See [default config](https://github.com/thompsonsj/slate-serializers/blob/main/packages/html/src/lib/serializers/htmlToSlate/config/default.ts). Examples: [textTags.spec.ts](https://github.com/thompsonsj/slate-serializers/blob/main/packages/html/src/lib/tests/htmlToSlate/configuration/textTags.spec.ts). |
| `elementTags` | Define transform functions for HTML element tag names. | See [default config](https://github.com/thompsonsj/slate-serializers/blob/main/packages/html/src/lib/serializers/htmlToSlate/config/default.ts). Example `{ p: () => ({ type: 'p' }), /* ... */ }`. |
| `htmlPreProcessString` | Perform operations on the HTML string before serialization. | `(html) => html.replace(/<pre[^>]*>/g, '<code>').replace(/<\/pre>/g, '</code>')` | /* ... */ }`. |
| `filterWhitespaceNodes` | Remove whitespace that does not contribute meaning. | `true` |
| `convertBrToLineBreak` | Convert br tags to a new line character (\n). | `true` |
