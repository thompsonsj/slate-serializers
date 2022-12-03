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

Whitespace formatting can be customised. Default behaviour is as follows.

Content for text marks follow an [inline formatting context](https://developer.mozilla.org/en-US/docs/Web/CSS/Inline_formatting_context).

- reduce line breaks and surrounding space to a single space;
- replace tabs with spaces;
- reduce multiple spaces to a single space; and
- remove space from the beginning and end of a block element (e.g. `h1`, `p`...etc).

### References


- https://github.com/fb55/htmlparser2/issues/90
- https://github.com/aknuds1/html-to-react/issues/79

## Payload CMS

The Slate configuration for Payload CMS results in some Slate nodes being stored with an undefined `type`. See https://github.com/payloadcms/payload/discussions/1141#discussioncomment-4255845.

Note the `defaultTag` option that is passed in the [Payload CMS configuration for `slateToHtml`/`slateToDom`](](src/config/slatetoDom/payload.ts)). This creates a `<p>` HTML element tag whenever a Slate node has an undefined `type`. This is consistent with the approach taken by Payload CMS: In the docs for the rich text field, the serializer example renders the `<p>` HTML element as the default - i.e. if no types are found. See https://github.com/payloadcms/payload/blob/master/docs/fields/rich-text.mdx.

At the moment, we cannot convert from `slateToHtml` to `htmlToSlate` and vice versa and expect consistent results. This is because, with the Payload conifguration, `slateToHtml` adds p tags, and then `htmlToSlate` adds these `p` tags into the Slate JSON.

May be able to resolve the above by simply removing `p` tag conversion? Could possibly specify that.


