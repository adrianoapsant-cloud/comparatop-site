'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Plus, Star, ExternalLink, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface BundleProduct {
    id: string;
    name: string;
    shortName: string;
    category: string;
    price: number;
    imageUrl?: string;
    affiliateUrl?: string;
    asin?: string; // Amazon Standard Identification Number
    reason?: string; // Why this is recommended
}

export interface BundleConfig {
    id: string;
    title: string;
    description?: string;
    // Main product that triggered the bundle
    mainProduct?: BundleProduct;
    // Complementary products by category
    relatedProducts: BundleProduct[];
    // Total discount percentage (if applicable)
    bundleDiscount?: number;
}

interface BundleWidgetProps {
    config: BundleConfig;
    className?: string;
}

// ============================================
// BUNDLE PRODUCT CARD
// ============================================

function BundleProductCard({ product, isMain = false }: { product: BundleProduct; isMain?: boolean }) {
    return (
        <div
            className={cn(
                'p-3 rounded-xl border-2 transition-all',
                isMain
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-emerald-300'
            )}
        >
            <div className="flex items-center gap-3">
                {/* Product Image or Placeholder */}
                <div className={cn(
                    'w-14 h-14 rounded-lg flex items-center justify-center text-2xl',
                    isMain ? 'bg-blue-200' : 'bg-gray-100'
                )}>
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain rounded-lg"
                        />
                    ) : (
                        getCategoryEmoji(product.category)
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'font-semibold text-sm truncate',
                            isMain ? 'text-blue-800' : 'text-text-primary'
                        )}>
                            {product.shortName || product.name}
                        </span>
                        {isMain && (
                            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                Principal
                            </span>
                        )}
                    </div>
                    {product.reason && (
                        <div className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
                            <Star size={10} />
                            {product.reason}
                        </div>
                    )}
                    <div className={cn(
                        'font-bold text-sm mt-1',
                        isMain ? 'text-blue-700' : 'text-brand-core'
                    )}>
                        R$ {product.price.toLocaleString('pt-BR')}
                    </div>
                </div>

                {/* Individual Link */}
                {!isMain && product.affiliateUrl && (
                    <Link
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                        <ExternalLink size={16} />
                    </Link>
                )}
            </div>
        </div>
    );
}

// ============================================
// MAIN BUNDLE WIDGET
// ============================================

export function BundleWidget({ config, className }: BundleWidgetProps) {
    // Calculate totals
    const { totalOriginal, totalWithDiscount, savings } = useMemo(() => {
        const allProducts = config.mainProduct
            ? [config.mainProduct, ...config.relatedProducts]
            : config.relatedProducts;

        const total = allProducts.reduce((sum, p) => sum + p.price, 0);
        const discountMultiplier = 1 - (config.bundleDiscount || 0) / 100;
        const discounted = total * discountMultiplier;

        return {
            totalOriginal: total,
            totalWithDiscount: discounted,
            savings: total - discounted,
        };
    }, [config]);

    // Generate Amazon cart URL with multiple ASINs
    const amazonCartUrl = useMemo(() => {
        const allProducts = config.mainProduct
            ? [config.mainProduct, ...config.relatedProducts]
            : config.relatedProducts;

        const asins = allProducts
            .filter(p => p.asin)
            .map(p => p.asin);

        if (asins.length === 0) return null;

        // Amazon multi-add-to-cart format
        // Format: https://www.amazon.com.br/gp/aws/cart/add.html?ASIN.1=XXX&Quantity.1=1&ASIN.2=YYY&Quantity.2=1
        const params = asins.map((asin, i) => `ASIN.${i + 1}=${asin}&Quantity.${i + 1}=1`).join('&');
        return `https://www.amazon.com.br/gp/aws/cart/add.html?${params}&tag=comparatop-20`;
    }, [config]);

    if (config.relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className={cn(
            'bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200',
            className
        )}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Package size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="font-display font-bold text-lg text-emerald-800">
                        {config.title || 'Complete seu Setup'}
                    </h3>
                    {config.description && (
                        <p className="text-sm text-emerald-600">{config.description}</p>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="space-y-2 mb-4">
                {/* Main Product */}
                {config.mainProduct && (
                    <>
                        <BundleProductCard product={config.mainProduct} isMain={true} />
                        <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Plus size={16} className="text-emerald-600" />
                            </div>
                        </div>
                    </>
                )}

                {/* Related Products */}
                {config.relatedProducts.map((product, index) => (
                    <div key={product.id}>
                        <BundleProductCard product={product} />
                        {index < config.relatedProducts.length - 1 && (
                            <div className="flex justify-center my-1">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Plus size={12} className="text-emerald-600" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pricing Summary */}
            <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-text-muted">Total separado:</span>
                    <span className={cn(
                        savings > 0 ? 'line-through text-gray-400' : 'font-bold text-text-primary'
                    )}>
                        R$ {totalOriginal.toLocaleString('pt-BR')}
                    </span>
                </div>
                {savings > 0 && (
                    <>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-emerald-600 font-medium">Total do Kit:</span>
                            <span className="font-bold text-lg text-emerald-700">
                                R$ {totalWithDiscount.toLocaleString('pt-BR')}
                            </span>
                        </div>
                        <div className="text-xs text-emerald-600 text-right">
                            Você economiza R$ {savings.toLocaleString('pt-BR')} ({config.bundleDiscount}% off)
                        </div>
                    </>
                )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
                {amazonCartUrl ? (
                    <a
                        href={amazonCartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-600/30 transition-all"
                    >
                        <ShoppingCart size={20} />
                        Adicionar Kit Completo ao Carrinho
                    </a>
                ) : (
                    <div className="text-center text-sm text-gray-500">
                        Clique em cada produto para ver a oferta
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// HELPERS
// ============================================

function getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
        tv: '📺',
        soundbar: '🔊',
        fridge: '🧊',
        air_conditioner: '❄️',
        suporte: '🖼️',
        mount: '🖼️',
        speaker: '🔈',
        headphones: '🎧',
        monitor: '🖥️',
        notebook: '💻',
        keyboard: '⌨️',
        mouse: '🖱️',
        default: '📦',
    };

    return emojis[category] || emojis.default;
}
