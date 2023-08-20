# Engineering decisions

- [Slate compatibility](#slate-compatibility)
- [`htmlparser2`](#htmlparser2)

## Slate compatibility

Serializers are only compatible with Slate >=0.50.0. Earlier versions used a different data model.

Note that compatibility has only been tested with Slate v0.72.8. These serializers are still in active development/testing.

## `htmlparser2`

[htmlparser2](https://www.npmjs.com/package/htmlparser2) and its associated utilities are used to:

- convert Slate JSON objects into a DOM document object (output in `slateToDom` or serialize to a HTML string in `slateToHtml`)
- parse a HTML string into a DOM document object before conversion to Slate JSON.

Rationale for using `htmlparser2` and its associated utilities:

- Works in all environments, including Node.js.
- Speed - `htmlparser2` is the fastest HTML parser.
- No need to implement our formatting/encoding logic. [`dom-serializer`](https://www.npmjs.com/package/dom-serializer) handles this.

## Whitespace

> The presence of whitespace in the DOM can cause layout problems and make manipulation of the content tree difficult in unexpected ways, depending on where it is located.

[https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace)

Developers define their own schema for Slate. For example, Payload CMS renders a default `<p>` HTML element for any nodes without a type. `<div>` elements are not mapped. This means any top-level `<div>` elements will be rendered as paragraphs. Furthermore, `slateToHtml` makes the (reasonable) assumption that these elements are paragraphs, and renders the output as such.

Because we define our own schema, it's difficult to generalize rules for handling whitespace.

It may be helpful to minify HTML before passing it to `htmlToSlate`. This might reduce some false positives by removing extra whitespace. Some possible solutions:

- https://www.npmjs.com/package/html-minifier
- https://github.com/rehypejs/rehype-minify/tree/main/packages/rehype-minify-whitespace

### `htmlToSlate`

Whitespace in text nodes is processed depending on context.

Content for text marks follow an [inline formatting context](https://developer.mozilla.org/en-US/docs/Web/CSS/Inline_formatting_context).

- reduce line breaks and surrounding space to a single space;
- replace tabs with spaces;
- reduce multiple spaces to a single space; and
- remove space from the beginning and end of the contents of a block element (e.g. `h1`, `p`...etc).

Before:

```
<p>
  <b>
    <i>bar</i></b>
</p>
```

After:

```
<p>foo<b> <i>bar</i></b></p>
```

Block elements follow a [block formatting context](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context).

By default, the `filterWhitespaceNodes` is set to `true`. This option removes nodes from the Slate JSON object that:

- contain only whitespace; and
- have no context.

This helps when passing a HTML string that uses line breaks/tabs/spaces to make the document more readable. These spaces do not add any meaning to the document, and so it isn't helpful to represent them in the Slate JSON. Furthermore, depending on the schema, these nodes may be interpreted as elements or part of the content.

For text nodes inside `<code>` and/or `<pre>` HTML elements, whitespace is preserved.

### References

- https://github.com/fb55/htmlparser2/issues/90
- https://github.com/aknuds1/html-to-react/issues/79

## Payload CMS

The Slate configuration for Payload CMS results in some Slate nodes being stored with an undefined `type`. See https://github.com/payloadcms/payload/discussions/1141#discussioncomment-4255845.

Note the `defaultTag` option that is passed in the [Payload CMS configuration for `slateToHtml`/`slateToDom`](<](src/config/slateToDom/payload.ts)>). This creates a `<p>` HTML element tag whenever a Slate node has an undefined `type`. This is consistent with the approach taken by Payload CMS: In the docs for the rich text field, the serializer example renders the `<p>` HTML element as the default - i.e. if no types are found. See https://github.com/payloadcms/payload/blob/master/docs/fields/rich-text.mdx.

At the moment, we cannot convert from `slateToHtml` to `htmlToSlate` and vice versa and expect consistent results. This is because, with the Payload conifguration, `slateToHtml` adds p tags, and then `htmlToSlate` adds these `p` tags into the Slate JSON.

May be able to resolve the above by simply removing `p` tag conversion? Could possibly specify that.

## HTML entity encoding/decoding

One of the tricker parts of serializing from between Slate and HTML is that Slate doesn't care about HTML entity encoding. This is expected - Slate is unaware of HTML, it offers a serializer friendly format.

Special considerations are made for `htmlToSlate` and `slateToHtml`.

### `slateToHtml`

This becomes an issue for `code` and `pre` tags, where you may want to encode HTML entities in order that they display correctly.

To accommodate this, an option is available for `slateToHtml`: `alwaysEncodeCodeEntities`. If this option is`true` and `encodeEntities` is `false`, this latter option will be ignored when dealing with `code` or `pre` tags, and the content within will always be encoded.

Note that in the default configuration, all HTML entities are encoded.

- `alwaysEncodeCodeEntities` defaults to `false`.
- `encodeEntities` defaults to `true`.

### `htmlToslate`

`htmlToSlate` will always encode HTML entities. There is no option to disable this behaviour. This is because in a Slate editor, we do not expect to find any HTML entity codes. As mentioned in the introduction, Slate should be as unaware of HTML as possible.

## Line breaks

### `htmlToSlate`

`br` HTML elements get special treatment. The default configuration sets `convertBrToLineBreak` to `true`, and each `br` HTML element will be converted to a text node in Slate that contains `\n`.

If you have schema rules that process `br` tags (e.g. in `elementTags` in the configuration), you may choose to disable this behaviour by setting `convertBrToLineBreak` to `false`.

### `slateToHtml`

Line breaks get special treatment. When `convertLineBreakToBr` is set to `true`, each text node in Slate that contains `\n` line break will be converted to an HTML `<br>` element.

## TypeScript

Note the use of the `any` type for Slate nodes.

Slate recommends defining custom `Element` or `Text` types, extending the `CustomTypes` interface in the slate module. See [TypeScript | Slate](https://docs.slatejs.org/concepts/12-typescript).

However, `@slate-serializers` does not enforce this requirement, allowing objects of any form to be passed as Slate JSON.

This makes the serializers easier to use and accommodates users who may not have defined all of their `CustomTypes`. Furthermore, it makes it easier to work with implementations of Slate in other projects where such types may not be exported, and reduces the maintenance requirement in those cases.

Each line that uses this type is excluded from linting with `// eslint-disable-next-line @typescript-eslint/no-explicit-any`. The discourages the use of `any` in other cases.
