export const hasLineBreak = (str: string) => str.match(/[\r\n]+/) !== null

export const prependSpace = (str: string) => str && ` ${str.trim()}`

export const isEmptyObject = (obj: any) =>
  obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype

export const removeEmpty = (obj: {}): {} => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

/**
 *
 * @param obj an object of any dimension
 * @param args property list to check
 * @returns undefined or property value
 */
export const getNested = (obj: any, ...args: string[]) => {
  return args.reduce((o, level) => o && o[level], obj)
}
