'use client';

import { useState, useMemo, useEffect } from 'react';
import { Ruler, Check, X, ChevronRight, Star, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { GeometryEngineConfig, DimensionInput as DimensionInputConfig } from '@/lib/tools-config';
import { getTVsForWidth, getFridgesForDoorWidth, MockProduct } from '@/data/products-mock';

// ============================================
// GEOMETRY ENGINE - Universal Dimension Comparator
// ============================================
// Compares object dimensions against container dimensions.
// Visual SVG representation shows if object fits.
//
// NEW FEATURES:
// - showRecommendations: Show compatible products
// - initialObjectDims: Pre-fill object dimensions (widget mode)
// - readonlyObject: Lock object dimensions

interface Dimensions {
    width: number;
    height: number;
    depth?: number;
}

// Helper to generate fallback links with dynamic container dimensions
function generateFailbackLink(config: GeometryEngineConfig, containerDims: Dimensions): string {
    if (config.failAction?.linkTemplate) {
        return config.failAction.linkTemplate
            .replace('{containerWidth}', containerDims.width.toString())
            .replace('{containerHeight}', containerDims.height.toString())
            .replace('{containerDepth}', (containerDims.depth || 0).toString());
    }

    // Default fallback links by category
    const categoryRoutes: Record<string, string> = {
        tv: `/categorias/smart-tvs?max_width=${containerDims.width}`,
        fridge: `/categorias/geladeiras?max_width=${containerDims.width}`,
        monitor: `/categorias/monitores?max_width=${containerDims.width}`,
    };

    return categoryRoutes[config.relatedProducts?.categoryId || ''] || '/categorias';
}

interface GeometryEngineProps {
    config: GeometryEngineConfig;
    className?: string;
    // NEW: Show product recommendations based on container size
    showRecommendations?: boolean;
    // NEW: Pre-fill object dimensions (for product page widgets)
    initialObjectDims?: Partial<Dimensions>;
    // NEW: Lock object dimensions (user only fills container)
    readonlyObject?: boolean;
    // NEW: Suggest alternatives when doesn't fit
    showAlternatives?: boolean;
}

export function GeometryEngine({
    config,
    className,
    showRecommendations = true,
    initialObjectDims,
    readonlyObject = false,
    showAlternatives = true,
}: GeometryEngineProps) {
    // Initialize object dimensions
    const [objectDims, setObjectDims] = useState<Dimensions>(() => {
        const dims: Dimensions = { width: 0, height: 0 };
        config.object.dimensions.forEach(d => {
            dims[d.id as keyof Dimensions] = d.defaultValue ?? 0;
        });
        // Merge with initial values if provided
        if (initialObjectDims) {
            Object.assign(dims, initialObjectDims);
        }
        return dims;
    });

    // Initialize container dimensions
    const [containerDims, setContainerDims] = useState<Dimensions>(() => {
        const dims: Dimensions = { width: 0, height: 0 };
        config.container.dimensions.forEach(d => {
            dims[d.id as keyof Dimensions] = d.defaultValue ?? 0;
        });
        return dims;
    });

    // Update object dims if initialObjectDims changes
    useEffect(() => {
        if (initialObjectDims) {
            setObjectDims(prev => ({ ...prev, ...initialObjectDims }));
        }
    }, [initialObjectDims]);

    // Update object dimension
    const updateObjectDim = (id: string, value: number) => {
        if (readonlyObject) return;
        setObjectDims(prev => ({ ...prev, [id]: value }));
    };

    // Update container dimension
    const updateContainerDim = (id: string, value: number) => {
        setContainerDims(prev => ({ ...prev, [id]: value }));
    };

    // Calculate fit result
    const fitResult = useMemo(() => {
        const marginRequired = config.marginRequired ?? 0;

        // Check each dimension
        const widthDiff = containerDims.width - objectDims.width;
        const heightDiff = containerDims.height - objectDims.height;
        const depthDiff = (containerDims.depth ?? 999) - (objectDims.depth ?? 0);

        const fitsWidth = widthDiff >= marginRequired;
        const fitsHeight = heightDiff >= marginRequired;
        const fitsDepth = depthDiff >= marginRequired;

        const fits = fitsWidth && fitsHeight && fitsDepth;

        // Calculate margin or missing amount
        const minMargin = Math.min(widthDiff, heightDiff, depthDiff);
        const missing = Math.max(-widthDiff, -heightDiff, -depthDiff);

        let message = fits
            ? config.successMessage.replace('{margin}', Math.round(minMargin / 2).toString())
            : config.failureMessage.replace('{missing}', Math.abs(Math.round(missing)).toString());

        // Generate specific failure reason based on which dimensions don't fit
        let failureReason = '';
        if (!fits) {
            const failedDims: string[] = [];
            if (!fitsWidth) failedDims.push('largura');
            if (!fitsHeight) failedDims.push('altura');
            if (objectDims.depth && !fitsDepth) failedDims.push('profundidade');

            if (failedDims.length === 1) {
                failureReason = `O problema é a ${failedDims[0]}.`;
            } else if (failedDims.length > 1) {
                failureReason = `Não cabe em ${failedDims.join(' e ')}.`;
            }
        }

        return { fits, margin: minMargin, missing, message, fitsWidth, fitsHeight, fitsDepth, failureReason };
    }, [objectDims, containerDims, config]);

    // Get recommended products that fit
    const recommendedProducts = useMemo(() => {
        if (!showRecommendations || !config.relatedProducts) return [];

        if (config.relatedProducts.categoryId === 'tv') {
            return getTVsForWidth(containerDims.width - (config.marginRequired ?? 0)).slice(0, 3);
        }
        if (config.relatedProducts.categoryId === 'fridge') {
            return getFridgesForDoorWidth(containerDims.width).slice(0, 3);
        }

        return [];
    }, [containerDims.width, showRecommendations, config]);

    return (
        <div className={cn('bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden', className)}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Ruler size={24} />
                    <h2 className="font-display text-xl font-bold">{config.title}</h2>
                </div>
                <p className="text-white/80 text-sm">{config.description}</p>
            </div>

            {/* Visual Comparison */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <FitVisualization
                    objectDims={objectDims}
                    containerDims={containerDims}
                    objectColor={config.object.color}
                    containerColor={config.container.color}
                    objectLabel={config.object.label}
                    containerLabel={config.container.label}
                    fits={fitResult.fits}
                />
            </div>

            {/* Inputs Grid */}
            <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Object Dimensions */}
                <div className={cn('space-y-4', readonlyObject && 'opacity-60')}>
                    <h3 className="font-semibold text-text-primary flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.object.color }} />
                        {config.object.label}
                        {readonlyObject && <span className="text-xs text-text-muted">(fixo)</span>}
                    </h3>
                    {config.object.dimensions.map(dim => (
                        <DimensionInput
                            key={dim.id}
                            config={dim}
                            value={objectDims[dim.id as keyof Dimensions] ?? 0}
                            onChange={(v) => updateObjectDim(dim.id, v)}
                            readonly={readonlyObject}
                        />
                    ))}
                </div>

                {/* Container Dimensions */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-text-primary flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.container.color }} />
                        {config.container.label}
                    </h3>
                    {config.container.dimensions.map(dim => (
                        <DimensionInput
                            key={dim.id}
                            config={dim}
                            value={containerDims[dim.id as keyof Dimensions] ?? 0}
                            onChange={(v) => updateContainerDim(dim.id, v)}
                        />
                    ))}
                </div>
            </div>

            {/* Result */}
            <div className={cn(
                'p-6 border-t',
                fitResult.fits ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            )}>
                <div className="flex items-center gap-3 mb-2">
                    {fitResult.fits ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="text-white" size={24} />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                            <X className="text-white" size={24} />
                        </div>
                    )}
                    <div>
                        <div className={cn(
                            'font-display text-lg font-bold',
                            fitResult.fits ? 'text-emerald-700' : 'text-red-700'
                        )}>
                            {fitResult.fits ? 'Cabe!' : 'Não cabe!'}
                        </div>
                        <p className={cn(
                            'text-sm',
                            fitResult.fits ? 'text-emerald-600' : 'text-red-600'
                        )}>
                            {fitResult.message}
                        </p>
                    </div>
                </div>

                {/* Dimension Details */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <DimensionCheck label="Largura" fits={fitResult.fitsWidth} />
                    <DimensionCheck label="Altura" fits={fitResult.fitsHeight} />
                    {objectDims.depth && <DimensionCheck label="Profundidade" fits={fitResult.fitsDepth} />}
                </div>

                {/* CTA Buttons */}
                <div className="mt-4">
                    {fitResult.fits ? (
                        <Link
                            href={`/categorias/${config.relatedProducts?.categoryId === 'tv' ? 'smart-tvs' : config.relatedProducts?.categoryId === 'fridge' ? 'geladeiras' : config.relatedProducts?.categoryId || ''}`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            ✓ Ver Oferta
                            <ChevronRight size={18} />
                        </Link>
                    ) : (
                        /* Smart Fallback - Sales Recovery */
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300">
                            <div className="flex items-center gap-2 text-amber-800 mb-3">
                                <AlertTriangle size={20} />
                                <span className="font-bold">
                                    {/* Use specific failure reason instead of generic message */}
                                    {fitResult.failureReason || config.failAction?.message || `Este ${config.object.label.toLowerCase()} não cabe no espaço informado.`}
                                </span>
                            </div>

                            {/* Dynamic Link CTA */}
                            <Link
                                href={generateFailbackLink(config, containerDims)}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all"
                            >
                                <span>{config.failAction?.buttonText || `Ver ${config.object.label}s menores que cabem`}</span>
                                <ChevronRight size={20} />
                            </Link>

                            {/* Alternative Products Preview */}
                            {showAlternatives && recommendedProducts.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <div className="text-xs text-amber-700 font-medium">Opções que cabem:</div>
                                    {recommendedProducts.slice(0, 2).map(product => (
                                        <AlternativeProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Recommendations when it fits */}
                {fitResult.fits && showRecommendations && recommendedProducts.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <Star size={16} className="text-yellow-500" />
                            Outros modelos que também cabem:
                        </h3>
                        <div className="grid gap-2">
                            {recommendedProducts.map(product => (
                                <AlternativeProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// ALTERNATIVE PRODUCT CARD (Compact)
// ============================================

function AlternativeProductCard({ product }: { product: MockProduct }) {
    return (
        <Link
            href={product.affiliateUrl || `/produto/${product.id}`}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-core hover:shadow-md transition-all"
        >
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">
                {product.category === 'tv' ? '📺' : '🧊'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-text-primary truncate">
                    {product.shortName}
                </div>
                <div className="text-xs text-text-muted">
                    {product.specs.width}cm × {product.specs.height}cm
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-sm text-brand-core">
                    R$ {product.price.toLocaleString('pt-BR')}
                </div>
            </div>
            <ExternalLink size={14} className="text-gray-400" />
        </Link>
    );
}

// ============================================
// FIT VISUALIZATION - SVG Visual Representation
// ============================================

interface FitVisualizationProps {
    objectDims: Dimensions;
    containerDims: Dimensions;
    objectColor: string;
    containerColor: string;
    objectLabel: string;
    containerLabel: string;
    fits: boolean;
}

function FitVisualization({
    objectDims,
    containerDims,
    objectColor,
    containerColor,
    objectLabel,
    containerLabel,
    fits
}: FitVisualizationProps) {
    // Calculate scale to fit in viewport
    const viewportWidth = 300;
    const viewportHeight = 200;
    const padding = 20;

    const maxDimension = Math.max(
        containerDims.width,
        containerDims.height,
        objectDims.width,
        objectDims.height
    );

    const scale = Math.min(
        (viewportWidth - padding * 2) / maxDimension,
        (viewportHeight - padding * 2) / maxDimension
    ) * 0.8;

    const containerW = containerDims.width * scale;
    const containerH = containerDims.height * scale;
    const objectW = objectDims.width * scale;
    const objectH = objectDims.height * scale;

    // Center positions
    const containerX = (viewportWidth - containerW) / 2;
    const containerY = (viewportHeight - containerH) / 2;
    const objectX = (viewportWidth - objectW) / 2;
    const objectY = (viewportHeight - objectH) / 2;

    return (
        <div className="flex justify-center">
            <svg
                viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
                className="w-full max-w-md h-48"
            >
                {/* Container (background) */}
                <rect
                    x={containerX}
                    y={containerY}
                    width={containerW}
                    height={containerH}
                    fill={`${containerColor}20`}
                    stroke={containerColor}
                    strokeWidth={2}
                    strokeDasharray={fits ? '0' : '5,5'}
                />

                {/* Object (foreground) */}
                <rect
                    x={objectX}
                    y={objectY}
                    width={objectW}
                    height={objectH}
                    fill={`${objectColor}40`}
                    stroke={objectColor}
                    strokeWidth={2}
                />

                {/* Labels */}
                <text
                    x={containerX + containerW / 2}
                    y={containerY - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                >
                    {containerLabel}
                </text>
                <text
                    x={objectX + objectW / 2}
                    y={objectY + objectH / 2 + 4}
                    textAnchor="middle"
                    className="text-xs fill-gray-800 font-medium"
                >
                    {objectLabel}
                </text>

                {/* Status indicator */}
                <circle
                    cx={viewportWidth - 20}
                    cy={20}
                    r={10}
                    fill={fits ? '#10B981' : '#EF4444'}
                />
                {fits ? (
                    <path
                        d={`M${viewportWidth - 24} 20 l3 3 l6 -6`}
                        stroke="white"
                        strokeWidth={2}
                        fill="none"
                    />
                ) : (
                    <>
                        <line x1={viewportWidth - 24} y1={16} x2={viewportWidth - 16} y2={24} stroke="white" strokeWidth={2} />
                        <line x1={viewportWidth - 16} y1={16} x2={viewportWidth - 24} y2={24} stroke="white" strokeWidth={2} />
                    </>
                )}
            </svg>
        </div>
    );
}

// ============================================
// DIMENSION INPUT
// ============================================

interface DimensionInputProps {
    config: DimensionInputConfig;
    value: number;
    onChange: (value: number) => void;
    readonly?: boolean;
}

function DimensionInput({ config, value, onChange, readonly }: DimensionInputProps) {
    return (
        <div className={cn(readonly && 'opacity-60')}>
            <div className="flex justify-between mb-1">
                <label className="text-sm text-text-secondary">{config.label}</label>
                <span className="text-sm font-semibold text-text-primary">
                    {value} {config.unit}
                </span>
            </div>
            <input
                type="range"
                min={config.min ?? 0}
                max={config.max ?? 200}
                step={1}
                value={value}
                onChange={(e) => !readonly && onChange(Number(e.target.value))}
                disabled={readonly}
                className={cn(
                    'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-core',
                    readonly && 'cursor-not-allowed'
                )}
            />
        </div>
    );
}

// ============================================
// DIMENSION CHECK INDICATOR
// ============================================

function DimensionCheck({ label, fits }: { label: string; fits: boolean }) {
    return (
        <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded',
            fits ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        )}>
            {fits ? <Check size={12} /> : <X size={12} />}
            <span>{label}</span>
        </div>
    );
}
