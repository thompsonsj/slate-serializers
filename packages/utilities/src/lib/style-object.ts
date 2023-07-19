import postcss from 'postcss'
import { parse as parser, objectify } from 'postcss-js'

export const transformStyleObjectToString = (style: { [key: string]: any }) => {
  const postcssOptions = {
    parser,
    from: undefined,
  }
  return postcss()
    .process(style, postcssOptions as any)
    .css.replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s\s+/g, ' ')
}

export const transformStyleStringToObject = (style: string) => {
  const root = postcss.parse(style)
  return objectify(root)
}
