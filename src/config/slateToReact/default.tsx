import React, { ReactNode } from "react"
import { Config } from './types'

const BlockQuote = ({ children }: { children: ReactNode }) =>
  <blockquote>
    <p>
      {children}
    </p>
  </blockquote>

export const config: Config = {
  elementTransforms: {
    quote: ({ children }) => {
      return <BlockQuote>{children}</BlockQuote>
    },
    link: ({ node, children = [] }) => {
      const attrs: any = {}
      if (node.newTab) {
        attrs.target = '_blank'
      }
      return <a
        href={node.url}
        {...attrs}
      >{children}</a>
    },
  },
}
