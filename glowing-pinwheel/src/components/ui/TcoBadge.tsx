"use client";

import { useState } from "react";
import { TcoBreakdown, formatTco } from "@/lib/tco";
import { useRegion } from "@/contexts/RegionContext";
import { Info, Zap, Wrench, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TcoBadgeProps {
    /** TCO breakdown data */
    tco: TcoBreakdown;
    /** Display variant */
    variant?: "compact" | "full" | "inline";
    /** Additional class names */
    className?: string;
}

/**
 * TcoBadge - Displays the Total Cost of Ownership
 * 
 * Shows the "Custo Real" (True Cost) with a tooltip breakdown
 * of acquisition, energy, and maintenance costs.
 */
export function TcoBadge({ tco, variant = "compact", className }: TcoBadgeProps) {
    const { stateName } = useRegion();
    const [showTooltip, setShowTooltip] = useState(false);

    // Calculate the "hidden cost" percentage
    const hiddenCostPercent = Math.round(
        ((tco.totalTco - tco.acquisitionCost) / tco.acquisitionCost) * 100
    );

    if (variant === "inline") {
        return (
            <span className={cn("text-xs text-amber-600 font-medium", className)}>
                Custo Real {tco.lifespanYears}a: {formatTco(tco.totalTco)}
            </span>
        );
    }

    if (variant === "compact") {
        return (
            <div
                className={cn(
                    "relative inline-flex items-center gap-1.5 px-2 py-1 rounded-lg",
                    "bg-amber-50 border border-amber-200 text-amber-800",
                    "cursor-help transition-all hover:bg-amber-100",
                    className
                )}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-medium">
                    Custo Real {tco.lifespanYears}a: {formatTco(tco.totalTco)}
                </span>
                <Info className="w-3 h-3 text-amber-500" />

                {/* Tooltip */}
                {showTooltip && (
                    <TcoTooltip tco={tco} stateName={stateName} hiddenCostPercent={hiddenCostPercent} />
                )}
            </div>
        );
    }

    // Full variant - Card style
    return (
        <div className={cn(
            "p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50",
            "border border-amber-200",
            className
        )}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-amber-900">Custo Real de Propriedade</h4>
                        <p className="text-xs text-amber-600">Projeção {tco.lifespanYears} anos • {stateName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-amber-900">{formatTco(tco.totalTco)}</p>
                    <p className="text-xs text-amber-600">+{hiddenCostPercent}% de custo oculto</p>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
                <TcoBreakdownRow
                    icon={<TrendingUp className="w-3.5 h-3.5" />}
                    label="Aquisição"
                    value={tco.acquisitionCost}
                    percent={Math.round((tco.acquisitionCost / tco.totalTco) * 100)}
                    color="text-gray-600"
                />
                <TcoBreakdownRow
                    icon={<Zap className="w-3.5 h-3.5" />}
                    label="Energia"
                    value={tco.energyCost}
                    percent={Math.round((tco.energyCost / tco.totalTco) * 100)}
                    color="text-amber-600"
                />
                <TcoBreakdownRow
                    icon={<Wrench className="w-3.5 h-3.5" />}
                    label="Manutenção"
                    value={tco.maintenanceCost}
                    percent={Math.round((tco.maintenanceCost / tco.totalTco) * 100)}
                    color="text-orange-600"
                />
            </div>

            <p className="mt-3 text-[10px] text-amber-600/80 leading-relaxed">
                * Projeção baseada em tarifa de {stateName} (R$ {tco.energyRate.toFixed(2)}/kWh),
                inflação energética de 5% a.a. e taxa de desconto de 2% a.a.
            </p>
        </div>
    );
}

function TcoBreakdownRow({
    icon,
    label,
    value,
    percent,
    color
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    percent: number;
    color: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className={cn("flex-shrink-0", color)}>{icon}</span>
            <span className="text-xs text-gray-600 flex-1">{label}</span>
            <span className="text-xs font-medium text-gray-900">{formatTco(value)}</span>
            <span className="text-[10px] text-gray-500 w-10 text-right">({percent}%)</span>
        </div>
    );
}

function TcoTooltip({
    tco,
    stateName,
    hiddenCostPercent
}: {
    tco: TcoBreakdown;
    stateName: string;
    hiddenCostPercent: number;
}) {
    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white rounded-lg shadow-xl z-50">
            <div className="text-xs space-y-2">
                <p className="font-semibold text-amber-400">
                    💡 +{hiddenCostPercent}% de custo oculto
                </p>
                <div className="space-y-1 text-slate-300">
                    <div className="flex justify-between">
                        <span>Aquisição</span>
                        <span className="font-medium text-white">{formatTco(tco.acquisitionCost)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Energia ({tco.lifespanYears}a)</span>
                        <span className="font-medium text-amber-400">{formatTco(tco.energyCost)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Manutenção</span>
                        <span className="font-medium text-orange-400">{formatTco(tco.maintenanceCost)}</span>
                    </div>
                    <div className="border-t border-slate-700 pt-1 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatTco(tco.totalTco)}</span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                    Baseado na tarifa de {stateName} (R$ {tco.energyRate.toFixed(2)}/kWh)
                </p>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45" />
        </div>
    );
}
