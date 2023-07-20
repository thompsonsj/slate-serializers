import { config as slateToTemplateConfig } from './config/default'
import type { Config as SlateToTemplateConfig } from './config/types'
import { slateToHtml } from '@slate-serializers/html'

export const slateToTemplate = (node: any[], config: SlateToTemplateConfig = slateToTemplateConfig) => {
  if (!Array.isArray(node)) {
    return 
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return node.map((child: any) => {
    const type = child.type
    if (type && config.customElementSerializers?.[type]) {
      return config.customElementSerializers?.[type]({ node })
    } else {
      return slateToHtml([child], config)
    }
  })
}
