/**
 * Product Defaults Helper
 * 
 * Centralizes all default values and normalization for product data.
 * Apply at entry points (PDP, Comparator) to avoid scattered fallbacks.
 * 
 * Server-safe: No Date(), no side effects.
 */

import type { Product } from '@/types/category';

// ============================================
// Types
// ============================================

export interface ProductWithDefaults extends Product {
    /** Normalized updatedAt (string or '—') */
    updatedAt: string;
    /** Evidence level with default */
    evidenceLevel: 'high' | 'medium' | 'low';
}

interface RangeValue {
    min?: number | null;
    max?: number | null;
    confidence?: 'high' | 'medium' | 'low';
}

// ============================================
// Range Normalization
// ============================================

/**
 * Validates and normalizes a range object.
 * Returns null if invalid (min > max, both null, etc.)
 */
function normalizeRange(range: RangeValue | null | undefined): RangeValue | null {
    if (!range) return null;

    const { min, max, confidence } = range;

    // Both null/undefined = invalid
    if (min == null && max == null) return null;

    // min > max = invalid (warn in dev)
    if (min != null && max != null && min > max) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('[productDefaults] Invalid range: min > max', { min, max });
        }
        return null;
    }

    // Default confidence to 'medium' if range exists
    return {
        min: min ?? null,
        max: max ?? null,
        confidence: confidence ?? 'medium',
    };
}

// ============================================
// Main Helper
// ============================================

/**
 * Applies defaults and normalization to a product.
 * Does NOT mutate the original object.
 * 
 * @param product Raw product from data source
 * @returns Product with safe defaults applied
 */
export function withProductDefaults<T extends Record<string, any>>(
    product: T
): T & { updatedAt: string; evidenceLevel: 'high' | 'medium' | 'low' } {
    // Shallow copy to avoid mutation (cast to any for modification)
    const result: any = { ...product };

    // === updatedAt ===
    // If missing or invalid, use placeholder
    if (!result['updatedAt'] || typeof result['updatedAt'] !== 'string') {
        result['updatedAt'] = '—';
    }

    // === evidenceLevel ===
    // Default to 'medium' if not specified
    if (!result['evidenceLevel'] || !['high', 'medium', 'low'].includes(result['evidenceLevel'])) {
        result['evidenceLevel'] = 'medium';
    }

    // === Contextual Score Range ===
    // Access via any to handle dynamic structure
    const contextual = (result as any).contextualScore;
    if (contextual && typeof contextual === 'object') {
        const range = contextual.range;
        if (range) {
            const normalized = normalizeRange(range);
            if (normalized) {
                (result as any).contextualScore = {
                    ...contextual,
                    range: normalized,
                };
            } else {
                // Invalid range - keep value, remove range
                delete (result as any).contextualScore.range;
            }
        }
    }

    // === TCO Range ===
    const tco = (result as any).tco || (result as any).tcoTotal;
    if (tco && typeof tco === 'object') {
        const range = tco.range;
        if (range) {
            const normalized = normalizeRange(range);
            if (normalized) {
                if ((result as any).tco) {
                    (result as any).tco = { ...tco, range: normalized };
                } else {
                    (result as any).tcoTotal = { ...tco, range: normalized };
                }
            } else {
                // Invalid range - remove it
                if ((result as any).tco?.range) delete (result as any).tco.range;
                if ((result as any).tcoTotal?.range) delete (result as any).tcoTotal.range;
            }
        }
    }

    // === Confidence Notes ===
    // Ensure null if missing (not undefined)
    if ((result as any).confidenceNotes === undefined) {
        (result as any).confidenceNotes = null;
    }

    return result as T & { updatedAt: string; evidenceLevel: 'high' | 'medium' | 'low' };
}

// ============================================
// Dev-only Guardrails
// ============================================

/**
 * Logs warnings for common product data issues (dev only).
 * Does NOT throw or modify data.
 */
export function warnProductIssues(product: Record<string, any>, context: string): void {
    if (process.env.NODE_ENV !== 'development') return;

    const issues: string[] = [];

    // Missing essential fields
    if (!product.name) issues.push('Missing name');
    if (!product.slug) issues.push('Missing slug');

    // Missing score
    const score = (product as any).contextualScore?.value ?? (product as any).score;
    if (score == null) issues.push('Missing contextualScore/score');

    // Missing price
    const price = (product as any).price?.value ?? (product as any).price?.current;
    if (price == null) issues.push('Missing price');

    if (issues.length > 0) {
        console.warn(`[productDefaults] ${context}:`, issues.join(', '), { slug: (product as any).slug });
    }
}

// ============================================
// Convenience Export
// ============================================

export default withProductDefaults;
