'use client';

// ============================================================================
// ICEBERG CHART - Stacked Bar Chart for TCO Composition
// ============================================================================
// Visualizes the "hidden costs" of ownership using stacked bars
// Base (Price) is solid, hidden costs (Energy/Maintenance) use patterns
// ============================================================================

import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { ProductTcoData, UsagePersona } from '@/types/tco';
import { calculateTotalTco, formatBRL } from '@/lib/tco';

// ============================================
// TYPES
// ============================================

interface IcebergChartProps {
    /** Products to display */
    data: ProductTcoData[];
    /** Current persona for energy calculation */
    currentPersona: UsagePersona;
    /** Number of years for TCO */
    years?: number;
    /** Chart height */
    height?: number;
    /** Additional class names */
    className?: string;
    /** Show legend */
    showLegend?: boolean;
}

interface ChartDataPoint {
    name: string;
    shortName: string;
    price: number;
    energy: number;
    maintenance: number;
    resaleCredit: number;
    total: number;
    product: ProductTcoData;
}

// ============================================
// COLORS & PATTERN DEFINITIONS
// ============================================

const COLORS = {
    price: '#3b82f6',      // Blue - solid base
    energy: '#f59e0b',     // Amber - diagonal pattern
    maintenance: '#ef4444', // Red - dotted pattern
    resale: '#10b981',     // Green - credit (negative)
};

// SVG Pattern definitions for accessibility and visual distinction
function ChartPatterns() {
    return (
        <defs>
            {/* Diagonal lines pattern for Energy */}
            <pattern
                id="energyPattern"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(45)"
            >
                <rect width="8" height="8" fill={COLORS.energy} fillOpacity="0.3" />
                <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke={COLORS.energy}
                    strokeWidth="3"
                />
            </pattern>

            {/* Dotted pattern for Maintenance */}
            <pattern
                id="maintenancePattern"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
            >
                <rect width="6" height="6" fill={COLORS.maintenance} fillOpacity="0.2" />
                <circle cx="3" cy="3" r="1.5" fill={COLORS.maintenance} />
            </pattern>

            {/* Cross-hatch pattern for high-risk maintenance */}
            <pattern
                id="maintenancePatternCritical"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
            >
                <rect width="8" height="8" fill={COLORS.maintenance} fillOpacity="0.15" />
                <path
                    d="M0,0 L8,8 M8,0 L0,8"
                    stroke={COLORS.maintenance}
                    strokeWidth="1"
                />
            </pattern>

            {/* Striped pattern for Resale Credit (green) */}
            <pattern
                id="resalePattern"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(-45)"
            >
                <rect width="8" height="8" fill={COLORS.resale} fillOpacity="0.3" />
                <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke={COLORS.resale}
                    strokeWidth="3"
                />
            </pattern>
        </defs>
    );
}

// ============================================
// CUSTOM TOOLTIP
// ============================================

interface TooltipPayload {
    name: string;
    value: number;
    dataKey: string;
    color: string;
    payload: ChartDataPoint;
}

function CustomTooltip({
    active,
    payload,
    label
}: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    const costLabels: Record<string, { label: string; color: string }> = {
        price: { label: 'Preço de Compra', color: COLORS.price },
        energy: { label: 'Energia (Custo Oculto)', color: COLORS.energy },
        maintenance: { label: 'Manutenção (Risco)', color: COLORS.maintenance },
        resaleCredit: { label: 'Crédito Revenda', color: COLORS.resale },
    };

    return (
        <div className={cn(
            'bg-white rounded-xl shadow-xl border border-gray-200',
            'p-4 min-w-[240px]'
        )}>
            {/* Product Name */}
            <p className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                {data.name}
            </p>

            {/* Cost Breakdown */}
            <div className="space-y-2">
                {['price', 'energy', 'maintenance'].map((key) => {
                    const value = data[key as keyof ChartDataPoint] as number;
                    const config = costLabels[key];

                    return (
                        <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: config.color }}
                                />
                                <span className="text-sm text-gray-600">{config.label}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {formatBRL(value)}
                            </span>
                        </div>
                    );
                })}

                {/* Resale Credit (always show, even if 0) */}
                <div className="flex items-center justify-between text-emerald-600">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: COLORS.resale }}
                        />
                        <span className="text-sm">{costLabels.resaleCredit.label}</span>
                    </div>
                    <span className="text-sm font-medium">
                        {data.resaleCredit > 0 ? `-${formatBRL(data.resaleCredit)}` : 'R$ 0'}
                    </span>
                </div>
            </div>

            {/* Total */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-700">TCO Total</span>
                <span className="text-lg font-bold text-gray-900">
                    {formatBRL(data.total)}
                </span>
            </div>

            {/* Hidden Cost Indicator */}
            {data.energy + data.maintenance > data.price * 0.3 && (
                <div className="mt-2 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700">
                        ⚠️ Custos ocultos representam {Math.round((data.energy + data.maintenance) / data.price * 100)}% do preço
                    </p>
                </div>
            )}
        </div>
    );
}

// ============================================
// CUSTOM LEGEND
// ============================================

function CustomLegend() {
    const items = [
        { key: 'price', label: 'Preço de Compra', color: COLORS.price, pattern: false },
        { key: 'energy', label: 'Energia', color: COLORS.energy, pattern: true },
        { key: 'maintenance', label: 'Manutenção', color: COLORS.maintenance, pattern: true },
        { key: 'resale', label: 'Crédito Revenda', color: COLORS.resale, pattern: false },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
            {items.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                    <div
                        className={cn(
                            'w-4 h-4 rounded-sm',
                            item.pattern && 'opacity-80'
                        )}
                        style={{
                            backgroundColor: item.color,
                            backgroundImage: item.pattern
                                ? `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)`
                                : undefined
                        }}
                    />
                    <span className="text-sm text-gray-600">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * IcebergChart - Stacked bar chart showing TCO composition
 * 
 * Uses SVG patterns to distinguish "hidden costs" (energy, maintenance)
 * from the visible price. This creates an "iceberg" effect where
 * the base is solid but stacked costs use patterns.
 * 
 * @example
 * ```tsx
 * <IcebergChart 
 *   data={products} 
 *   currentPersona="gamer" 
 *   years={5}
 * />
 * ```
 */
export function IcebergChart({
    data,
    currentPersona,
    years = 5,
    height = 400,
    className,
    showLegend = true,
}: IcebergChartProps) {
    // Transform product data into chart format
    const chartData = useMemo<ChartDataPoint[]>(() => {
        return data.map((product) => {
            const tco = calculateTotalTco(product, { years, persona: currentPersona });

            return {
                name: product.name,
                shortName: product.brand,
                price: tco.capex,
                energy: tco.totalEnergyCost,
                maintenance: tco.totalMaintenanceCost,
                // Use calculated resaleValue (considers depreciation - 0 if years > lifespan)
                resaleCredit: tco.resaleValue,
                total: tco.totalTco,
                product,
            };
        });
    }, [data, currentPersona, years]);

    if (chartData.length === 0) {
        return (
            <div className={cn(
                'flex items-center justify-center',
                'bg-gray-50 rounded-xl border border-gray-200',
                className
            )} style={{ height }}>
                <p className="text-gray-500">Nenhum produto para comparar</p>
            </div>
        );
    }

    return (
        <div className={cn('w-full', className)}>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    {/* Pattern Definitions */}
                    <ChartPatterns />

                    {/* Grid */}
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                    />

                    {/* Axes */}
                    <XAxis
                        dataKey="shortName"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />

                    {/* Tooltip */}
                    <Tooltip content={<CustomTooltip />} />

                    {/* Stacked Bars */}
                    {/* Base: Price (Solid) */}
                    <Bar
                        dataKey="price"
                        stackId="tco"
                        fill={COLORS.price}
                        radius={[0, 0, 4, 4]}
                        name="Preço"
                    />

                    {/* Energy (Pattern) */}
                    <Bar
                        dataKey="energy"
                        stackId="tco"
                        fill="url(#energyPattern)"
                        stroke={COLORS.energy}
                        strokeWidth={1}
                        name="Energia"
                    />

                    {/* Maintenance (Pattern) */}
                    <Bar
                        dataKey="maintenance"
                        stackId="tco"
                        fill="url(#maintenancePattern)"
                        stroke={COLORS.maintenance}
                        strokeWidth={1}
                        name="Manutenção"
                    />

                    {/* Resale Credit (Solid green - credit visualization) */}
                    <Bar
                        dataKey="resaleCredit"
                        stackId="tco"
                        fill={COLORS.resale}
                        stroke="#059669"
                        strokeWidth={2}
                        radius={[4, 4, 0, 0]}
                        name="Crédito Revenda"
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            {showLegend && <CustomLegend />}
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default IcebergChart;
export { COLORS as ICEBERG_COLORS };
