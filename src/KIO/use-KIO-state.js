import { useEffect, useState } from 'react';
import { cache } from './cache';

export function useKIOState(data, id) {
    const [state, setState] = useState(
        cache.programCache.hasOwnProperty(id) ? cache.programCache[id] : data
    );

    useEffect(() => {
        cache.setStates[id] = setState;
        cache.programCache[id] = state;

        return () => {
            delete cache.setStates[id];
            delete cache.programCache[id];
        };
    }, []);

    useEffect(() => {
        if (state !== cache.programCache[id]) {
            cache.programCache[id] = state;
        }
    }, [state]);

    return [state, setState];
}
