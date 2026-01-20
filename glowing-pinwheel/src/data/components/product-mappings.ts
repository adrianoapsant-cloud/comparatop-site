/**
 * @file product-mappings.ts
 * @description Mapeamento de produtos para seus componentes internos
 * 
 * @version 1.0.0
 */

import type { ProductComponentMapping } from './types';

// ============================================
// MAPEAMENTOS DE TVs
// ============================================

export const TV_PRODUCT_MAPPINGS: ProductComponentMapping[] = [
    // ----------------------------------------
    // SAMSUNG QN90C 65" (Mini-LED)
    // ----------------------------------------
    {
        productId: 'samsung-qn90c-65',
        productName: 'Samsung QN90C Neo QLED 65"',
        categoryId: 'tv',
        mappingConfidence: 0.85,
        mappingSource: 'service_manual',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'panel_miniled_samsung_neo_qled',
                quantity: 1,
                criticality: 'fatal',
                specificModel: 'QN65QN90C Panel',
                notes: 'Painel com ~500 zonas de dimming local',
            },
            {
                componentId: 'backlight_miniled_fald',
                quantity: 1,
                criticality: 'high',
                notes: 'Sistema Mini-LED integrado ao painel',
            },
            {
                componentId: 'board_tcon_independent',
                quantity: 1,
                criticality: 'high',
                partNumber: 'BN95-XXXXX',
            },
            {
                componentId: 'board_main_smart_tv',
                quantity: 1,
                criticality: 'high',
                specificModel: 'One Connect (se aplicável)',
            },
            {
                componentId: 'board_psu_integrated',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },

    // ----------------------------------------
    // LG C3 65" (OLED)
    // ----------------------------------------
    {
        productId: 'lg-c3-65',
        productName: 'LG C3 OLED evo 65"',
        categoryId: 'tv',
        mappingConfidence: 0.9,
        mappingSource: 'service_manual',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'panel_oled_lg_woled_evo',
                quantity: 1,
                criticality: 'fatal',
                specificModel: 'OLED65C3',
                notes: 'Painel WOLED Evo com deutério, brilho de pico ~800 nits',
            },
            {
                componentId: 'board_tcon_bonded',
                quantity: 1,
                criticality: 'fatal',
                notes: 'T-CON integrada ao painel via COF',
            },
            {
                componentId: 'board_main_smart_tv',
                quantity: 1,
                criticality: 'high',
                specificModel: 'webOS Main Board',
            },
            {
                componentId: 'board_psu_integrated',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },

    // ----------------------------------------
    // TCL C735 65" (QLED VA)
    // ----------------------------------------
    {
        productId: 'tcl-c735-65',
        productName: 'TCL C735 QLED 65"',
        categoryId: 'tv',
        mappingConfidence: 0.7,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'panel_va_qled_standard',
                quantity: 1,
                criticality: 'fatal',
            },
            {
                componentId: 'backlight_edge_led',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_tcon_independent',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_main_smart_tv',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_psu_integrated',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },
];

// ============================================
// MAPEAMENTOS DE GELADEIRAS
// ============================================

export const FRIDGE_PRODUCT_MAPPINGS: ProductComponentMapping[] = [
    // ----------------------------------------
    // SAMSUNG FAMILY HUB (Premium Smart)
    // ----------------------------------------
    {
        productId: 'samsung-rf23-family-hub',
        productName: 'Samsung RF23A9771SR Family Hub',
        categoryId: 'fridge',
        mappingConfidence: 0.85,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_inverter_embraco_vem',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Compressor Digital Inverter Samsung (baseado Embraco)',
            },
            {
                componentId: 'board_inverter_fridge',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_control_fridge',
                quantity: 1,
                criticality: 'high',
                notes: 'Inclui tela touchscreen Family Hub',
            },
            {
                componentId: 'fan_evaporator',
                quantity: 2,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 4,
                criticality: 'low',
                notes: 'French Door = 4 gaxetas',
            },
        ],
    },

    // ----------------------------------------
    // BRASTEMP INVERSE (Mid-Premium)
    // ----------------------------------------
    {
        productId: 'brastemp-inverse-460',
        productName: 'Brastemp Inverse BRE59AK 460L',
        categoryId: 'fridge',
        mappingConfidence: 0.80,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_inverter_embraco_vem',
                quantity: 1,
                criticality: 'fatal',
            },
            {
                componentId: 'board_inverter_fridge',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_control_fridge',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'fan_evaporator',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 2,
                criticality: 'low',
            },
        ],
    },

    // ----------------------------------------
    // CONSUL CRM50 (Budget)
    // ----------------------------------------
    {
        productId: 'consul-crm50-410',
        productName: 'Consul CRM50 Frost Free 410L',
        categoryId: 'fridge',
        mappingConfidence: 0.85,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_onoff_embraco',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Compressor convencional - mais robusto',
            },
            {
                componentId: 'thermostat_mechanical',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'fan_evaporator',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 2,
                criticality: 'low',
            },
        ],
    },

    // ----------------------------------------
    // PANASONIC BB71 (Premium Inverter)
    // ----------------------------------------
    {
        productId: 'panasonic-bb71-black',
        productName: 'Panasonic BB71 Inverter Black Glass',
        categoryId: 'fridge',
        mappingConfidence: 0.80,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_inverter_embraco_vem',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Inverter Econavi - alta eficiência',
            },
            {
                componentId: 'board_inverter_fridge',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_control_fridge',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'fan_evaporator',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 2,
                criticality: 'low',
            },
        ],
    },

    // ----------------------------------------
    // SAMSUNG RT53 EVOLUTION (Best Value)
    // ----------------------------------------
    {
        productId: 'samsung-rt53-evolution',
        productName: 'Samsung Evolution RT53 com POWERvolt',
        categoryId: 'fridge',
        mappingConfidence: 0.85,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_inverter_embraco_vem',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Digital Inverter com proteção POWERvolt',
            },
            {
                componentId: 'board_inverter_fridge',
                quantity: 1,
                criticality: 'high',
                notes: 'Inclui proteção contra picos (90V-310V)',
            },
            {
                componentId: 'board_control_fridge',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'fan_evaporator',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 2,
                criticality: 'low',
            },
        ],
    },

    // ----------------------------------------
    // PANASONIC BB64 (Premium Inverter A+++)
    // ----------------------------------------
    {
        productId: 'panasonic-bb64',
        productName: 'Panasonic BB64 Aço Escovado Inverse 460L',
        categoryId: 'fridge',
        mappingConfidence: 0.80,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_inverter_embraco_vem',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Inverter A+++ - máxima eficiência',
            },
            {
                componentId: 'board_inverter_fridge',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_control_fridge',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'fan_evaporator',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 2,
                criticality: 'low',
            },
        ],
    },

    // ----------------------------------------
    // ELECTROLUX IF43B (AutoSense Inverter)
    // ----------------------------------------
    {
        productId: 'electrolux-if43b',
        productName: 'Electrolux IF43B Efficient AutoSense 390L',
        categoryId: 'fridge',
        mappingConfidence: 0.80,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_inverter_embraco_vem',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Inverter A+++ com AutoSense IA',
            },
            {
                componentId: 'board_inverter_fridge',
                quantity: 1,
                criticality: 'high',
            },
            {
                componentId: 'board_control_fridge',
                quantity: 1,
                criticality: 'medium',
                notes: 'Inclui sistema AutoSense',
            },
            {
                componentId: 'fan_evaporator',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 2,
                criticality: 'low',
            },
        ],
    },

    // ----------------------------------------
    // HQ-150RDF (Compacta Budget)
    // ----------------------------------------
    {
        productId: 'hq-150rdf',
        productName: 'HQ Compacta Defrost 150L',
        categoryId: 'fridge',
        mappingConfidence: 0.70,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'compressor_onoff_embraco',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Compressor convencional - defrost manual',
            },
            {
                componentId: 'thermostat_mechanical',
                quantity: 1,
                criticality: 'medium',
            },
            {
                componentId: 'gasket_door',
                quantity: 2,
                criticality: 'low',
            },
        ],
    },
];

// ============================================
// MAPEAMENTOS DE AR-CONDICIONADOS
// ============================================

export const AC_PRODUCT_MAPPINGS: ProductComponentMapping[] = [
    // ----------------------------------------
    // LG DUAL INVERTER 12000
    // ----------------------------------------
    {
        productId: 'lg-dual-inverter-12000',
        productName: 'LG Dual Inverter Voice 12000 BTUs',
        categoryId: 'air_conditioner',
        mappingConfidence: 0.90,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'ac-compressor-landa-inverter',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Compressor Dual Inverter LG - garantia 10 anos',
            },
            {
                componentId: 'ac-coil-copper-gold-fin',
                quantity: 2,
                criticality: 'high',
                notes: 'Evaporadora + Condensadora com Gold Fin',
            },
            {
                componentId: 'ac-pcb-inverter-premium',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },

    // ----------------------------------------
    // SAMSUNG WINDFREE 12000
    // ----------------------------------------
    {
        productId: 'samsung-windfree-12000',
        productName: 'Samsung WindFree 12000 BTUs',
        categoryId: 'air_conditioner',
        mappingConfidence: 0.85,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'ac-compressor-gmcc-inverter',
                quantity: 1,
                criticality: 'fatal',
            },
            {
                componentId: 'ac-coil-copper-gold-fin',
                quantity: 2,
                criticality: 'high',
            },
            {
                componentId: 'ac-pcb-inverter-premium',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },

    // ----------------------------------------
    // ELECTROLUX ECO 9000 (Budget)
    // ----------------------------------------
    {
        productId: 'electrolux-eco-9000',
        productName: 'Electrolux Eco Turbo 9000 BTUs',
        categoryId: 'air_conditioner',
        mappingConfidence: 0.75,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'ac-compressor-rechi-inverter',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Compressor convencional - menos eficiente',
            },
            {
                componentId: 'ac-coil-aluminum-blue-fin',
                quantity: 2,
                criticality: 'high',
            },
            {
                componentId: 'ac-pcb-inverter-standard',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },

    // ----------------------------------------
    // CONSUL INVERTER 12000
    // ----------------------------------------
    {
        productId: 'consul-inverter-12000',
        productName: 'Consul Inverter 12000 BTUs',
        categoryId: 'air_conditioner',
        mappingConfidence: 0.80,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'ac-compressor-gmcc-inverter',
                quantity: 1,
                criticality: 'fatal',
            },
            {
                componentId: 'ac-coil-aluminum-blue-fin',
                quantity: 2,
                criticality: 'high',
            },
            {
                componentId: 'ac-pcb-inverter-standard',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },

    // ----------------------------------------
    // LG DUAL INVERTER VOICE + AI
    // ----------------------------------------
    {
        productId: 'lg-dual-inverter-voice-ai',
        productName: 'LG Dual Inverter Voice + AI 12000 BTUs',
        categoryId: 'air_conditioner',
        mappingConfidence: 0.90,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'ac-compressor-landa-inverter',
                quantity: 1,
                criticality: 'fatal',
                notes: 'Compressor Dual Inverter LG Premium',
            },
            {
                componentId: 'ac-coil-copper-gold-fin',
                quantity: 2,
                criticality: 'high',
            },
            {
                componentId: 'ac-pcb-inverter-premium',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },

    // ----------------------------------------
    // SAMSUNG WINDFREE CONNECT
    // ----------------------------------------
    {
        productId: 'samsung-windfree-connect',
        productName: 'Samsung WindFree Connect Sem Vento',
        categoryId: 'air_conditioner',
        mappingConfidence: 0.85,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-12',
        components: [
            {
                componentId: 'ac-compressor-gmcc-inverter',
                quantity: 1,
                criticality: 'fatal',
            },
            {
                componentId: 'ac-coil-copper-gold-fin',
                quantity: 2,
                criticality: 'high',
            },
            {
                componentId: 'ac-pcb-inverter-premium',
                quantity: 1,
                criticality: 'high',
            },
        ],
    },
];

// ============================================
// MAPEAMENTOS DE ROBÔS ASPIRADORES
// ============================================

export const ROBOT_VACUUM_PRODUCT_MAPPINGS: ProductComponentMapping[] = [
    // ----------------------------------------
    // WAP ROBOT W400 (Entrada com Mop)
    // ----------------------------------------
    {
        productId: 'wap-robot-w400',
        productName: 'WAP Robot W400 3 em 1',
        categoryId: 'robot-vacuum',
        mappingConfidence: 0.85,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-18',
        components: [
            {
                componentId: 'battery_liion_standard',
                quantity: 1,
                criticality: 'fatal',
                specificModel: '10.8V 2600mAh',
                notes: 'Bateria Li-ion padrão, troca DIY possível',
            },
            {
                componentId: 'motor_bldc_standard',
                quantity: 1,
                criticality: 'high',
                notes: 'Motor brushless 30W, 1500Pa',
            },
            {
                componentId: 'board_main_basic',
                quantity: 1,
                criticality: 'high',
                notes: 'Placa sem LiDAR, navegação aleatória',
            },
            {
                componentId: 'sensor_cliff_ir',
                quantity: 4,
                criticality: 'medium',
                notes: '4 sensores anti-queda',
            },
            {
                componentId: 'brush_kit_standard',
                quantity: 1,
                criticality: 'low',
                notes: 'Kit escovas + panos mop',
            },
            {
                componentId: 'wheel_module_standard',
                quantity: 2,
                criticality: 'medium',
                notes: 'Par de rodas tracionadas',
            },
        ],
    },

    // ----------------------------------------
    // ROBOROCK Q7 L5 (LiDAR Premium)
    // ----------------------------------------
    {
        productId: 'roborock-q7-l5',
        productName: 'Roborock Q7 L5 LiDAR',
        categoryId: 'robot-vacuum',
        mappingConfidence: 0.80,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-18',
        components: [
            {
                componentId: 'sensor_lidar_lds',
                quantity: 1,
                criticality: 'fatal',
                specificModel: 'LDS Tower 360°',
                notes: 'Torre LiDAR rotativa, componente mais caro do robô',
            },
            {
                componentId: 'battery_liion_premium',
                quantity: 1,
                criticality: 'fatal',
                specificModel: '14.4V 5200mAh',
                notes: 'Bateria Li-ion de alta capacidade, 150min autonomia',
            },
            {
                componentId: 'motor_bldc_premium',
                quantity: 1,
                criticality: 'high',
                notes: 'Motor brushless potente, 8000Pa sucção',
            },
            {
                componentId: 'board_main_smart',
                quantity: 1,
                criticality: 'high',
                notes: 'Placa com processador de mapeamento 3D',
            },
            {
                componentId: 'sensor_cliff_ir',
                quantity: 4,
                criticality: 'medium',
                notes: '4 sensores anti-queda + sensores 3D obstáculos',
            },
            {
                componentId: 'brush_kit_standard',
                quantity: 1,
                criticality: 'low',
                notes: 'Escovas duplas de borracha anti-emaranhamento',
            },
            {
                componentId: 'wheel_module_standard',
                quantity: 2,
                criticality: 'medium',
                notes: 'Par de rodas tracionadas com suspensão',
            },
        ],
    },

    // ----------------------------------------
    // XIAOMI ROBOT VACUUM X10 (LiDAR + Auto-Empty)
    // ----------------------------------------
    {
        productId: 'xiaomi-robot-x10',
        productName: 'Xiaomi Robot Vacuum X10',
        categoryId: 'robot-vacuum',
        mappingConfidence: 0.80,
        mappingSource: 'inferred',
        lastUpdated: '2026-01-18',
        components: [
            {
                componentId: 'sensor_lidar_lds',
                quantity: 1,
                criticality: 'fatal',
                specificModel: 'LDS Tower 360°',
                notes: 'Torre LDS rotativa para navegação laser',
            },
            {
                componentId: 'battery_liion_premium',
                quantity: 1,
                criticality: 'fatal',
                specificModel: '14.4V 5200mAh',
                notes: 'Bateria premium de alta capacidade, 180min autonomia',
            },
            {
                componentId: 'motor_bldc_premium',
                quantity: 1,
                criticality: 'high',
                notes: 'Motor brushless 4000Pa sucção',
            },
            {
                componentId: 'board_main_smart',
                quantity: 1,
                criticality: 'high',
                notes: 'Placa com processador de mapeamento + controle auto-empty',
            },
            {
                componentId: 'sensor_cliff_ir',
                quantity: 4,
                criticality: 'medium',
                notes: '4 sensores anti-queda + sensores anticolisão',
            },
            {
                componentId: 'brush_kit_standard',
                quantity: 1,
                criticality: 'low',
                notes: 'Escova principal + laterais (não anti-tangle)',
            },
            {
                componentId: 'wheel_module_standard',
                quantity: 2,
                criticality: 'medium',
                notes: 'Par de rodas tracionadas',
            },
        ],
    },
];


// ============================================
// CONSOLIDADO DE TODOS OS MAPEAMENTOS
// ============================================

export const ALL_PRODUCT_MAPPINGS: ProductComponentMapping[] = [
    ...TV_PRODUCT_MAPPINGS,
    ...FRIDGE_PRODUCT_MAPPINGS,
    ...AC_PRODUCT_MAPPINGS,
    ...ROBOT_VACUUM_PRODUCT_MAPPINGS,
];

// ============================================
// HELPERS
// ============================================

/**
 * Busca mapeamento de componentes por ID do produto
 */
export function getProductMapping(productId: string): ProductComponentMapping | undefined {
    return ALL_PRODUCT_MAPPINGS.find(m => m.productId === productId);
}

/**
 * Lista todos os produtos mapeados
 */
export function getAllMappedProducts(): string[] {
    return ALL_PRODUCT_MAPPINGS.map(m => m.productId);
}

/**
 * Lista produtos mapeados por categoria
 */
export function getMappedProductsByCategory(categoryId: string): string[] {
    return ALL_PRODUCT_MAPPINGS
        .filter(m => m.categoryId === categoryId)
        .map(m => m.productId);
}
