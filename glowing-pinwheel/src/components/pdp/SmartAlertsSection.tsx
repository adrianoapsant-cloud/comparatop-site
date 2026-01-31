'use client';

import { Zap } from 'lucide-react';
import { SmartSimulatorCard, type SmartCardData, type SmartCardSuggestion } from '@/components/SmartSimulatorCard';
import type { ProductData } from '@/config/product-json-schema';
import { ModuleFallback } from './ModuleFallback';

type SmartAlertsData = ProductData['simulators'];

interface SmartAlertsSectionProps {
    data: SmartAlertsData;
    categoryId?: string; // Optional category for label customization
}

// ============================================
// CATEGORY-SPECIFIC LABELS
// ============================================

interface CategoryLabels {
    sizeTitle: string;
    sizeIcon: string;
    sizeUnit: string;
    soundTitle: string;
    soundIcon: string;
}

const CATEGORY_LABELS: Record<string, CategoryLabels> = {
    tv: {
        sizeTitle: 'Tamanho da Tela',
        sizeIcon: 'monitor',
        sizeUnit: '"',
        soundTitle: 'Qualidade de Áudio',
        soundIcon: 'volume-2',
    },
    fridge: {
        sizeTitle: 'Capacidade de Armazenamento',
        sizeIcon: 'refrigerator',
        sizeUnit: 'L',
        soundTitle: 'Nível de Ruído',
        soundIcon: 'volume-x',
    },
    geladeira: {
        sizeTitle: 'Capacidade de Armazenamento',
        sizeIcon: 'refrigerator',
        sizeUnit: 'L',
        soundTitle: 'Nível de Ruído',
        soundIcon: 'volume-x',
    },
    air_conditioner: {
        sizeTitle: 'Capacidade BTU',
        sizeIcon: 'wind',
        sizeUnit: ' BTU',
        soundTitle: 'Nível de Ruído',
        soundIcon: 'volume-x',
    },
    monitor: {
        sizeTitle: 'Tamanho da Tela',
        sizeIcon: 'monitor',
        sizeUnit: '"',
        soundTitle: 'Qualidade de Imagem',
        soundIcon: 'eye',
    },
    air_fryer: {
        sizeTitle: 'Dimensões na Bancada',
        sizeIcon: 'ruler',
        sizeUnit: 'cm',
        soundTitle: 'Potência e Ruído',
        soundIcon: 'volume-2',
    },
    'robot-vacuum': {
        sizeTitle: 'Altura vs Móveis',
        sizeIcon: 'move-vertical',
        sizeUnit: 'cm',
        soundTitle: 'Sistema de Mop',
        soundIcon: 'droplets',
    },
};

const DEFAULT_LABELS: CategoryLabels = {
    sizeTitle: 'Dimensões',
    sizeIcon: 'ruler',
    sizeUnit: '',
    soundTitle: 'Características',
    soundIcon: 'info',
};

// ============================================
// LEGACY DATA MAPPER
// ============================================
// This function converts the current SimulatorsData format to SmartCardData[]
// In the future, Gemini API will return SmartCardData directly

function mapLegacyToSmartCards(data: SmartAlertsData, categoryId?: string): SmartCardData[] {
    const cards: SmartCardData[] = [];
    const labels = CATEGORY_LABELS[categoryId || 'tv'] || DEFAULT_LABELS;

    // Size Alert Card
    if (data.sizeAlert) {
        const idealRangeText = data.sizeAlert.idealRange
            ? `Ideal: ${data.sizeAlert.idealRange.min}${labels.sizeUnit} - ${data.sizeAlert.idealRange.max}${labels.sizeUnit}`
            : undefined;

        cards.push({
            type: data.sizeAlert.status === 'optimal' ? 'optimal' :
                data.sizeAlert.status === 'warning' ? 'warning' : 'info',
            icon: labels.sizeIcon,
            title: labels.sizeTitle,
            description: data.sizeAlert.message,
            metadata: idealRangeText,
        });
    }

    // Sound Alert Card (with potential cross-sell suggestions)
    if (data.soundAlert) {
        const soundCard: SmartCardData = {
            type: data.soundAlert.status === 'optimal' ? 'optimal' :
                data.soundAlert.status === 'warning' ? 'warning' : 'info',
            icon: labels.soundIcon,
            title: labels.soundTitle,
            description: data.soundAlert.message,
        };

        // Handle suggestions - supports both legacy and new SmartCardSuggestion format
        if (data.soundAlert.suggestions && data.soundAlert.suggestions.length > 0) {
            soundCard.suggestions = data.soundAlert.suggestions.slice(0, 2).map((sug, idx) => {
                // Check if it's already in SmartCardSuggestion format (has productName)
                if ('productName' in sug) {
                    return sug as unknown as SmartCardSuggestion;
                }
                // Legacy format: just use productName, empty link triggers Amazon fallback
                const legacySug = sug as { condition?: string; product: string; reason?: string; };
                return {
                    label: legacySug.condition,
                    productName: legacySug.product,
                    actionLink: '', // Empty = triggers Amazon search fallback
                } as SmartCardSuggestion;
            });
        }

        cards.push(soundCard);
    }

    // Energy Alert Card
    if (data.energyAlert) {
        const energyStatus = data.energyAlert.rating === 'A' ? 'optimal' :
            data.energyAlert.rating === 'B' ? 'info' : 'warning';

        const badgeColor = data.energyAlert.rating === 'A' ? 'emerald' :
            data.energyAlert.rating === 'B' ? 'lime' :
                data.energyAlert.rating === 'C' ? 'yellow' :
                    data.energyAlert.rating === 'D' ? 'orange' : 'red';

        cards.push({
            type: energyStatus,
            icon: 'zap',
            title: 'Consumo Energético',
            description: data.energyAlert.message,
            badge: {
                label: data.energyAlert.rating,
                color: badgeColor as 'emerald' | 'lime' | 'yellow' | 'orange' | 'red',
            },
        });
    }

    return cards;
}

// ============================================
// SMART ALERTS SECTION (REFACTORED)
// ============================================

export function SmartAlertsSection({ data, categoryId }: SmartAlertsSectionProps) {
    // Convert legacy data to SmartCardData format with category-specific labels
    const smartCards = mapLegacyToSmartCards(data, categoryId);

    if (smartCards.length === 0) {
        return (
            <ModuleFallback
                sectionId="simulators"
                sectionName="Simuladores Inteligentes"
                status="unavailable"
                reason="Nenhum simulador disponível para este produto"
                missingFields={['sizeAlert', 'soundAlert', 'energyAlert']}
            />
        );
    }

    return (
        <section className="mt-12">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                Simuladores Inteligentes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smartCards.map((card, index) => (
                    <SmartSimulatorCard key={index} data={card} />
                ))}
            </div>
        </section>
    );
}

// ============================================
// FUTURE: GEMINI-POWERED SIMULATORS SECTION
// ============================================
// This component will be used when Gemini returns SmartCardData directly

interface GeminiSimulatorsSectionProps {
    cards: SmartCardData[];
    title?: string;
}

export function GeminiSimulatorsSection({
    cards,
    title = 'Simuladores Inteligentes'
}: GeminiSimulatorsSectionProps) {
    if (!cards || cards.length === 0) return null;

    return (
        <section className="mt-12">
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
