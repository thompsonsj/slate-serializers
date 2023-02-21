import { AnyNode, Document, Element, isTag, Text } from 'domhandler'
import serializer from 'dom-serializer'
import { getName } from 'domutils'
import { encode } from 'html-entities'
import { Text as SlateText } from 'slate'

import { config as defaultConfig } from '../../config/slateToDom/default'
import { nestedMarkElements } from '../../utilities/domhandler'
import { getNested, isEmptyObject, styleToString } from '../../utilities'
import { SlateToDomConfig } from '../..'
import { isBlock } from '../blocks'

type SlateToHtml = (node: any[], config?: SlateToDomConfig) => string
type SlateToDom = (node: any[], config?: SlateToDomConfig) => AnyNode | ArrayLike<AnyNode>

export const slateToHtml: SlateToHtml = (node: any[], config = defaultConfig) => {
  const document = slateToDom(node, config)
  return serializer(document, {
    encodeEntities: 'encodeEntities' in config ? config.encodeEntities : false,
  })
}

export const slateToDom: SlateToDom = (node: any[], config = defaultConfig) => {
  const document = node.map((n, index) => slateNodeToHtml(n, config, index === node.length - 1))
  return document
}

const slateNodeToHtml = (node: any, config = defaultConfig, isLastNodeInDocument = false) => {
  if (SlateText.isText(node)) {
    const str = node.text

    // convert line breaks to br tags
    const strLines = config.convertLineBreakToBr ? str.split('\n') : [str]
    const textChildren: (Element | Text)[] = []

    strLines.forEach((line, index) => {
      const markElements: string[] = []
      Object.keys(config.markMap).forEach((key) => {
        if ((node as any)[key]) {
          markElements.push(...config.markMap[key])
        }
      })
      // clone markElements (it gets modified)
      const markElementsClone = [...markElements]
      const textElement = nestedMarkElements(markElements, new Text(line))
      if (
        config.alwaysEncodeCodeEntities &&
        config.encodeEntities === false &&
        isTag(textElement) &&
        getName(textElement) === 'pre'
      ) {
        textChildren.push(nestedMarkElements(markElementsClone, new Text(encode(line))))
      } else {
        textChildren.push(textElement)
      }

      if (index < strLines.length - 1) {
        textChildren.push(new Element('br', {}))
      }
    })

    return new Document(textChildren)
  }

  const children: any[] = node.children ? node.children.map((n: any[]) => slateNodeToHtml(n, config)) : []

  let attribs: { [key: string]: string } = {}
  const styleAttrs: { [key: string]: string } = {}
  const style = getNested(config, 'elementStyleMap')
  if (style) {
    Object.keys(style).forEach((slateKey) => {
      const cssProperty = style[slateKey]
      const cssValue = node[slateKey]
      if (cssValue) {
        styleAttrs[cssProperty] = cssValue
      }
    })

    if (!isEmptyObject(styleAttrs)) {
      attribs = {
        ...attribs,
        style: styleToString(styleAttrs),
      }
    }
  }

  let element: Element | null = null

  // more complex transforms
  if (config.elementTransforms[node.type]) {
    element = config.elementTransforms[node.type]({ node, attribs, children })
  }

  // straightforward node to element
  if (!element && config.elementMap[node.type]) {
    element = new Element(config.elementMap[node.type], attribs, children)
  }

  // default tag
  if (!element && config.defaultTag && !node.type) {
    element = new Element(config.defaultTag, {}, children)
  }

  if (element) {
    return element
  }

  // add line break between inline nodes
  if (config.convertLineBreakToBr && !isLastNodeInDocument) {
    children.push(new Element('br', {}))
  }

  return new Document(children)
}
