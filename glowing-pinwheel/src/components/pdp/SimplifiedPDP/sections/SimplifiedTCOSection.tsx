'use client';

/**
 * SimplifiedTCOSection - Total Cost of Ownership from MockData
 * 
 * SIMPLIFIED: Reads all data from mockData.tco JSON
 * No complex calculations - just render what's in the mock
 * 
 * To replicate for new products:
 * 1. Add "tco" object to product's mock JSON
 * 2. Include purchasePrice, energyCost5y, maintenanceCost5y, totalCost5y
 * 3. Include lifespan with years, limitingComponent, weibullExplanation
 * 4. Include repairability with score, level, components array
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wrench, AlertTriangle, CheckCircle, Clock, Zap, DollarSign } from 'lucide-react';
import { ConfidenceBand, formatCurrencyRange, formatCurrencyValue } from '@/components/ui/ConfidenceBand';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { getConfidenceLabel } from '@/lib/metrics/confidence';
import { getCategoryConstants } from '@/data/category-constants';

// ============================================
// TYPES - Match the mockData JSON structure
// ============================================

export interface TCOMockData {
    // Costs
    purchasePrice: number;
    energyCost5y: number;
    maintenanceCost5y: number;
    totalCost5y: number;
    monthlyReserve: number;

    // Lifespan
    lifespan: {
        years: number;
        categoryAverage?: number;  // Optional - auto-fetched from category-constants.ts
        limitingComponent: string;
        limitingComponentLife: number;
        weibullExplanation?: string;
    };

    // Repairability
    repairability: {
        score: number;
        level: 'easy' | 'moderate' | 'difficult';
        categoryAverage?: number;  // Optional - auto-fetched from category-constants.ts
        components: Array<{
            name: string;
            score: number;
            price: number;
            availability: 'available' | 'limited' | 'scarce';
            failureSymptoms?: string[];
            repairAdvice?: string;
        }>;
    };
}

interface SimplifiedTCOSectionProps {
    tco: TCOMockData;
    productName: string;
    categoryId: string;
    /** Optional: TCO total range (min, max) */
    tcoTotalRange?: [number, number];
    /** Optional: TCO confidence level */
    tcoConfidence?: 'high' | 'medium' | 'low';
    /** Optional: TCO confidence note */
    tcoConfidenceNote?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function getRepairLevelColor(level: string): { bg: string; text: string; label: string } {
    switch (level) {
        case 'easy':
            return { bg: 'bg-green-100', text: 'text-green-800', label: 'Reparo Fácil' };
        case 'moderate':
            return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Reparo Moderado' };
        case 'difficult':
            return { bg: 'bg-red-100', text: 'text-red-800', label: 'Reparo Difícil' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Reparo Indefinido' };
    }
}

function getAvailabilityBadge(availability: string): { bg: string; text: string; label: string } {
    switch (availability) {
        case 'available':
            return { bg: 'bg-green-50', text: 'text-green-700', label: 'Peças disponíveis' };
        case 'limited':
            return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Peças limitadas' };
        case 'scarce':
            return { bg: 'bg-red-50', text: 'text-red-700', label: 'Peças escassas' };
        default:
            return { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Disponibilidade desconhecida' };
    }
}

function getComponentScoreColor(score: number): string {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-amber-500';
    return 'bg-red-500';
}

// ============================================
// MAIN COMPONENT
// ============================================

export function SimplifiedTCOSection({ tco, productName, categoryId, tcoTotalRange, tcoConfidence, tcoConfidenceNote }: SimplifiedTCOSectionProps) {
    const [showComponents, setShowComponents] = useState(false);
    const [showLifespanDetails, setShowLifespanDetails] = useState(false);

    const repairLevel = getRepairLevelColor(tco.repairability.level);
    // Get category average from centralized constants (fallback if not in product data)
    const categoryAvg = tco.lifespan.categoryAverage ?? getCategoryConstants(categoryId).avgLifespanYears;
    const repairCategoryAvg = tco.repairability.categoryAverage ?? 6.5; // Default repair average if not provided
    const vsAverage = tco.lifespan.years - categoryAvg;
    const vsAveragePercent = Math.round((vsAverage / categoryAvg) * 100);

    return (
        <section className="py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <h2 className="text-xl font-bold text-gray-900">
                    Custo Real de Propriedade
                </h2>
                <span className="text-sm text-gray-500">• {productName}</span>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Preço base estimado. Sujeito a alteração no site do parceiro.
            </p>

            {/* ========================================
                BLOCO A: Custo Total (Grid de 2 colunas)
               ======================================== */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Cost Breakdown Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Custo Total de Propriedade</h3>
                    </div>

                    <div className="space-y-3">
                        {/* Purchase Price */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">PREÇO DE COMPRA</span>
                            <span className="font-semibold text-gray-900">{formatBRL(tco.purchasePrice)}</span>
                        </div>

                        {/* Energy Cost */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-500" />
                                <span className="text-sm text-gray-600">+ Energia (5 anos)</span>
                            </div>
                            <span className="font-semibold text-amber-600">+{formatBRL(tco.energyCost5y)}</span>
                        </div>

                        {/* Maintenance Cost */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Wrench className="w-3 h-3 text-orange-500" />
                                <span className="text-sm text-gray-600">+ Manutenção (5 anos)</span>
                            </div>
                            <span className="font-semibold text-orange-600">+{formatBRL(tco.maintenanceCost5y)}</span>
                        </div>

                        {/* Divider + Total */}
                        <div className="border-t border-blue-200 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">= Custo Real (5 anos)</span>
                                <span className="text-xl font-bold text-blue-600">{formatBRL(tco.totalCost5y)}</span>
                            </div>

                            {/* TCO Confidence Band - Only shows if range exists */}
                            {tcoTotalRange && (
                                <div className="mt-3 pt-3 border-t border-blue-100">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                        <span>Faixa estimada</span>
                                        <span className="font-medium">{formatCurrencyRange(tcoTotalRange)}</span>
                                    </div>
                                    {tcoConfidence && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span
                                                className={`ct-chip ${tcoConfidence === 'high' ? 'ct-evidence--high' :
                                                    tcoConfidence === 'low' ? 'ct-evidence--low' : 'ct-evidence--med'
                                                    }`}
                                            >
                                                <span className="ct-chip-label">Confiança:</span>
                                                <span className="ct-chip-value">{getConfidenceLabel(tcoConfidence)}</span>
                                            </span>
                                            <InfoTooltip text={
                                                tcoConfidence === 'high'
                                                    ? 'Alta: Baseado em dados reais de preços e consumo do produto específico.'
                                                    : tcoConfidence === 'low'
                                                        ? 'Baixa: Estimativa baseada em médias da categoria. Valores podem variar.'
                                                        : 'Média: Combinação de dados reais e estimativas. Valores próximos à realidade.'
                                            } />
                                            {tcoConfidenceNote && (
                                                <span className="text-xs text-gray-500 flex-1">
                                                    {tcoConfidenceNote}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Reserve Tip */}
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 flex items-center gap-1">
                            <span className="text-lg">💡</span>
                            <strong>Dica:</strong> Reserve {formatBRL(tco.monthlyReserve)}/mês para cobrir custos
                        </p>
                    </div>
                </div>

                {/* Lifespan Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-800">Vida Útil Estimada</h3>
                    </div>

                    {/* Years */}
                    <div className="text-center mb-4">
                        <span className="text-4xl font-bold text-emerald-600">{tco.lifespan.years}</span>
                        <span className="text-xl text-gray-600 ml-1">anos</span>
                    </div>

                    {/* VS Category Average */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${vsAverage >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {vsAverage >= 0 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {vsAverage >= 0 ? '+' : ''}{vsAveragePercent}% vs. média ({categoryAvg} anos)
                    </div>

                    {/* Limiting Component */}
                    <button
                        onClick={() => setShowLifespanDetails(!showLifespanDetails)}
                        className="w-full mt-4 flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                    >
                        <span className="text-sm text-gray-700">Por que {tco.lifespan.years} anos?</span>
                        {showLifespanDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showLifespanDetails && (
                        <div className="mt-3 p-4 bg-white/60 rounded-lg space-y-3">
                            {/* Limiting Component */}
                            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-800">Componente Limitante</p>
                                    <p className="text-sm font-medium text-gray-800">{tco.lifespan.limitingComponent}</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Vida base: {tco.lifespan.limitingComponentLife} anos (90% dos aparelhos chegam lá)
                                    </p>
                                </div>
                            </div>

                            {/* Weibull Calculation - Clear explanation */}
                            {tco.lifespan.weibullExplanation && (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-semibold text-blue-800 flex items-center gap-1 mb-2">
                                        📊 Como Calculamos a Vida Útil
                                    </p>
                                    <p className="text-xs text-gray-700 leading-relaxed">
                                        {tco.lifespan.weibullExplanation}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-2 italic">
                                        Weibull: modelo estatístico padrão da indústria para confiabilidade de produtos.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ========================================
                BLOCO B: Índice de Reparabilidade
               ======================================== */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                    <Wrench className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Índice de Reparabilidade</h3>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                    Índice editorial do ComparaTop (não é laudo oficial). Estimativas variam por região e assistência.
                </p>

                {/* Score Display */}
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-gray-900">{tco.repairability.score.toFixed(1)}/10</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${repairLevel.bg} ${repairLevel.text}`}>
                        {repairLevel.label}
                    </span>
                </div>

                {/* VS Category Average */}
                <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    Média da categoria: {repairCategoryAvg.toFixed(1)}/10
                </p>

                {/* Component Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                        <span className="text-2xl font-bold text-green-600">
                            {tco.repairability.components.filter(c => c.score >= 5).length}
                        </span>
                        <p className="text-xs text-gray-600">Reparáveis</p>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                        <span className="text-2xl font-bold text-red-600">
                            {tco.repairability.components.filter(c => c.score < 5).length}
                        </span>
                        <p className="text-xs text-gray-600">Críticos</p>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                        <span className="text-lg font-bold text-gray-700">
                            {formatBRL(Math.round(
                                tco.repairability.components.reduce((sum, c) => sum + c.price, 0) /
                                tco.repairability.components.length
                            ))}
                        </span>
                        <p className="text-xs text-gray-600">Custo Médio</p>
                    </div>
                </div>

                {/* Expandable Components List */}
                <button
                    onClick={() => setShowComponents(!showComponents)}
                    className="w-full flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                >
                    <span className="text-sm font-medium text-gray-700">
                        🔧 Ver mapa de componentes ({tco.repairability.components.length})
                    </span>
                    {showComponents ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showComponents && (
                    <div className="mt-4 space-y-3">
                        {/* Sort by score: most critical (lowest) first */}
                        {[...tco.repairability.components].sort((a, b) => a.score - b.score).map((component, idx) => {
                            const availBadge = getAvailabilityBadge(component.availability);
                            return (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border ${component.score < 5
                                        ? 'bg-red-50 border-red-200'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {component.score < 5 ? (
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            )}
                                            <span className="font-medium text-gray-800">{component.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700">
                                                {formatBRL(component.price)}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${availBadge.bg} ${availBadge.text}`}>
                                                {availBadge.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score bar */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-gray-500">Score: {component.score}/10</span>
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                                            <div
                                                className={`h-full rounded-full ${getComponentScoreColor(component.score)}`}
                                                style={{ width: `${component.score * 10}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Failure symptoms */}
                                    {component.failureSymptoms && component.failureSymptoms.length > 0 && (
                                        <div className="text-xs text-gray-600 mb-1">
                                            <span className="font-medium">Sintomas de falha:</span>
                                            <p className="text-gray-500">{component.failureSymptoms.join(', ')}</p>
                                        </div>
                                    )}

                                    {/* Repair advice */}
                                    {component.repairAdvice && (
                                        <p className={`text-xs mt-1 ${component.score < 5 ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                            {component.score < 5 ? '⚠️' : '✓'} {component.repairAdvice}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default SimplifiedTCOSection;
