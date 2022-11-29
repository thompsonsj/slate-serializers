import { Text } from 'slate'
import { AnyNode, Document, Element } from 'domhandler'
import { nestedMarkElements } from '../../utilities/domhandler'
import serializer from 'dom-serializer'
import { config as defaultConfig, Config } from '../../config/slatetoDom/default'

type SlateToHtml = (node: any[], config?: Config) => string
type SlateToDom = (node: any[], config?: Config) => AnyNode | ArrayLike<AnyNode>

export const slateToHtml: SlateToHtml = (node: any[], config = defaultConfig) => {
  const document = slateToDom(node, config)
  return serializer(document, {
    encodeEntities: 'encodeEntities' in config ? config.encodeEntities : false,
  })
}

export const slateToDom: SlateToDom = (node: any[], config = defaultConfig) => {
  const document = node.map((n) => slateNodeToHtml(n, config))
  return document
}

const slateNodeToHtml = (node: any, config = defaultConfig) => {
  if (Text.isText(node)) {
    const str = node.text
    const markElements: string[] = []
    Object.keys(config.markMap).forEach((key) => {
      if ((node as any)[key]) {
        markElements.push(...config.markMap[key])
      }
    })
    return nestedMarkElements(markElements, str)
  }

  const children: any[] = node.children ? node.children.map((n: any[]) => slateNodeToHtml(n, config)) : []

  // straightforward node to element
  if (config.elementMap[node.type]) {
    return new Element(config.elementMap[node.type], {}, children)
  }

  // more complex transforms
  if (config.elementTransforms[node.type]) {
    return config.elementTransforms[node.type](node, children)
  }

  if (config.defaultTag && !node.type) {
    return new Element(config.defaultTag, {}, children)
  }
  return new Document(children)
}
