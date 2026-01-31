'use client';

import { cn } from '@/lib/utils';
import { ModuleFallback } from '@/components/pdp/ModuleFallback';
import type { BenchmarkScore } from '@/types/category';

// ============================================
// MICRO BAR COMPONENT
// ============================================

interface MicroBarProps {
    /** Label for the spec */
    label: string;
    /** Current value */
    value: number;
    /** Maximum value (for percentage) */
    maxValue: number;
    /** Display unit */
    unit: string;
    /** Whether higher is better */
    higherIsBetter?: boolean;
    /** Category average for comparison */
    categoryAverage?: number;
    /** Icon (emoji) */
    icon?: string;
}

function MicroBar({
    label,
    value,
    maxValue,
    unit,
    higherIsBetter = true,
    categoryAverage,
    icon,
}: MicroBarProps) {
    const percentage = Math.min((value / maxValue) * 100, 100);

    // Calculate if this value is better than average
    const isBetter = categoryAverage !== undefined
        ? (higherIsBetter ? value > categoryAverage : value < categoryAverage)
        : false;

    const percentDiff = categoryAverage !== undefined
        ? Math.abs(((value - categoryAverage) / categoryAverage) * 100).toFixed(0)
        : null;

    return (
        <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0">
            {/* Icon */}
            {icon && (
                <span className="text-base flex-shrink-0 w-6 text-center">{icon}</span>
            )}

            {/* Label */}
            <span className="text-sm font-medium text-text-primary w-28 flex-shrink-0 truncate">
                {label}
            </span>

            {/* Micro Bar */}
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isBetter
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                            : categoryAverage !== undefined && !isBetter
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : 'bg-gradient-to-r from-blue-400 to-blue-500'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Value */}
            <span className="text-sm font-data font-semibold text-text-primary w-20 text-right">
                {value} {unit}
            </span>

            {/* Comparison Badge */}
            {percentDiff && Number(percentDiff) > 5 && (
                <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0',
                    isBetter
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                )}>
                    {isBetter ? '+' : '-'}{percentDiff}%
                </span>
            )}
        </div>
    );
}

// ============================================
// TECH SPECS SECTION
// ============================================

interface TechSpecsSectionProps {
    /** Benchmark data */
    benchmarks: BenchmarkScore[];
    /** Custom class */
    className?: string;
}

export function TechSpecsSection({ benchmarks, className }: TechSpecsSectionProps) {
    if (!benchmarks || benchmarks.length === 0) {
        return (
            <ModuleFallback
                sectionId="tech_specs"
                sectionName="Especificações Técnicas"
                status="unavailable"
                reason="Dados de benchmark não disponíveis para este produto"
            />
        );
    }

    // Icon mapping for common specs
    const specIcons: Record<string, string> = {
        'brilho': '☀️',
        'brightness': '☀️',
        'input lag': '⚡',
        'input_lag': '⚡',
        'latência': '⚡',
        'consumo': '💡',
        'power': '💡',
        'contraste': '🌗',
        'contrast': '🌗',
        'som': '🔊',
        'audio': '🔊',
        'cores': '🎨',
        'color': '🎨',
        'refresh': '🔄',
        'taxa': '🔄',
        'resolução': '📺',
        'resolution': '📺',
        'peso': '⚖️',
        'weight': '⚖️',
        'garantia': '🛡️',
        'warranty': '🛡️',
    };

    const getIcon = (label: string): string => {
        const lowerLabel = label.toLowerCase();
        for (const [key, icon] of Object.entries(specIcons)) {
            if (lowerLabel.includes(key)) return icon;
        }
        return '📊';
    };

    // Calculate max for each spec for visual scaling
    const getMaxValue = (value: number, avg: number): number => {
        return Math.max(value, avg) * 1.2;
    };

    return (
        <section className={cn('py-8', className)}>
            {/* Section Header */}
            <div className="mb-4">
                <h2 className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
                    📋 Especificações Técnicas
                </h2>
                <p className="text-sm text-text-muted mt-1">
                    Dados comparados com a média da categoria
                </p>
            </div>

            {/* Compact Specs Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <div className="space-y-0">
                    {benchmarks.map((benchmark, idx) => (
                        <MicroBar
                            key={idx}
                            label={benchmark.label}
                            value={benchmark.productValue}
                            maxValue={getMaxValue(benchmark.productValue, benchmark.categoryAverage)}
                            unit={benchmark.unit}
                            higherIsBetter={benchmark.higherIsBetter !== false}
                            categoryAverage={benchmark.categoryAverage}
                            icon={getIcon(benchmark.label)}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted">
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-2 rounded-sm bg-emerald-500"></span>
                            Acima da média
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-2 rounded-sm bg-amber-500"></span>
                            Abaixo da média
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-2 rounded-sm bg-blue-500"></span>
                            Sem comparação
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
