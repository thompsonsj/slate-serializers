import { Element, Text } from 'domhandler';
/**
 * Generate nested mark elements
 *
 * nestedMarkElements should be recursive, but it works
 * so leaving it for now. Can handle a maximum of 5
 * elements. Really shouldn't be any more than that!
 */
export declare const nestedMarkElementsString: (els: string[], text: string) => string;
export declare const nestedMarkElements: (els: string[], element: Element | Text) => Element | Text;
/**
 * Extract css value from style attribute
 * @param el domhandler Element
 * @param attribute css attribute in camelCase
 * @returns css value or null
 */
export declare const extractCssFromStyle: (el: Element, attribute: string) => string | null;
