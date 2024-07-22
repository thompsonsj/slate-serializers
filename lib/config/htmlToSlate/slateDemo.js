"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const default_1 = require("./default");
exports.config = {
    ...default_1.config,
    elementTags: {
        blockquote: () => ({
            type: 'block-quote',
        }),
        h1: () => ({
            type: 'heading-one',
        }),
        h2: () => ({
            type: 'heading-two',
        }),
        li: () => ({
            type: 'list-item',
        }),
        ol: () => ({
            type: 'numbered-list',
        }),
        ul: () => ({
            type: 'bulleted-list',
        }),
        p: () => ({
            type: 'paragraph',
        }),
    },
};
