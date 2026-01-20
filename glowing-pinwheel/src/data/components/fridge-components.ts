/**
 * @file fridge-components.ts
 * @description Base de dados de componentes para Geladeiras/Refrigeradores
 * 
 * Componentes mapeados:
 * - Compressores: Inverter, On/Off, Linear
 * - Placas: Inversora, Controle
 * - Outros: Termostato, Ventilador, Gaseificador
 * 
 * @version 1.0.0
 * @see Relatório: "Implementação Sistema Inteligência Componentes" - Seção 4
 */

import type { ComponentDefinition } from './types';

// ============================================
// COMPRESSORES
// ============================================

export const FRIDGE_COMPRESSORS: ComponentDefinition[] = [
    // ----------------------------------------
    // COMPRESSOR INVERTER
    // ----------------------------------------
    {
        id: 'compressor_inverter_embraco_vem',
        name: 'Compressor Inverter Embraco VEM',
        category: 'compressor',
        subcategory: 'inverter',
        manufacturer: 'Embraco (Nidec)',
        technology: 'Rotativo Velocidade Variável',
        description: 'Compressor inverter de alta eficiência com velocidade variável. Usado em geladeiras Samsung, Electrolux premium.',

        reliability: {
            l10LifeHours: 150000,        // Certificado VDE ~21 anos, ajustado para BR
            weibullBeta: 1.3,            // Desgaste gradual
            weibullEtaYears: 15,         // Fator πBR de 0.7x aplicado
            annualFailureRate: 0.03,
        },

        costs: {
            partCostBRL: 800,
            laborCostBRL: 350,
            repairTimeHours: 4,
            partsLeadTimeDays: 7,
        },

        riskFactors: {
            tropicalPenalty: 1.2,        // Calor afeta eficiência
            coastalPenalty: 1.1,         // Componente selado
            voltageInstabilityPenalty: 1.0, // Inverter protege
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 5,
            hasServiceManual: true,
            disassemblyScore: 4,
        },

        failureModes: ['vazamento_gas', 'ruido_excessivo', 'nao_refrigera', 'superaquecimento'],
        failureSymptoms: [
            'Geladeira não gela adequadamente',
            'Ruído anormal do compressor',
            'Compressor liga mas desliga rapidamente',
        ],
        dataSource: 'manufacturer',
        lastUpdated: '2026-01-12',
        notes: 'Certificado VDE para 21 anos. Fator πBR 0.7x aplicado = 15 anos no Brasil.',
    },

    {
        id: 'compressor_inverter_lg',
        name: 'Compressor Inverter LG',
        category: 'compressor',
        subcategory: 'inverter',
        manufacturer: 'LG',
        technology: 'Rotativo Inverter',
        description: 'Compressor inverter LG com garantia de 10 anos.',

        reliability: {
            l10LifeHours: 130000,
            weibullBeta: 1.2,
            weibullEtaYears: 14,
            annualFailureRate: 0.035,
        },

        costs: {
            partCostBRL: 750,
            laborCostBRL: 350,
            repairTimeHours: 4,
        },

        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.0,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 5,
            hasServiceManual: true,
            disassemblyScore: 4,
        },

        failureModes: ['vazamento_gas', 'ruido_excessivo', 'falha_partida'],
        dataSource: 'manufacturer',
        lastUpdated: '2026-01-12',
    },

    // ----------------------------------------
    // COMPRESSOR LINEAR (LG)
    // ----------------------------------------
    {
        id: 'compressor_linear_lg',
        name: 'Compressor Linear LG',
        category: 'compressor',
        subcategory: 'linear',
        manufacturer: 'LG',
        technology: 'Linear Inverter',
        description: 'Tecnologia proprietária LG com pistão linear. Teoricamente mais eficiente, mas com histórico de falhas em lotes anteriores.',

        reliability: {
            l10LifeHours: 100000,        // Conservador devido ao histórico
            weibullBeta: 1.5,            // Maior variabilidade
            weibullEtaYears: 10,         // Penalizado pelo histórico
            annualFailureRate: 0.06,     // Maior taxa devido a class actions
        },

        costs: {
            partCostBRL: 1200,           // Mais caro por ser proprietário
            laborCostBRL: 400,
            repairTimeHours: 5,
            partsLeadTimeDays: 14,       // Mais difícil de encontrar
        },

        riskFactors: {
            tropicalPenalty: 1.3,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.2,
        },

        repairability: {
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 3,
            hasServiceManual: true,
            disassemblyScore: 3,
        },

        failureModes: ['falha_mecanica', 'vazamento_gas', 'ruido_batida', 'falha_partida'],
        failureSymptoms: [
            'Ruído de "batida" rítmica',
            'Geladeira para de gelar subitamente',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
        notes: 'ATENÇÃO: Histórico de class actions em outros mercados por falhas prematuras. Monitorar lotes.',
    },

    // ----------------------------------------
    // COMPRESSOR ON/OFF (CONVENCIONAL)
    // ----------------------------------------
    {
        id: 'compressor_onoff_embraco',
        name: 'Compressor On/Off Embraco',
        category: 'compressor',
        subcategory: 'on_off',
        manufacturer: 'Embraco (Nidec)',
        technology: 'Recíproco Convencional',
        description: 'Compressor tradicional on/off. Robusto, tolerante a variações de tensão, fácil reparo.',

        reliability: {
            l10LifeHours: 180000,
            weibullBeta: 1.1,
            weibullEtaYears: 18,
            annualFailureRate: 0.02,
        },

        costs: {
            partCostBRL: 500,
            laborCostBRL: 300,
            repairTimeHours: 3,
        },

        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.3,  // Sensível a surtos na partida
        },

        repairability: {
            partsAvailability: 'excellent',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 7,
            hasServiceManual: true,
            disassemblyScore: 6,
        },

        failureModes: ['rele_partida', 'protetor_termico', 'vazamento_gas'],
        failureSymptoms: [
            'Compressor tenta partir mas desliga (click)',
            'Compressor superaquece',
        ],
        dataSource: 'industry_avg',
        lastUpdated: '2026-01-12',
        notes: 'Relé de partida e protetor térmico custam < R$50 e são fáceis de trocar.',
    },
];

// ============================================
// PLACAS ELETRÔNICAS
// ============================================

export const FRIDGE_BOARDS: ComponentDefinition[] = [
    {
        id: 'board_inverter_fridge',
        name: 'Placa Inversora de Geladeira',
        category: 'board',
        subcategory: 'inverter',
        description: 'Placa que controla a velocidade do compressor inverter. Ponto crítico de falha.',

        reliability: {
            l10LifeHours: 60000,
            weibullBeta: 1.2,
            weibullEtaYears: 8,
            annualFailureRate: 0.08,      // Alta taxa no Brasil
        },

        costs: {
            partCostBRL: 600,
            laborCostBRL: 200,
            repairTimeHours: 2,
        },

        riskFactors: {
            tropicalPenalty: 1.4,         // Calor degrada capacitores
            coastalPenalty: 1.5,          // Corrosão das trilhas
            voltageInstabilityPenalty: 1.6, // Muito sensível a surtos
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 7,
            hasServiceManual: true,
            disassemblyScore: 8,
        },

        failureModes: ['capacitor_estourado', 'igbt_queimado', 'varistor_aberto', 'trilha_corroida'],
        failureSymptoms: [
            'Geladeira não liga',
            'Compressor não parte',
            'Erro no display (se houver)',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
        notes: '"Paradoxo do Inverter": Economia de energia pode ser anulada por uma falha de placa.',
    },

    {
        id: 'board_control_fridge',
        name: 'Placa de Controle Principal',
        category: 'board',
        subcategory: 'main',
        description: 'Placa principal com interface, sensores e lógica de controle.',

        reliability: {
            l10LifeHours: 80000,
            weibullBeta: 1.0,
            weibullEtaYears: 12,
            annualFailureRate: 0.04,
        },

        costs: {
            partCostBRL: 350,
            laborCostBRL: 150,
            repairTimeHours: 1.5,
        },

        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.3,
            voltageInstabilityPenalty: 1.3,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 8,
            hasServiceManual: true,
            disassemblyScore: 9,
        },

        failureModes: ['display_apagado', 'botoes_nao_respondem', 'sensor_falha'],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
    },
];

// ============================================
// OUTROS COMPONENTES
// ============================================

export const FRIDGE_OTHER: ComponentDefinition[] = [
    {
        id: 'thermostat_mechanical',
        name: 'Termostato Mecânico',
        category: 'sensor',
        subcategory: 'thermostat',
        description: 'Termostato mecânico tradicional para geladeiras simples.',

        reliability: {
            l10LifeHours: 100000,
            weibullBeta: 1.0,
            weibullEtaYears: 15,
            annualFailureRate: 0.02,
        },

        costs: {
            partCostBRL: 80,
            laborCostBRL: 100,
            repairTimeHours: 1,
        },

        riskFactors: {
            tropicalPenalty: 1.0,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.0,
        },

        repairability: {
            partsAvailability: 'excellent',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 9,
            hasServiceManual: true,
            disassemblyScore: 9,
        },

        failureModes: ['nao_desliga', 'nao_liga', 'regulagem_errada'],
        dataSource: 'industry_avg',
        lastUpdated: '2026-01-12',
    },

    {
        id: 'fan_evaporator',
        name: 'Ventilador do Evaporador',
        category: 'cooling',
        subcategory: 'fan',
        description: 'Motor do ventilador que circula ar frio.',

        reliability: {
            l10LifeHours: 60000,
            weibullBeta: 1.3,
            weibullEtaYears: 10,
            annualFailureRate: 0.04,
        },

        costs: {
            partCostBRL: 120,
            laborCostBRL: 100,
            repairTimeHours: 1.5,
        },

        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.1,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 8,
            hasServiceManual: true,
            disassemblyScore: 7,
        },

        failureModes: ['ruido', 'nao_gira', 'gira_lento'],
        failureSymptoms: [
            'Geladeira gela mal mas freezer funciona',
            'Ruído de ventilador travado',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-12',
    },

    {
        id: 'gasket_door',
        name: 'Borracha de Vedação da Porta',
        category: 'mechanical',
        subcategory: 'seal',
        description: 'Gaxeta que veda a porta da geladeira.',

        reliability: {
            l10LifeHours: 50000,
            weibullBeta: 1.5,
            weibullEtaYears: 8,
            annualFailureRate: 0.05,
        },

        costs: {
            partCostBRL: 150,
            laborCostBRL: 80,
            repairTimeHours: 0.5,
        },

        riskFactors: {
            tropicalPenalty: 1.3,         // Calor resseca a borracha
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.0,
        },

        repairability: {
            partsAvailability: 'excellent',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 10,
            hasServiceManual: true,
            disassemblyScore: 10,
        },

        failureModes: ['ressecada', 'rasgada', 'nao_veda'],
        failureSymptoms: [
            'Geladeira sua por fora',
            'Compressor liga frequentemente',
            'Gelo excessivo no freezer',
        ],
        dataSource: 'industry_avg',
        lastUpdated: '2026-01-12',
    },
];

// ============================================
// EXPORT CONSOLIDADO
// ============================================

export const ALL_FRIDGE_COMPONENTS: ComponentDefinition[] = [
    ...FRIDGE_COMPRESSORS,
    ...FRIDGE_BOARDS,
    ...FRIDGE_OTHER,
];

/**
 * Busca componente de geladeira por ID
 */
export function getFridgeComponentById(id: string): ComponentDefinition | undefined {
    return ALL_FRIDGE_COMPONENTS.find(c => c.id === id);
}

/**
 * Lista componentes de geladeira por categoria
 */
export function getFridgeComponentsByCategory(category: string): ComponentDefinition[] {
    return ALL_FRIDGE_COMPONENTS.filter(c => c.category === category);
}
