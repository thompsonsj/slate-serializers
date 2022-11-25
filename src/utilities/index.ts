export const hasLineBreak = (str: string) => str.match(/[\r\n]+/) !== null

export const prependSpace = (str: string) => str && ` ${str.trim()}`
