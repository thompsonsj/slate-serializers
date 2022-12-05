import { Element } from "domhandler"

export interface IattributeMap {
  slateAttr: string
  htmlAttr: string
}

interface ItagMap {
  [key: string]: (a?: Element) => object
}

export interface Config {
  elementTags: ItagMap
  textTags: ItagMap
  htmlPreProcessString?: (html: string) => string
  htmlUpdaterMap?: HtmlUpdaterFunctionMap
  filterWhitespaceNodes: boolean
}

type UpdaterFunction = (el: Element) => Element | string

export type HtmlUpdaterFunctionMap = Record<string, UpdaterFunction>
