# SlateToReact configuration

This page summarizes how **`SlateToReact`** configuration relates to **`slateToHtml`** / **`slateToDom`**. For interactive examples, see the **[SlateToReact demo](https://thompsonsj.github.io/slate-serializers-demo/slate-to-react/docs)**.

## Flat config

`SlateToReact` takes a **single flat object** (`SlateToReactConfig`): the **same top-level keys** as [`slateToHtml`](./slateToDom.md) / `SlateToDomConfig` (`markMap`, `elementMap`, `elementAttributeTransform`, `defaultTag`, entity and line-break flags, etc.), with **`elementTransforms`** defined to return **React nodes** (JSX) instead of [`domhandler`](https://github.com/fb55/domhandler) `Element` instances.

That matches the flattened [`@slate-serializers/react`](https://www.npmjs.com/package/@slate-serializers/react) API after [issue #191](https://github.com/thompsonsj/slate-serializers/issues/191): one config object, not a separate nested “React” config tree.

## `elementTransforms` (React)

Each entry maps a Slate block **`type`** to a function that receives `node`, `attribs`, children, and returns **`ReactNode`**.

Use **`slateToReactConfig`** or **`payloadSlateToReactConfig`** as a starting point and spread / override `elementTransforms`.

## Marks: `markMap` vs DOM `markTransforms`

**Inline marks** are driven by **`markMap`** (and the default tag wrapping behavior) in the React path.

The internal pipeline **does not** use DOM `markTransforms` from your config when producing React output: block customization is handled by your **React** `elementTransforms`. If you need **`markTransforms`** that return **`new Element(...)`** (DOM), use **`slateToHtml`** from `@slate-serializers/html` instead.

See the demo page section on custom DOM `markTransforms` vs `SlateToReact` for the full explanation.

## Links

- **[`@slate-serializers/react` README](https://github.com/thompsonsj/slate-serializers/blob/main/packages/react/README.md)** (published on npm).
- **[slateToDom configuration](./slateToDom.md)** — DOM / HTML `elementTransforms` and `markTransforms` (return `Element`).
