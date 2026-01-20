/**
 * Facts Extraction for Contextual Scoring
 * 
 * This module extracts ProductFacts from real product data
 * so the contextual scoring system can work with existing products.
 */

import type { Product } from '@/types/category';
import type { ProductFacts } from '@/lib/scoring/types';

// ============================================
// CATEGORY-SPECIFIC FACT EXTRACTORS
// ============================================

/**
 * Extract facts from Air Conditioner products
 */
function extractACFacts(product: Product): ProductFacts {
    const specs = product.technicalSpecs || product.specs || {};
    const attrs = product.attributes || {};

    return {
        // BTU capacity
        rated_btu: specs.btus as number || specs.btu as number || 12000,

        // Inverter type
        inverter_type: specs.inverterType as string ||
            (product.name.toLowerCase().includes('dual inverter') ? 'dual-inverter' :
                product.name.toLowerCase().includes('inverter') ? 'inverter' : 'conventional'),

        // Noise level
        noise_level_db: specs.noiseLevel as number || 30,

        // Coil material - infer from brand/model
        coil_material: product.brand === 'LG' || product.brand === 'Samsung' ? 'copper' : 'aluminum',

        // Anti-corrosive protection - premium brands usually have it
        has_anticorrosive_protection: product.brand === 'LG' || product.brand === 'Samsung' || product.brand === 'Daikin',

        // WiFi capability
        has_wifi: Boolean(attrs.wifi) || product.name.toLowerCase().includes('wifi') ||
            product.name.toLowerCase().includes('voice') || product.name.toLowerCase().includes('smart'),

        // Energy efficiency
        energy_rating: specs.efficiency as string || specs.energyRating as string || 'B',

        // Type
        type: specs.type as string || 'split',

        // Voltage
        voltage: specs.voltage as string || '220v',

        // Cycle (heat/cool)
        cycle: specs.cycle as string || 'cold',
    };
}

/**
 * Extract facts from TV products
 */
function extractTVFacts(product: Product): ProductFacts {
    const specs = product.technicalSpecs || product.specs || {};
    const attrs = product.attributes || {};

    return {
        // Panel type
        panel_type: specs.panelType as string || 'LED',

        // Screen size
        screen_size: specs.screenSize as number || 55,

        // Resolution
        resolution: specs.resolution as string || '4K',

        // Refresh rate
        refresh_rate: specs.refreshRate as number || 60,

        // HDMI 2.1 ports
        hdmi_21_ports: attrs.hdmi21Ports as number || 0,

        // VRR support
        has_vrr: Boolean(attrs.vrr),

        // Dolby Vision
        has_dolby_vision: Boolean(attrs.dolbyVision),

        // HDR10+
        has_hdr10_plus: Boolean(attrs.hdr10Plus),

        // Peak brightness
        peak_brightness_nits: attrs.brightness as number || 400,

        // Smart platform
        smart_platform: attrs.smartPlatform as string || 'unknown',

        // Response time (gaming)
        response_time_ms: attrs.responseTime as number || 15,
    };
}

/**
 * Extract facts from Fridge products
 */
function extractFridgeFacts(product: Product): ProductFacts {
    const specs = product.technicalSpecs || product.specs || {};

    return {
        // Capacity
        capacity_liters: specs.capacityLitres as number || specs.capacity as number || 400,

        // Type
        type: specs.type as string || 'top-freezer',

        // Inverter technology
        has_inverter: product.name.toLowerCase().includes('inverter') ||
            specs.technology?.toString().toLowerCase().includes('inverter'),

        // Frost free
        is_frost_free: product.name.toLowerCase().includes('frost free') || true,

        // Voltage
        voltage: specs.voltage as string || 'bivolt',

        // Energy rating
        energy_rating: specs.energyRating as string || 'A',

        // Dimensions
        width_cm: specs.width as number || 70,
        height_cm: specs.height as number || 180,
        depth_cm: specs.depth as number || 70,

        // Smart features
        has_wifi: product.name.toLowerCase().includes('smart') ||
            product.name.toLowerCase().includes('family hub'),

        // Ice maker  
        has_ice_maker: product.name.toLowerCase().includes('ice'),
    };
}

/**
 * Extract facts from Notebook products
 */
function extractNotebookFacts(product: Product): ProductFacts {
    const specs = product.technicalSpecs || product.specs || {};
    const attrs = product.attributes || {};

    return {
        // Processor
        processor: specs.processor as string || 'unknown',
        processor_generation: String(specs.processorGeneration || 'unknown'),

        // RAM
        ram_gb: specs.ram as number || 8,
        ram_type: specs.ramType as string || 'DDR4',

        // Storage
        storage_type: specs.storageType as string || 'SSD',
        storage_gb: specs.storage as number || 256,

        // Display
        screen_size: specs.screenSize as number || 15.6,
        screen_type: specs.screenType as string || 'IPS',

        // GPU
        has_dedicated_gpu: Boolean(attrs.dedicatedGpu) ||
            product.name.toLowerCase().includes('rtx') ||
            product.name.toLowerCase().includes('gtx'),

        // Battery
        battery_wh: specs.battery as number || 45,

        // Weight
        weight_kg: specs.weight as number || 2.0,
    };
}

// ============================================
// MAIN EXTRACTION FUNCTION
// ============================================

/**
 * Map category IDs to scoring category slugs
 * IMPORTANT: These MUST match the keys in RULES_REGISTRY (useScoring.ts)
 */
const CATEGORY_SLUG_MAP: Record<string, string> = {
    // Climatização
    'tv': 'tv',  // RULES_REGISTRY uses 'tv'
    'smart_tv': 'tv',

    // Refrigeração  
    'fridge': 'geladeira',  // RULES_REGISTRY uses 'geladeira'
    'refrigerator': 'geladeira',
    'freezer': 'freezer',
    'minibar': 'minibar',
    'wine_cooler': 'adega',

    // Climatização
    'air_conditioner': 'ar-condicionado',  // RULES_REGISTRY uses 'ar-condicionado'
    'ac': 'ar-condicionado',

    // Eletrônicos
    'notebook': 'notebook',
    'laptop': 'notebook',
    'tablet': 'tablet',
    'smartphone': 'smartphone',
    'monitor': 'monitor',
    'projector': 'projetor',
    'camera': 'camera',
    'console': 'console',

    // Lavanderia
    'washer': 'maquina-lavar',
    'dryer': 'lava-seca',
    'dishwasher': 'lava-loucas',

    // Cozinha
    'microwave': 'micro-ondas',
    'stove': 'fogao',
    'air_fryer': 'air-fryer',
    'espresso': 'cafeteira',
    'blender': 'batedeira',
    'water_purifier': 'purificador',
    'range_hood': 'coifa',
    'oven': 'forno',

    // Limpeza
    'robot_vacuum': 'robo-aspirador',
    'stick_vacuum': 'aspirador-vertical',
    'fan': 'ventilador',

    // Áudio
    'soundbar': 'soundbar',
    'headphone': 'headset',
    'speaker': 'caixa-som',
    'tws': 'fone-tws',

    // PC Components
    'gpu': 'gpu',
    'cpu': 'cpu',
    'ram': 'ram',
    'ssd': 'ssd',
    'motherboard': 'placa-mae',
    'psu': 'fonte',
    'case': 'gabinete',
    'ups': 'nobreak',
    'power_strip': 'filtro-linha',

    // Periféricos
    'router': 'roteador',
    'printer': 'impressora',
    'smartwatch': 'smartwatch',

    // Segurança
    'security_camera': 'camera-seguranca',
    'smart_lock': 'fechadura',

    // Auto
    'tire': 'pneu',
    'car_battery': 'bateria',
    'pressure_washer': 'lavadora-alta',
    'drill': 'furadeira',
};

/**
 * Extract ProductFacts from a real product for contextual scoring
 * 
 * @param product - The product to extract facts from
 * @returns Object with scoring_facts and scoring_category ready for useScoring hook
 */
export function extractFactsFromProduct(product: Product): {
    scoring_facts: ProductFacts;
    scoring_category: string;
} {
    const categoryId = product.categoryId.toLowerCase();

    // Get the scoring category slug
    const scoringCategory = CATEGORY_SLUG_MAP[categoryId] || categoryId;

    // Extract category-specific facts
    let facts: ProductFacts = {};

    switch (categoryId) {
        case 'tv':
            facts = extractTVFacts(product);
            break;
        case 'fridge':
            facts = extractFridgeFacts(product);
            break;
        case 'air_conditioner':
            facts = extractACFacts(product);
            break;
        case 'notebook':
        case 'laptop':
            facts = extractNotebookFacts(product);
            break;
        default:
            // Generic extraction: merge all available specs
            facts = {
                ...(product.technicalSpecs || {}),
                ...(product.specs || {}),
                ...(product.attributes || {}),
            };
    }

    // Add common facts
    facts.brand = product.brand;
    facts.price = product.price;
    facts.model = product.model;

    return {
        scoring_facts: facts,
        scoring_category: scoringCategory,
    };
}

/**
 * Check if a product has contextual scoring data
 */
export function hasContextualScoring(product: Product): boolean {
    return Boolean(product.scoring_facts && product.scoring_category);
}

/**
 * Enhance a product with contextual scoring fields
 * Returns a new product object with scoring_facts and scoring_category
 */
export function enhanceProductWithScoring(product: Product): Product {
    // If already has scoring data, return as-is
    if (hasContextualScoring(product)) {
        return product;
    }

    // Extract facts and add to product
    const { scoring_facts, scoring_category } = extractFactsFromProduct(product);

    return {
        ...product,
        scoring_facts,
        scoring_category,
    };
}
