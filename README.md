# slate-serializers

A collection of serializers to convert [Slate](https://www.npmjs.com/package/slate) JSON objects to various formats and vice versa. Designed to work in both Node.js and browser environments.

- Convert Slate to a DOM object with [`slateToDom`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/dom). Use the suite of DOM manipulation tools for [`htmlparser2`](https://github.com/fb55/htmlparser2) before serializing to HTML.
- Convert Slate to HTML and vice versa with [`htmlToSlate` and `slateToHtml`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/html).
- Include top-level custom components with [`slateToTemplate`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/template). Framework agnostic - e.g. return Astro, React or Vue components alongside regular HTML nodes.
- Convert Slate to React with [`slateToReact`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/react).

## More information

- For engineering decisions, see [Engineering](docs/engineering.md).
- Review generated NX documentation at [NX](docs/nx.md).
- This repository is an NX monorepo. Review the docs at [https://nx.dev/](https://nx.dev/).
