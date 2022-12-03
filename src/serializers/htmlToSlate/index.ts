import { jsx } from 'slate-hyperscript'
import { Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element } from 'domhandler'
import { getChildren, getName, textContent } from 'domutils'
import { getContext, minifyText } from './whitespace'

import { config as defaultConfig, Config } from '../../config/htmlToSlate/default'

interface Ideserialize {
  el: ChildNode
  config?: Config
  index?: number
  childrenLength?: number
  context?: string
}

const deserialize = ({el, config = defaultConfig, index = 0, childrenLength = 0, context = ''}: Ideserialize): any => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) {
    return null
  }
  const parent = el as Element
  if (getName(parent) === 'br') {
    return '\n'
  }

  const nodeName = getName(parent)

  const childrenContext = getContext(nodeName) || context

  const children = parent.childNodes ? parent.childNodes.map((node, i) => deserialize({
    el: node,
    config,
    index: i,
    childrenLength: parent.childNodes.length,
    context: childrenContext
  })).flat() : []

  if (getName(parent) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (config.elementTags[nodeName]) {
    const attrs = config.elementTags[nodeName](parent)
    return jsx('element', attrs, children)
  }

  if (config.textTags[nodeName] || el.type === ElementType.Text) {
    const attrs = gatherTextMarkAttributes({el: parent, context: childrenContext})
    let text = (attrs as { text: string}).text
    const isInlineStart = index === 0
    const isInlineEnd = Number.isInteger(childrenLength) && index === (childrenLength - 1)
    if (context === 'block') {
      // is this the start of inline content after a block element?
      if (isInlineStart) {
        text = text.trimStart()
      }
      // is this the end of inline content in a block element?
      if (isInlineEnd) {
        text = text.trimEnd()
      }
    }
    return [jsx('text', {...attrs, text}, [])]
  }

  return children
}

interface IgatherTextMarkAttributes {
  el: Element
  config?: Config
  context?: string
}

const gatherTextMarkAttributes = ({
  el,
  config = defaultConfig,
  context = ''
}: IgatherTextMarkAttributes) => {
  let allAttrs = {}
  // tslint:disable-next-line no-unused-expression
  if (el.childNodes) {
    ;[el, ...getChildren(el).flat()].forEach((child) => {
      const name = getName(child as Element)
      const attrs = config.textTags[name] ? config.textTags[name](child as Element) : {}
      const text = context === 'preserve' ? textContent(child) : minifyText(textContent(child))
      allAttrs = {
        ...allAttrs,
        ...attrs,
        text,
      }
    })
  } else {
    const name = getName(el)
    const attrs = config.textTags[name] ? config.textTags[name](el) : {}
    const text = context === 'preserve' ? textContent(el) : minifyText(textContent(el))
    allAttrs = {
      ...attrs,
      text,
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
        .map((node) => deserialize({el: node, config})) // run the deserializer
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
    }
  })
  const parser = new Parser(handler)
  parser.write(html)
  parser.end()
  return slateContent
}
