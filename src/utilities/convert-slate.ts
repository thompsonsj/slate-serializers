import { Document, Element, isTag, Text } from 'domhandler'
import { getName } from 'domutils'
import { encode } from 'html-entities'
import { Text as SlateText } from 'slate'

import { config as defaultConfig } from '../config/slateToDom/default'
import { Config } from '../config/slateToDom/types'
import { nestedMarkElements } from './domhandler'
import { getNested, isEmptyObject, styleToString } from '.'

interface IconvertSlate {
  node: any,
  config?: Config
  isLastNodeInDocument?: boolean
  transformText?: (text: Text) => any
  transformElement?: (element: Element) => any
  wrapChildren?: (children: any) => any
}

export const convertSlate = ({
  node,
  config = defaultConfig,
  isLastNodeInDocument = false,
  transformText = (text) => text,
  transformElement = (element) => element,
  wrapChildren = (children) => new Document(children)
}: IconvertSlate) => {
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
      const textElement = nestedMarkElements(markElements, transformText(new Text(line)))
      if (
        config.alwaysEncodeCodeEntities &&
        config.encodeEntities === false &&
        isTag(textElement) &&
        getName(textElement) === 'pre'
      ) {
        textChildren.push(nestedMarkElements(markElementsClone, transformText(new Text(encode(line)))))
      } else {
        textChildren.push(textElement)
      }

      if (index < strLines.length - 1) {
        textChildren.push(transformElement(new Element('br', {})))
      }
    })

    return wrapChildren(textChildren)
  }

  const children: any[] = node.children ? node.children.map((n: any[]) => convertSlate({
    node: n,
    config
  })) : []

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
    element = transformElement(new Element(config.elementMap[node.type], attribs, children))
  }

  // default tag
  if (!element && config.defaultTag && !node.type) {
    element = transformElement(new Element(config.defaultTag, {}, children))
  }

  if (element) {
    return element
  }

  // add line break between inline nodes
  if (config.convertLineBreakToBr && !isLastNodeInDocument) {
    children.push(transformElement(new Element('br', {})))
  }

  return wrapChildren(children)
}