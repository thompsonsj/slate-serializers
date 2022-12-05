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

export const nestedMarkElementsString = (els: string[], text: string) => {
  return serializer(nestedMarkElements(els, text))
}

export const nestedMarkElements = (els: string[], text: string) => {
  if (els.length === 0) {
    return new Text(text)
  }
  let element
  const el1 = els.pop()
  element = new Element(el1 as string, {}, [new Text(text)])
  if (!els || els.length === 0) {
    return element
  }
  const el2 = els.pop()
  element = new Element(el2 as string, {}, [element])
  if (!els || els.length === 0) {
    return element
  }
  const el3 = els.pop()
  element = new Element(el3 as string, {}, [element])
  if (!els || els.length === 0) {
    return element
  }
  const el4 = els.pop()
  element = new Element(el4 as string, {}, [element])
  if (!els || els.length === 0) {
    return element
  }
  const el5 = els.pop()
  element = new Element(el5 as string, {}, [element])
  if (!els || els.length === 0) {
    return element
  }
  return element
}

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
