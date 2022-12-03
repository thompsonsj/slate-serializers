import { jsx } from 'slate-hyperscript'
import { Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element } from 'domhandler'
import { getChildren, getName, textContent } from 'domutils'
import { Context, getContext, isAllWhitespace, processTextValue } from './whitespace'

import { config as defaultConfig, Config } from '../../config/htmlToSlate/default'

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
        .flat()
    : []

  if (getName(parent) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (config.elementTags[nodeName]) {
    const attrs = config.elementTags[nodeName](parent)
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
      // Parsing completed, do something
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
    }
  })
  const parser = new Parser(handler, { decodeEntities: false })
  parser.write(html)
  parser.end()
  return slateContent
}

const isSlateDeadEnd = (element: { children: [] }) => {
  const keys = Object.keys(element)
  if (!('children' in element)) return false
  return element.children.length === 0 && keys.length === 1
}
