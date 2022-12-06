export const hasLineBreak = (str: string) => str.match(/[\r\n]+/) !== null

export const prependSpace = (str: string) => str && ` ${str.trim()}`

const camelize = (str: string) => {
  return str.replace(/(?:^|[-])(\w)/g, (a, c) => {
    c = a.substring(0, 1) === '-' ? c.toUpperCase() : c
    return c ? c : ''
  })
}

export const parseStyleCssText = (value: string): { [key: string]: string } => {
  const output: { [key: string]: string } = {}

  if (!value) {
    return output
  }

  const style = value.split(';')

  for (const s of style) {
    const rule = s.trim()

    if (rule) {
      const ruleParts = rule.split(':')
      const key = camelize(ruleParts[0].trim())
      output[key] = ruleParts[1].trim()
    }
  }

  return output
}

export const styleToString = (style: { [key: string]: string }) => {
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() +
      ':' +
      style[key] +
      ';',
    '',
  )
}

export const isEmptyObject = (obj: any) => obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype

export const removeEmpty = (obj: {}): {} => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

/**
 *
 * @param obj an object of any dimension
 * @param args property list to check
 * @returns undefined or property value
 */
export const getNested = (obj: any, ...args: string[]) => {
  return args.reduce((o, level) => o && o[level], obj)
}
