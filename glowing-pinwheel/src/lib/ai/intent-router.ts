/**
 * Intent Router - Low-cost heuristic routing for user queries
 * 
 * This module analyzes user input to determine whether to use
 * expensive Generative UI (Gemini) or simple standard search.
 * 
 * Strategy: Avoid invoking Gemini for simple product searches.
 */

// ===========================================================
// TYPES
// ===========================================================

export type IntentType = 'STANDARD_SEARCH' | 'GENERATIVE_UI';

export interface IntentResult {
    intent: IntentType;
    confidence: 'high' | 'medium' | 'low';
    reason: string;
    searchQuery?: string; // For STANDARD_SEARCH, the cleaned query
}

// ===========================================================
// KEYWORD SETS (Portuguese-BR optimized)
// ===========================================================

/**
 * Direct action keywords -> STANDARD_SEARCH
 * User wants to buy/see prices immediately
 */
const DIRECT_ACTION_KEYWORDS = [
    'comprar',
    'preço',
    'preco',
    'oferta',
    'promoção',
    'promocao',
    'desconto',
    'barato',
    'onde',
    'loja',
    'amazon',
    'mercado livre',
    'magalu',
    'ver',
    'mostrar',
];

/**
 * Comparative keywords -> GENERATIVE_UI
 * User wants comparison, analysis, or recommendation
 */
const COMPARATIVE_KEYWORDS = [
    'melhor',
    'pior',
    'diferença',
    'diferenca',
    'comparar',
    'compare',
    'comparação',
    'comparativo',
    'vs',
    'versus',
    'qual',
    'entre',
    'escolher',
    'vale a pena',
    'compensa',
    'recomenda',
    'indica',
    'sugere',
    'opinião',
    'opiniao',
    'review',
    'análise',
    'analise',
];

/**
 * Question starters -> lean toward GENERATIVE_UI
 */
const QUESTION_STARTERS = [
    'qual',
    'quais',
    'como',
    'porque',
    'por que',
    'o que',
    'quando',
    'onde é melhor',
    'vale',
    'compensa',
    'devo',
    'posso',
];

// ===========================================================
// HELPER FUNCTIONS
// ===========================================================

/**
 * Normalize query for analysis
 */
function normalizeQuery(query: string): string {
    return query
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .trim();
}

/**
 * Count words in query
 */
function countWords(query: string): number {
    return query.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Check if query contains any keyword from a set
 */
function containsKeyword(query: string, keywords: string[]): boolean {
    const normalized = normalizeQuery(query);
    return keywords.some(keyword => normalized.includes(normalizeQuery(keyword)));
}

/**
 * Check if query starts with any phrase from a set
 */
function startsWithAny(query: string, phrases: string[]): boolean {
    const normalized = normalizeQuery(query);
    return phrases.some(phrase => normalized.startsWith(normalizeQuery(phrase)));
}

/**
 * Detect if query contains product names (heuristic)
 * Returns true if query has brand-like patterns
 */
function containsProductMention(query: string): boolean {
    const productPatterns = [
        /iphone\s*\d*/i,
        /galaxy\s*s?\d*/i,
        /samsung/i,
        /lg/i,
        /sony/i,
        /apple/i,
        /qn\d+/i,
        /oled/i,
        /neo\s*qled/i,
        /c\d+/i,
        /tv\s*\d+/i,
        /notebook/i,
        /geladeira/i,
        /ar\s*condicionado/i,
    ];

    return productPatterns.some(pattern => pattern.test(query));
}

// ===========================================================
// MAIN ROUTING FUNCTION
// ===========================================================

/**
 * Route user intent based on heuristics
 * 
 * Rules:
 * 1. Direct action keywords + short query -> STANDARD_SEARCH
 * 2. Comparative keywords + product mentions -> GENERATIVE_UI
 * 3. Questions (longer queries) -> GENERATIVE_UI
 * 4. Very short queries (< 4 words) with no comparison -> STANDARD_SEARCH
 * 5. Default -> STANDARD_SEARCH (safe fallback)
 * 
 * @param query - User's input text
 * @returns IntentResult with routing decision
 */
export function routeUserIntent(query: string): IntentResult {
    const wordCount = countWords(query);
    const hasComparativeKeyword = containsKeyword(query, COMPARATIVE_KEYWORDS);
    const hasDirectActionKeyword = containsKeyword(query, DIRECT_ACTION_KEYWORDS);
    const isQuestion = startsWithAny(query, QUESTION_STARTERS);
    const hasProductMention = containsProductMention(query);

    // Debug logging (server-side only)
    console.log('[IntentRouter]', {
        query: query.substring(0, 50),
        wordCount,
        hasComparativeKeyword,
        hasDirectActionKeyword,
        isQuestion,
        hasProductMention,
    });

    // ===========================================
    // RULE 1: Explicit comparative intent
    // ===========================================
    if (hasComparativeKeyword) {
        return {
            intent: 'GENERATIVE_UI',
            confidence: 'high',
            reason: 'Detected comparative keyword',
        };
    }

    // ===========================================
    // RULE 2: Question with product mention
    // ===========================================
    if (isQuestion && hasProductMention && wordCount >= 4) {
        return {
            intent: 'GENERATIVE_UI',
            confidence: 'medium',
            reason: 'Question about specific product',
        };
    }

    // ===========================================
    // RULE 3: Long complex query (likely needs AI)
    // ===========================================
    if (wordCount >= 8 && !hasDirectActionKeyword) {
        return {
            intent: 'GENERATIVE_UI',
            confidence: 'medium',
            reason: 'Long query requiring analysis',
        };
    }

    // ===========================================
    // RULE 4: Direct action keywords
    // ===========================================
    if (hasDirectActionKeyword) {
        return {
            intent: 'STANDARD_SEARCH',
            confidence: 'high',
            reason: 'Direct action keyword detected',
            searchQuery: query,
        };
    }

    // ===========================================
    // RULE 5: Short query without comparison
    // ===========================================
    if (wordCount < 4) {
        return {
            intent: 'STANDARD_SEARCH',
            confidence: 'medium',
            reason: 'Short query, defaulting to search',
            searchQuery: query,
        };
    }

    // ===========================================
    // DEFAULT: Safe fallback to standard search
    // ===========================================
    return {
        intent: 'STANDARD_SEARCH',
        confidence: 'low',
        reason: 'Default fallback',
        searchQuery: query,
    };
}

// ===========================================================
// EXPORTED UTILITIES
// ===========================================================

/**
 * Check if intent should trigger Gemini
 */
export function shouldUseGenerativeUI(query: string): boolean {
    return routeUserIntent(query).intent === 'GENERATIVE_UI';
}

/**
 * Get search redirect URL for STANDARD_SEARCH
 */
export function getSearchRedirectUrl(query: string): string {
    const encoded = encodeURIComponent(query);
    return `/busca?q=${encoded}`;
}
