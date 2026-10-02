import {
  codeSpan,
  escapeText,
  formatUrl,
  payloadSlateToMarkdownConfig,
  slateToMarkdown,
  slateToMarkdownConfig,
} from '../../index'

describe('package exports', () => {
  it('exposes slateToMarkdown and the default configs', () => {
    expect(slateToMarkdown([{ type: 'p', children: [{ text: 'a' }] }], slateToMarkdownConfig)).toBe('a')
    expect(payloadSlateToMarkdownConfig.elementTransforms?.['upload']).toBeDefined()
    expect(escapeText('*')).toBe('\\*')
    expect(formatUrl('https://x.com')).toBe('https://x.com')
    expect(codeSpan('a')).toBe('`a`')
  })
})
