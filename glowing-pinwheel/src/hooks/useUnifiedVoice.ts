'use client';

// ============================================
// UNIFIED VOICE HOOK - Versão Estática (v2)
// ============================================
// IMPORTANTE: Este hook agora lê TODOS os dados do arquivo do produto.
// A API do Gemini foi desconectada para evitar duplicidade e custos.
// Os dados devem vir pré-preenchidos no arquivo .ts do produto.

import { useMemo } from 'react';

export interface CommunityConsensusData {
    /** Percentage of 4-5 star reviews (0-100) */
    approval_percentage: number;
    /** Formatted review count (e.g., "5.8k", "2.3k") */
    total_reviews: string;
    /** Average star rating (1.0-5.0) */
    star_rating: number;
    /** Review sources */
    sources: string[];
}

export interface UnifiedVoiceData {
    unified_score: number;
    verdict_card: {
        headline: string;
        target_audience: string;
        dealbreaker: string;
    };
    curiosity_sandwich?: {
        icon: string;
        text: string;
    };
    pros_cons: {
        pros: string[];
        cons: string[];
    };
    // Category-specific radar tooltips - keys vary by category
    radar_tooltips: Record<string, string>;
    // Category-specific dimension scores - keys vary by category
    dimension_scores?: Record<string, number>;
    // Category ID from product
    categoryId?: string;
    // Community consensus from real Amazon/ML reviews
    community_consensus?: CommunityConsensusData;
}

interface UseUnifiedVoiceResult {
    data: UnifiedVoiceData | null;
    loading: boolean;
    error: string | null;
    fromCache: boolean;
}

// Product type with all unified voice fields
interface ProductWithUnifiedVoice {
    id: string;
    name: string;
    shortName?: string;
    brand?: string;
    categoryId?: string;
    benefitSubtitle?: string;
    header?: {
        overallScore?: number;
        title?: string;
        subtitle?: string;
    };
    auditVerdict?: {
        dontBuyIf?: {
            items?: string[];
        };
    };
    curiositySandwich?: {
        icon: string;
        text: string;
    };
    voc?: {
        pros?: string[];
        cons?: string[];
        totalReviews?: number;
        averageRating?: number;
        consensusScore?: number;
        sources?: Array<{ store: string }>;
    };
    scoreReasons?: Record<string, string>;
    scores?: Record<string, number>;
}

/**
 * Hook estático para ler dados do produto.
 * 
 * DEPRECATED: O parâmetro productId não é mais usado.
 * Use useUnifiedVoiceFromProduct(product) ao invés.
 */
export function useUnifiedVoice(productId: string): UseUnifiedVoiceResult {
    // DEPRECATED: Retorna null - use useUnifiedVoiceFromProduct
    console.warn('[useUnifiedVoice] DEPRECATED: Use useUnifiedVoiceFromProduct(product) instead. API Gemini desconectada.');

    return {
        data: null,
        loading: false,
        error: 'API Gemini desconectada. Use useUnifiedVoiceFromProduct(product).',
        fromCache: true,
    };
}

/**
 * Hook estático para extrair dados do UnifiedVoice a partir do produto.
 * Todos os dados vêm do arquivo .ts do produto - sem chamadas à API.
 */
export function useUnifiedVoiceFromProduct(product: ProductWithUnifiedVoice | null): UseUnifiedVoiceResult {
    const data = useMemo<UnifiedVoiceData | null>(() => {
        if (!product) return null;

        // Extract score from header or calculate from scores
        let unifiedScore = 7.5;
        if (product.header?.overallScore !== undefined) {
            unifiedScore = product.header.overallScore;
            // Normalize if on 0-100 scale
            if (unifiedScore > 10) {
                unifiedScore = unifiedScore / 10;
            }
        } else if (product.scores) {
            const values = Object.values(product.scores).filter((v): v is number => typeof v === 'number');
            if (values.length > 0) {
                unifiedScore = values.reduce((a, b) => a + b, 0) / values.length;
            }
        }

        // Build verdict_card from header and auditVerdict
        const verdictCard = {
            headline: product.header?.title || product.shortName || product.name || 'Produto',
            target_audience: product.header?.subtitle || '',
            dealbreaker: product.auditVerdict?.dontBuyIf?.items?.[0] || '',
        };

        // Curiosity sandwich from product (optional field)
        const curiositySandwich = product.curiositySandwich;

        // Pros/Cons from VOC
        const prosCons = {
            pros: product.voc?.pros || [],
            cons: product.voc?.cons || [],
        };

        // Radar tooltips from scoreReasons
        const radarTooltips: Record<string, string> = {};
        if (product.scoreReasons) {
            Object.entries(product.scoreReasons).forEach(([key, value]) => {
                radarTooltips[key] = value;
            });
        }

        // Dimension scores from scores
        const dimensionScores: Record<string, number> = {};
        if (product.scores) {
            Object.entries(product.scores).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    dimensionScores[key] = value;
                }
            });
        }

        // Community consensus from VOC
        const communityConsensus: CommunityConsensusData | undefined = product.voc ? {
            approval_percentage: product.voc.consensusScore || 0,
            total_reviews: formatReviewCount(product.voc.totalReviews || 0),
            star_rating: product.voc.averageRating || 0,
            sources: product.voc.sources?.map(s => s.store) || [],
        } : undefined;

        return {
            unified_score: unifiedScore,
            verdict_card: verdictCard,
            curiosity_sandwich: curiositySandwich,
            pros_cons: prosCons,
            radar_tooltips: radarTooltips,
            dimension_scores: dimensionScores,
            categoryId: product.categoryId,
            community_consensus: communityConsensus,
        };
    }, [product]);

    return {
        data,
        loading: false,
        error: null,
        fromCache: true, // Always static
    };
}

// Helper to format review count
function formatReviewCount(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return String(count);
}

// ============================================
// CATEGORY-SPECIFIC FIELD MAPPINGS
// ============================================
// SSOT: Importado de @/config/criteria-labels.ts

import { CATEGORY_FIELD_MAPS } from '@/config/criteria-labels';

// ============================================
// HELPER: Map radar tooltips to ProductDNAData format
// ============================================
export function mapRadarTooltipsToDNA(
    tooltips: Record<string, string>,
    scores?: Record<string, number>,
    categoryId: string = 'tv'
): Record<string, { score: number; reason: string }> {
    const defaultScore = 7;
    const fieldMap = CATEGORY_FIELD_MAPS[categoryId] || CATEGORY_FIELD_MAPS.tv;

    const result: Record<string, { score: number; reason: string }> = {};

    for (const [cKey, apiField] of Object.entries(fieldMap)) {
        result[cKey] = {
            score: scores?.[apiField] ?? defaultScore,
            reason: tooltips[apiField] || '',
        };
    }

    return result;
}
