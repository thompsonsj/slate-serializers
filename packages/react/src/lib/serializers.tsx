import React, { ReactElement, JSXElementConstructor } from 'react'
import { Element, isTag, Text } from 'domhandler'
import { getName, textContent } from 'domutils'
import { ulid } from 'ulidx'

import { convertSlate } from '@slate-serializers/dom'
import { config as slateToReactConfig } from './config/default'
import type { Config as SlateToReactConfig } from './config/types'

interface ISlateToReact {
  node: any[]
  config?: SlateToReactConfig
}

export const SlateToReact = ({ node, config = slateToReactConfig }: ISlateToReact) => {
  if (!Array.isArray(node)) {
    return <></>
  }
  const document = node.map((n, index) =>
    convertSlate({
      node: n,
      config: {
        ...config.dom,
        elementTransforms: {},
        markTransforms: {},
      },
      isLastNodeInDocument: index === node.length - 1,
      customElementTransforms: config.react.elementTransforms,
      transformText: (text) => transformText(text),
      transformElement: (element) => {
        return domElementToReactElement(element)
      },
      wrapChildren: (children) => children,
    }),
  )
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
      key: ulid(),
      /* Provide all attributes as props */
      ...element.attribs,
      /* Convert key names for JSX compatibility */
      ...(element.attribs?.class && { className: element.attribs?.class }),
      /* Validate style (can convert to React style object using elementAttributeTransform or other transform functions, but it is still possible that a string will be passed) */
      ...(element.attribs?.style && typeof element.attribs.style === 'object' && { style: element.attribs?.style }),
    },
    element.children as any,
  )
}
