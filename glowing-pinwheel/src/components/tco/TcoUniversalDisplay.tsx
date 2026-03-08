'use client';

/**
 * ============================================================================
 * TcoUniversalDisplay - Componente Universal de Exibição de TCO
 * ============================================================================
 * 
 * Usado para exibir TCO de qualquer categoria de produto (53+ categorias).
 * Inclui botão Amazon com link de afiliado.
 */

import { useState } from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface ConsumableItem {
    name: string;
    cost: number;
    frequency: string;
}

export interface MaintenanceItem {
    component: string;
    cost: number;
    year: number;
    probability: number;
}

export interface TcoProductData {
    id: string;
    identifiers: {
        asin: string | null;
        ean: string | null;
    };
    product: {
        name: string;
        brand: string | null;
        model: string | null;
        category: string;
        imageUrl: string | null;
    };
    affiliate: {
        retailer: string;
        url: string | null;
        price: number;
    };
    tco: {
        horizonYears: number;
        breakdown: {
            acquisition: number;
            energy: number;
            consumables: number;
            maintenance: number;
            residualValue: number;
        };
        total: number;
        monthlyAverage: number;
    };
    details?: {
        energy?: { description: string; annual: number };
        consumables?: ConsumableItem[];
        maintenance?: MaintenanceItem[];
        opportunityCost?: { description: string; cost: number };
    };
    insights?: {
        limitingComponent: string;
        estimatedLifespan: number;
        recommendation: string;
    };
}

interface TcoUniversalDisplayProps {
    data: TcoProductData;
    showAffiliateButton?: boolean;
    affiliateTag?: string;
    compact?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
        'robo-aspirador': 'Robô Aspirador',
        'smartphone': 'Smartphone',
        'notebook': 'Notebook',
        'tv': 'TV',
        'geladeira': 'Geladeira',
        'lavadora-roupas': 'Lavadora',
        'ar-condicionado': 'Ar Condicionado',
        'pneu': 'Pneu',
        'air-fryer': 'Air Fryer',
    };
    return labels[category] || category;
};

// ─── Componente ──────────────────────────────────────────────────────────────

export function TcoUniversalDisplay({
    data,
    showAffiliateButton = true,
    affiliateTag = process.env.NEXT_PUBLIC_AMAZON_TAG || 'aferio-20',
    compact = false
}: TcoUniversalDisplayProps) {
    const [showDetails, setShowDetails] = useState(false);

    const { product, affiliate, tco, details, insights } = data;

    // Gerar URL de afiliado com lógica robusta
    let affiliateUrl = affiliate.url;

    // Se não tiver URL mas tiver ASIN (e não for placeholder), gera direto
    if ((!affiliateUrl || affiliateUrl.includes('B0XXXXXXXX')) && data.identifiers.asin && !data.identifiers.asin.includes('B0XXXXXXXX')) {
        affiliateUrl = `https://www.amazon.com.br/dp/${data.identifiers.asin}?tag=${affiliateTag}`;
    }

    // Se ainda for placeholder, anula para não exibir link quebrado
    if (affiliateUrl?.includes('B0XXXXXXXX')) {
        affiliateUrl = null;
    }
    // Se já tiver URL da Amazon, garante que a tag está correta
    else if (affiliateUrl && (affiliateUrl.includes('amazon.com') || affiliateUrl.includes('amzn.to'))) {
        try {
            const urlObj = new URL(affiliateUrl);
            urlObj.searchParams.set('tag', affiliateTag);
            affiliateUrl = urlObj.toString();
        } catch (e) {
            // Silently fail if invalid URL
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                        <h2 className="text-lg font-bold">Custo Total de Propriedade</h2>
                        <p className="text-emerald-100 text-sm">
                            Projeção para {tco.horizonYears} anos de uso
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Produto */}
                <div className="flex items-center gap-4">
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-contain rounded-lg bg-slate-50"
                        />
                    )}
                    <div>
                        {/* <p className="text-xs text-slate-400 uppercase tracking-wide">
                            {getCategoryLabel(product.category)}
                        </p> */}
                        <h3 className="font-semibold text-slate-800 text-lg md:text-xl leading-tight">{product.name}</h3>
                        {product.brand && (
                            <p className="text-sm text-slate-500">{product.brand} {product.model}</p>
                        )}
                    </div>
                </div>

                {/* TCO Total */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-slate-600 mb-1">TCO em {tco.horizonYears} anos</p>
                    <p className="text-3xl font-bold text-emerald-700">{fmt(tco.total)}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        ≈ {fmt(tco.monthlyAverage)}/mês
                    </p>
                </div>

                {/* Breakdown Resumo */}
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-slate-600">💰 Aquisição</span>
                        <span className="font-semibold">{fmt(tco.breakdown.acquisition)}</span>
                    </div>
                    {tco.breakdown.energy > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-600">⚡ Energia</span>
                            <span className="font-semibold text-yellow-600">{fmt(tco.breakdown.energy)}</span>
                        </div>
                    )}
                    {tco.breakdown.consumables > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-600">📦 Consumíveis</span>
                            <span className="font-semibold text-purple-600">{fmt(tco.breakdown.consumables)}</span>
                        </div>
                    )}
                    {tco.breakdown.maintenance > 0 && (
                        <div className="flex justify-between">
                            <span className="text-slate-600">🔧 Manutenção</span>
                            <span className="font-semibold text-orange-600">{fmt(tco.breakdown.maintenance)}</span>
                        </div>
                    )}
                    {tco.breakdown.residualValue > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>💵 Valor Residual</span>
                            <span className="font-semibold">-{fmt(tco.breakdown.residualValue)}</span>
                        </div>
                    )}
                </div>

                {/* Insights */}
                {insights && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                            ⚠️ <strong>Atenção:</strong> {insights.recommendation}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                            Componente limitante: {insights.limitingComponent} |
                            Vida útil estimada: {insights.estimatedLifespan} anos
                        </p>
                    </div>
                )}

                {/* Botão Ver Detalhes */}
                {details && !compact && (
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-2 border-t border-slate-100"
                    >
                        {showDetails ? '▲ Ocultar detalhes' : '▼ Ver detalhes dos custos'}
                    </button>
                )}

                {/* Detalhes Expandidos */}
                {showDetails && details && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                        {/* Consumíveis Detalhados */}
                        {details.consumables && details.consumables.length > 0 && (
                            <div className="bg-purple-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-purple-700 mb-3">📦 Consumíveis Detalhados</h4>
                                <div className="space-y-2">
                                    {details.consumables.map((c, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                {c.name} <span className="text-slate-400">({c.frequency})</span>
                                            </span>
                                            <span className="font-medium text-purple-600">{fmt(c.cost)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Manutenção Detalhada */}
                        {details.maintenance && details.maintenance.length > 0 && (
                            <div className="bg-orange-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-orange-700 mb-3">🔧 Manutenção Esperada</h4>
                                <div className="space-y-2">
                                    {details.maintenance.map((m, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                {m.component}
                                                <span className="text-slate-400 ml-1">
                                                    (ano {m.year}{m.probability < 1 ? `, ${Math.round(m.probability * 100)}% chance` : ''})
                                                </span>
                                            </span>
                                            <span className="font-medium text-orange-600">{fmt(m.cost)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Energia */}
                        {details.energy && (
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-yellow-700 mb-2">⚡ Energia</h4>
                                <p className="text-sm text-slate-600">{details.energy.description}</p>
                                <p className="text-sm text-yellow-600 mt-1">
                                    Consumo anual: {details.energy.annual} kWh
                                </p>
                            </div>
                        )}

                        {/* Custo de Oportunidade */}
                        {details.opportunityCost && (
                            <div className="bg-slate-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">📉 Custo de Oportunidade</h4>
                                <p className="text-sm text-slate-600">{details.opportunityCost.description}</p>
                                <p className="text-sm font-semibold text-slate-600 mt-1">
                                    {fmt(details.opportunityCost.cost)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Botão Amazon Afiliado */}
                {showAffiliateButton && affiliateUrl && (
                    <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#FF9900] hover:bg-[#FF8C00] text-white font-bold py-3 px-4 rounded-xl text-center transition-colors shadow-lg hover:shadow-xl"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M.045 18.02c.07-.057.18-.087.3-.087.18 0 .35.06.47.18.12.12.18.3.18.5 0 .18-.07.35-.18.47-.12.12-.29.18-.47.18-.12 0-.23-.03-.3-.1-.07-.06-.11-.15-.11-.27v-.05c0-.12.04-.21.11-.28l.01-.01c.07-.06.18-.1.3-.1.12 0 .23.04.3.1l.01.01c.07.07.11.16.11.28v.05c0 .18-.07.35-.18.47-.12.12-.29.18-.47.18-.18 0-.35-.06-.47-.18-.12-.12-.18-.29-.18-.47 0-.2.06-.38.18-.5.1-.12.24-.18.42-.18z" />
                            </svg>
                            Ver na Amazon por {fmt(affiliate.price)}
                        </span>
                    </a>
                )}

                {/* Disclaimer */}
                <p className="text-xs text-slate-400 text-center">
                    * TCO estimado com base em pesquisa de mercado. Valores podem variar.
                </p>
            </div>
        </div>
    );
}

export default TcoUniversalDisplay;
