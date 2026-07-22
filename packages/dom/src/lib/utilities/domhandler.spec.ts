import { Element, Text } from 'domhandler'
import serializer from 'dom-serializer'
import { getName } from 'domutils'

import { extractCssFromStyle, nestedMarkElements, nestedMarkElementsString } from './domhandler'

describe('nestedMarkElements', () => {
  it('returns the text node when there are no mark wrappers', () => {
    const text = new Text('plain')
    expect(nestedMarkElements([], text)).toBe(text)
  })

  it('wraps text in a single mark element', () => {
    const strong = new Element('strong', {}, [])
    const out = nestedMarkElements([strong], new Text('x'))
    expect(getName(out as Element)).toEqual('strong')
    expect(serializer(out)).toEqual('<strong>x</strong>')
  })

  it('wraps text in more than five mark elements (regression for #181/#183)', () => {
    const els = Array.from({ length: 6 }, (_, i) => new Element(`s${i}`, {}, []))
    const out = nestedMarkElements([...els], new Text('deep'))
    expect(serializer(out)).toEqual('<s0><s1><s2><s3><s4><s5>deep</s5></s4></s3></s2></s1></s0>')
  })

  it('wraps text in ten mark elements', () => {
    const els = Array.from({ length: 10 }, (_, i) => new Element(`m${i}`, {}, []))
    const html = nestedMarkElementsString([...els], 'x')
    expect(html.startsWith('<m0>')).toBe(true)
    expect(html.endsWith('</m0>')).toBe(true)
    expect(html).toContain('>x<')
  })
})

describe('extractCssFromStyle', () => {
  it('returns null when the element has no style attribute', () => {
    expect(extractCssFromStyle(new Element('p', {}, []), 'textAlign')).toBeNull()
  })

  it('looks up camelCase keys from kebab-case CSS text', () => {
    const el = new Element('p', { style: 'text-align:right;color:red;' }, [])
    expect(extractCssFromStyle(el, 'textAlign')).toEqual('right')
    expect(extractCssFromStyle(el, 'color')).toEqual('red')
  })

  it('returns null when the property is missing', () => {
    const el = new Element('p', { style: 'color:red;' }, [])
    expect(extractCssFromStyle(el, 'textAlign')).toBeNull()
  })
})
