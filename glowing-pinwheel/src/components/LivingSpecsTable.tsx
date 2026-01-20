'use client';

// ============================================================================
// LIVING SPECS TABLE
// ============================================================================
// Tabela de Especificações "Viva" que une dados técnicos frios com
// opiniões qualitativas quentes através de Audit Notes contextuais
// Reduz entropia ao dar significado humano aos números
// ============================================================================

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';
import {
    Info,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    Star,
    MessageSquare,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface SpecItem {
    /** Chave única da especificação */
    key: string;
    /** Label exibido */
    label: string;
    /** Valor da especificação */
    value: string | number;
    /** Unidade (opcional) */
    unit?: string;
    /** Ícone (opcional) */
    icon?: string;
    /** Categoria para agrupamento */
    category?: string;
}

export interface AuditNote {
    /** Score do auditor (0-10) */
    score?: number;
    /** Veredito textual */
    verdict: string;
    /** Comparação com mercado */
    comparison?: 'above' | 'average' | 'below';
    /** Contexto adicional */
    context?: string;
    /** Destaque especial (premium, warning, etc) */
    highlight?: 'excellent' | 'good' | 'neutral' | 'warning' | 'critical';
}

export type AuditNotesMap = Record<string, AuditNote>;

export interface LivingSpecsTableProps {
    /** Array de especificações */
    specs: SpecItem[];
    /** Mapa de notas do auditor (spec key -> audit note) */
    auditNotes?: AuditNotesMap;
    /** Título da tabela */
    title?: string;
    /** Agrupar por categoria */
    groupByCategory?: boolean;
    /** Modo de exibição */
    variant?: 'list' | 'table' | 'cards';
    /** Mostrar comparação com mercado */
    showComparison?: boolean;
    /** Classe CSS adicional */
    className?: string;
}

// ============================================
// MOCK DATA (for development)
// ============================================

export const MOCK_SPECS: SpecItem[] = [
    { key: 'screen_size', label: 'Tamanho da Tela', value: 65, unit: '"', icon: '📺', category: 'Display' },
    { key: 'resolution', label: 'Resolução', value: '4K UHD', icon: '🎬', category: 'Display' },
    { key: 'panel_type', label: 'Tipo de Painel', value: 'Mini LED', icon: '💡', category: 'Display' },
    { key: 'refresh_rate', label: 'Taxa de Atualização', value: '144Hz', icon: '⚡', category: 'Gaming' },
    { key: 'response_time', label: 'Tempo de Resposta', value: '1ms', icon: '🎮', category: 'Gaming' },
    { key: 'hdmi_ports', label: 'Portas HDMI 2.1', value: 4, icon: '🔌', category: 'Conectividade' },
    { key: 'power_consumption', label: 'Consumo', value: 180, unit: 'W', icon: '⚡', category: 'Energia' },
    { key: 'weight', label: 'Peso', value: 23.5, unit: 'kg', icon: '⚖️', category: 'Físico' },
];

export const MOCK_AUDIT_NOTES: AuditNotesMap = {
    screen_size: {
        score: 9.0,
        verdict: 'Tamanho ideal para salas de 15m² ou mais',
        comparison: 'average',
        highlight: 'good',
    },
    refresh_rate: {
        score: 9.5,
        verdict: 'Excelente para jogos! 144Hz nativo com VRR',
        comparison: 'above',
        context: 'Superior à maioria das TVs na faixa de preço',
        highlight: 'excellent',
    },
    response_time: {
        score: 9.8,
        verdict: '1ms é o padrão gamer - imperceptível ghosting',
        comparison: 'above',
        highlight: 'excellent',
    },
    hdmi_ports: {
        score: 9.0,
        verdict: '4 portas HDMI 2.1 é o máximo disponível',
        comparison: 'above',
        highlight: 'excellent',
    },
    power_consumption: {
        score: 6.5,
        verdict: 'Consumo alto para Mini LED - considere na conta',
        comparison: 'below',
        context: 'Média da categoria é 140W',
        highlight: 'warning',
    },
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * Ícone de highlight baseado no score
 */
function HighlightIcon({ highlight }: { highlight?: AuditNote['highlight'] }) {
    switch (highlight) {
        case 'excellent':
            return <Star size={14} className="text-amber-500 fill-amber-500" />;
        case 'good':
            return <CheckCircle2 size={14} className="text-emerald-500" />;
        case 'warning':
            return <AlertTriangle size={14} className="text-amber-500" />;
        case 'critical':
            return <XCircle size={14} className="text-rose-500" />;
        default:
            return <Info size={14} className="text-gray-400" />;
    }
}

/**
 * Ícone de comparação com mercado
 */
function ComparisonIcon({ comparison }: { comparison?: AuditNote['comparison'] }) {
    switch (comparison) {
        case 'above':
            return (
                <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-medium">
                    <TrendingUp size={12} />
                    Acima
                </span>
            );
        case 'below':
            return (
                <span className="flex items-center gap-0.5 text-rose-500 text-xs font-medium">
                    <TrendingDown size={12} />
                    Abaixo
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-0.5 text-gray-400 text-xs font-medium">
                    <Minus size={12} />
                    Média
                </span>
            );
    }
}

/**
 * Badge de score do auditor
 */
function AuditScoreBadge({ score }: { score?: number }) {
    if (score === undefined) return null;

    const color = score >= 8.5 ? 'bg-emerald-100 text-emerald-700' :
        score >= 7 ? 'bg-blue-100 text-blue-700' :
            score >= 5 ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700';

    return (
        <span className={cn(
            'px-1.5 py-0.5 rounded text-xs font-bold tabular-nums',
            color
        )}>
            {score.toFixed(1)}
        </span>
    );
}

/**
 * Conteúdo do tooltip de audit note
 */
function AuditNoteTooltipContent({ note }: { note: AuditNote }) {
    return (
        <div className="space-y-2 max-w-[260px]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare size={10} />
                    Veredito do Auditor
                </span>
                {note.score !== undefined && (
                    <span className={cn(
                        'px-1.5 py-0.5 rounded text-xs font-bold',
                        note.score >= 8 ? 'bg-emerald-500/20 text-emerald-300' :
                            note.score >= 6 ? 'bg-amber-500/20 text-amber-300' :
                                'bg-rose-500/20 text-rose-300'
                    )}>
                        {note.score.toFixed(1)}/10
                    </span>
                )}
            </div>

            {/* Verdict */}
            <p className="text-sm text-white leading-relaxed">
                {note.verdict}
            </p>

            {/* Context */}
            {note.context && (
                <p className="text-xs text-gray-400 italic">
                    💡 {note.context}
                </p>
            )}

            {/* Comparison */}
            {note.comparison && (
                <div className="pt-1.5 border-t border-gray-700 flex items-center gap-2">
                    <span className="text-xs text-gray-400">vs. Mercado:</span>
                    <ComparisonIcon comparison={note.comparison} />
                </div>
            )}
        </div>
    );
}

// ============================================
// SPEC ROW COMPONENT
// ============================================

interface SpecRowProps {
    spec: SpecItem;
    auditNote?: AuditNote;
    showComparison?: boolean;
    variant: 'list' | 'table' | 'cards';
}

function SpecRow({ spec, auditNote, showComparison, variant }: SpecRowProps) {
    const hasAuditNote = Boolean(auditNote);

    const content = (
        <div
            className={cn(
                'flex items-center justify-between gap-4 py-3 px-4',
                'transition-all duration-200',
                hasAuditNote && 'hover:bg-amber-50 cursor-pointer',
                variant === 'cards' && 'rounded-xl bg-white shadow-sm border border-gray-100'
            )}
        >
            {/* Left: Label */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {spec.icon && (
                    <span className="text-lg flex-shrink-0">{spec.icon}</span>
                )}
                <span className={cn(
                    'text-sm font-medium text-gray-700 truncate',
                    hasAuditNote && 'text-gray-900'
                )}>
                    {spec.label}
                </span>
            </div>

            {/* Right: Value + Audit Note Indicator */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Comparison badge */}
                {showComparison && auditNote?.comparison && (
                    <ComparisonIcon comparison={auditNote.comparison} />
                )}

                {/* Value */}
                <span className={cn(
                    'text-sm font-bold tabular-nums',
                    hasAuditNote && auditNote?.highlight === 'excellent' ? 'text-emerald-600' :
                        hasAuditNote && auditNote?.highlight === 'warning' ? 'text-amber-600' :
                            hasAuditNote && auditNote?.highlight === 'critical' ? 'text-rose-600' :
                                'text-gray-900'
                )}>
                    {spec.value}{spec.unit || ''}
                </span>

                {/* Audit note indicator */}
                {auditNote && (
                    <div className={cn(
                        'flex items-center gap-1 px-1.5 py-0.5 rounded-full',
                        'bg-amber-100 border border-amber-200'
                    )}>
                        <HighlightIcon highlight={auditNote.highlight} />
                        {auditNote.score !== undefined && (
                            <span className="text-[10px] font-bold text-amber-700">
                                {auditNote.score.toFixed(1)}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // Wrap with tooltip if has audit note
    if (hasAuditNote) {
        return (
            <Tooltip
                content={<AuditNoteTooltipContent note={auditNote!} />}
                position="left"
                maxWidth={300}
            >
                {content}
            </Tooltip>
        );
    }

    return content;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function LivingSpecsTable({
    specs,
    auditNotes = {},
    title = 'Especificações Técnicas',
    groupByCategory = false,
    variant = 'list',
    showComparison = true,
    className,
}: LivingSpecsTableProps) {

    // Group specs by category if enabled
    const groupedSpecs = useMemo(() => {
        if (!groupByCategory) {
            return { 'all': specs };
        }

        return specs.reduce((acc, spec) => {
            const category = spec.category || 'Outros';
            if (!acc[category]) acc[category] = [];
            acc[category].push(spec);
            return acc;
        }, {} as Record<string, SpecItem[]>);
    }, [specs, groupByCategory]);

    // Count specs with audit notes
    const auditedCount = useMemo(() =>
        specs.filter(s => auditNotes[s.key]).length,
        [specs, auditNotes]
    );

    return (
        <div className={cn('space-y-4', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        📋 {title}
                    </h3>
                    {auditedCount > 0 && (
                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                            <MessageSquare size={12} className="text-amber-500" />
                            {auditedCount} specs com veredito do auditor
                            <Tooltip
                                content="Passe o mouse sobre as specs destacadas para ver a opinião especializada do nosso auditor."
                                position="right"
                            >
                                <Info size={12} className="text-gray-400 cursor-help" />
                            </Tooltip>
                        </p>
                    )}
                </div>

                {/* Legend */}
                <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        Excelente
                    </span>
                    <span className="flex items-center gap-1">
                        <AlertTriangle size={10} className="text-amber-500" />
                        Atenção
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className={cn(
                'rounded-2xl overflow-hidden',
                variant !== 'cards' && 'bg-white border border-gray-200'
            )}>
                {Object.entries(groupedSpecs).map(([category, categorySpecs]) => (
                    <div key={category}>
                        {/* Category header (if grouped) */}
                        {groupByCategory && category !== 'all' && (
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {category}
                                </h4>
                            </div>
                        )}

                        {/* Specs */}
                        <div className={cn(
                            variant === 'cards' && 'grid gap-3 sm:grid-cols-2',
                            variant !== 'cards' && 'divide-y divide-gray-100'
                        )}>
                            {categorySpecs.map((spec) => (
                                <SpecRow
                                    key={spec.key}
                                    spec={spec}
                                    auditNote={auditNotes[spec.key]}
                                    showComparison={showComparison}
                                    variant={variant}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer tip */}
            {auditedCount > 0 && (
                <p className="text-xs text-center text-gray-400 italic">
                    💡 Specs com destaque foram validadas por nossa equipe de auditores
                </p>
            )}
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export default LivingSpecsTable;
