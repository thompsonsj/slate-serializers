# slate-serializers

A collection of serializers to convert Slate JSON objects to various formats and vice versa.

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

## Development

### Commits

TLDR: contributors can format commit messages in any way, maintainers should use conventional commits. 

This repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

Conventional commits are not enforced. General guidance:

- Commit messages can be formatted in any way on a pull request.
- Conventional commit messages are preferred on pull request squash and merge.

Run `npx cz` instead of `git commit` to lint commit messages using [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli). 
