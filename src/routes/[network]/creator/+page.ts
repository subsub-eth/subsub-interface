import type { EntryGenerator } from './$types';

export const entries = (() => {
    return [
        { network: 'localhost' },
        { network: 'polygon' }
    ];
}) satisfies EntryGenerator;

export const prerender = true;
