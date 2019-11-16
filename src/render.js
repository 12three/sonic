import { TEXT_ELEMENT_TYPE } from "./createElement.js";

export function createDom(fiber) {
    const dom = fiber.type === TEXT_ELEMENT_TYPE
        ? document.createTextNode('')
        : document.createElement(fiber.type);

    //assign properties
    const isProperty = key => key !== 'children';
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(key => {
            dom[key] = fiber.props[key];
        });

    return dom
}

export function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

let nextUnitOfWork = null;

function workLoop (deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = preformUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function preformUnitOfWork (fiber) {
    // add new dom node
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom);
    }

    // create new fibers
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;

    while (index < elements.length) {
        const element = elements[index];

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        };

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }

    // return next unit of work
    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}