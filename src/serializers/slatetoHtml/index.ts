import { escape } from 'html-escaper'
import { Text } from 'slate'
import { AnyNode, Document, Element } from 'domhandler'
import { nestedMarkElements } from '../../utilities/domhandler'
import serializer from 'dom-serializer'
import { config as defaultConfig, Config } from '../../slateToDom.config'

interface SlateToHtml {
  (node: any[], config?: Config): string
}

interface SlateToDom {
  (node: any[], config?: Config): AnyNode | ArrayLike<AnyNode>
}

export const slateToHtml: SlateToHtml = (
  node: any[],
  config = defaultConfig,
) => {
  const document = slateToDom(node, config)
  return serializer(document)
}

export const slateToDom: SlateToDom = (
  node: any[],
  config = defaultConfig,
) => {
  const nodeWithTopLevelPElements = node.map((el) => {
    if (!el.type && config.enforceTopLevelPTags) {
      return {
        ...el,
        type: 'p',
      }
    }
    return el
  })
  const slateNode = { children: nodeWithTopLevelPElements }
  const document = slateNodeToHtml(slateNode, config)
  return document
}

const slateNodeToHtml = (
  node: any,
  config = defaultConfig
) => {
  if (Text.isText(node)) {
    const str = escape(node.text)
    let markElements = []
    if ((node as any).strikethrough) {
      markElements.push('s')
    }
    if ((node as any).bold) {
      markElements.push('strong')
    }
    if ((node as any).underline) {
      markElements.push('u')
    }
    if ((node as any).italic) {
      markElements.push('i')
    }
    if ((node as any).code) {
      markElements.push('pre', 'code')
    }
    return nestedMarkElements(markElements, str)
  }

  const children: any[] = node.children ? node.children.map((n: any[]) => slateNodeToHtml(n, config)) : []

  // straightforward node to element
  if (config.elementMap.has(node.type)) {
    return new Element(config.elementMap.get(node.type) || '', {}, children)
  }

  // more complex transforms
  if (config.elementTransforms[node.type]) {
    return config.elementTransforms[node.type](node, children)
  }

  return new Document(children)
}
