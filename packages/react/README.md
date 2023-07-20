# @slate-serializers/react

Render Slate JSON as JSX. Use transform functions to render custom components.

## Usage

### Basic

```tsx
import { SlateToReact } from '@slate-serializers/react'

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

<SlateToReact node={slate} />
// output
// <h1>Heading 1</h1><p>Paragraph 1</p>
```

### Configuration

It is likely you will need to customise transformation rules based on your Slate schema.

#### Render your own components

The following simple example renders a `<Button>` React component using data from Slate JSON nodes of type `button`.

```tsx
import { SlateToReact, slateToReactConfig, type SlateToReactConfig } from '@slate-serializers/react'
import Button from './yourComponent/Button'

const slate = [
  {
    children: [
      {
        text: 'Paragraph',
      },
    ],
    type: 'p',
  },
  {
    children: [
      {
        text: 'Submit',
      },
    ],
    type: 'button',
  },
]

const config: SlateToReactConfig = {
  ...slateToReactConfig,
  react: {
    elementTransforms: {
      ...slateToReactConfig.react.elementTransforms,
      button: ({ node, children = [] }) => {
        return <Button onClick={onClick}>{children}</Button>
      },
    },
  },
}

<SlateToReact node={slate} config={config} />
```

# NX documentation

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test react` to execute the unit tests via [Vitest](https://vitest.dev/).
