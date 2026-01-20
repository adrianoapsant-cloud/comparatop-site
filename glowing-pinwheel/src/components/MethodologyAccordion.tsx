'use client';

import { useState } from 'react';
import { Shield, ChevronDown, FlaskConical, Star, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface MethodologyAccordionProps {
    productName: string;
    className?: string;
}

interface TrustSource {
    name: string;
    url?: string;
}

interface TrustLayer {
    id: string;
    icon: React.ReactNode;
    title: string;
    color: string;
    description: string;
    sources: TrustSource[];
    objective: string;
}

// ============================================
// TRUST LAYERS DATA - Consenso 360º
// ============================================

const TRUST_LAYERS: TrustLayer[] = [
    {
        id: 'technical',
        icon: <FlaskConical size={16} />,
        title: 'ANÁLISE TÉCNICA',
        color: 'text-blue-600',
        description: 'Validamos especificações de painel e colorimetria com dados brutos',
        sources: [
            { name: 'DisplaySpecifications', url: 'https://displayspecifications.com' },
            { name: 'RTINGS', url: 'https://rtings.com' },
        ],
        objective: 'Dados objetivos de laboratório para eliminar marketing enganoso',
    },
    {
        id: 'expert',
        icon: <Star size={16} />,
        title: 'CRÍTICA ESPECIALIZADA',
        color: 'text-amber-600',
        description: 'Comparamos nossa avaliação com os vereditos editoriais de gigantes',
        sources: [
            { name: 'TechRadar', url: 'https://techradar.com' },
            { name: 'The Verge', url: 'https://theverge.com' },
        ],
        objective: 'Eliminar vieses de marca com perspectivas internacionais',
    },
    {
        id: 'real-world',
        icon: <Users size={16} />,
        title: 'VIVÊNCIA REAL E LONGO PRAZO',
        color: 'text-green-600',
        description: 'Fichas técnicas são frias. Analisamos centenas de horas de reviews de donos',
        sources: [
            { name: 'YouTube', url: 'https://youtube.com' },
            { name: 'Reddit', url: 'https://reddit.com' },
            { name: 'HT Forum', url: 'https://htforum.com' },
        ],
        objective: 'Identificar padrões de defeitos e reclamações que se repetem',
    },
    {
        id: 'post-sale',
        icon: <CheckCircle size={16} />,
        title: 'AUDITORIA DE PÓS-VENDA',
        color: 'text-purple-600',
        description: 'Auditamos a satisfação de pós-venda para garantir que você não tenha dor de cabeça',
        sources: [
            { name: 'Amazon', url: 'https://amazon.com.br' },
            { name: 'Mercado Livre', url: 'https://mercadolivre.com.br' },
        ],
        objective: 'Garantir entrega e suporte confiáveis',
    },
];

// ============================================
// SOURCE BADGE COMPONENT
// ============================================

function SourceBadge({ source }: { source: TrustSource }) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-md',
                'bg-gray-100 text-gray-700 text-xs font-medium',
                'border border-gray-200',
                'transition-colors hover:bg-gray-200 hover:border-gray-300'
            )}
        >
            {source.name}
        </span>
    );
}

// ============================================
// TRUST LAYER ROW COMPONENT
// ============================================

function TrustLayerRow({ layer, index }: { layer: TrustLayer; index: number }) {
    return (
        <div
            className={cn(
                'py-4',
                index > 0 && 'border-t border-gray-100'
            )}
        >
            {/* Layer Header */}
            <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full',
                    'bg-gray-100 text-gray-600 text-xs font-bold'
                )}>
                    {index + 1}
                </span>
                <span className={cn('font-semibold text-sm', layer.color)}>
                    {layer.icon}
                </span>
                <span className={cn('font-semibold text-sm', layer.color)}>
                    {layer.title}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary mb-3 pl-8">
                {layer.description}
            </p>

            {/* Sources */}
            <div className="flex flex-wrap gap-2 pl-8 mb-2">
                {layer.sources.map((source, idx) => (
                    <SourceBadge key={idx} source={source} />
                ))}
            </div>

            {/* Objective (Mobile: hidden, Desktop: visible) */}
            <p className="text-xs text-text-muted pl-8 hidden sm:block">
                <span className="text-brand-core">✓</span> {layer.objective}
            </p>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function MethodologyAccordion({ productName, className }: MethodologyAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const sourceCount = TRUST_LAYERS.reduce((acc, layer) => acc + layer.sources.length, 0);
    const sourcePreview = 'RTINGS, YouTube, Amazon e mais';

    return (
        <section
            className={cn('methodology-accordion', className)}
            aria-label={`Metodologia de análise do ${productName}`}
        >
            <details
                className={cn(
                    'group rounded-xl border border-gray-200 bg-white overflow-hidden',
                    'transition-shadow hover:shadow-md',
                    '[&[open]]:shadow-lg [&[open]]:border-brand-core/30'
                )}
                onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
            >
                {/* ======================== */}
                {/* SUMMARY - Clickable Header (50-60px) */}
                {/* ======================== */}
                <summary
                    className={cn(
                        'flex items-center justify-between p-4 cursor-pointer',
                        'bg-gradient-to-r from-gray-50 to-white',
                        'hover:from-gray-100 hover:to-gray-50',
                        'transition-colors select-none',
                        'list-none [&::-webkit-details-marker]:hidden'
                    )}
                >
                    <div className="flex items-center gap-3">
                        {/* Shield Icon */}
                        <div className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-full',
                            'bg-brand-core/10 text-brand-core'
                        )}>
                            <Shield size={20} />
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                            <h3 className="font-bold text-text-primary text-sm sm:text-base">
                                Metodologia Consenso 360º
                            </h3>
                            <p className="text-xs text-text-muted">
                                {sourceCount} fontes verificadas • {sourcePreview}
                            </p>
                        </div>
                    </div>

                    {/* Expand/Collapse */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-brand-core font-medium hidden sm:inline">
                            {isOpen ? 'Fechar' : 'Ver como auditamos'}
                        </span>
                        <ChevronDown
                            size={18}
                            className={cn(
                                'text-brand-core transition-transform duration-300',
                                'group-open:rotate-180'
                            )}
                        />
                    </div>
                </summary>

                {/* ======================== */}
                {/* CONTENT - Expanded State */}
                {/* ======================== */}
                <div
                    className={cn(
                        'px-4 pb-4 border-t border-gray-100',
                        'animate-in slide-in-from-top-2 duration-300'
                    )}
                >
                    {/* Intro */}
                    <p className="text-sm text-text-secondary py-4 border-b border-gray-100">
                        Nossa metodologia de <strong>"Consenso 360º"</strong> blinda você contra o
                        marketing enganoso cruzando <strong>três camadas de dados</strong>:
                    </p>

                    {/* Trust Layers */}
                    <div className="space-y-0">
                        {TRUST_LAYERS.map((layer, idx) => (
                            <TrustLayerRow key={layer.id} layer={layer} index={idx} />
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <div className={cn(
                        'mt-4 p-3 rounded-lg',
                        'bg-amber-50 border-l-4 border-amber-400'
                    )}>
                        <p className="text-xs text-amber-800">
                            <strong>O resultado abaixo ignora a propaganda das marcas</strong> e foca
                            exclusivamente no que entrega valor real para o seu bolso.
                        </p>
                    </div>
                </div>
            </details>
        </section>
    );
}

export default MethodologyAccordion;
