export declare const hasLineBreak: (str: string) => boolean;
export declare const prependSpace: (str: string) => string;
export declare const parseStyleCssText: (value: string) => {
    [key: string]: string;
};
export declare const styleToString: (style: {
    [key: string]: string;
}) => string;
export declare const isEmptyObject: (obj: any) => any;
export declare const removeEmpty: (obj: {}) => {};
/**
 *
 * @param obj an object of any dimension
 * @param args property list to check
 * @returns undefined or property value
 */
export declare const getNested: (obj: any, ...args: string[]) => any;
export declare const encodeBreakingEntities: (str: string) => string;
