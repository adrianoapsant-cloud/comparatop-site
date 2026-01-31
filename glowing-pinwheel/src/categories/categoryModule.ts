/**
 * Category Module Interface
 * Common interface for all category scoring modules
 */
import type { ZodSchema } from 'zod';

/**
 * QA configuration for category-specific assertions
 */
export interface CategoryQAConfig<TSpecs, TTags, TScores> {
    /** Additional category-specific assertions run during QA */
    extraAssertions?: (items: Array<{ id: string; specs: TSpecs; tags: TTags; scores: TScores }>) => void;
}

/**
 * Derived data returned by getDerived function
 */
export interface DerivedData<TSpecs, TTags, TScores> {
    specs: TSpecs;
    tags: TTags;
    scores: TScores;
    /** True if using fallback/inferred specs (not migrated) */
    isFallback?: boolean;
    /** Debug info about fallback (missing fields, etc) */
    fallbackInfo?: unknown;
}

/**
 * Generic interface for category modules
 * Each category implements this with its own specs type
 */
export interface CategoryModule<
    TSpecs,
    TTags,
    TScores
> {
    /** Category identifier (slug) */
    categoryId: string;

    /** Zod schema for validating specs */
    specSchema: ZodSchema<TSpecs>;

    /** Derives boolean tags from specs */
    deriveTags: (specs: TSpecs) => TTags;

    /** Computes scores from specs with optional overrides */
    computeScores: (specs: TSpecs, overrides?: Partial<TScores>) => TScores;

    /**
     * Optional: Get derived data from a product
     * Used by compat layer for products without structured specs
     * If isFallback is true, STRICT_SPECS mode will throw
     */
    getDerived?: (product: unknown) => DerivedData<TSpecs, TTags, TScores>;

    /**
     * Optional: Category-specific QA configuration
     */
    qa?: CategoryQAConfig<TSpecs, TTags, TScores>;
}

// Re-export for convenience
export type { ZodSchema };
