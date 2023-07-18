# slate-serializers

A collection of serializers to convert [Slate](https://www.npmjs.com/package/slate) JSON objects to various formats and vice versa. Designed to work in both Node.js and browser environments.

Serializers included so far:

- [`slateToHtml`](#slatetohtml)
- [`htmlToSlate`](#htmltoslate)
- [`slateToDom`](#slatetodom)

View the demo at [https://thompsonsj.github.io/slate-serializers-demo](https://thompsonsj.github.io/slate-serializers-demo).

## Setup

### Compatibility

Serializers are only compatible with Slate >=0.50.0. Earlier versions used a different data model.

Note that compatibility has only been tested with Slate v0.72.8. These serializers are still in active development/testing.

### Install

```bash
yarn add slate-serializers
# or
npm install slate-serializers
```

### Configuration

Each serializer uses a default configuration, which may not transform your data effectively.

One of the principles of Slate is its [**schema-less core**](https://docs.slatejs.org/#principles).

Check configuration objects in [src/config/](src/config/). Extend the default configuration or write your own in order to apply your schema/transformation rules.

## Serializers

### slateToHtml

```ts
import { slateToHtml } from 'slate-serializers'

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

const serializedToHtml = slateToHtml(slate)
// output
// <h1>Heading 1</h1><p>Paragraph 1</p>
```

#### Configuration

By default, `slateToHtml` incorporates transformation rules based on the example in [Deserializing | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#deserializing).

If you are using [Payload CMS](https://payloadcms.com/), import the Payload configuration file and pass it as a parameter to the serializer.

```ts
import { slateToHtml, payloadSlateToDomConfig } from 'slate-serializers'

const slate = [
  {
    children: [
      {
        text: 'Heading 1',
      },
    ],
    type: 'h1',
  },
]

const serializedToHtml = slateToHtml(slate, payloadSlateToDomConfig)
```

You can create your own configuration file that implements your schema. See [src/config/slateToDom/payload.ts](src/config/slateToDom/payload.ts) for an example of how to extend the default configuration or copy [src/config/slateToDom/default.ts](src/config/slateToDom/default.ts) and rewrite it as appropriate.

### htmlToSlate

```ts
import { htmlToSlate } from 'slate-serializers'

const html = `<h1>Heading 1</h1><p>Paragraph 1</p>`

const serializedToSlate = htmlToSlate(html)
// output
/*
[
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
/*
```

#### Configuration

By default, `htmlToSlate` incorporates transformation rules based on the example in [HTML | Serializing | Slate](https://docs.slatejs.org/concepts/10-serializing#html).

If you are using [Payload CMS](https://payloadcms.com/), import the Payload configuration file and pass it as a parameter to the serializer.

```ts
import { htmlToSlate, payloadHtmlToSlateConfig } from 'slate-serializers'

const html = `<h1>Heading 1</h1><p>Paragraph 1</p>`

const serializedToSlate = htmlToSlate(html, payloadHtmlToSlateConfig)
```

You can create your own configuration file that implements your schema. See [src/config/htmlToSlate/payload.ts](src/config/htmlToSlate/payload.ts) for an example of how to extend the default configuration or copy [src/config/htmlToSlate/default.ts](src/config/htmlToSlate/default.ts) and rewrite it as appropriate.

For a breakdown of configuration options, see [docs/config/htmlToSlate.md](docs/config/htmlToSlate.md).

#### Whitespace

`htmlToSlate` processes whitespace in a similar way to browsers. It minifies whitespace while trying to preserve meaning. For details, see [docs/engineering.md#whitespace](docs/engineering.md#whitespace).

### slateToDom

`slateToHtml` is a simple wrapper that runs [`dom-serializer`](https://www.npmjs.com/package/dom-serializer) on the output from `slateToDom`.

`slateToDom` is made available in case you wish to work with the DOM output yourself or run `dom-serializer` using any of the available options.

It accepts the same configuration object as [slateToHtml](#slatetohtml).

### Commits

TLDR: contributors can format commit messages in any way, maintainers should use conventional commits.

This repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

Conventional commits are not enforced. General guidance:

- Commit messages can be formatted in any way on a pull request.
- Conventional commit messages are preferred on pull request squash and merge.

Run `npx cz` instead of `git commit` to lint commit messages using [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli).

# NX generated documentation

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/core-features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/core-features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
