import React, { createElement, FC, ReactElement, ReactNode, JSXElementConstructor } from 'react'
import { AnyNode, Document, Element, isTag, Text } from 'domhandler'
import { getChildren, getName, textContent } from 'domutils'
import serializer from 'dom-serializer'
import { nanoid } from 'nanoid'

import { config as defaultConfig } from '../../config/slateToDom/default'
import { Config } from '../../config/slateToDom/types'
import { slateToReactConfig, type SlateToReactConfig } from '../..'
import { convertSlate } from '../../utilities/convert-slate'

interface ISlateToReact {
  node: any[]
  config?: Config
  reactConfig?: SlateToReactConfig
}

export const SlateToReact = ({
  node,
  config = defaultConfig,
  reactConfig = slateToReactConfig
}: ISlateToReact) => {
  if (!Array.isArray(node)) {
    return <></>
  }
  const document = node.map((n, index) => convertSlate({
    node: n,
    ...{
      config,
      elementTransforms: {},
    },
    isLastNodeInDocument: index === node.length - 1,
    customElementTransforms: reactConfig.elementTransforms,
    transformText: (text) => transformText(text),
    transformElement: (element) => {
      return domElementToReactElement(element)
    },
    wrapChildren: (children) => children
  }))
  return document as any
}

const transformText = (text: Text | Element) => {
  if (isTag(text as Element)) {
    return React.createElement(getName(text as Element), {}, textContent(text as Element))
  }
  return <>{textContent(text as Text)}</>
}

const domElementToReactElement = (element: Element): ReactElement<any, string | JSXElementConstructor<any>> => {
  return React.createElement(
    getName(element),
    { key: nanoid() },
    element.children as any
  )
}
