import { codeSpan, delimiterRole, fenceInfo, formatUrl, image } from '../utilities'

describe('codeSpan', () => {
  it('pads content that starts or ends with a backtick', () => {
    expect(codeSpan('`a')).toBe('`` `a ``')
    expect(codeSpan('a`')).toBe('`` a` ``')
  })

  it('pads content that has spaces at both ends', () => {
    expect(codeSpan(' a ')).toBe('`  a  `')
  })
})

describe('formatUrl', () => {
  it('wraps an empty URL and encodes < > and newlines', () => {
    expect(formatUrl('')).toBe('<>')
    expect(formatUrl('https://x.com/a<b>\nc')).toBe('<https://x.com/a%3Cb%3E%0Ac>')
  })
})

describe('image', () => {
  it('collapses whitespace and escapes HTML in the alt text', () => {
    expect(image('An\n\n<img> [x]', '/a.png')).toBe('![An \\<img> \\[x\\]](/a.png)')
  })
})

describe('fenceInfo', () => {
  it('strips backticks and line breaks from a language string', () => {
    expect(fenceInfo('ts\n```\n<img>')).toBe('ts')
    expect(fenceInfo('js"<script>')).toBe('jsscript')
    expect(fenceInfo(undefined)).toBe('')
  })
})

describe('delimiterRole', () => {
  it('opens at the start of text and closes at the end', () => {
    expect(delimiterRole(undefined, 'a')).toEqual({ opens: true, closes: false })
    expect(delimiterRole('a', undefined)).toEqual({ opens: false, closes: true })
  })

  it('allows * to open and close next to letters (inside a word)', () => {
    expect(delimiterRole('a', 'b')).toEqual({ opens: true, closes: true })
  })

  it('does not let * open after a letter before punctuation', () => {
    expect(delimiterRole('a', '`').opens).toBe(false)
  })

  it('does not let _ open inside a word', () => {
    expect(delimiterRole('a', 'b', '_')).toEqual({ opens: false, closes: false })
  })
})
