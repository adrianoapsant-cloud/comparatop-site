'use client';

/**
 * @file OwnershipInsightsExpanded.tsx
 * @description Componente "Wallet-Friendly" com geolocalização automática
 * 
 * Layout simplificado:
 * - BLOCO A: Impacto no Bolso (soma simples: Preço + Gasto Luz = Custo Real)
 * - BLOCO B: Riscos e Retorno (badges visuais, não soma no total)
 * 
 * @version 3.0.0 - Wallet-Friendly com Geolocalização
 */

import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Clock,
    Wrench,
    AlertTriangle,
    DollarSign,
    Zap,
    Info,
    ChevronDown,
    ChevronUp,
    Cpu,
    CircuitBoard,
    Lightbulb,
    Battery,
    CheckCircle2,
    XCircle,
    HelpCircle,
    MapPin,
    Loader2,
    Wallet,
    TrendingDown,
} from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
import { Tooltip } from '@/components/ui/Tooltip';
import type {
    ExpandedShadowMetrics,
    TCOBreakdown,
    LifespanExplanation,
    RepairabilityMap,
    RepairabilityComponent,
} from '@/lib/scoring/types';

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

function formatPercent(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(0)}%`;
}

/**
 * Calcula o risco de manutenção como % do preço do produto
 */
function getMaintenanceRiskLevel(maintenanceCost: number, productPrice: number): {
    percentage: number;
    level: 'low' | 'medium' | 'high';
    color: string;
    bgColor: string;
    label: string;
    emoji: string;
} {
    const percentage = (maintenanceCost / productPrice) * 100;

    if (percentage < 10) {
        return {
            percentage,
            level: 'low',
            color: 'text-emerald-700 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            label: 'Manutenção Simples',
            emoji: '🟢',
        };
    }
    if (percentage <= 30) {
        return {
            percentage,
            level: 'medium',
            color: 'text-amber-700 dark:text-amber-400',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            label: 'Manutenção Média',
            emoji: '🟡',
        };
    }
    return {
        percentage,
        level: 'high',
        color: 'text-red-700 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        label: 'Risco Elevado',
        emoji: '🔴',
    };
}

// ============================================
// TARIFF BADGE COMPONENT
// ============================================

const TariffBadge = memo(function TariffBadge({
    stateCode,
    isDetecting,
    onRetry,
}: {
    stateCode: string;
    isDetecting: boolean;
    onRetry?: () => void;
}) {
    if (isDetecting) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                Detectando...
            </span>
        );
    }

    return (
        <Tooltip
            content={
                <span className="text-xs">
                    Tarifa de energia baseada no seu estado.
                    {onRetry && ' Clique para detectar novamente.'}
                </span>
            }
            position="top"
        >
            <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
                <MapPin className="w-3 h-3" />
                Tarifa {stateCode}
            </button>
        </Tooltip>
    );
});

// ============================================
// BLOCO A: IMPACTO NO BOLSO (Wallet Impact)
// ============================================

interface WalletImpactCardProps {
    purchasePrice: number;
    energyCost5Years: number;
    stateCode: string;
    isDetecting: boolean;
    onRetryDetection: () => void;
}

const WalletImpactCard = memo(function WalletImpactCard({
    purchasePrice,
    energyCost5Years,
    stateCode,
    isDetecting,
    onRetryDetection,
}: WalletImpactCardProps) {
    const totalRealCost = purchasePrice + energyCost5Years;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-blue-200 dark:border-slate-700"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    💰 Impacto no Bolso
                </h3>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
                {/* Preço do Produto */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        Preço do Produto
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatBRL(purchasePrice)}
                    </span>
                </div>

                {/* Gasto com Luz */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            + Gasto com Luz (5 anos)
                        </span>
                        <TariffBadge
                            stateCode={stateCode}
                            isDetecting={isDetecting}
                            onRetry={onRetryDetection}
                        />
                    </div>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {formatBRL(energyCost5Years)}
                    </span>
                </div>

                {/* Divider + Total */}
                <div className="border-t border-blue-200 dark:border-slate-600 pt-3">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            = Custo Real Estimado
                        </span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatBRL(totalRealCost)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nota de energia */}
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Baseado no consumo mensal e tarifa regional
            </p>
        </motion.div>
    );
});

// ============================================
// BLOCO B: RISCOS E RETORNO (Badges visuais)
// ============================================

interface RisksAndReturnCardProps {
    maintenanceCost: number;
    productPrice: number;
    residualValue: number;
}

const RisksAndReturnCard = memo(function RisksAndReturnCard({
    maintenanceCost,
    productPrice,
    residualValue,
}: RisksAndReturnCardProps) {
    const risk = getMaintenanceRiskLevel(maintenanceCost, productPrice);
    const IconComponent = risk.level === 'low' ? CheckCircle2 :
        risk.level === 'medium' ? Wrench : AlertTriangle;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    Riscos e Retorno
                </h3>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {/* Risco de Manutenção - Badge Visual */}
                <Tooltip
                    content={
                        <span className="text-xs leading-relaxed">
                            Estimativa estatística de custo com peças fora da garantia.
                            <br />
                            <strong>Não é cobrado agora</strong> – representa risco futuro.
                        </span>
                    }
                    position="top"
                    maxWidth={280}
                >
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${risk.bgColor} cursor-help`}>
                        <span className="text-base">{risk.emoji}</span>
                        <IconComponent className={`w-4 h-4 ${risk.color}`} />
                        <span className={`text-sm font-medium ${risk.color}`}>
                            {risk.label}
                        </span>
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                </Tooltip>

                {/* Valor de Revenda - Texto Simples */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <TrendingDown className="w-4 h-4" />
                    <span>
                        Valor de Revenda estimado: <strong className="text-slate-800 dark:text-slate-200">~{formatBRL(residualValue)}</strong>
                    </span>
                </div>
            </div>
        </motion.div>
    );
});

// ============================================
// TCO BREAKDOWN CARD - CRYSTAL CLEAR VERSION
// ============================================

interface TCOBreakdownCardProps {
    breakdown: TCOBreakdown;
    totalTCO: number; // Kept for compatibility but we recalculate
}

const TCOBreakdownCard = memo(function TCOBreakdownCard({ breakdown }: TCOBreakdownCardProps) {
    // Get region context for dynamic energy rate
    const { stateCode, energyRate, isDetecting, detectLocation } = useRegion();
    const [showDetails, setShowDetails] = useState(true); // Open by default for clarity

    // ========================================
    // CALCULATIONS (All visible to user)
    // ========================================

    // 1. Energia: kWh/mês × tarifa × 60 meses
    const monthlyKwh = breakdown.energyDetails?.monthlyKwh ?? 0;
    const energyCost5Years = Math.round(monthlyKwh * energyRate * 60);

    // 2. Manutenção: prob_falha × custo_reparo × anos
    const annualFailureProb = breakdown.maintenanceDetails?.annualFailureProbability ?? 0.16;
    const avgRepairCost = breakdown.maintenanceDetails?.avgRepairCost ?? 850;
    const maintenanceCost = breakdown.maintenanceCost;

    // 3. Revenda: preço × (1 - depreciação)^anos
    const depreciationRate = breakdown.depreciationRate ?? 0.15;
    const residualValue = breakdown.resaleValue ?? Math.round(breakdown.capex * Math.pow(1 - depreciationRate, 5));

    // ========================================
    // CUSTO REAL = Preço + Energia + Manutenção - Revenda
    // ========================================
    const custoReal5Anos = breakdown.capex + energyCost5Years + maintenanceCost - residualValue;

    // Diferença vs preço de etiqueta
    const diferencaVsPreco = custoReal5Anos - breakdown.capex;
    const diferencaPercent = Math.round((diferencaVsPreco / breakdown.capex) * 100);

    // Reserva mensal para Energia + Manutenção
    const monthlyEnergyCost = Math.round(energyCost5Years / 60);
    const monthlyMaintenanceReserve = Math.round(maintenanceCost / 60);
    const monthlyTotalReserve = monthlyEnergyCost + monthlyMaintenanceReserve;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 border border-blue-200 dark:border-slate-700"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    Custo Total de Propriedade
                </h3>
            </div>

            {/* Resumo Principal */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Preço de Compra</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {formatBRL(breakdown.capex)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Custo Real (5 anos)</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatBRL(custoReal5Anos)}
                    </p>
                    <p className={`text-xs mt-1 ${diferencaVsPreco > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {diferencaVsPreco > 0 ? '+' : ''}{formatBRL(diferencaVsPreco)} ({diferencaVsPreco > 0 ? '+' : ''}{diferencaPercent}% vs preço)
                    </p>
                </div>
            </div>

            {/* CÁLCULO DETALHADO - Sempre visível ou em accordion */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 mb-4 border border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-3"
                >
                    <span className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Como calculamos:
                    </span>
                    {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence initial={false}>
                    {showDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3 text-sm">
                                {/* Linha 1: Preço */}
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-600 dark:text-slate-400">Preço de Compra</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatBRL(breakdown.capex)}</span>
                                </div>

                                {/* Linha 2: + Energia */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            <Zap className="w-4 h-4 text-amber-500" />
                                            <span className="font-medium">+ Energia (5 anos)</span>
                                            <TariffBadge stateCode={stateCode} isDetecting={isDetecting} onRetry={detectLocation} />
                                        </div>
                                        <p className="text-xs text-slate-500 ml-6 mt-0.5">
                                            {monthlyKwh.toFixed(1)} kWh/mês × R$ {energyRate.toFixed(2)}/kWh × 60 meses
                                        </p>
                                    </div>
                                    <span className="font-semibold text-amber-600 dark:text-amber-400">+{formatBRL(energyCost5Years)}</span>
                                </div>

                                {/* Linha 3: + Manutenção */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            <Wrench className="w-4 h-4 text-orange-500" />
                                            <span className="font-medium">+ Reserva Manutenção</span>
                                        </div>
                                        <p className="text-xs text-slate-500 ml-6 mt-0.5">
                                            {(annualFailureProb * 100).toFixed(0)}% chance/ano × {formatBRL(avgRepairCost)} reparo × 5 anos
                                        </p>
                                    </div>
                                    <span className="font-semibold text-orange-600 dark:text-orange-400">+{formatBRL(maintenanceCost)}</span>
                                </div>

                                {/* Linha 4: - Revenda */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            <TrendingDown className="w-4 h-4 text-emerald-500" />
                                            <span className="font-medium">− Valor de Revenda</span>
                                        </div>
                                        <p className="text-xs text-slate-500 ml-6 mt-0.5">
                                            Depreciação {(depreciationRate * 100).toFixed(0)}%/ano → revenda após 5 anos
                                        </p>
                                    </div>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">−{formatBRL(residualValue)}</span>
                                </div>

                                {/* Linha Total */}
                                <div className="flex justify-between items-center pt-3 border-t-2 border-blue-200 dark:border-blue-800">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">= Custo Real (5 anos)</span>
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatBRL(custoReal5Anos)}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 💡 Dica de poupança - ESPECÍFICA */}
            <div className="px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                    <Lightbulb className="w-4 h-4 inline mr-1.5" />
                    <strong>💡 Dica:</strong> Reserve <strong>{formatBRL(monthlyTotalReserve)}/mês</strong> para cobrir:
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 ml-6 mt-1">
                    → Energia: ~{formatBRL(monthlyEnergyCost)}/mês &nbsp;•&nbsp; Manutenção: ~{formatBRL(monthlyMaintenanceReserve)}/mês
                </p>
            </div>
        </motion.div>
    );
});

// ============================================
// LIFESPAN EXPLANATION CARD
// ============================================

interface LifespanExplanationCardProps {
    explanation: LifespanExplanation;
}

const LifespanExplanationCard = memo(function LifespanExplanationCard({ explanation }: LifespanExplanationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isAboveAverage = explanation.percentageVsAverage > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
            {/* Header */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        Vida Útil Estimada
                    </h3>
                </div>

                {/* Main Value */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {explanation.years.toFixed(0)}
                    </span>
                    <span className="text-lg text-slate-500">anos</span>
                </div>

                {/* Comparison Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${isAboveAverage
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                    {isAboveAverage ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                    {formatPercent(explanation.percentageVsAverage)} vs. média ({explanation.categoryAverageYears} anos)
                </div>
            </div>

            {/* Expandable Details */}
            <div className="border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-5 py-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Por que {explanation.years.toFixed(0)} anos?
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 pb-5 space-y-4">
                                {/* Limiting Component */}
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-red-700 dark:text-red-300">
                                                Componente Limitante
                                            </p>
                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                {explanation.limitingComponent.name}
                                            </p>
                                            <p className="text-xs text-red-500 mt-1">
                                                Vida base: {explanation.calculationBreakdown.baseLifeYears} anos
                                                (90% dos aparelhos chegam lá)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Calculation Steps */}
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg space-y-2">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        📐 Cálculo (Weibull):
                                    </p>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                        <p>• Uso estimado: {explanation.usageAssumptions.dailyHours}h/dia ({explanation.usageAssumptions.annualHours.toLocaleString()}h/ano)</p>
                                        <p>• Vida base (η): {explanation.calculationBreakdown.baseLifeYears} anos (90% chegam)</p>
                                        <p>• {explanation.qualityMultipliers.brand.name}: +{((explanation.qualityMultipliers.brand.factor - 1) * 100).toFixed(0)}% → {explanation.calculationBreakdown.afterBrandMultiplier} anos</p>
                                        <p>• {explanation.qualityMultipliers.technology.name}: +{((explanation.qualityMultipliers.technology.factor - 1) * 100).toFixed(0)}% → {explanation.calculationBreakdown.finalEstimate} anos</p>
                                    </div>
                                </div>

                                {/* Usage Source */}
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Uso baseado em: {explanation.usageAssumptions.source === 'user_input' ? 'Sua configuração' : 'Média da categoria'}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
});

// ============================================
// REPAIRABILITY MAP CARD
// ============================================

interface RepairabilityMapCardProps {
    map: RepairabilityMap;
}

const getStatusIcon = (status: RepairabilityComponent['status']) => {
    switch (status) {
        case 'repairable': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        case 'moderate': return <HelpCircle className="w-5 h-5 text-amber-500" />;
        case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
    }
};

const getStatusColor = (status: RepairabilityComponent['status']) => {
    switch (status) {
        case 'repairable': return 'bg-emerald-100 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800';
        case 'moderate': return 'bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
        case 'critical': return 'bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    }
};

const getStatusEmoji = (status: RepairabilityComponent['status']) => {
    switch (status) {
        case 'repairable': return '🟢';
        case 'moderate': return '🟡';
        case 'critical': return '🔴';
    }
};

const RepairabilityMapCard = memo(function RepairabilityMapCard({ map }: RepairabilityMapCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const labelColors = {
        'Fácil Reparo': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        'Reparo Moderado': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        'Risco de Descarte': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
            {/* Header */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Wrench className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        Índice de Reparabilidade
                    </h3>
                </div>
                {/* Editorial Disclaimer - Required for legal protection */}
                <p className="text-[10px] text-slate-400 mb-3 -mt-2">
                    Índice editorial do ComparaTop (não é laudo oficial). Estimativas variam por região e assistência.
                </p>

                {/* Score and Label */}
                <div className="flex items-center gap-4 mb-3">
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                        {map.overallScore.toFixed(1)}/10
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${labelColors[map.label]}`}>
                        {map.label}
                    </div>
                </div>

                {/* Category Average Comparison - Contextualiza notas baixas */}
                {map.categoryAverage !== undefined && (
                    <div className={`mb-4 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${map.overallScore >= map.categoryAverage
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                        {map.overallScore >= map.categoryAverage ? (
                            <>
                                <TrendingUp className="w-4 h-4" />
                                <span>
                                    <strong>Acima da média</strong> da categoria ({map.categoryAverage.toFixed(1)}/10)
                                </span>
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-4 h-4 rotate-180" />
                                <span>
                                    Média da categoria: {map.categoryAverage.toFixed(1)}/10
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                        <p className="text-lg font-bold text-emerald-600">{map.summary.repairableCount}</p>
                        <p className="text-xs text-slate-500">Reparáveis</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                        <p className="text-lg font-bold text-red-600">{map.summary.criticalCount}</p>
                        <p className="text-xs text-slate-500">Críticos</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                        <p className="text-lg font-bold text-slate-600">{formatBRL(map.summary.avgRepairCost)}</p>
                        <p className="text-xs text-slate-500">Custo Médio</p>
                    </div>
                </div>
            </div>

            {/* Expandable Component List */}
            <div className="border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-5 py-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <CircuitBoard className="w-4 h-4" />
                        Ver mapa de componentes ({map.components.length})
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 pb-5 space-y-3">
                                {map.components.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className={`p-4 rounded-lg border ${getStatusColor(comp.status)}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(comp.status)}
                                                <div>
                                                    <p className="font-medium text-slate-800 dark:text-slate-200">
                                                        {comp.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Score: {comp.score}/10
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-700 dark:text-slate-300">
                                                    {formatBRL(comp.repairCost)}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {comp.partsAvailability === 'good' ? 'Peças disponíveis' :
                                                        comp.partsAvailability === 'limited' ? 'Peças limitadas' :
                                                            comp.partsAvailability === 'scarce' ? 'Peças escassas' :
                                                                'Peças descontinuadas'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Symptoms */}
                                        <div className="mt-2">
                                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                Sintomas de falha:
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {comp.symptoms.join(', ')}
                                            </p>
                                        </div>

                                        {/* Recommendation */}
                                        <p className={`mt-2 text-sm font-medium ${comp.status === 'critical'
                                            ? 'text-red-600 dark:text-red-400'
                                            : comp.status === 'repairable'
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-amber-600 dark:text-amber-400'
                                            }`}>
                                            {comp.status === 'critical' ? '⚠️' : comp.status === 'repairable' ? '✅' : '💡'} {comp.recommendation}
                                        </p>
                                    </div>
                                ))}

                                {/* Summary */}
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        💡 Resumo: {map.summary.repairableCount} de {map.summary.totalComponents} componentes têm reparo viável.
                                        {map.summary.criticalCount > 0 && (
                                            <span className="text-red-600 dark:text-red-400">
                                                {' '}{map.summary.criticalCount === 1 ? 'Há 1 componente' : `Há ${map.summary.criticalCount} componentes`} com custo de reparo que pode não compensar.
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 italic">
                                        Índice editorial ComparaTop. Custos são estimativas e variam por região/assistência.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
});

// ============================================
// MAIN COMPONENT
// ============================================

export interface OwnershipInsightsExpandedProps {
    metrics: ExpandedShadowMetrics;
    productName?: string;
}

export const OwnershipInsightsExpanded = memo(function OwnershipInsightsExpanded({
    metrics,
    productName,
}: OwnershipInsightsExpandedProps) {
    return (
        <section className="ownership-insights-expanded">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    💡 Custo Real de Propriedade
                </h2>
                {productName && (
                    <span className="text-sm text-slate-500">• {productName}</span>
                )}
            </div>

            {/* Compliance Disclaimer - Amazon PA-API Requirement */}
            <div className="mb-4 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    Preço base estimado. Sujeito a alteração no site do parceiro. Verifique o valor atual antes de comprar.
                </p>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* TCO Breakdown */}
                <TCOBreakdownCard
                    breakdown={metrics.tcoBreakdown}
                    totalTCO={metrics.totalCostOfOwnership5Years}
                />

                {/* Lifespan Explanation */}
                <LifespanExplanationCard
                    explanation={metrics.lifespanExplanation}
                />

                {/* Repairability Map - Full Width */}
                <div className="lg:col-span-2">
                    <RepairabilityMapCard
                        map={metrics.repairabilityMap}
                    />
                </div>
            </div>

            {/* Confidence Warning */}
            {metrics.computedConfidence < 0.7 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                    <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Algumas estimativas usam médias da categoria por falta de dados específicos.
                    </p>
                </motion.div>
            )}
        </section>
    );
});

export default OwnershipInsightsExpanded;
