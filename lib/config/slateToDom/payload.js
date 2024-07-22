"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const domhandler_1 = require("domhandler");
const default_1 = require("./default");
/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */
exports.config = {
    ...default_1.config,
    elementTransforms: {
        ...default_1.config.elementTransforms,
        link: ({ node, children = [] }) => {
            const attrs = {};
            if (node.linkType) {
                attrs['data-link-type'] = node.linkType;
            }
            if (node.newTab) {
                attrs.target = '_blank';
            }
            return new domhandler_1.Element('a', {
                href: node.url,
                ...attrs,
            }, children);
        },
    },
    defaultTag: 'p',
};
