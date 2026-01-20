'use client';

import { cn } from '@/lib/utils';

// ============================================
// DATA CHIPS - Micro-Audit Scores for Cards
// ============================================

interface DataChipProps {
    label: string;
    value: number;
    maxValue?: number;
    showBar?: boolean;
}

export function DataChip({ label, value, maxValue = 10, showBar = false }: DataChipProps) {
    const percentage = (value / maxValue) * 100;
    const level = percentage >= 80 ? 'high' : percentage >= 50 ? 'medium' : 'low';

    return (
        <div className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1 rounded',
            'font-mono text-[10px] font-semibold',
            level === 'high' && 'bg-emerald-100 text-emerald-800',
            level === 'medium' && 'bg-amber-100 text-amber-800',
            level === 'low' && 'bg-red-100 text-red-800'
        )}>
            <span className="text-[9px] opacity-70">{label}:</span>
            <span className="font-bold">{value.toFixed(1)}</span>
            {showBar && (
                <div className="w-8 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full',
                            level === 'high' && 'bg-emerald-500',
                            level === 'medium' && 'bg-amber-500',
                            level === 'low' && 'bg-red-500'
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            )}
        </div>
    );
}

// ============================================
// SCORE ROW - For striped tables
// ============================================

interface ScoreRowProps {
    label: string;
    value: number;
    maxValue?: number;
    benchmark?: string;
}

export function ScoreRow({ label, value, maxValue = 10, benchmark }: ScoreRowProps) {
    const percentage = (value / maxValue) * 100;
    const level = percentage >= 80 ? 'high' : percentage >= 50 ? 'medium' : 'low';

    return (
        <tr>
            <td className="font-medium text-slate-700">{label}</td>
            <td className={cn(
                'font-bold font-mono',
                level === 'high' && 'text-emerald-600',
                level === 'medium' && 'text-amber-600',
                level === 'low' && 'text-red-600'
            )}>
                {value.toFixed(1)}/{maxValue}
            </td>
            <td className="w-24">
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all',
                            level === 'high' && 'bg-emerald-500',
                            level === 'medium' && 'bg-amber-500',
                            level === 'low' && 'bg-red-500'
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </td>
            {benchmark && (
                <td className="text-[10px] text-slate-500">{benchmark}</td>
            )}
        </tr>
    );
}

// ============================================
// AUDIT TABLE - High-Density Spec Display
// ============================================

interface AuditTableProps {
    title?: string;
    data: Array<{
        label: string;
        value: number;
        maxValue?: number;
        benchmark?: string;
    }>;
}

export function AuditTable({ title, data }: AuditTableProps) {
    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            {title && (
                <div className="bg-slate-800 text-white px-3 py-2 text-xs font-semibold font-mono uppercase tracking-wide">
                    {title}
                </div>
            )}
            <table className="table-audit">
                <thead>
                    <tr>
                        <th>Critério</th>
                        <th>Nota</th>
                        <th>Gráfico</th>
                        <th>Benchmark</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <ScoreRow key={index} {...row} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ============================================
// MICRO AUDIT CHIPS - For Product Cards
// ============================================

interface MicroAuditProps {
    scores: {
        c1?: number;
        c2?: number;
        c3?: number;
        c4?: number;
        c5?: number;
        [key: string]: number | undefined;
    };
    matchScore?: number;
    compact?: boolean;
}

export function MicroAuditChips({ scores, matchScore, compact = false }: MicroAuditProps) {
    // Display top 3 scores for space efficiency
    const displayScores = [
        { key: 'c1', label: 'C-B', value: scores.c1 }, // Custo-Benefício
        { key: 'c2', label: 'Img', value: scores.c2 }, // Imagem
        { key: 'c4', label: 'Game', value: scores.c4 }, // Gaming
    ].filter(s => s.value !== undefined);

    return (
        <div className={cn(
            'flex flex-wrap gap-1',
            compact ? 'mt-1' : 'mt-2'
        )}>
            {displayScores.slice(0, 3).map(score => (
                <DataChip
                    key={score.key}
                    label={score.label}
                    value={score.value!}
                    showBar={!compact}
                />
            ))}
            {matchScore !== undefined && (
                <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded',
                    'font-mono text-[10px] font-bold',
                    'bg-brand-core/10 text-brand-core'
                )}>
                    <span className="text-[9px]">Match:</span>
                    <span>{matchScore.toFixed(0)}%</span>
                </div>
            )}
        </div>
    );
}
