'use client';

/**
 * @file OwnershipInsights.tsx
 * @description Componente "Wallet-Friendly" para exibir TCO inteligente
 * 
 * Layout simplificado com dois blocos:
 * - BLOCO A: Impacto no Bolso (destaque principal)
 * - BLOCO B: Riscos e Retorno (informações secundárias)
 * 
 * @version 2.0.0 - Reativo com geolocalização automática
 */

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Loader2,
    Wallet,
    Zap,
    Wrench,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Info,
    RefreshCw,
} from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
import type { ShadowMetrics } from '@/lib/scoring/types';
import type { CategoryConstants } from '@/data/category-constants';
import { Tooltip } from '@/components/ui/Tooltip';

// ============================================
// TYPES
// ============================================

export interface OwnershipInsightsProps {
    /** Preço de compra do produto (R$) */
    purchasePrice: number;

    /** Métricas calculadas pelo Shadow Engine */
    shadowMetrics: ShadowMetrics;

    /** Constantes da categoria (para comparação) */
    categoryConstants: CategoryConstants;

    /** Consumo mensal de energia (kWh) */
    energyKwhMonth?: number;

    /** Nome do produto */
    productName?: string;

    /** Mostrar versão compacta */
    compact?: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formata valor em BRL
 */
function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
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
// SUB-COMPONENTS
// ============================================

/**
 * Badge de Tarifa com estado detectado
 */
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

/**
 * BLOCO A: Impacto no Bolso
 */
const WalletImpactCard = memo(function WalletImpactCard({
    purchasePrice,
    energyCost5Years,
    stateCode,
    isDetecting,
    onRetryDetection,
}: {
    purchasePrice: number;
    energyCost5Years: number;
    stateCode: string;
    isDetecting: boolean;
    onRetryDetection: () => void;
}) {
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

                {/* Divider */}
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

/**
 * Badge de Risco de Manutenção
 */
const MaintenanceRiskBadge = memo(function MaintenanceRiskBadge({
    maintenanceCost,
    productPrice,
}: {
    maintenanceCost: number;
    productPrice: number;
}) {
    const risk = getMaintenanceRiskLevel(maintenanceCost, productPrice);
    const IconComponent = risk.level === 'low' ? CheckCircle :
        risk.level === 'medium' ? Wrench : AlertTriangle;

    return (
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
    );
});

/**
 * BLOCO B: Riscos e Retorno
 */
const RisksAndReturnCard = memo(function RisksAndReturnCard({
    maintenanceCost,
    productPrice,
    residualValue,
}: {
    maintenanceCost: number;
    productPrice: number;
    residualValue: number;
}) {
    const risk = getMaintenanceRiskLevel(maintenanceCost, productPrice);

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
                {/* Reserva de Manutenção - Valor + Badge */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-slate-500" />
                        <Tooltip
                            content={
                                <span className="text-xs leading-relaxed">
                                    Estimativa estatística de custo com peças fora da garantia.
                                    <br />
                                    <strong>Não é cobrado agora</strong> – representa risco futuro.
                                    <br />
                                    Cálculo: {risk.percentage.toFixed(0)}% do preço do produto.
                                </span>
                            }
                            position="top"
                            maxWidth={300}
                        >
                            <span className="text-sm text-slate-600 dark:text-slate-400 cursor-help border-b border-dashed border-slate-400">
                                Reserva Manutenção (5 anos)
                            </span>
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${risk.color}`}>
                            {formatBRL(maintenanceCost)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${risk.bgColor} ${risk.color}`}>
                            {risk.emoji} {risk.label}
                        </span>
                    </div>
                </div>

                {/* Valor de Revenda */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-slate-500" />
                        <Tooltip
                            content={
                                <span className="text-xs leading-relaxed">
                                    Valor estimado de revenda após 5 anos de uso.
                                    <br />
                                    Depreciação típica: 30-40% do valor original.
                                </span>
                            }
                            position="top"
                            maxWidth={280}
                        >
                            <span className="text-sm text-slate-600 dark:text-slate-400 cursor-help border-b border-dashed border-slate-400">
                                Valor de Revenda estimado
                            </span>
                        </Tooltip>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        -{formatBRL(residualValue)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
});

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * OwnershipInsights: Componente "Wallet-Friendly" com geolocalização automática.
 * 
 * @example
 * <OwnershipInsights
 *   purchasePrice={6499}
 *   shadowMetrics={shadowMetrics}
 *   categoryConstants={categoryConstants}
 *   energyKwhMonth={18.5}
 *   productName="Samsung QN90C"
 * />
 */
export const OwnershipInsights = memo(function OwnershipInsights({
    purchasePrice,
    shadowMetrics,
    categoryConstants,
    energyKwhMonth,
    productName,
    compact = false,
}: OwnershipInsightsProps) {
    // Consumir contexto de região
    const { stateCode, energyRate, isDetecting, detectLocation } = useRegion();

    // Calcular gasto com luz baseado na tarifa regional
    const energyCost5Years = useMemo(() => {
        // Usa o consumo passado ou calcula do TCO
        const monthlyKwh = energyKwhMonth ??
            (shadowMetrics.monthlyCostBreakdown?.energy ?? 0) / energyRate;

        // 5 anos = 60 meses
        return Math.round(monthlyKwh * energyRate * 60);
    }, [energyKwhMonth, energyRate, shadowMetrics.monthlyCostBreakdown?.energy]);

    // Custo de manutenção estimado
    const maintenanceCost = useMemo(() => {
        return shadowMetrics.monthlyCostBreakdown?.maintenanceReserve
            ? shadowMetrics.monthlyCostBreakdown.maintenanceReserve * 60
            : purchasePrice * 0.10; // Fallback: 10% do preço
    }, [shadowMetrics.monthlyCostBreakdown?.maintenanceReserve, purchasePrice]);

    // Valor residual (revenda)
    const residualValue = useMemo(() => {
        // Depreciação típica: 30-40% do valor original após 5 anos
        const depreciationRate = 0.35;
        return Math.round(purchasePrice * (1 - depreciationRate));
    }, [purchasePrice]);

    // Compact version (para listagens)
    if (compact) {
        const totalRealCost = purchasePrice + energyCost5Years;
        const risk = getMaintenanceRiskLevel(maintenanceCost, purchasePrice);

        return (
            <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${risk.bgColor} ${risk.color}`}>
                    {risk.emoji} {risk.label}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    Custo Real 5 anos: <strong className="text-slate-800 dark:text-slate-200">
                        {formatBRL(totalRealCost)}
                    </strong>
                </span>
                <span className="text-xs text-slate-500">
                    <MapPin className="w-3 h-3 inline" /> {stateCode}
                </span>
            </div>
        );
    }

    // Full version
    return (
        <section className="ownership-insights space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    💡 Custo Real de Propriedade
                </h2>
                {productName && (
                    <span className="text-sm text-slate-500">• {productName}</span>
                )}
            </div>

            {/* BLOCO A: Impacto no Bolso */}
            <WalletImpactCard
                purchasePrice={purchasePrice}
                energyCost5Years={energyCost5Years}
                stateCode={stateCode}
                isDetecting={isDetecting}
                onRetryDetection={detectLocation}
            />

            {/* BLOCO B: Riscos e Retorno */}
            <RisksAndReturnCard
                maintenanceCost={maintenanceCost}
                productPrice={purchasePrice}
                residualValue={residualValue}
            />

            {/* Avisos de baixa confiança */}
            {shadowMetrics.computedConfidence < 0.7 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
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

export default OwnershipInsights;
