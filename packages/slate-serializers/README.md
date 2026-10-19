# slate-serializers

Legacy meta package. It still re-exports `@slate-serializers/html` and `@slate-serializers/dom` (`htmlToSlate`, `slateToHtml`, `slateToDom`, and their configs). You do not need to change existing imports.

The serializers were split so you can install only what you use:

- [@slate-serializers/html](https://www.npmjs.com/package/@slate-serializers/html) — `slateToHtml` and `htmlToSlate`
- [@slate-serializers/dom](https://www.npmjs.com/package/@slate-serializers/dom) — `slateToDom`
- [@slate-serializers/react](https://www.npmjs.com/package/@slate-serializers/react) — `SlateToReact`
- [@slate-serializers/template](https://www.npmjs.com/package/@slate-serializers/template) — `slateToTemplate`
- [@slate-serializers/markdown](https://www.npmjs.com/package/@slate-serializers/markdown) — `slateToMarkdown`

Prefer a scoped package when you want a smaller dependency tree.

**Docs:** [all packages](https://github.com/thompsonsj/slate-serializers/blob/main/README.md) · [demo](https://thompsonsj.github.io/slate-serializers-demo)

- **Legacy overview:** [original.md](https://github.com/thompsonsj/slate-serializers/blob/main/packages/slate-serializers/docs/original.md)

## Upgrade

### HTML serializers

Change import from `slate-serializers` to `@slate-serializers/html`.

If importing configuration objects, change the name as follows.
  - `slateToDomConfig` to `slateToHtmlConfig`.
  - `payloadSlateToDomConfig` to `payloadSlateToHtmlConfig`.
  - `slateDemoSlateToDomConfig` to `slateDemoSlateToHtmlConfig`

### DOM serializer

Change import from `slate-serializers` to `@slate-serializers/dom`.

## Rationale for splitting the packages

As more serializers are introduced, the number of dependencies increase. It makes sense to maintain separate packages to keep the serializers as efficient as possible for their desired use case.
