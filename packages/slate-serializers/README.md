# slate-serializers

This package has been split into separate packages.

There is no need to change: `slate-serializers` will continue to be maintained alongside the scoped packages. Prefer upgrading to `@slate-serializers/*` when you want a smaller dependency tree.

- **Demo / interactive docs:** [slate-serializers-demo](https://thompsonsj.github.io/slate-serializers-demo)
- **Overview:** [repository README](https://github.com/thompsonsj/slate-serializers/blob/main/README.md)
- **Legacy overview:** [original.md](https://github.com/thompsonsj/slate-serializers/blob/main/packages/slate-serializers/docs/original.md)

## New packages

An overview is available at [README.md](https://github.com/thompsonsj/slate-serializers/blob/main/README.md).

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
