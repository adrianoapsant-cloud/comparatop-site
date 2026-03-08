'use client';

/**
 * =============================================================================
 * TCO Simulator & Debug Page
 * =============================================================================
 *
 * Fluxo de 2 etapas:
 * 1. Gerar prompt para Gemini Deep Research
 * 2. Colar resposta JSON e calcular TCO
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    TCOEngine,
    generateDeepResearchPrompt,
    type FipeEletroProduct,
    type MacroeconomicContext,
    type TcoBreakdown,
    type FipeEletroCategory,
} from '@/lib/fipe-eletro';
import {
    parseMarkdownReport,
    detectInputFormat,
    convertReportToResearchData,
} from '@/lib/fipe-eletro/parseMarkdownReport';

// =============================================================================
// TIPOS E CONSTANTES
// =============================================================================

interface SimulationResult {
    tco: TcoBreakdown;
    monthlyRealCost: number;
    yearlyRealCost: number;
    limitingComponent: {
        name: string;
        failureRate: number;
        estimatedLifeYears: number;
    } | null;
    dataConfidence: number;
    insights: {
        biggestCostDriver: string;
        breakEvenVsSticker: number | null;
        recommendation: string;
    };
    // Monetização
    bestRetailerName?: string;
    bestOfferUrl?: string;
    // Detalhamento expandido
    installationCost: number;
    shippingCost: number;
    energyCostPv: number;
    waterCostPv: number;
    gasCostPv: number;
    residualValuePv: number;
    estimatedLifespanYears: number;
    // Breakdowns para visualização
    consumablesBreakdown?: Array<{
        name: string;
        unitPrice: number;
        replacementFrequencyMonths: number;
        totalCost5Years?: number;
    }>;
    maintenanceBreakdown?: Array<{
        component: string;
        cost: number;
    }>;
    // Flag para saber se usou total anual ou itens individuais
    usedConsumablesAnnualTotal?: boolean;
    consumablesAnnualCost?: number;
}

interface ParsedResearchData {
    metadata: {
        productName: string;
        category: string;
        dataConfidence: number;
        estimated_lifespan_years?: number;
    };
    market_price_brl?: {
        lowestPrice: number | null;
        retailer?: string;
        productUrl?: string;
        best_retailer_name?: string;
        best_offer_url?: string;
        installationCost?: number | null;
        shippingCost?: number | null;
    };
    energyConsumption: {
        nominalKwhMonth: number | null;
        realKwhMonth: number | null;
        correctionFactor: number | null;
    };
    waterConsumption?: {
        litersPerCycle: number | null;
        cyclesPerMonth: number | null;
        waterTariffPerCubicMeter?: number;
    };
    gasConsumption?: {
        gasType?: 'GLP' | 'GN';
        monthlyConsumptionKg?: number | null;
        currentGasPrice?: number;
    };
    maintenanceProfile: {
        commonFailures: Array<{
            component: string;
            failureRate5Years: number | null;
            partCostMarketplace: number | null;
            laborCost: number | null;
        }>;
        repairabilityIndex: number | null;
    };
    consumables: {
        items: Array<{
            name: string;
            unitPriceOriginal: number | null;
            replacementFrequencyMonths: number | null;
        }>;
        totalAnnualCostModerate: number | null;
    };
    depreciation: {
        priceHistory: Array<{
            ageYears: number;
            averagePrice: number | null;
        }>;
        calculatedDeltaRate: number | null;
        kBrandFactor: number | null;
    };
}

/**
 * Todas as 53 categorias FIPE-Eletro, organizadas por Tier.
 */
const CATEGORY_OPTIONS: { value: string; label: string; group: string }[] = [
    // ─── Tier 1: Alto Volume, Alto Ticket (15) ──────────────────────────────────
    { value: 'tv', label: '📺 TV', group: 'Tier 1 - Tech' },
    { value: 'smartphone', label: '📱 Smartphone', group: 'Tier 1 - Tech' },
    { value: 'geladeira', label: '🧊 Geladeira', group: 'Tier 1 - Appliances' },
    { value: 'notebook', label: '💻 Notebook', group: 'Tier 1 - Tech' },
    { value: 'ar-condicionado', label: '❄️ Ar Condicionado', group: 'Tier 1 - Appliances' },
    { value: 'lavadora-roupas', label: '🧺 Lavadora de Roupas', group: 'Tier 1 - Appliances' },
    { value: 'lava-seca', label: '🧺 Lava e Seca', group: 'Tier 1 - Appliances' },
    { value: 'fogao', label: '🔥 Fogão', group: 'Tier 1 - Appliances' },
    { value: 'cooktop', label: '🔥 Cooktop', group: 'Tier 1 - Appliances' },
    { value: 'micro-ondas', label: '📻 Micro-ondas', group: 'Tier 1 - Appliances' },
    { value: 'freezer', label: '🧊 Freezer', group: 'Tier 1 - Appliances' },
    { value: 'lava-loucas', label: '🍽️ Lava-Louças', group: 'Tier 1 - Appliances' },
    { value: 'monitor', label: '🖥️ Monitor', group: 'Tier 1 - Tech' },
    { value: 'console', label: '🎮 Console', group: 'Tier 1 - Gaming' },
    { value: 'robo-aspirador', label: '🤖 Robô Aspirador', group: 'Tier 1 - Appliances' },

    // ─── Tier 2: Alto Impacto, Pareto-Friendly (15) ─────────────────────────────
    { value: 'soundbar', label: '🔊 Soundbar', group: 'Tier 2 - Audio' },
    { value: 'fone-tws', label: '🎧 Fone TWS', group: 'Tier 2 - Audio' },
    { value: 'headset-gamer', label: '🎧 Headset Gamer', group: 'Tier 2 - Gaming' },
    { value: 'caixa-som-bluetooth', label: '🔊 Caixa Bluetooth', group: 'Tier 2 - Audio' },
    { value: 'tablet', label: '📱 Tablet', group: 'Tier 2 - Tech' },
    { value: 'smartwatch', label: '⌚ Smartwatch', group: 'Tier 2 - Tech' },
    { value: 'roteador-mesh', label: '📡 Roteador Mesh', group: 'Tier 2 - Network' },
    { value: 'impressora', label: '🖨️ Impressora', group: 'Tier 2 - Network' },
    { value: 'cadeira-gamer', label: '🪑 Cadeira Gamer', group: 'Tier 2 - Gaming' },
    { value: 'gpu', label: '🎮 GPU / Placa de Vídeo', group: 'Tier 2 - PC' },
    { value: 'ssd', label: '💾 SSD', group: 'Tier 2 - PC' },
    { value: 'nobreak', label: '🔋 Nobreak', group: 'Tier 2 - Network' },
    { value: 'projetor', label: '📽️ Projetor', group: 'Tier 2 - Tech' },
    { value: 'camera', label: '📷 Câmera', group: 'Tier 2 - Tech' },
    { value: 'camera-seguranca', label: '📹 Câmera de Segurança', group: 'Tier 2 - Security' },

    // ─── Tier 3: Bons de Venda, Recorrência (23) ────────────────────────────────
    { value: 'fechadura-digital', label: '🔐 Fechadura Digital', group: 'Tier 3 - Security' },
    { value: 'streaming-device', label: '📺 Streaming Device', group: 'Tier 3 - Tech' },
    { value: 'frigobar', label: '🧊 Frigobar', group: 'Tier 3 - Appliances' },
    { value: 'adega-climatizada', label: '🍷 Adega Climatizada', group: 'Tier 3 - Appliances' },
    { value: 'purificador-agua', label: '💧 Purificador de Água', group: 'Tier 3 - Appliances' },
    { value: 'forno-embutir', label: '🔥 Forno de Embutir', group: 'Tier 3 - Appliances' },
    { value: 'coifa-depurador', label: '🌬️ Coifa/Depurador', group: 'Tier 3 - Appliances' },
    { value: 'aspirador-vertical', label: '🧹 Aspirador Vertical', group: 'Tier 3 - Appliances' },
    { value: 'air-fryer', label: '🍳 Air Fryer', group: 'Tier 3 - Appliances' },
    { value: 'cafeteira-espresso', label: '☕ Cafeteira Espresso', group: 'Tier 3 - Appliances' },
    { value: 'processador-mixer', label: '🥤 Processador/Mixer', group: 'Tier 3 - Appliances' },
    { value: 'placa-mae', label: '🔧 Placa-Mãe', group: 'Tier 3 - PC' },
    { value: 'processador-cpu', label: '🔧 Processador (CPU)', group: 'Tier 3 - PC' },
    { value: 'memoria-ram', label: '🔧 Memória RAM', group: 'Tier 3 - PC' },
    { value: 'fonte-pc', label: '🔧 Fonte PC', group: 'Tier 3 - PC' },
    { value: 'gabinete-pc', label: '🔧 Gabinete PC', group: 'Tier 3 - PC' },
    { value: 'controle-acessorio-console', label: '🎮 Controle/Acessório Console', group: 'Tier 3 - Gaming' },
    { value: 'estabilizador', label: '⚡ Estabilizador', group: 'Tier 3 - Network' },
    { value: 'ventilador-premium', label: '🌀 Ventilador Premium', group: 'Tier 3 - Appliances' },
    { value: 'climatizador', label: '💨 Climatizador', group: 'Tier 3 - Appliances' },
    { value: 'lavadora-pressao', label: '💦 Lavadora de Pressão', group: 'Tier 3 - Appliances' },
    { value: 'ferramenta-eletrica', label: '🔧 Ferramenta Elétrica', group: 'Tier 3 - Appliances' },

    // ─── Automotivo (2) ─────────────────────────────────────────────────────────
    { value: 'pneu', label: '🚗 Pneu', group: 'Automotivo' },
    { value: 'bateria-automotiva', label: '🔋 Bateria Automotiva', group: 'Automotivo' },
];

const DEFAULT_MACRO_CONTEXT: MacroeconomicContext = {
    energyTariffPerKwh: 0.85,
    currentEnergyFlag: 'amarela',
    energyFlagSurcharge: 0.02,
    discountRate: 0.08,
    selicRate: 0.1175,
    ipcaRate: 0.045,
    energyInflationRate: 0.06,
    exchangeRateUsdBrl: 5.85,
    userRegion: 'SP',
    referenceDate: new Date().toISOString().split('T')[0],
};

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

function convertResearchToProduct(
    data: ParsedResearchData,
    priceNew: number
): FipeEletroProduct {
    const failureCurve = [
        { year: 1, probability: 0.02 },
        { year: 2, probability: 0.04 },
        { year: 3, probability: 0.05 },
        { year: 5, probability: data.maintenanceProfile.commonFailures[0]?.failureRate5Years ?? 0.08 },
        { year: 7, probability: 0.12 },
        { year: 10, probability: 0.20 },
    ];

    const avgPartsCost = data.maintenanceProfile.commonFailures
        .filter(f => f.partCostMarketplace)
        .reduce((sum, f) => sum + (f.partCostMarketplace ?? 0), 0) /
        (data.maintenanceProfile.commonFailures.filter(f => f.partCostMarketplace).length || 1);

    const avgLaborCost = data.maintenanceProfile.commonFailures
        .filter(f => f.laborCost)
        .reduce((sum, f) => sum + (f.laborCost ?? 0), 0) /
        (data.maintenanceProfile.commonFailures.filter(f => f.laborCost).length || 1);

    // Consumíveis: PRIORIZA custo anual total (mais confiável para TCO)
    // Os itens individuais são usados apenas como fallback
    let consumables: Array<{
        type: 'outro';
        name: string;
        unitPrice: number;
        replacementFrequencyMonths: number;
        isOriginalPart: boolean;
    }> = [];

    // PRIORIDADE 1: Usar custo anual total se disponível (mais preciso para TCO)
    if (data.consumables.totalAnnualCostModerate && data.consumables.totalAnnualCostModerate > 0) {
        // Criar consumível sintético do custo anual total
        // Se temos R$ 300/ano, criamos um "item" de R$ 300 com frequência anual
        const annualCost = data.consumables.totalAnnualCostModerate;
        consumables = [{
            type: 'outro' as const,
            name: 'Consumíveis (kit completo)',
            unitPrice: annualCost,           // Custo anual inteiro
            replacementFrequencyMonths: 12,  // Uma vez por ano
            isOriginalPart: true,
        }];
    } else {
        // FALLBACK: Usar itens individuais extraídos apenas se não temos total anual
        const itemsWithPrice = data.consumables.items
            .filter(item => item.unitPriceOriginal && item.replacementFrequencyMonths);

        if (itemsWithPrice.length > 0) {
            consumables = itemsWithPrice.map(item => ({
                type: 'outro' as const,
                name: item.name,
                unitPrice: item.unitPriceOriginal ?? 0,
                replacementFrequencyMonths: item.replacementFrequencyMonths ?? 12,
                isOriginalPart: true,
            }));
        }
    }

    return {
        staticData: {
            fipeId: `temp-${data.metadata.category}-${Date.now()}`,
            category: data.metadata.category as FipeEletroCategory,
            costFamily: 'appliance-portable',
            priceNew,
            installationCost: 0,
            shippingCost: 0,
            nominalPowerWatts: 50,
            voltage: 'bivolt',
            energyRating: 'A',
            brand: data.metadata.productName.split(' ')[0] ?? 'Unknown',
            model: data.metadata.productName,
            yearManufactured: new Date().getFullYear(),
        },
        opex: {
            energy: {
                nominalKwhMonth: data.energyConsumption.nominalKwhMonth ?? 5,
                realKwhMonth: data.energyConsumption.realKwhMonth ?? 6,
                correctionFactor: data.energyConsumption.correctionFactor ?? 1.2,
                dailyUsageHours: 1.5,
            },
            consumables,
        },
        maintenance: {
            failureCurve,
            repairCost: {
                laborCost: avgLaborCost || 150,
                partsCost: avgPartsCost || 200,
                logisticsCost: 30,
                totalRepairCost: (avgLaborCost || 150) + (avgPartsCost || 200) + 30,
            },
            repairabilityIndex: data.maintenanceProfile.repairabilityIndex ?? 5,
            economicRepairThreshold: 0.5,
            expectedLifespanYears: 5,
        },
        qualityScoringProfile: {
            aestheticWeight: 0.15,
            functionalWeight: 0.35,
            technologicalWeight: 0.25,
            noiseWeight: 0.15,
            accessoriesWeight: 0.10,
        },
        depreciation: {
            deltaRate: data.depreciation.calculatedDeltaRate ?? 0.18,
            kCondition: 1.0,
            kBrand: data.depreciation.kBrandFactor ?? 1.0,
            kTechnology: 1.0,
            firstYearDepreciationBonus: 0.25,
            minimumResidualPercentage: 0.08,
        },
        metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dataSource: 'gemini-deep-research',
            dataConfidence: data.metadata.dataConfidence,
        },
    };
}

function findLimitingComponent(data: ParsedResearchData): SimulationResult['limitingComponent'] {
    const failures = data.maintenanceProfile.commonFailures
        .filter(f => f.failureRate5Years !== null);

    if (failures.length === 0) return null;

    const worst = failures.reduce((max, curr) =>
        (curr.failureRate5Years ?? 0) > (max.failureRate5Years ?? 0) ? curr : max
    );

    const failureRate = worst.failureRate5Years ?? 0.1;
    const estimatedLife = failureRate > 0.5 ? 3 : failureRate > 0.3 ? 4 : failureRate > 0.15 ? 5 : 7;

    return {
        name: worst.component,
        failureRate: failureRate,
        estimatedLifeYears: estimatedLife,
    };
}

// =============================================================================
// COMPONENTES UI
// =============================================================================

interface ConsumableItem {
    name: string;
    unitPrice: number;
    replacementFrequencyMonths: number;
    totalCost5Years?: number;
}

function TcoCostCard({
    priceNew,
    installationCost,
    shippingCost,
    energyCostPv,
    waterCostPv,
    gasCostPv,
    maintenanceCost,
    consumablesCost,
    consumablesBreakdown,
    maintenanceBreakdown,
    usedConsumablesAnnualTotal,
    consumablesAnnualCost,
    residualValuePv,
    totalTco,
    confidence,
    years,
    estimatedLifespanYears,
    limitingComponent,
    bestRetailerName,
    bestOfferUrl,
}: {
    priceNew: number;
    installationCost: number;
    shippingCost: number;
    energyCostPv: number;
    waterCostPv: number;
    gasCostPv: number;
    maintenanceCost: number;
    consumablesCost: number;
    consumablesBreakdown?: ConsumableItem[];
    maintenanceBreakdown?: Array<{ component: string; cost: number }>;
    usedConsumablesAnnualTotal?: boolean;
    consumablesAnnualCost?: number;
    residualValuePv: number;
    totalTco: number;
    confidence: number;
    years: number;
    estimatedLifespanYears: number;
    limitingComponent: SimulationResult['limitingComponent'];
    bestRetailerName?: string;
    bestOfferUrl?: string;
}) {
    const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    const confidenceColor = confidence >= 0.7 ? 'bg-green-500' : confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500';

    const initialInvestment = priceNew + installationCost + shippingCost;
    const operationalTotal = energyCostPv + waterCostPv + gasCostPv;
    const monthlyTco = totalTco / (years * 12);
    const percentAbove = ((totalTco / priceNew - 1) * 100);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">📊 Custo Total de Propriedade</h2>
                <p className="text-blue-100 text-sm mt-1">Projeção para {years} anos de uso</p>
            </div>

            <div className="p-6 space-y-4">
                {/* ═══ INVESTIMENTO INICIAL ═══ */}
                <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">💳 Investimento Inicial</h3>
                    <div className="flex justify-between text-slate-700">
                        <span>Preço do Produto</span>
                        <span className="font-semibold">{fmt(priceNew)}</span>
                    </div>
                    {installationCost > 0 && (
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span className="pl-4">+ Instalação</span>
                            <span>{fmt(installationCost)}</span>
                        </div>
                    )}
                    {shippingCost > 0 && (
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span className="pl-4">+ Frete</span>
                            <span>{fmt(shippingCost)}</span>
                        </div>
                    )}
                    {(installationCost > 0 || shippingCost > 0) && (
                        <div className="flex justify-between text-slate-800 font-medium border-t border-slate-100 pt-1">
                            <span>Subtotal I₀</span>
                            <span>{fmt(initialInvestment)}</span>
                        </div>
                    )}
                </div>

                {/* ═══ CUSTOS OPERACIONAIS ═══ */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">⚡ Custos Operacionais ({years} anos)</h3>
                    <div className="flex justify-between text-yellow-600">
                        <span>Energia Elétrica</span>
                        <span className="font-semibold">{fmt(energyCostPv)}</span>
                    </div>
                    {waterCostPv > 0 && (
                        <div className="flex justify-between text-cyan-600">
                            <span>Água + Esgoto</span>
                            <span className="font-semibold">{fmt(waterCostPv)}</span>
                        </div>
                    )}
                    {gasCostPv > 0 && (
                        <div className="flex justify-between text-red-500">
                            <span>Gás (GLP/GN)</span>
                            <span className="font-semibold">{fmt(gasCostPv)}</span>
                        </div>
                    )}
                    {operationalTotal !== energyCostPv && (
                        <div className="flex justify-between text-slate-800 font-medium text-sm border-t border-slate-100 pt-1">
                            <span>Subtotal Opex</span>
                            <span>{fmt(operationalTotal)}</span>
                        </div>
                    )}
                </div>

                {/* ═══ MANUTENÇÃO ═══ */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">🔧 Manutenção Corretiva</h3>
                    <div className="flex justify-between text-orange-600">
                        <span className="flex items-center gap-1">
                            Manutenção esperada
                            <span className="text-xs text-slate-400">(ponderada por probabilidade)</span>
                        </span>
                        <span className="font-semibold">{fmt(maintenanceCost)}</span>
                    </div>
                    {maintenanceBreakdown && maintenanceBreakdown.length > 0 && (
                        <div className="bg-orange-50 rounded-lg p-3 mt-2">
                            <p className="text-xs text-orange-700 font-medium mb-2">
                                💡 Custos máximos SE cada componente falhar:
                            </p>
                            <div className="space-y-1 text-sm">
                                {maintenanceBreakdown.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-orange-600">
                                        <span className="text-slate-600">↳ {item.component}</span>
                                        <span className="text-orange-500">{fmt(item.cost)}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 italic">
                                O valor esperado considera a probabilidade de cada falha ocorrer
                            </p>
                        </div>
                    )}
                </div>

                {/* ═══ CONSUMÍVEIS ═══ */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">📦 Consumíveis ({years} anos)</h3>
                    <div className="flex justify-between text-purple-600">
                        <span>Total Consumíveis</span>
                        <span className="font-semibold">{fmt(consumablesCost)}</span>
                    </div>

                    {/* Mostrar explicação quando usamos custo anual total */}
                    {usedConsumablesAnnualTotal && consumablesAnnualCost && (
                        <div className="bg-purple-50 rounded-lg p-3 mt-2">
                            <p className="text-xs text-purple-700">
                                💡 Baseado no custo anual estimado de <strong>{fmt(consumablesAnnualCost)}/ano</strong> do relatório
                            </p>
                            <p className="text-xs text-slate-500 mt-1 italic">
                                Inclui: sacos de pó, filtros, escovas, mops e outros consumíveis típicos
                            </p>
                        </div>
                    )}

                    {/* Só mostrar breakdown individual se NÃO usamos o total anual */}
                    {consumablesBreakdown && consumablesBreakdown.length > 0 && (
                        <div className="pl-3 space-y-1 text-sm">
                            {consumablesBreakdown.map((item, idx) => {
                                const annualCost = (item.unitPrice * 12) / item.replacementFrequencyMonths;
                                const totalCost = item.totalCost5Years ?? annualCost * years;
                                return (
                                    <div key={idx} className="flex justify-between text-purple-500">
                                        <span className="text-slate-500">
                                            ↳ {item.name}
                                            <span className="text-xs text-slate-400 ml-1">
                                                ({fmt(item.unitPrice)}/cada, troca a cada {item.replacementFrequencyMonths} meses)
                                            </span>
                                        </span>
                                        <span>{fmt(totalCost)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ═══ VALOR RESIDUAL ═══ */}
                {residualValuePv > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">💰 Valor Residual (Revenda)</h3>
                        <div className="flex justify-between text-green-600">
                            <span>Estimativa em {years} anos</span>
                            <span className="font-semibold">-{fmt(residualValuePv)}</span>
                        </div>
                    </div>
                )}

                {/* ═══ TOTAL TCO ═══ */}
                <div className="pt-4 border-t-2 border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900">🎯 CUSTO REAL TOTAL</span>
                        <span className="text-2xl font-bold text-blue-600">{fmt(totalTco)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-xl p-3">
                        <div>
                            <p className="text-xs text-slate-500">% vs Etiqueta</p>
                            <p className="font-bold text-slate-800">{percentAbove.toFixed(0)}%</p>
                        </div>
                        <div className="border-l border-r border-slate-200">
                            <p className="text-xs text-slate-500">Custo Mensal</p>
                            <p className="font-bold text-blue-600">{fmt(monthlyTco)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Vida Útil</p>
                            <p className="font-bold text-slate-800">{estimatedLifespanYears} anos</p>
                        </div>
                    </div>
                </div>

                {/* ═══ COMPONENTE LIMITANTE ═══ */}
                {limitingComponent && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="font-semibold text-amber-800">⚠️ Componente Limitante</p>
                        <p className="text-amber-700 text-sm mt-1">
                            <span className="font-medium">{limitingComponent.name}</span> —
                            falha esperada em ~{limitingComponent.estimatedLifeYears} anos
                            ({(limitingComponent.failureRate * 100).toFixed(0)}% de probabilidade)
                        </p>
                    </div>
                )}

                {/* ═══ CONFIANÇA DOS DADOS ═══ */}
                <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Confiança dos Dados</span>
                        <span className="font-medium">{(confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${confidenceColor} transition-all`} style={{ width: `${confidence * 100}%` }} />
                    </div>
                </div>

                {/* ═══ CTA DE MONETIZAÇÃO ═══ */}
                {bestOfferUrl && bestRetailerName && (
                    <div className="pt-4 border-t border-slate-200">
                        <a
                            href={bestOfferUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            <span>🛍️ Ver Oferta na {bestRetailerName}</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                        <p className="text-xs text-center text-slate-400 mt-2">Preço sujeito a alteração. Verifique no site.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function LifespanCard({
    estimatedYears, categoryAverage, limitingComponent,
}: {
    estimatedYears: number; categoryAverage: number; limitingComponent: SimulationResult['limitingComponent'];
}) {
    const diff = ((estimatedYears - categoryAverage) / categoryAverage) * 100;
    const isAbove = diff >= 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">⏱️ Vida Útil Estimada</h2>
            </div>
            <div className="p-6 text-center">
                <div className="text-6xl font-bold text-emerald-600">{estimatedYears}</div>
                <div className="text-xl text-slate-500 mt-1">anos</div>
                <div className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-sm font-medium ${isAbove ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {isAbove ? '↑' : '↓'} {diff.toFixed(0)}% vs média ({categoryAverage} anos)
                </div>

                {limitingComponent && (
                    <div className="mt-6 bg-slate-50 rounded-xl p-4 text-left">
                        <h3 className="font-semibold text-slate-700 mb-2">⚠️ Componente Limitante</h3>
                        <p className="text-slate-600">
                            <span className="font-bold">{limitingComponent.name}</span> ({(limitingComponent.failureRate * 100).toFixed(0)}% chance de falha em 5 anos)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function TCOSimulatorPage() {
    // ─── Step 1: Prompt Generator ──────────────────────────────────────────────
    const [productName, setProductName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0].value);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // ─── Step 2: TCO Simulation ────────────────────────────────────────────────
    const [jsonInput, setJsonInput] = useState('');
    const [priceNew, setPriceNew] = useState<number>(0);
    const [priceAutoFilled, setPriceAutoFilled] = useState(false);
    const [years, setYears] = useState<number>(0);
    const [yearsAutoFilled, setYearsAutoFilled] = useState(false);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Auto-extrai preço e vida útil do JSON quando colado.
     */
    useEffect(() => {
        if (!jsonInput.trim()) {
            setPriceAutoFilled(false);
            setYearsAutoFilled(false);
            return;
        }

        try {
            const parsed = JSON.parse(jsonInput) as ParsedResearchData;

            // Extrair preço
            const extractedPrice = parsed.market_price_brl?.lowestPrice;
            if (extractedPrice && extractedPrice > 0) {
                setPriceNew(extractedPrice);
                setPriceAutoFilled(true);
            }

            // Extrair vida útil
            const extractedLifespan = parsed.metadata?.estimated_lifespan_years;
            if (extractedLifespan && extractedLifespan > 0) {
                setYears(extractedLifespan);
                setYearsAutoFilled(true);
            }
        } catch {
            // JSON inválido, não fazer nada ainda
            setPriceAutoFilled(false);
            setYearsAutoFilled(false);
        }
    }, [jsonInput]);

    /**
     * Gera o prompt para Deep Research.
     */
    const handleGeneratePrompt = useCallback(() => {
        if (!productName.trim()) return;
        const prompt = generateDeepResearchPrompt(productName.trim(), selectedCategory);
        setGeneratedPrompt(prompt);
        setCopied(false);
    }, [productName, selectedCategory]);

    /**
     * Copia prompt para clipboard.
     */
    const handleCopyPrompt = useCallback(async () => {
        if (!generatedPrompt) return;
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert('Erro ao copiar. Selecione o texto manualmente.');
        }
    }, [generatedPrompt]);

    /**
     * Executa simulação TCO.
     */
    const handleSimulate = useCallback(() => {
        setError(null);
        setResult(null);
        setIsProcessing(true);

        try {
            // ─── Detecção Automática de Formato ─────────────────────────────────
            const inputFormat = detectInputFormat(jsonInput);
            let parsed: ParsedResearchData;

            if (inputFormat === 'json') {
                // Parse direto como JSON
                parsed = JSON.parse(jsonInput) as ParsedResearchData;
            } else {
                // Parse do relatório Markdown
                const reportData = parseMarkdownReport(jsonInput);
                parsed = convertReportToResearchData(reportData) as unknown as ParsedResearchData;

                // Debug: mostrar o que foi extraído
                console.log('=== PARSER DEBUG ===');
                console.log('Preço:', reportData.market_price_brl.lowestPrice);
                console.log('Vida Útil:', reportData.metadata.estimated_lifespan_years);
                console.log('Energia (kWh/mês):', reportData.energyConsumption.nominalKwhMonth, '-', reportData.energyConsumption.realKwhMonth);
                console.log('Consumíveis - items:', reportData.consumables.items);
                console.log('Consumíveis - totalAnual:', reportData.consumables.totalAnnualCostModerate);
                console.log('Manutenção:', reportData.maintenanceProfile.commonFailures);
                console.log('TCO Tabela:', reportData.tcoSummary);
                console.log('==================');

                // Auto-preencher campos se encontrados no relatório
                if (reportData.market_price_brl.lowestPrice && priceNew === 0) {
                    setPriceNew(reportData.market_price_brl.lowestPrice);
                }
                if (reportData.metadata.estimated_lifespan_years && years === 0) {
                    setYears(reportData.metadata.estimated_lifespan_years);
                }
            }

            if (!parsed.metadata?.productName) throw new Error('Não foi possível extrair o nome do produto do relatório');
            if (!parsed.energyConsumption?.realKwhMonth && !parsed.energyConsumption?.nominalKwhMonth) {
                throw new Error('Não foi possível extrair dados de consumo energético do relatório');
            }

            // Extrair preço diretamente do JSON (evita problema de duplo clique com state desatualizado)
            const effectivePrice = parsed.market_price_brl?.lowestPrice
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                || (parsed as any).tcoSummary?.acquisitionCost
                || priceNew;

            if (effectivePrice <= 0) {
                throw new Error('Não foi possível extrair o preço do produto. Preencha manualmente o campo "Preço de Aquisição".');
            }

            const product = convertResearchToProduct(parsed, effectivePrice);

            console.log('=== PRODUCT DEBUG ===');
            console.log('product.opex.consumables:', product.opex.consumables);
            console.log('product.opex.energy:', product.opex.energy);
            console.log('product.category:', product.staticData.category);
            console.log('======================');

            // ─── BYPASS: Se tcoSummary presente, usar valores diretos ───────────
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tcoSummaryFromJson = (parsed as any).tcoSummary;
            const hasTcoSummary = tcoSummaryFromJson && (
                tcoSummaryFromJson.tcoFinal ||
                tcoSummaryFromJson.tcoTotal ||  // Parser usa tcoTotal
                tcoSummaryFromJson.consumablesCost5Years ||
                tcoSummaryFromJson.maintenanceCost5Years
            );

            let summary: { tco: TcoBreakdown; monthlyRealCost: number; yearlyRealCost: number; insights: { biggestCostDriver: string; breakEvenVsSticker: number | null; recommendation: string } };

            if (hasTcoSummary) {
                // MODO DIRETO: Usar valores exatos do JSON
                console.log('=== USANDO TCO SUMMARY DIRETO ===');
                console.log('tcoSummary:', tcoSummaryFromJson);

                // Aceita ambos: tcoFinal (JSON manual) ou tcoTotal (parser)
                const totalTco = tcoSummaryFromJson.tcoFinal ?? tcoSummaryFromJson.tcoTotal ?? tcoSummaryFromJson.tcoNominal ?? 0;

                const directTco: TcoBreakdown = {
                    initialInvestment: tcoSummaryFromJson.acquisitionCost ?? effectivePrice,
                    operationalCostPv: (tcoSummaryFromJson.energyCost5Years ?? 0) + (tcoSummaryFromJson.consumablesCost5Years ?? 0),
                    maintenanceCostPv: tcoSummaryFromJson.maintenanceCost5Years ?? 0,
                    consumablesCostPv: tcoSummaryFromJson.consumablesCost5Years ?? 0,
                    residualValuePv: tcoSummaryFromJson.residualValue ?? 0,
                    disposalCost: 0,
                    totalTco: totalTco,
                    monthlyTcoAverage: tcoSummaryFromJson.monthlyEffectiveCost ?? (totalTco / (years * 12)),
                };

                summary = {
                    tco: directTco,
                    monthlyRealCost: tcoSummaryFromJson.monthlyEffectiveCost ?? (directTco.totalTco / (years * 12)),
                    yearlyRealCost: directTco.totalTco / years,
                    insights: {
                        biggestCostDriver: 'Aquisição',
                        breakEvenVsSticker: null,
                        recommendation: `TCO calculado diretamente do relatório: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(directTco.totalTco)} em ${years} anos.`,
                    },
                };
            } else {
                // MODO CALCULADO: Usar TCO Engine
                const engine = new TCOEngine({ product, macro: DEFAULT_MACRO_CONTEXT, horizonYears: years });
                summary = engine.generateSummary();
            }

            console.log('=== TCO SUMMARY DEBUG ===');
            console.log('consumablesCostPv:', summary.tco.consumablesCostPv);
            console.log('maintenanceCostPv:', summary.tco.maintenanceCostPv);
            console.log('operationalCostPv:', summary.tco.operationalCostPv);
            console.log('totalTco:', summary.tco.totalTco);
            console.log('=========================');

            // Calcular custos separados de água e gás
            const waterCostPv = parsed.waterConsumption?.litersPerCycle && parsed.waterConsumption?.cyclesPerMonth
                ? (parsed.waterConsumption.litersPerCycle * parsed.waterConsumption.cyclesPerMonth * 12 * years / 1000) * (parsed.waterConsumption.waterTariffPerCubicMeter ?? 12.5)
                : 0;

            const gasCostPv = parsed.gasConsumption?.monthlyConsumptionKg
                ? parsed.gasConsumption.monthlyConsumptionKg * 12 * years * ((parsed.gasConsumption.currentGasPrice ?? 110) / 13) // Preço por kg
                : 0;

            const installationCost = parsed.market_price_brl?.installationCost ?? 0;
            const shippingCost = parsed.market_price_brl?.shippingCost ?? 0;
            const estimatedLifespanYears = parsed.metadata?.estimated_lifespan_years ?? years;

            // Calcular custo de energia - usar valor direto se disponível no tcoSummary
            let energyCostPv: number;
            if (hasTcoSummary && tcoSummaryFromJson.energyCost5Years) {
                energyCostPv = tcoSummaryFromJson.energyCost5Years;
            } else {
                // Calcular custo de energia separado (sem água/gás que já foram calculados)
                energyCostPv = summary.tco.operationalCostPv - summary.tco.consumablesCostPv - waterCostPv - gasCostPv;
            }

            // Detectar se usamos custo anual total ou itens individuais
            const usedConsumablesAnnualTotal = (parsed.consumables?.totalAnnualCostModerate ?? 0) > 0;
            const consumablesAnnualCost = parsed.consumables?.totalAnnualCostModerate ?? null;

            // Só extrair breakdown de consumíveis se NÃO usamos o total anual
            // (porque o breakdown individual está inconsistente com o total)
            const consumablesBreakdown = usedConsumablesAnnualTotal
                ? undefined  // Não mostrar breakdown quando usamos total anual
                : parsed.consumables?.items
                    ?.filter((item: { name: string; unitPriceOriginal?: number | null; replacementFrequencyMonths?: number | null }) => item.unitPriceOriginal && item.replacementFrequencyMonths)
                    .map((item: { name: string; unitPriceOriginal?: number | null; replacementFrequencyMonths?: number | null }) => ({
                        name: item.name,
                        unitPrice: item.unitPriceOriginal ?? 0,
                        replacementFrequencyMonths: item.replacementFrequencyMonths ?? 12,
                    })) ?? [];

            const maintenanceBreakdown = parsed.maintenanceProfile?.commonFailures
                ?.filter((f: { component?: string; partCostMarketplace?: number | null; laborCost?: number | null }) => f.partCostMarketplace || f.laborCost)
                .map((f: { component?: string; partCostMarketplace?: number | null; laborCost?: number | null }) => ({
                    component: f.component ?? 'Componente',
                    cost: (f.partCostMarketplace ?? 0) + (f.laborCost ?? 0),
                })) ?? [];

            setResult({
                tco: summary.tco,
                monthlyRealCost: summary.monthlyRealCost,
                yearlyRealCost: summary.yearlyRealCost,
                limitingComponent: findLimitingComponent(parsed),
                dataConfidence: parsed.metadata.dataConfidence,
                insights: summary.insights,
                // Monetização: captura do relatório/JSON
                bestRetailerName: parsed.market_price_brl?.best_retailer_name || parsed.market_price_brl?.retailer,
                bestOfferUrl: parsed.market_price_brl?.best_offer_url || parsed.market_price_brl?.productUrl,
                // Detalhamento expandido
                installationCost,
                shippingCost,
                energyCostPv: Math.max(0, energyCostPv),
                waterCostPv,
                gasCostPv,
                residualValuePv: summary.tco.residualValuePv,
                estimatedLifespanYears,
                // Breakdowns
                consumablesBreakdown,
                maintenanceBreakdown,
                // Flags de transparência
                usedConsumablesAnnualTotal,
                consumablesAnnualCost: consumablesAnnualCost ?? undefined,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao processar entrada (JSON ou Markdown)');
        } finally {
            setIsProcessing(false);
        }
    }, [jsonInput, priceNew, years]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900">🧪 FIPE-Eletro Simulator</h1>
                    <p className="text-slate-500 text-sm mt-1">Gere prompts de pesquisa e calcule o TCO real</p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                {/* ═══════════════════════════════════════════════════════════════════
            STEP 1: GERADOR DE PROMPT
        ═══════════════════════════════════════════════════════════════════ */}
                <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">STEP 1</span>
                            Gere o Prompt de Pesquisa
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1">
                            Crie um prompt técnico para colar no Gemini Deep Research
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nome do Produto ou ASIN
                                </label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Ex: Eufy X10 Pro Omni"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Categoria FIPE
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {/* Gera optgroups dinamicamente dos grupos únicos em CATEGORY_OPTIONS */}
                                    {[...new Set(CATEGORY_OPTIONS.map(opt => opt.group))].map((group) => (
                                        <optgroup key={group} label={group}>
                                            {CATEGORY_OPTIONS
                                                .filter((opt) => opt.group === group)
                                                .map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGeneratePrompt}
                            disabled={!productName.trim()}
                            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            ✨ Gerar Prompt para Gemini
                        </button>

                        {/* Generated Prompt Output */}
                        {generatedPrompt && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Prompt Gerado (copie e cole no Gemini)
                                    </label>
                                    <button
                                        onClick={handleCopyPrompt}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${copied
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {copied ? '✓ Copiado!' : '📋 Copiar'}
                                    </button>
                                </div>
                                <textarea
                                    readOnly
                                    value={generatedPrompt}
                                    className="w-full h-64 px-4 py-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl resize-none"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════
            STEP 2: SIMULADOR TCO
        ═══════════════════════════════════════════════════════════════════ */}
                <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">STEP 2</span>
                            Cole a Resposta do Gemini
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Após pesquisar, cole o JSON retornado aqui
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Price Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Preço Novo (R$)
                                    {priceAutoFilled && (
                                        <span className="ml-2 text-xs text-green-600 font-normal">✓ Preenchido do JSON</span>
                                    )}
                                </label>
                                <input
                                    type="number"
                                    value={priceNew || ''}
                                    onChange={(e) => {
                                        setPriceNew(Number(e.target.value));
                                        setPriceAutoFilled(false);
                                    }}
                                    placeholder="Será preenchido automaticamente do JSON"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${priceAutoFilled ? 'border-green-400 bg-green-50' : 'border-slate-300'
                                        }`}
                                />
                            </div>

                            {/* Vida Útil Input (Auto-preenchido) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Vida Útil Estimada
                                    {yearsAutoFilled && (
                                        <span className="ml-2 text-xs text-green-600 font-normal">✓ Preenchido do JSON</span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={years || ''}
                                        readOnly
                                        placeholder="Será preenchido do JSON"
                                        className={`w-full px-4 py-2 border rounded-lg bg-slate-50 cursor-not-allowed ${yearsAutoFilled ? 'border-green-400 bg-green-50' : 'border-slate-300'
                                            }`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">anos</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Definido pelo Gemini com base na categoria do produto
                                </p>
                            </div>
                        </div>

                        {/* Report/JSON Textarea */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                📋 Cole o Relatório ou JSON do Gemini
                                <span className="ml-2 text-xs font-normal text-blue-600">
                                    (Detecta formato automaticamente)
                                </span>
                            </label>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                className="w-full h-48 px-4 py-3 font-mono text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                placeholder='Cole aqui o relatório completo do Gemini...

O sistema detecta automaticamente se é:
  📄 Relatório em Markdown (texto narrativo)
  💻 JSON estruturado ({ "metadata": { ... } })'
                            />
                        </div>

                        {/* Simulate Button */}
                        <button
                            onClick={handleSimulate}
                            disabled={isProcessing || !jsonInput.trim()}
                            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isProcessing ? '⏳ Calculando...' : '⚡ Simular TCO'}
                        </button>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                                <p className="font-semibold">❌ Erro</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════
            RESULTS
        ═══════════════════════════════════════════════════════════════════ */}
                {result && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TcoCostCard
                            priceNew={priceNew}
                            installationCost={result.installationCost}
                            shippingCost={result.shippingCost}
                            energyCostPv={result.energyCostPv}
                            waterCostPv={result.waterCostPv}
                            gasCostPv={result.gasCostPv}
                            maintenanceCost={result.tco.maintenanceCostPv}
                            consumablesCost={result.tco.consumablesCostPv}
                            consumablesBreakdown={result.consumablesBreakdown}
                            maintenanceBreakdown={result.maintenanceBreakdown}
                            usedConsumablesAnnualTotal={result.usedConsumablesAnnualTotal}
                            consumablesAnnualCost={result.consumablesAnnualCost}
                            residualValuePv={result.residualValuePv}
                            totalTco={result.tco.totalTco}
                            confidence={result.dataConfidence}
                            years={years}
                            estimatedLifespanYears={result.estimatedLifespanYears}
                            limitingComponent={result.limitingComponent}
                            bestRetailerName={result.bestRetailerName}
                            bestOfferUrl={result.bestOfferUrl}
                        />

                        <LifespanCard
                            estimatedYears={result.limitingComponent?.estimatedLifeYears ?? 5}
                            categoryAverage={6.5}
                            limitingComponent={result.limitingComponent}
                        />

                        {/* Insight */}
                        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-800 mb-3">💡 Insight do Motor</h3>
                            <p className="text-slate-600">{result.insights.recommendation}</p>
                            <p className="text-sm text-slate-500 mt-2">
                                Maior driver de custo: <span className="font-medium">{result.insights.biggestCostDriver}</span>
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
