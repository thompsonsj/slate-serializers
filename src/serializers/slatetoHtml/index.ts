import { escape } from 'html-escaper'
import { Text } from 'slate'
import { Document, Element} from 'domhandler'
import { IattributeMap } from '../../types'
import { nestedMarkElements } from '../../utilities/domhandler'
import serializer from 'dom-serializer'

interface stringKeyObject {
  [name: string]: string;
}

// Map Slate element names to HTML tag names
// Only to be used for standard 'wrapper' elements
const ELEMENT_NAME_TAG_MAP = new Map([
  ['p', 'p'],
  ['paragraph', 'p'],
  ['h1', 'h1'],
  ['h2', 'h2'],
  ['h3', 'h3'],
  ['h4', 'h4'],
  ['h5', 'h5'],
  ['h6', 'h6'],
  ['ul', 'ul'],
  ['ol', 'ol'],
  ['li', 'li'],
  ['blockquote', 'blockquote']
])

export const slateToHtml = (
  node: any[],
  {
    enforceTopLevelPTags = false,
    attributeMap = [],
  }: {
    enforceTopLevelPTags?: boolean
    attributeMap?: IattributeMap[]
  } = {},
) => {
  const document = slateToDom(node, { attributeMap, enforceTopLevelPTags })
  return serializer(document)
}

export const slateToDom = (
  node: any[],
  {
    enforceTopLevelPTags = false,
    attributeMap = [],
  }: {
    enforceTopLevelPTags?: boolean
    attributeMap?: IattributeMap[]
  } = {},
) => {
  const nodeWithTopLevelPElements = node.map((el) => {
    if (!el.type && enforceTopLevelPTags) {
      return {
        ...el,
        type: 'p',
      }
    }
    return el
  })
  const slateNode = { children: nodeWithTopLevelPElements }
  const document = slateNodeToHtml(slateNode, { attributeMap })
  return document
}

const slateNodeToHtml = (
  node: any,
  {
    attributeMap = [],
  }: {
    attributeMap?: IattributeMap[]
  } = {},
) => {
  if (Text.isText(node)) {
    let str = escape(node.text)
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

  const children: any[] = node.children
    ? node.children.map((n: any[]) => slateNodeToHtml(n, { attributeMap }))
    : []

  let attrs: stringKeyObject = {}
  // tslint:disable-next-line no-unused-expression
  attributeMap
    .forEach((map) => {
      if (node[map.slateAttr]) {
        attrs[map.htmlAttr] = node[map.slateAttr]
      }
    })

  if (ELEMENT_NAME_TAG_MAP.has(node.type)) {
    return new Element(
      ELEMENT_NAME_TAG_MAP.get(node.type) || '',
      attrs,
      children
    )
  }

  switch (node.type) {
    case 'quote':
      const p = [new Element('p', {}, children)]
      return new Element(
        'blockquote',
        attrs,
        p
      )
    case 'link':
      if (node.newTab) { attrs.target = "_blank"}
      return new Element(
        'a',
        {
          href: escape(node.url),
          ...attrs,
        },
        children
      )
    default:
      return new Document(children)
  }
}
