# slate-serializers

A collection of serializers to convert [Slate](https://www.npmjs.com/package/slate) JSON objects to various formats and vice versa. Designed to work in both Node.js and browser environments.

Serializers included so far:

- `slateToDom`
- `slateToHtml`
- `htmlToSlate`

## Installation

```bash
yarn add slate-serializers
# or
npm install slate-serializers
```

## Usage

The following examples use a default configuration, which may not transform your data effectively.

One of the principles of Slate is its [**schema-less core**](https://docs.slatejs.org/#principles).

Refer to the [Details](#details) section to learn how to modify the configuration to include your schema/rules.

```ts
import { slateToHtml, htmlToSlate } from 'slate-serializers'

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

// ...and convert back to Slate
const serializedToSlate = htmlToSlate(serializedToHtml)
```

## Details

### slateToDom

`slateToHtml` is a simple wrapper that runs [`dom-serializer`](https://www.npmjs.com/package/dom-serializer) on the output from `slateToDom`.

`slateToDom` is made available in case you wish to work woth the DOM output yourself or run `dom-serializer` using any of the available options.

It accepts the same configuration object as [slateToHtml](#slatetohtml).

### slateToHtml

### Configuration

By default, `slateToHtml` incorporates transformation rules based on the example in [Deserializing | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#deserializing).

If you are using [Payload CMS](https://payloadcms.com/), you are in luck. Import the Payload configuration file and pass it as a parameter to the serializer.

```ts
import { payloadSlateToDomConfig } from 'slate-serializers'

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

const serializedToHtml = slateToHtml(slate, payloadSlateToDomConfig)
```

You can create your own configuration file that implements your schema. See [src/config/slatetoDom/payload.ts](src/config/slatetoDom/payload.ts) for an example of how to extend the default configuration or copy [src/config/slatetoDom/default.ts](src/config/slatetoDom/default.ts) and rewrite it as appropriate.

#### Implementation details

Based on logic in [Deserializing | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#deserializing).

[htmlparser2](https://www.npmjs.com/package/htmlparser2) is used to parse HTML instead of the `DOMHandler` object. Rationale:

- Works in all environments, including Node.js.
- Speed - `htmlparser2` is the fastest HTML parser.
- Forgiving regarding HTML spec compliance.

### htmlToSlate

### Configuration

By default, `htmlToSlate` incorporates transformation rules based on the example in [HTML | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#html).

If you are using [Payload CMS](https://payloadcms.com/), you are in luck. Import the Payload configuration file and pass it as a parameter to the serializer.

```ts
import { payloadHtmlToSlateConfig } from 'slate-serializers'

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

const serializedToHtml = slateToHtml(slate, payloadHtmlToSlateConfig)
```

You can create your own configuration file that implements your schema. See [src/config/htmlToSlate/payload.ts](src/config/htmlToSlate/payload.ts) for an example of how to extend the default configuration or copy [src/config/htmlToSlate/default.ts](src/config/htmlToSlate/default.ts) and rewrite it as appropriate.

#### Implementation details

Based on logic in [HTML | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#html).

## Development

### Commits

TLDR: contributors can format commit messages in any way, maintainers should use conventional commits. 

This repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

Conventional commits are not enforced. General guidance:

- Commit messages can be formatted in any way on a pull request.
- Conventional commit messages are preferred on pull request squash and merge.

Run `npx cz` instead of `git commit` to lint commit messages using [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli). 
