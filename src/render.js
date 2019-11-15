import { TEXT_ELEMENT_TYPE } from "./createElement.js";

export function render(element, container) {
    const dom = element.type === TEXT_ELEMENT_TYPE
        ? document.createTextNode('')
        : document.createElement(element.type);

    //assign properties
    const isProperty = key => key !== 'children';
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(key => {
            dom[key] = element.props[key];
        });

    element.props.children.forEach(child => render(child, dom));

    container.appendChild(dom);
}