'use client';

import { useState } from 'react';
import {
    Users,
    ChevronDown,
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    Home,
    Sofa,
    Volume2,
    Ear,
    Zap,
    Plug,
    Eye,
    Tv,
    Thermometer,
    Sun,
    Moon,
    Clock,
    Settings,
    Wifi,
    Battery,
    Smartphone,
    Star,
    Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';
import type { LucideIcon } from 'lucide-react';

// ============================================
// COMMUNITY CONSENSUS CARD
// ============================================
// "Prova Social Qualificada" - Trust Sandwich Layer
// Focuses on "Vivência do Dono" (Owner Experience)
// NOT redundant with Audit Verdict (which covers specs)
//
// Design: "Medical/Trust" aesthetic
// - bg-slate-50 with subtle borders
// - Differentiated from editorial cards
// - Mobile-first with Progressive Disclosure

// ============================================
// DYNAMIC ICON UTILITY
// ============================================


/**
 * Analyzes text content and returns the most appropriate Lucide icon.
 * Category-agnostic: works for TVs, Geladeiras, Fones, etc.
 */
function getDynamicIcon(text: string, fallback: LucideIcon): LucideIcon {
    const t = text.toLowerCase();

    // Room/Space keywords
    if (/sala|living|room/i.test(t)) return Sofa;
    if (/cozinha|kitchen/i.test(t)) return Home;
    if (/quarto|bedroom|dormir/i.test(t)) return Moon;

    // Sound/Audio keywords
    if (/barulho|ruído|silencioso|quieto/i.test(t)) return Volume2;
    if (/som|áudio|ouvido|ear|fone/i.test(t)) return Ear;

    // Energy/Power keywords
    if (/bateria|battery|carga/i.test(t)) return Battery;
    if (/tomada|fio|cabo|plug|carregador/i.test(t)) return Plug;
    if (/energia|consumo|watts|kwh/i.test(t)) return Zap;

    // Visual/Display keywords
    if (/brilho|nits|luz|luminosidade/i.test(t)) return Sun;
    if (/tela|display|imagem|hdr/i.test(t)) return Tv;
    if (/escuro|dark|noite|cinema/i.test(t)) return Moon;
    if (/visão|olho|eye|ver/i.test(t)) return Eye;

    // Temperature/Climate keywords
    if (/temperatura|frio|gelado|quente|calor/i.test(t)) return Thermometer;

    // Tech/Usability keywords
    if (/wifi|conexão|bluetooth|smart/i.test(t)) return Wifi;
    if (/app|aplicativo|celular|remote/i.test(t)) return Smartphone;
    if (/config|ajuste|setting|menu|sistema/i.test(t)) return Settings;
    if (/tempo|hora|rápido|lento|demora/i.test(t)) return Clock;

    // Return fallback if no match
    return fallback;
}

// ============================================
// INTERFACES
// ============================================

interface CommunityConsensusData {
    /** Consensus score percentage (0-100) */
    consensusScore: number;
    /** Total reviews count as string (e.g., "5k+", "12k+") */
    totalReviews: string;
    /** Acceptable flaw - Usability focused, not specs (e.g., "O sistema Tizen é lento") */
    acceptableFlaw: string;
    /** Real world scenario - How it performs in real life (e.g., "Salva casamentos em salas iluminadas") */
    realWorldScenario: string;
    /** Golden tip - Insider knowledge from owners (e.g., "Vire o controle para carregar") */
    goldenTip: string;
    /** Audit score for comparison in tooltip (optional) */
    auditScore?: number;
}

interface CommunityConsensusCardProps {
    data: CommunityConsensusData;
    /** Optional className for additional styling */
    className?: string;
}

// ============================================
// SUB-COMPONENTS
// ============================================

/** Header with consensus score and review count */
function ConsensusHeader({
    consensusScore,
    totalReviews,
    auditScore
}: {
    consensusScore: number;
    totalReviews: string;
    auditScore?: number;
}) {
    // Determine score color based on value
    const scoreColor = consensusScore >= 85
        ? 'text-emerald-600'
        : consensusScore >= 70
            ? 'text-sky-600'
            : 'text-amber-600';

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Users size={18} className="text-slate-500" />
                <h3 className="font-display font-semibold text-slate-700 text-sm">
                    Consenso da Comunidade
                </h3>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <span className={cn('font-bold text-lg', scoreColor)}>
                        {consensusScore}%
                    </span>
                    <Tooltip
                        content={
                            <div className="text-xs leading-relaxed space-y-2">
                                <p className="text-gray-100">
                                    Baseado em <span className="font-bold text-emerald-400">{totalReviews || '5k+'} reviews</span> verificados.
                                </p>
                                <p className="text-gray-300">
                                    O consenso reflete a felicidade do comprador logo após receber o produto, enquanto nossa{' '}
                                    <span className="font-bold text-amber-400">
                                        Nota {auditScore ? auditScore.toFixed(1) : 'Técnica'}
                                    </span>{' '}
                                    é uma auditoria de engenharia que busca defeitos específicos que muitas vezes só aparecem após maior período de uso.
                                </p>
                            </div>
                        }
                        position="bottom"
                        maxWidth={300}
                    >
                        <div className="cursor-help flex items-center justify-center ml-1">
                            <Info
                                size={14}
                                className="text-zinc-400 hover:text-emerald-600 transition-colors"
                            />
                        </div>
                    </Tooltip>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {totalReviews} reviews
                </span>
            </div>
        </div>
    );
}

/** Acceptable Flaw Card - Amber tones for attention (not critical) */
function AcceptableFlawCard({ text }: { text: string }) {
    const Icon = getDynamicIcon(text, AlertTriangle);

    return (
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-3">
            <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-amber-100">
                    <Icon size={14} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-amber-800 text-xs uppercase tracking-wide mb-1">
                        Defeito Aceitável
                    </h4>
                    <p className="text-sm text-amber-700 leading-relaxed">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
}

/** Real World Scenario Card - Slate/Blue tones for neutral/informative */
function RealWorldScenarioCard({ text }: { text: string }) {
    const Icon = getDynamicIcon(text, CheckCircle);

    return (
        <div className="bg-sky-50/50 border border-sky-200/50 rounded-lg p-3">
            <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-sky-100">
                    <Icon size={14} className="text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sky-800 text-xs uppercase tracking-wide mb-1">
                        Cenário Real
                    </h4>
                    <p className="text-sm text-sky-700 leading-relaxed">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
}

/** Golden Tip Card - Subtle gradient/purple for value/gamification */
function GoldenTipCard({ text }: { text: string }) {
    const Icon = getDynamicIcon(text, Lightbulb);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200/60 rounded-lg p-3">
            {/* Subtle shine effect */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex items-start gap-2.5 relative">
                <div className="p-1.5 rounded-md bg-gradient-to-br from-violet-100 to-fuchsia-100">
                    <Icon size={14} className="text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h4 className="font-medium text-violet-800 text-xs uppercase tracking-wide">
                            Dica de Ouro
                        </h4>
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-sm text-violet-700 leading-relaxed font-medium">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CommunityConsensusCard({ data, className }: CommunityConsensusCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const expandableId = 'community-consensus-expandable';

    return (
        <div
            className={cn(
                // Medical/Trust aesthetic
                'bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm',
                // Differentiate from editorial cards
                'relative overflow-hidden',
                className
            )}
        >
            {/* Subtle trust indicator line at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-300" />

            {/* Header - Always visible */}
            <ConsensusHeader
                consensusScore={data.consensusScore}
                totalReviews={data.totalReviews}
                auditScore={data.auditScore}
            />

            {/* Desktop: Show all cards */}
            <div className="hidden md:grid md:grid-cols-1 gap-3">
                <AcceptableFlawCard text={data.acceptableFlaw} />
                <RealWorldScenarioCard text={data.realWorldScenario} />
                <GoldenTipCard text={data.goldenTip} />
            </div>

            {/* Mobile: Progressive Disclosure */}
            <div className="md:hidden space-y-3">
                {/* Always visible on mobile: Golden Tip (most valuable) */}
                <GoldenTipCard text={data.goldenTip} />

                {/* Expandable: Other cards */}
                <div
                    id={expandableId}
                    role="region"
                    aria-labelledby="community-consensus-toggle"
                    className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                >
                    <div className="space-y-3 pt-1">
                        <AcceptableFlawCard text={data.acceptableFlaw} />
                        <RealWorldScenarioCard text={data.realWorldScenario} />
                    </div>
                </div>

                {/* Expand/Collapse Button with ARIA */}
                <button
                    id="community-consensus-toggle"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={expandableId}
                    className={cn(
                        'w-full py-2 flex items-center justify-center gap-2',
                        'text-xs text-slate-500 hover:text-slate-700',
                        'border border-slate-200 rounded-lg hover:bg-white',
                        'transition-all duration-200'
                    )}
                >
                    <span>
                        {isExpanded
                            ? 'Ver menos'
                            : 'Ver experiência completa'}
                    </span>
                    <ChevronDown
                        size={14}
                        className={cn(
                            'transition-transform duration-300',
                            isExpanded && 'rotate-180'
                        )}
                    />
                </button>
            </div>

            {/* Source attribution - subtle footer */}
            <div className="mt-4 pt-3 border-t border-slate-200/60">
                <p className="text-[10px] text-slate-400 text-center">
                    Síntese baseada em avaliações públicas (metodologia Consenso 360°)
                </p>
            </div>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export type { CommunityConsensusData, CommunityConsensusCardProps };
