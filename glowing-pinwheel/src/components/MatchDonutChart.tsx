'use client';

import { useState } from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatchResult, PenaltyDetail } from '@/core/match/types';

// ============================================
// DONUT CHART COMPONENT
// ============================================

interface MatchDonutChartProps {
    /** Match score 0-100 */
    score: number;
    /** Size in pixels */
    size?: number;
    /** Stroke width */
    strokeWidth?: number;
    /** Show percentage text */
    showLabel?: boolean;
    /** Custom class */
    className?: string;
}

export function MatchDonutChart({
    score,
    size = 48,
    strokeWidth = 4,
    showLabel = true,
    className,
}: MatchDonutChartProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const remaining = circumference - progress;

    // Color based on score
    const getScoreColor = (score: number) => {
        if (score >= 85) return { stroke: '#10B981', bg: '#D1FAE5' }; // Green
        if (score >= 60) return { stroke: '#F59E0B', bg: '#FEF3C7' }; // Yellow
        if (score >= 40) return { stroke: '#F97316', bg: '#FFEDD5' }; // Orange
        return { stroke: '#EF4444', bg: '#FEE2E2' }; // Red
    };

    const colors = getScoreColor(score);

    return (
        <div className={cn('relative', className)} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill={colors.bg}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                />

                {/* Progress arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={colors.stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${progress} ${remaining}`}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                />
            </svg>

            {/* Center label */}
            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className="font-data font-bold text-[10px]"
                        style={{ color: colors.stroke }}
                    >
                        {score}%
                    </span>
                </div>
            )}
        </div>
    );
}

// ============================================
// PENALTY BADGE COMPONENT
// ============================================

interface PenaltyBadgeProps {
    /** Penalties to display */
    penalties: PenaltyDetail[];
    /** Custom class */
    className?: string;
}

export function PenaltyBadge({ penalties, className }: PenaltyBadgeProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    if (penalties.length === 0) return null;

    return (
        <div className={cn('relative', className)}>
            <button
                onClick={() => setShowTooltip(!showTooltip)}
                onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
                className={cn(
                    'w-5 h-5 rounded-full',
                    'bg-amber-500 text-white',
                    'flex items-center justify-center',
                    'text-xs font-bold',
                    'shadow-sm hover:bg-amber-600 transition-colors',
                    'animate-pulse'
                )}
            >
                !
            </button>

            {/* Tooltip */}
            {showTooltip && (
                <div className={cn(
                    'absolute top-full right-0 mt-2 z-50',
                    'w-64 p-3 rounded-lg',
                    'bg-white border border-gray-200 shadow-lg',
                    'animate-in fade-in-0 zoom-in-95 duration-200'
                )}>
                    <div className="flex items-start gap-2 mb-2">
                        <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold text-text-primary">
                            Nota Reduzida
                        </p>
                    </div>

                    <ul className="space-y-1.5">
                        {penalties.map((penalty, idx) => (
                            <li key={idx} className="text-xs text-text-secondary">
                                <span className="font-medium text-amber-700">
                                    {penalty.label}:
                                </span>{' '}
                                {penalty.reason}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[10px] text-text-muted flex items-center gap-1">
                            <Info size={10} />
                            Não atende aos seus critérios Ouro
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// MATCH SCORE OVERLAY (for Product Cards)
// ============================================

interface MatchScoreOverlayProps {
    /** Full match result */
    result: MatchResult;
    /** Position */
    position?: 'top-right' | 'top-left' | 'bottom-right';
    /** Custom class */
    className?: string;
}

export function MatchScoreOverlay({
    result,
    position = 'top-right',
    className,
}: MatchScoreOverlayProps) {
    const positionClasses = {
        'top-right': 'top-2 right-2',
        'top-left': 'top-2 left-2',
        'bottom-right': 'bottom-2 right-2',
    };

    return (
        <div className={cn(
            'absolute z-10',
            positionClasses[position],
            'flex flex-col items-end gap-1',
            className
        )}>
            {/* Donut Chart */}
            <MatchDonutChart
                score={result.matchScore}
                size={44}
                strokeWidth={4}
            />

            {/* Penalty Badge */}
            {result.hasPenalties && (
                <PenaltyBadge
                    penalties={result.penalties}
                    className="absolute -top-1 -right-1"
                />
            )}

            {/* Uncertainty indicator */}
            {result.hasUncertainty && (
                <div className="absolute -bottom-1 -right-1">
                    <span className="text-[8px] text-text-muted bg-white px-1 rounded">
                        ≈
                    </span>
                </div>
            )}
        </div>
    );
}

// ============================================
// DUAL SCORE DISPLAY (Editorial + Match)
// ============================================

interface DualScoreDisplayProps {
    /** Editorial score (0-10) */
    editorialScore: number;
    /** Match score (0-100) */
    matchScore: number;
    /** Match result for penalties */
    matchResult?: MatchResult;
    /** Compact mode */
    compact?: boolean;
    /** Custom class */
    className?: string;
}

export function DualScoreDisplay({
    editorialScore,
    matchScore,
    matchResult,
    compact = false,
    className,
}: DualScoreDisplayProps) {
    const getMatchColor = (score: number) => {
        if (score >= 85) return 'text-emerald-600 bg-emerald-50';
        if (score >= 60) return 'text-amber-600 bg-amber-50';
        if (score >= 40) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    if (compact) {
        return (
            <div className={cn('flex items-center gap-2', className)}>
                {/* Editorial */}
                <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                        {editorialScore.toFixed(1)}
                    </span>
                    <span className="text-[8px] text-text-muted">ED</span>
                </div>

                {/* Match */}
                <div className="flex items-center gap-1">
                    <span className={cn(
                        'px-1.5 py-0.5 text-[10px] font-bold rounded',
                        getMatchColor(matchScore)
                    )}>
                        {matchScore}%
                    </span>
                    <span className="text-[8px] text-text-muted">MATCH</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {/* Editorial Score */}
            <div className="flex flex-col items-center">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">
                    Editorial
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg">
                    {editorialScore.toFixed(1)}
                </span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200" />

            {/* Match Score */}
            <div className="flex flex-col items-center relative">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">
                    Seu Match
                </span>
                <span className={cn(
                    'px-2 py-1 text-sm font-bold rounded-lg',
                    getMatchColor(matchScore)
                )}>
                    {matchScore}%
                </span>

                {matchResult?.hasPenalties && (
                    <PenaltyBadge
                        penalties={matchResult.penalties}
                        className="absolute -top-1 -right-3"
                    />
                )}
            </div>
        </div>
    );
}
