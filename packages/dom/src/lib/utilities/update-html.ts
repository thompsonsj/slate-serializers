import { getChildren } from 'domutils'
import { Element } from 'domhandler'
import { HtmlUpdaterFunctionMap } from '../config/types'

export const renameTag = (tagName: string, replacementTagName: string): HtmlUpdaterFunctionMap => ({
  [tagName]: (element: Element) => {
    return new Element(replacementTagName, element.attribs, getChildren(element))
  },
})
