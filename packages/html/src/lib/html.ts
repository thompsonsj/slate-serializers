// Serializers
export { htmlToSlate } from './serializers/htmlToSlate'
export { slateToHtml } from './serializers/slateToHtml'

// Configuration objects
// slateToDom - renamed to slateToHtml
// slateToHtml uses the same config as slateToDom but it makes sense to rename the config objects in case we want to add a slateToHtml specific config in the future
export type {
  SlateToDomConfig as SlateToHtmlConfig,
  slateToDomConfig as slateToHtmlConfig,
  payloadSlateToDomConfig as payloadSlateToHtmlConfig,
  slateDemoSlateToDomConfig as slateDemoSlateToHtmlConfig,
  ElementTransform,
  MarkTransform,
} from '@slate-serializers/dom'

// htmlToSlate
export { Config as HtmlToSlateConfig } from './serializers/htmlToSlate/config/types'
export { config as htmlToSlateConfig } from './serializers/htmlToSlate/config/default'
export { config as payloadHtmlToSlateConfig } from './serializers/htmlToSlate/config/payload'
export { config as slateDemoHtmlToSlateConfig } from './serializers/htmlToSlate/config/slateDemo'
