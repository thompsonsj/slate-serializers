export type Context = 'preserve' | 'block' | 'inline' | '';
interface IprocessTextValue {
    text: string;
    context?: Context;
    isInlineStart?: boolean;
    isInlineEnd?: boolean;
    isNextSiblingBlock?: boolean;
}
export declare const processTextValue: ({ text, context, isInlineStart, isInlineEnd, isNextSiblingBlock, }: IprocessTextValue) => string;
export declare const minifyText: (str: string) => string;
export declare const isAllWhitespace: (str: string) => boolean;
export declare const getContext: (tagName: string) => Context;
export {};
