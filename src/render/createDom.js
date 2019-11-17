import {TEXT_ELEMENT_TYPE} from "../createElement.js";
import {updateDomNode} from "./updateDomNode.js";

export function createDom(fiber) {
    const dom = fiber.type === TEXT_ELEMENT_TYPE
        ? document.createTextNode('')
        : document.createElement(fiber.type);

    updateDomNode(dom, {}, fiber.props);

    return dom
}