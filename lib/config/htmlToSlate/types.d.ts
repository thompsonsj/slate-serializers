import { Element } from 'domhandler';
interface ItagMap {
    [key: string]: (a?: Element) => object;
}
/**
 * For details on configuration options:
 * @see /docs/config/htmlToSlate.md
 */
export interface Config {
    elementAttributeMap?: {
        style?: {
            [key: string]: string;
        };
    };
    elementStyleMap?: {
        [key: string]: string;
    };
    elementTags: ItagMap;
    textTags: ItagMap;
    htmlPreProcessString?: (html: string) => string;
    htmlUpdaterMap?: HtmlUpdaterFunctionMap;
    filterWhitespaceNodes: boolean;
    convertBrToLineBreak?: boolean;
}
type UpdaterFunction = (el: Element) => Element | string;
export type HtmlUpdaterFunctionMap = Record<string, UpdaterFunction>;
export {};
