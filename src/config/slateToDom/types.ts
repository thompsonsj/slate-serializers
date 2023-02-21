import { ChildNode, Element } from 'domhandler'

interface ElementTagTransform {
  [key: string]: ({
    node,
    attribs,
    children,
  }: {
    node?: any
    attribs?: { [key: string]: string }
    children?: ChildNode[]
  }) => Element
}

export interface Config {
  markMap: { [key: string]: string[] }
  elementMap: { [key: string]: string }
  elementStyleMap?: {
    [key: string]: string
  }
  elementTransforms: ElementTagTransform
  defaultTag?: string
  encodeEntities?: boolean
  alwaysEncodeCodeEntities?: boolean
  convertLineBreakToBr?: boolean
}
