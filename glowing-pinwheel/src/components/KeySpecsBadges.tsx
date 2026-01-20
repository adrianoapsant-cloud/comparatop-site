'use client';

import { cn } from '@/lib/utils';
import {
    Monitor, Zap, Wifi, Volume2, Cpu, Gauge,
    Maximize, RefreshCw, Sun, Plug, Thermometer
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface KeySpec {
    label: string;
    value: string;
    icon?: string; // Icon name from lucide
}

interface KeySpecsBadgesProps {
    specs: KeySpec[];
    className?: string;
}

// Icon mapper
const iconMap: Record<string, React.ElementType> = {
    'resolution': Monitor,
    'refresh': RefreshCw,
    'brightness': Sun,
    'hdr': Gauge,
    'smart': Wifi,
    'audio': Volume2,
    'processor': Cpu,
    'size': Maximize,
    'power': Plug,
    'efficiency': Thermometer,
    'default': Zap,
};

// ============================================
// COMPONENT
// ============================================

export function KeySpecsBadges({ specs, className }: KeySpecsBadgesProps) {
    // Limit to 5 key specs max
    const displaySpecs = specs.slice(0, 5);

    if (displaySpecs.length === 0) return null;

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {displaySpecs.map((spec, idx) => {
                const IconComponent = iconMap[spec.icon || 'default'] || iconMap.default;

                return (
                    <div
                        key={idx}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5',
                            'bg-gray-50 border border-gray-200 rounded-full',
                            'text-xs font-semibold text-text-secondary',
                            'transition-colors hover:bg-gray-100 hover:border-gray-300'
                        )}
                    >
                        <IconComponent size={14} className="text-brand-core flex-shrink-0" />
                        <span className="text-text-primary font-bold">{spec.value}</span>
                        <span className="text-text-muted hidden sm:inline">{spec.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================
// HELPER: Extract Key Specs from Product
// ============================================

export function extractKeySpecs(product: {
    resolution?: string;
    refreshRate?: number;
    screenSize?: number;
    panelType?: string;
    hdrSupport?: string[];
    smartPlatform?: string;
    [key: string]: unknown;
}): KeySpec[] {
    const specs: KeySpec[] = [];

    // Resolution
    if (product.resolution) {
        specs.push({ label: 'Resolução', value: product.resolution, icon: 'resolution' });
    }

    // Refresh Rate
    if (product.refreshRate) {
        specs.push({ label: 'Taxa', value: `${product.refreshRate}Hz`, icon: 'refresh' });
    }

    // Screen Size
    if (product.screenSize) {
        specs.push({ label: 'Tela', value: `${product.screenSize}"`, icon: 'size' });
    }

    // Panel Type
    if (product.panelType) {
        specs.push({ label: 'Painel', value: product.panelType, icon: 'brightness' });
    }

    // HDR
    if (product.hdrSupport && product.hdrSupport.length > 0) {
        const hdrLabel = product.hdrSupport.includes('Dolby Vision') ? 'Dolby Vision' :
            product.hdrSupport.includes('HDR10+') ? 'HDR10+' : 'HDR';
        specs.push({ label: 'HDR', value: hdrLabel, icon: 'hdr' });
    }

    // Smart Platform
    if (product.smartPlatform) {
        specs.push({ label: 'Smart', value: product.smartPlatform, icon: 'smart' });
    }

    return specs.slice(0, 5);
}
