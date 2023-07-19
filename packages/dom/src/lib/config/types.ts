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

export type AttributeTransform = ({
  node,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any
}) => { [key: string]: string } | undefined

interface ElementTransforms {
  [key: string]: ElementTransform
}

export interface BaseConfig {
  markMap: { [key: string]: string[] }
  elementMap: { [key: string]: string }
  // markAttributeTransform?: AttributeTransform
  elementAttributeTransform?: AttributeTransform
  defaultTag?: string
  encodeEntities?: boolean
  alwaysEncodeBreakingEntities?: boolean
  alwaysEncodeCodeEntities?: boolean
  convertLineBreakToBr?: boolean
}

export interface Config extends BaseConfig {
  markTransforms?: MarkTransforms
  elementTransforms: ElementTransforms
}

type UpdaterFunction = (el: Element) => Element | string

export type HtmlUpdaterFunctionMap = Record<string, UpdaterFunction>
