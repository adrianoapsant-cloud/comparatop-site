'use client';

import { useCallback, useRef } from 'react';

type HapticPattern = 'tap' | 'impact';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
    tap: 10,      // Light interaction (tabs, toggles)
    impact: 40,   // Strong interaction (CTA buttons)
};

/**
 * Custom hook for haptic feedback using Navigator.vibrate API.
 * Only triggers if user has interacted with the page (respects browser policies).
 * 
 * @returns Object with trigger function for different haptic patterns
 * 
 * @example
 * const haptic = useHaptic();
 * <button onPointerDown={() => haptic.trigger('impact')}>Buy Now</button>
 */
export function useHaptic() {
    const hasInteracted = useRef(false);

    // Track user interaction
    if (typeof window !== 'undefined' && !hasInteracted.current) {
        const markInteracted = () => {
            hasInteracted.current = true;
            // Clean up after first interaction
            window.removeEventListener('pointerdown', markInteracted);
            window.removeEventListener('touchstart', markInteracted);
        };

        window.addEventListener('pointerdown', markInteracted, { once: true, passive: true });
        window.addEventListener('touchstart', markInteracted, { once: true, passive: true });
    }

    const trigger = useCallback((pattern: HapticPattern = 'tap') => {
        // Only vibrate if:
        // 1. User has interacted with the page
        // 2. Navigator.vibrate is supported
        // 3. We're in the browser
        if (
            typeof window !== 'undefined' &&
            hasInteracted.current &&
            'vibrate' in navigator
        ) {
            try {
                navigator.vibrate(HAPTIC_PATTERNS[pattern]);
            } catch {
                // Silently fail if vibration is blocked
            }
        }
    }, []);

    const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

    return {
        trigger,
        isSupported,
    };
}
