import { jsx } from 'slate-hyperscript'
import { Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element } from 'domhandler'
import { getAttributeValue, getChildren, getName, textContent } from 'domutils'
import { hasLineBreak } from '../../utilities'
import { IattributeMap } from '../../types'

interface ItagMap {
  [key: string]: (a?: Element) => object
}

const ELEMENT_TAGS: ItagMap = {
  a: (el) => ({
    type: 'link',
    newTab: el && getAttributeValue(el, 'target') === '_blank',
    url: el && getAttributeValue(el, 'href'),
  }),
  blockquote: () => ({ type: 'blockquote' }),
  h1: () => ({ type: 'h1' }),
  h2: () => ({ type: 'h2' }),
  h3: () => ({ type: 'h3' }),
  h4: () => ({ type: 'h4' }),
  h5: () => ({ type: 'h5' }),
  h6: () => ({ type: 'h6' }),
  li: () => ({ type: 'li' }),
  ol: () => ({ type: 'ol' }),
  p: () => ({ type: 'p' }),
  ul: () => ({ type: 'ul' }),
}

const TEXT_TAGS: ItagMap = {
  code: () => ({ code: true }),
  pre: () => ({ code: true }),
  del: () => ({ strikethrough: true }),
  em: () => ({ italic: true }),
  i: () => ({ italic: true }),
  s: () => ({ strikethrough: true }),
  strong: () => ({ bold: true }),
  u: () => ({ underline: true }),
}

const deserialize = (
  el: ChildNode,
  {
    attributeMap = [],
  }: {
    attributeMap?: IattributeMap[]
  } = {},
): any => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) {
    return null
  }
  const parent = el as Element
  if (getName(parent) === 'br') {
    return '\n'
  }

  const nodeName = getName(parent)

  const children = parent.childNodes ? parent.childNodes.map((node) => deserialize(node, { attributeMap })).flat() : []

  if (getName(parent) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (ELEMENT_TAGS[nodeName]) {
    let attrs = ELEMENT_TAGS[nodeName](parent)
    // tslint:disable-next-line no-unused-expression
    attributeMap.map((map) => {
      const value = getAttributeValue(parent, map.htmlAttr)
      if (value) {
        attrs = {
          [map.slateAttr]: value,
          ...attrs,
        }
      }
    })
    return jsx('element', attrs, children)
  }

  if (TEXT_TAGS[nodeName] || el.type === ElementType.Text) {
    const text = textContent(el)
    if (!hasLineBreak(text) && text.trim() === '') {
      return null
    }
    return [jsx('text', gatherTextMarkAttributes(parent), [])]
  }

  return children
}

const gatherTextMarkAttributes = (el: Element) => {
  let allAttrs = {}
  // tslint:disable-next-line no-unused-expression
  if (el.childNodes) {
    ;[el, ...getChildren(el).flat()].forEach((child) => {
      const name = getName(child as Element)
      const attrs = TEXT_TAGS[name] ? TEXT_TAGS[name](child as Element) : {}
      const text = textContent(child)
      allAttrs = {
        ...allAttrs,
        ...attrs,
        text,
      }
    })
  } else {
    const name = getName(el)
    const attrs = TEXT_TAGS[name] ? TEXT_TAGS[name](el) : {}
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
  {
    attributeMap = [],
  }: {
    attributeMap?: IattributeMap[]
  } = {},
) => {
  let slateContent
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // Handle error
    } else {
      // Parsing completed, do something
      slateContent = dom
        .map((node) => deserialize(node, { attributeMap })) // run the deserializer
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
