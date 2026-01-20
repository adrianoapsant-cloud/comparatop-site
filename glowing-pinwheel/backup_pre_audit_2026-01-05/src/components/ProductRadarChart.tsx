'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

// ============================================
// PRODUCT DNA RADAR CHART
// ============================================

export interface ProductDNAData {
    /** Label for the dimension */
    dimension: string;
    /** Score 0-10 */
    score: number;
    /** Full score for chart */
    fullMark: number;
    /** Optional reason/justification for this score */
    reason?: string;
}

interface ProductRadarChartProps {
    /** Product name for legend */
    productName: string;
    /** Data points for radar */
    data: ProductDNAData[];
    /** Optional comparison product */
    comparisonData?: ProductDNAData[];
    /** Comparison product name */
    comparisonName?: string;
    /** Custom class */
    className?: string;
}

/**
 * Product DNA Radar Chart
 * 
 * Visual representation of product strengths across 5 key dimensions.
 * Users can "bater o olho" and understand if a product is balanced or focused.
 */
export function ProductRadarChart({
    productName,
    data,
    comparisonData,
    comparisonName,
    className,
}: ProductRadarChartProps) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; payload: ProductDNAData }> }) => {
        if (active && payload && payload.length) {
            const p = payload[0].payload;
            return (
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-text-primary text-sm">{p.dimension}</p>
                    <p className="text-text-secondary text-xs">
                        Score: <span className="font-bold text-brand-core">{payload[0].value.toFixed(1)}</span>/10
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <section className={cn('py-8', className)}>
            {/* Section Header */}
            <div className="mb-4">
                <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
                    🧬 DNA do Produto
                </h2>
                <p className="text-sm text-text-muted mt-1">
                    Visão geral das forças e fraquezas em 5 dimensões
                </p>
            </div>

            {/* Radar Chart Container */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <div className="h-[300px] md:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
                            {/* Grid */}
                            <PolarGrid
                                stroke="#e5e7eb"
                                strokeDasharray="3 3"
                            />

                            {/* Dimension Labels */}
                            <PolarAngleAxis
                                dataKey="dimension"
                                tick={{
                                    fill: '#64748b',
                                    fontSize: 11,
                                    fontWeight: 500,
                                }}
                                tickLine={false}
                            />

                            {/* Score Scale (hidden numbers) */}
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 10]}
                                tick={false}
                                axisLine={false}
                            />

                            {/* Note: Comparison feature requires merged data approach */}

                            {/* Main Product */}
                            <Radar
                                name={productName}
                                dataKey="score"
                                stroke="#3b82f6"
                                fill="url(#radarGradient)"
                                fillOpacity={0.6}
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                            />

                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>

                            {/* Tooltip */}
                            <Tooltip content={<CustomTooltip />} />

                            {/* Legend (only if comparison) */}
                            {comparisonData && (
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    iconType="circle"
                                />
                            )}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Insights */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {data.map((item, idx) => {
                            const isStrength = item.score >= 8;
                            const isWeakness = item.score < 6;

                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-xs font-medium relative group cursor-help',
                                        isStrength ? 'bg-emerald-100 text-emerald-700' :
                                            isWeakness ? 'bg-amber-100 text-amber-700' :
                                                'bg-gray-100 text-gray-600'
                                    )}
                                >
                                    {isStrength ? '✓' : isWeakness ? '⚠' : '●'} {item.dimension}: {item.score.toFixed(1)}
                                    {item.reason && (
                                        <span className="ml-1 text-xs opacity-60">ⓘ</span>
                                    )}
                                    {/* Tooltip */}
                                    {item.reason && (
                                        <div className="hidden group-hover:block absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white rounded-lg shadow-xl border border-gray-200 text-left">
                                            <p className="text-xs font-semibold text-text-primary mb-1">
                                                {item.dimension}
                                            </p>
                                            <p className="text-xs text-text-secondary leading-relaxed whitespace-normal">
                                                {item.reason}
                                            </p>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -mt-1" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// HELPER: Generate default DNA from scores
// ============================================

export function generateProductDNA(scores: Record<string, number>): ProductDNAData[] {
    const dimensionLabels: Record<string, string> = {
        'costBenefit': '💰 Custo-Benefício',
        'performance': '⚡ Desempenho',
        'display': '🖥️ Tela/Imagem',
        'build': '🔧 Construção',
        'features': '🎮 Recursos',
    };

    return Object.entries(dimensionLabels).map(([key, label]) => ({
        dimension: label,
        score: scores[key] ?? 7,
        fullMark: 10,
    }));
}

// ============================================
// HELPER: Extract DNA from product benchmarks
// ============================================

export function extractDNAFromProduct(product: {
    computed?: { qs?: number; vs?: number; gs?: number; overall?: number };
    scores?: Record<string, number>;
    scoreReasons?: Record<string, string>;
}): ProductDNAData[] {
    // Use computed scores from scoring engine
    const qs = product.computed?.qs ?? 7;
    const vs = product.computed?.vs ?? 7;
    const gs = product.computed?.gs ?? 7;
    const overall = product.computed?.overall ?? 7;

    // Calculate dimensions based on actual criteria scores
    const c1 = product.scores?.c1 ?? vs;  // Custo-Benefício
    const c5 = product.scores?.c5 ?? 7;   // Gaming/Desempenho
    const c6 = product.scores?.c6 ?? qs;  // Brilho/Tela
    const c3 = product.scores?.c3 ?? gs;  // Confiabilidade/Construção

    // Get reasons from scoreReasons if available
    const reasons = product.scoreReasons ?? {};

    return [
        { dimension: '💰 Custo-Benefício', score: Math.min(10, Math.max(0, c1)), fullMark: 10, reason: reasons.c1 },
        { dimension: '⚡ Desempenho', score: Math.min(10, Math.max(0, c5)), fullMark: 10, reason: reasons.c5 },
        { dimension: '🖥️ Tela/Imagem', score: Math.min(10, Math.max(0, c6)), fullMark: 10, reason: reasons.c6 },
        { dimension: '🔧 Construção', score: Math.min(10, Math.max(0, c3)), fullMark: 10, reason: reasons.c3 },
        { dimension: '🎮 Recursos', score: Math.min(10, Math.max(0, overall)), fullMark: 10, reason: reasons.c7 },
    ];
}
