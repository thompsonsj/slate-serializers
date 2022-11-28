import { jsx } from 'slate-hyperscript'
import { Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element } from 'domhandler'
import { getAttributeValue, getChildren, getName, textContent } from 'domutils'
import { hasLineBreak } from '../../utilities'
import { IattributeMap } from '../../types'

import { config as defaultConfig, Config } from '../../config/htmlToSlate/default'

const deserialize = (
  el: ChildNode,
  config: Config = defaultConfig,
): any => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) {
    return null
  }
  const parent = el as Element
  if (getName(parent) === 'br') {
    return '\n'
  }

  const nodeName = getName(parent)

  const children = parent.childNodes ? parent.childNodes.map((node) => deserialize(node, config)).flat() : []

  if (getName(parent) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (config.elementTags[nodeName]) {
    let attrs = config.elementTags[nodeName](parent)
    return jsx('element', attrs, children)
  }

  if (config.textTags[nodeName] || el.type === ElementType.Text) {
    const text = textContent(el)
    if (!hasLineBreak(text) && text.trim() === '') {
      return null
    }
    return [jsx('text', gatherTextMarkAttributes(parent), [])]
  }

  return children
}

const gatherTextMarkAttributes = (
  el: Element,
  config: Config = defaultConfig
  ) => {
  let allAttrs = {}
  // tslint:disable-next-line no-unused-expression
  if (el.childNodes) {
    ;[el, ...getChildren(el).flat()].forEach((child) => {
      const name = getName(child as Element)
      const attrs = config.textTags[name] ? config.textTags[name](child as Element) : {}
      const text = textContent(child)
      allAttrs = {
        ...allAttrs,
        ...attrs,
        text,
      }
    })
  } else {
    const name = getName(el)
    const attrs = config.textTags[name] ? config.textTags[name](el) : {}
    const text = textContent(el)
    allAttrs = {
      ...attrs,
      text,
    }
  }
  return allAttrs
}

export const htmlToSlate = (
  html: string,
  config: Config = defaultConfig,
) => {
  let slateContent
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // Handle error
    } else {
      // Parsing completed, do something
      slateContent = dom
        .map((node) => deserialize(node, config)) // run the deserializer
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
