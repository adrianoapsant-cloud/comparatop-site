'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clipboard, XCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductData } from '@/config/product-json-schema';

type AuditVerdictData = ProductData['auditVerdict'];

const iconMap = {
    checkCircle: CheckCircle,
    alertTriangle: AlertTriangle,
    clipboard: Clipboard,
    xCircle: XCircle,
};

// Light theme color map (matching AuditVerdict.tsx style)
const colorMap = {
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-500',
        textTitle: 'text-emerald-800',
        textBody: 'text-emerald-700',
        icon: 'text-emerald-600',
    },
    amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        textTitle: 'text-amber-800',
        textBody: 'text-amber-700',
        icon: 'text-amber-600',
    },
    blue: {
        bg: 'bg-slate-100',
        border: 'border-slate-400',
        textTitle: 'text-slate-700',
        textBody: 'text-slate-600',
        icon: 'text-slate-600',
    },
    red: {
        bg: 'bg-red-50',
        border: 'border-red-400',
        textTitle: 'text-red-800',
        textBody: 'text-red-700',
        icon: 'text-red-600',
    },
};

interface AuditVerdictSectionProps {
    data: AuditVerdictData;
}

function VerdictCard({
    title,
    icon,
    color,
    items
}: {
    title: string;
    icon: string;
    color: keyof typeof colorMap;
    items: string[];
}) {
    const IconComponent = iconMap[icon as keyof typeof iconMap] || CheckCircle;
    const colors = colorMap[color];

    return (
        <div className={`${colors.bg} border-l-4 ${colors.border} rounded-r-lg p-4 h-full`}>
            <div className="flex items-start gap-3">
                <IconComponent size={20} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
                <div>
                    <h3 className={`font-semibold ${colors.textTitle} text-sm mb-2`}>
                        {icon === 'checkCircle' && '✓ '}{title}
                    </h3>
                    <ul className="space-y-1">
                        {items.map((item, idx) => (
                            <li key={idx} className={`text-sm ${colors.textBody} flex items-start gap-2`}>
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.icon} flex-shrink-0`} style={{ backgroundColor: 'currentColor' }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function TechnicalConclusionCard({
    title,
    text,
    color
}: {
    title: string;
    text: string;
    color: keyof typeof colorMap;
}) {
    const colors = colorMap[color];

    return (
        <div className={`${colors.bg} border-l-4 ${colors.border} rounded-r-lg p-4 h-full`}>
            <div className="flex items-start gap-3">
                <Clipboard size={20} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
                <div>
                    <h3 className={`font-semibold ${colors.textTitle} text-sm mb-1`}>
                        {title}
                    </h3>
                    <p className={`text-sm ${colors.textBody} leading-relaxed`}>{text}</p>
                </div>
            </div>
        </div>
    );
}

export function AuditVerdictSection({ data }: AuditVerdictSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="space-y-3">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-4">
                <Clipboard size={20} className="text-slate-600" />
                <h2 className="font-display text-lg font-bold text-text-primary">
                    Veredito da Auditoria
                </h2>
            </div>

            {/* Desktop: Grid 2x2 Layout (all visible) */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-3">
                {/* A Solução */}
                <VerdictCard
                    title={data.solution.title}
                    icon={data.solution.icon}
                    color={data.solution.color}
                    items={data.solution.items}
                />

                {/* Ponto de Atenção */}
                <VerdictCard
                    title={data.attentionPoint.title}
                    icon={data.attentionPoint.icon}
                    color={data.attentionPoint.color}
                    items={data.attentionPoint.items}
                />

                {/* Conclusão Técnica */}
                <TechnicalConclusionCard
                    title={data.technicalConclusion.title}
                    text={data.technicalConclusion.text}
                    color={data.technicalConclusion.color as keyof typeof colorMap}
                />

                {/* Não Compre Se */}
                <VerdictCard
                    title={data.dontBuyIf.title}
                    icon={data.dontBuyIf.icon}
                    color={data.dontBuyIf.color}
                    items={data.dontBuyIf.items}
                />
            </div>

            {/* Mobile: Progressive Disclosure */}
            <div className="lg:hidden space-y-3">
                {/* Always visible: Primary cards */}
                <VerdictCard
                    title={data.solution.title}
                    icon={data.solution.icon}
                    color={data.solution.color}
                    items={data.solution.items}
                />
                <VerdictCard
                    title={data.attentionPoint.title}
                    icon={data.attentionPoint.icon}
                    color={data.attentionPoint.color}
                    items={data.attentionPoint.items}
                />

                {/* Expandable: Secondary cards */}
                <div
                    className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                >
                    <div className="space-y-3 pt-1">
                        <TechnicalConclusionCard
                            title={data.technicalConclusion.title}
                            text={data.technicalConclusion.text}
                            color={data.technicalConclusion.color as keyof typeof colorMap}
                        />
                        <VerdictCard
                            title={data.dontBuyIf.title}
                            icon={data.dontBuyIf.icon}
                            color={data.dontBuyIf.color}
                            items={data.dontBuyIf.items}
                        />
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        'w-full py-2.5 flex items-center justify-center gap-2',
                        'text-sm text-slate-500 hover:text-slate-700',
                        'border border-slate-200 rounded-lg hover:bg-slate-50',
                        'transition-all duration-200'
                    )}
                >
                    <span>
                        {isExpanded
                            ? 'Ocultar análise completa'
                            : 'Ver análise técnica completa e contra-indicações'}
                    </span>
                    <ChevronDown
                        size={18}
                        className={cn(
                            'transition-transform duration-300',
                            isExpanded && 'rotate-180'
                        )}
                    />
                </button>
            </div>
        </section>
    );
}
