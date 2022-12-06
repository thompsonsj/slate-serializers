# htmlToSlate configuration

## elementTags

Describe how HTML element tags are mapped to Slate JSON nodes.

In the following simple example, `h1` HTML elements are mapped to a Slate JSON node with a `type` of `heading-one`.

```ts
{
  // ...
  elementTags: {
    h1: () => ({
      type: 'heading-one',
    }),
  }
  // ...
}
```

The node of type `Element` from `domhandler` is passed into this function. Combine this with utilities from `domutils` to perform further manipulation.

```ts
{
  // ...
  elementTags: {
    a: (el) => ({
      type: 'link',
      newTab: el && getAttributeValue(el, 'target') === '_blank',
      url: el && getAttributeValue(el, 'href'),
    }),
  }
  // ...
}
```

## Element maps

A range of configuration options are offered to map HTML element attribute values to **all** elements defined in `elementTags`.

This can help simplify your configuration.

Note that logic in `elementTags` can overwrite any element mappings.

### elementAttributeMap

### elementStyleMap

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

