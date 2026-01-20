'use client';

import Link from 'next/link';
import { ExternalLink, Plus, Package, Zap, ShoppingCart } from 'lucide-react';

// ============================================
// BUNDLE CARD
// Visual component for kit/bundle recommendations
// Shows: [Product A] + [Product B] = [Total Price]
// ============================================

interface BundleProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    priceFormatted: string;
}

interface BundleCardProps {
    bundleType: 'deficiency_fix' | 'experience_boost';
    bundleName: string;
    weakness: string;
    mainProduct: BundleProduct;
    accessory: BundleProduct;
    totalPrice: number;
    totalPriceFormatted: string;
    accessoryPercentage: number;
    amazonUrl: string;
}

export function BundleCard({
    bundleType,
    bundleName,
    weakness,
    mainProduct,
    accessory,
    totalPrice,
    totalPriceFormatted,
    accessoryPercentage,
    amazonUrl
}: BundleCardProps) {
    const isDeficiencyFix = bundleType === 'deficiency_fix';

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4 my-3 max-w-md backdrop-blur-sm shadow-lg">
            {/* Bundle Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${isDeficiencyFix ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
                    {isDeficiencyFix ? (
                        <Package className="w-4 h-4 text-amber-400" />
                    ) : (
                        <Zap className="w-4 h-4 text-emerald-400" />
                    )}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wide ${isDeficiencyFix ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {bundleName}
                </span>
            </div>

            {/* Weakness Description */}
            <p className="text-xs text-slate-400 mb-3 italic">
                ⚠️ {weakness}
            </p>

            {/* Products Layout: [A] + [B] = [Total] */}
            <div className="flex items-center gap-2 mb-3">
                {/* Main Product */}
                <Link
                    href={`/produto/${mainProduct.id}`}
                    data-integrity="ignore"
                    className="flex-1 bg-slate-800/60 rounded-lg p-2 hover:bg-slate-800 transition-colors group"
                >
                    <p className="text-xs text-slate-400">{mainProduct.brand}</p>
                    <p className="text-sm text-white font-medium line-clamp-2 group-hover:text-violet-400 transition-colors">
                        {mainProduct.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{mainProduct.priceFormatted}</p>
                </Link>

                {/* Plus Sign */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-indigo-400" />
                </div>

                {/* Accessory */}
                <Link
                    href={`/produto/${accessory.id}`}
                    data-integrity="ignore"
                    className="flex-1 bg-slate-800/60 rounded-lg p-2 hover:bg-slate-800 transition-colors group"
                >
                    <p className="text-xs text-slate-400">{accessory.brand}</p>
                    <p className="text-sm text-white font-medium line-clamp-2 group-hover:text-violet-400 transition-colors">
                        {accessory.name}
                    </p>
                    <p className="text-xs text-emerald-400 mt-1">
                        +{accessoryPercentage}% • {accessory.priceFormatted}
                    </p>
                </Link>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between py-2 border-t border-slate-700/50 mb-3">
                <span className="text-sm text-slate-400">Kit Completo</span>
                <span className="text-lg font-bold text-white">{totalPriceFormatted}</span>
            </div>

            {/* CTA Button */}
            <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-all group shadow-lg shadow-indigo-500/20"
            >
                <ShoppingCart className="w-4 h-4" />
                <span>Ver Kit na Amazon</span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
            </a>
        </div>
    );
}

export default BundleCard;
