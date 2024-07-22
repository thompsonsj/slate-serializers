"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slateToDom = exports.slateToHtml = void 0;
const domhandler_1 = require("domhandler");
const dom_serializer_1 = require("dom-serializer");
const domutils_1 = require("domutils");
const html_entities_1 = require("html-entities");
const slate_1 = require("slate");
const default_1 = require("../../config/slateToDom/default");
const domhandler_2 = require("../../utilities/domhandler");
const utilities_1 = require("../../utilities");
const slateToHtml = (node, config = default_1.config) => {
    const document = (0, exports.slateToDom)(node, config);
    return (0, dom_serializer_1.default)(document, {
        encodeEntities: 'encodeEntities' in config ? config.encodeEntities : false,
    });
};
exports.slateToHtml = slateToHtml;
const slateToDom = (node, config = default_1.config) => {
    if (!Array.isArray(node)) {
        return new domhandler_1.Document([]);
    }
    const document = node.map((n, index) => slateNodeToHtml(n, config, index === node.length - 1));
    return document;
};
exports.slateToDom = slateToDom;
const slateNodeToHtml = (node, config = default_1.config, isLastNodeInDocument = false) => {
    if (slate_1.Text.isText(node)) {
        const str = node.text;
        // convert line breaks to br tags
        const strLines = config.convertLineBreakToBr ? str.split('\n') : [str];
        const textChildren = [];
        strLines.forEach((line, index) => {
            const markElements = [];
            Object.keys(config.markMap).forEach((key) => {
                if (node[key]) {
                    markElements.push(...config.markMap[key]);
                }
            });
            // clone markElements (it gets modified)
            const markElementsClone = [...markElements];
            const textElement = (0, domhandler_2.nestedMarkElements)(markElements, new domhandler_1.Text(line));
            if (config.alwaysEncodeCodeEntities &&
                config.encodeEntities === false &&
                (0, domhandler_1.isTag)(textElement) &&
                (0, domutils_1.getName)(textElement) === 'pre') {
                textChildren.push((0, domhandler_2.nestedMarkElements)(markElementsClone, new domhandler_1.Text((0, html_entities_1.encode)(line))));
            }
            else {
                textChildren.push(textElement);
            }
            if (index < strLines.length - 1) {
                textChildren.push(new domhandler_1.Element('br', {}));
            }
        });
        return new domhandler_1.Document(textChildren);
    }
    const children = node.children ? node.children.map((n) => slateNodeToHtml(n, config)) : [];
    let attribs = {};
    const styleAttrs = {};
    const style = (0, utilities_1.getNested)(config, 'elementStyleMap');
    if (style) {
        Object.keys(style).forEach((slateKey) => {
            const cssProperty = style[slateKey];
            const cssValue = node[slateKey];
            if (cssValue) {
                styleAttrs[cssProperty] = cssValue;
            }
        });
        if (!(0, utilities_1.isEmptyObject)(styleAttrs)) {
            attribs = {
                ...attribs,
                style: (0, utilities_1.styleToString)(styleAttrs),
            };
        }
    }
    let element = null;
    // more complex transforms
    if (config.elementTransforms[node.type]) {
        element = config.elementTransforms[node.type]({ node, attribs, children });
    }
    // straightforward node to element
    if (!element && config.elementMap[node.type]) {
        element = new domhandler_1.Element(config.elementMap[node.type], attribs, children);
    }
    // default tag
    if (!element && config.defaultTag && !node.type) {
        element = new domhandler_1.Element(config.defaultTag, {}, children);
    }
    if (element) {
        return element;
    }
    // add line break between inline nodes
    if (config.convertLineBreakToBr && !isLastNodeInDocument) {
        children.push(new domhandler_1.Element('br', {}));
    }
    return new domhandler_1.Document(children);
};
