export function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === "object"
                    ? child
                    : createTextElement(child);
            }),
        }
    }
}

export const TEXT_ELEMENT_TYPE = 'TEXT_ELEMENT';

function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        }
    }
}