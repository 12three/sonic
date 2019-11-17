import {EFFECT_TAGS} from "./constants.js";
import {createDom} from "./createDom.js";
import {updateDomNode} from "./updateDomNode.js";

let currentRoot = null;
let wipRoot = null;
let deletions = null;

/*
    Receive data for rendering and attach old fiber tree
 */
export function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: currentRoot,
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
}

/*
    It's the heart of our library. Unblocking infinity loop that handle on unit of work in one iteration.
    In our case one unit it's fiber
 */
let nextUnitOfWork = null;

function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = preformUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

    if(!nextUnitOfWork && wipRoot) {
        // trigger dom rendering
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function preformUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);

    // seeking the next unit of work
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


function reconcileChildren(wipFiber, elements) {
    // reconciliation describe diff between ()
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling = null;

    while (index < elements.length || oldFiber != null) {
        const element = elements[index];
        let newFiber = null;

        // compare old fiber to element
        const sameType = oldFiber && element && element.type === oldFiber.type;

        if (sameType) {
            // update the node
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: EFFECT_TAGS.UPDATE,
            }
        }
        if (element && !sameType) {
            // add the node
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: EFFECT_TAGS.PLACEMENT,
            }
        }
        if (oldFiber && !sameType) {
            // delete the oldFiber's node
            oldFiber.effectTag = EFFECT_TAGS.DELETION;
            deletions.push(oldFiber);
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}

/*
    Mount tree o the dom or updating old nodes
 */
function commitRoot() {
    deletions.forEach(commitWork);
    // add nodes to the dom
    commitWork(wipRoot.child);

    currentRoot = wipRoot;
    wipRoot = null;
}

function commitWork(fiber) {
    if (!fiber) {
        return
    }
    const domParent = fiber.parent.dom;

    if (
        fiber.effectTag === EFFECT_TAGS.PLACEMENT
        && fiber.dom != null
    ) {
        domParent.appendChild(fiber.dom);
    } else if (
        fiber.effectTag === EFFECT_TAGS.UPDATE
        && fiber.dom != null
    ) {
        updateDomNode(
            fiber.dom,
            fiber.alternate.props,
            fiber.props,
        )
    } else if (
        fiber.effectTag === EFFECT_TAGS.DELETION
    ) {
        domParent.removeChild(fiber.dom)
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}




