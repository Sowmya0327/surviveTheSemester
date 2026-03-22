// hooks/useHover.ts
import { useState, useCallback, useRef } from 'react';

// Using a generic <T> so you can use this on any HTML element, defaulting to HTMLDivElement
export function useHover<T extends HTMLElement = HTMLDivElement>(): [(node: T | null) => void, boolean] {
    const [value, setValue] = useState(false);

    const handleMouseOver = useCallback(() => setValue(true), []);
    const handleMouseOut = useCallback(() => setValue(false), []);

    // Keep track of the node to cleanup event listeners
    const ref = useRef<T | null>(null);

    const callbackRef = useCallback(
        (node: T | null) => {
            // Clean up old listeners if the node changes
            if (ref.current) {
                ref.current.removeEventListener('mouseenter', handleMouseOver);
                ref.current.removeEventListener('mouseleave', handleMouseOut);
            }

            ref.current = node;

            // Attach new listeners
            if (ref.current) {
                ref.current.addEventListener('mouseenter', handleMouseOver);
                ref.current.addEventListener('mouseleave', handleMouseOut);
            }
        },
        [handleMouseOver, handleMouseOut]
    );

    // Explicitly type the return as a tuple so TS doesn't infer a union array
    return [callbackRef, value];
}