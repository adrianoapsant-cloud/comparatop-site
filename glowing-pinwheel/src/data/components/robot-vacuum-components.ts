/**
 * @file robot-vacuum-components.ts
 * @description Base de dados de componentes para Robôs Aspiradores
 * 
 * Dados baseados em:
 * - Pesquisa de preços Mercado Livre/Shopee Brasil (Jan 2026)
 * - Resposta 4 do prompt de pesquisa TCO
 * - Análise de taxas de falha por engenharia reversa de dados de mercado
 * 
 * Componentes mapeados:
 * - Bateria Li-ion (componente limitante)
 * - Motor de Sucção (Brushless DC)
 * - Placa Principal (PCB)
 * - Sensores (Cliff, Bump, LiDAR)
 * - Escovas (consumíveis)
 * - Rodas/Rolamentos
 * 
 * @version 1.0.0
 */

import type { ComponentDefinition } from './types';

// ============================================
// BATERIA (Li-ion) - COMPONENTE LIMITANTE
// ============================================

export const ROBOT_VACUUM_BATTERIES: ComponentDefinition[] = [
    {
        id: 'battery_liion_standard',
        name: 'Bateria Li-ion Standard (2600mAh)',
        category: 'battery',
        subcategory: 'li-ion',
        technology: 'Li-ion NMC 18650',
        description: 'Pack de bateria típico 10.8-14.4V com BMS básico. Usado em WAP, Electrolux entrada.',

        reliability: {
            // Ciclos: 300-500 até 80% capacidade
            lifecycles: 400,
            l10LifeHours: undefined,
            weibullBeta: 2.0,        // Desgaste progressivo previsível
            weibullEtaYears: 2.5,    // Vida característica
            annualFailureRate: 0.12, // Ano 2: 6-12% conforme Resposta 4
        },

        costs: {
            // Pesquisa ML Jan 2026: WAP W400 R$200-443
            partCostBRL: 280,        // Média genérica
            laborCostBRL: 100,       // DIY possível, mas assistência cobra
            repairTimeHours: 0.5,
        },

        riskFactors: {
            tropicalPenalty: 1.35,   // Calor 30°C+ reduz 15-35% vida
            coastalPenalty: 1.0,     // Bateria selada
            voltageInstabilityPenalty: 1.1,
            heatPenalty: 1.5,        // Dock em área quente é crítico
        },

        repairability: {
            partsAvailability: 'good',     // Fácil para WAP/Xiaomi
            diyFriendly: true,              // Parafusos + conector
            requiresSpecialist: false,
            repairabilityScore: 8,
            hasServiceManual: false,
            disassemblyScore: 8,
        },

        failureModes: ['capacidade_reduzida', 'nao_carrega', 'desliga_rapido', 'inchaco'],
        failureSymptoms: [
            'Autonomia reduziu muito (robô volta cedo)',
            'Não completa a limpeza',
            'Desliga quando aumenta sucção',
            'Erro de carregamento / fica eternamente no dock',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
        notes: 'Ciclos: 300-500 até 80%. Em calor BR, espere 1.5-2.5 anos. Troca DIY possível na maioria.',
    },
    {
        id: 'battery_liion_premium',
        name: 'Bateria Li-ion Premium (5200mAh)',
        category: 'battery',
        subcategory: 'li-ion',
        technology: 'Li-ion NMC com BMS digital',
        description: 'Pack premium com BMS ativo, comunicação com placa. Usado em iRobot, Dreame, Roborock.',

        reliability: {
            lifecycles: 600,
            weibullBeta: 1.8,
            weibullEtaYears: 3.5,
            annualFailureRate: 0.08,
        },

        costs: {
            // iRobot original: R$989-1145 (loja oficial)
            // Compatível premium: R$400-600
            partCostBRL: 550,
            laborCostBRL: 150,
            repairTimeHours: 1,
        },

        riskFactors: {
            tropicalPenalty: 1.25,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.05,
            heatPenalty: 1.3,
        },

        repairability: {
            partsAvailability: 'limited',  // iRobot caro, Dreame importa
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 6,
            hasServiceManual: true,
            disassemblyScore: 7,
        },

        failureModes: ['capacidade_reduzida', 'erro_bms', 'nao_reconhece'],
        failureSymptoms: [
            'Erro de bateria no app',
            'Bateria compatível não funciona (BMS lock)',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
    },
];

// ============================================
// MOTOR DE SUCÇÃO (Brushless DC)
// ============================================

export const ROBOT_VACUUM_MOTORS: ComponentDefinition[] = [
    {
        id: 'motor_bldc_standard',
        name: 'Motor de Sucção Brushless Standard',
        category: 'motor',
        subcategory: 'bldc',
        technology: 'Brushless DC 500-1500Pa',
        description: 'Motor brushless de entrada. WAP W100/W400, Electrolux ERB10.',

        reliability: {
            // Resposta 4: 500-1000h para robô doméstico
            l10LifeHours: 800,
            weibullBeta: 1.3,
            weibullEtaYears: 4,
            annualFailureRate: 0.04, // 2-6% ano 2-3
        },

        costs: {
            // Pesquisa ML: WAP W400 motor R$73-400
            partCostBRL: 150,
            laborCostBRL: 200,       // Desmontagem completa
            repairTimeHours: 2,
        },

        riskFactors: {
            tropicalPenalty: 1.15,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.1,
            heatPenalty: 1.3,        // Poeira + calor = problema
        },

        repairability: {
            partsAvailability: 'good',     // WAP tem peças
            diyFriendly: false,             // Requer desmontagem + vedação
            requiresSpecialist: true,
            repairabilityScore: 5,
            hasServiceManual: false,
            disassemblyScore: 4,
        },

        failureModes: ['barulho_rolamento', 'perda_succao', 'superaquecimento', 'queimado'],
        failureSymptoms: [
            'Perda de sucção mesmo com filtro limpo',
            'Barulho anormal (chiado, vibração)',
            'Superaquece e desliga',
            'Cheiro de queimado',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
        notes: 'Vida: 1000-2000h. Com pets+carpete sem manutenção: reduz 30-50%.',
    },
    {
        id: 'motor_bldc_premium',
        name: 'Motor de Sucção Brushless Premium (Nidec)',
        category: 'motor',
        subcategory: 'bldc',
        manufacturer: 'Nidec',
        technology: 'Brushless DC 2000-5000Pa',
        description: 'Motor Nidec de alta performance. Xiaomi, Dreame, Roborock.',

        reliability: {
            l10LifeHours: 2000,
            weibullBeta: 1.2,
            weibullEtaYears: 6,
            annualFailureRate: 0.02,
        },

        costs: {
            partCostBRL: 350,
            laborCostBRL: 300,
            repairTimeHours: 3,
        },

        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.15,    // Umidade afeta eletrônica integrada
            voltageInstabilityPenalty: 1.05,
        },

        repairability: {
            partsAvailability: 'limited',  // Importação
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 4,
            hasServiceManual: true,
            disassemblyScore: 3,
        },

        failureModes: ['barulho_rolamento', 'falha_driver', 'nao_gira'],
        dataSource: 'manufacturer',
        lastUpdated: '2026-01-18',
    },
];

// ============================================
// PLACA PRINCIPAL (PCB)
// ============================================

export const ROBOT_VACUUM_BOARDS: ComponentDefinition[] = [
    {
        id: 'board_main_basic',
        name: 'Placa Principal Básica',
        category: 'board',
        subcategory: 'main',
        technology: 'PCB SMD com MCU básico',
        description: 'Placa principal sem Wi-Fi ou com Wi-Fi básico. WAP entrada, Electrolux ERB.',

        reliability: {
            weibullBeta: 1.0,        // Falhas aleatórias
            weibullEtaYears: 7,
            annualFailureRate: 0.015, // 0.5-1.5% ano 1-2
        },

        costs: {
            // Resposta 4: R$250-700 marcas com rede
            partCostBRL: 350,
            laborCostBRL: 200,
            repairTimeHours: 1.5,
        },

        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.4,     // Maresia = oxidação
            voltageInstabilityPenalty: 1.3,
            humidityPenalty: 1.5,    // Mop = risco água
        },

        repairability: {
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 4,
            hasServiceManual: false,
            disassemblyScore: 5,
        },

        failureModes: ['nao_liga', 'wifi_falha', 'trava', 'reinicia'],
        failureSymptoms: [
            'Robô não liga / não dá sinal',
            'Reinicia sozinho / trava',
            'Não conecta Wi-Fi / some do app',
            'Não carrega mesmo com dock OK',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
    },
    {
        id: 'board_main_smart',
        name: 'Placa Principal Smart (com LiDAR)',
        category: 'board',
        subcategory: 'main',
        technology: 'PCB multilayer com SoC + Wi-Fi + drivers',
        description: 'Placa principal avançada. Xiaomi, Dreame, Roborock.',

        reliability: {
            weibullBeta: 1.1,
            weibullEtaYears: 6,
            annualFailureRate: 0.025,
        },

        costs: {
            // Pesquisa: Xiaomi/Roborock R$115-714
            partCostBRL: 450,
            laborCostBRL: 350,
            repairTimeHours: 2,
        },

        riskFactors: {
            tropicalPenalty: 1.3,
            coastalPenalty: 1.5,
            voltageInstabilityPenalty: 1.2,
            humidityPenalty: 1.6,
        },

        repairability: {
            partsAvailability: 'scarce',   // Importação
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 2,
            hasServiceManual: true,
            disassemblyScore: 3,
        },

        failureModes: ['nao_liga', 'wifi_falha', 'mapa_corrompido', 'sensores_loucos'],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
        notes: 'Custo alto frequentemente inviabiliza reparo. Total loss comum.',
    },
];

// ============================================
// SENSORES
// ============================================

export const ROBOT_VACUUM_SENSORS: ComponentDefinition[] = [
    {
        id: 'sensor_cliff_ir',
        name: 'Sensor Anti-Queda (Cliff IR)',
        category: 'sensor',
        subcategory: 'cliff',
        technology: 'Infravermelho',
        description: 'Sensor IR apontado para o chão. 3-6 unidades por robô.',

        reliability: {
            weibullBeta: 0.9,
            weibullEtaYears: 8,
            annualFailureRate: 0.02,
        },

        costs: {
            // Resposta 4: cliff R$40-150
            partCostBRL: 55,
            laborCostBRL: 120,
            repairTimeHours: 1,
        },

        riskFactors: {
            tropicalPenalty: 1.0,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.0,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 7,
            hasServiceManual: false,
            disassemblyScore: 6,
        },

        failureModes: ['sujeira', 'oxidacao', 'cabo_rompido'],
        failureSymptoms: [
            'Cai de escadas',
            'Acha que tem abismo no piso escuro e não passa',
            'Erro de sensor de desnível',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
        notes: 'Limpar regularmente. Maioria das "falhas" é sujeira.',
    },
    {
        id: 'sensor_lidar_lds',
        name: 'Sensor LiDAR (Torre LDS)',
        category: 'sensor',
        subcategory: 'lidar',
        technology: 'Laser Distance Sensor com motor',
        description: 'Torre rotativa com laser para mapeamento. Xiaomi, Dreame, Roborock.',

        reliability: {
            // Resposta 4: LiDAR 2-6% após 2-3 anos (parte móvel)
            l10LifeHours: 3000,
            weibullBeta: 1.5,
            weibullEtaYears: 4,
            annualFailureRate: 0.04,
        },

        costs: {
            // Resposta 4: LiDAR R$350-1200
            partCostBRL: 500,
            laborCostBRL: 250,
            repairTimeHours: 1.5,
        },

        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.05,
        },

        repairability: {
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 4,
            hasServiceManual: true,
            disassemblyScore: 5,
        },

        failureModes: ['motor_travado', 'laser_fraco', 'correia_gasta'],
        failureSymptoms: [
            'Anda em círculos',
            'Mapa não fecha / erro de mapa',
            'Erro LDS / torre não gira',
            'Perde localização constantemente',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
        notes: 'Motor pode ser trocado separado (~R$80). Módulo completo é caro.',
    },
];

// ============================================
// ESCOVAS (CONSUMÍVEIS)
// ============================================

export const ROBOT_VACUUM_BRUSHES: ComponentDefinition[] = [
    {
        id: 'brush_kit_standard',
        name: 'Kit Escovas (Central + Laterais + Filtro)',
        category: 'mechanical',
        subcategory: 'brush',
        technology: 'Cerdas mistas + HEPA',
        description: 'Kit consumíveis padrão. Troca recomendada 3-6 meses.',

        reliability: {
            weibullBeta: 2.5,        // Desgaste óbvio
            weibullEtaYears: 0.5,    // 6 meses
            annualFailureRate: 1.0,  // É consumível, 100% "falha" por ano
        },

        costs: {
            // Resposta 4: R$80-220 kits
            partCostBRL: 90,
            laborCostBRL: 0,         // DIY sempre
            repairTimeHours: 0.1,
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
            repairabilityScore: 10,
            hasServiceManual: false,
            disassemblyScore: 10,
        },

        failureModes: ['desgaste', 'cabelo_enrolado', 'cerdas_tortas'],
        failureSymptoms: [
            'Perda de desempenho em tapete',
            'Motor trabalha mais / ruído',
            'Cabelo enrolado travando escova',
        ],
        dataSource: 'manufacturer',
        lastUpdated: '2026-01-18',
        notes: 'Consumível. Troca lateral 3-6 meses, central 6-12 meses.',
    },
];

// ============================================
// RODAS E ROLAMENTOS
// ============================================

export const ROBOT_VACUUM_WHEELS: ComponentDefinition[] = [
    {
        id: 'wheel_module_standard',
        name: 'Módulo de Roda (Motor + Engrenagem)',
        category: 'mechanical',
        subcategory: 'wheel',
        technology: 'Motor DC + redutor plástico',
        description: 'Módulo de tração completo. Par (esquerda/direita).',

        reliability: {
            weibullBeta: 1.4,
            weibullEtaYears: 5,
            annualFailureRate: 0.03,
        },

        costs: {
            // Pesquisa + Resposta 4: R$120-450
            partCostBRL: 180,
            laborCostBRL: 150,
            repairTimeHours: 1,
        },

        riskFactors: {
            tropicalPenalty: 1.05,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.0,
        },

        repairability: {
            partsAvailability: 'good',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 7,
            hasServiceManual: false,
            disassemblyScore: 6,
        },

        failureModes: ['engrenagem_quebrada', 'motor_queimado', 'borracha_gasta'],
        failureSymptoms: [
            'Anda torto (puxa para um lado)',
            'Patina / não sobe desnível',
            'Erro de roda / clique repetitivo',
            'Fica travado',
        ],
        dataSource: 'field_data',
        lastUpdated: '2026-01-18',
        notes: 'Cabelo no eixo é causa comum. Limpar regularmente.',
    },
];

// ============================================
// EXPORT CONSOLIDADO
// ============================================

export const ALL_ROBOT_VACUUM_COMPONENTS: ComponentDefinition[] = [
    ...ROBOT_VACUUM_BATTERIES,
    ...ROBOT_VACUUM_MOTORS,
    ...ROBOT_VACUUM_BOARDS,
    ...ROBOT_VACUUM_SENSORS,
    ...ROBOT_VACUUM_BRUSHES,
    ...ROBOT_VACUUM_WHEELS,
];

/**
 * Busca componente por ID
 */
export function getRobotVacuumComponentById(id: string): ComponentDefinition | undefined {
    return ALL_ROBOT_VACUUM_COMPONENTS.find(c => c.id === id);
}

/**
 * Lista componentes por categoria
 */
export function getRobotVacuumComponentsByCategory(category: string): ComponentDefinition[] {
    return ALL_ROBOT_VACUUM_COMPONENTS.filter(c => c.category === category);
}

// ============================================
// FATORES DE RISCO BRASIL (para TCO)
// ============================================

/**
 * Penalidades térmicas para bateria Li-ion no Brasil
 * Baseado em: Resposta 4 (Li-ion a 40°C perde ~35%/ano)
 */
export const BRAZIL_THERMAL_PENALTIES = {
    ambient_cool: 1.0,        // AC, ambiente <25°C
    ambient_normal: 1.15,     // 25-30°C
    ambient_hot: 1.35,        // 30-35°C frequente
    ambient_very_hot: 1.50,   // >35°C, dock sol direto
} as const;

/**
 * Penalidades para poeira/pets
 */
export const BRAZIL_DUST_PENALTIES = {
    low_dust: 1.0,            // Casa limpa, sem pets
    normal_dust: 1.1,         // Uso normal
    high_dust: 1.25,          // Pets, carpete, pouco cuidado
    extreme_dust: 1.5,        // Múltiplos pets, tapete, sem manutenção
} as const;
