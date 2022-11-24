import { jsx } from 'slate-hyperscript'
import { Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element, Text } from 'domhandler'
import { getAttributeValue, getChildren, getName, textContent } from 'domutils'
import { removeLineBreaks } from '../../utilities'

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
  pre: () => ({ type: 'code' }),
  ul: () => ({ type: 'ul' }),
}

const TEXT_TAGS: ItagMap = {
  code: () => ({ code: true }),
  del: () => ({ strikethrough: true }),
  em: () => ({ italic: true }),
  i: () => ({ italic: true }),
  s: () => ({ strikethrough: true }),
  strong: () => ({ bold: true }),
  u: () => ({ underline: true }),
}

const deserialize = (el: ChildNode, index?: number): any => {
  if (el.type !== ElementType.Tag && el.type !== ElementType.Text) {
    return null
  }
  const parent = el as Element
  if (getName(parent) === 'br') {
    return '\n'
  }

  const nodeName = getName(parent)
  const nodeFirstChildName = parent.childNodes && parent.childNodes[0] && getName(parent.childNodes[0] as Element)
  const nodeFirstParentName = parent.parent && getName(parent.parent as Element)

  const children = parent.childNodes ? Array.from(parent.childNodes).map(deserialize).flat() : []

  if (getName(parent) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (
    (nodeName === 'pre' && nodeFirstChildName === 'code') ||
    (nodeName === 'code' && nodeFirstChildName === 'pre')
  ) {
    const attrs = TEXT_TAGS[`code`](parent)
    return [jsx('text', attrs, textContent(getChildren(parent.childNodes[0])))]
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](parent)
    return jsx('element', attrs, children)
  }

  if (el.type === ElementType.Text) {
    if (textContent(el).trim() === '') {
      return null
    }
    const name = nodeName || nodeFirstParentName || ''
    const attrs = TEXT_TAGS[name] ? TEXT_TAGS[name](parent) : {}
    return [jsx('text', {...attrs, text: textContent(el)}, children)]
  }

  return children
}

export const htmlToSlate = (html: string) => {
  let slateContent
  const handler = new DomHandler((error, dom) => {
    if (error) {
      // Handle error
    } else {
      // Parsing completed, do something
      slateContent = dom
        .map((node) => deserialize(node)) // run the deserializer
        .filter((element) => element) // filter out null elements
        .map((element) => { // ensure all top level elements have a children property
          if (!element.children) {
            return {
              children: element
            }
          }
          return element
        })
    }
  })
  const parser = new Parser(handler)
  parser.write(removeLineBreaks(html))
  parser.end()
  return slateContent
}
