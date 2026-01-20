'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ============================================
// REVIEW CONTEXT - Centralized Score System
// ============================================
// Provides cached AI reviews to all components
// Falls back to static data when AI review not available

interface ReviewScores {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
    c6: number;
    c7: number;
    c8: number;
    c9: number;
    c10: number;
}

interface ReviewComputed {
    qs: number;
    vs: number;
    gs: number;
    overall: number;
}

interface ReviewData {
    scores: ReviewScores;
    computed: ReviewComputed;
    verdict?: {
        headline: string;
        summary: string;
    };
    pros?: string[];
    cons?: string[];
    idealFor?: string[];
    avoidIf?: string[];
    scoreReasons?: Record<string, string>;
    sources?: string[];
}

interface CachedReview {
    data: ReviewData;
    timestamp: number;
    source: 'ai' | 'static';
}

interface ReviewContextType {
    // Get cached review (or null if not loaded)
    getReview: (productId: string) => CachedReview | null;

    // Fetch review (returns cached if available, otherwise fetches)
    fetchReview: (productId: string, force?: boolean) => Promise<CachedReview | null>;

    // Set review from static data
    setStaticReview: (productId: string, data: Partial<ReviewData>) => void;

    // Check if review is loading
    isLoading: (productId: string) => boolean;

    // Batch fetch for lists
    prefetchReviews: (productIds: string[]) => void;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [cache, setCache] = useState<Map<string, CachedReview>>(new Map());
    const [loading, setLoading] = useState<Set<string>>(new Set());

    const getReview = useCallback((productId: string): CachedReview | null => {
        const cached = cache.get(productId);
        if (!cached) return null;

        // Check if expired
        if (Date.now() - cached.timestamp > CACHE_TTL) {
            return null;
        }

        return cached;
    }, [cache]);

    const fetchReview = useCallback(async (
        productId: string,
        force = false
    ): Promise<CachedReview | null> => {
        // Return cached if valid and not forced
        const cached = getReview(productId);
        if (cached && !force) {
            return cached;
        }

        // Already loading
        if (loading.has(productId) && !force) {
            return null;
        }

        // Start loading
        setLoading(prev => new Set(prev).add(productId));

        try {
            const response = await fetch(`/api/reviews/${productId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch review');
            }

            const data = await response.json();

            if (data.review) {
                const review: CachedReview = {
                    data: data.review,
                    timestamp: Date.now(),
                    source: 'ai',
                };

                setCache(prev => {
                    const next = new Map(prev);
                    next.set(productId, review);
                    return next;
                });

                return review;
            }

            return null;
        } catch (error) {
            console.error(`[ReviewContext] Failed to fetch review for ${productId}:`, error);
            return null;
        } finally {
            setLoading(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    }, [getReview, loading]);

    const setStaticReview = useCallback((productId: string, data: Partial<ReviewData>) => {
        // Only set if no AI review exists
        if (cache.has(productId)) {
            const existing = cache.get(productId)!;
            if (existing.source === 'ai') {
                return; // Don't overwrite AI with static
            }
        }

        const review: CachedReview = {
            data: {
                scores: data.scores || { c1: 7, c2: 7, c3: 7, c4: 7, c5: 7, c6: 7, c7: 7, c8: 7, c9: 7, c10: 7 },
                computed: data.computed || { qs: 7, vs: 7, gs: 7, overall: 7 },
                ...data,
            },
            timestamp: Date.now(),
            source: 'static',
        };

        setCache(prev => {
            const next = new Map(prev);
            next.set(productId, review);
            return next;
        });
    }, [cache]);

    const isLoading = useCallback((productId: string): boolean => {
        return loading.has(productId);
    }, [loading]);

    const prefetchReviews = useCallback((productIds: string[]) => {
        // Prefetch in background (don't await)
        productIds.forEach(id => {
            if (!cache.has(id) && !loading.has(id)) {
                fetchReview(id);
            }
        });
    }, [cache, loading, fetchReview]);

    return (
        <ReviewContext.Provider value={{
            getReview,
            fetchReview,
            setStaticReview,
            isLoading,
            prefetchReviews,
        }}>
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviewContext() {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviewContext must be used within ReviewProvider');
    }
    return context;
}

// ============================================
// CONVENIENCE HOOK - useProductScore
// ============================================
// Unified hook for getting product scores anywhere

export function useProductScore(productId: string, staticFallback?: {
    scores?: Record<string, number>;
    computed?: { qs?: number; vs?: number; gs?: number; overall?: number };
}) {
    const context = useContext(ReviewContext);

    // If no context (not wrapped in provider), return static data
    if (!context) {
        return {
            scores: staticFallback?.scores || {},
            computed: {
                qs: staticFallback?.computed?.qs || 7,
                vs: staticFallback?.computed?.vs || 7,
                gs: staticFallback?.computed?.gs || 7,
                overall: staticFallback?.computed?.overall || 7,
            },
            isLoading: false,
            source: 'static' as const,
            review: null,
        };
    }

    const cached = context.getReview(productId);
    const isLoading = context.isLoading(productId);

    // If we have AI review, use it
    if (cached?.source === 'ai') {
        return {
            scores: cached.data.scores,
            computed: cached.data.computed,
            isLoading,
            source: 'ai' as const,
            review: cached.data,
        };
    }

    // Otherwise use static fallback
    return {
        scores: staticFallback?.scores || cached?.data.scores || {},
        computed: {
            qs: staticFallback?.computed?.qs || cached?.data.computed.qs || 7,
            vs: staticFallback?.computed?.vs || cached?.data.computed.vs || 7,
            gs: staticFallback?.computed?.gs || cached?.data.computed.gs || 7,
            overall: staticFallback?.computed?.overall || cached?.data.computed.overall || 7,
        },
        isLoading,
        source: (cached?.source || 'static') as 'ai' | 'static',
        review: cached?.data || null,
    };
}
