import {
  hasLineBreak,
  prependSpace,
  isEmptyObject,
  removeEmpty,
  getNested,
} from './utilities'

describe('utilities helpers', () => {
  it('detects line breaks', () => {
    expect(hasLineBreak('a\nb')).toBe(true)
    expect(hasLineBreak('ab')).toBe(false)
  })

  it('prepends a trimmed space', () => {
    expect(prependSpace('  hi ')).toEqual(' hi')
    expect(prependSpace('')).toEqual('')
  })

  it('detects empty plain objects', () => {
    expect(isEmptyObject({})).toBe(true)
    expect(isEmptyObject({ a: 1 })).toBe(false)
  })

  it('removes nullish entries', () => {
    expect(removeEmpty({ a: 1, b: null, c: undefined, d: 0 })).toEqual({ a: 1, d: 0 })
  })

  it('reads nested properties safely', () => {
    expect(getNested({ a: { b: { c: 3 } } }, 'a', 'b', 'c')).toEqual(3)
    expect(getNested({ a: {} }, 'a', 'b', 'c')).toBeUndefined()
  })
})
