'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// METHODOLOGY CARD - CATEGORY AUDIT INFO
// ============================================

interface MethodologyCardProps {
    categoryName: string;
    categorySlug: string;
}

// Dynamic methodology content per category
const METHODOLOGY_CONTENT: Record<string, {
    intro: string;
    criteria: string[];
    protocolLink?: string;
}> = {
    tv: {
        intro: 'Auditamos contraste, reflexo em sala clara, input lag para games e durabilidade do painel.',
        criteria: [
            '🔬 Medições de RTINGS.com (laboratório)',
            '🇧🇷 Reviews de 1 ano no YouTube Brasil',
            '📊 Nota no Reclame Aqui (pós-venda)',
            '🎮 Testes de gaming: VRR, 120Hz, latência',
        ],
        protocolLink: '/metodologia/tvs',
    },
    fridge: {
        intro: 'Testamos durabilidade do compressor, consumo real de energia e custo de manutenção no Brasil.',
        criteria: [
            '⚡ Selo Procel e consumo kWh/mês',
            '🔧 Custo médio de reparo no BR',
            '📊 Histórico de reclamações (Reclame Aqui)',
            '❄️ Tecnologias de conservação',
        ],
        protocolLink: '/metodologia/geladeiras',
    },
    notebook: {
        intro: 'Avaliamos gestão térmica, tela em ambiente BR, teclado ABNT2 e suporte local.',
        criteria: [
            '🌡️ Throttling sob carga (Cinebench)',
            '🖥️ Brilho para uso externo',
            '⌨️ Layout teclado ABNT2',
            '🛡️ Garantia e assistência no Brasil',
        ],
        protocolLink: '/metodologia/notebooks',
    },
    smartphone: {
        intro: 'Focamos em bateria real, câmera em condições BR e longevidade de atualizações.',
        criteria: [
            '🔋 Ciclo de bateria após 1 ano',
            '📷 Fotos em luz solar tropical',
            '📲 Política de updates',
            '🛡️ Custo de reparo (tela/bateria)',
        ],
        protocolLink: '/metodologia/smartphones',
    },
    air_conditioner: {
        intro: 'Testamos eficiência energética real, ruído noturno e durabilidade de componentes.',
        criteria: [
            '⚡ Consumo real vs etiqueta',
            '🔇 Ruído em modo sleep (dB)',
            '🔧 Componentes de cobre vs alumínio',
            '📊 Nota pós-venda Reclame Aqui',
        ],
        protocolLink: '/metodologia/ar-condicionados',
    },
};

// Default content for categories without specific methodology
const DEFAULT_METHODOLOGY = {
    intro: 'Aplicamos nossa metodologia Consenso 360º para avaliar qualidade, custo-benefício e satisfação real.',
    criteria: [
        '🔬 Análise técnica de especificações',
        '🇧🇷 Reviews de usuários brasileiros',
        '📊 Satisfação pós-venda (Reclame Aqui)',
        '💰 Custo-benefício real no mercado BR',
    ],
    protocolLink: '/metodologia',
};

export function MethodologyCard({ categoryName, categorySlug }: MethodologyCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Get methodology content for this category
    const content = METHODOLOGY_CONTENT[categorySlug] || DEFAULT_METHODOLOGY;

    return (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 overflow-hidden">
            {/* Header - Always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'w-full flex items-center justify-between p-4 text-left',
                    'hover:bg-white/50 transition-colors'
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-xl">🔬</span>
                    </div>
                    <div>
                        <h3 className="font-display font-semibold text-text-primary text-sm md:text-base">
                            Como auditamos {categoryName}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                            {content.intro.slice(0, 60)}...
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-core font-medium hidden sm:inline">
                        {isExpanded ? 'Ocultar' : 'Ver protocolo'}
                    </span>
                    {isExpanded ? (
                        <ChevronUp size={18} className="text-slate-400" />
                    ) : (
                        <ChevronDown size={18} className="text-slate-400" />
                    )}
                </div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-slate-200/50">
                            <p className="text-sm text-text-secondary mb-4">
                                {content.intro}
                            </p>

                            {/* Criteria List */}
                            <ul className="space-y-2 mb-4">
                                {content.criteria.map((criterion, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-text-primary">
                                        <span>{criterion}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Protocol Info (inline instead of link) */}
                            <div className={cn(
                                'inline-flex items-center gap-2 px-4 py-2',
                                'bg-brand-core/10 text-brand-core rounded-lg',
                                'text-sm font-medium'
                            )}>
                                <span>📋 Protocolo baseado na Metodologia Consenso 360º</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
