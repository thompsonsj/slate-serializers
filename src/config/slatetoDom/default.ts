import { ChildNode, Element } from 'domhandler'

interface ElementTagTransform {
  [key: string]: (node: any, children: ChildNode[]) => Element
}

export interface Config {
  markMap: {[key: string]: string[]}
  elementMap: {[key: string]: string},
  elementTransforms: ElementTagTransform,
  enforceTopLevelPTags?: boolean
}

// Map Slate element names to HTML tag names
// Staightforward transform - no attributes are considered
// Use transforms instead for more complex operations
const ELEMENT_NAME_TAG_MAP = {
  p: 'p',
  paragraph: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  blockquote: 'blockquote',
}

const MARK_ELEMENT_TAG_MAP = {
  strikethrough: ['s'],
  bold: ['strong'],
  underline: ['u'],
  italic: ['i'],
  code: ['pre', 'code']
}

export const config: Config = {
  markMap: MARK_ELEMENT_TAG_MAP,
  elementMap: ELEMENT_NAME_TAG_MAP,
  elementTransforms: {
    quote: (node, children = []) => {
      const p = [new Element('p', {}, children)]
      return new Element('blockquote', {}, p)
    },
    link: (node, children= []) => {
      let attrs: any = {}
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
    }
  },
  enforceTopLevelPTags: false
}