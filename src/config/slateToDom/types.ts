import { ChildNode, Element } from 'domhandler'

interface MarkTagTransform {
  [key: string]: ({ node, attribs }: { node?: any; attribs?: { [key: string]: string } }) => Element
}

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
  markStyleMap?: {
    [key: string]: string
  }
  markTransforms?: MarkTagTransform
  elementTransforms: ElementTagTransform
  defaultTag?: string
  encodeEntities?: boolean
  alwaysEncodeBreakingEntities?: boolean
  alwaysEncodeCodeEntities?: boolean
  convertLineBreakToBr?: boolean
}
