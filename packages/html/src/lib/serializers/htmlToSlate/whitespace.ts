import { isBlock } from '@slate-serializers/utilities'

export type Context = 'preserve' | 'block' | 'inline' | ''

interface IprocessTextValue {
  text: string
  context?: Context
  isInlineStart?: boolean
  isInlineEnd?: boolean
  isNextSiblingBlock?: boolean
}

export const processTextValue = ({
  text,
  context = '',
  isInlineStart = false,
  isInlineEnd = false,
  isNextSiblingBlock = false,
}: IprocessTextValue): string => {
  let parsed = text
  if (context === 'preserve') {
    return parsed
  }
  parsed = minifyText(parsed)
  if (context === 'block') {
    // is this the start of inline content after a block element?
    if (isInlineStart) {
      parsed = parsed.trimStart()
    }
    // is this the end of inline content in a block element?
    if (isInlineEnd || isNextSiblingBlock) {
      parsed = parsed.trimEnd()
    }
  }
  return parsed
}

export const minifyText = (str: string) => {
  return reduceToSingleSpaces(replaceNewlines(str))
}

const replaceNewlines = (str: string) => {
  return str.replace(/(?:\r\n|\r|\n)/g, ' ')
}

const reduceToSingleSpaces = (str: string) => {
  return str.replace(/ +(?= )/g, '')
}

export const isAllWhitespace = (str: string) => {
  return !/[^\t\n\r ]/.test(str)
}

export const getContext = (tagName: string): Context => {
  if (!tagName || tagName.trim() === '') {
    return ''
  }
  if (preserveWhitespace(tagName)) {
    return 'preserve'
  }
  if (isBlock(tagName)) {
    return 'block'
  }
  return 'inline'
}

const preserveWhitespace = (tagName: string) => {
  return ['code', 'pre', 'xmp'].includes(tagName)
}
