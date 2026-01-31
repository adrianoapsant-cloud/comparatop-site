'use client';

/**
 * ContextualCalculatorWidget
 * 
 * Shows a calculator widget on product pages, pre-filled with the product's dimensions/specs.
 * Supports TV, Fridge, AC, Monitor, Notebook, Lavadora, and Robot Vacuum categories.
 */

import { ToolTrigger, ToolGrid, GeometryToolTrigger, VisualComparisonTrigger } from '@/components/ui/ToolTrigger';
import { GeometryEngine } from '@/components/engines/GeometryEngine';
import { RateEngine } from '@/components/engines/RateEngine';
import { ComparisonEngine } from '@/components/engines/ComparisonEngine';
import { ModuleFallback } from '@/components/pdp/ModuleFallback';
import type { Product } from '@/types/category';

// Import tool configs
import {
    TV_CABE_ESTANTE,
    GELADEIRA_PASSA_PORTA,
    CALCULADORA_BTU,
    MONITOR_CABE_MESA,
    NOTEBOOK_CABE_MOCHILA,
    LAVADORA_PASSA_PORTA,
    ROBO_PASSA_MOVEL,
    OLED_VS_LED,
} from '@/lib/tools-config';

export interface ContextualCalculatorWidgetProps {
    product: Product;
}

export function ContextualCalculatorWidget({ product }: ContextualCalculatorWidgetProps) {
    const categoryId = product.categoryId;
    const specs = (product.specs || product.technicalSpecs || {}) as Record<string, unknown>;
    const attrs = (product.attributes || {}) as Record<string, unknown>;

    // TV - Show tools as teaser cards that open in modals
    if (categoryId === 'tv') {
        const width = Number(specs.width || specs.widthCm || attrs.width) || 145;
        const height = Number(specs.height || specs.heightCm || attrs.height) || 84;
        const depth = Number(specs.depth || specs.depthCm || attrs.depth) || 28;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    {/* Geometry Tool - Opens in Modal */}
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={TV_CABE_ESTANTE}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>

                    {/* OLED vs LED Comparison - Opens in Modal */}
                    <VisualComparisonTrigger>
                        <ComparisonEngine config={OLED_VS_LED} />
                    </VisualComparisonTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Fridge - Show "Geladeira passa na porta?" in modal
    if (categoryId === 'fridge' || categoryId === 'geladeira') {
        const width = Number(specs.width || specs.widthCm || attrs.width) || 90;
        const height = Number(specs.height || specs.heightCm || attrs.height) || 180;
        const depth = Number(specs.depth || specs.depthCm || attrs.depth) || 75;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={GELADEIRA_PASSA_PORTA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Air Conditioner - Show BTU Calculator in modal
    if (categoryId === 'air_conditioner' || categoryId === 'ar-condicionado') {
        const btus = Number(specs.btus || attrs.btus || attrs.btuCapacity) || 12000;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <ToolTrigger
                        type="calculator"
                        title="Esse BTU é suficiente?"
                        description={`Este aparelho tem ${btus.toLocaleString('pt-BR')} BTUs. Calcule se é ideal para seu ambiente.`}
                        badge="Calculadora"
                        modalTitle="Calculadora de BTU"
                    >
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">❄️</span>
                                <div>
                                    <div className="font-semibold text-blue-700">
                                        Este aparelho tem {btus.toLocaleString('pt-BR')} BTUs
                                    </div>
                                    <p className="text-xs text-blue-600">
                                        Compare com o resultado da calculadora abaixo
                                    </p>
                                </div>
                            </div>
                        </div>
                        <RateEngine
                            config={CALCULADORA_BTU}
                            showRecommendations={false}
                        />
                    </ToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Monitor - Show "Monitor cabe na mesa?" in modal
    if (categoryId === 'monitor') {
        const width = Number(specs.width || attrs.width) || 61;
        const height = Number(specs.height || attrs.height) || 45;
        const depth = Number(specs.depth || attrs.depth) || 20;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={MONITOR_CABE_MESA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Notebook - Show "Notebook cabe na mochila?" in modal
    if (categoryId === 'notebook' || categoryId === 'laptop') {
        const width = Number(specs.width || attrs.width) || 36;
        const height = Number(specs.thickness || attrs.thickness || specs.height) || 2.5;
        const depth = Number(specs.depth || attrs.depth) || 25;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={NOTEBOOK_CABE_MOCHILA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Lavadora - Show "Lavadora passa na porta?" in modal
    if (categoryId === 'lavadora' || categoryId === 'washing_machine') {
        const width = Number(specs.width || attrs.width) || 65;
        const height = Number(specs.height || attrs.height) || 110;
        const depth = Number(specs.depth || attrs.depth) || 65;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={LAVADORA_PASSA_PORTA}
                            initialObjectDims={{ width, height, depth }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Robot Vacuum - Show "Robô passa sob os móveis?" in modal
    if (categoryId === 'robot-vacuum') {
        const height = Number(specs.height || attrs.height) || 7.5;
        const diameter = Number(specs.diameter || attrs.diameter || specs.width) || 33;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <ToolGrid>
                    <GeometryToolTrigger>
                        <GeometryEngine
                            config={ROBO_PASSA_MOVEL}
                            initialObjectDims={{ width: diameter, height: height }}
                            readonlyObject={true}
                            showRecommendations={false}
                        />
                    </GeometryToolTrigger>
                </ToolGrid>
            </div>
        );
    }

    // Air Fryer - Show capacity/portion calculator
    if (categoryId === 'air_fryer' || categoryId === 'airfryer') {
        const capacity = Number(specs.capacity || attrs.capacity) || 4;

        return (
            <div className="py-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                    🛠️ Ferramentas Interativas
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🍳</span>
                        <div>
                            <div className="font-semibold text-amber-800">
                                Capacidade: {capacity}L
                            </div>
                            <p className="text-sm text-amber-700">
                                Ideal para preparar até {Math.round(capacity * 0.8)}kg de alimentos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Category not supported yet - return null (no fallback needed, calculators are optional)
    return null;
}

export default ContextualCalculatorWidget;
