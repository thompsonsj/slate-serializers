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

export const encodeBreakingEntities = (str: string) => {
  const swapChar = (charToSwap: string) => {
    // that swaps characters to HTML entities
    switch (charToSwap) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      default:
        return charToSwap
    }
  }
  str = str.replace(/[&<>]/g, (match) => {
    return swapChar(match)
  })

  return str
}

export const decodeBreakingEntities = (str: string) => {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
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

export const isEmptyObject = (obj: any) =>
  obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype

export const styleMapToAttribs = ({
  elementStyleMap,
  node,
}: {
  elementStyleMap: { [key: string]: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): { [key: string]: any } => {
  let attribs: { [key: string]: string } = {}
  const styleAttrs: { [key: string]: string } = {}
  Object.keys(elementStyleMap).forEach((slateKey) => {
    const cssProperty = elementStyleMap[slateKey]
    const cssValue = node[slateKey]

    if (cssValue) {
      styleAttrs[cssProperty] = cssValue
    }
  })
  if (!isEmptyObject(styleAttrs)) {
    attribs = {
      ...attribs,
      style: styleToString(styleAttrs),
    }
  }
  return isEmptyObject(attribs) ? {} : attribs
}

export const intersection = (o1: { [key: string]: any }, o2: { [key: string]: any }) => {
  return Object.keys(o1)
    .concat(Object.keys(o2))
    .sort()
    .reduce((r: string[], a, i, aa) => {
      if (i && aa[i - 1] === a) {
        r.push(a)
      }
      return r
    }, [])
}
