/**
 * @file product-ownership.ts
 * @description Helper para integrar Shadow Engine com dados de produto
 * 
 * Este módulo combina:
 * 1. Dados do produto (do banco/mock)
 * 2. Constantes da categoria
 * 3. Shadow Engine para calcular métricas
 * 4. Sistema de Inteligência de Componentes (SIC) quando disponível
 * 
 * @version 2.0.0 - Integração com SIC
 */

import type { Product } from '@/types/category';
import type { ProductFactsV2, ShadowMetrics } from '@/lib/scoring/types';
import { computeShadowMetrics, enrichWithShadowMetrics } from '@/lib/scoring/shadow-engine';
import { getCategoryConstants, type CategoryConstants } from '@/data/category-constants';
import { calculateSIC, hasComponentMapping } from '@/lib/scoring/component-engine';
import type { SICCalculationResult } from '@/data/components/types';

// ============================================
// TYPES
// ============================================

/**
 * Resultado completo da análise de propriedade
 */
export interface OwnershipAnalysis {
    /** Métricas calculadas pelo Shadow Engine */
    shadowMetrics: ShadowMetrics;

    /** Constantes da categoria */
    categoryConstants: CategoryConstants;

    /** ProductFacts enriquecido */
    enrichedFacts: ProductFactsV2;

    /** Resultado do SIC (quando produto tem mapeamento de componentes) */
    sicResult?: SICCalculationResult;

    /** Indica se os dados vêm do SIC ou de fallback de categoria */
    dataSource: 'sic' | 'category_fallback';
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Analisa o custo de propriedade de um produto.
 * 
 * @description Esta é a função principal de integração. Ela:
 * 1. Verifica se o produto tem mapeamento de componentes (SIC)
 * 2. Se sim, usa dados reais dos componentes
 * 3. Se não, usa fallback com constantes da categoria
 * 
 * @param product - Produto do catálogo
 * @returns Análise completa de propriedade
 */
export function analyzeProductOwnership(product: Product): OwnershipAnalysis {
    // Obter constantes da categoria
    const categoryConstants = getCategoryConstants(product.categoryId);

    // Tentar usar SIC (Sistema de Inteligência de Componentes)
    const sicResult = calculateSIC(product.id);

    let shadowMetrics: ShadowMetrics;
    let dataSource: 'sic' | 'category_fallback';

    if (sicResult) {
        // Produto tem mapeamento de componentes - usar dados do SIC
        shadowMetrics = convertSICToShadowMetrics(sicResult, product, categoryConstants);
        dataSource = 'sic';
    } else {
        // Fallback: usar constantes da categoria
        const productFacts = convertToProductFacts(product, categoryConstants);
        shadowMetrics = computeShadowMetrics(productFacts);
        dataSource = 'category_fallback';
    }

    // Converter Product para ProductFactsV2 (para enrichedFacts)
    const productFacts = convertToProductFacts(product, categoryConstants);

    return {
        shadowMetrics,
        categoryConstants,
        enrichedFacts: {
            ...productFacts,
            computed: shadowMetrics,
        },
        sicResult: sicResult ?? undefined,
        dataSource,
    };
}

/**
 * Converte resultado do SIC para formato ShadowMetrics
 */
function convertSICToShadowMetrics(
    sicResult: SICCalculationResult,
    product: Product,
    categoryConstants: CategoryConstants
): ShadowMetrics {
    const price = product.price ?? 0;

    // Calcular TCO baseado no SIC
    const monthlyEnergyCost = (categoryConstants.avgMonthlyEnergyKwh ?? 10) * 0.75; // R$/kWh médio
    const annualEnergyCost = monthlyEnergyCost * 12;
    const tco5Years = price + (annualEnergyCost * 5) + sicResult.expectedMaintenanceCost5Years;

    // Converter índice de reparabilidade SIC-RI para score 0-10
    const maintenanceRiskScore = sicResult.repairabilityIndex.finalScore;

    return {
        estimatedLifespanYears: sicResult.estimatedLifespanYears,
        totalCostOfOwnership5Years: Math.round(tco5Years),
        maintenanceRiskScore,
        monthlyCostBreakdown: {
            energy: monthlyEnergyCost,
            consumables: 0,
            maintenanceReserve: Math.round(sicResult.expectedMaintenanceCost5Years / 60), // mensal
        },
        computedConfidence: sicResult.calculationConfidence,
        computationWarnings: sicResult.warnings,
    };
}


// ============================================
// CONVERTERS
// ============================================

/**
 * Converte um Product do catálogo para ProductFactsV2.
 * 
 * @description Mescla dados do produto com fallbacks da categoria.
 */
export function convertToProductFacts(
    product: Product,
    categoryConstants: CategoryConstants
): ProductFactsV2 {
    // Extrair preço
    const price = product.price ?? product.offers?.[0]?.price ?? 0;

    // Calcular consumo mensal de energia (se disponível nas specs)
    const monthlyEnergyKwh = extractEnergyConsumption(product, categoryConstants);

    // Montar ProductFactsV2
    const facts: ProductFactsV2 = {
        productId: product.id,
        categoryId: product.categoryId,

        // Financial Context
        financial: {
            purchasePriceBRL: price,
            monthlyEnergyKwh,
            annualDepreciationRate: categoryConstants.depreciationRate,
        },

        // Maintenance (usando fallbacks da categoria)
        maintenance: {
            avgPartsCostBRL: categoryConstants.avgSparePartBasketPriceBRL,
            avgLaborCostBRL: categoryConstants.avgLaborCostBRL,
            partsAvailability: 'widely_available', // Default
        },

        // Reliability - CORRIGIDO: usar avgLifespanYears da categoria como fallback
        reliability: {
            warrantyYears: extractWarranty(product),
            annualFailureProbability: categoryConstants.avgAnnualFailureRate,
            // Usar a vida útil média da categoria como "manufacturer claimed"
            manufacturerClaimedLifeYears: categoryConstants.avgLifespanYears,
            // Usar 'industry_average' para maior confiança (0.85 vs 0.6 de manufacturer_spec)
            reliabilitySource: 'industry_average',
            dataConfidence: 0.85,
        },

        // Usage Profile (baseado na categoria)
        usageProfile: {
            annualUsageHours: categoryConstants.avgAnnualUsageHours,
        },

        // Legacy specs (para regras contextuais)
        specs: extractSpecs(product),
    };

    return facts;
}


/**
 * Extrai consumo de energia do produto ou usa média da categoria.
 */
function extractEnergyConsumption(
    product: Product,
    categoryConstants: CategoryConstants
): number {
    // Tentar extrair de specs
    const specs = product.specs as Record<string, unknown> | undefined;

    if (specs?.monthlyEnergyKwh && typeof specs.monthlyEnergyKwh === 'number') {
        return specs.monthlyEnergyKwh;
    }

    if (specs?.consumoMensalKwh && typeof specs.consumoMensalKwh === 'number') {
        return specs.consumoMensalKwh;
    }

    // Fallback para média da categoria
    return categoryConstants.avgMonthlyEnergyKwh ?? 10;
}

/**
 * Extrai garantia do produto.
 */
function extractWarranty(product: Product): number {
    const specs = product.specs as Record<string, unknown> | undefined;

    if (specs?.warrantyYears && typeof specs.warrantyYears === 'number') {
        return specs.warrantyYears;
    }

    if (specs?.garantiaAnos && typeof specs.garantiaAnos === 'number') {
        return specs.garantiaAnos;
    }

    // Default: 1 ano
    return 1;
}

/**
 * Extrai specs genéricos para uso em regras.
 */
function extractSpecs(product: Product): Record<string, string | number | boolean | null> {
    const specs = product.specs as Record<string, unknown> | undefined;

    if (!specs) return {};

    const extracted: Record<string, string | number | boolean | null> = {};

    for (const [key, value] of Object.entries(specs)) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            extracted[key] = value;
        } else if (value === null) {
            extracted[key] = null;
        }
    }

    return extracted;
}

// ============================================
// BATCH PROCESSING
// ============================================

/**
 * Analisa múltiplos produtos de uma vez.
 * 
 * @description Útil para comparações e listagens.
 */
export function analyzeProductsOwnership(products: Product[]): Map<string, OwnershipAnalysis> {
    const results = new Map<string, OwnershipAnalysis>();

    for (const product of products) {
        results.set(product.id, analyzeProductOwnership(product));
    }

    return results;
}

// ============================================
// COMPARISON HELPERS
// ============================================

/**
 * Compara TCO entre dois produtos.
 */
export function compareTCO(
    analysisA: OwnershipAnalysis,
    analysisB: OwnershipAnalysis
): {
    cheaper: 'A' | 'B' | 'equal';
    difference: number;
    percentageDifference: number;
} {
    const tcoA = analysisA.shadowMetrics.totalCostOfOwnership5Years;
    const tcoB = analysisB.shadowMetrics.totalCostOfOwnership5Years;
    const difference = Math.abs(tcoA - tcoB);
    const avgTCO = (tcoA + tcoB) / 2;

    if (Math.abs(tcoA - tcoB) < 100) {
        return { cheaper: 'equal', difference: 0, percentageDifference: 0 };
    }

    return {
        cheaper: tcoA < tcoB ? 'A' : 'B',
        difference,
        percentageDifference: (difference / avgTCO) * 100,
    };
}

/**
 * Compara vida útil entre dois produtos.
 */
export function compareLifespan(
    analysisA: OwnershipAnalysis,
    analysisB: OwnershipAnalysis
): {
    longer: 'A' | 'B' | 'equal';
    differenceYears: number;
} {
    const lifeA = analysisA.shadowMetrics.estimatedLifespanYears;
    const lifeB = analysisB.shadowMetrics.estimatedLifespanYears;

    if (Math.abs(lifeA - lifeB) < 0.5) {
        return { longer: 'equal', differenceYears: 0 };
    }

    return {
        longer: lifeA > lifeB ? 'A' : 'B',
        differenceYears: Math.abs(lifeA - lifeB),
    };
}
