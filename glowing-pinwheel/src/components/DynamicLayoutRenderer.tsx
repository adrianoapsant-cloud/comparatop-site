'use client';

// ============================================================================
// DYNAMIC LAYOUT RENDERER
// ============================================================================
// Motor de Layout Adaptativo para Zona Variante da Página de Produto
// Renderiza componentes dinamicamente baseado na configuração recebida
// ============================================================================

import React, { useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type {
    DynamicLayoutRendererProps,
    DynamicLayoutConfig,
    DynamicComponentType,
    SlotConfig,
    DnaChartProps,
    VerdictProps,
    SimulatorsProps,
    SpecsProps,
    BundleProps,
} from '@/types/dynamic-layout';

// ============================================
// PLACEHOLDER COMPONENTS
// ============================================
// Estes são componentes temporários. Substituir pelos componentes reais
// quando disponíveis, mantendo as mesmas props.

/**
 * DNA Chart Placeholder - Gráfico Radar de Scores
 */
function DnaChartPlaceholder({ variant, productData }: DnaChartProps) {
    const variantStyles = {
        visual: 'from-violet-500/10 to-purple-500/10 border-violet-200',
        technical: 'from-blue-500/10 to-cyan-500/10 border-blue-200',
        gamer: 'from-green-500/10 to-emerald-500/10 border-green-200',
    };

    const variantLabels = {
        visual: '🎨 Visual Mode',
        technical: '⚙️ Technical Mode',
        gamer: '🎮 Gamer Mode',
    };

    return (
        <div className={cn(
            'p-6 rounded-2xl bg-gradient-to-br border-2',
            variantStyles[variant]
        )}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">DNA do Produto</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-white/80 font-medium">
                    {variantLabels[variant]}
                </span>
            </div>

            {/* Placeholder Radar Chart */}
            <div className="aspect-square max-w-[300px] mx-auto bg-white/50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-sm text-gray-500">Radar Chart</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Product: {(productData as { name?: string })?.name || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Verdict Placeholder - Veredicto da Análise
 */
function VerdictPlaceholder({ variant, productData }: VerdictProps) {
    const isFull = variant === 'full';

    return (
        <div className={cn(
            'p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200',
            !isFull && 'p-4'
        )}>
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚖️</span>
                <h3 className={cn('font-bold text-gray-900', isFull ? 'text-lg' : 'text-base')}>
                    Veredito da Auditoria
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                    {variant === 'full' ? 'Completo' : 'Resumo'}
                </span>
            </div>

            <div className={cn('grid gap-4', isFull ? 'md:grid-cols-2' : 'grid-cols-1')}>
                {/* Prós */}
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
                        <span>✅</span> A Solução
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                        <li>• Placeholder insight 1</li>
                        <li>• Placeholder insight 2</li>
                        {isFull && <li>• Placeholder insight 3</li>}
                    </ul>
                </div>

                {/* Contras */}
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                    <h4 className="font-semibold text-rose-700 mb-2 flex items-center gap-1.5">
                        <span>⚠️</span> Ponto de Atenção
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                        <li>• Placeholder concern 1</li>
                        {isFull && <li>• Placeholder concern 2</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

/**
 * Simulators Placeholder - Simuladores Inteligentes
 */
function SimulatorsPlaceholder({ variant, productData }: SimulatorsProps) {
    const isCards = variant === 'cards';

    const mockSimulators = [
        { icon: '📺', title: 'Tamanho da Tela', status: 'ideal' },
        { icon: '🔊', title: 'Qualidade de Áudio', status: 'warning' },
        { icon: '⚡', title: 'Consumo Energético', status: 'good' },
    ];

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-bold text-gray-900">Simuladores Inteligentes</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-medium">
                    {isCards ? 'Cards' : 'Compacto'}
                </span>
            </div>

            <div className={cn(
                'gap-3',
                isCards ? 'grid md:grid-cols-3' : 'flex flex-wrap'
            )}>
                {mockSimulators.map((sim, i) => (
                    <div
                        key={i}
                        className={cn(
                            'bg-white rounded-xl border border-gray-100 shadow-sm',
                            isCards ? 'p-4' : 'px-3 py-2 flex items-center gap-2'
                        )}
                    >
                        <span className={cn(isCards ? 'text-2xl mb-2 block' : 'text-lg')}>
                            {sim.icon}
                        </span>
                        <span className="font-medium text-sm text-gray-700">{sim.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Specs Placeholder - Ficha Técnica
 */
function SpecsPlaceholder({ variant, productData }: SpecsProps) {
    const isTable = variant === 'table_interactive';

    const mockSpecs = [
        { label: 'Modelo', value: 'XYZ-1234' },
        { label: 'Capacidade', value: '518L' },
        { label: 'Voltagem', value: 'Bivolt' },
        { label: 'Consumo', value: '42 kWh/mês' },
    ];

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📋</span>
                <h3 className="text-lg font-bold text-gray-900">Ficha Técnica Completa</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                    {isTable ? 'Tabela Interativa' : 'Lista'}
                </span>
            </div>

            {isTable ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <tbody>
                            {mockSpecs.map((spec, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-600">{spec.label}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{spec.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <ul className="space-y-2">
                    {mockSpecs.map((spec, i) => (
                        <li key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-600">{spec.label}</span>
                            <span className="text-sm font-semibold text-gray-900">{spec.value}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

/**
 * Bundle Placeholder - Widget de Cross-Sell
 */
function BundlePlaceholder({ variant, productData }: BundleProps) {
    const isHorizontal = variant === 'horizontal';

    return (
        <div className={cn(
            'p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200',
            isHorizontal ? 'flex items-center gap-6' : ''
        )}>
            <div className={cn(!isHorizontal && 'mb-4')}>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <h3 className="text-lg font-bold text-gray-900">Acessório Recomendado</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Maximize sua experiência com este combo
                </p>
            </div>

            <div className={cn(
                'bg-white rounded-xl p-4 border border-emerald-100 shadow-sm',
                isHorizontal ? 'flex items-center gap-4 flex-1' : ''
            )}>
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📦</span>
                </div>
                <div className={cn(isHorizontal ? '' : 'mt-3')}>
                    <p className="font-medium text-gray-900">Acessório Bundle</p>
                    <p className="text-sm text-emerald-600 font-bold">+ R$ 129,00</p>
                </div>
                <button className={cn(
                    'px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold',
                    'hover:bg-emerald-700 transition-colors',
                    isHorizontal ? 'ml-auto' : 'w-full mt-3'
                )}>
                    Adicionar
                </button>
            </div>
        </div>
    );
}

// ============================================
// COMPONENT REGISTRY
// ============================================

type ComponentType = React.ComponentType<{
    variant: string;
    productData: Record<string, unknown>;
}>;

/**
 * Registry mapeando tipos de componente para implementações
 * Substituir placeholders por componentes reais quando disponíveis
 */
const COMPONENT_REGISTRY: Record<DynamicComponentType, ComponentType> = {
    dna_chart: DnaChartPlaceholder as ComponentType,
    verdict: VerdictPlaceholder as ComponentType,
    simulators: SimulatorsPlaceholder as ComponentType,
    specs: SpecsPlaceholder as ComponentType,
    bundle: BundlePlaceholder as ComponentType,
};

/**
 * IDs semânticos para scroll anchors
 */
const SECTION_IDS: Record<DynamicComponentType, string> = {
    dna_chart: 'dna-produto',
    verdict: 'veredito',
    simulators: 'simuladores',
    specs: 'ficha-tecnica',
    bundle: 'bundle-acessorio',
};

/**
 * Labels de acessibilidade para cada seção
 */
const SECTION_LABELS: Record<DynamicComponentType, string> = {
    dna_chart: 'Análise DNA do Produto',
    verdict: 'Veredito da Auditoria',
    simulators: 'Simuladores Inteligentes',
    specs: 'Especificações Técnicas',
    bundle: 'Acessório Recomendado',
};

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * DynamicLayoutRenderer
 * 
 * Motor de renderização para a Zona Variante da página de produto.
 * Renderiza componentes dinamicamente baseado na configuração recebida,
 * permitindo A/B testing e personalização por contexto de usuário.
 * 
 * @example
 * ```tsx
 * <DynamicLayoutRenderer
 *   config={{
 *     order: [
 *       { type: 'dna_chart', variant: 'visual' },
 *       { type: 'verdict', variant: 'full' },
 *       { type: 'simulators', variant: 'cards' },
 *     ],
 *     layoutVariant: 'default'
 *   }}
 *   productData={product}
 * />
 * ```
 */
export function DynamicLayoutRenderer({
    config,
    productData,
    className,
}: DynamicLayoutRendererProps) {

    /**
     * Gera o ID da seção (custom ou padrão)
     */
    const getSectionId = useCallback((slot: SlotConfig): string => {
        return slot.id || SECTION_IDS[slot.type];
    }, []);

    /**
     * Filtra slots baseado em condições
     */
    const filteredSlots = useMemo(() => {
        return config.order.filter(slot => slot.condition !== false);
    }, [config.order]);

    /**
     * Renderiza um slot individual
     */
    const renderSlot = useCallback((slot: SlotConfig, index: number) => {
        const Component = COMPONENT_REGISTRY[slot.type];

        if (!Component) {
            console.warn(`[DynamicLayoutRenderer] Unknown component type: ${slot.type}`);
            return null;
        }

        const sectionId = getSectionId(slot);
        const label = SECTION_LABELS[slot.type];

        return (
            <section
                key={`${slot.type}-${index}`}
                id={sectionId}
                aria-label={label}
                className={cn(
                    // Scroll margin for sticky header
                    'scroll-mt-24',
                    // Animation for staggered entrance
                    'animate-in fade-in-0 slide-in-from-bottom-4',
                    // Delay based on index for cascade effect
                    index === 0 ? 'duration-300' :
                        index === 1 ? 'duration-400 delay-75' :
                            index === 2 ? 'duration-500 delay-150' :
                                'duration-500 delay-200'
                )}
                data-component-type={slot.type}
                data-variant={slot.variant}
            >
                <Component
                    variant={slot.variant}
                    productData={productData}
                    {...(slot.props || {})}
                />
            </section>
        );
    }, [productData, getSectionId]);

    // Track layout variant for analytics
    const layoutDataAttrs = useMemo(() => ({
        'data-layout-variant': config.layoutVariant || 'default',
        'data-experiment-id': config.experimentId || undefined,
        'data-slot-count': filteredSlots.length.toString(),
    }), [config.layoutVariant, config.experimentId, filteredSlots.length]);

    return (
        <div
            className={cn(
                // Container styling
                'space-y-6 md:space-y-8',
                className
            )}
            {...layoutDataAttrs}
        >
            {filteredSlots.map((slot, index) => renderSlot(slot, index))}
        </div>
    );
}

// ============================================
// LAYOUT PRESET GENERATORS
// ============================================

/**
 * Gera configuração de layout padrão
 */
export function getDefaultLayoutConfig(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'dna_chart', variant: 'visual' },
            { type: 'verdict', variant: 'full' },
            { type: 'simulators', variant: 'cards' },
            { type: 'specs', variant: 'list' },
            { type: 'bundle', variant: 'horizontal' },
        ],
        layoutVariant: 'default',
    };
}

/**
 * Gera configuração focada em gamers
 */
export function getGamerLayoutConfig(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'dna_chart', variant: 'gamer' },
            { type: 'specs', variant: 'table_interactive' },
            { type: 'verdict', variant: 'summary' },
            { type: 'simulators', variant: 'cards' },
            { type: 'bundle', variant: 'horizontal' },
        ],
        layoutVariant: 'gamer_focused',
    };
}

/**
 * Gera configuração para decisão rápida (mobile)
 */
export function getQuickDecisionLayoutConfig(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'verdict', variant: 'summary' },
            { type: 'dna_chart', variant: 'visual' },
            { type: 'bundle', variant: 'horizontal' },
        ],
        layoutVariant: 'quick_decision',
    };
}

/**
 * Gera configuração para usuários focados em preço
 */
export function getBudgetLayoutConfig(): DynamicLayoutConfig {
    return {
        order: [
            { type: 'bundle', variant: 'horizontal' },
            { type: 'verdict', variant: 'full' },
            { type: 'dna_chart', variant: 'technical' },
            { type: 'specs', variant: 'list' },
        ],
        layoutVariant: 'budget_conscious',
    };
}

// ============================================
// EXPORTS
// ============================================

export default DynamicLayoutRenderer;

export {
    // Placeholders (para uso em desenvolvimento)
    DnaChartPlaceholder,
    VerdictPlaceholder,
    SimulatorsPlaceholder,
    SpecsPlaceholder,
    BundlePlaceholder,
    // Registry
    COMPONENT_REGISTRY,
    SECTION_IDS,
    SECTION_LABELS,
};
