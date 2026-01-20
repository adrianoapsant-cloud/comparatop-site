'use client';

/**
 * @file SmartOfferCard.tsx
 * @description Card de oferta inteligente com comparação visual de preço vs parcelamento
 * 
 * Implementa a recomendação do relatório "Otimização de Afiliados e UX de Preços":
 * - Mostra preço à vista vs parcelamento lado a lado
 * - Destaca vencedor de cada métrica
 * - Labels de CTA contextualizados por categoria
 * 
 * @version 1.0.0
 */

import { memo } from 'react';
import { ExternalLink, Truck, CreditCard, Tag, CheckCircle2 } from 'lucide-react';
import type { Platform } from '@/lib/safe-links';
import { generateAmazonSearchLink, generateMercadoLivreSearchLink, generateShopeeSearchLink, generateMagaluSearchLink } from '@/lib/safe-links';
import { getSmartCTALabel, isParcelamentoSensitive, getQualifiedCTA } from '@/lib/smart-routing';

// ============================================================================
// TYPES
// ============================================================================

export interface OfferData {
    platform: Platform;
    priceSpot: number;          // Preço à vista
    installments?: number;      // Número de parcelas
    installmentValue?: number;  // Valor da parcela
    shipping: 'free' | number;  // Grátis ou valor do frete
    inStock: boolean;
    affiliateTag?: string;
    productId?: string;         // ASIN, MLB ID, etc.
    productKeyword?: string;    // Fallback keyword
}

export interface SmartOfferCardProps {
    offers: OfferData[];
    categoryId: string;
    productName: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const PLATFORM_CONFIG: Record<Platform, { name: string; color: string; bgColor: string; logo: string }> = {
    amazon: {
        name: 'Amazon',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        logo: '🛒',
    },
    mercadolivre: {
        name: 'Mercado Livre',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        logo: '🤝',
    },
    shopee: {
        name: 'Shopee',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        logo: '🧡',
    },
    magalu: {
        name: 'Magalu',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        logo: '💙',
    },
};

function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Generate affiliate link with subid tracking
 * Subid format: card_<metric>_<platform>
 */
function generateTrackedLink(
    platform: Platform,
    keyword: string,
    affiliateTag?: string,
    subid?: string
): string {
    switch (platform) {
        case 'amazon':
            return generateAmazonSearchLink(keyword, affiliateTag, subid);
        case 'mercadolivre':
            return generateMercadoLivreSearchLink(keyword, affiliateTag, subid);
        case 'shopee':
            return generateShopeeSearchLink(keyword, affiliateTag);
        case 'magalu':
            return generateMagaluSearchLink(keyword, affiliateTag);
        default:
            return '#';
    }
}

// ============================================================================
// SINGLE OFFER CARD
// ============================================================================

interface SingleOfferCardProps {
    offer: OfferData;
    categoryId: string;
    isWinnerPrice: boolean;
    isWinnerInstallment: boolean;
    productName: string;
}

const SingleOfferCard = memo(function SingleOfferCard({
    offer,
    categoryId,
    isWinnerPrice,
    isWinnerInstallment,
    productName,
}: SingleOfferCardProps) {
    const config = PLATFORM_CONFIG[offer.platform];
    // Use getQualifiedCTA for High-Ticket products (>R$1000)
    const ctaLabel = getQualifiedCTA(offer.priceSpot, categoryId, offer.platform);

    // Determine subid based on context
    // If category is parcelamento-sensitive and this is ML/Magalu, use 'parcela' subid
    // Otherwise use 'price' for price winner or 'card' as default
    const isParcela = isParcelamentoSensitive(categoryId);
    let subid = 'card';  // default
    if (isWinnerPrice) subid = 'card_price';
    else if (isWinnerInstallment) subid = 'card_parcela';
    else if (isParcela && (offer.platform === 'mercadolivre' || offer.platform === 'magalu')) {
        subid = 'card_parcela_hint';
    }

    // Generate affiliate link with tracking subid
    const affiliateLink = generateTrackedLink(
        offer.platform,
        offer.productKeyword || productName,
        offer.affiliateTag,
        subid
    );

    return (
        <div className={`p-4 rounded-xl border ${config.bgColor} transition-all hover:shadow-md`}>
            {/* Platform Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{config.logo}</span>
                    <span className={`font-semibold ${config.color}`}>{config.name}</span>
                </div>
                {!offer.inStock && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                        Indisponível
                    </span>
                )}
            </div>

            {/* Price Section */}
            <div className="space-y-2 mb-4">
                {/* Spot Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                        <Tag className="w-4 h-4" />
                        <span>À vista</span>
                        {isWinnerPrice && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                    </div>
                    <span className={`font-bold ${isWinnerPrice ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {formatBRL(offer.priceSpot)}
                    </span>
                </div>

                {/* Installments */}
                {offer.installments && offer.installmentValue && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <CreditCard className="w-4 h-4" />
                            <span>{offer.installments}x</span>
                            {isWinnerInstallment && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                        </div>
                        <span className={`font-bold ${isWinnerInstallment ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                            {formatBRL(offer.installmentValue)}
                        </span>
                    </div>
                )}

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Truck className="w-4 h-4" />
                        <span>Frete</span>
                    </div>
                    <span className={offer.shipping === 'free' ? 'text-emerald-600 font-medium' : 'text-slate-600'}>
                        {offer.shipping === 'free' ? 'Grátis' : formatBRL(offer.shipping)}
                    </span>
                </div>
            </div>

            {/* CTA Button */}
            <a
                href={affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`
                    w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
                    font-medium text-white transition-all
                    ${offer.platform === 'amazon' ? 'bg-orange-500 hover:bg-orange-600' :
                        offer.platform === 'mercadolivre' ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900' :
                            offer.platform === 'magalu' ? 'bg-blue-500 hover:bg-blue-600' :
                                'bg-orange-400 hover:bg-orange-500'}
                    ${!offer.inStock ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={(e) => {
                    if (!offer.inStock) {
                        e.preventDefault();
                        return;
                    }
                }}
            >
                {ctaLabel}
                <ExternalLink className="w-4 h-4" />
            </a>
        </div>
    );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SmartOfferCard = memo(function SmartOfferCard({
    offers,
    categoryId,
    productName,
}: SmartOfferCardProps) {
    if (!offers || offers.length === 0) return null;

    // Find winners
    const sortedByPrice = [...offers].sort((a, b) => a.priceSpot - b.priceSpot);
    const winnerPrice = sortedByPrice[0];
    const lowestPrice = winnerPrice?.priceSpot || 0;

    const offersWithInstallments = offers.filter(o => o.installmentValue);
    const sortedByInstallment = [...offersWithInstallments].sort(
        (a, b) => (a.installmentValue || 999999) - (b.installmentValue || 999999)
    );
    const winnerInstallment = sortedByInstallment[0];

    // High-Ticket: show "A partir de" pricing for qualified click strategy
    const isHighTicketProduct = lowestPrice >= 1000;
    const formatPrice = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

    return (
        <div className="smart-offer-cards">
            {/* Header with "A partir de" pricing for High-Ticket */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        Onde Comprar
                    </h3>
                    {isHighTicketProduct && (
                        <p className="text-sm text-emerald-600 font-medium mt-0.5">
                            A partir de {formatPrice(lowestPrice)}
                        </p>
                    )}
                </div>
                <span className="text-xs text-slate-500">
                    Comparando {offers.length} lojas
                </span>
            </div>

            {/* Cards Grid */}
            <div className={`grid gap-4 ${offers.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {offers.map((offer) => (
                    <SingleOfferCard
                        key={offer.platform}
                        offer={offer}
                        categoryId={categoryId}
                        isWinnerPrice={offer.platform === winnerPrice?.platform}
                        isWinnerInstallment={offer.platform === winnerInstallment?.platform}
                        productName={productName}
                    />
                ))}
            </div>

            {/* Disclaimer */}
            <p className="mt-3 text-xs text-slate-500 text-center">
                Preços sujeitos a alteração. Verificar no site do parceiro.
            </p>
        </div>
    );
});

export default SmartOfferCard;
