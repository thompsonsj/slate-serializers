// Serializers
export { slateToDom } from './serializers'

// Configuration objects
// slateToDom
export type { BaseConfig, Config as SlateToDomConfig } from './config/types'
export { config as slateToDomConfig } from './config/default'
export { config as payloadSlateToDomConfig } from './config/payload'
export { config as slateDemoSlateToDomConfig } from './config/slateDemo'

// Useful types
export type { ElementTransform, MarkTransform } from './config/types'

// Re-export domhandler APIs used in public config (e.g. ElementTransform, new Element() in transforms).
// `ChildNode` is type-only; `Element` and `Text` are constructors from the same domhandler version as this package.
export type { ChildNode } from 'domhandler'
export { Element, Text } from 'domhandler'

// Slate to DOM utilities
export { convertSlate } from './utilities/convert-slate'
export { extractCssFromStyle } from './utilities/domhandler'
export { isEmptyObject, styleMapToAttribs } from './utilities'
