import { Element } from "domhandler"
import { Config } from "./types"

// Map Slate element names to HTML tag names
// Staightforward transform - no attributes are considered
// Use transforms instead for more complex operations
const ELEMENT_NAME_TAG_MAP = {
  blockquote: 'block-quote',
  h1: 'heading-one',
  h2: 'heading-two',
  li: 'list-item',
  ol: 'numbered-list',
  ul: 'bulleted-list',
  p: 'paragraph'
}

const MARK_ELEMENT_TAG_MAP = {
  strikethrough: ['s'],
  bold: ['strong'],
  underline: ['u'],
  italic: ['i'],
  code: ['pre', 'code'],
}

export const config: Config = {
  markMap: MARK_ELEMENT_TAG_MAP,
  elementMap: ELEMENT_NAME_TAG_MAP,
  elementStyleMap: {
    align: 'textAlign'
  },
  elementTransforms: {
    quote: ({children = []}) => {
      const p = [new Element('p', {}, children)]
      return new Element('blockquote', {}, p)
    },
    link: ({node, children = []}) => {
      const attrs: any = {}
      if (node.newTab) {
        attrs.target = '_blank'
      }
      return new Element(
        'a',
        {
          href: node.url,
          ...attrs,
        },
        children,
      )
    },
  },
  encodeEntities: true,
}
