import React, { ReactNode } from 'react'
import { Config } from './types'
import { ulid } from 'ulidx'
import { slateToDomConfig } from '@slate-serializers/dom'

const BlockQuote = ({ children }: { children: ReactNode }) => (
  <blockquote>
    <p>{children}</p>
  </blockquote>
)

export const config: Config = {
  dom: {
    ...slateToDomConfig,
  },
  react: {
    elementTransforms: {
      quote: ({ children }) => {
        return <BlockQuote key={ulid()}>{children}</BlockQuote>
      },
      link: ({ node, children = [] }) => {
        const attrs: any = {}
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
  },
}
