/**
 * SimplifiedPDP - Tech Specs Section
 * Renderiza ficha técnica usando native details/summary (zero-JS)
 * 
 * Migrated from useState to native HTML5 details for consistency
 */

import React from 'react';
import { PDPDataContract, TechSpec } from '../hooks/usePDPData';

interface TechSpecsSectionProps {
    data: PDPDataContract;
}

const categoryLabels: Record<string, string> = {
    limpeza: '🧹 Limpeza',
    navegacao: '🧭 Navegação',
    bateria: '🔋 Bateria',
    conectividade: '📡 Conectividade',
    base: '🏠 Base/Dock',
    dimensoes: '📐 Dimensões',
    motor: '⚙️ Motor',
    filtro: '🌀 Filtro',
    geral: '📋 Geral',
};

export function TechSpecsSection({ data }: TechSpecsSectionProps) {
    const specs = data.technicalSpecs;

    if (!specs || Object.keys(specs).length === 0) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[TechSpecsSection] Hidden: no specs for', data.product.id);
        }
        return null;
    }

    const categories = Object.entries(specs).filter(([_, items]) =>
        Array.isArray(items) && items.length > 0
    );

    if (categories.length === 0) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[TechSpecsSection] Hidden: no valid categories for', data.product.id);
        }
        return null;
    }

    return (
        <section className="pdp-tech-specs py-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                📋 Ficha Técnica Completa
            </h2>

            <div className="space-y-2">
                {categories.map(([category, items], index) => (
                    <details
                        key={category}
                        className="ct-details-soft"
                        open={index === 0} // First category open by default
                    >
                        <summary className="ct-summary">
                            <span className="ct-summary-content">
                                {categoryLabels[category] || category}
                            </span>
                            <span className="ct-chevron" aria-hidden="true">▾</span>
                        </summary>
                        <div className="ct-details-body p-0">
                            <div className="divide-y divide-gray-200">
                                {(items as TechSpec[]).map((spec, i) => (
                                    <div key={i} className="px-4 py-2 flex justify-between text-sm">
                                        <span className="text-gray-600">{spec.label}</span>
                                        <span className="font-medium text-gray-900">
                                            {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}

export default TechSpecsSection;
