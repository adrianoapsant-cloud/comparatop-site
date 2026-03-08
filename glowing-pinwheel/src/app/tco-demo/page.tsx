'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquarePlus, X } from 'lucide-react';
import {
    generateMercadoLivreSearchLink,
    generateShopeeSearchLink,
    generateMagaluSearchLink,
    generateMercadoLivreDirectLink,
    generateShopeeDirectLink,
    generateMagaluDirectLink,
    generateAmazonPDPLink,
    generateAmazonSearchLink,
    appendAmazonTag
} from '@/lib/safe-links';
import { cn } from '@/lib/utils';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ConsumableItem {
    name: string;
    cost: number;
    frequency: string;
}

interface MaintenanceItem {
    component: string;
    cost: number;
    year: number;
    probability: number;
}

interface TcoResult {
    id: string;
    identifiers: {
        asin: string | null;
        ean: string | null;
        mlb_id?: string | null;
        magalu_id?: string | null;
        shopee_id?: string | null;
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
    social_links?: {
        mercadolivre?: string;
        magalu?: string;
        shopee?: string;
    };
}

interface ApiResponse {
    success: boolean;
    count: number;
    results: TcoResult[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// ─── Modal Component ─────────────────────────────────────────────────────────

function FeedbackModal({ product, onClose }: { product: TcoResult | null; onClose: () => void }) {
    const { energyRate } = useRegion();

    if (!product) return null;

    // Recalculate Energy based on User Region (Mirroring TcoCard logic)
    const horizonYears = product.tco.horizonYears || 5;
    // We infer annualKwh if not present to allow simulation (assuming default rate 0.85 if inferred)
    const annualKwh = product.details?.energy?.annual ||
        (product.tco.breakdown.energy > 0 ? product.tco.breakdown.energy / (0.85 * horizonYears) : 0);

    const initialValues = {
        acquisition: product.tco.breakdown.acquisition,
        consumables: product.tco.breakdown.consumables,
        maintenance: product.tco.breakdown.maintenance,
        opportunityCost: product.details?.opportunityCost?.cost || 0,
        energyRate: energyRate,
        residualValue: product.tco.breakdown.residualValue || 0,
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-200 z-10">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                    Fechar <X className="w-5 h-5" />
                </button>
                <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <FeedbackForm
                        contextData={{ productName: product.product.name }}
                        initialValues={initialValues}
                        calculationBasis={{
                            horizonYears,
                            annualKwh
                        }}
                    />
                </div>
            </div>

            {/* Transparency Header (Sticky) - REMOVED FROM HERE TO MOVE TO MAIN PAGE */}

        </div>
    );
}

// ─── Helper Component: Editable Currency ─────────────────────────────────────

function EditableCurrency({
    value,
    onChange,
    className,
    label,
    prefix,
    href
}: {
    value: number;
    onChange: (val: number) => void;
    className?: string;
    label?: string;
    prefix?: React.ReactNode;
    href?: string;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value.toString());

    // Sync when external value changes (unless editing)
    useEffect(() => {
        if (!isEditing) setTempValue(value.toFixed(2));
    }, [value, isEditing]);

    const handleCommit = () => {
        setIsEditing(false);
        const num = parseFloat(tempValue.replace(',', '.')); // Simple parse attempt
        if (!isNaN(num)) {
            onChange(num);
        } else {
            setTempValue(value.toFixed(2)); // Revert if invalid
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200 justify-end">
                {prefix && <span className="text-inherit mr-1">{prefix}</span>}
                <span className="text-sm text-slate-400">R$</span>
                <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleCommit}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
                    autoFocus
                    className="w-24 px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-2 ml-auto justify-end", className)}>
            <button
                onClick={() => setIsEditing(true)}
                className="text-slate-400 text-[12px] opacity-70 hover:opacity-100 hover:bg-slate-100 p-1 rounded transition-all"
                title={`Clique para editar ${label || 'o valor'}`}
            >
                ✏️
            </button>

            {href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline decoration-blue-400 underline-offset-2 transition-colors text-blue-700 hover:text-blue-800"
                    title="Verificar preço atualizado na loja"
                >
                    {prefix && <span className="mr-1">{prefix}</span>}
                    {fmt(value)}
                </a>
            ) : (
                <span
                    className="flex items-center cursor-pointer hover:bg-black/5 px-1 rounded transition-colors"
                    onClick={() => setIsEditing(true)}
                >
                    {prefix && <span className="mr-1">{prefix}</span>}
                    {fmt(value)}
                </span>
            )}
        </div>
    );
}

// ─── Card Component ──────────────────────────────────────────────────────────

interface TcoCardProps {
    item: TcoResult;
    onOpenFeedback: (item: TcoResult) => void;
}

function TcoCard({ item, onOpenFeedback }: TcoCardProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [showStores, setShowStores] = useState(false);
    const { energyRate, stateCode } = useRegion();

    // Custom overrides state
    const [customValues, setCustomValues] = useState<{
        acquisition?: number;
        consumables?: number;
        maintenance?: number;
        resale?: number;
        opportunityCost?: number;
    }>({});

    // Reset custom values when product changes
    useEffect(() => {
        setCustomValues({});
    }, [item.id]);

    // Effective Values (Custom or Original)
    const effAcquisition = customValues.acquisition ?? item.tco.breakdown.acquisition;
    const effConsumables = customValues.consumables ?? item.tco.breakdown.consumables;
    const effMaintenance = customValues.maintenance ?? item.tco.breakdown.maintenance;
    const effResale = customValues.resale ?? item.tco.breakdown.residualValue;

    // Recalculate Energy and Total based on User Region & Overrides
    const annualKwh = item.details?.energy?.annual || 0;
    const baseEnergyCost = item.tco.breakdown.energy;

    // Energy calculation
    const calculatedEnergyCost = annualKwh > 0
        ? annualKwh * item.tco.horizonYears * energyRate
        : baseEnergyCost * (energyRate / 0.85);

    // Opportunity Cost Calculation (Dynamic)
    const baseOppCost = item.details?.opportunityCost?.cost || 0;
    // If we have a custom acquisition, scale the opportunity cost proportionally
    // Unless the user has explicitly overridden the opportunity cost itself
    const derivedOppCost = (item.tco.breakdown.acquisition > 0)
        ? baseOppCost * (effAcquisition / item.tco.breakdown.acquisition)
        : baseOppCost;

    const effOpportunityCost = customValues.opportunityCost ?? derivedOppCost;

    // Dynamic Total Calculation
    const finalTotal = (effAcquisition + effConsumables + effMaintenance + calculatedEnergyCost) - effResale;
    const finalMonthly = finalTotal / (item.tco.horizonYears * 12);

    // Check if any value is modified
    const isModified = Object.keys(customValues).length > 0;

    const handleReset = () => setCustomValues({});

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative group/card">
            {isModified && (
                <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur text-slate-500 text-xs px-2 py-1 rounded shadow-sm hover:text-red-500 hover:bg-red-50 transition-all animate-in fade-in"
                >
                    ↺ Restaurar originais
                </button>
            )}

            {/* Header */}
            <div className={cn("px-6 py-4 transition-colors duration-500", isModified ? "bg-indigo-600" : "bg-gradient-to-r from-emerald-600 to-teal-600")}>
                <div className="flex items-center gap-3 text-white">
                    <span className="text-2xl">{isModified ? '⚡' : '📊'}</span>
                    <div>
                        <h2 className="text-lg font-bold">
                            {isModified ? 'Custo Simulado' : 'Custo Total de Propriedade'}
                        </h2>
                        <p className={cn("text-sm", isModified ? "text-indigo-200" : "text-emerald-100")}>
                            Projeção para {item.tco.horizonYears} anos de uso
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Produto */}
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                        {item.product.category}
                    </p>
                    <h3 className="font-semibold text-slate-800 text-xl">{item.product.name}</h3>
                    {item.product.brand && (
                        <p className="text-sm text-slate-500">{item.product.brand} {item.product.model}</p>
                    )}
                </div>

                {/* TCO Total */}
                <div className={cn("rounded-xl p-4 text-center transition-colors duration-300", isModified ? "bg-indigo-50" : "bg-gradient-to-r from-emerald-50 to-teal-50")}>
                    <p className="text-sm text-slate-600 mb-1">TCO em {item.tco.horizonYears} anos</p>
                    <p className={cn("text-3xl font-bold transition-all", isModified ? "text-indigo-700 scale-105" : "text-emerald-700")}>
                        {fmt(finalTotal)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        ≈ {fmt(finalMonthly)}/mês
                    </p>
                </div>

                {/* Breakdown Resumo */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center group/row">
                        <span className="text-slate-600">💰 Aquisição</span>
                        <div className="font-semibold text-slate-700">
                            <EditableCurrency
                                value={effAcquisition}
                                onChange={(val) => setCustomValues(prev => ({ ...prev, acquisition: val }))}
                                label="Aquisição"
                                className={customValues.acquisition !== undefined ? "text-indigo-600 bg-indigo-50" : ""}
                                href={item.affiliate.url ?? undefined}
                            />
                        </div>
                    </div>
                    {calculatedEnergyCost > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 flex items-center gap-1">
                                ⚡ Energia
                                <RegionSelector
                                    variant="compact"
                                    className="ml-1"
                                    align="left"
                                    buttonClassName="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 border border-yellow-200 px-1.5 py-0.5 h-auto text-[10px]"
                                />
                            </span>
                            <span className="font-semibold text-yellow-600">{fmt(calculatedEnergyCost)}</span>
                        </div>
                    )}
                    {(item.tco.breakdown.consumables > 0 || customValues.consumables !== undefined) && (
                        <div className="flex justify-between items-center group/row">
                            <span className="text-slate-600">📦 Consumíveis</span>
                            <div className="font-semibold text-purple-600">
                                <EditableCurrency
                                    value={effConsumables}
                                    onChange={(val) => setCustomValues(prev => ({ ...prev, consumables: val }))}
                                    label="Consumíveis"
                                    className={customValues.consumables !== undefined ? "text-purple-700 bg-purple-50" : ""}
                                />
                            </div>
                        </div>
                    )}
                    {(item.tco.breakdown.maintenance > 0 || customValues.maintenance !== undefined) && (
                        <div className="flex justify-between items-center group/row">
                            <span className="text-slate-600">🔧 Manutenção</span>
                            <div className="font-semibold text-orange-600">
                                <EditableCurrency
                                    value={effMaintenance}
                                    onChange={(val) => setCustomValues(prev => ({ ...prev, maintenance: val }))}
                                    label="Manutenção"
                                    className={customValues.maintenance !== undefined ? "text-orange-700 bg-orange-50" : ""}
                                />
                            </div>
                        </div>
                    )}
                    {/* Exposing Opportunity Cost if it exists in details */}
                    {/* Exposing Opportunity Cost if it exists in details */}
                    {item.details?.opportunityCost && item.details.opportunityCost.cost > 0 && (
                        <div className="flex justify-between items-center group/row" title="Rendimento que você deixaria de ganhar se investisse esse dinheiro">
                            <span className="text-slate-500 border-b border-dotted border-slate-300 cursor-help">📉 Custo de Oportunidade</span>
                            <div className="font-semibold text-slate-600">
                                <EditableCurrency
                                    value={effOpportunityCost}
                                    onChange={(val) => setCustomValues(prev => ({ ...prev, opportunityCost: val }))}
                                    label="Custo de Oportunidade"
                                    className={customValues.opportunityCost !== undefined ? "text-slate-700 bg-slate-50" : ""}
                                />
                            </div>
                        </div>
                    )}

                    <div className="border-t border-slate-100 my-2"></div>

                    {(item.tco.breakdown.residualValue > 0 || customValues.resale !== undefined) && (
                        <div className="flex justify-between items-center text-emerald-600 bg-emerald-50 p-2 rounded-lg group/row">
                            <span className="font-medium">🏷️ Valor de Revenda</span>
                            <div className="font-semibold">
                                <EditableCurrency
                                    value={effResale}
                                    onChange={(val) => setCustomValues(prev => ({ ...prev, resale: val }))}
                                    label="Revenda"
                                    className={customValues.resale !== undefined ? "text-emerald-700 bg-emerald-100" : ""}
                                    prefix="-"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Insights */}
                {item.insights && !isModified && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                            ⚠️ <strong>Atenção:</strong> {item.insights.recommendation}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                            <strong>Fator de risco crítico:</strong> {item.insights.limitingComponent}. É o gargalo de vida útil, o componente que limita a durabilidade a {item.insights.estimatedLifespan} anos.
                        </p>
                    </div>
                )}

                {/* Simulado Info */}
                {isModified && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 animate-in fade-in">
                        <p className="text-sm text-indigo-800 font-medium">
                            ✏️ Valores Simulados
                        </p>
                        <p className="text-xs text-indigo-600 mt-1">
                            Você personalizou esta projeção. O TCO original era de <strong>{fmt(item.tco.total + (calculatedEnergyCost - baseEnergyCost))}</strong>.
                        </p>
                    </div>
                )}

                {/* Botão Ver Detalhes */}
                {item.details && (
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-2 border-t border-slate-100"
                    >
                        {showDetails ? '▲ Ocultar detalhes' : '▼ Ver detalhes dos custos'}
                    </button>
                )}

                {/* Detalhes Expandidos */}
                {showDetails && item.details && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                        {/* Consumíveis Detalhados */}
                        {item.details.consumables && item.details.consumables.length > 0 && (
                            <div className="bg-purple-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-purple-700 mb-3">📦 Consumíveis Detalhados</h4>
                                <div className="space-y-2">
                                    {item.details.consumables.map((c, idx) => (
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
                        {item.details.maintenance && item.details.maintenance.length > 0 && (
                            <div className="bg-orange-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-orange-700 mb-3">🔧 Manutenção Esperada</h4>
                                <div className="space-y-2">
                                    {item.details.maintenance.map((m, idx) => (
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
                        {item.details.energy && (
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-semibold text-yellow-700">⚡ Energia</h4>
                                    <span className="font-bold text-yellow-600">{fmt(calculatedEnergyCost)}</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{item.details.energy.description}</p>
                                <div className="flex justify-between items-center text-sm border-t border-yellow-100 pt-2">
                                    <span className="text-yellow-800">
                                        Consumo anual: <span className="font-medium">{item.details.energy.annual} kWh</span>
                                    </span>
                                    <span className="text-yellow-700 font-medium">
                                        ≈ {fmt(item.details.energy.annual * energyRate)}/ano
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    * Tarifa {stateCode}: {fmt(energyRate)}/kWh
                                </p>
                            </div>
                        )}

                        {/* Custo de Oportunidade */}
                        {item.details.opportunityCost && (
                            <div className="bg-slate-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">📉 Custo de Oportunidade</h4>
                                <p className="text-sm text-slate-600">{item.details.opportunityCost.description}</p>
                                <p className="text-sm font-semibold text-slate-600 mt-1">
                                    {fmt(item.details.opportunityCost.cost)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Botões de Oferta ─── */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    {/* Botão Principal: Amazon */}
                    {(() => {
                        const AMAZON_TAG = 'aferio-20';
                        let amazonUrl = '';
                        const asin = item.identifiers.asin;
                        const affiliateUrl = item.affiliate?.url;

                        if (asin) {
                            amazonUrl = generateAmazonPDPLink(asin, AMAZON_TAG);
                        } else if (affiliateUrl && !affiliateUrl.includes('localhost') && !affiliateUrl.includes('B0XXXXXXXX')) {
                            amazonUrl = appendAmazonTag(affiliateUrl, AMAZON_TAG);
                        } else {
                            amazonUrl = generateAmazonSearchLink(item.product.name, AMAZON_TAG);
                        }

                        return (
                            <div className="pb-[44px]"> {/* Mobile Thumb Zone Protection */}
                                <a
                                    href={amazonUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-[#D34528] hover:bg-[#C23B20] text-white font-bold py-3.5 px-4 rounded-xl text-center transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    Conferir Preço e Estoque Amazon <span className="text-lg">↗</span>
                                </a>
                                <p className="text-center text-[11px] text-[#666] mt-2">
                                    Transação segura pela Amazon. Sem custo extra para você.
                                </p>
                            </div>
                        );
                    })()}

                    {/* Botão Secundário: Outras Lojas (Colapsável) */}
                    <div>
                        <button
                            onClick={() => setShowStores(!showStores)}
                            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-center hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            Ver em outras lojas
                            <span className={`transition-transform duration-200 ${showStores ? 'rotate-180' : ''}`}>
                                v
                            </span>
                        </button>

                        {showStores && (
                            <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1">
                                {/* Mercado Livre */}
                                {(() => {
                                    const mlbId = item.identifiers.mlb_id;
                                    const socialUrl = item.social_links?.mercadolivre;

                                    const url = socialUrl || (mlbId
                                        ? generateMercadoLivreDirectLink(mlbId, 'comparatop')
                                        : generateMercadoLivreSearchLink(item.product.name, 'comparatop', undefined, { strict: false }));

                                    return (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex justify-between items-center px-4 py-3 border-b border-slate-200 hover:bg-slate-100 transition-colors group rounded-lg"
                                        >
                                            <span className="font-medium text-slate-700">Mercado Livre</span>
                                            <span className="text-sm text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                                {mlbId ? 'Ver oferta' : 'Buscar'} <span className="text-xs">↗</span>
                                            </span>
                                        </a>
                                    );
                                })()}

                                {/* Magazine Luiza */}
                                {(() => {
                                    const magaluId = item.identifiers.magalu_id;
                                    const url = magaluId
                                        ? generateMagaluDirectLink('produto', magaluId, 'magazineaferio')
                                        : generateMagaluSearchLink(item.product.name, 'magazineaferio', { strict: false });

                                    return (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex justify-between items-center px-4 py-3 border-b border-slate-200 hover:bg-slate-100 transition-colors group rounded-lg"
                                        >
                                            <span className="font-medium text-slate-700">Magazine Luiza</span>
                                            <span className="text-sm text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                                {magaluId ? 'Ver oferta' : 'Buscar'} <span className="text-xs">↗</span>
                                            </span>
                                        </a>
                                    );
                                })()}

                                {/* Shopee */}
                                {(() => {
                                    const shopeeId = item.identifiers.shopee_id;
                                    let url = '';

                                    if (shopeeId && shopeeId.includes('.')) {
                                        const [shopId, itemId] = shopeeId.split('.');
                                        url = generateShopeeDirectLink(shopId, itemId, 'comparatop');
                                    } else {
                                        url = generateShopeeSearchLink(item.product.name, 'comparatop', { strict: false });
                                    }

                                    return (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex justify-between items-center px-4 py-3 hover:bg-slate-100 transition-colors group rounded-lg"
                                        >
                                            <span className="font-medium text-slate-700">Shopee</span>
                                            <span className="text-sm text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                                {shopeeId ? 'Ver oferta' : 'Buscar'} <span className="text-xs">↗</span>
                                            </span>
                                        </a>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/10 flex flex-col items-center gap-4">
                    <button
                        onClick={() => onOpenFeedback(item)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-500/10"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        Solicitar Produto / Sugerir Melhorias
                    </button>

                    <p className="text-xs text-slate-500">
                        * TCO estimado com base em pesquisa de mercado.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function TcoDemoContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [results, setResults] = useState<TcoResult[]>([]);
    const [suggestions, setSuggestions] = useState<TcoResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ignoreNextSearch, setIgnoreNextSearch] = useState(false);
    const [activeFeedbackProduct, setIsFeedbackOpen] = useState<TcoResult | null>(null);

    const fetchTco = async (query: string, isSuggestion = false) => {
        if (!query) {
            if (isSuggestion) setSuggestions([]);
            return;
        }

        if (!isSuggestion) {
            setIsLoading(true);
            setError(null);
            setShowSuggestions(false);
        }

        try {
            const res = await fetch(`/api/tco/lookup?q=${encodeURIComponent(query)}`);
            const data: ApiResponse = await res.json();

            if (data.success) {
                if (isSuggestion) {
                    setSuggestions(data.results);
                    setShowSuggestions(true);
                } else {
                    setResults(data.results);
                }
            } else {
                if (isSuggestion) {
                    setSuggestions([]);
                } else {
                    setError('Nenhum produto encontrado');
                    setResults([]);
                }
            }
        } catch {
            if (!isSuggestion) {
                setError('Erro ao buscar produto');
                setResults([]);
            }
        } finally {
            if (!isSuggestion) setIsLoading(false);
        }
    };

    // Debounce for valid suggestions
    useEffect(() => {
        const timer = setTimeout(() => {
            if (ignoreNextSearch) {
                setIgnoreNextSearch(false);
                return;
            }

            if (searchQuery.length >= 1) {
                fetchTco(searchQuery, true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, ignoreNextSearch]);

    useEffect(() => {
        if (initialQuery) {
            fetchTco(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Clear URL query params to keep "single url" feeling
        window.history.replaceState(null, '', '/tco-demo');
        fetchTco(searchQuery);
        setShowSuggestions(false);
    };

    const handleSelectSuggestion = (item: TcoResult) => {
        setIgnoreNextSearch(true);
        setSearchQuery(item.product.name);
        setResults([item]);
        setSuggestions([]);
        setShowSuggestions(false);
        // Clear URL query params to keep "single url" feeling
        window.history.replaceState(null, '', '/tco-demo');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            {/* Feedback Modal */}
            {/* Feedback Modal */}
            <FeedbackModal product={activeFeedbackProduct} onClose={() => setIsFeedbackOpen(null)} />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight" style={{ color: '#ffffff' }}>
                        🔍 FIPE-Eletro Universal Demo
                    </h1>
                    <p className="text-slate-400 mb-6">
                        Busque qualquer produto para ver o TCO (Custo Total de Propriedade)
                    </p>
                </div>

                {/* Search Form */}
                <div className="relative z-50">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="Digite nome do produto, ASIN ou EAN..."
                                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                spellCheck={false}
                                autoComplete="off"
                            />
                            {/* Autocomplete Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent input blur
                                                handleSelectSuggestion(s);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0 flex items-center gap-3"
                                        >
                                            {s.product.imageUrl && (
                                                <img src={s.product.imageUrl} alt="" className="w-8 h-8 object-contain rounded bg-white p-0.5" />
                                            )}
                                            <div>
                                                <p className="text-white font-medium text-sm">{s.product.name}</p>
                                                <p className="text-slate-400 text-xs">{s.product.brand} • {s.product.model}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50"
                        >
                            {isLoading ? '...' : 'Buscar'}
                        </button>
                    </form>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-slate-400 mt-4">Buscando...</p>
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Results */}
                {results.length > 0 && !isLoading && (
                    <div className="space-y-6">
                        {results.map((item) => (
                            <TcoCard
                                key={item.id}
                                item={item}
                                onOpenFeedback={(item) => setIsFeedbackOpen(item)}
                            />
                        ))}
                    </div>
                )}

                {/* Instructions */}
                {!results.length && !isLoading && !error && (
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 -z-10 relative">
                        <h2 className="text-lg font-semibold text-white mb-4">📖 Como usar</h2>
                        <ul className="space-y-2 text-slate-300">
                            <li>• Digite o nome do produto (ex: &quot;Xiaomi&quot;)</li>
                            <li>• Ou use ASIN da Amazon</li>
                            <li>• Ou use EAN/código de barras</li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <p className="text-sm text-slate-400">
                                💡 Teste: <a href="/tco-demo?q=Xiaomi" className="text-blue-400 hover:underline">?q=Xiaomi</a>
                            </p>
                        </div>
                    </div>
                )}


                <div className="mt-12 text-center text-slate-500">
                    <p className="text-xs">ComparaTop © {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
}

export default function TcoDemoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        }>
            {/* Transparency Header (Global for TCO Demo) */}
            <div className="bg-gray-100 border-b border-gray-200 py-1.5 flex items-center justify-center sticky top-0 z-[100]">
                <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
                    <span>🛡️</span>
                    Ferramenta independente mantida por leitores. Nossas análises são imparciais.
                </p>
            </div>
            <TcoDemoContent />
        </Suspense>
    );
}
