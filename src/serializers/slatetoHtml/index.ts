import { escape } from 'html-escaper'
import { Text } from 'slate'

export const slateToHtml = (node: any[]) => {
  const slateNode = { children: node }
  return slateNodeToHtml(slateNode)
}

const slateNodeToHtml = (node: any) => {
  if (Text.isText(node)) {
    let str = escape(node.text)
    if ((node as any).bold) {
      str = `<strong>${str}</strong>`
    }
    return str
  }

  const children = node.children && node.children.map((n: any[]) => slateNodeToHtml(n)).join('')

  switch (node.type) {
    case 'p':
      return `<p>${children}</p>`
    case 'h1':
      return `<h1>${children}</h1>`
    case 'h2':
      return `<h2>${children}</h2>`
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'ul':
      return `<ul>${children}</ul>`
    case 'li':
      return `<li>${children}</li>`
    case 'link':
      return `<a href="${escape(node.url)}">${children}</a>`
    default:
      return children
  }
}
