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

// Re-export domhandler types that appear in public config APIs (e.g. ElementTransform). Consumers can
// `import type { Element } from '@slate-serializers/dom'` instead of adding a direct domhandler dependency.
export type { ChildNode, Element, Text } from 'domhandler'

// Slate to DOM utilities
export { convertSlate } from './utilities/convert-slate'
export { extractCssFromStyle } from './utilities/domhandler'
export { isEmptyObject, styleMapToAttribs } from './utilities'
