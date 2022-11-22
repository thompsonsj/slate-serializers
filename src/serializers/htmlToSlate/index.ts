import { jsx } from 'slate-hyperscript'
import { Parser, ElementType } from 'htmlparser2'
import { ChildNode, DomHandler, Element } from 'domhandler'
import { getAttributeValue, getName, textContent } from 'domutils'
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

const deserialize = (el: ChildNode): any => {
  if (el.type === ElementType.Text) {
    const text = textContent(el)
    return text.trim() ? text : null
  }
  if (el.type !== ElementType.Tag) {
    return null
  }
  if (getName(el) === 'br') {
    return '\n'
  }

  const nodeName = getName(el)
  let parent = el as Element

  if (nodeName === 'pre' && el.childNodes[0] && getName(el.childNodes[0] as Element) === 'code') {
    ;[parent] = el.childNodes as Element[]
  }

  let children = Array.from(parent.childNodes).map(deserialize).flat()

  if (children.length === 0) {
    children = [{ text: '' }]
  }

  if (getName(el) === 'body') {
    return jsx('fragment', {}, children)
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el)
    return jsx('element', attrs, children)
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el)
    return children.map((child) => jsx('text', attrs, child))
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
      slateContent = dom.map((node) => deserialize(node)).filter((element) => element)
    }
  })
  const parser = new Parser(handler)
  parser.write(removeLineBreaks(html))
  parser.end()
  return slateContent
}
