import { createElement, TEXT_ELEMENT_TYPE } from '../src/createElement'

describe('createElement', () => {
    it('should return recursively ', () => {
        const element = createElement(
            'div',
            { className: 'wrapper' },
            createElement('h1', null, 'title'),
            createElement('p', null, 'description')
        );

        expect(element).toEqual({
            type: 'div',
            props: {
                className: 'wrapper',
                children: [
                    {
                        type: 'h1',
                        props: {
                            children: [
                                {
                                    type: TEXT_ELEMENT_TYPE,
                                    props: {
                                        nodeValue: 'title',
                                        children: [],
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'p',
                        props: {
                            children: [
                                {
                                    type: TEXT_ELEMENT_TYPE,
                                    props: {
                                        nodeValue: 'description',
                                        children: [],
                                    }
                                }
                            ]
                        }
                    },
                ],
            }
        });
    });
});