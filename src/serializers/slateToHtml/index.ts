import { AnyNode, Document } from 'domhandler'
import serializer from 'dom-serializer'

import { config as defaultConfig } from '../../config/slateToDom/default'
import { SlateToDomConfig } from '../..'
import { convertSlate } from '../../utilities/convert-slate'

type SlateToHtml = (node: any[], config?: SlateToDomConfig) => string
type SlateToDom = (node: any[], config?: SlateToDomConfig) => AnyNode | ArrayLike<AnyNode>

export const slateToHtml: SlateToHtml = (node: any[], config = defaultConfig) => {
  const document = slateToDom(node, config)
  return serializer(document, {
    encodeEntities: 'encodeEntities' in config ? config.encodeEntities : false,
  })
}

export const slateToDom: SlateToDom = (node: any[], config = defaultConfig) => {
  if (!Array.isArray(node)) {
    return new Document([])
  }
  const document = node.map((n, index) => convertSlate({
    node: n,
    config,
    isLastNodeInDocument: index === node.length - 1
  }))
  return document
}
