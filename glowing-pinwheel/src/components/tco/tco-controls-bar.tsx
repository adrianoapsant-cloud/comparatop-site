'use client';

// ============================================================================
// TCO CONTROLS BAR - Container for all TCO control components
// ============================================================================
// Responsive layout that groups RealitySwitch and PersonaSelector
// Includes share functionality for the analyzed URL
// ============================================================================

import { useState } from 'react';
import { Share2, Copy, Check, Link2, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTcoState } from '@/hooks/use-url-state';
import { RealitySwitch, RealitySwitchPill } from './reality-switch';
import { PersonaSelector, PersonaSelectorCompact } from './persona-selector';

// ============================================
// TYPES
// ============================================

interface TcoControlsBarProps {
    /** Additional class names */
    className?: string;
    /** Number of years for TCO calculation */
    years?: number;
    /** Show share button */
    showShare?: boolean;
    /** Variant: full controls or compact */
    variant?: 'full' | 'compact' | 'minimal';
    /** Callback when share is triggered */
    onShare?: (url: string) => void;
}

// ============================================
// SHARE BUTTON COMPONENT
// ============================================

interface ShareButtonProps {
    getShareableUrl: () => string;
    onShare?: (url: string) => void;
    className?: string;
}

function ShareButton({ getShareableUrl, onShare, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleShare = async () => {
        const url = getShareableUrl();

        try {
            // Try native share API first (mobile)
            if (navigator.share) {
                await navigator.share({
                    title: 'Análise de Custo Real - ComparaTop',
                    text: 'Veja a comparação de custo total de propriedade',
                    url,
                });
                onShare?.(url);
                return;
            }

            // Fallback to clipboard
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setShowTooltip(true);
            onShare?.(url);

            setTimeout(() => {
                setCopied(false);
                setShowTooltip(false);
            }, 2000);
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl',
                    'border border-gray-200 bg-white',
                    'text-sm font-medium text-gray-600',
                    'hover:bg-gray-50 hover:border-gray-300',
                    'transition-all duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                    copied && 'border-emerald-300 bg-emerald-50 text-emerald-600',
                    className
                )}
                title="Compartilhar análise"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Copiado!</span>
                    </>
                ) : (
                    <>
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Compartilhar</span>
                    </>
                )}
            </button>

            {/* Tooltip */}
            {showTooltip && (
                <div className={cn(
                    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                    'px-3 py-1.5 rounded-lg',
                    'bg-gray-900 text-white text-xs',
                    'whitespace-nowrap',
                    'animate-in fade-in-0 zoom-in-95'
                )}>
                    Link copiado para a área de transferência
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900" />
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// MAIN COMPONENT - FULL VARIANT
// ============================================

function TcoControlsFull({
    className,
    years = 5,
    showShare = true,
    onShare
}: Omit<TcoControlsBarProps, 'variant'>) {
    const { getShareableUrl, isTcoView } = useTcoState();

    return (
        <div className={cn(
            'flex flex-col gap-4 p-4 rounded-2xl',
            'bg-gradient-to-br from-gray-50 to-gray-100',
            'border border-gray-200',
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Configurar Análise</span>
                </div>

                {showShare && (
                    <ShareButton
                        getShareableUrl={getShareableUrl}
                        onShare={onShare}
                    />
                )}
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* View Toggle */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                        Visão de Preço
                    </label>
                    <RealitySwitch years={years} />
                </div>

                {/* Persona Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                        Perfil de Uso
                    </label>
                    <PersonaSelector variant="auto" />
                </div>
            </div>

            {/* TCO Active Indicator */}
            {isTcoView && (
                <div className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl',
                    'bg-emerald-50 border border-emerald-200',
                    'text-sm text-emerald-700'
                )}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Mostrando custo total de propriedade em {years} anos
                </div>
            )}
        </div>
    );
}

// ============================================
// COMPACT VARIANT - Horizontal bar
// ============================================

function TcoControlsCompact({
    className,
    years = 5,
    showShare = true,
    onShare
}: Omit<TcoControlsBarProps, 'variant'>) {
    const { getShareableUrl } = useTcoState();

    return (
        <div className={cn(
            'flex flex-col sm:flex-row items-stretch sm:items-center gap-3',
            'p-3 rounded-xl',
            'bg-white border border-gray-200 shadow-sm',
            className
        )}>
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-3 flex-1">
                <RealitySwitch compact years={years} />
                <div className="w-px h-8 bg-gray-200" />
                <PersonaSelectorCompact />
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3">
                <RealitySwitchPill years={years} />
                <PersonaSelector variant="dropdown" showDescription={false} />
            </div>

            {/* Share Button */}
            {showShare && (
                <>
                    <div className="hidden sm:block w-px h-8 bg-gray-200" />
                    <ShareButton
                        getShareableUrl={getShareableUrl}
                        onShare={onShare}
                        className="w-full sm:w-auto"
                    />
                </>
            )}
        </div>
    );
}

// ============================================
// MINIMAL VARIANT - Inline pills
// ============================================

function TcoControlsMinimal({
    className,
    years = 5,
}: Omit<TcoControlsBarProps, 'variant' | 'showShare' | 'onShare'>) {
    const { getShareableUrl } = useTcoState();

    return (
        <div className={cn(
            'flex flex-wrap items-center gap-2',
            className
        )}>
            <RealitySwitchPill years={years} />
            <span className="text-gray-300">|</span>
            <PersonaSelectorCompact />

            {/* Copy link icon */}
            <button
                onClick={() => navigator.clipboard.writeText(getShareableUrl())}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Copiar link da análise"
            >
                <Link2 className="w-4 h-4" />
            </button>
        </div>
    );
}

// ============================================
// MAIN EXPORT
// ============================================

/**
 * TcoControlsBar - Unified control interface for TCO analysis
 * 
 * Variants:
 * - 'full': Card with header, labels, and all controls visible
 * - 'compact': Horizontal bar with responsive layout
 * - 'minimal': Inline pills for embedded use
 * 
 * @example
 * ```tsx
 * // Full card variant (for settings pages)
 * <TcoControlsBar variant="full" years={5} />
 * 
 * // Compact bar (for comparison pages)
 * <TcoControlsBar variant="compact" showShare />
 * 
 * // Minimal inline (for headers)
 * <TcoControlsBar variant="minimal" />
 * ```
 */
export function TcoControlsBar({
    variant = 'compact',
    ...props
}: TcoControlsBarProps) {
    switch (variant) {
        case 'full':
            return <TcoControlsFull {...props} />;
        case 'minimal':
            return <TcoControlsMinimal {...props} />;
        case 'compact':
        default:
            return <TcoControlsCompact {...props} />;
    }
}

// ============================================
// EXPORTS
// ============================================

export default TcoControlsBar;
export { ShareButton };
