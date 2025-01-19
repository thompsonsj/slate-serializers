import { getAttributeValue } from 'domutils'
import { Element, Text } from 'domhandler'
import serializer from 'dom-serializer'
import { parseStyleCssText } from '.'

/**
 * Generate nested mark elements
 *
 * nestedMarkElements should be recursive, but it works
 * so leaving it for now. Can handle a maximum of 5
 * elements. Really shouldn't be any more than that!
 */

export const nestedMarkElementsString = (els: Element[], text: string) => {
  return serializer(nestedMarkElements(els, new Text(text)))
}

export const nestedMarkElements = (els: Element[], element: Element | Text) => {
  while (els && els.length > 0) {
    const el = els.pop()
    if (el) {
      el.children = [element]
      element = el
    }
  }
  return element
}

/**
 * Extract css value from style attribute
 * @param el domhandler Element
 * @param attribute css attribute in camelCase
 * @returns css value or null
 */
export const extractCssFromStyle = (el: Element, attribute: string): string | null => {
  const cssText = el && getAttributeValue(el, 'style')
  if (cssText) {
    const css = parseStyleCssText(cssText)
    if (css[attribute]) {
      return css[attribute]
    }
  }
  return null
}
