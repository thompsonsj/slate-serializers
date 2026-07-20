import { ReactNode } from 'react'
import { BaseConfig, MarkTransform } from '@slate-serializers/dom'

interface MarkTransforms {
  [key: string]: MarkTransform
}

interface ElementTagTransform {
  [key: string]: ({
    node,
    attribs,
    children,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node?: any
    attribs?: { [key: string]: string }
    children?: ReactNode
  }) => ReactNode
}

export interface Config extends BaseConfig {
  /**
   * Mark transforms must return domhandler `Element`s. They are applied during
   * Slate→DOM conversion, then converted to React elements (including attributes
   * such as `style`).
   */
  markTransforms?: MarkTransforms
  elementTransforms: ElementTagTransform
}
