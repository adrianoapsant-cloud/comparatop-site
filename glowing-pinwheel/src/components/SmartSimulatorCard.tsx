'use client';

import {
    ExternalLink,
    ArrowUpRight,
    CheckCircle,
    AlertTriangle,
    Info,
    Zap,
    // Common simulator icons
    Thermometer,
    Ruler,
    Volume2,
    Wifi,
    Battery,
    Cpu,
    Monitor,
    Tv,
    Gamepad2,
    Sun,
    Moon,
    Snowflake,
    Flame,
    Wind,
    Droplets,
    Gauge,
    Timer,
    Power,
    Settings,
    type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAmazonSearchLink } from '@/lib/safe-links';

// ============================================
// ICON MAP - Only allowed icons (tree-shaking friendly)
// ============================================
const ALLOWED_ICONS: Record<string, LucideIcon> = {
    // Status icons
    'check-circle': CheckCircle,
    'alert-triangle': AlertTriangle,
    'info': Info,
    'zap': Zap,
    // Measurement icons
    'thermometer': Thermometer,
    'ruler': Ruler,
    'gauge': Gauge,
    'timer': Timer,
    // Tech icons
    'volume-2': Volume2,
    'wifi': Wifi,
    'battery': Battery,
    'cpu': Cpu,
    'monitor': Monitor,
    'tv': Tv,
    'gamepad-2': Gamepad2,
    'power': Power,
    'settings': Settings,
    // Environment icons
    'sun': Sun,
    'moon': Moon,
    'snowflake': Snowflake,
    'flame': Flame,
    'wind': Wind,
    'droplets': Droplets,
} as const;

// ============================================
// SMART CARD DATA INTERFACE
// ============================================
// This interface is category-agnostic and can be used for any product type
// The Gemini API will populate this structure based on product analysis

// ============================================
// SMART CARD DATA INTERFACE
// ============================================

export interface SmartCardSuggestion {
    /** Label describing the suggestion (e.g. "Melhor para Cinema") */
    label?: string;
    /** Product name */
    productName: string;
    /** Price display */
    price?: string;
    /** URL */
    actionLink: string;
    /** Action type (defaults to external_link if not provided or inferred) */
    actionType?: 'external_link' | 'scroll_to_bundle';
    /** Visual prominence */
    variant?: 'premium' | 'standard';
}

export interface SmartCardData {
    type: 'optimal' | 'warning' | 'info';
    icon: string;
    title: string;
    description: string;
    metadata?: string;
    badge?: {
        label: string;
        color: 'emerald' | 'lime' | 'yellow' | 'orange' | 'red';
    };
    /** Array of suggestions (max 2 recommended) */
    suggestions?: SmartCardSuggestion[];
}
// ============================================
// COLOR CONFIGURATION
// ============================================

const typeConfig = {
    optimal: {
        StatusIcon: CheckCircle,
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconColor: 'text-emerald-600',
        textBody: 'text-emerald-700',
    },
    warning: {
        StatusIcon: AlertTriangle,
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconColor: 'text-amber-600',
        textBody: 'text-amber-700',
    },
    info: {
        StatusIcon: Info,
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconColor: 'text-blue-600',
        textBody: 'text-blue-700',
    },
};

const badgeColors = {
    emerald: 'bg-emerald-500 text-white',
    lime: 'bg-lime-500 text-white',
    yellow: 'bg-yellow-500 text-black',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white',
};

// ============================================
// ICON RESOLVER
// ============================================

function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
    // Convert to lowercase kebab-case for lookup
    const normalizedName = iconName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    // Return the icon from our explicit map, fallback to Info
    return ALLOWED_ICONS[normalizedName] || ALLOWED_ICONS['info'] || Info;
}

// ============================================
// SUGGESTION ITEM COMPONENT
// ============================================

function SuggestionItem({
    suggestion,
    isFirst,
    isLast
}: {
    suggestion: SmartCardSuggestion;
    isFirst: boolean;
    isLast: boolean;
}) {
    const handleClick = (e: React.MouseEvent) => {
        // Smooth scroll if anchor link
        if (suggestion.actionLink.startsWith('#')) {
            e.preventDefault();
            const id = suggestion.actionLink.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Fallback: open Amazon search for product with safe filters
                const safeUrl = generateAmazonSearchLink(suggestion.productName, 'comparatop-20');
                window.open(safeUrl, '_blank', 'noopener,noreferrer');
            }
        } else if (suggestion.actionType === 'scroll_to_bundle') {
            e.preventDefault();
            const element = document.getElementById('bundle-widget');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Fallback: open Amazon search for product with safe filters
                const safeUrl = generateAmazonSearchLink(suggestion.productName, 'comparatop-20');
                window.open(safeUrl, '_blank', 'noopener,noreferrer');
            }
        } else if (suggestion.actionLink && suggestion.actionLink !== '#') {
            window.open(suggestion.actionLink, '_blank', 'noopener,noreferrer');
        } else {
            // No valid link - fallback to safe Amazon search
            const safeUrl = generateAmazonSearchLink(suggestion.productName, 'comparatop-20');
            window.open(safeUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Determine branding style
    const isPremium = suggestion.variant === 'premium' || (suggestion.label && suggestion.label.toLowerCase().includes('melhor'));
    const bgClass = isPremium ? 'bg-indigo-50 hover:bg-indigo-100' : 'bg-gray-50 hover:bg-gray-100';
    const accentClass = isPremium ? 'text-indigo-600' : 'text-blue-600';
    const iconClass = isPremium ? 'text-indigo-400 group-hover:text-indigo-500' : 'text-gray-400 group-hover:text-blue-500';

    return (
        <button
            onClick={handleClick}
            title={suggestion.actionType === 'scroll_to_bundle' || suggestion.actionLink.startsWith('#')
                ? "Ver sugestão abaixo ↓"
                : "Ver oferta na Amazon ↗"}
            className={cn(
                'w-full px-5 py-3 flex items-center justify-between gap-3 text-left transition-colors duration-200 group',
                bgClass,
                isFirst && !isLast && 'border-b border-gray-200',
                isFirst && 'rounded-t-none', // Assuming it's attached to card bottom
                isLast && 'rounded-b-xl'
            )}
        >
            <div className="flex-1 min-w-0">
                {/* Optional Label (e.g. "Kit Recomendado" or "Melhor para Cinema") */}
                {suggestion.label && (
                    <div className={cn("text-[10px] font-bold uppercase tracking-wide mb-0.5", accentClass)}>
                        {suggestion.label}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium text-text-primary transition-colors line-clamp-1", isPremium ? "group-hover:text-indigo-700" : "group-hover:text-blue-700")}>
                        {suggestion.productName}
                    </span>
                    {(!suggestion.actionType || suggestion.actionType === 'external_link') && !suggestion.actionLink.startsWith('#') ? (
                        <ExternalLink size={14} className={cn("flex-shrink-0", iconClass)} />
                    ) : (
                        <ArrowUpRight size={14} className={cn("flex-shrink-0", iconClass)} />
                    )}
                </div>
            </div>

            {suggestion.price && (
                <div className="text-right flex-shrink-0">
                    <span className={cn("text-sm font-bold", "text-emerald-600")}>
                        {suggestion.price}
                    </span>
                </div>
            )}
        </button>
    );
}

// ============================================
// SMART SIMULATOR CARD COMPONENT
// ============================================

interface SmartSimulatorCardProps {
    data: SmartCardData;
    className?: string;
}

export function SmartSimulatorCard({ data, className }: SmartSimulatorCardProps) {
    const config = typeConfig[data.type];
    const { StatusIcon } = config;
    const IconComponent = getIconComponent(data.icon);

    // Limit to 2 suggestions as requested
    const visibleSuggestions = data.suggestions?.slice(0, 2) || [];

    return (
        <div
            className={cn(
                config.bg,
                config.border,
                'border rounded-xl p-0', // Remove padding from container to handle footer flush
                'flex flex-col h-full',
                className
            )}
        >
            {/* Main Content Area */}
            <div className="p-5 flex items-start gap-4 flex-1">
                {/* Icon Container */}
                <div className={cn('p-3 rounded-lg bg-white border', config.border)}>
                    <IconComponent className={cn('w-6 h-6', config.iconColor)} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-text-primary">{data.title}</h3>
                        <StatusIcon className={cn('w-4 h-4', config.iconColor)} />
                    </div>

                    <p className={cn('text-sm mb-3', config.textBody)}>
                        {data.description}
                    </p>

                    {data.metadata && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <span>{data.metadata}</span>
                        </div>
                    )}

                    {data.badge && (
                        <div className="flex items-center gap-3 mt-2">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg',
                                    badgeColors[data.badge.color]
                                )}
                            >
                                {data.badge.label}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Suggestions Footer */}
            {visibleSuggestions.length > 0 && (
                <div className="mt-auto border-t border-gray-200 rounded-b-xl overflow-hidden">
                    {visibleSuggestions.map((suggestion, idx) => (
                        <SuggestionItem
                            key={idx}
                            suggestion={suggestion}
                            isFirst={idx === 0}
                            isLast={idx === visibleSuggestions.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// SMART SIMULATORS GRID COMPONENT
// ============================================

interface SmartSimulatorsGridProps {
    cards: SmartCardData[];
    title?: string;
    className?: string;
}

export function SmartSimulatorsGrid({
    cards,
    title = 'Simuladores Inteligentes',
    className
}: SmartSimulatorsGridProps) {
    if (!cards || cards.length === 0) return null;

    return (
        <section className={cn('mt-12', className)}>
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                {title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <SmartSimulatorCard key={index} data={card} />
                ))}
            </div>
        </section>
    );
}
