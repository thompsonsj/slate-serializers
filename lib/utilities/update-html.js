"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameTag = void 0;
const domutils_1 = require("domutils");
const domhandler_1 = require("domhandler");
const renameTag = (tagName, replacementTagName) => ({
    [tagName]: (element) => {
        return new domhandler_1.Element(replacementTagName, element.attribs, (0, domutils_1.getChildren)(element));
    },
});
exports.renameTag = renameTag;
