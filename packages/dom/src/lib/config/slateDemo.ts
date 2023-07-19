import { Config } from './types'
import { isEmptyObject, styleMapToAttribs } from '@slate-serializers/utilities'

const ELEMENT_NAME_TAG_MAP = {
  ['block-quote']: 'blockquote',
  ['heading-one']: 'h1',
  ['heading-two']: 'h2',
  ['list-item']: 'li',
  ['numbered-list']: 'ol',
  ['bulleted-list']: 'ul',
  paragraph: 'p',
}

const MARK_ELEMENT_TAG_MAP = {
  strikethrough: ['s'],
  bold: ['strong'],
  underline: ['u'],
  italic: ['i'],
  code: ['pre', 'code'],
}

export const config: Config = {
  markMap: MARK_ELEMENT_TAG_MAP,
  elementMap: ELEMENT_NAME_TAG_MAP,
  elementTransforms: {},
  elementAttributeTransform: ({ node }) => {
    const elementStyleMap: { [key: string]: string } = {
      align: 'textAlign',
    }
    const attribs = styleMapToAttribs({elementStyleMap, node})      
    return isEmptyObject(attribs) ? {} : attribs
  },
  encodeEntities: true,
}
