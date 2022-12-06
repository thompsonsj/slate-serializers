import { Element } from 'domhandler'

export interface IattributeMap {
  slateAttr: string
  htmlAttr: string
}

interface ItagMap {
  [key: string]: (a?: Element) => object
}
