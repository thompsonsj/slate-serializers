import { Element } from 'domhandler'

interface ItagMap {
  [key: string]: (a?: Element) => object
}

export type AttributeTransform = ({
  el,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  el: Element
}) => { [key: string]: string } | undefined

/**
 * For details on configuration options:
 * @see /docs/config/htmlToSlate.md
 */
export interface Config {
  /* Shortcut to map all HTML attribute/values */
  elementAttributeMap?: {
    style?: { [key: string]: string }
  }
  /* Use a custom function to generate Slate node attributes based on every Element passed through the serializer */
  elementAttributeTransform?: AttributeTransform
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
  /* Replace multiple whitespace characters with a single space. */
  trimWhiteSpace?: boolean
}

type UpdaterFunction = (el: Element) => Element | string

export type HtmlUpdaterFunctionMap = Record<string, UpdaterFunction>
