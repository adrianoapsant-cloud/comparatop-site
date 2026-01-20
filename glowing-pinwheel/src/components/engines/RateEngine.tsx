'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Calculator, Zap, AlertCircle, ChevronRight, Star, ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { RateEngineConfig, InputConfig } from '@/lib/tools-config';
import { getACProductsForBTU, MockProduct } from '@/data/products-mock';
import { useToolStorage } from '@/hooks/useToolStorage';
import { BRAZIL_STATE_OPTIONS, getKwhPriceByState } from '@/data/energy-prices';

// ============================================
// RATE ENGINE - Universal Calculator Component
// ============================================
// Accepts a JSON config and auto-generates the UI and calculation logic.
// Used for: BTU Calculator, PSU Calculator, Energy Cost, etc.
// 
// FEATURES:
// - showRecommendations: Show product carousel based on result
// - initialValues: Pre-fill inputs (widget mode)
// - readonlyFields: Lock certain inputs
// - localStorage persistence via useToolStorage
// - Reset button to clear saved data
// - Regional pricing for energy calculations

interface RateEngineProps {
    config: RateEngineConfig;
    className?: string;
    // NEW: Show product recommendations based on result
    showRecommendations?: boolean;
    // NEW: Pre-fill values (for widget mode on product pages)
    initialValues?: Record<string, number | boolean | string>;
    // NEW: Fields that should be read-only (locked)
    readonlyFields?: string[];
    // NEW: Enable localStorage persistence
    enablePersistence?: boolean;
}

export function RateEngine({
    config,
    className,
    showRecommendations = true,
    initialValues: propInitialValues,
    readonlyFields = [],
    enablePersistence = true,
}: RateEngineProps) {
    // Initialize default values from config
    const defaultValues = useMemo(() => {
        const values: Record<string, number | boolean | string> = {};
        config.inputs.forEach(input => {
            values[input.id] = input.defaultValue ?? (input.type === 'boolean' ? false : 0);
        });
        // Merge with prop initial values
        if (propInitialValues) {
            Object.assign(values, propInitialValues);
        }
        return values;
    }, [config.inputs, propInitialValues]);

    // Use localStorage persistence if enabled
    const [persistedValues, setPersistedValues, resetPersistedValues] = useToolStorage(
        config.id,
        defaultValues
    );

    // Use persisted values if persistence is enabled, otherwise use state
    const [localValues, setLocalValues] = useState(defaultValues);

    const values = enablePersistence ? persistedValues : localValues;
    const setValues = enablePersistence ? setPersistedValues : setLocalValues;

    // Update values if propInitialValues changes
    useEffect(() => {
        if (propInitialValues) {
            setValues(prev => ({ ...prev, ...propInitialValues }));
        }
    }, [propInitialValues, setValues]);

    // Update a single input value with validation
    const updateValue = useCallback((id: string, value: number | boolean | string) => {
        // Don't update if field is readonly
        if (readonlyFields.includes(id)) return;

        // Prevent negative numbers
        if (typeof value === 'number' && value < 0) {
            value = 0;
        }

        setValues(prev => ({ ...prev, [id]: value }));
    }, [readonlyFields, setValues]);

    // Reset all values
    const handleReset = useCallback(() => {
        if (enablePersistence) {
            resetPersistedValues();
        } else {
            setLocalValues(defaultValues);
        }
    }, [enablePersistence, resetPersistedValues, defaultValues]);

    // Calculate result using the formula
    const result = useMemo(() => {
        try {
            // Create a function from the formula string
            const formula = config.formula;
            const paramNames = Object.keys(values);
            const paramValues = Object.values(values);

            // Add regional pricing helper to formula context
            const extendedNames = [...paramNames, 'getKwhPrice'];
            const extendedValues = [...paramValues, getKwhPriceByState];

            // eslint-disable-next-line no-new-func
            const calculate = new Function(...extendedNames, `return ${formula}`);
            const calculated = calculate(...extendedValues);

            return Math.round(calculated);
        } catch {
            console.error('Formula evaluation error');
            return 0;
        }
    }, [config.formula, values]);

    // Get recommendation text based on result
    const recommendation = useMemo(() => {
        if (!config.recommendations) return null;

        for (const rec of config.recommendations) {
            let match = false;
            switch (rec.operator) {
                case 'lt': match = result < rec.threshold; break;
                case 'lte': match = result <= rec.threshold; break;
                case 'eq': match = result === rec.threshold; break;
                case 'gte': match = result >= rec.threshold; break;
                case 'gt': match = result > rec.threshold; break;
            }
            if (match) return rec.text;
        }
        return null;
    }, [result, config.recommendations]);

    // Get recommended products based on result
    const recommendedProducts = useMemo(() => {
        if (!showRecommendations || !config.relatedProducts) return [];

        // Category-specific filtering
        if (config.relatedProducts.categoryId === 'air_conditioner') {
            return getACProductsForBTU(result).slice(0, 3);
        }

        return [];
    }, [result, showRecommendations, config.relatedProducts]);

    return (
        <div className={cn('bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden', className)}>
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-core to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Calculator size={24} />
                        <h2 className="font-display text-xl font-bold">{config.title}</h2>
                    </div>
                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white/90 hover:text-white"
                        title="Resetar calculadora"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
                <p className="text-white/80 text-sm">{config.description}</p>
            </div>

            {/* Inputs */}
            <div className="p-6 space-y-6">
                {config.inputs.map(input => (
                    <InputRenderer
                        key={input.id}
                        config={input}
                        value={values[input.id]}
                        onChange={(v) => updateValue(input.id, v)}
                        readonly={readonlyFields.includes(input.id)}
                    />
                ))}
            </div>

            {/* Result */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="text-center">
                    <div className="text-sm text-text-muted mb-1">{config.resultLabel}</div>
                    <div className="flex items-center justify-center gap-2">
                        <Zap className="text-yellow-500" size={28} />
                        <span className="font-display text-4xl font-bold text-text-primary">
                            {result.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-lg text-text-muted">{config.resultUnit}</span>
                    </div>
                </div>

                {/* Recommendation Text */}
                {recommendation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-blue-800">{recommendation}</p>
                        </div>
                    </div>
                )}

                {/* Product Recommendations Carousel */}
                {showRecommendations && recommendedProducts.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <Star size={16} className="text-yellow-500" />
                            Produtos ideais para este resultado:
                        </h3>
                        <div className="grid gap-3">
                            {recommendedProducts.map((product, idx) => (
                                <ProductRecommendationCard
                                    key={product.id}
                                    product={product}
                                    isBestMatch={idx === 0}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Fallback CTA if no recommendations */}
                {(!showRecommendations || recommendedProducts.length === 0) && config.relatedProducts && (
                    <div className="mt-4">
                        <Link
                            href={`/categorias/${config.relatedProducts.categoryId === 'air_conditioner' ? 'ar-condicionados' : config.relatedProducts.categoryId === 'fridge' ? 'geladeiras' : 'smart-tvs'}`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Ver produtos recomendados
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// PRODUCT RECOMMENDATION CARD
// ============================================

interface ProductRecommendationCardProps {
    product: MockProduct;
    isBestMatch?: boolean;
}

function ProductRecommendationCard({ product, isBestMatch }: ProductRecommendationCardProps) {
    return (
        <Link
            href={product.affiliateUrl || `/produto/${product.id}`}
            className={cn(
                'flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md',
                isBestMatch
                    ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
                    : 'bg-white border-gray-200 hover:border-gray-300'
            )}
        >
            {/* Product Image Placeholder */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❄️</span>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    {isBestMatch && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500 text-white rounded-full font-semibold">
                            MELHOR OPÇÃO
                        </span>
                    )}
                </div>
                <h4 className="font-semibold text-text-primary text-sm truncate">
                    {product.shortName}
                </h4>
                <div className="text-xs text-text-muted">
                    {product.specs.btus?.toLocaleString('pt-BR')} BTU • {product.brand}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-brand-core">
                        R$ {product.price.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                        ⭐ {product.score.toFixed(1)}
                    </span>
                </div>
            </div>

            {/* CTA */}
            <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                isBestMatch ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
            )}>
                <ExternalLink size={18} />
            </div>
        </Link>
    );
}

// ============================================
// INPUT RENDERER - Auto-generates inputs based on type
// ============================================

interface InputRendererProps {
    config: InputConfig;
    value: number | boolean | string;
    onChange: (value: number | boolean | string) => void;
    readonly?: boolean;
}

function InputRenderer({ config, value, onChange, readonly }: InputRendererProps) {
    switch (config.type) {
        case 'number':
        case 'slider':
            return (
                <div className={cn(readonly && 'opacity-60')}>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-text-primary">
                            {config.label}
                            {readonly && <span className="text-xs text-text-muted ml-2">(fixo)</span>}
                        </label>
                        <span className="text-sm font-semibold text-brand-core">
                            {value as number}{config.unit && ` ${config.unit}`}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={config.min ?? 0}
                        max={config.max ?? 100}
                        step={config.step ?? 1}
                        value={value as number}
                        onChange={(e) => onChange(Number(e.target.value))}
                        disabled={readonly}
                        className={cn(
                            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-core',
                            readonly && 'cursor-not-allowed'
                        )}
                    />
                    {(config.min !== undefined || config.max !== undefined) && (
                        <div className="flex justify-between mt-1 text-xs text-text-muted">
                            <span>{config.min ?? 0}{config.unit}</span>
                            <span>{config.max ?? 100}{config.unit}</span>
                        </div>
                    )}
                </div>
            );

        case 'boolean':
            return (
                <div className={cn(
                    'flex items-center justify-between p-4 bg-gray-50 rounded-lg',
                    readonly && 'opacity-60'
                )}>
                    <label className="text-sm font-medium text-text-primary">
                        {config.label}
                        {readonly && <span className="text-xs text-text-muted ml-2">(fixo)</span>}
                    </label>
                    <button
                        onClick={() => !readonly && onChange(!value)}
                        disabled={readonly}
                        className={cn(
                            'relative w-14 h-7 rounded-full transition-colors',
                            value ? 'bg-brand-core' : 'bg-gray-300',
                            readonly && 'cursor-not-allowed'
                        )}
                    >
                        <span
                            className={cn(
                                'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                                value ? 'translate-x-8' : 'translate-x-1'
                            )}
                        />
                    </button>
                </div>
            );

        case 'select':
            return (
                <div className={cn(readonly && 'opacity-60')}>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        {config.label}
                        {readonly && <span className="text-xs text-text-muted ml-2">(fixo)</span>}
                    </label>
                    <select
                        value={value as string}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Try to parse as number if options have numeric values
                            const numVal = Number(val);
                            onChange(isNaN(numVal) ? val : numVal);
                        }}
                        disabled={readonly}
                        className={cn(
                            'w-full p-3 border border-gray-200 rounded-lg bg-white text-text-primary focus:ring-2 focus:ring-brand-core focus:border-transparent',
                            readonly && 'cursor-not-allowed bg-gray-50'
                        )}
                    >
                        {config.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case 'region-select':
            // Special input type for Brazilian state selection with kWh prices
            return (
                <div className={cn(readonly && 'opacity-60')}>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        {config.label}
                        {readonly && <span className="text-xs text-text-muted ml-2">(fixo)</span>}
                    </label>
                    <select
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={readonly}
                        className={cn(
                            'w-full p-3 border border-gray-200 rounded-lg bg-white text-text-primary focus:ring-2 focus:ring-brand-core focus:border-transparent',
                            readonly && 'cursor-not-allowed bg-gray-50'
                        )}
                    >
                        <option value="">Selecione seu estado...</option>
                        {BRAZIL_STATE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {value && (
                        <div className="mt-2 text-xs text-emerald-600">
                            💡 Preço médio do kWh: R$ {getKwhPriceByState(value as string).toFixed(2)}
                        </div>
                    )}
                </div>
            );

        default:
            return null;
    }
}
