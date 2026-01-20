'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseScrollVisibilityOptions {
    /** Element ID to observe for intersection */
    targetId?: string;
    /** Threshold for intersection (0-1) */
    threshold?: number;
    /** Initial visibility state */
    initialVisible?: boolean;
}

/**
 * Hook to control visibility based on scroll position.
 * Shows element after scrolling past a target element.
 * 
 * @example
 * const isVisible = useScrollVisibility({ targetId: 'product-card' });
 */
export function useScrollVisibility({
    targetId,
    threshold = 0.1,
    initialVisible = false,
}: UseScrollVisibilityOptions = {}) {
    const [isVisible, setIsVisible] = useState(initialVisible);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // If no target ID, use scroll position fallback
        if (!targetId) {
            const handleScroll = () => {
                // Show after scrolling 300px
                setIsVisible(window.scrollY > 300);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Check initial position

            return () => window.removeEventListener('scroll', handleScroll);
        }

        // Use IntersectionObserver for target element
        const target = document.getElementById(targetId);
        if (!target) {
            console.warn(`useScrollVisibility: Element with id "${targetId}" not found`);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Show footer when target is NOT in view (scrolled past it)
                    setIsVisible(!entry.isIntersecting);
                });
            },
            {
                threshold,
                rootMargin: '-100px 0px 0px 0px', // Trigger slightly before leaving viewport
            }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [targetId, threshold]);

    return isVisible;
}
