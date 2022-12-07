import { jsx } from 'slate-hyperscript'
import { parseDocument, Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element, isTag, Node } from 'domhandler'
import { getChildren, getName, replaceElement, textContent } from 'domutils'
import { Context, getContext, isAllWhitespace, processTextValue } from './whitespace'

import { Config } from '../../config/htmlToSlate/types'
import { config as defaultConfig } from '../../config/htmlToSlate/default'

import { selectOne, selectAll } from 'css-select'
import serializer from 'dom-serializer'
import { extractCssFromStyle } from '../../utilities/domhandler'
import { getNested } from '../../utilities'

interface Ideserialize {
  el: ChildNode
  config?: Config
  index?: number
  childrenLength?: number
  context?: string
}

const deserialize = ({
  el,
  config = defaultConfig,
  index = 0,
  childrenLength = 0,
  context = '',
}: Ideserialize): any => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) {
    return null
  }
  const parent = el as Element
  if (getName(parent) === 'br') {
    return '\n'
  }

  const nodeName = getName(parent)

  const childrenContext = getContext(nodeName) || context

  const children = parent.childNodes
    ? parent.childNodes
        .map((node, i) =>
          deserialize({
            el: node,
            config,
            index: i,
            childrenLength: parent.childNodes.length,
            context: childrenContext,
          }),
        )
        .filter((element) => element)
        .filter((element) => !isSlateDeadEnd(element))
        .map((element) => addTextNodeToEmptyChildren(element))
        .flat()
    : []

  if (getName(parent) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (config.elementTags[nodeName]) {
    const attrs: any = config.elementTags[nodeName](parent)
    // elementAttributeMap is a convenient config for making changes to all elements
    const style = getNested(config, 'elementStyleMap')
    if (style) {
      Object.keys(style).forEach((slateKey) => {
        const cssProperty = style[slateKey]
        const cssValue = extractCssFromStyle(parent, cssProperty)
        if (cssValue) {
          attrs[slateKey] = cssValue
        }
      })
    }
    return jsx('element', attrs, children)
  }

  if (config.textTags[nodeName] || el.type === ElementType.Text) {
    const attrs = gatherTextMarkAttributes({ el: parent })
    const text = processTextValue({
      text: textContent(el as Element),
      context: childrenContext as Context,
      isInlineStart: index === 0,
      isInlineEnd: Number.isInteger(childrenLength) && index === childrenLength - 1,
    })
    if ((config.filterWhitespaceNodes && isAllWhitespace(text) && !childrenContext) || text === '') {
      return null
    }
    return [jsx('text', { ...attrs, text }, [])]
  }

  return children
}

interface IgatherTextMarkAttributes {
  el: Element
  config?: Config
}

const gatherTextMarkAttributes = ({ el, config = defaultConfig }: IgatherTextMarkAttributes) => {
  let allAttrs = {}
  // tslint:disable-next-line no-unused-expression
  if (el.childNodes) {
    ;[el, ...getChildren(el).flat()].forEach((child) => {
      const name = getName(child as Element)
      const attrs = config.textTags[name] ? config.textTags[name](child as Element) : {}
      allAttrs = {
        ...allAttrs,
        ...attrs,
      }
    })
  } else {
    const name = getName(el)
    const attrs = config.textTags[name] ? config.textTags[name](el) : {}
    allAttrs = {
      ...attrs,
    }
  }
  return allAttrs
}

export const htmlToSlate = (html: string, config: Config = defaultConfig) => {
  let slateContent
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // Handle error
    } else {
      const updaters = config.htmlUpdaterMap ? Object.entries(config.htmlUpdaterMap) : []
      for (const [selector, updater] of updaters) {
        selectAll<Node, Node>(selector, dom as any).forEach((element) => {
          if (isTag(element)) {
            const updated = updater(element)
            if (updated !== null && updated !== element) {
              if (typeof updated === 'string') {
                replaceElement(element, parseDocument(updated) as any)
              } else {
                replaceElement(element, updated)
              }
            }
          }
        })
      }
      slateContent = dom
        .map((node) => deserialize({ el: node, config })) // run the deserializer
        .filter((element) => element) // filter out null elements
        .map((element) => {
          // ensure all top level elements have a children property
          if (!element.children) {
            return {
              children: element,
            }
          }
          return element
        })
        .filter((element) => !isSlateDeadEnd(element))
        .map((element) => addTextNodeToEmptyChildren(element))
    }
  })
  const parser = new Parser(handler, { decodeEntities: false })
  let updatedHtml = html
  if (config.htmlPreProcessString instanceof Function) {
    updatedHtml = config.htmlPreProcessString(html)
  }
  parser.write(updatedHtml)
  parser.end()
  return slateContent
}

const isSlateDeadEnd = (element: { children: [] }) => {
  const keys = Object.keys(element)
  if (!('children' in element)) return false
  return element.children.length === 0 && keys.length === 1
}

const addTextNodeToEmptyChildren = (element: { children: any[] }) => {
  if (!('children' in element)) return element
  if (element.children.length === 0) {
    element.children.push({ text: '' })
  }
  return element
}
