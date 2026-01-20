'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollState {
    /** Current scroll direction */
    direction: 'up' | 'down' | 'idle';
    /** Scroll depth as percentage (0-100) */
    depth: number;
    /** Absolute scroll position in pixels */
    scrollY: number;
    /** True if at top of page */
    isAtTop: boolean;
    /** True if at bottom of page */
    isAtBottom: boolean;
    /** True if scrolled past threshold */
    isPastThreshold: boolean;
}

interface UseScrollDirectionOptions {
    /** Minimum scroll delta to trigger direction change (default: 10) */
    threshold?: number;
    /** Scroll depth threshold in pixels to show footer (default: 300) */
    showThreshold?: number;
}

/**
 * Hook to detect scroll direction, depth, and position.
 * Used by SmartStickyFooter for state transitions.
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
    const { threshold = 10, showThreshold = 300 } = options;

    const [scrollState, setScrollState] = useState<ScrollState>({
        direction: 'idle',
        depth: 0,
        scrollY: 0,
        isAtTop: true,
        isAtBottom: false,
        isPastThreshold: false,
    });

    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    const updateScrollState = useCallback(() => {
        const currentScrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = documentHeight - windowHeight;

        // Calculate direction
        const delta = currentScrollY - lastScrollY.current;
        let direction: 'up' | 'down' | 'idle' = 'idle';

        if (Math.abs(delta) > threshold) {
            direction = delta > 0 ? 'down' : 'up';
        }

        // Calculate depth percentage
        const depth = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;

        setScrollState({
            direction,
            depth,
            scrollY: currentScrollY,
            isAtTop: currentScrollY < 50,
            isAtBottom: currentScrollY >= maxScroll - 50,
            isPastThreshold: currentScrollY > showThreshold,
        });

        lastScrollY.current = currentScrollY;
        ticking.current = false;
    }, [threshold, showThreshold]);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(updateScrollState);
                ticking.current = true;
            }
        };

        // Initial state
        updateScrollState();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [updateScrollState]);

    return scrollState;
}
