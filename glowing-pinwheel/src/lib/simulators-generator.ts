/**
 * Simulators Data Generator
 * 
 * Generates SmartCardData for SimulatorsSection dynamically based on product data.
 * This allows all products to have Smart Simulator Cards without requiring 
 * individual JSON files for each product.
 * 
 * IMPORTANT: Uses bundle-matcher.ts as Single Source of Suggestion
 * to ensure consistency between Simulators and Bundle Widget.
 */

import type { Product } from '@/types/category';
import type { SmartCardData, SmartCardSuggestion } from '@/components/SmartSimulatorCard';
import { getAccessorySuggestions, type BundleMatch } from '@/lib/bundle-matcher';

// ============================================
// HELPER: Convert BundleMatch to SmartCardSuggestion
// ============================================

/**
 * Converts bundle-matcher results to SmartCardSuggestion format
 * This ensures consistency between Simulators and Bundle Widget
 */
function convertToSmartSuggestions(
    matches: BundleMatch[],
    maxSuggestions: number = 2
): SmartCardSuggestion[] {
    return matches.slice(0, maxSuggestions).map((match, idx) => ({
        label: idx === 0 ? 'Kit Recomendado' : 'Alternativa',
        productName: match.accessory.name,
        price: `R$ ${match.accessory.price.toLocaleString('pt-BR')}`,
        actionLink: '#bundle-widget',
        actionType: 'scroll_to_bundle' as const,
        variant: idx === 0 ? 'premium' as const : 'standard' as const,
    }));
}

/**
 * Get accessory suggestions for simulators using the same source as Bundle Widget
 */
function getSimulatorSuggestions(product: Product): SmartCardSuggestion[] {
    const bundleMatches = getAccessorySuggestions(product, 2);
    return convertToSmartSuggestions(bundleMatches);
}

// ============================================
// SIMULATORS GENERATOR FUNCTIONS
// ============================================

interface SimulatorsData {
    sizeAlert: {
        status: 'optimal' | 'acceptable' | 'warning';
        message: string;
        idealRange: { min: number; max: number };
    };
    soundAlert: {
        status: 'optimal' | 'acceptable' | 'warning';
        message: string;
        suggestions?: Array<{
            condition: string;
            product: string;
            reason: string;
        }>;
    };
    energyAlert: {
        rating: 'A' | 'B' | 'C' | 'D' | 'E';
        message: string;
    };
}

/**
 * Generate simulators data for a TV product
 */
function generateTVSimulators(product: Product): SimulatorsData {
    const specs = (product.specs || {}) as Record<string, unknown>;
    const attrs = (product.attributes || {}) as Record<string, unknown>;

    const screenSize = Number(specs.screenSize || attrs.screenSize) || 55;
    const soundPower = Number(specs.soundPower || attrs.soundPower) || 20;
    const panelType = String(specs.panelType || attrs.panelType || 'LED');

    // Size alert based on typical viewing distance (2.5m average)
    const idealMin = 50;
    const idealMax = 65;
    const sizeStatus = screenSize >= idealMin && screenSize <= idealMax ? 'optimal' :
        screenSize >= idealMin - 5 && screenSize <= idealMax + 5 ? 'acceptable' : 'warning';

    // Sound alert based on power
    const soundStatus = soundPower >= 40 ? 'optimal' : 'warning';

    // Get accessory suggestions from bundle-matcher (Single Source of Suggestion)
    const suggestions = soundStatus === 'warning' ? getSimulatorSuggestions(product) : undefined;

    // Energy rating based on panel type and efficiency
    const energyRating: 'A' | 'B' | 'C' = panelType.toLowerCase().includes('oled') ? 'B' :
        panelType.toLowerCase().includes('qled') ? 'B' : 'C';

    const typicalConsumption = panelType.toLowerCase().includes('oled') ? 120 :
        panelType.toLowerCase().includes('qled') ? 180 : 150;
    const monthlyEstimate = Math.round((typicalConsumption * 5 * 30 * 0.75) / 1000); // 5h/day, R$0.75/kWh

    return {
        sizeAlert: {
            status: sizeStatus,
            message: `Para distância média de 2.5m, a tela de ${screenSize}" está ${sizeStatus === 'optimal' ? 'no ponto ideal' : 'adequada'} (${idealMin}-${idealMax}").`,
            idealRange: { min: idealMin, max: idealMax },
        },
        soundAlert: {
            status: soundStatus,
            message: soundPower < 40
                ? `O áudio de ${soundPower}W é fraco para filmes. Soundbar recomendada.`
                : `Sistema de ${soundPower}W é adequado para uso casual.`,
            // Note: SmartCardSuggestion[] format - will be mapped in SimulatorsSection
            suggestions: suggestions as unknown as Array<{ condition: string; product: string; reason: string; }>,
        },
        energyAlert: {
            rating: energyRating,
            message: `Consumo de ${typicalConsumption}W típico. Conta ~R$ ${monthlyEstimate}/mês com 5h/dia de uso.`,
        },
    };
}

/**
 * Generate simulators data for a Fridge product
 */
function generateFridgeSimulators(product: Product): SimulatorsData {
    const specs = (product.specs || {}) as Record<string, unknown>;
    const attrs = (product.attributes || {}) as Record<string, unknown>;

    const capacity = Number(specs.capacity || attrs.capacity || specs.liters) || 400;
    const energyClass = String(specs.energyClass || attrs.energyClass || 'A');
    const hasInverter = Boolean(specs.inverter || attrs.inverter);

    // Size alert based on family size (typical 4 people = 350-450L ideal)
    const idealMin = 350;
    const idealMax = 500;
    const sizeStatus = capacity >= idealMin && capacity <= idealMax ? 'optimal' :
        capacity >= idealMin - 50 && capacity <= idealMax + 50 ? 'acceptable' : 'warning';

    // "Sound" alert for fridges = noise level
    const noiseLevel = Number(specs.noiseLevel || attrs.noiseLevel) || 39;
    const noiseStatus = noiseLevel <= 35 ? 'optimal' : noiseLevel <= 42 ? 'acceptable' : 'warning';

    // Energy rating
    const energyRating = energyClass.toUpperCase().startsWith('A') ? 'A' :
        energyClass.toUpperCase().startsWith('B') ? 'B' : 'C';

    const typicalConsumption = hasInverter ? 35 : 45; // kWh/month
    const monthlyEstimate = Math.round(typicalConsumption * 0.75);

    return {
        sizeAlert: {
            status: sizeStatus,
            message: `Capacidade de ${capacity}L é ${sizeStatus === 'optimal' ? 'ideal' : 'adequada'} para família média (3-5 pessoas).`,
            idealRange: { min: idealMin, max: idealMax },
        },
        soundAlert: {
            status: noiseStatus,
            message: noiseLevel <= 35
                ? `Apenas ${noiseLevel}dB de ruído. Silenciosa o suficiente para cozinhas abertas.`
                : `Nível de ruído de ${noiseLevel}dB. Aceitável para a maioria dos ambientes.`,
            suggestions: undefined, // Fridges don't typically need accessories for noise
        },
        energyAlert: {
            rating: energyRating as 'A' | 'B' | 'C' | 'D' | 'E',
            message: `${hasInverter ? 'Compressor Inverter: ' : ''}Consumo de ~${typicalConsumption}kWh/mês. Conta ~R$ ${monthlyEstimate}/mês.`,
        },
    };
}

/**
 * Generate simulators data for an Air Conditioner product
 */
function generateACSimulators(product: Product): SimulatorsData {
    const specs = (product.specs || {}) as Record<string, unknown>;
    const attrs = (product.attributes || {}) as Record<string, unknown>;

    const btus = Number(specs.btus || attrs.btus || attrs.btuCapacity) || 12000;
    const hasInverter = Boolean(specs.inverter || attrs.inverter);
    const noiseLevel = Number(specs.noiseLevel || attrs.noiseLevel) || 42;

    // BTU adequacy (12000 BTU = ~20m² typical)
    const idealArea = Math.round(btus / 600);
    const sizeStatus = btus >= 9000 && btus <= 24000 ? 'optimal' : 'warning';

    // Noise status
    const noiseStatus = noiseLevel <= 38 ? 'optimal' : noiseLevel <= 45 ? 'acceptable' : 'warning';

    // Energy rating
    const energyRating = hasInverter ? 'A' : 'C';
    const monthlyEstimate = hasInverter
        ? Math.round((btus / 12000) * 60)
        : Math.round((btus / 12000) * 120);

    return {
        sizeAlert: {
            status: sizeStatus,
            message: `${btus.toLocaleString('pt-BR')} BTUs são ideais para ambientes de até ${idealArea}m².`,
            idealRange: { min: idealArea - 5, max: idealArea + 5 },
        },
        soundAlert: {
            status: noiseStatus,
            message: noiseLevel <= 38
                ? `Apenas ${noiseLevel}dB na unidade interna. Silencioso para quartos.`
                : `Nível de ${noiseLevel}dB. Adequado para salas e escritórios.`,
            suggestions: undefined,
        },
        energyAlert: {
            rating: energyRating as 'A' | 'B' | 'C' | 'D' | 'E',
            message: hasInverter
                ? `Inverter economiza até 60%. Estimativa: ~R$ ${monthlyEstimate}/mês (8h/dia).`
                : `Modelo convencional. Estimativa: ~R$ ${monthlyEstimate}/mês (8h/dia).`,
        },
    };
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

/**
 * Generate simulators data for any product based on its category
 * Returns null if the category is not supported
 */
export function generateSimulatorsData(product: Product): SimulatorsData | null {
    switch (product.categoryId) {
        case 'tv':
        case 'smart-tv':
            return generateTVSimulators(product);
        case 'fridge':
        case 'geladeira':
            return generateFridgeSimulators(product);
        case 'air_conditioner':
        case 'ar-condicionado':
            return generateACSimulators(product);
        default:
            // Return generic data for unsupported categories
            return null;
    }
}

/**
 * Check if a product category supports simulators
 */
export function supportsSimulators(categoryId: string): boolean {
    const supported = ['tv', 'smart-tv', 'fridge', 'geladeira', 'air_conditioner', 'ar-condicionado'];
    return supported.includes(categoryId.toLowerCase());
}
