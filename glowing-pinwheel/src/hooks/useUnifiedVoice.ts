'use client';

import { useState, useEffect } from 'react';

// ============================================
// UNIFIED VOICE HOOK - Projeto Voz Unificada
// ============================================
// Fetches structured verdict data from Gemini API
// Returns unified_score, verdict_card, pros_cons, radar_tooltips

// Generic radar tooltips - API returns category-specific keys
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
    // Category ID from API
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

export function useUnifiedVoice(productId: string): UseUnifiedVoiceResult {
    const [data, setData] = useState<UnifiedVoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fromCache, setFromCache] = useState(false);

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/reviews/${productId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch unified voice data');
                }

                const json = await response.json();

                // Extract unified voice data from response
                const voiceData: UnifiedVoiceData = {
                    unified_score: json.unified_score ?? 7.5,
                    verdict_card: json.verdict_card ?? {
                        headline: 'Análise em Processamento',
                        target_audience: 'Usuário geral',
                        dealbreaker: 'Aguarde análise completa',
                    },
                    curiosity_sandwich: json.curiosity_sandwich,
                    pros_cons: json.pros_cons ?? {
                        pros: [],
                        cons: [],
                    },
                    radar_tooltips: json.radar_tooltips ?? {},
                    dimension_scores: json.dimension_scores,
                    categoryId: json.categoryId,
                    community_consensus: json.community_consensus,
                };

                setData(voiceData);
                setFromCache(json.metadata?.fromCache ?? false);
            } catch (err) {
                console.error('[useUnifiedVoice] Error:', err);
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    return { data, loading, error, fromCache };
}

// ============================================
// CATEGORY-SPECIFIC FIELD MAPPINGS
// ============================================
// Maps category-specific API field names to c1-c10

const TV_FIELD_MAP = {
    c1: 'custo_beneficio',
    c2: 'processamento',
    c3: 'confiabilidade',
    c4: 'sistema',
    c5: 'gaming',
    c6: 'brilho',
    c7: 'pos_venda',
    c8: 'som',
    c9: 'conectividade',
    c10: 'design',
};

const FRIDGE_FIELD_MAP = {
    c1: 'custo_beneficio',
    c2: 'eficiencia_energetica',
    c3: 'capacidade',
    c4: 'refrigeracao',
    c5: 'confiabilidade',
    c6: 'ruido',
    c7: 'pos_venda',
    c8: 'recursos_smart',
    c9: 'design',
    c10: 'funcionalidades',
};

const AC_FIELD_MAP = {
    c1: 'custo_beneficio',
    c2: 'eficiencia',
    c3: 'capacidade_btu',
    c4: 'durabilidade',
    c5: 'silencio',
    c6: 'inverter',
    c7: 'pos_venda',
    c8: 'filtros',
    c9: 'conectividade',
    c10: 'design',
};

const ROBOT_VACUUM_FIELD_MAP = {
    c1: 'navegacao',           // Navegação & Mapeamento
    c2: 'app_voz',             // Software & Conectividade
    c3: 'mop',                 // Eficiência de Mop
    c4: 'escovas',             // Engenharia de Escovas
    c5: 'altura',              // Restrições Físicas
    c6: 'pecas',               // Manutenibilidade
    c7: 'bateria',             // Autonomia
    c8: 'ruido',               // Acústica
    c9: 'base',                // Automação (Docks)
    c10: 'ia',                 // Recursos vs Gimmicks
};

const CATEGORY_FIELD_MAPS: Record<string, Record<string, string>> = {
    tv: TV_FIELD_MAP,
    fridge: FRIDGE_FIELD_MAP,
    air_conditioner: AC_FIELD_MAP,
    'robot-vacuum': ROBOT_VACUUM_FIELD_MAP,
};

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

