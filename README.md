# slate-serializers

A collection of serializers to convert [Slate](https://www.npmjs.com/package/slate) JSON objects to various formats and vice versa. Designed to work in both Node.js and browser environments.

## Convert Slate to DOM

- Convert Slate to a DOM object with [`slateToDom`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/dom).
- Use the suite of DOM manipulation tools for [`htmlparser2`](https://github.com/fb55/htmlparser2) before serializing to HTML.
- NPM: [https://www.npmjs.com/package/@slate-serializers/dom](https://www.npmjs.com/package/@slate-serializers/dom).

## Convert Slate to HTML and vice versa

- Convert Slate to HTML and vice versa with [`htmlToSlate` and `slateToHtml`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/html).
- NPM: [https://www.npmjs.com/package/@slate-serializers/html](https://www.npmjs.com/package/@slate-serializers/html).

## Include framework-agnostic components

- Include top-level custom components with [`slateToTemplate`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/template). Framework agnostic - e.g. return Astro, React or Vue components alongside regular HTML nodes.
- NPM: [https://www.npmjs.com/package/@slate-serializers/template](https://www.npmjs.com/package/@slate-serializers/template)

## Convert Slate to React

- Convert Slate to React with [`slateToReact`](https://github.com/thompsonsj/slate-serializers/tree/main/packages/react).
- NPM: [https://www.npmjs.com/package/@slate-serializers/react](https://www.npmjs.com/package/@slate-serializers/react)

## More information

- For engineering decisions, see [Engineering](https://github.com/thompsonsj/slate-serializers/blob/main/docs/engineering.md).
- Review generated NX documentation at [NX](https://github.com/thompsonsj/slate-serializers/blob/main/docs/nx.md).
- This repository is an NX monorepo. Review the docs at [https://nx.dev/](https://nx.dev/).
