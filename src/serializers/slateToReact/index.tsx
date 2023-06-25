import React, { ReactElement,  JSXElementConstructor } from 'react'
import { Element, isTag, Text } from 'domhandler'
import { getName, textContent } from 'domutils'
import { nanoid } from 'nanoid'

import { config as defaultConfig } from '../../config/slateToDom/default'
import { Config } from '../../config/slateToDom/types'
import { slateToReactConfig, type SlateToReactConfig } from '../../react'
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
    {
      /* Ensure all React elements have a unique key - is there a better way to do this? */
      key: nanoid(),
      /* Provide all attributes as props */
      ...element.attribs,
      /* Convert key names for JSX compatibility */
      ...(element.attribs?.class && { className: element.attribs?.class }),
    },
    element.children as any
  )
}
