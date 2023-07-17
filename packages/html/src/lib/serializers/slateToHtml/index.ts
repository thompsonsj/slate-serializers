import serializer from 'dom-serializer'

import { slateToDom, slateToDomConfig as defaultConfig, type SlateToDomConfig } from '@slate-serializers/dom'

type SlateToHtml = (node: any[], config?: SlateToDomConfig) => string

export const slateToHtml: SlateToHtml = (node: any[], config = defaultConfig) => {
  const document = slateToDom(node, config)
  return serializer(document, {
    encodeEntities: 'encodeEntities' in config ? config.encodeEntities : false,
  })
}
