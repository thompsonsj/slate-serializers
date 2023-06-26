# slateToDom configuration

## elementMap

Describe how Slate JSON **node types** are mapped to HTML element tags.

In the following simple example, Slate JSON nodes with a `type` of `heading-one` are mapped to `h1` HTML elements.

```ts
import { SlateToDomConfig } from 'slate-serializers'

const config: SlateToDomConfig = {
  // ...
  elementMap: {
    ['heading-one']: 'h1',
  },
  // ...
}
```

## elementTransforms

For more complex transformations, use `elementTransforms`.

```ts
import { Element } from 'domhandler'

const config: SlateToDomConfig = {
  // ...
  elementTransforms: {
    image: ({ node }: { node?: any }) => {
      return new Element('img', {
        src: node.url,
      })
    },
  },
  // ...
}
```

The Slate JS node is passed into this function. A node of type `Element` from `domhandler` must be returned. Combine this with [utilities from `domutils`](https://domutils.js.org/) to perform further manipulation.

In this case, the `src` attribute is set using a `url` value on the Slate JS node.

## markMap

Describe how Slate JSON **node attributes** are mapped to HTML formatting elements.

In the following simple example, Slate JSON nodes with an attribute of `subScript: true` include a `sub` HTML formatting element.

```ts
import { SlateToDomConfig } from 'slate-serializers'

const config: SlateToDomConfig = {
  // ...
  markMap: {
    subScript: ['sub'],
  },
  // ...
}
```

Note that the config value is an array of strings. This allows multiple formatting elements to be mapped to a single Slate JSON node attribute.

## markTransforms

For more complex transformations, use `markTransforms`.

```ts
import { Element } from 'domhandler'

const config: SlateToDomConfig = {
  // ...
  markTransforms: {
    fontSize: ({ node }: { node?: any }) => {
      return new Element('span', {
        style: `font-size:${node.fontSize};`,
      })
    },
  },
  // ...
}
```

**Keys should map keys on the Slate object**. This is different to `elementTransform` which uses the value of the Slate JSON `type` property only.

The Slate JS node is passed into this function. A node of type `Element` from `domhandler` must be returned. Combine this with [utilities from `domutils`](https://domutils.js.org/) to perform further manipulation.

In this case, the `style` attribute is set with a CSS string using a `fontSize` value on the Slate JS node.
