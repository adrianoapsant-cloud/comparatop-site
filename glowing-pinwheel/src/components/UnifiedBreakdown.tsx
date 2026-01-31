'use client';

/**
 * @file UnifiedBreakdown.tsx
 * @description Componente unificado de scoring com 4 metacategorias
 * 
 * Exibe:
 * 1. Radar de 4 eixos (Performance, Usabilidade, Construção, Economia)
 * 2. Lista agrupada por metacategoria
 * 3. Destaque para "Verdades Ocultas"
 */

import { useMemo } from 'react';
import { AlertTriangle, Eye, ChevronDown } from 'lucide-react';
import type { Product } from '@/types/category';
import {
    SemanticAdapter,
    semanticAdapter,
    type UnifiedProductData,
    type Metacategory
} from '@/lib/scoring/semantic-adapter';
import { getUnifiedConfig, hasUnifiedConfig } from '@/lib/scoring/unified-configs';
import { ModuleFallback } from '@/components/pdp/ModuleFallback';

interface UnifiedBreakdownProps {
    product: Product;
    showWarnings?: boolean;
    expanded?: boolean;
    className?: string;
}

// Ícones por metacategoria
const META_ICONS: Record<Metacategory, string> = {
    PERFORMANCE: '⚡',
    USABILITY: '🎯',
    CONSTRUCTION: '🛠️',
    ECONOMY: '💰'
};

/**
 * Componente principal de breakdown unificado
 */
export function UnifiedBreakdown({
    product,
    showWarnings = true,
    expanded = true,
    className = ''
}: UnifiedBreakdownProps) {
    const data = useMemo(() => {
        const config = getUnifiedConfig(product.categoryId);
        return semanticAdapter.process(product as unknown as Record<string, unknown>, config);
    }, [product]);

    if (!data) {
        return (
            <ModuleFallback
                sectionId="unified_breakdown"
                sectionName="Análise Completa"
                status="loading"
                reason="Processando análise unificada..."
            />
        );
    }

    return (
        <div className={`unified-breakdown ${className}`}>
            {/* Header com Score Final */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Análise Completa
                    </h3>
                    <p className="text-xs text-gray-500">
                        Score baseado em Média Harmônica Ponderada
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-emerald-600">
                        {data.finalScore.toFixed(1)}
                    </span>
                    <p className="text-xs text-gray-500">Score Final</p>
                </div>
            </div>

            {/* Warnings (Verdades Ocultas Críticas) */}
            {showWarnings && data.warnings.length > 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-800 mb-1">
                                Pontos de Atenção
                            </p>
                            <ul className="text-xs text-amber-700 space-y-1">
                                {data.warnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Mini Radar Visual (4 barras horizontais) */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                    {(Object.entries(data.radarData) as [Metacategory, { score: number; label: string; color: string }][]).map(
                        ([key, value]) => (
                            <div key={key} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-gray-700">
                                        {META_ICONS[key]} {value.label}
                                    </span>
                                    <span className="font-bold" style={{ color: value.color }}>
                                        {value.score.toFixed(1)}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(value.score / 10) * 100}%`,
                                            backgroundColor: value.color
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Lista Detalhada por Metacategoria */}
            {expanded && (
                <div className="space-y-4">
                    {data.breakdownData.map((group) => (
                        <MetaCategoryGroup key={group.category} group={group} />
                    ))}
                </div>
            )}

            <p className="mt-4 text-xs text-gray-400 text-center">
                Metodologia: Média Harmônica pune notas muito baixas
            </p>
        </div>
    );
}

/**
 * Grupo de critérios por metacategoria
 */
function MetaCategoryGroup({ group }: { group: UnifiedProductData['breakdownData'][0] }) {
    const hasLowScore = group.score < 5;
    const hasHiddenTruths = group.criteria.some(c => c.isHiddenTruth);

    const bgColor = hasLowScore
        ? 'bg-red-50 border-red-200'
        : 'bg-white border-gray-200';

    return (
        <div className={`p-4 rounded-lg border ${bgColor}`}>
            {/* Header do Grupo */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span>{META_ICONS[group.category]}</span>
                    <span className="font-semibold text-gray-800">
                        {group.label}
                    </span>
                    {hasHiddenTruths && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-violet-100 text-violet-700 rounded">
                            <Eye size={10} className="inline mr-0.5" />
                            Verdade Oculta
                        </span>
                    )}
                </div>
                <span className={`text-lg font-bold ${hasLowScore ? 'text-red-600' : 'text-gray-700'}`}>
                    {group.score.toFixed(1)}
                </span>
            </div>

            {/* Lista de Critérios */}
            <div className="space-y-2">
                {group.criteria.map((criterion) => (
                    <CriterionItem key={criterion.id} criterion={criterion} />
                ))}
            </div>
        </div>
    );
}

/**
 * Item individual de critério
 */
function CriterionItem({
    criterion
}: {
    criterion: UnifiedProductData['breakdownData'][0]['criteria'][0];
}) {
    const isLow = criterion.score < 5;
    const isHidden = criterion.isHiddenTruth;

    const barColor = isLow
        ? 'bg-red-500'
        : criterion.score >= 8
            ? 'bg-emerald-500'
            : 'bg-amber-500';

    return (
        <div className={`p-2 rounded ${isHidden ? 'bg-violet-50' : ''}`}>
            <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isHidden ? 'font-medium text-violet-800' : 'text-gray-700'}`}>
                    {isHidden && <Eye size={12} className="inline mr-1 text-violet-600" />}
                    {criterion.label}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                        {criterion.valueDisplay !== 'N/A' ? criterion.valueDisplay : ''}
                    </span>
                    <span className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                        {criterion.score.toFixed(1)}
                    </span>
                </div>
            </div>

            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} rounded-full transition-all duration-300`}
                    style={{ width: `${(criterion.score / 10) * 100}%` }}
                />
            </div>

            {criterion.description && isHidden && (
                <p className="mt-1 text-xs text-violet-600 italic">
                    {criterion.description}
                </p>
            )}
        </div>
    );
}

/**
 * Badge compacto do score unificado
 */
export function UnifiedScoreBadge({
    product,
    className = ''
}: {
    product: Product;
    className?: string;
}) {
    const data = useMemo(() => {
        const config = getUnifiedConfig(product.categoryId);
        return semanticAdapter.process(product as unknown as Record<string, unknown>, config);
    }, [product]);

    if (!data) return null;

    const hasWarning = data.warnings.length > 0;

    return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
            <span
                className={`
                    px-2 py-1 text-sm font-bold rounded
                    ${hasWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}
                `}
            >
                {data.finalScore.toFixed(1)}
            </span>
            {hasWarning && (
                <AlertTriangle size={14} className="text-amber-600" />
            )}
        </div>
    );
}

export default UnifiedBreakdown;
