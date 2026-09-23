import React, { cloneElement, CSSProperties, Fragment, isValidElement, ReactElement, JSXElementConstructor, ReactNode } from 'react'
import { Element, isTag, Text } from 'domhandler'
import { getName, textContent } from 'domutils'

import { convertSlate, parseStyleCssText } from '@slate-serializers/dom'
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
              markMap: config.markMap,
              elementMap: config.elementMap,
              elementAttributeTransform: config.elementAttributeTransform,
              defaultTag: config.defaultTag,
              encodeEntities: config.encodeEntities,
              alwaysEncodeBreakingEntities: config.alwaysEncodeBreakingEntities,
              alwaysEncodeCodeEntities: config.alwaysEncodeCodeEntities,
              convertLineBreakToBr: config.convertLineBreakToBr,
              markTransforms: config.markTransforms,
              // elementTransforms receive React children via customElementTransforms instead.
              elementTransforms: {},
            },
            isLastNodeInDocument: index === node.length - 1,
            customElementTransforms: withKeyedChildren(config.elementTransforms),
            transformText: (text) => transformText(text),
            transformElement: (element) => {
              return domElementToReactElement(element)
            },
            wrapChildren: (children) => toKeyedChildren(children),
          })}
        </Fragment>
      ))}
    </>
  ) as any
}

/**
 * Sibling lists built from the Slate tree are static and ordered, so positional keys are stable.
 * `Children.toArray` is not enough: React 19 still warns for elements that were created without a key.
 */
const FALLBACK_KEY_PREFIX = 'slate-serializers-'

const isKeyedElement = (child: ReactNode): child is ReactElement => isValidElement(child) && child.key != null

const isFallbackWrapper = (child: ReactNode): child is ReactElement =>
  isKeyedElement(child) && child.type === Fragment && String(child.key).startsWith(FALLBACK_KEY_PREFIX)

/**
 * Keys supplied by custom element transforms are kept so React can track those elements across reorders.
 * Everything else gets a positional key; nested lists are flattened, so earlier fallback keys are reassigned.
 */
const toKeyedChildren = (children: ReactNode): ReactNode => {
  if (!Array.isArray(children)) {
    return children
  }
  const flat = children.flat(Infinity) as ReactNode[]
  // Void elements such as <br> reject an (empty) children array.
  if (!flat.length) {
    return undefined
  }
  const suppliedKeys = new Set(
    flat.filter((child) => isKeyedElement(child) && !isFallbackWrapper(child)).map((child) => String((child as ReactElement).key)),
  )
  let fallbackIndex = 0
  const nextFallbackKey = () => {
    let key: string
    do {
      key = `${FALLBACK_KEY_PREFIX}${fallbackIndex++}`
    } while (suppliedKeys.has(key))
    return key
  }
  return flat.map((child) => {
    if (isFallbackWrapper(child)) {
      return cloneElement(child, { key: nextFallbackKey() })
    }
    if (isKeyedElement(child)) {
      return child
    }
    return <Fragment key={nextFallbackKey()}>{child}</Fragment>
  })
}

const withKeyedChildren = (transforms: SlateToReactConfig['elementTransforms']) =>
  Object.fromEntries(
    Object.entries(transforms || {}).map(([type, transform]) => [
      type,
      (args: Parameters<typeof transform>[0]) => transform({ ...args, children: toKeyedChildren(args.children) }),
    ]),
  )

/** HTML attribute names whose React prop name differs by more than `class` → `className`. */
const HTML_ATTRIBUTE_TO_REACT_PROP: Record<string, string> = {
  for: 'htmlFor',
  'accept-charset': 'acceptCharset',
  'http-equiv': 'httpEquiv',
  charset: 'charSet',
  accesskey: 'accessKey',
  allowfullscreen: 'allowFullScreen',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  colspan: 'colSpan',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  enctype: 'encType',
  frameborder: 'frameBorder',
  hreflang: 'hrefLang',
  inputmode: 'inputMode',
  maxlength: 'maxLength',
  minlength: 'minLength',
  novalidate: 'noValidate',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rowspan: 'rowSpan',
  spellcheck: 'spellCheck',
  srcset: 'srcSet',
  tabindex: 'tabIndex',
  usemap: 'useMap',
}

const toReactProps = (attribs: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(attribs).map(([name, value]) => [HTML_ATTRIBUTE_TO_REACT_PROP[name.toLowerCase()] || name, value]),
  )

const transformText = (node: Text | Element | ReactElement): ReactNode => {
  // Line breaks arrive already converted by transformElement.
  if (isValidElement(node)) {
    return node
  }
  if (isTag(node as Element)) {
    const el = node as Element
    const children = (el.children || []).map((child) => transformText(child as Text | Element))
    return domElementToReactElement(el, children)
  }
  return <>{textContent(node as Text)}</>
}

const styleAttributeToReactStyle = (styleAttr: unknown): CSSProperties | undefined => {
  if (!styleAttr) {
    return undefined
  }
  if (typeof styleAttr === 'object' && !Array.isArray(styleAttr)) {
    return styleAttr as CSSProperties
  }
  if (typeof styleAttr === 'string') {
    const parsed = parseStyleCssText(styleAttr)
    return Object.keys(parsed).length > 0 ? (parsed as CSSProperties) : undefined
  }
  return undefined
}

const domElementToReactElement = (
  element: Element,
  children?: ReactNode,
): ReactElement<any, string | JSXElementConstructor<any>> => {
  const { style: styleAttr, class: className, ...restAttribs } = element.attribs || {}
  const style = styleAttributeToReactStyle(styleAttr)

  return React.createElement(
    getName(element),
    {
      /* Keys are not set here: these nodes are not list items from .map(); random keys would remount
       * every render. List keys for top-level blocks are on Fragment wrappers in SlateToReact. */
      ...toReactProps(restAttribs),
      ...(className && { className }),
      ...(style && { style }),
    },
    toKeyedChildren(children !== undefined ? children : (element.children as any)),
  )
}
