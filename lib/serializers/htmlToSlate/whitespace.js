"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = exports.isAllWhitespace = exports.minifyText = exports.processTextValue = void 0;
const blocks_1 = require("../blocks");
const processTextValue = ({ text, context = '', isInlineStart = false, isInlineEnd = false, isNextSiblingBlock = false, }) => {
    let parsed = text;
    if (context === 'preserve') {
        return parsed;
    }
    parsed = (0, exports.minifyText)(parsed);
    if (context === 'block') {
        // is this the start of inline content after a block element?
        if (isInlineStart) {
            parsed = parsed.trimStart();
        }
        // is this the end of inline content in a block element?
        if (isInlineEnd || isNextSiblingBlock) {
            parsed = parsed.trimEnd();
        }
    }
    return parsed;
};
exports.processTextValue = processTextValue;
const minifyText = (str) => {
    return reduceToSingleSpaces(replaceNewlines(str));
};
exports.minifyText = minifyText;
const replaceNewlines = (str) => {
    return str.replace(/(?:\r\n|\r|\n)/g, ' ');
};
const reduceToSingleSpaces = (str) => {
    return str.replace(/ +(?= )/g, '');
};
const isAllWhitespace = (str) => {
    return !/[^\t\n\r ]/.test(str);
};
exports.isAllWhitespace = isAllWhitespace;
const getContext = (tagName) => {
    if (!tagName || tagName.trim() === '') {
        return '';
    }
    if (preserveWhitespace(tagName)) {
        return 'preserve';
    }
    if ((0, blocks_1.isBlock)(tagName)) {
        return 'block';
    }
    return 'inline';
};
exports.getContext = getContext;
const preserveWhitespace = (tagName) => {
    return ['code', 'pre', 'xmp'].includes(tagName);
};
