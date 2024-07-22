"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBreakingEntities = exports.getNested = exports.removeEmpty = exports.isEmptyObject = exports.styleToString = exports.parseStyleCssText = exports.prependSpace = exports.hasLineBreak = void 0;
const hasLineBreak = (str) => str.match(/[\r\n]+/) !== null;
exports.hasLineBreak = hasLineBreak;
const prependSpace = (str) => str && ` ${str.trim()}`;
exports.prependSpace = prependSpace;
const camelize = (str) => {
    return str.replace(/(?:^|[-])(\w)/g, (a, c) => {
        c = a.substring(0, 1) === '-' ? c.toUpperCase() : c;
        return c ? c : '';
    });
};
const parseStyleCssText = (value) => {
    const output = {};
    if (!value) {
        return output;
    }
    const style = value.split(';');
    for (const s of style) {
        const rule = s.trim();
        if (rule) {
            const ruleParts = rule.split(':');
            const key = camelize(ruleParts[0].trim());
            output[key] = ruleParts[1].trim();
        }
    }
    return output;
};
exports.parseStyleCssText = parseStyleCssText;
const styleToString = (style) => {
    return Object.keys(style).reduce((acc, key) => acc +
        key
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase() +
        ':' +
        style[key] +
        ';', '');
};
exports.styleToString = styleToString;
const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
exports.isEmptyObject = isEmptyObject;
const removeEmpty = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};
exports.removeEmpty = removeEmpty;
/**
 *
 * @param obj an object of any dimension
 * @param args property list to check
 * @returns undefined or property value
 */
const getNested = (obj, ...args) => {
    return args.reduce((o, level) => o && o[level], obj);
};
exports.getNested = getNested;
const encodeBreakingEntities = (str) => {
    const swapChar = (charToSwap) => {
        // that swaps characters to HTML entities
        switch (charToSwap) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            default:
                return charToSwap;
        }
    };
    str = str.replace(/[&<>]/g, (match) => {
        return swapChar(match);
    });
    return str;
};
exports.encodeBreakingEntities = encodeBreakingEntities;
