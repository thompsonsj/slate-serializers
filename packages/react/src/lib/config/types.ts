import { ReactNode } from 'react'
import { BaseConfig } from '@slate-serializers/dom'

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

export interface Config extends BaseConfig {
  markTransforms?: MarkTagTransform
  elementTransforms: ElementTagTransform
}
