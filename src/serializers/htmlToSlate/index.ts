import { jsx } from 'slate-hyperscript'
import { parseDocument, Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element, isTag, Node } from 'domhandler'
import { getChildren, getName, replaceElement, textContent } from 'domutils'
import { selectAll } from 'css-select'
import { Descendant } from 'slate'

import { Config } from '../../config/htmlToSlate/types'
import { config as defaultConfig } from '../../config/htmlToSlate/default'

import { extractCssFromStyle } from '../../utilities/domhandler'
import { getNested } from '../../utilities'
import { isBlock } from '../blocks'

import { Context, getContext, isAllWhitespace, processTextValue } from './whitespace'

interface Ideserialize {
  el: ChildNode
  config?: Config
  index?: number
  childrenLength?: number
  context?: Context
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

  const currentEl = el as Element
  const nodeName = getName(currentEl)
  const childrenContext = getContext(nodeName) || context

  const isLastChild = index === childrenLength - 1
  const isWithinTextNodes = currentEl.prev?.type === ElementType.Text && currentEl.next?.type === ElementType.Text

  if (nodeName === 'br' && config.convertBrToLineBreak && context !== 'preserve') {
    return [jsx('text', { text: context ? '\n' : '' }, [])]
  }

  const children = currentEl.childNodes
    ? currentEl.childNodes
        .map((node, i) =>
          deserialize({
            el: node,
            config,
            index: i,
            childrenLength: currentEl.childNodes.length,
            context: childrenContext,
          }),
        )
        .filter((element) => element)
        .filter((element) => !isSlateDeadEnd(element))
        .map((element) => addTextNodeToEmptyChildren(element))
        .flat()
    : []

  if (getName(currentEl) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (config.elementTags[nodeName]) {
    const attrs: any = config.elementTags[nodeName](currentEl)
    // elementAttributeMap is a convenient config for making changes to all elements
    const style = getNested(config, 'elementStyleMap')
    if (style) {
      Object.keys(style).forEach((slateKey) => {
        const cssProperty = style[slateKey]
        const cssValue = extractCssFromStyle(currentEl, cssProperty)
        if (cssValue) {
          attrs[slateKey] = cssValue
        }
      })
    }
    return jsx('element', attrs, children)
  }

  if (config.textTags[nodeName] || el.type === ElementType.Text) {
    const attrs = gatherTextMarkAttributes({ el: currentEl,config })
    const text = processTextValue({
      text: textContent(el as Element),
      context: childrenContext as Context,
      isInlineStart: index === 0,
      isInlineEnd: Number.isInteger(childrenLength) && isLastChild,
      isNextSiblingBlock: (el.next && isTag(el.next) && isBlock(el.next.tagName)) || false,
    })
    if (text === '') {
      return null
    }
    if (isAllWhitespace(text)) {
      if (config.filterWhitespaceNodes && !childrenContext) {
        return null
      }
      if (config.convertBrToLineBreak) {
        if (currentEl.prev && getName(currentEl.prev as Element) === 'br') {
          return null
        }
        if (currentEl.next && getName(currentEl.next as Element) === 'br') {
          return null
        }
      }
    }
    return [jsx('text', { ...attrs, text }, [])]
  }

  return children
}

interface IgatherTextMarkAttributes {
  el: Element | ChildNode
  config?: Config
}

const gatherTextMarkAttributes = ({ el, config = defaultConfig }: IgatherTextMarkAttributes) => {
  let allAttrs = {}
  const children = getChildren(el)
  if (children.length) {
    ;[el, ...children.flat()].forEach((child) => {
      const name = getName(child as Element)
      const attrs = config.textTags[name] ? config.textTags[name](child as Element) : {}
      allAttrs = {
        ...allAttrs,
        ...attrs,
      }
    })
    if (children.length === 1 && getChildren(children[0]).length) {
      allAttrs = {
        ...allAttrs,
        ...gatherTextMarkAttributes({ el: children[0], config }),
      }
    }
  } else {
    const name = getName(el as Element)
    const attrs = config.textTags[name] ? config.textTags[name](el as Element) : {}
    allAttrs = {
      ...attrs,
    }
  }
  return allAttrs
}

export const htmlToSlate = (html: string, config: Config = defaultConfig) => {
  let slateContent: Descendant[] = []
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
  const parser = new Parser(handler, { decodeEntities: true })
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
  const keys = Object.keys(element)
  if (!('children' in element)) return element
  if (element.children.length === 0) {
    element.children.push({ text: '' })
  }
  return element
}
