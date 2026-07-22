import { styleMapToAttribs, styleToString, isEmptyObject, encodeBreakingEntities, decodeBreakingEntities, intersection } from './index'

describe('styleToString', () => {
  it('converts camelCase keys to kebab-case CSS', () => {
    expect(styleToString({ textAlign: 'right', fontSize: '16px' })).toEqual(
      'text-align:right;font-size:16px;',
    )
  })
})

describe('isEmptyObject', () => {
  it('detects plain empty objects', () => {
    expect(isEmptyObject({})).toBe(true)
    expect(isEmptyObject({ a: 1 })).toBe(false)
    expect(isEmptyObject(null)).toBeFalsy()
  })
})

describe('styleMapToAttribs', () => {
  it('returns an empty object when no mapped styles are present', () => {
    expect(
      styleMapToAttribs({
        elementStyleMap: { align: 'textAlign' },
        node: { type: 'p' },
      }),
    ).toEqual({})
  })

  it('builds a style attribute from mapped slate keys', () => {
    expect(
      styleMapToAttribs({
        elementStyleMap: { align: 'textAlign', color: 'color' },
        node: { align: 'center', color: 'red' },
      }),
    ).toEqual({
      style: 'text-align:center;color:red;',
    })
  })

  it('skips falsy css values', () => {
    expect(
      styleMapToAttribs({
        elementStyleMap: { align: 'textAlign' },
        node: { align: '' },
      }),
    ).toEqual({})
  })
})

describe('encodeBreakingEntities / decodeBreakingEntities', () => {
  it('round-trips & < >', () => {
    const raw = '2 & 1 < 3 > 0'
    const encoded = encodeBreakingEntities(raw)
    expect(encoded).toEqual('2 &amp; 1 &lt; 3 &gt; 0')
    expect(decodeBreakingEntities(encoded)).toEqual(raw)
  })
})

describe('intersection', () => {
  it('returns keys present on both objects', () => {
    expect(intersection({ a: 1, b: 2 }, { b: true, c: 3 })).toEqual(['b'])
  })
})
