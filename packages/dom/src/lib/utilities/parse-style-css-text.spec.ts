import { parseStyleCssText } from '.'

describe('parseStyleCssText', () => {
  it('camelizes standard CSS properties', () => {
    expect(parseStyleCssText('text-align:right;font-size:16px')).toEqual({
      textAlign: 'right',
      fontSize: '16px',
    })
  })

  it('preserves CSS custom properties', () => {
    expect(parseStyleCssText('--text-color: #DD3A0A; color: red')).toEqual({
      '--text-color': '#DD3A0A',
      color: 'red',
    })
  })

  it('strips at-rules that cannot map to React inline styles', () => {
    expect(
      parseStyleCssText(
        'font-size: 96px; --text-color: #DD3A0A; @media screen { z-index: 1; color: var(--text-color) }',
      ),
    ).toEqual({
      fontSize: '96px',
      '--text-color': '#DD3A0A',
    })
  })
})
