## `htmlparser2`

[htmlparser2](https://www.npmjs.com/package/htmlparser2) and its associated utilities are used to:

- convert Slate JSON objects into a DOM document object (output in `slateToDom` or serialize to a HTML string in `slateToHtml`)
- parse a HTML string into a DOM document object before conversion to Slate JSON.

Rationale for using `htmlparser2` and its associated utilities:

- Works in all environments, including Node.js.
- Speed - `htmlparser2` is the fastest HTML parser.
- No need to implement our formatting/encoding logic. [`dom-serializer`](https://www.npmjs.com/package/dom-serializer) handles this.

## Payload CMS

The Slate configuration for Payload CMS results in some Slate nodes being stored with an undefined `type`. See https://github.com/payloadcms/payload/discussions/1141#discussioncomment-4255845.

Note the `defaultTag` option that is passed in the [Payload CMS configuration for `slateToHtml`/`slateToDom`](](src/config/slatetoDom/payload.ts)). This creates a `<p>` HTML element tag whenever a Slate node has an undefined `type`. This is consistent with the approach taken by Payload CMS: In the docs for the rich text field, the serializer example renders the `<p>` HTML element as the default - i.e. if no types are found. See https://github.com/payloadcms/payload/blob/master/docs/fields/rich-text.mdx.

At the moment, we cannot convert from `slateToHtml` to `htmlToSlate` and vice versa and expect consistent results. This is because, with the Payload conifguration, `slateToHtml` adds p tags, and then `htmlToSlate` adds these `p` tags into the Slate JSON.

May be able to resolve the above by simply removing `p` tag conversion? Could possibly specify that.
