'use client';

// ============================================================================
// MATCH DONUT - Micro-Chart SVG com stroke-dasharray
// ============================================================================
// Design System: Crystalline (Frosted Glass Light)
// Preenchimento proporcional ao percentual de match
// ============================================================================

import { cn } from '@/lib/utils';

interface MatchDonutProps {
    /** Match percentage (0-100) */
    percentage: number;
    /** Size in pixels */
    size?: number;
    /** Stroke width */
    strokeWidth?: number;
    /** Show percentage text inside */
    showText?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * Get semantic color based on match percentage
 */
function getMatchColor(percentage: number): {
    stroke: string;
    bg: string;
    text: string;
} {
    if (percentage >= 70) {
        return {
            stroke: 'stroke-emerald-500',
            bg: 'stroke-emerald-100',
            text: 'text-emerald-700'
        };
    }
    if (percentage >= 50) {
        return {
            stroke: 'stroke-amber-500',
            bg: 'stroke-amber-100',
            text: 'text-amber-700'
        };
    }
    return {
        stroke: 'stroke-gray-400',
        bg: 'stroke-gray-100',
        text: 'text-gray-600'
    };
}

export function MatchDonut({
    percentage,
    size = 40,
    strokeWidth = 4,
    showText = true,
    className
}: MatchDonutProps) {
    const colors = getMatchColor(percentage);

    // Calculate circle properties
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const cx = size / 2;
    const cy = size / 2;

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    className={colors.bg}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    className={cn(colors.stroke, 'transition-all duration-500')}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>

            {/* Center text */}
            {showText && (
                <span
                    className={cn(
                        'absolute font-bold',
                        colors.text
                    )}
                    style={{ fontSize: size * 0.28 }}
                >
                    {Math.round(percentage)}
                </span>
            )}
        </div>
    );
}

export default MatchDonut;
