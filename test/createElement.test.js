import { createElement } from '../src/createElement'

describe('createElement', () => {
    it('adds 1 + 2 to equal 3', () => {
        expect(createElement()).toBe(3);
    });
});