import { ChildNode, Element } from 'domhandler'

interface ElementTagTransform {
  [key: string]: (node: any, children: ChildNode[]) => Element
}

export interface Config {
  markMap: { [key: string]: string[] }
  elementMap: { [key: string]: string }
  elementTransforms: ElementTagTransform
  defaultTag?: string
  encodeEntities?: boolean
}
