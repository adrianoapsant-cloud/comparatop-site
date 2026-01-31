'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, Maximize, Monitor, Zap, Ruler, Calculator, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import engines to avoid SSR issues
const GeometryEngine = dynamic(
    () => import('@/components/engines/GeometryEngine').then(mod => mod.GeometryEngine),
    { ssr: false, loading: () => <div className="p-8 text-center text-slate-500">Carregando calculadora...</div> }
);

const RateEngine = dynamic(
    () => import('@/components/engines/RateEngine').then(mod => mod.RateEngine),
    { ssr: false, loading: () => <div className="p-8 text-center text-slate-500">Carregando calculadora...</div> }
);

// Import auto-selection system
import { getToolsForCategory, type AutoTool } from '@/lib/category-tools-map';

// Import all tool configs for config lookup
import * as toolsConfig from '@/lib/tools-config';

/**
 * CalculatorsSection
 * 
 * Renderiza ferramentas interativas/calculadoras automaticamente baseado na categoria.
 * 
 * MODO SIMPLES (recomendado):
 *   <CalculatorsSection category="robot-vacuum" />
 * 
 * MODO MANUAL (override):
 *   <CalculatorsSection tools={[...]} />
 */

interface CalculatorsSectionProps {
    /** Categoria do produto - auto-seleciona ferramentas */
    category?: string;
    /** Override manual das ferramentas (opcional) */
    tools?: AutoTool[];
    /** Dimensões do produto para pré-preencher calculadoras */
    productDimensions?: {
        width?: number;
        height?: number;
        depth?: number;
        diameter?: number;
    };
}

const iconMap: Record<string, React.ElementType> = {
    ruler: Ruler,
    monitor: Monitor,
    zap: Zap,
    maximize: Maximize,
    calculator: Calculator,
};

const badgeColorMap: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
};

// Get config by ID from tools-config
function getConfigById(configId: string): any {
    // Convert kebab-case to SCREAMING_SNAKE_CASE
    const configKey = configId.toUpperCase().replace(/-/g, '_');
    return (toolsConfig as any)[configKey] || null;
}

// Render the appropriate engine based on config type
function renderToolContent(configId: string, productDimensions?: any) {
    const config = getConfigById(configId);

    if (!config) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    🚧 Ferramenta em desenvolvimento
                </p>
            </div>
        );
    }

    if (config.engine === 'GeometryEngine') {
        const initialObjectDims = productDimensions ? {
            width: productDimensions.diameter || productDimensions.width,
            height: productDimensions.height,
            depth: productDimensions.depth,
        } : undefined;

        return (
            <GeometryEngine
                config={config}
                initialObjectDims={initialObjectDims}
                readonlyObject={!!initialObjectDims}
                showRecommendations={true}
            />
        );
    }

    if (config.engine === 'RateEngine') {
        return <RateEngine config={config} />;
    }

    return null;
}

// Tool modal component
function ToolModal({
    isOpen,
    onClose,
    tool,
    productDimensions
}: {
    isOpen: boolean;
    onClose: () => void;
    tool: AutoTool;
    productDimensions?: CalculatorsSectionProps['productDimensions'];
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50 flex flex-col md:inset-4 md:rounded-2xl overflow-hidden bg-white dark:bg-slate-900"
                    >
                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500">
                            <h2 className="font-bold text-lg text-white">{tool.title}</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 md:p-6">
                            {renderToolContent(tool.configRef, productDimensions)}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function CalculatorsSection({
    category,
    tools: manualTools,
    productDimensions
}: CalculatorsSectionProps) {
    const [openToolId, setOpenToolId] = useState<string | null>(null);

    // Auto-select tools by category, or use manual override
    const tools = useMemo(() => {
        if (manualTools && manualTools.length > 0) return manualTools;
        if (category) return getToolsForCategory(category);
        return [];
    }, [category, manualTools]);

    if (tools.length === 0) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[CalculatorsSection] Hidden: no tools for category', category);
        }
        return null;
    }

    const openTool = tools.find(t => t.id === openToolId);

    return (
        <section className="py-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⚙️</span>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    Calculadoras Interativas
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => {
                    const IconComponent = iconMap[tool.icon] || Zap;
                    const badgeColorClass = badgeColorMap[tool.badgeColor || 'orange'];

                    return (
                        <button
                            key={tool.id}
                            onClick={() => setOpenToolId(tool.id)}
                            className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                    <IconComponent className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {tool.title}
                                        </span>
                                        {tool.badge && (
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeColorClass}`}>
                                                {tool.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                        </button>
                    );
                })}
            </div>

            {openTool && (
                <ToolModal
                    isOpen={!!openToolId}
                    onClose={() => setOpenToolId(null)}
                    tool={openTool}
                    productDimensions={productDimensions}
                />
            )}
        </section>
    );
}

export default CalculatorsSection;
