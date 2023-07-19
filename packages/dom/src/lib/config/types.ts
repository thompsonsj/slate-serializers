import { ChildNode, Element } from 'domhandler'

export type MarkTransform = ({ node, attribs }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any;
  attribs?: { [key: string]: string }
}) => Element | undefined

interface MarkTransforms {
  [key: string]: MarkTransform
}

export type ElementTransform = ({
  node,
  attribs,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any
  attribs?: { [key: string]: string }
  children?: ChildNode[]
}) => Element | undefined

interface ElementTransforms {
  [key: string]: ElementTransform
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
  markTransforms?: MarkTransforms
  elementTransforms: ElementTransforms
  defaultTag?: string
  encodeEntities?: boolean
  alwaysEncodeBreakingEntities?: boolean
  alwaysEncodeCodeEntities?: boolean
  convertLineBreakToBr?: boolean
}

type UpdaterFunction = (el: Element) => Element | string

export type HtmlUpdaterFunctionMap = Record<string, UpdaterFunction>
