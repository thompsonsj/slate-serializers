# slate-serializers

This package has been split into separate packages. As more serializers are introduced, the number of dependencies increase. It makes sense to maintain separate packages to keep the serializers as efficient as possible for their desired use case.
 
There is no need to change - `slate-serializers` will continue to be maintained alongside the new serializers. However, upgrading will keep the dependency tree minimal for your project.

Original docs available at [packages/slate-serializers/docs/original.md](packages/slate-serializers/docs/original.md).

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
