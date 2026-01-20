'use client';

import { useState } from 'react';
import { Plus, ShoppingCart, ExternalLink, Speaker, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// BUNDLE UPGRADE COMPONENT
// ============================================
// The "Blind Kit" solution - focuses on the accessory delta price
// since we can't show the main product price.
//
// Strategy: "Upgrade Math" - Show only what the upgrade costs extra

interface BundleUpgradeProps {
    /** Main product info */
    mainProduct: {
        name: string;
        shortName: string;
        asin?: string;
        imageUrl?: string;
    };
    /** Accessory product info */
    accessory: {
        name: string;
        shortName: string;
        asin?: string;
        price: number; // We CAN show accessory price (less volatile)
        imageUrl?: string;
        category?: string;
    };
    /** Bundle title */
    title?: string;
    /** Bundle subtitle / value proposition */
    subtitle?: string;
    className?: string;
}

export function BundleUpgrade({
    mainProduct,
    accessory,
    title = '🎬 Complete sua Experiência',
    subtitle,
    className,
}: BundleUpgradeProps) {
    const [includeAccessory, setIncludeAccessory] = useState(true);

    // Generate Amazon multi-product cart URL
    const generateCartUrl = () => {
        const baseUrl = 'https://www.amazon.com.br/gp/aws/cart/add.html';
        const params = new URLSearchParams();

        if (mainProduct.asin) {
            params.append('ASIN.1', mainProduct.asin);
            params.append('Quantity.1', '1');
        }

        if (includeAccessory && accessory.asin) {
            params.append('ASIN.2', accessory.asin);
            params.append('Quantity.2', '1');
        }

        params.append('tag', 'comparatop-20');

        return `${baseUrl}?${params.toString()}`;
    };

    // Single product URL
    const generateSingleUrl = () => {
        if (mainProduct.asin) {
            return `https://www.amazon.com.br/dp/${mainProduct.asin}?tag=comparatop-20`;
        }
        return `https://www.amazon.com.br/s?k=${encodeURIComponent(mainProduct.name)}&tag=comparatop-20`;
    };

    const accessoryIcon = accessory.category === 'soundbar' ? '🔊' : '✨';

    return (
        <div className={cn(
            'bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white',
            className
        )}>
            {/* Header */}
            <div className="mb-6">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-slate-300 text-sm mt-1">{subtitle}</p>
                )}
            </div>

            {/* Products Stack */}
            <div className="space-y-3 mb-6">
                {/* Main Product - No Price */}
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                    <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                        📺
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">{mainProduct.shortName}</div>
                        <div className="text-xs text-slate-400">Produto principal</div>
                    </div>
                    <a
                        href={generateSingleUrl()}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                        Checar Oferta
                        <ExternalLink size={10} />
                    </a>
                </div>

                {/* Plus Operator */}
                <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Plus size={20} className="text-white" />
                    </div>
                </div>

                {/* Accessory - WITH Price */}
                <button
                    onClick={() => setIncludeAccessory(!includeAccessory)}
                    className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl transition-all',
                        includeAccessory
                            ? 'bg-emerald-500/20 border-2 border-emerald-400'
                            : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                    )}
                >
                    <div className={cn(
                        'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors',
                        includeAccessory
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-500'
                    )}>
                        {includeAccessory && <Check size={14} className="text-white" />}
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-xl">
                        {accessoryIcon}
                    </div>
                    <div className="flex-1 text-left">
                        <div className="font-semibold">{accessory.shortName}</div>
                        <div className="text-xs text-slate-400">{accessory.name}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-emerald-400 font-bold">
                            + R$ {accessory.price.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-[10px] text-slate-500">preço est.</div>
                    </div>
                </button>
            </div>

            {/* CTA Section */}
            <div className="space-y-3">
                <a
                    href={includeAccessory ? generateCartUrl() : generateSingleUrl()}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className={cn(
                        'flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg transition-all',
                        includeAccessory
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/30'
                            : 'bg-white/10 hover:bg-white/20'
                    )}
                >
                    <ShoppingCart size={20} />
                    {includeAccessory ? (
                        <>Simular Carrinho Completo</>
                    ) : (
                        <>Ver Oferta do Produto</>
                    )}
                    <ExternalLink size={16} />
                </a>

                {includeAccessory && (
                    <p className="text-center text-xs text-slate-400">
                        <Sparkles size={12} className="inline mr-1" />
                        Adicione experiência de cinema por apenas +R$ {accessory.price.toLocaleString('pt-BR')} est.
                    </p>
                )}

                <p className="text-center text-[10px] text-slate-500">
                    Vendido por Amazon/Parceiros. Preços finais no checkout.
                </p>
            </div>
        </div>
    );
}

// ============================================
// BUNDLE UPGRADE COMPACT (For Sidebar)
// ============================================

interface BundleUpgradeCompactProps {
    mainProductAsin?: string;
    mainProductName: string;
    accessoryAsin?: string;
    accessoryName: string;
    accessoryPrice: number;
    className?: string;
}

export function BundleUpgradeCompact({
    mainProductAsin,
    mainProductName,
    accessoryAsin,
    accessoryName,
    accessoryPrice,
    className,
}: BundleUpgradeCompactProps) {
    const [include, setInclude] = useState(false);

    const generateUrl = () => {
        if (include && mainProductAsin && accessoryAsin) {
            return `https://www.amazon.com.br/gp/aws/cart/add.html?ASIN.1=${mainProductAsin}&Quantity.1=1&ASIN.2=${accessoryAsin}&Quantity.2=1&tag=comparatop-20`;
        }
        if (mainProductAsin) {
            return `https://www.amazon.com.br/dp/${mainProductAsin}?tag=comparatop-20`;
        }
        return `https://www.amazon.com.br/s?k=${encodeURIComponent(mainProductName)}&tag=comparatop-20`;
    };

    return (
        <div className={cn('bg-slate-100 rounded-xl p-4', className)}>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                    type="checkbox"
                    checked={include}
                    onChange={(e) => setInclude(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">
                        + {accessoryName}
                    </div>
                    <div className="text-xs text-emerald-600 font-semibold">
                        +R$ {accessoryPrice.toLocaleString('pt-BR')}
                    </div>
                </div>
            </label>
            <a
                href={generateUrl()}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-colors"
            >
                <ShoppingCart size={16} />
                {include ? 'Ver Kit na Amazon' : 'Ver Oferta'}
            </a>
        </div>
    );
}
