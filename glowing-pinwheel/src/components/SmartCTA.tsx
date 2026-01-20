'use client';

// ============================================================================
// SMART CTA - Context-Aware Call-to-Action
// ============================================================================
// CTA inteligente que adapta mensagem baseado no resultado dos simuladores
// Aumenta conversão através de personalização contextual
// ============================================================================

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart, Sparkles, ArrowRight, ExternalLink, Check } from 'lucide-react';
import { generateAmazonSearchLink } from '@/lib/safe-links';

// ============================================
// TYPES
// ============================================

export type SimulatorResult = 'positive' | 'neutral' | 'negative' | null;

export interface SmartCTAProps {
    /** Nome do produto (para fallback de URL) */
    productName: string;
    /** URL direta da oferta (Amazon, etc) */
    offerUrl?: string;
    /** Preço atual */
    price?: number;
    /** Resultado do simulador (se o usuário interagiu) */
    simulatorResult?: SimulatorResult;
    /** Quantidade de simuladores positivos */
    positiveSimulatorCount?: number;
    /** Variante visual */
    variant?: 'default' | 'compact' | 'floating';
    /** Posição (para floating) */
    position?: 'bottom-right' | 'bottom-center';
    /** Se está fixo na tela */
    isFixed?: boolean;
    /** Classe CSS adicional */
    className?: string;
    /** Callback ao clicar */
    onClick?: () => void;
}

// ============================================
// CTA CONFIGURATIONS
// ============================================

interface CTAConfig {
    text: string;
    subtext?: string;
    icon: React.ReactNode;
    gradient: string;
    shadowColor: string;
    pulse?: boolean;
}

function getCTAConfig(
    simulatorResult: SimulatorResult,
    positiveCount: number
): CTAConfig {
    // Positive simulator result - personalized message
    if (simulatorResult === 'positive' || positiveCount >= 2) {
        return {
            text: 'Ver Oferta Ideal para Você',
            subtext: positiveCount > 0 ? `✓ ${positiveCount} critérios atendidos` : undefined,
            icon: <Sparkles size={18} className="animate-pulse" />,
            gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
            shadowColor: 'shadow-emerald-500/30',
            pulse: true,
        };
    }

    // Neutral - standard message
    if (simulatorResult === 'neutral') {
        return {
            text: 'Ver Melhor Oferta',
            icon: <ShoppingCart size={18} />,
            gradient: 'from-[#FF9900] via-[#FF9900] to-[#FFB347]',
            shadowColor: 'shadow-orange-500/30',
        };
    }

    // Negative - still show offer but different tone
    if (simulatorResult === 'negative') {
        return {
            text: 'Conferir Oferta',
            subtext: 'Verifique as alternativas',
            icon: <ArrowRight size={18} />,
            gradient: 'from-gray-600 to-gray-700',
            shadowColor: 'shadow-gray-500/20',
        };
    }

    // Default - no simulator interaction
    return {
        text: 'Ver Melhor Oferta',
        icon: <ShoppingCart size={18} />,
        gradient: 'from-[#FF9900] via-[#FF9900] to-[#FFB347]',
        shadowColor: 'shadow-orange-500/30',
    };
}

// ============================================
// MAIN COMPONENT
// ============================================

export function SmartCTA({
    productName,
    offerUrl,
    price,
    simulatorResult = null,
    positiveSimulatorCount = 0,
    variant = 'default',
    position = 'bottom-right',
    isFixed = false,
    className,
    onClick,
}: SmartCTAProps) {

    const ctaConfig = useMemo(() =>
        getCTAConfig(simulatorResult, positiveSimulatorCount),
        [simulatorResult, positiveSimulatorCount]
    );

    const handleClick = () => {
        onClick?.();

        const url = offerUrl || generateAmazonSearchLink(productName, 'comparatop-20');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Floating variant (fixed position)
    if (variant === 'floating') {
        return (
            <div
                className={cn(
                    'z-50',
                    isFixed && 'fixed',
                    position === 'bottom-right' && 'bottom-6 right-6',
                    position === 'bottom-center' && 'bottom-6 left-1/2 -translate-x-1/2',
                    className
                )}
            >
                <button
                    onClick={handleClick}
                    className={cn(
                        // Base
                        'flex items-center gap-3 px-6 py-4 rounded-2xl',
                        'text-white font-bold',
                        // Gradient
                        `bg-gradient-to-r ${ctaConfig.gradient}`,
                        // Shadow
                        `shadow-xl ${ctaConfig.shadowColor}`,
                        // Hover
                        'hover:scale-105 active:scale-[0.98]',
                        'transition-all duration-200',
                        // Pulse animation
                        ctaConfig.pulse && 'animate-pulse-subtle'
                    )}
                >
                    {ctaConfig.icon}
                    <div className="text-left">
                        <span className="block text-sm sm:text-base">
                            {ctaConfig.text}
                        </span>
                        {ctaConfig.subtext && (
                            <span className="block text-xs opacity-80">
                                {ctaConfig.subtext}
                            </span>
                        )}
                    </div>
                    <ExternalLink size={14} className="opacity-70" />
                </button>
            </div>
        );
    }

    // Compact variant (inline)
    if (variant === 'compact') {
        return (
            <button
                onClick={handleClick}
                className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl',
                    'text-white font-semibold text-sm',
                    `bg-gradient-to-r ${ctaConfig.gradient}`,
                    `shadow-lg ${ctaConfig.shadowColor}`,
                    'hover:shadow-xl active:scale-[0.98]',
                    'transition-all duration-200',
                    className
                )}
            >
                {ctaConfig.icon}
                <span>{ctaConfig.text}</span>
                {simulatorResult === 'positive' && (
                    <span className="text-xs">✨</span>
                )}
            </button>
        );
    }

    // Default variant (full size)
    return (
        <div className={cn('space-y-2', className)}>
            <button
                onClick={handleClick}
                className={cn(
                    // Size
                    'w-full flex items-center justify-center gap-3',
                    'px-8 py-4 rounded-2xl',
                    // Typography
                    'text-white font-bold text-lg',
                    // Gradient
                    `bg-gradient-to-r ${ctaConfig.gradient}`,
                    // Shadow
                    `shadow-xl ${ctaConfig.shadowColor}`,
                    // Hover effects
                    'hover:shadow-2xl hover:scale-[1.02]',
                    'active:scale-[0.98]',
                    // Transition
                    'transition-all duration-200',
                    // Pulse
                    ctaConfig.pulse && 'ring-2 ring-emerald-400/50 ring-offset-2'
                )}
            >
                {ctaConfig.icon}
                <span>{ctaConfig.text}</span>
                <ExternalLink size={16} className="opacity-70" />
            </button>

            {/* Subtext / Confidence indicator */}
            {ctaConfig.subtext && (
                <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1.5">
                    <Check size={14} className="text-emerald-500" />
                    {ctaConfig.subtext}
                </p>
            )}

            {/* Price indicator */}
            {price && (
                <p className="text-center text-xs text-gray-400">
                    A partir de <span className="font-semibold text-gray-600">
                        R$ {price.toLocaleString('pt-BR')}
                    </span>
                </p>
            )}
        </div>
    );
}

// ============================================
// STYLES (add to globals.css if needed)
// ============================================

// Add this keyframe to your CSS:
// @keyframes pulse-subtle {
//   0%, 100% { transform: scale(1); }
//   50% { transform: scale(1.02); }
// }
// .animate-pulse-subtle {
//   animation: pulse-subtle 2s ease-in-out infinite;
// }

// ============================================
// EXPORTS
// ============================================

export default SmartCTA;
