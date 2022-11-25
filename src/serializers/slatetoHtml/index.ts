import { escape } from 'html-escaper'
import { Text } from 'slate'

export const slateToHtml = (
  node: any[],
  {
    enforceTopLevelPTags =false,
    attributePropertyMap = []
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
  return slateNodeToHtml(slateNode)
}

const slateNodeToHtml = (node: any) => {
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

  const children: any[] = node.children ? node.children.map((n: any[]) => slateNodeToHtml(n)).join('') : []

  switch (node.type) {
    case 'p':
      return `<p>${children}</p>`
    case 'h1':
      return `<h1>${children}</h1>`
    case 'h2':
      return `<h2>${children}</h2>`
    case 'h3':
      return `<h3>${children}</h3>`
    case 'h4':
      return `<h4>${children}</h4>`
    case 'h5':
      return `<h5>${children}</h5>`
    case 'h6':
      return `<h6>${children}</h6>`
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'ul':
      return `<ul>${children}</ul>`
    case 'ol':
      return `<ol>${children}</ol>`
    case 'li':
      return `<li>${children}</li>`
    case 'link':
      const newTabAttr = node.newTab ? ' target="_blank"' : ''
      return `<a href="${escape(node.url)}"${newTabAttr}>${children}</a>`
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`
    default:
      return children
  }
}
