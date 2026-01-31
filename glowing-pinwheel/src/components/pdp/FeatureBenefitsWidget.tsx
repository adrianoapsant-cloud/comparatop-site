'use client';

/**
 * FeatureBenefitsWidget
 * 
 * Displays a grid of product feature-benefit cards with icons.
 * Features are passed from mock data or product.featureBenefits.
 */

import {
    Zap, Eye, Leaf, Shield, Wind, Gamepad2, Sun, Cpu,
    Volume2, Ruler, TrendingDown, Award, Star, LucideIcon
} from 'lucide-react';
import type { FeatureBenefit } from '@/types/category';

// Icon mapping for Lucide icons
const IconMap: Record<string, LucideIcon> = {
    zap: Zap,
    eye: Eye,
    leaf: Leaf,
    shield: Shield,
    wind: Wind,
    gamepad2: Gamepad2,
    gamepad: Gamepad2,
    sun: Sun,
    cpu: Cpu,
    volume2: Volume2,
    ruler: Ruler,
    trendingdown: TrendingDown,
    award: Award,
    star: Star,
};

export interface FeatureBenefitsWidgetProps {
    features: FeatureBenefit[];
}

export function FeatureBenefitsWidget({ features }: FeatureBenefitsWidgetProps) {
    if (!features || features.length === 0) return null;

    return (
        <div className="feature-benefits">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                Por Que Escolher Este Produto?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, idx) => {
                    const iconKey = feature.icon?.toLowerCase().replace(/-/g, '');
                    const Icon = IconMap[iconKey] || Zap;
                    return (
                        <div
                            key={idx}
                            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-core/30 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-core/10 flex items-center justify-center flex-shrink-0">
                                    <Icon size={20} className="text-brand-core" />
                                </div>
                                <div>
                                    <h3 className="font-body font-semibold text-text-primary mb-1 text-sm">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FeatureBenefitsWidget;
