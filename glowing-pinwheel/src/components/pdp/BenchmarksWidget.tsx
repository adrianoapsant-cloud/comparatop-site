'use client';

/**
 * BenchmarksWidget
 * 
 * Displays comparative benchmark charts showing product vs category average.
 * Uses bar charts with diferential badges (e.g., "+15% melhor").
 */

import type { BenchmarkScore } from '@/types/category';

export interface BenchmarksWidgetProps {
    benchmarks: BenchmarkScore[];
    productName?: string;
}

export function BenchmarksWidget({ benchmarks, productName }: BenchmarksWidgetProps) {
    if (!benchmarks || benchmarks.length === 0) return null;

    return (
        <div className="benchmarks-section">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                Comparativo com a Categoria
            </h2>
            <div className="space-y-4">
                {benchmarks.map((benchmark, idx) => {
                    const productPercentage = benchmark.higherIsBetter !== false
                        ? (benchmark.productValue / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100
                        : (benchmark.categoryAverage / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100;

                    const avgPercentage = benchmark.higherIsBetter !== false
                        ? (benchmark.categoryAverage / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100
                        : (benchmark.productValue / Math.max(benchmark.productValue, benchmark.categoryAverage)) * 100;

                    const isBetter = benchmark.higherIsBetter !== false
                        ? benchmark.productValue > benchmark.categoryAverage
                        : benchmark.productValue < benchmark.categoryAverage;

                    const difference = benchmark.higherIsBetter !== false
                        ? ((benchmark.productValue - benchmark.categoryAverage) / benchmark.categoryAverage * 100).toFixed(0)
                        : ((benchmark.categoryAverage - benchmark.productValue) / benchmark.categoryAverage * 100).toFixed(0);

                    return (
                        <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-body font-medium text-text-primary text-sm">
                                    {benchmark.label}
                                </span>
                                {isBetter && Number(difference) > 0 && (
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                                        +{difference}% melhor
                                    </span>
                                )}
                            </div>

                            {/* Product Bar */}
                            <div className="mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 text-xs text-text-muted">Este</div>
                                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full flex items-center justify-end pr-2 ${isBetter ? 'bg-emerald-500' : 'bg-gray-400'}`}
                                            style={{ width: `${productPercentage}%` }}
                                        >
                                            <span className="text-[10px] font-medium text-white">
                                                {benchmark.productValue} {benchmark.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Average Bar */}
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 text-xs text-text-muted">Média</div>
                                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gray-400 rounded-full flex items-center justify-end pr-2"
                                            style={{ width: `${avgPercentage}%` }}
                                        >
                                            <span className="text-[10px] font-medium text-white">
                                                {benchmark.categoryAverage} {benchmark.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BenchmarksWidget;
