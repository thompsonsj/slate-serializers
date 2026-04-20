import { Document, Element, isTag, Text } from 'domhandler'
import { getName } from 'domutils'
import { encode } from 'html-entities'
import { Text as SlateText } from 'slate'
import { config as defaultConfig } from '../config/default'
import { Config } from '../config/types'
import { nestedMarkElements } from './domhandler'
import { decodeBreakingEntities, encodeBreakingEntities } from '.'
import { intersection } from '.'

interface IConvertSlate {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any
  config?: Config
  isLastNodeInDocument?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customElementTransforms?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformText?: (text: Text | Element) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformElement?: (element: Element) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapChildren?: (children: any) => any
}

type TransformText = NonNullable<IConvertSlate['transformText']>
type TransformElement = NonNullable<IConvertSlate['transformElement']>
type WrapChildren = NonNullable<IConvertSlate['wrapChildren']>

const convertSlateChildren = ({
  node,
  config,
  customElementTransforms,
  transformText,
  transformElement,
  wrapChildren,
}: {
  node: any
  config: Config
  customElementTransforms: any
  transformText: TransformText
  transformElement: TransformElement
  wrapChildren: WrapChildren
}): any[] => {
  return node.children
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
}

const appendTrailingBrIfNeeded = ({
  children,
  config,
  isLastNodeInDocument,
  transformElement,
}: {
  children: any[]
  config: Config
  isLastNodeInDocument: boolean
  transformElement: TransformElement
}) => {
  // Add a line break between inline nodes when converting a list of siblings (e.g. top-level blocks).
  if (config.convertLineBreakToBr && !isLastNodeInDocument) {
    children.push(transformElement(new Element('br', {})))
  }
}

const getAttribs = (node: any, config: Config): { [key: string]: string } => {
  if (!config.elementAttributeTransform) {
    return {}
  }
  return {
    ...config.elementAttributeTransform({ node }),
  }
}

const buildMarkElements = (node: any, config: Config): Element[] => {
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
      const elements: Element[] = config.markMap[key]
        .map((tagName) => {
          if (config.markTransforms?.[tagName]) {
            return config.markTransforms[tagName]({ node, attribs: {} })
          }
          return new Element(tagName, {}, [])
        })
        .filter((element) => element !== undefined) as Element[]
      markElements.push(...elements)
    }
  })

  return markElements
}

const convertSlateTextNode = ({
  node,
  config,
  transformText,
  transformElement,
  wrapChildren,
}: {
  node: any
  config: Config
  transformText: TransformText
  transformElement: TransformElement
  wrapChildren: WrapChildren
}) => {
  const str = config.alwaysEncodeBreakingEntities && !config.encodeEntities ? encodeBreakingEntities(node.text) : node.text

  const strLines = config.convertLineBreakToBr ? str.split('\n') : [str]
  const textChildren: (Element | Text)[] = []

  // convert line breaks to br tags
  strLines.forEach((line: string, index: number) => {
    const markElements = buildMarkElements(node, config)

    // clone markElements (it gets modified)
    const markElementsClone = [...markElements]
    const textElement = nestedMarkElements(markElements, new Text(line))

    if (
      config.alwaysEncodeCodeEntities &&
      !config.encodeEntities &&
      isTag(textElement) &&
      getName(textElement) === 'pre'
    ) {
      let encodedLine = line
      if (config.alwaysEncodeBreakingEntities) {
        // revert the earlier encoding - encode will re-encode
        encodedLine = decodeBreakingEntities(encodedLine)
      }
      textChildren.push(nestedMarkElements(markElementsClone, new Text(encode(encodedLine))))
    } else {
      textChildren.push(textElement)
    }

    if (index < strLines.length - 1) {
      textChildren.push(transformElement(new Element('br', {})))
    }
  })

  return wrapChildren(textChildren.map((child) => transformText(child)))
}

const convertSlateElementNode = ({
  node,
  children,
  config,
  customElementTransforms,
  transformElement,
}: {
  node: any
  children: any[]
  config: Config
  customElementTransforms: any
  transformElement: TransformElement
}): Element | null => {
  const attribs = getAttribs(node, config)

  // more complex transforms
  if (customElementTransforms && customElementTransforms[node.type]) {
    const custom = customElementTransforms[node.type]({ node, attribs, children })
    if (custom) {
      return custom
    }
  }
  if (config.elementTransforms[node.type]) {
    const transformed = config.elementTransforms[node.type]({ node, attribs, children }) as Element | undefined
    if (transformed) {
      return transformElement(transformed)
    }
  }

  // straightforward node to element mapping
  if (config.elementMap[node.type]) {
    return transformElement(new Element(config.elementMap[node.type], attribs, children))
  }

  // default tag
  if (config.defaultTag && !node.type) {
    return transformElement(new Element(config.defaultTag, attribs, children))
  }

  return null
}

export const convertSlate = ({
  node,
  config = defaultConfig,
  isLastNodeInDocument = false,
  customElementTransforms,
  transformText = (text) => text,
  transformElement = (element) => element,
  wrapChildren = (children) => new Document(children),
}: IConvertSlate) => {
  if (SlateText.isText(node)) {
    return convertSlateTextNode({ node, config, transformText, transformElement, wrapChildren })
  }

  const children = convertSlateChildren({
    node,
    config,
    customElementTransforms,
    transformText,
    transformElement,
    wrapChildren,
  })

  const element = convertSlateElementNode({
    node,
    children,
    config,
    customElementTransforms,
    transformElement,
  })

  if (element) {
    return element
  }

  appendTrailingBrIfNeeded({ children, config, isLastNodeInDocument, transformElement })

  return wrapChildren(children)
}
