import { ReactNode } from 'react'
import { Config } from './types'
import { ulid } from 'ulidx'
import { slateToDomConfig } from '@slate-serializers/dom'

const BlockQuote = ({ children }: { children: ReactNode }) => (
  <blockquote>
    <p>{children}</p>
  </blockquote>
)

export const config: Config = {
  markMap: slateToDomConfig.markMap,
  elementMap: slateToDomConfig.elementMap,
  elementAttributeTransform: slateToDomConfig.elementAttributeTransform,
  defaultTag: slateToDomConfig.defaultTag,
  encodeEntities: slateToDomConfig.encodeEntities,
  alwaysEncodeBreakingEntities: slateToDomConfig.alwaysEncodeBreakingEntities,
  alwaysEncodeCodeEntities: slateToDomConfig.alwaysEncodeCodeEntities,
  convertLineBreakToBr: slateToDomConfig.convertLineBreakToBr,
  elementTransforms: {
    quote: ({ children }) => {
      return <BlockQuote key={ulid()}>{children}</BlockQuote>
    },
    link: ({ node, children = [] }) => {
      const attrs: {[key: string]: string} = {}
      if (node.newTab) {
        attrs.target = '_blank'
      }
      return (
        <a key={ulid()} href={node.url} {...attrs}>
          {children}
        </a>
      )
    },
  },
}
