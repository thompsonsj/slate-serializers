"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCssFromStyle = exports.nestedMarkElements = exports.nestedMarkElementsString = void 0;
const domutils_1 = require("domutils");
const domhandler_1 = require("domhandler");
const dom_serializer_1 = require("dom-serializer");
const _1 = require(".");
/**
 * Generate nested mark elements
 *
 * nestedMarkElements should be recursive, but it works
 * so leaving it for now. Can handle a maximum of 5
 * elements. Really shouldn't be any more than that!
 */
const nestedMarkElementsString = (els, text) => {
    return (0, dom_serializer_1.default)((0, exports.nestedMarkElements)(els, new domhandler_1.Text(text)));
};
exports.nestedMarkElementsString = nestedMarkElementsString;
const nestedMarkElements = (els, element) => {
    if (els.length === 0) {
        return element;
    }
    const el1 = els.pop();
    element = new domhandler_1.Element(el1, {}, [element]);
    if (!els || els.length === 0) {
        return element;
    }
    const el2 = els.pop();
    element = new domhandler_1.Element(el2, {}, [element]);
    if (!els || els.length === 0) {
        return element;
    }
    const el3 = els.pop();
    element = new domhandler_1.Element(el3, {}, [element]);
    if (!els || els.length === 0) {
        return element;
    }
    const el4 = els.pop();
    element = new domhandler_1.Element(el4, {}, [element]);
    if (!els || els.length === 0) {
        return element;
    }
    const el5 = els.pop();
    element = new domhandler_1.Element(el5, {}, [element]);
    if (!els || els.length === 0) {
        return element;
    }
    return element;
};
exports.nestedMarkElements = nestedMarkElements;
/**
 * Extract css value from style attribute
 * @param el domhandler Element
 * @param attribute css attribute in camelCase
 * @returns css value or null
 */
const extractCssFromStyle = (el, attribute) => {
    const cssText = el && (0, domutils_1.getAttributeValue)(el, 'style');
    if (cssText) {
        const css = (0, _1.parseStyleCssText)(cssText);
        if (css[attribute]) {
            return css[attribute];
        }
    }
    return null;
};
exports.extractCssFromStyle = extractCssFromStyle;
