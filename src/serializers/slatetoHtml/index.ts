import { escape } from 'html-escaper'
import { Text } from 'slate'

export const slateToHtml = (node: any[]) => {
  // slate in payload 1.1.21 does not add p tags at the top level
  // this makes it difficult to serialize back into Slate, as it
  // requires scanning siblings. It also means we need to consider
  // line breaks in the resulting HTML. Add p tags when we convert to
  // HTML to avoid this complexity.
  const nodeWithTopLevelPElements = node.map((el) => {
    if (!el.type) {
      return {
        ...el,
        type: 'p',
      }
    } else if (['a', 'pre', 'code'].includes(el.type)) {
      return {
        children: [el],
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
      return `<a href="${escape(node.url)}">${children}</a>`
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`
    default:
      return children
  }
}
