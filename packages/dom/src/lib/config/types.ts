import { ChildNode, Element } from 'domhandler'

interface MarkTagTransform {
  [key: string]: ({ node, attribs }: { node?: any; attribs?: { [key: string]: string } }) => Element
}

export type ElementTagTransformFunction = ({
  node,
  attribs,
  children,
}: {
  node?: any
  attribs?: { [key: string]: string }
  children?: ChildNode[]
}) => Element | undefined

export interface ElementTagTransform {
  [key: string]: ElementTagTransformFunction
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

type UpdaterFunction = (el: Element) => Element | string

export type HtmlUpdaterFunctionMap = Record<string, UpdaterFunction>
