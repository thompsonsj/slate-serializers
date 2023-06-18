// Serializers
export { htmlToSlate } from './serializers/htmlToSlate'
export { slateToDom, slateToHtml } from './serializers/slateToHtml'

// Configuration objects
// slateToDom
export { Config as SlateToDomConfig } from './config/slateToDom/types'
export { config as slateToDomConfig } from './config/slateToDom/default'
export { config as payloadSlateToDomConfig } from './config/slateToDom/payload'
export { config as slateDemoSlateToDomConfig } from './config/slateToDom/slateDemo'

// slateToReact
export { Config as SlateToReactConfig } from './config/slateToReact/types'
export { config as slateToReactConfig } from './config/slateToReact/default'

// htmlToSlate
export { Config as HtmlToSlateConfig } from './config/htmlToSlate/types'
export { config as htmlToSlateConfig } from './config/htmlToSlate/default'
export { config as payloadHtmlToSlateConfig } from './config/htmlToSlate/payload'
export { config as slateDemoHtmlToSlateConfig } from './config/htmlToSlate/slateDemo'
