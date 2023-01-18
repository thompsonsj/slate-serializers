import { Element } from 'domhandler'

interface ItagMap {
  [key: string]: (a?: Element) => object
}

/**
 * For details on configuration options:
 * @see /docs/config/htmlToSlate.md
 */
export interface Config {
  /* Shortcut to map all HTML attribute/values */
  elementAttributeMap?: {
    style?: { [key: string]: string }
  }
  /* Shortcut to map CSS attribute/values in an inline HTML style attribute */
  elementStyleMap?: {
    [key: string]: string
  }
  /* Map HTML element tags to Slate JSON object attributes */
  elementTags: ItagMap
  /* Map HTML text tags to Slate JSON object attributes */
  textTags: ItagMap
  /* Perform string operations on the html string before it is parsed to a DOM Document Object Model */
  htmlPreProcessString?: (html: string) => string
  /* Pass updater functions to modify HTML */
  htmlUpdaterMap?: HtmlUpdaterFunctionMap
  /* Remove whitespace that does not contribute meaning */
  filterWhitespaceNodes: boolean
  /* Convert br tags to a new line character (\n) */
  convertBrToLineBreak?: boolean
}

type UpdaterFunction = (el: Element) => Element | string

export type HtmlUpdaterFunctionMap = Record<string, UpdaterFunction>
