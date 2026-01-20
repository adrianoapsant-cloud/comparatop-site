/**
 * AI Data Retrieval Service
 * 
 * Provides fuzzy search and data mapping for AI comparison tools.
 * Uses real product data from the catalog.
 */

import { ALL_PRODUCTS } from '@/data/products';
import type { Product } from '@/types/category';
import { scoreProduct } from '@/lib/scoring';
import { getCategoryById } from '@/config/categories';

// ===========================================================
// AI-COMPATIBLE PRODUCT INTERFACE
// ===========================================================

export interface AIProductSpec {
    id: string;
    name: string;
    shortName: string;
    brand: string;
    category: string;
    categoryName: string;
    price: number;
    score: number;
    specs: Record<string, string | number>;
    pros: string[];
    cons: string[];
    slug: string;
}

// ===========================================================
// STRING NORMALIZATION HELPERS
// ===========================================================

/**
 * Normalize string for fuzzy matching
 * - Lowercase
 * - Remove accents
 * - Remove special characters
 */
function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\w\s]/g, '') // Remove special chars
        .trim();
}

/**
 * Calculate similarity score between two strings (0-1)
 * Uses token-based matching for better fuzzy matching
 */
function calculateSimilarity(query: string, target: string): number {
    const queryTokens = normalizeString(query).split(/\s+/);
    const targetNormalized = normalizeString(target);

    let matchedTokens = 0;
    for (const token of queryTokens) {
        if (token.length >= 2 && targetNormalized.includes(token)) {
            matchedTokens++;
        }
    }

    // Return percentage of tokens matched
    return queryTokens.length > 0 ? matchedTokens / queryTokens.length : 0;
}

/**
 * Fuzzy string match with Levenshtein-like tolerance
 * Handles common typos like "Samsumg" → "Samsung"
 */
function fuzzyMatch(query: string, target: string): boolean {
    const q = normalizeString(query);
    const t = normalizeString(target);

    // Direct inclusion check
    if (t.includes(q) || q.includes(t)) {
        return true;
    }

    // Check if query tokens are in target
    const queryTokens = q.split(/\s+/);
    const matchedTokens = queryTokens.filter(token => {
        if (token.length < 2) return false;

        // Exact token match
        if (t.includes(token)) return true;

        // Typo tolerance: check if token is close to any word in target
        const targetWords = t.split(/\s+/);
        return targetWords.some(word => {
            if (Math.abs(word.length - token.length) > 2) return false;

            // Count matching characters
            let matches = 0;
            const shorter = token.length < word.length ? token : word;
            const longer = token.length < word.length ? word : token;

            for (let i = 0; i < shorter.length; i++) {
                if (longer.includes(shorter[i])) matches++;
            }

            // If 80%+ chars match, consider it a typo match
            return matches / shorter.length >= 0.8;
        });
    });

    // Match if at least 50% of query tokens matched
    return matchedTokens.length >= queryTokens.length * 0.5;
}

// ===========================================================
// PRODUCT MAPPING
// ===========================================================

/**
 * Map a Product to AI-compatible format
 */
function mapProductToAISpec(product: Product): AIProductSpec {
    const category = getCategoryById(product.categoryId);
    const scoredProduct = scoreProduct(product, category);

    // Build specs object from product data
    const specs: Record<string, string | number> = {};

    // Add common specs
    if (product.specs) {
        const s = product.specs;
        if ('screenSize' in s && typeof s.screenSize === 'number') specs['Tela'] = `${s.screenSize}"`;
        if ('panelType' in s && typeof s.panelType === 'string') specs['Tipo'] = s.panelType;
        if ('resolution' in s && typeof s.resolution === 'string') specs['Resolução'] = s.resolution;
        if ('refreshRate' in s && typeof s.refreshRate === 'number') specs['Taxa de Atualização'] = `${s.refreshRate}Hz`;
        if ('capacity' in s && typeof s.capacity === 'number') specs['Capacidade'] = `${s.capacity}L`;
    }

    // Add technical specs if available
    if (product.technicalSpecs) {
        Object.entries(product.technicalSpecs).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
                specs[key] = value;
            }
        });
    }

    // Add attributes if available
    if (product.attributes) {
        const a = product.attributes;
        if ('brightness' in a && typeof a.brightness === 'number') specs['Brilho'] = `${a.brightness} nits`;
        if ('hdmi21Ports' in a && typeof a.hdmi21Ports === 'number') specs['HDMI 2.1'] = `${a.hdmi21Ports} portas`;
        if ('smartPlatform' in a && typeof a.smartPlatform === 'string') specs['Sistema'] = a.smartPlatform;
    }

    // Generate pros and cons from scoreReasons
    const pros: string[] = [];
    const cons: string[] = [];

    if (product.scoreReasons) {
        Object.entries(product.scoreReasons).forEach(([key, reason]) => {
            // Find the score for this criterion
            const scoreKey = key as keyof typeof product.scores;
            const score = product.scores[scoreKey];

            if (typeof score === 'number') {
                if (score >= 8.5) {
                    pros.push(reason);
                } else if (score <= 6.5) {
                    cons.push(reason);
                }
            }
        });
    }

    // Fallback pros/cons based on badges
    if (pros.length === 0) {
        if (product.badges?.includes('editors-choice')) pros.push('Escolha da Redação');
        if (product.badges?.includes('best-value')) pros.push('Melhor Custo-Benefício');
        if (product.badges?.includes('premium-pick')) pros.push('Produto Premium');
    }

    return {
        id: product.id,
        name: product.name,
        shortName: product.shortName || product.name.split(' ')[0] + ' ' + product.model,
        brand: product.brand,
        category: product.categoryId,
        categoryName: category?.name || product.categoryId,
        price: product.price,
        score: scoredProduct.computed.overall,
        specs,
        pros: pros.slice(0, 3),
        cons: cons.slice(0, 3),
        slug: product.id,
    };
}

// ===========================================================
// MAIN SEARCH FUNCTION
// ===========================================================

/**
 * Find products by name using fuzzy matching
 * 
 * @param queries - Array of product names/terms to search for
 * @returns Array of matching products in AI-compatible format
 */
export function findProductsByName(queries: string[]): AIProductSpec[] {
    const results: AIProductSpec[] = [];
    const seenIds = new Set<string>();

    for (const query of queries) {
        const normalizedQuery = normalizeString(query);

        // Skip empty queries
        if (!normalizedQuery || normalizedQuery.length < 2) continue;

        // Score all products against this query
        const scored = ALL_PRODUCTS.map(product => {
            // Check multiple fields for matches
            const nameScore = calculateSimilarity(query, product.name);
            const brandScore = calculateSimilarity(query, product.brand);
            const modelScore = product.model ? calculateSimilarity(query, product.model) : 0;
            const shortNameScore = product.shortName ? calculateSimilarity(query, product.shortName) : 0;

            // Combined score (weighted)
            const score = Math.max(
                nameScore * 1.0,
                brandScore * 0.8 + modelScore * 0.5,
                shortNameScore * 0.9
            );

            // Bonus for fuzzy match
            const fuzzyBonus = fuzzyMatch(query, product.name) ? 0.3 :
                fuzzyMatch(query, product.brand + ' ' + product.model) ? 0.2 : 0;

            return { product, score: score + fuzzyBonus };
        });

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Take best match if score is high enough
        if (scored.length > 0 && scored[0].score >= 0.3) {
            const bestMatch = scored[0].product;

            if (!seenIds.has(bestMatch.id)) {
                seenIds.add(bestMatch.id);
                results.push(mapProductToAISpec(bestMatch));
            }
        }
    }

    return results;
}

/**
 * Get a single product by ID
 */
export function getProductByIdForAI(productId: string): AIProductSpec | null {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    return product ? mapProductToAISpec(product) : null;
}

/**
 * Search products with a single query string
 */
export function searchProducts(query: string, limit: number = 5): AIProductSpec[] {
    const normalizedQuery = normalizeString(query);

    if (!normalizedQuery || normalizedQuery.length < 2) {
        return [];
    }

    const scored = ALL_PRODUCTS.map(product => {
        const nameScore = calculateSimilarity(query, product.name);
        const brandScore = calculateSimilarity(query, product.brand);
        const fuzzyBonus = fuzzyMatch(query, product.name) ? 0.2 : 0;

        return { product, score: Math.max(nameScore, brandScore) + fuzzyBonus };
    });

    return scored
        .filter(s => s.score > 0.2)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => mapProductToAISpec(s.product));
}

// ===========================================================
// GET ALL PRODUCTS - For Discovery Tool
// ===========================================================

/**
 * Get all products in AI-compatible format
 * Used by show_product_discovery tool for inspiration queries
 */
export function getAllProducts(): AIProductSpec[] {
    try {
        if (!ALL_PRODUCTS || ALL_PRODUCTS.length === 0) {
            console.warn('[getAllProducts] ALL_PRODUCTS is empty or undefined');
            return [];
        }

        console.log(`[getAllProducts] Processing ${ALL_PRODUCTS.length} products...`);

        const results: AIProductSpec[] = [];
        for (const product of ALL_PRODUCTS) {
            try {
                const mapped = mapProductToAISpec(product);
                results.push(mapped);
            } catch (mapError) {
                console.error(`[getAllProducts] Failed to map product ${product?.id}:`, mapError);
                // Continue with other products
            }
        }

        console.log(`[getAllProducts] Successfully mapped ${results.length}/${ALL_PRODUCTS.length} products`);
        return results;
    } catch (error) {
        console.error('[getAllProducts] Critical error:', error);
        return [];
    }
}

// ===========================================================
// PRODUCT DETAILS - For Technical Questions
// ===========================================================

export interface AIProductDetails {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    score: number;
    // Dados técnicos completos
    energyKwh?: number;          // consumo em kWh/ano
    energyPeriod: "month" | "year";
    energyLabel?: string;        // selo A, B, C, etc.
    specs: Record<string, string | number>;
    technicalSpecs?: Record<string, string | number>;
    pros: string[];
    cons: string[];
    // Links
    internalUrl: string;
    manualUrl?: string;
}

/**
 * Get detailed technical specs for a product
 * Used when user asks about energy consumption, manual, specs, etc.
 */
export function getProductDetails(productId: string): AIProductDetails | null {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product) return null;

    const category = getCategoryById(product.categoryId);
    const scoredProduct = scoreProduct(product, category);

    // Build comprehensive specs
    const specs: Record<string, string | number> = {};
    const technicalSpecs: Record<string, string | number> = {};

    // Extract energy data from specs or technicalSpecs
    let energyKwh: number | undefined;
    let energyLabel: string | undefined;

    if (product.specs) {
        const s = product.specs;
        // TV specs
        if ('screenSize' in s && typeof s.screenSize === 'number') specs['Tela'] = `${s.screenSize}"`;
        if ('panelType' in s && typeof s.panelType === 'string') specs['Tipo de Painel'] = s.panelType;
        if ('resolution' in s && typeof s.resolution === 'string') specs['Resolução'] = s.resolution;
        if ('refreshRate' in s && typeof s.refreshRate === 'number') specs['Taxa de Atualização'] = `${s.refreshRate}Hz`;
        // Geladeira/AC specs
        if ('capacity' in s && typeof s.capacity === 'number') specs['Capacidade'] = `${s.capacity}L`;
        if ('btu' in s && typeof s.btu === 'number') specs['Potência'] = `${s.btu} BTUs`;
        // Energy
        if ('energyKwh' in s && typeof s.energyKwh === 'number') {
            energyKwh = s.energyKwh;
            specs['Consumo Anual'] = `${s.energyKwh} kWh/ano`;
        }
        if ('energyLabel' in s && typeof s.energyLabel === 'string') {
            energyLabel = s.energyLabel;
            specs['Selo Procel'] = s.energyLabel;
        }
    }

    // Add all technicalSpecs if available
    if (product.technicalSpecs) {
        Object.entries(product.technicalSpecs).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
                technicalSpecs[key] = value;
            }
        });
    }

    // Add attributes
    if (product.attributes) {
        const a = product.attributes;
        if ('brightness' in a && typeof a.brightness === 'number') specs['Brilho'] = `${a.brightness} nits`;
        if ('hdmi21Ports' in a && typeof a.hdmi21Ports === 'number') specs['Portas HDMI 2.1'] = `${a.hdmi21Ports}`;
        if ('smartPlatform' in a && typeof a.smartPlatform === 'string') specs['Sistema Operacional'] = a.smartPlatform;
        if ('noise' in a && typeof a.noise === 'number') specs['Ruído'] = `${a.noise} dB`;
        if ('voltage' in a && typeof a.voltage === 'string') specs['Tensão'] = a.voltage;
    }

    // Generate pros and cons
    const pros: string[] = [];
    const cons: string[] = [];

    if (product.scoreReasons) {
        Object.entries(product.scoreReasons).forEach(([key, reason]) => {
            const scoreKey = key as keyof typeof product.scores;
            const score = product.scores[scoreKey];
            if (typeof score === 'number') {
                if (score >= 8.5) pros.push(reason);
                else if (score <= 6.5) cons.push(reason);
            }
        });
    }

    // Fallback pros based on badges
    if (pros.length === 0) {
        if (product.badges?.includes('editors-choice')) pros.push('Escolha da Redação');
        if (product.badges?.includes('best-value')) pros.push('Melhor Custo-Benefício');
        if (product.badges?.includes('premium-pick')) pros.push('Produto Premium');
    }

    return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.categoryId,
        price: product.price,
        score: scoredProduct.computed.overall,
        energyKwh,
        energyPeriod: "year",
        energyLabel,
        specs,
        technicalSpecs: Object.keys(technicalSpecs).length > 0 ? technicalSpecs : undefined,
        pros: pros.slice(0, 5),
        cons: cons.slice(0, 5),
        internalUrl: `/produto/${product.id}`,
        manualUrl: undefined, // TODO: Add manual URLs to product data
    };
}
