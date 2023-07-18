import { ReactNode } from 'react'

interface MarkTagTransform {
  [key: string]: ({ node, attribs }: { node?: any; attribs?: { [key: string]: string } }) => ReactNode
}

interface ElementTagTransform {
  [key: string]: ({
    node,
    attribs,
    children,
  }: {
    node?: any
    attribs?: { [key: string]: string }
    children?: ReactNode
  }) => ReactNode
}

export interface Config {
  markTransforms?: MarkTagTransform
  elementTransforms: ElementTagTransform
}
