'use client';

import { useMemo } from 'react';
import { Dna } from 'lucide-react';
import type { ProductData } from '@/config/product-json-schema';

type ProductDnaData = ProductData['productDna'];

interface ProductDnaSectionProps {
    data: ProductDnaData;
}

function getScoreColor(score: number): string {
    if (score >= 9) return 'from-emerald-500 to-emerald-400';
    if (score >= 8) return 'from-blue-500 to-blue-400';
    if (score >= 7) return 'from-cyan-500 to-cyan-400';
    if (score >= 5) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
}

function getScoreLabel(score: number): string {
    if (score >= 9) return 'Excelente';
    if (score >= 8) return 'Muito Bom';
    if (score >= 7) return 'Bom';
    if (score >= 5) return 'Regular';
    return 'Fraco';
}

function DimensionBar({
    dimension
}: {
    dimension: ProductDnaData['dimensions'][0]
}) {
    const percentage = (dimension.score / 10) * 100;
    const colorClass = getScoreColor(dimension.score);

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{dimension.name}</span>
                    <span className="text-xs text-text-muted hidden group-hover:inline">
                        {dimension.description}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">{getScoreLabel(dimension.score)}</span>
                    <span className="text-sm font-bold text-text-primary">{dimension.score.toFixed(1)}</span>
                </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function RadarChart({ dimensions }: { dimensions: ProductDnaData['dimensions'] }) {
    const size = 320;
    const center = size / 2;
    const radius = 120;

    const points = useMemo(() => {
        return dimensions.map((dim, i) => {
            const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
            const r = (dim.score / 10) * radius;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle),
                labelX: center + (radius + 20) * Math.cos(angle),
                labelY: center + (radius + 20) * Math.sin(angle),
                ...dim,
            };
        });
    }, [dimensions]);

    const pathD = points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ') + ' Z';

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[350px] mx-auto">
            {/* Grid circles */}
            {[2, 4, 6, 8, 10].map(level => (
                <circle
                    key={level}
                    cx={center}
                    cy={center}
                    r={(level / 10) * radius}
                    fill="none"
                    stroke="rgb(209 213 219)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                />
            ))}

            {/* Axis lines */}
            {dimensions.map((_, i) => {
                const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
                return (
                    <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={center + radius * Math.cos(angle)}
                        y2={center + radius * Math.sin(angle)}
                        stroke="rgb(209 213 219)"
                        strokeWidth="1"
                    />
                );
            })}

            {/* Score polygon */}
            <path
                d={pathD}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
            />

            {/* Score points with tooltips */}
            {points.map((p, i) => (
                <g key={i} className="group">
                    <circle
                        cx={p.x}
                        cy={p.y}
                        r="6"
                        fill="rgb(59, 130, 246)"
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer transition-all hover:r-8 hover:fill-blue-700"
                    >
                        <title>{`${p.name}: ${p.score.toFixed(1)}/10\n${p.description}`}</title>
                    </circle>
                </g>
            ))}

            {/* Labels */}
            {points.map((p, i) => (
                <text
                    key={i}
                    x={p.labelX}
                    y={p.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] fill-gray-600 font-medium"
                >
                    {p.shortName}
                </text>
            ))}
        </svg>
    );
}

export function ProductDnaSection({ data }: ProductDnaSectionProps) {
    const averageScore = useMemo(() => {
        const sum = data.dimensions.reduce((acc, d) => acc + d.score, 0);
        return sum / data.dimensions.length;
    }, [data.dimensions]);

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                    <Dna className="w-6 h-6 text-purple-600" />
                    {data.title}
                </h2>
                <div className="text-right">
                    <div className="text-2xl font-bold text-text-primary">{averageScore.toFixed(2)}</div>
                    <div className="text-xs text-text-muted">Média Geral</div>
                </div>
            </div>

            <p className="text-sm text-text-secondary mb-6">{data.subtitle}</p>

            {/* Clean Radar Chart - Full Width, Centered */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <RadarChart dimensions={data.dimensions} />
                <p className="text-center text-xs text-text-muted mt-4">
                    💡 Passe o mouse sobre os pontos para ver detalhes
                </p>
            </div>
        </section>
    );
}
