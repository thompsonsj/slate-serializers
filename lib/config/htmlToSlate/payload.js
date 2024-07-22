"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const default_1 = require("./default");
const domutils_1 = require("domutils");
/**
 * Configuration for Payload CMS
 *
 * Tested for v1.1.21
 */
exports.config = {
    ...default_1.config,
    elementTags: {
        ...default_1.config.elementTags,
        a: (el) => ({
            type: 'link',
            linkType: el && (0, domutils_1.getAttributeValue)(el, 'data-link-type'),
            newTab: el && (0, domutils_1.getAttributeValue)(el, 'target') === '_blank',
            url: el && (0, domutils_1.getAttributeValue)(el, 'href'),
        }),
    },
};
