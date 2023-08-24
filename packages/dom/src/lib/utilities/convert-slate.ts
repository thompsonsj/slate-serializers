import { Document, Element, isTag, Text } from 'domhandler'
import { getName } from 'domutils'
import { encode } from 'html-entities'
import { Text as SlateText } from 'slate'
import { config as defaultConfig } from '../config/default'
import { Config } from '../config/types'
import { nestedMarkElements } from './domhandler'
import { decodeBreakingEntities, encodeBreakingEntities } from '@slate-serializers/utilities'
import { intersection } from '@slate-serializers/utilities'

interface IConvertSlate {
  node: any
  config?: Config
  isLastNodeInDocument?: boolean
  customElementTransforms?: any
  transformText?: (text: Text | Element) => any
  transformElement?: (element: Element) => any
  wrapChildren?: (children: any) => any
}

export const convertSlate = ({
  node,
  config = defaultConfig,
  isLastNodeInDocument = false,
  customElementTransforms,
  /* tslint:disable:no-shadowed-variable */
  transformText = (text) => text,
  /* tslint:disable:no-shadowed-variable */
  transformElement = (element) => element,
  wrapChildren = (children) => new Document(children),
}: IConvertSlate) => {
  if (SlateText.isText(node)) {
    const str =
      config.alwaysEncodeBreakingEntities && !config.encodeEntities ? encodeBreakingEntities(node.text) : node.text

    const strLines = config.convertLineBreakToBr ? str.split('\n') : [str]
    const textChildren: (Element | Text)[] = []

    // convert line breaks to br tags
    strLines.forEach((line, index) => {
      const markElements: Element[] = []
      const markTransformKeys = intersection(config.markTransforms || {}, node)

      markTransformKeys.forEach((key) => {
        if (config.markTransforms?.[key]) {
          const markElement = config.markTransforms[key]({ node, attribs: {} })
          if (markElement) {
            markElements.push(markElement)
          }
        }
      })

      Object.keys(config.markMap).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((node as any)[key]) {
          const elements: Element[] = config.markMap[key].map((tagName) => {
            if (config.markTransforms?.[tagName]) {
              return config.markTransforms[tagName]({ node, attribs: {} })
            }
            return new Element(tagName, {}, [])
          }).filter((element) => element !== undefined) as Element[]
          markElements.push(...elements)
        }
      })
      // clone markElements (it gets modified)
      const markElementsClone = [...markElements]
      const textElement = nestedMarkElements(markElements, new Text(line))

      if (
        config.alwaysEncodeCodeEntities &&
        !config.encodeEntities &&
        isTag(textElement) &&
        getName(textElement) === 'pre'
      ) {
        if (config.alwaysEncodeBreakingEntities) {
          // revert the earlier encoding - encode will re-encode
          line = decodeBreakingEntities(line)
        }
        textChildren.push(nestedMarkElements(markElementsClone, new Text(encode(line))))
      } else {
        textChildren.push(textElement)
      }

      if (index < strLines.length - 1) {
        textChildren.push(transformElement(new Element('br', {})))
      }
    })

    return wrapChildren(textChildren.map((child) =>  transformText(child)))
  }

  const children: any[] = node.children
    ? node.children.map((n: any[]) =>
        convertSlate({
          node: n,
          config,
          customElementTransforms,
          transformText,
          transformElement,
          wrapChildren,
        }),
      )
    : []

  let attribs: { [key: string]: string } = {}

  if (config.elementAttributeTransform) {
    attribs = {
      ...attribs,
      ...config.elementAttributeTransform({ node }),
    }
  }

  let element: Element | null = null

  // more complex transforms
  if (customElementTransforms && customElementTransforms[node.type]) {
    element = customElementTransforms[node.type]({ node, attribs, children })
  } else if (config.elementTransforms[node.type]) {
    element = transformElement(config.elementTransforms[node.type]({ node, attribs, children }) as Element)
  }

  // straightforward node to element mapping
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
