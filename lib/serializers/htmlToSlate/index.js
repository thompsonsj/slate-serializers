"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToSlate = void 0;
const slate_hyperscript_1 = require("slate-hyperscript");
const htmlparser2_1 = require("htmlparser2");
const domhandler_1 = require("domhandler");
const domutils_1 = require("domutils");
const css_select_1 = require("css-select");
const default_1 = require("../../config/htmlToSlate/default");
const domhandler_2 = require("../../utilities/domhandler");
const utilities_1 = require("../../utilities");
const blocks_1 = require("../blocks");
const whitespace_1 = require("./whitespace");
const deserialize = ({ el, config = default_1.config, index = 0, childrenLength = 0, context = '', }) => {
    var _a, _b;
    if (el.type !== htmlparser2_1.ElementType.Tag && el.type !== htmlparser2_1.ElementType.Text) {
        return null;
    }
    const currentEl = el;
    const nodeName = (0, domutils_1.getName)(currentEl);
    const childrenContext = (0, whitespace_1.getContext)(nodeName) || context;
    const isLastChild = index === childrenLength - 1;
    const isWithinTextNodes = ((_a = currentEl.prev) === null || _a === void 0 ? void 0 : _a.type) === htmlparser2_1.ElementType.Text && ((_b = currentEl.next) === null || _b === void 0 ? void 0 : _b.type) === htmlparser2_1.ElementType.Text;
    if (nodeName === 'br' && config.convertBrToLineBreak && context !== 'preserve') {
        return [(0, slate_hyperscript_1.jsx)('text', { text: context ? '\n' : '' }, [])];
    }
    const children = currentEl.childNodes
        ? currentEl.childNodes
            .map((node, i) => deserialize({
            el: node,
            config,
            index: i,
            childrenLength: currentEl.childNodes.length,
            context: childrenContext,
        }))
            .filter((element) => element)
            .filter((element) => !isSlateDeadEnd(element))
            .map((element) => addTextNodeToEmptyChildren(element))
            .flat()
        : [];
    if ((0, domutils_1.getName)(currentEl) === 'body') {
        return (0, slate_hyperscript_1.jsx)('fragment', {}, children);
    }
    if (config.elementTags[nodeName]) {
        const attrs = config.elementTags[nodeName](currentEl);
        // elementAttributeMap is a convenient config for making changes to all elements
        const style = (0, utilities_1.getNested)(config, 'elementStyleMap');
        if (style) {
            Object.keys(style).forEach((slateKey) => {
                const cssProperty = style[slateKey];
                const cssValue = (0, domhandler_2.extractCssFromStyle)(currentEl, cssProperty);
                if (cssValue) {
                    attrs[slateKey] = cssValue;
                }
            });
        }
        return (0, slate_hyperscript_1.jsx)('element', attrs, children);
    }
    if (config.textTags[nodeName] || el.type === htmlparser2_1.ElementType.Text) {
        const attrs = gatherTextMarkAttributes({ el: currentEl });
        const text = (0, whitespace_1.processTextValue)({
            text: (0, domutils_1.textContent)(el),
            context: childrenContext,
            isInlineStart: index === 0,
            isInlineEnd: Number.isInteger(childrenLength) && isLastChild,
            isNextSiblingBlock: (el.next && (0, domhandler_1.isTag)(el.next) && (0, blocks_1.isBlock)(el.next.tagName)) || false,
        });
        if (text === '') {
            return null;
        }
        if ((0, whitespace_1.isAllWhitespace)(text)) {
            if (config.filterWhitespaceNodes && !childrenContext) {
                return null;
            }
            if (config.convertBrToLineBreak) {
                if (currentEl.prev && (0, domutils_1.getName)(currentEl.prev) === 'br') {
                    return null;
                }
                if (currentEl.next && (0, domutils_1.getName)(currentEl.next) === 'br') {
                    return null;
                }
            }
        }
        return [(0, slate_hyperscript_1.jsx)('text', { ...attrs, text }, [])];
    }
    return children;
};
const gatherTextMarkAttributes = ({ el, config = default_1.config }) => {
    let allAttrs = {};
    const children = (0, domutils_1.getChildren)(el);
    if (children.length) {
        ;
        [el, ...children.flat()].forEach((child) => {
            const name = (0, domutils_1.getName)(child);
            const attrs = config.textTags[name] ? config.textTags[name](child) : {};
            allAttrs = {
                ...allAttrs,
                ...attrs,
            };
        });
        if (children.length === 1 && (0, domutils_1.getChildren)(children[0]).length) {
            allAttrs = {
                ...allAttrs,
                ...gatherTextMarkAttributes({ el: children[0], config }),
            };
        }
    }
    else {
        const name = (0, domutils_1.getName)(el);
        const attrs = config.textTags[name] ? config.textTags[name](el) : {};
        allAttrs = {
            ...attrs,
        };
    }
    return allAttrs;
};
const htmlToSlate = (html, config = default_1.config) => {
    let slateContent = [];
    const handler = new domhandler_1.DomHandler((error, dom) => {
        if (error) {
            // Handle error
        }
        else {
            const updaters = config.htmlUpdaterMap ? Object.entries(config.htmlUpdaterMap) : [];
            for (const [selector, updater] of updaters) {
                (0, css_select_1.selectAll)(selector, dom).forEach((element) => {
                    if ((0, domhandler_1.isTag)(element)) {
                        const updated = updater(element);
                        if (updated !== null && updated !== element) {
                            if (typeof updated === 'string') {
                                (0, domutils_1.replaceElement)(element, (0, htmlparser2_1.parseDocument)(updated));
                            }
                            else {
                                (0, domutils_1.replaceElement)(element, updated);
                            }
                        }
                    }
                });
            }
            slateContent = dom
                .map((node) => deserialize({ el: node, config })) // run the deserializer
                .filter((element) => element) // filter out null elements
                .map((element) => {
                // ensure all top level elements have a children property
                if (!element.children) {
                    return {
                        children: element,
                    };
                }
                return element;
            })
                .filter((element) => !isSlateDeadEnd(element))
                .map((element) => addTextNodeToEmptyChildren(element));
        }
    });
    const parser = new htmlparser2_1.Parser(handler, { decodeEntities: true });
    let updatedHtml = html;
    if (config.htmlPreProcessString instanceof Function) {
        updatedHtml = config.htmlPreProcessString(html);
    }
    parser.write(updatedHtml);
    parser.end();
    return slateContent;
};
exports.htmlToSlate = htmlToSlate;
const isSlateDeadEnd = (element) => {
    const keys = Object.keys(element);
    if (!('children' in element))
        return false;
    return element.children.length === 0 && keys.length === 1;
};
const addTextNodeToEmptyChildren = (element) => {
    const keys = Object.keys(element);
    if (!('children' in element))
        return element;
    if (element.children.length === 0) {
        element.children.push({ text: '' });
    }
    return element;
};
