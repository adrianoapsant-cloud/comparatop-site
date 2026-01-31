/**
 * SimplifiedPDP Hook - usePDPData
 * Carrega todos os dados necessários para a PDP baseado no Data Contract
 * 
 * NOTA: Este é um hook simplificado que funciona com os tipos existentes do projeto.
 * A integração completa requer adaptar para useProductVM ou similar.
 */

import { useMemo } from 'react';
import type { Product } from '@/types/category';
import { getCategoryConstants } from '@/data/category-constants';

// Types for SimplifiedPDP
export interface HiddenEngineeringItem {
    title: string;
    severity: 'critical' | 'warning' | 'info';
    resolvability: number;
    specific: string;
    technicalFact: string;
    riskAnalysis: string;
    mitigation: string;
}

export interface MethodologyData {
    sourceCount: number;
    layers: {
        type: 'technical' | 'editorial' | 'community' | 'aftermarket';
        sources: string[];
    }[];
}

export interface RadarDimension {
    name: string;
    score: number;
    tooltip?: string;
}

export interface TechSpec {
    label: string;
    value: string;
    unit?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface ScoresDimension {
    name: string;
    score: number;
    weight: number;
}

export interface ScoresData {
    final: number;
    dimensions: ScoresDimension[];
    hmumMatch?: number;
    categoryAverage?: number;
}

export interface TCOData {
    purchasePrice: number;
    maintenanceCost5y: number;
    totalCost5y: number;
    monthlyReserve: number;
    explanation?: {
        limitingComponent?: string;
        estimatedLifeYears?: number;
    };
}

export interface ExtendedData {
    header?: {
        headline?: string;
        subtitle?: string;
    };
    verdict?: {
        headline?: string;
        prosExpanded?: Array<string | { text?: string; title?: string }>;
        consExpanded?: Array<string | { text?: string; title?: string }>;
    };
    methodology?: MethodologyData;
}

export interface PDPDataContract {
    product: Product;
    extended: ExtendedData | null;
    scores: ScoresData | null;
    tco: TCOData | null;
    hiddenEngineering: HiddenEngineeringItem[] | null;
    dna: RadarDimension[] | null;
    technicalSpecs: Record<string, TechSpec[]> | null;
    faq: FAQItem[] | null;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export function validatePDPContract(data: Partial<PDPDataContract>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.product?.name) errors.push('product.name required');
    if (!data.product?.id) errors.push('product.id required');
    if (!data.scores?.final) errors.push('scores.final required');

    // Optional but recommended
    if (!data.extended?.verdict?.headline) warnings.push('extended.verdict.headline missing');
    if (!data.hiddenEngineering?.length) warnings.push('hiddenEngineering empty');
    if ((data.faq?.length || 0) < 3) warnings.push('faq has less than 3 items');
    if ((data.dna?.length || 0) < 5) warnings.push('dna has less than 5 dimensions');

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Hook simplificado para carregar dados da PDP
 * 
 * TODO: Integrar com:
 * - getExtendedProductData() real
 * - calculateUnifiedScore() real
 * - calculateProductCosts() real
 */
export function usePDPData(product: Product): {
    data: PDPDataContract;
    validation: ValidationResult;
    loading: boolean;
} {
    const data = useMemo<PDPDataContract>(() => {
        // Get category constants for this product's category
        const categoryConstants = getCategoryConstants(product.categoryId);

        // Scores from product.scores (category.ts uses 'scores' not 'rawScores')
        const scores: ScoresData | null = product.scores ? {
            final: Object.values(product.scores).reduce((a, b) => (a as number) + (b as number), 0) / Object.keys(product.scores).length,
            dimensions: Object.entries(product.scores).map(([key, value]) => ({
                name: key,
                score: value as number,
                weight: 1,
            })),
            hmumMatch: 75, // Placeholder
            categoryAverage: categoryConstants.avgLifespanYears, // ✅ From category-constants.ts
        } : null;

        // Placeholder extended data - in real implementation, load from mocks
        const extended: ExtendedData = {
            header: {
                headline: product.shortName || product.name,
            },
            verdict: {
                headline: 'Análise editorial em desenvolvimento',
                prosExpanded: [],
                consExpanded: [],
            },
        };

        // Placeholder TCO (category.ts uses 'price' not 'currentPrice')
        const tco: TCOData | null = product.price ? {
            purchasePrice: product.price,
            maintenanceCost5y: Math.round(product.price * 0.15),
            totalCost5y: Math.round(product.price * 1.15),
            monthlyReserve: Math.round((product.price * 0.15) / 60),
        } : null;
        // Transform technicalSpecs from product to grouped format
        const technicalSpecs: Record<string, TechSpec[]> | null = product.technicalSpecs ? (() => {
            const specs = product.technicalSpecs as Record<string, unknown>;
            const grouped: Record<string, TechSpec[]> = {
                limpeza: [],
                navegacao: [],
                bateria: [],
                conectividade: [],
                base: [],
                dimensoes: [],
            };

            // Map known fields to categories
            const fieldMappings: Record<string, { category: string; label: string; unit?: string }> = {
                suctionPower: { category: 'limpeza', label: 'Potência de Sucção', unit: 'Pa' },
                dustbinCapacity: { category: 'limpeza', label: 'Capacidade do Reservatório', unit: 'ml' },
                waterTankCapacity: { category: 'limpeza', label: 'Tanque de Água', unit: 'ml' },
                mopType: { category: 'limpeza', label: 'Tipo de Mop' },
                brushType: { category: 'limpeza', label: 'Tipo de Escova' },
                filterType: { category: 'limpeza', label: 'Filtro' },
                navigation: { category: 'navegacao', label: 'Navegação' },
                mapping: { category: 'navegacao', label: 'Mapeamento' },
                lidar: { category: 'navegacao', label: 'LiDAR' },
                obstacleDetection: { category: 'navegacao', label: 'Detecção de Obstáculos' },
                climbHeight: { category: 'navegacao', label: 'Altura de Escalada', unit: 'mm' },
                runtime: { category: 'bateria', label: 'Autonomia' },
                batteryCapacity: { category: 'bateria', label: 'Capacidade', unit: 'mAh' },
                chargingTime: { category: 'bateria', label: 'Tempo de Carga' },
                autoRecharge: { category: 'bateria', label: 'Auto Recarga' },
                rechargeResume: { category: 'bateria', label: 'Recharge & Resume' },
                wifi: { category: 'conectividade', label: 'Wi-Fi' },
                appControl: { category: 'conectividade', label: 'Controle por App' },
                voiceControl: { category: 'conectividade', label: 'Controle de Voz' },
                scheduling: { category: 'conectividade', label: 'Agendamento' },
                dockType: { category: 'base', label: 'Tipo de Base' },
                autoEmpty: { category: 'base', label: 'Auto-Esvaziamento' },
                autoMopWash: { category: 'base', label: 'Lavagem de Mop' },
                height: { category: 'dimensoes', label: 'Altura', unit: 'cm' },
                diameter: { category: 'dimensoes', label: 'Diâmetro', unit: 'cm' },
                weight: { category: 'dimensoes', label: 'Peso', unit: 'kg' },
                noiseLevel: { category: 'dimensoes', label: 'Ruído', unit: 'dB' },
            };

            for (const [key, value] of Object.entries(specs)) {
                const mapping = fieldMappings[key];
                if (mapping && value !== undefined && value !== null) {
                    const strValue = typeof value === 'boolean'
                        ? (value ? 'Sim' : 'Não')
                        : String(value);
                    grouped[mapping.category].push({
                        label: mapping.label,
                        value: strValue,
                        unit: mapping.unit,
                    });
                }
            }

            // Filter out empty categories
            const result: Record<string, TechSpec[]> = {};
            for (const [cat, items] of Object.entries(grouped)) {
                if (items.length > 0) {
                    result[cat] = items;
                }
            }
            return Object.keys(result).length > 0 ? result : null;
        })() : null;

        return {
            product,
            extended,
            scores,
            tco,
            hiddenEngineering: null,
            dna: null,
            technicalSpecs,
            faq: null,
        };
    }, [product]);

    const validation = useMemo(() => validatePDPContract(data), [data]);

    return {
        data,
        validation,
        loading: false,
    };
}

export default usePDPData;
