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

// Slate to DOM utilities
export { convertSlate } from './utilities/convert-slate'
export { extractCssFromStyle } from './utilities/domhandler'
export { isEmptyObject, styleMapToAttribs } from './utilities'
