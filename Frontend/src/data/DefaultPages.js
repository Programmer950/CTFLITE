import { v4 as uuidv4 } from 'uuid';

// Start with a single blank page — user builds from scratch
export const defaultPages = [
    {
        id: uuidv4(),
        name: 'Page 1',
        background: { type: 'solid', value: '#050508' },
        elements: [],
    },
];
