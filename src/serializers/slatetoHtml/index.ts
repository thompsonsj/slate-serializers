import { escape } from 'html-escaper'
import { Text } from 'slate'
import { prependSpace } from '../../utilities'
import { IattributeMap } from '../../types'

export const slateToHtml = (
  node: any[],
  {
    enforceTopLevelPTags = false,
    attributeMap = []
  }: {
    enforceTopLevelPTags?: boolean,
    attributeMap?: IattributeMap[]
  } = {},
) => {
  const nodeWithTopLevelPElements = node.map((el) => {
    if (!el.type && enforceTopLevelPTags) {
      return {
        ...el,
        type: 'p',
      }
    }
    return el
  })
  const slateNode = { children: nodeWithTopLevelPElements }
  return slateNodeToHtml(slateNode, { attributeMap })
}

const slateNodeToHtml = (node: any, {
  attributeMap = []
}: {
  attributeMap?: IattributeMap[]
} = {}) => {
  if (Text.isText(node)) {
    let str = escape(node.text)
    if ((node as any).code) {
      str = `<pre><code>${str}</code></pre>`
    }
    if ((node as any).italic) {
      str = `<i>${str}</i>`
    }
    if ((node as any).underline) {
      str = `<u>${str}</u>`
    }
    if ((node as any).bold) {
      str = `<strong>${str}</strong>`
    }
    if ((node as any).strikethrough) {
      str = `<s>${str}</s>`
    }
    return str
  }

  const children: any[] = node.children ? node.children.map((n: any[]) => slateNodeToHtml(n, { attributeMap })).join('') : []

  let attrs = attributeMap.map(map => {
    if (node[map.slateAttr]) {
      return `${map.htmlAttr}="${node[map.slateAttr]}"`
    }
    return null
  })
  .filter(map => map)

  switch (node.type) {
    case 'p':
      return `<p${prependSpace(attrs.join(' '))}>${children}</p>`
    case 'h1':
      return `<h1${prependSpace(attrs.join(' '))}>${children}</h1>`
    case 'h2':
      return `<h2${prependSpace(attrs.join(' '))}>${children}</h2>`
    case 'h3':
      return `<h3${prependSpace(attrs.join(' '))}>${children}</h3>`
    case 'h4':
      return `<h4${prependSpace(attrs.join(' '))}>${children}</h4>`
    case 'h5':
      return `<h5${prependSpace(attrs.join(' '))}>${children}</h5>`
    case 'h6':
      return `<h6${prependSpace(attrs.join(' '))}>${children}</h6>`
    case 'quote':
      return `<blockquote${prependSpace(attrs.join(' '))}><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p${prependSpace(attrs.join(' '))}>${children}</p>`
    case 'ul':
      return `<ul${prependSpace(attrs.join(' '))}>${children}</ul>`
    case 'ol':
      return `<ol${prependSpace(attrs.join(' '))}>${children}</ol>`
    case 'li':
      return `<li${prependSpace(attrs.join(' '))}>${children}</li>`
    case 'link':
      const newTabAttr = node.newTab ? 'target="_blank"' : ''
      if (newTabAttr) {
        attrs = [newTabAttr, ...attrs]
      }
      return `<a href="${escape(node.url)}"${prependSpace(attrs.join(' '))}>${children}</a>`
    case 'blockquote':
      return `<blockquote${prependSpace(attrs.join(' '))}>${children}</blockquote>`
    default:
      return children
  }
}
