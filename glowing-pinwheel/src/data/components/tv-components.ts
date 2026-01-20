/**
 * @file tv-components.ts
 * @description Base de dados de componentes para Smart TVs
 * 
 * Componentes mapeados:
 * - Painéis: OLED, WOLED Evo, Mini-LED, QLED, VA LCD
 * - Eletrônica: T-CON, Main Board, Fonte
 * - Backlight: Edge LED, FALD, Mini-LED zones
 * 
 * @version 1.0.0
 */

import type { ComponentDefinition } from './types';

// ============================================
// PAINÉIS DE DISPLAY
// ============================================

export const TV_PANELS: ComponentDefinition[] = [
    // ----------------------------------------
    // OLED PANELS
    // ----------------------------------------
    {
        id: 'panel_oled_lg_woled_evo',
        name: 'Painel WOLED Evo (LG Display)',
        category: 'panel',
        subcategory: 'oled',
        manufacturer: 'LG Display',
        technology: 'WOLED Evo com Deutério',
        description: 'Painel OLED branco com camada de deutério para maior brilho e vida útil. Usado em LG C3, G3.',

        reliability: {
            l10LifeHours: 100000,
            weibullBeta: 1.8,        // Desgaste gradual previsível
            weibullEtaYears: 12,
            annualFailureRate: 0.02,
        },

        costs: {
            partCostBRL: 3500,       // Painel é praticamente o preço da TV
            laborCostBRL: 500,
            repairTimeHours: 4,
        },

        riskFactors: {
            tropicalPenalty: 1.1,    // OLED é sensível ao calor
            coastalPenalty: 1.0,     // Selado, sem impacto
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.3,        // Degrada mais rápido em calor
        },

        repairability: {
            partsAvailability: 'scarce',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 1,   // Praticamente irreparável
            hasServiceManual: true,
            disassemblyScore: 3,
        },

        failureModes: ['burn_in', 'brilho_reduzido', 'manchas_permanentes', 'linha_vertical'],
        failureSymptoms: [
            'Imagem fantasma/retenção permanente',
            'Brilho visivelmente menor que no início',
            'Manchas ou áreas escuras permanentes',
        ],
        dataSource: 'manufacturer',
        lastUpdated: '2026-01-12',
        notes: 'Garantia LG de 5 anos contra burn-in. L50 (50% brilho) estimado em 100.000 horas.',
    },

    {
        id: 'panel_oled_lg_woled_standard',
        name: 'Painel WOLED Standard (LG Display)',
        category: 'panel',
        subcategory: 'oled',
        manufacturer: 'LG Display',
        technology: 'WOLED',
        description: 'Painel OLED branco padrão, geração anterior ao Evo.',

        reliability: {
            l10LifeHours: 80000,
            weibullBeta: 1.6,
            weibullEtaYears: 10,
            annualFailureRate: 0.025,
        },

        costs: {
            partCostBRL: 3000,
            laborCostBRL: 500,
            repairTimeHours: 4,
        },

        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.4,
        },

        repairability: {
            partsAvailability: 'scarce',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 1,
            hasServiceManual: true,
            disassemblyScore: 3,
        },

        failureModes: ['burn_in', 'brilho_reduzido', 'manchas_permanentes'],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
    },

    // ----------------------------------------
    // MINI-LED PANELS
    // ----------------------------------------
    {
        id: 'panel_miniled_samsung_neo_qled',
        name: 'Painel Mini-LED Samsung Neo QLED',
        category: 'panel',
        subcategory: 'mini_led',
        manufacturer: 'Samsung Display',
        technology: 'Mini-LED com Quantum Dots',
        description: 'Painel LCD com backlight Mini-LED e filtro Quantum Dots. Usado em QN90C, QN85C.',

        reliability: {
            l10LifeHours: 60000,
            weibullBeta: 1.3,
            weibullEtaYears: 15,     // LCD dura muito
            annualFailureRate: 0.015,
        },

        costs: {
            partCostBRL: 2800,
            laborCostBRL: 500,
            repairTimeHours: 4,
        },

        riskFactors: {
            tropicalPenalty: 1.0,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.0,
        },

        repairability: {
            partsAvailability: 'scarce',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 2,
            hasServiceManual: true,
            disassemblyScore: 4,
        },

        failureModes: ['zonas_escuras', 'blooming_excessivo', 'uniformidade_perdida'],
        failureSymptoms: [
            'Áreas do backlight não acendem',
            'Halos brancos ao redor de objetos brilhantes',
        ],
        dataSource: 'manufacturer',
        lastUpdated: '2026-01-12',
        notes: 'Samsung oferece 10 anos de garantia contra burn-in (válido também para Mini-LED).',
    },

    // ----------------------------------------
    // QLED (VA LCD)
    // ----------------------------------------
    {
        id: 'panel_va_qled_standard',
        name: 'Painel VA QLED Standard',
        category: 'panel',
        subcategory: 'qled',
        manufacturer: 'Various',
        technology: 'VA LCD com Quantum Dots',
        description: 'Painel VA LCD com filtro Quantum Dots para cores. Usado em TVs QLED de entrada/média.',

        reliability: {
            l10LifeHours: 80000,
            weibullBeta: 1.1,
            weibullEtaYears: 18,
            annualFailureRate: 0.01,
        },

        costs: {
            partCostBRL: 1500,
            laborCostBRL: 400,
            repairTimeHours: 3,
        },

        riskFactors: {
            tropicalPenalty: 1.0,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.0,
        },

        repairability: {
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 3,
            hasServiceManual: true,
            disassemblyScore: 5,
        },

        failureModes: ['linhas_verticais', 'manchas', 'tcon_failure'],
        dataSource: 'industry_avg',
        lastUpdated: '2026-01-12',
    },
];

// ============================================
// ELETRÔNICA
// ============================================

export const TV_BOARDS: ComponentDefinition[] = [
    // ----------------------------------------
    // T-CON BOARDS
    // ----------------------------------------
    {
        id: 'board_tcon_independent',
        name: 'T-CON Board Independente',
        category: 'board',
        subcategory: 'tcon',
        technology: 'Timing Controller separado',
        description: 'Placa T-CON modular, substituível. Comum em TVs de alta qualidade.',

        reliability: {
            l10LifeHours: 100000,
            weibullBeta: 1.0,        // Falha aleatória
            weibullEtaYears: 15,
            annualFailureRate: 0.03,
        },

        costs: {
            partCostBRL: 350,
            laborCostBRL: 150,
            repairTimeHours: 1.5,
        },

        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.3,     // Corrosão em trilhas
            voltageInstabilityPenalty: 1.2,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 8,
            hasServiceManual: true,
            disassemblyScore: 7,
        },

        failureModes: ['linhas_verticais', 'cores_invertidas', 'tela_branca', 'solarizacao'],
        failureSymptoms: [
            'Linhas verticais coloridas na tela',
            'Imagem solarizada ou negativa',
            'Tela branca com áudio funcionando',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
    },

    {
        id: 'board_tcon_bonded',
        name: 'T-CON Integrada ao Painel (COF)',
        category: 'board',
        subcategory: 'tcon',
        technology: 'Chip-on-Film / Bonded',
        description: 'T-CON soldada diretamente ao painel. Reparo inviável.',

        reliability: {
            l10LifeHours: 100000,
            weibullBeta: 1.0,
            weibullEtaYears: 15,
            annualFailureRate: 0.02,
        },

        costs: {
            partCostBRL: 0,          // Não existe peça separada
            laborCostBRL: 0,
            repairTimeHours: 0,
        },

        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.1,
        },

        repairability: {
            partsAvailability: 'discontinued',
            diyFriendly: false,
            requiresSpecialist: false,
            repairabilityScore: 0,   // Irreparável
            hasServiceManual: false,
            disassemblyScore: 0,
        },

        failureModes: ['linhas_verticais', 'falha_driver'],
        dataSource: 'industry_avg',
        lastUpdated: '2026-01-12',
        notes: 'Quando T-CON bonded falha, o reparo é inviável. Comum em TVs de entrada.',
    },

    // ----------------------------------------
    // MAIN BOARDS
    // ----------------------------------------
    {
        id: 'board_main_smart_tv',
        name: 'Main Board Smart TV',
        category: 'board',
        subcategory: 'main',
        description: 'Placa principal com processador, memória, WiFi, HDMI.',

        reliability: {
            l10LifeHours: 80000,
            weibullBeta: 1.2,
            weibullEtaYears: 12,
            annualFailureRate: 0.04,
        },

        costs: {
            partCostBRL: 600,
            laborCostBRL: 200,
            repairTimeHours: 2,
        },

        riskFactors: {
            tropicalPenalty: 1.3,
            coastalPenalty: 1.5,
            voltageInstabilityPenalty: 1.4,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 7,
            hasServiceManual: true,
            disassemblyScore: 8,
        },

        failureModes: ['nao_liga', 'wifi_falha', 'hdmi_falha', 'audio_falha', 'apps_travando'],
        failureSymptoms: [
            'TV não liga ou fica em standby',
            'WiFi não conecta ou desconecta',
            'Portas HDMI param de funcionar',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
    },

    // ----------------------------------------
    // POWER SUPPLY
    // ----------------------------------------
    {
        id: 'board_psu_integrated',
        name: 'Fonte de Alimentação Integrada',
        category: 'power_supply',
        subcategory: 'psu',
        description: 'Placa de fonte integrada com capacitores eletrolíticos.',

        reliability: {
            l10LifeHours: 50000,
            weibullBeta: 1.5,        // Desgaste de capacitores
            weibullEtaYears: 10,
            annualFailureRate: 0.05,
        },

        costs: {
            partCostBRL: 400,
            laborCostBRL: 150,
            repairTimeHours: 1.5,
        },

        riskFactors: {
            tropicalPenalty: 1.5,    // Calor degrada capacitores
            coastalPenalty: 1.3,
            voltageInstabilityPenalty: 1.6,  // Muito sensível a surtos
            heatPenalty: 2.0,        // Lei de Arrhenius
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 8,
            hasServiceManual: true,
            disassemblyScore: 8,
        },

        failureModes: ['capacitor_estourado', 'nao_liga', 'desliga_sozinha', 'ruido_eletrico'],
        failureSymptoms: [
            'TV não liga (LED standby apagado)',
            'TV desliga sozinha após minutos',
            'Ruído de "click" repetitivo',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
        notes: 'Capacitores seguem Lei de Arrhenius: vida reduz 50% a cada 10°C acima de 85°C.',
    },
];

// ============================================
// BACKLIGHT
// ============================================

export const TV_BACKLIGHT: ComponentDefinition[] = [
    {
        id: 'backlight_miniled_fald',
        name: 'Backlight Mini-LED FALD',
        category: 'backlight',
        subcategory: 'mini_led',
        technology: 'Full Array Local Dimming Mini-LED',
        description: 'Sistema de milhares de zonas de escurecimento local.',

        reliability: {
            l10LifeHours: 60000,
            weibullBeta: 1.4,
            weibullEtaYears: 12,
            annualFailureRate: 0.04,
        },

        costs: {
            partCostBRL: 800,
            laborCostBRL: 300,
            repairTimeHours: 3,
        },

        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.2,
        },

        repairability: {
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 4,
            hasServiceManual: true,
            disassemblyScore: 4,
        },

        failureModes: ['zonas_apagadas', 'zonas_travadas', 'blooming'],
        dataSource: 'manufacturer',
        lastUpdated: '2026-01-12',
    },

    {
        id: 'backlight_edge_led',
        name: 'Backlight Edge LED',
        category: 'backlight',
        subcategory: 'edge_led',
        technology: 'LEDs nas bordas',
        description: 'LEDs posicionados nas bordas com difusor.',

        reliability: {
            l10LifeHours: 80000,
            weibullBeta: 1.2,
            weibullEtaYears: 15,
            annualFailureRate: 0.02,
        },

        costs: {
            partCostBRL: 300,
            laborCostBRL: 200,
            repairTimeHours: 2,
        },

        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.1,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 6,
            hasServiceManual: true,
            disassemblyScore: 5,
        },

        failureModes: ['manchas_escuras', 'borda_apagada', 'led_queimado'],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
    },
];

// ============================================
// EXPORT CONSOLIDADO
// ============================================

export const ALL_TV_COMPONENTS: ComponentDefinition[] = [
    ...TV_PANELS,
    ...TV_BOARDS,
    ...TV_BACKLIGHT,
];

/**
 * Busca componente por ID
 */
export function getTVComponentById(id: string): ComponentDefinition | undefined {
    return ALL_TV_COMPONENTS.find(c => c.id === id);
}

/**
 * Lista componentes por categoria
 */
export function getTVComponentsByCategory(category: string): ComponentDefinition[] {
    return ALL_TV_COMPONENTS.filter(c => c.category === category);
}
