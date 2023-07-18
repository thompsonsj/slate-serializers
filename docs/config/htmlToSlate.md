# htmlToSlate configuration

## elementTags

Describe how HTML element tags are mapped to Slate JSON nodes.

In the following simple example, `h1` HTML elements are mapped to a Slate JSON node with a `type` of `heading-one`.

```ts
import { HtmlToSlateConfig } from 'slate-serializers'

const config: HtmlToSlateConfig = {
  // ...
  elementTags: {
    h1: () => ({
      type: 'heading-one',
    }),
  },
  // ...
}
```

The node of type `Element` from `domhandler` is passed into this function. Combine this with [utilities from `domutils`](https://domutils.js.org/) to perform further manipulation.

```ts
import { getAttributeValue } from 'domutils'
import { HtmlToSlateConfig } from 'slate-serializers'

const config: HtmlToSlateConfig = {
  // ...
  elementTags: {
    a: (el) => ({
      type: 'link',
      newTab: el && getAttributeValue(el, 'target') === '_blank',
      url: el && getAttributeValue(el, 'href'),
    }),
  },
  // ...
}
```

### Element maps

A range of configuration options are offered to perform a straightforward HTML element attribute value mapping to **all** elements defined in `elementTags`.

This can help simplify your configuration.

Note that logic in `elementTags` can overwrite any element mappings.

#### elementAttributeMap

#### elementStyleMap

`elementStyleMap` maps individual CSS property values inside the HTML `style` attribute to Slate JSON node properties.

CSS properties need to be defined in camelCase.

The following example maps the `text-align` value in the `style` attribute of the element to an `align` property in the Slate JSON node.

i.e. `<p style="text-align: right;">This is a right aligned paragraph.</p>` will set `align: "right"` on the Slate JSON object for this paragraph.

```ts
{
  // ...
  elementStyleMap: {
    align: 'textAlign'
  },
  // ...
}
```

## textTags

## Other options

### htmlPreProcessString

Perform any operations on the HTML string before serializing to the DOM. This is the first operation to run.

String operations are not ideal, but may be necessary in some cases.

In the following example, regular expressions are used to replace all `<pre>` HTML elements with `<code>`. This is helpful because `htmlparser2` will separate out `<pre>` tags into their own block, whereas `<code>` tags are kept inline.

```ts
import { HtmlToSlateConfig } from 'slate-serializers'

const config: HtmlToSlateConfig = {
  // ...
  htmlPreProcessString: (html) => html.replace(/<pre[^>]*>/g, '<code>').replace(/<\/pre>/g, '</code>'),
  // ...
}
```

### filterWhitespaceNodes

Default: `true`.

Remove any Slate JSON nodes that have no type or content. For example:

```js
{
  children: []
}
```

These nodes may appear after [processing whitespace](/docs/engineering.md#whitespace).
