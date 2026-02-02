'use client';

// ============================================================================
// HEXAGON SCORE - SVG Matemático com Stroke Semântico
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Pontas em 60°, calculadas via trigonometria
// ============================================================================

import { cn } from '@/lib/utils';

interface HexagonScoreProps {
    /** Score value (0-10) */
    score: number;
    /** Size in pixels */
    size?: number;
    /** Show label below score */
    showLabel?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * Generates hexagon points for SVG polygon
 * Regular hexagon with pointy-top orientation (60° angles)
 */
function getHexagonPoints(cx: number, cy: number, r: number): string {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
        // Start from top (-90°) and go clockwise
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(' ');
}

/**
 * Get semantic color based on score
 */
function getScoreColor(score: number): {
    stroke: string;
    fill: string;
    text: string;
    label: string;
} {
    if (score >= 8.0) {
        return {
            stroke: 'stroke-emerald-500',
            fill: 'fill-emerald-50',
            text: 'text-emerald-700',
            label: 'Excelente'
        };
    }
    if (score >= 6.0) {
        return {
            stroke: 'stroke-amber-500',
            fill: 'fill-amber-50',
            text: 'text-amber-700',
            label: 'Bom'
        };
    }
    return {
        stroke: 'stroke-red-500',
        fill: 'fill-red-50',
        text: 'text-red-700',
        label: 'Atenção'
    };
}

export function HexagonScore({
    score,
    size = 56,
    showLabel = false,
    className
}: HexagonScoreProps) {
    const colors = getScoreColor(score);
    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) * 0.85; // 85% of half size for padding

    const hexPoints = getHexagonPoints(cx, cy, r);

    return (
        <div className={cn('flex flex-col items-center', className)}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="drop-shadow-sm"
            >
                {/* Background hexagon */}
                <polygon
                    points={hexPoints}
                    className={cn(colors.fill, colors.stroke)}
                    strokeWidth={2}
                />
                {/* Score text */}
                <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={cn(
                        'font-bold',
                        colors.text
                    )}
                    style={{ fontSize: size * 0.32 }}
                >
                    {score.toFixed(2)}
                </text>
            </svg>

            {/* Label below */}
            {showLabel && (
                <span className={cn(
                    'text-xs font-medium mt-0.5',
                    colors.text
                )}>
                    {colors.label}
                </span>
            )}
        </div>
    );
}

export default HexagonScore;
