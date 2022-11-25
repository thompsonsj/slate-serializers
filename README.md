# slate-serializers

A collection of serializers to convert [Slate](https://www.npmjs.com/package/slate) JSON objects to various formats and vice versa. Designed to work in both Node.js and browser environments.

Serializers included so far:

- `slateToHtml`
- `htmlToSlate`

## Installation

```bash
yarn add slate-serializers
# or
npm install slate-serializers
```

Example usage:

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

Both serializers support an `attributeMap` option, which maps Slate attributes to HTML attributes and vice versa. This is supported for element tags only.

```ts
const slate = [
  {
    children: [
      {
        type: 'link',
        linkType: "custom",
        url: 'https://github.com/thompsonsj/slate-serializers',
        newTab: true,
        children: [
          {
            text: 'slate-serializers | GitHub',
          },
        ],
      },
    ],
    type: 'p',
  }
]

const html = slateToHtml(slate,
  {
    attributeMap: [
      {
        slateAttr: 'linkType',
        htmlAttr: 'data-link-type'
      } 
    ]
  }
)

// output
// <p><a href="https://github.com/thompsonsj/slate-serializers" target="_blank" data-link-type="custom">slate-serializers | GitHub</a></p>

// using the same attributeMap for htmlToSlate will ensure the linkType attribute is preserved in the Slate JSON object.
const slateReserialized = htmlToSlate(html,
  {
    attributeMap: [
      {
        slateAttr: 'linkType',
        htmlAttr: 'data-link-type'
      } 
    ]
  }
)
```

## Details

### slateToHtml

Based on logic in [Deserializing | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#deserializing).

[htmlparser2](https://www.npmjs.com/package/htmlparser2) is used to parse HTML instead of the `DOMHandler` object. Rationale:

- Works in all environments, including Node.js.
- Speed - `htmlparser2` is the fastest HTML parser.
- Forgiving regarding HTML spec compliance.

#### Options

You may get better results passing the `enforceTopLevelPTags` option.

```js
slateToHtml(slate, {enforceTopLevelPTags: true})
```

Objects in the Slate JSON can have no type (e.g. `p`) and contain a number of children. This causes issues for the serializer, which renders each child at the top of the DOM. Example: `Paragraph 1.Paragraph 2.`. Complexity is increased when text marks are involved such as `u`, `strong` and `i`.

To avoid this, `enforceTopLevelPTags` ensures any top level objects without a type are assigned as a `p` tag. Example: `<p>Paragraph 1.</p><p>Paragraph 2.</p>`.

### htmlToSlate

Based on logic in [HTML | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#html).

## Development

### Commits

TLDR: contributors can format commit messages in any way, maintainers should use conventional commits. 

This repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

Conventional commits are not enforced. General guidance:

- Commit messages can be formatted in any way on a pull request.
- Conventional commit messages are preferred on pull request squash and merge.

Run `npx cz` instead of `git commit` to lint commit messages using [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli). 
