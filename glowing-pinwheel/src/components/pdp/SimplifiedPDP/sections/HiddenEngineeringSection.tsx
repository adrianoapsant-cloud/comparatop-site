/**
 * SimplifiedPDP - Hidden Engineering Section
 * Renderiza alerts de engenharia oculta com padrão accordion
 * 
 * Pattern: "Snackable → Deep"
 * - Top summary always visible (risk signal + first 2 items)
 * - Full list expandable via accordion
 */

import React from 'react';
import { PDPDataContract, HiddenEngineeringItem } from '../hooks/usePDPData';
import { getConfidenceLabel } from '@/lib/metrics/confidence';
import { CtDetails } from '@/components/ui/CtDetails';

interface HiddenEngineeringSectionProps {
    data: PDPDataContract;
    /** Optional: Evidence level for confidence display */
    evidenceLevel?: 'high' | 'medium' | 'low';
}

const severityConfig = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: '🔴 CRÍTICO' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: '🟡 ALERTA' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: '🔵 INFO' },
};

function getRiskSignal(items: HiddenEngineeringItem[]): { level: string; label: string; class: string } {
    const criticalCount = items.filter(i => i.severity === 'critical').length;
    const warningCount = items.filter(i => i.severity === 'warning').length;

    if (criticalCount >= 2) {
        return { level: 'high', label: 'Alto', class: 'bg-red-100 text-red-700' };
    } else if (criticalCount >= 1 || warningCount >= 3) {
        return { level: 'medium', label: 'Médio', class: 'bg-amber-100 text-amber-700' };
    } else {
        return { level: 'low', label: 'Baixo', class: 'bg-green-100 text-green-700' };
    }
}

function EngineeringItem({ item }: { item: HiddenEngineeringItem }) {
    const config = severityConfig[item.severity];
    return (
        <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${config.text}`}>{item.title}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs">{config.badge}</span>
                    <span className="text-xs text-gray-500">
                        Resolubilidade: {item.resolvability}/10
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="text-sm space-y-2">
                {item.specific && (
                    <p><strong>Específico para:</strong> {item.specific}</p>
                )}
                {item.technicalFact && (
                    <p><strong>Fato técnico:</strong> {item.technicalFact}</p>
                )}
                {item.riskAnalysis && (
                    <p><strong>Análise de risco:</strong> {item.riskAnalysis}</p>
                )}
                {item.mitigation && (
                    <p className="text-green-700"><strong>✅ Mitigação:</strong> {item.mitigation}</p>
                )}
            </div>
        </div>
    );
}

export function HiddenEngineeringSection({ data, evidenceLevel }: HiddenEngineeringSectionProps) {
    const items = data.hiddenEngineering;

    if (!items?.length) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[HiddenEngineeringSection] Hidden: no items for', data.product.id);
        }
        return null;
    }

    // Sort by severity
    const sorted = [...items].sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 };
        return order[a.severity] - order[b.severity];
    });

    const riskSignal = getRiskSignal(items);

    // Split: first 2 visible, rest in accordion
    const visibleItems = sorted.slice(0, 2);
    const hiddenItems = sorted.slice(2);

    return (
        <section className="pdp-hidden-engineering py-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
                🔍 Engenharia Oculta
            </h2>
            <p className="text-sm text-gray-500 mb-4">
                O que não está nas especificações oficiais
            </p>

            {/* Risk Signal Indicator */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskSignal.class}`}>
                    Sinal de risco: {riskSignal.label}
                </span>
                {evidenceLevel && (
                    <span className={`ct-chip ${evidenceLevel === 'high' ? 'ct-evidence--high' :
                        evidenceLevel === 'low' ? 'ct-evidence--low' : 'ct-evidence--med'
                        }`}>
                        <span className="ct-chip-label">Confiança:</span>
                        <span className="ct-chip-value">{getConfidenceLabel(evidenceLevel)}</span>
                    </span>
                )}
            </div>

            {/* Always visible: first 2 items */}
            <div className="space-y-4 mb-4">
                {visibleItems.map((item, i) => (
                    <EngineeringItem key={i} item={item} />
                ))}
            </div>

            {/* Accordion for remaining items */}
            {hiddenItems.length > 0 && (
                <CtDetails
                    title={`Ver análise completa (+${hiddenItems.length} itens)`}
                    rightBadge="Técnico"
                    badgeVariant="tech"
                    soft
                >
                    <div className="space-y-4">
                        {hiddenItems.map((item, i) => (
                            <EngineeringItem key={i} item={item} />
                        ))}
                    </div>
                </CtDetails>
            )}
        </section>
    );
}

export default HiddenEngineeringSection;
