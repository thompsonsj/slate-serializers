import {
  transformStyleObjectToString,
  transformStyleStringToObject,
} from './style-object'

describe('transformStyleObjectToString', () => {
  it('converts a style object to a single-line CSS string', () => {
    const css = transformStyleObjectToString({ color: 'red', fontSize: '16px' })
    expect(css).toContain('color: red')
    expect(css).toContain('font-size: 16px')
    expect(css).not.toMatch(/\n/)
  })

  it('supports nested @media style objects', () => {
    const css = transformStyleObjectToString({
      color: 'black',
      '@media (min-width: 600px)': {
        color: 'blue',
      },
    })
    expect(css).toContain('@media (min-width: 600px)')
    expect(css).toContain('color: blue')
  })
})

describe('transformStyleStringToObject', () => {
  it('parses a CSS string into an object', () => {
    expect(transformStyleStringToObject('color: red; font-size: 16px')).toEqual({
      color: 'red',
      fontSize: '16px',
    })
  })

  it('handles an empty string', () => {
    expect(transformStyleStringToObject('')).toEqual({})
  })
})
