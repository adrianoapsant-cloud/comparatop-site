'use client';

// ============================================================================
// PRODUCT DNA CHART
// ============================================================================
// Gráfico de Radar "DNA do Produto" com modos adaptativos
// Reduz carga cognitiva destacando eixos relevantes para o contexto do usuário
// ============================================================================

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info, Gamepad2, Eye, Wrench } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type DNAChartMode = 'gamer' | 'visual' | 'technical';

export interface DNAScore {
    /** ID do critério (ex: 'refresh_rate', 'design') */
    id: string;
    /** Label exibido no gráfico */
    label: string;
    /** Valor do score (0-10) */
    value: number;
    /** Ícone opcional */
    icon?: string;
    /** Categoria do critério */
    category?: 'gaming' | 'visual' | 'technical' | 'general';
}

export interface ProductDNAChartProps {
    /** Scores do produto */
    scores: DNAScore[];
    /** Modo de visualização - destaca eixos relevantes */
    mode?: DNAChartMode;
    /** Nome do produto */
    productName?: string;
    /** Tamanho do gráfico */
    size?: 'sm' | 'md' | 'lg';
    /** Mostrar valores numéricos */
    showValues?: boolean;
    /** Mostrar legenda de cores */
    showLegend?: boolean;
    /** Classe CSS adicional */
    className?: string;
}

// ============================================
// MODE CONFIGURATIONS
// ============================================

interface ModeConfig {
    label: string;
    icon: React.ReactNode;
    accentColor: string;
    bgGradient: string;
    borderColor: string;
    highlightCategories: string[];
}

const MODE_CONFIGS: Record<DNAChartMode, ModeConfig> = {
    gamer: {
        label: 'Modo Gamer',
        icon: <Gamepad2 size={16} />,
        accentColor: '#10B981', // emerald-500
        bgGradient: 'from-emerald-500/20 to-green-500/20',
        borderColor: 'border-emerald-200',
        highlightCategories: ['gaming'],
    },
    visual: {
        label: 'Modo Visual',
        icon: <Eye size={16} />,
        accentColor: '#8B5CF6', // violet-500
        bgGradient: 'from-violet-500/20 to-purple-500/20',
        borderColor: 'border-violet-200',
        highlightCategories: ['visual'],
    },
    technical: {
        label: 'Modo Técnico',
        icon: <Wrench size={16} />,
        accentColor: '#3B82F6', // blue-500
        bgGradient: 'from-blue-500/20 to-cyan-500/20',
        borderColor: 'border-blue-200',
        highlightCategories: ['technical'],
    },
};

// ============================================
// MOCK DATA (for development)
// ============================================

export const MOCK_TV_SCORES: DNAScore[] = [
    { id: 'refresh_rate', label: 'Taxa de Atualização', value: 9.5, icon: '⚡', category: 'gaming' },
    { id: 'input_lag', label: 'Input Lag', value: 9.2, icon: '🎮', category: 'gaming' },
    { id: 'vrr', label: 'VRR/G-Sync', value: 9.0, icon: '🔄', category: 'gaming' },
    { id: 'contrast', label: 'Contraste', value: 8.5, icon: '🌗', category: 'visual' },
    { id: 'color_accuracy', label: 'Precisão de Cor', value: 8.8, icon: '🎨', category: 'visual' },
    { id: 'hdr', label: 'HDR', value: 9.0, icon: '☀️', category: 'visual' },
    { id: 'brightness', label: 'Brilho', value: 8.0, icon: '💡', category: 'visual' },
    { id: 'build_quality', label: 'Construção', value: 8.5, icon: '🔧', category: 'technical' },
    { id: 'connectivity', label: 'Conectividade', value: 9.0, icon: '🔌', category: 'technical' },
    { id: 'value', label: 'Custo-Benefício', value: 8.5, icon: '💰', category: 'general' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calcula pontos do polígono do radar
 */
function calculatePolygonPoints(
    scores: DNAScore[],
    centerX: number,
    centerY: number,
    radius: number
): string {
    const angleStep = (2 * Math.PI) / scores.length;
    const points = scores.map((score, i) => {
        const angle = i * angleStep - Math.PI / 2; // Start from top
        const normalizedValue = score.value / 10;
        const x = centerX + radius * normalizedValue * Math.cos(angle);
        const y = centerY + radius * normalizedValue * Math.sin(angle);
        return `${x},${y}`;
    });
    return points.join(' ');
}

/**
 * Calcula posição de um label no radar
 */
function calculateLabelPosition(
    index: number,
    total: number,
    centerX: number,
    centerY: number,
    radius: number
): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep - Math.PI / 2;
    const x = centerX + (radius + 20) * Math.cos(angle);
    const y = centerY + (radius + 20) * Math.sin(angle);

    let anchor: 'start' | 'middle' | 'end' = 'middle';
    if (Math.cos(angle) < -0.3) anchor = 'end';
    if (Math.cos(angle) > 0.3) anchor = 'start';

    return { x, y, anchor };
}

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Score badge com destaque condicional
 */
function ScoreBadge({
    score,
    isHighlighted,
    accentColor,
}: {
    score: DNAScore;
    isHighlighted: boolean;
    accentColor: string;
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300',
                isHighlighted
                    ? 'bg-white shadow-md scale-105 ring-2'
                    : 'bg-gray-50 opacity-60 hover:opacity-100'
            )}
            style={{
                '--tw-ring-color': isHighlighted ? accentColor : 'transparent',
            } as React.CSSProperties}
        >
            <span className="text-lg">{score.icon}</span>
            <div className="flex-1 min-w-0">
                <p className={cn(
                    'text-xs font-medium truncate',
                    isHighlighted ? 'text-gray-900' : 'text-gray-500'
                )}>
                    {score.label}
                </p>
            </div>
            <span
                className={cn(
                    'text-sm font-bold tabular-nums',
                    isHighlighted ? 'text-gray-900' : 'text-gray-400'
                )}
                style={{ color: isHighlighted ? accentColor : undefined }}
            >
                {score.value.toFixed(1)}
            </span>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProductDNAChart({
    scores,
    mode = 'visual',
    productName,
    size = 'md',
    showValues = true,
    showLegend = true,
    className,
}: ProductDNAChartProps) {
    const config = MODE_CONFIGS[mode];

    // Dimensions based on size
    const dimensions = useMemo(() => {
        switch (size) {
            case 'sm': return { width: 240, height: 240, radius: 80 };
            case 'lg': return { width: 400, height: 400, radius: 160 };
            default: return { width: 320, height: 320, radius: 120 };
        }
    }, [size]);

    const { width, height, radius } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Determine which scores are highlighted based on mode
    const highlightedScores = useMemo(() => {
        return new Set(
            scores
                .filter(s => config.highlightCategories.includes(s.category || ''))
                .map(s => s.id)
        );
    }, [scores, config.highlightCategories]);

    // Calculate polygon points
    const polygonPoints = useMemo(() =>
        calculatePolygonPoints(scores, centerX, centerY, radius),
        [scores, centerX, centerY, radius]
    );

    // Calculate average score
    const avgScore = useMemo(() =>
        scores.reduce((sum, s) => sum + s.value, 0) / scores.length,
        [scores]
    );

    return (
        <div className={cn('space-y-4', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        🧬 DNA do Produto
                        {productName && (
                            <span className="text-sm font-normal text-gray-500">
                                — {productName}
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Análise multidimensional de desempenho
                    </p>
                </div>

                {/* Mode Badge */}
                <div
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                        'text-sm font-semibold',
                        `bg-gradient-to-r ${config.bgGradient}`,
                        config.borderColor,
                        'border'
                    )}
                    style={{ color: config.accentColor }}
                >
                    {config.icon}
                    {config.label}
                </div>
            </div>

            {/* Main Content */}
            <div className={cn(
                'flex gap-6 p-6 rounded-2xl',
                `bg-gradient-to-br ${config.bgGradient}`,
                config.borderColor,
                'border-2'
            )}>
                {/* Radar Chart SVG */}
                <div className="flex-shrink-0">
                    <svg
                        width={width}
                        height={height}
                        viewBox={`0 0 ${width} ${height}`}
                        className="overflow-visible"
                    >
                        {/* Grid circles */}
                        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                            <circle
                                key={i}
                                cx={centerX}
                                cy={centerY}
                                r={radius * scale}
                                fill="none"
                                stroke="currentColor"
                                strokeOpacity={0.1}
                                strokeWidth={1}
                                className="text-gray-400"
                            />
                        ))}

                        {/* Axis lines */}
                        {scores.map((score, i) => {
                            const angle = (i * (2 * Math.PI) / scores.length) - Math.PI / 2;
                            const x2 = centerX + radius * Math.cos(angle);
                            const y2 = centerY + radius * Math.sin(angle);
                            const isHighlighted = highlightedScores.has(score.id);

                            return (
                                <line
                                    key={score.id}
                                    x1={centerX}
                                    y1={centerY}
                                    x2={x2}
                                    y2={y2}
                                    stroke={isHighlighted ? config.accentColor : '#D1D5DB'}
                                    strokeWidth={isHighlighted ? 2 : 1}
                                    strokeOpacity={isHighlighted ? 0.8 : 0.3}
                                />
                            );
                        })}

                        {/* Data polygon */}
                        <polygon
                            points={polygonPoints}
                            fill={config.accentColor}
                            fillOpacity={0.25}
                            stroke={config.accentColor}
                            strokeWidth={2}
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {scores.map((score, i) => {
                            const angle = (i * (2 * Math.PI) / scores.length) - Math.PI / 2;
                            const normalizedValue = score.value / 10;
                            const x = centerX + radius * normalizedValue * Math.cos(angle);
                            const y = centerY + radius * normalizedValue * Math.sin(angle);
                            const isHighlighted = highlightedScores.has(score.id);

                            return (
                                <g key={score.id}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={isHighlighted ? 6 : 4}
                                        fill={isHighlighted ? config.accentColor : '#9CA3AF'}
                                        stroke="white"
                                        strokeWidth={2}
                                        className={isHighlighted ? 'drop-shadow-md' : ''}
                                    />
                                </g>
                            );
                        })}

                        {/* Labels */}
                        {scores.map((score, i) => {
                            const { x, y, anchor } = calculateLabelPosition(
                                i, scores.length, centerX, centerY, radius
                            );
                            const isHighlighted = highlightedScores.has(score.id);

                            return (
                                <text
                                    key={`label-${score.id}`}
                                    x={x}
                                    y={y}
                                    textAnchor={anchor}
                                    dominantBaseline="middle"
                                    className={cn(
                                        'text-[10px] font-medium',
                                        isHighlighted ? 'fill-gray-900' : 'fill-gray-400'
                                    )}
                                >
                                    {score.icon} {score.label}
                                </text>
                            );
                        })}

                        {/* Center score */}
                        <text
                            x={centerX}
                            y={centerY - 8}
                            textAnchor="middle"
                            className="text-2xl font-bold fill-gray-900"
                        >
                            {avgScore.toFixed(1)}
                        </text>
                        <text
                            x={centerX}
                            y={centerY + 12}
                            textAnchor="middle"
                            className="text-xs fill-gray-500"
                        >
                            média geral
                        </text>
                    </svg>
                </div>

                {/* Score List */}
                {showValues && (
                    <div className="flex-1 space-y-2 max-h-[320px] overflow-y-auto pr-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Detalhamento por Critério
                        </div>
                        {scores.map((score) => (
                            <ScoreBadge
                                key={score.id}
                                score={score}
                                isHighlighted={highlightedScores.has(score.id)}
                                accentColor={config.accentColor}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: config.accentColor }}
                        />
                        Destacado ({config.label})
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-gray-300" />
                        Outros critérios
                    </span>
                    <Tooltip content="O modo de visualização destaca os critérios mais relevantes para seu perfil de uso.">
                        <span className="flex items-center gap-1 cursor-help hover:text-gray-700">
                            <Info size={12} />
                            O que é isso?
                        </span>
                    </Tooltip>
                </div>
            )}
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default ProductDNAChart;
