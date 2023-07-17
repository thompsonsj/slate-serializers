import { processTextValue } from './whitespace'

describe('processTextValue function', () => {
  describe('"preserve" context', () => {
    it('does not do anything if the context is "preserve"', () => {
      const fixture = ` after on space
      and then line breaks and spaces`
      expect(
        processTextValue({
          text: fixture,
          context: 'preserve',
        }),
      ).toEqual(fixture)
    })
  })

  describe('"block" context', () => {
    const context = 'block'
    const fixture = '   text  '
    it('removes space from the start of a string if isInlineStart is true', () => {
      const expected = 'text '
      expect(
        processTextValue({
          text: fixture,
          context: context,
          isInlineStart: true,
        }),
      ).toEqual(expected)
    })

    it('removes space from the end of a string if isInlineEnd is true', () => {
      const expected = ' text'
      expect(
        processTextValue({
          text: fixture,
          context: context,
          isInlineEnd: true,
        }),
      ).toEqual(expected)
    })

    it('removes space from both ends of a string if isInlineStart and isInlineEnd is true', () => {
      const expected = 'text'
      expect(
        processTextValue({
          text: fixture,
          context: context,
          isInlineStart: true,
          isInlineEnd: true,
        }),
      ).toEqual(expected)
    })
  })

  describe('"inline" context', () => {
    const context = 'inline'
    const fixture = '   text  '
    it('normalizes space at the start of a string if isInlineStart is true', () => {
      const expected = ' text '
      expect(
        processTextValue({
          text: fixture,
          context: context,
          isInlineStart: true,
        }),
      ).toEqual(expected)
    })

    it('normalizes space at the the end of a string if isInlineEnd is true', () => {
      const expected = ' text '
      expect(
        processTextValue({
          text: fixture,
          context: context,
          isInlineEnd: true,
        }),
      ).toEqual(expected)
    })

    it('normalizes space at both ends of a string if isInlineStart and isInlineEnd is true', () => {
      const expected = ' text '
      expect(
        processTextValue({
          text: fixture,
          context: context,
          isInlineStart: true,
          isInlineEnd: true,
        }),
      ).toEqual(expected)
    })
  })

  describe('"block", "inline" or "" context', () => {
    const fixture = `before line break
after line break`
    const expected = 'before line break after line break'
    it('replaces line breaks with a space in an empty context', () => {
      expect(
        processTextValue({
          text: fixture,
          context: '',
        }),
      ).toEqual(expected)
    })

    it('replaces line breaks with a space in an "inline" context', () => {
      expect(
        processTextValue({
          text: fixture,
          context: 'inline',
        }),
      ).toEqual(expected)
    })

    it('replaces line breaks with a space in a "block context', () => {
      expect(
        processTextValue({
          text: fixture,
          context: 'block',
        }),
      ).toEqual(expected)
    })
  })
})
