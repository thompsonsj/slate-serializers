import { getChildren } from 'domutils'
import { Element } from 'domhandler'
import { HtmlUpdaterFunctionMap } from '../types'

export const renameTag = (tagName: string, replacementTagName: string): HtmlUpdaterFunctionMap => ({
  [tagName]: (element) => {
    return new Element(
      replacementTagName,
      element.attribs,
      getChildren(element)
    )
  }
})
