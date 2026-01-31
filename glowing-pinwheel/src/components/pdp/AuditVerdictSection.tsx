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

// CT Semantic class map - Audit Style (border-left + subtle tint)
const ctClassMap = {
    emerald: {
        callout: 'ct-callout ct-callout--success',
        badge: 'ct-badge ct-badge--success',
        icon: 'text-emerald-600',
    },
    amber: {
        callout: 'ct-callout ct-callout--warning',
        badge: 'ct-badge ct-badge--warning',
        icon: 'text-amber-600',
    },
    blue: {
        callout: 'ct-callout ct-callout--info',
        badge: 'ct-badge ct-badge--info',
        icon: 'text-slate-600',
    },
    red: {
        callout: 'ct-callout ct-callout--danger',
        badge: 'ct-badge ct-badge--danger',
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
    color: keyof typeof ctClassMap;
    items: string[];
}) {
    const IconComponent = iconMap[icon as keyof typeof iconMap] || CheckCircle;
    const ctClasses = ctClassMap[color] || ctClassMap.blue;

    return (
        <div className={`${ctClasses.callout} h-full`}>
            <div className="flex items-start gap-3">
                <IconComponent size={20} className={`${ctClasses.icon} flex-shrink-0 mt-0.5`} />
                <div>
                    <h3 className="font-semibold text-ct-text text-sm mb-2">
                        <span className={`${ctClasses.badge} mr-2`}>
                            {icon === 'checkCircle' && '✓ '}
                            {icon === 'alertTriangle' && '⚠ '}
                            {icon === 'xCircle' && '✕ '}
                            {title.toUpperCase()}
                        </span>
                    </h3>
                    <ul className="space-y-1">
                        {items.map((item, idx) => (
                            <li key={idx} className="text-sm text-ct-text flex items-start gap-2">
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${ctClasses.icon} flex-shrink-0`} style={{ backgroundColor: 'currentColor' }} />
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
    color: keyof typeof ctClassMap;
}) {
    const ctClasses = ctClassMap[color] || ctClassMap.blue;

    return (
        <div className={`${ctClasses.callout} h-full`}>
            <div className="flex items-start gap-3">
                <Clipboard size={20} className={`${ctClasses.icon} flex-shrink-0 mt-0.5`} />
                <div>
                    <h3 className="font-semibold text-ct-text text-sm mb-1">
                        <span className={`${ctClasses.badge}`}>{title.toUpperCase()}</span>
                    </h3>
                    <p className="text-sm text-ct-text leading-relaxed mt-2">{text}</p>
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
                    color={data.technicalConclusion.color as keyof typeof ctClassMap}
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
                            color={data.technicalConclusion.color as keyof typeof ctClassMap}
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
