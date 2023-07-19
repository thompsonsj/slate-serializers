import postcss = require('postcss')
import postcssJs = require('postcss-js')

export const transformStyleObjectToString = (style: { [key: string]: any }) => {
  const postcssOptions = {
    parser: postcssJs,
    from: undefined,
  }
  return postcss()
    .process(style, postcssOptions as any)
    .css.replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s\s+/g, ' ')
}

export const transformStyleStringToObject = (style: string) => {
  const root = postcss.parse(style)
  return postcssJs.objectify(root)
}
