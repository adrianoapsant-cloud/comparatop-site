/**
 * @file hmum-adapter.ts
 * @description Adapter Layer: Translates Legacy Products to HMUM Format
 * 
 * This module bridges the gap between:
 * - Legacy `Product` type (from @/types/category)
 * - HMUM engine expectations (CategoryHMUMConfig format)
 * 
 * Key responsibilities:
 * 1. Extract values from nested product structure
 * 2. Apply default values for missing specs
 * 3. Map editorial scores to virtual attributes
 * 4. Handle type conversions and normalization quirks
 * 
 * @version 2.0.0 (HMUM Architecture)
 */

import type { Product, ScoredProduct } from '@/types/category';
import type {
    CategoryHMUMConfig,
    AttributeDefinition,
    UserContext,
    EvaluationResult,
} from './hmum-types';
import { evaluateProductContext } from './hmum-engine';

// ============================================
// TYPES
// ============================================

/**
 * Extended product with specs for HMUM evaluation.
 */
export interface HMUMProduct {
    id: string;
    name: string;
    price: number;
    specs: Record<string, unknown>;
    computed?: {
        overall: number;
        qs?: number;
        vs?: number;
        gs?: number;
    };
    [key: string]: unknown;
}

/**
 * Default values configuration for missing specs.
 */
export interface DefaultsConfig {
    [specPath: string]: unknown;
}

// ============================================
// VALUE EXTRACTION WITH DEFAULTS
// ============================================

/**
 * Safely extracts a value from an object using dot notation path.
 * Returns defaultValue if path doesn't exist or value is undefined.
 */
function extractWithDefault(
    obj: Record<string, unknown>,
    path: string,
    defaultValue: unknown
): unknown {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
        if (current === null || current === undefined) {
            return defaultValue;
        }
        if (typeof current !== 'object') {
            return defaultValue;
        }
        current = (current as Record<string, unknown>)[part];
    }

    return current ?? defaultValue;
}

/**
 * Gets the default value for an attribute from config.
 */
function getAttributeDefault(attribute: AttributeDefinition): unknown {
    // Check if attribute has explicit defaultValue
    const attrWithDefault = attribute as AttributeDefinition & { defaultValue?: unknown };
    if (attrWithDefault.defaultValue !== undefined) {
        return attrWithDefault.defaultValue;
    }

    // Infer default based on curve type
    switch (attribute.curve.type) {
        case 'boolean':
            return false;
        case 'linear':
            return attribute.curve.min;
        case 'sigmoid':
            return attribute.curve.midpoint * 0.5; // Conservative default
        case 'log_normal':
            return (attribute.curve.minPrice + attribute.curve.maxPrice) / 2;
        case 'passthrough':
            return 0.5;
        default:
            return 0;
    }
}

// ============================================
// MAIN ADAPTER FUNCTION
// ============================================

/**
 * Maps a legacy Product to HMUM-ready format with defaults.
 * 
 * @description This function:
 * 1. Normalizes the product structure
 * 2. Fills in missing specs with conservative defaults
 * 3. Maps editorial scores to expected paths
 * 
 * @param product - Legacy product (Product or ScoredProduct)
 * @param categoryConfig - HMUM configuration for the category
 * @returns HMUMProduct ready for evaluation
 * 
 * @example
 * const hmumProduct = mapProductToHMUM(legacyProduct, smartTvConfig);
 * const result = evaluateProductContext(hmumProduct, smartTvConfig, userContext);
 */
export function mapProductToHMUM(
    product: Product | ScoredProduct,
    categoryConfig: CategoryHMUMConfig
): HMUMProduct {
    // Start with base product
    const hmumProduct: HMUMProduct = {
        id: product.id,
        name: product.name,
        price: product.price ?? 0,
        specs: {},
    };

    // Extract specs from product
    const sourceSpecs = (product as unknown as Record<string, unknown>).specs ?? {};
    const sourceScores = (product as unknown as Record<string, unknown>).scores ?? {};

    // Merge source specs into hmumProduct.specs
    if (typeof sourceSpecs === 'object' && sourceSpecs !== null) {
        hmumProduct.specs = { ...(sourceSpecs as Record<string, unknown>) };
    }

    // For each attribute in config, ensure a value exists
    for (const attribute of categoryConfig.attributes) {
        const path = attribute.specPath;
        const existingValue = extractWithDefault(hmumProduct as Record<string, unknown>, path, undefined);

        if (existingValue === undefined || existingValue === null) {
            // Apply default value
            const defaultValue = getAttributeDefault(attribute);
            setNestedValue(hmumProduct, path, defaultValue);
        }
    }

    // Map editorial score if ScoredProduct
    const scored = product as ScoredProduct;
    if (scored.computed) {
        hmumProduct.computed = {
            overall: scored.computed.overall ?? 5,
            qs: scored.computed.qs,
            vs: scored.computed.vs,
            gs: scored.computed.gs,
        };
    } else {
        // Calculate a basic overall from raw scores if available
        if (Object.keys(sourceScores).length > 0) {
            const scores = Object.values(sourceScores) as number[];
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            hmumProduct.computed = { overall: avg };
        } else {
            // Neutral default
            hmumProduct.computed = { overall: 5 };
        }
    }

    return hmumProduct;
}

/**
 * Sets a value at a nested path (creates intermediate objects if needed).
 */
function setNestedValue(
    obj: Record<string, unknown>,
    path: string,
    value: unknown
): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current) || typeof current[part] !== 'object') {
            current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
}

// ============================================
// FULL EVALUATION PIPELINE
// ============================================

/**
 * Complete evaluation: map + evaluate in one call.
 * 
 * @description Convenience function that combines:
 * 1. mapProductToHMUM (adapter)
 * 2. evaluateProductContext (engine)
 * 
 * @param product - Legacy product
 * @param categoryConfig - HMUM configuration
 * @param userContext - User's context and preferences
 * @returns Complete evaluation result
 */
export function evaluateLegacyProduct(
    product: Product | ScoredProduct,
    categoryConfig: CategoryHMUMConfig,
    userContext: UserContext
): EvaluationResult {
    const hmumProduct = mapProductToHMUM(product, categoryConfig);
    return evaluateProductContext(
        hmumProduct as Record<string, unknown>,
        categoryConfig,
        userContext
    );
}

/**
 * Batch evaluation for multiple products.
 */
export function evaluateLegacyProducts(
    products: (Product | ScoredProduct)[],
    categoryConfig: CategoryHMUMConfig,
    userContext: UserContext
): EvaluationResult[] {
    return products
        .map(product => evaluateLegacyProduct(product, categoryConfig, userContext))
        .sort((a, b) => {
            // Incompatible products go to bottom
            if (a.isIncompatible && !b.isIncompatible) return 1;
            if (!a.isIncompatible && b.isIncompatible) return -1;
            // Otherwise sort by score descending
            return b.finalScore - a.finalScore;
        });
}

// ============================================
// SPEC EXTRACTION HELPERS
// ============================================

/**
 * Commonly used spec extractors for TV category.
 */
export const TV_SPEC_EXTRACTORS = {
    /**
     * Extracts peak brightness from various possible spec names.
     */
    extractBrightness(product: HMUMProduct): number {
        const specs = product.specs;
        return (
            (specs.peak_brightness_nits as number) ??
            (specs.brightness_nits as number) ??
            (specs.hdr_brightness as number) ??
            (specs.nits as number) ??
            400 // Conservative default
        );
    },

    /**
     * Extracts input lag from various possible spec names.
     */
    extractInputLag(product: HMUMProduct): number {
        const specs = product.specs;
        return (
            (specs.input_lag_ms as number) ??
            (specs.input_lag as number) ??
            (specs.latency_ms as number) ??
            25 // Conservative default
        );
    },

    /**
     * Extracts refresh rate from various possible spec names.
     */
    extractRefreshRate(product: HMUMProduct): number {
        const specs = product.specs;
        return (
            (specs.refresh_rate_hz as number) ??
            (specs.refresh_rate as number) ??
            (specs.native_refresh as number) ??
            60 // Conservative default
        );
    },

    /**
     * Determines if product has HDMI 2.1.
     */
    hasHDMI21(product: HMUMProduct): boolean {
        const specs = product.specs;
        const ports = (specs.hdmi_2_1_ports as number) ?? 0;
        const hasFeature = (specs.hdmi_2_1 as boolean) ?? false;
        return ports > 0 || hasFeature;
    },
};

// ============================================
// VALIDATION
// ============================================

/**
 * Validates that a product has minimum required specs for HMUM evaluation.
 */
export function validateProductForHMUM(
    product: Product | ScoredProduct,
    categoryConfig: CategoryHMUMConfig
): {
    valid: boolean;
    missingRequired: string[];
    missingOptional: string[];
} {
    const hmumProduct = mapProductToHMUM(product, categoryConfig);
    const missingRequired: string[] = [];
    const missingOptional: string[] = [];

    for (const attribute of categoryConfig.attributes) {
        const value = extractWithDefault(
            hmumProduct as Record<string, unknown>,
            attribute.specPath,
            undefined
        );

        const isDefault = value === getAttributeDefault(attribute);

        if (isDefault) {
            if (attribute.required) {
                missingRequired.push(attribute.id);
            } else {
                missingOptional.push(attribute.id);
            }
        }
    }

    return {
        valid: missingRequired.length === 0,
        missingRequired,
        missingOptional,
    };
}

// ============================================
// EXPORT
// ============================================

export default {
    mapProductToHMUM,
    evaluateLegacyProduct,
    evaluateLegacyProducts,
    validateProductForHMUM,
    TV_SPEC_EXTRACTORS,
};
