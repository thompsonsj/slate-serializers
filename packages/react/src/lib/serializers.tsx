import React, { Fragment, ReactElement, JSXElementConstructor } from 'react'
import { Element, isTag, Text } from 'domhandler'
import { getName, textContent } from 'domutils'

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
  // Top-level Slate blocks render as an array of siblings; React needs stable keys on that list.
  // Use index keys here (document order is defined by the Slate value). Do not use random per-render
  // keys — they force remounts and defeat reconciliation.
  return (
    <>
      {node.map((n, index) => (
        <Fragment key={index}>
          {convertSlate({
            node: n,
            config: {
              ...config,
              elementTransforms: {},
              markTransforms: {},
            },
            isLastNodeInDocument: index === node.length - 1,
            customElementTransforms: config.elementTransforms,
            transformText: (text) => transformText(text),
            transformElement: (element) => {
              return domElementToReactElement(element)
            },
            wrapChildren: (children) => children,
          })}
        </Fragment>
      ))}
    </>
  ) as any
}

const transformText = (text: Text | Element) => {
  if (isTag(text as Element)) {
    return React.createElement(getName(text as Element), {}, textContent(text as Element))
  }
  return <>{textContent(text as Text)}</>
}

const domElementToReactElement = (element: Element): ReactElement<any, string | JSXElementConstructor<any>> => {
  const style = element.attribs?.style && typeof element.attribs.style === 'object' && { style: element.attribs?.style }
  return React.createElement(
    getName(element),
    {
      /* Keys are not set here: these nodes are not list items from .map(); random keys would remount
       * every render. List keys for top-level blocks are on Fragment wrappers in SlateToReact. */
      /* Provide all attributes as props */
      ...element.attribs,
      /* Convert key names for JSX compatibility */
      ...(element.attribs?.class && { className: element.attribs?.class }),
      /* Validate style (can convert to React style object using elementAttributeTransform or other transform functions, but it is still possible that a string will be passed) */
      style: style ? style : undefined,
    },
    element.children as any,
  )
}
