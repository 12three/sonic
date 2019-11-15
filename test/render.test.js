import { render } from '../src/render';
import { createElement } from "../src";

describe('render', () => {
    it('should mount elements to the passed element', () => {
        const container = document.createElement('div');
        render(createElement('span', null, 'Hello'), container);

        const expectedNode = document.createElement('div');
        expectedNode.insertAdjacentHTML('afterbegin', '<span>Hello</span>');

        expect(container.isEqualNode(expectedNode)).toBeTruthy();
    });
});