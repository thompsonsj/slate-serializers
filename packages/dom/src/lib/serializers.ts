import { AnyNode, Document } from 'domhandler'

import { config as defaultConfig } from './config/default'
import { Config } from './config/types'
import { convertSlate } from './utilities/convert-slate'

type SlateToDom = (node: any[], config?: Config) => AnyNode | ArrayLike<AnyNode>

export const slateToDom: SlateToDom = (node: any[], config = defaultConfig) => {
  if (!Array.isArray(node)) {
    return new Document([])
  }
  const document = node.map((n, index) =>
    convertSlate({
      node: n,
      config,
      isLastNodeInDocument: index === node.length - 1,
    }),
  )
  return document
}
