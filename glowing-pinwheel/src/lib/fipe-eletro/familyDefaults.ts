/**
 * =============================================================================
 * FIPE-Eletro: Configuração de Famílias de Custo
 * =============================================================================
 *
 * Este arquivo contém os defaults por FAMÍLIA (não por categoria individual).
 * Baseado no Relatório Técnico FIPE-Eletro, Seção 5.
 *
 * Cada família tem características de TCO distintas:
 * - Refrigeração: Opex dominante (24/7 ligado)
 * - Lavanderia: Mecânica + Água
 * - Climatização: Instalação + Energia sazonal
 * - Cocção: Gás/Energia + Estética
 * - Portáteis: Baixo valor, alta rotatividade
 */

import type {
    FipeEletroCategory,
    CostFamily,
    QualityScoringProfile,
    FailureProbabilityPoint,
} from '@/types/fipe-eletro';

// =============================================================================
// MAPEAMENTO CATEGORIA → FAMÍLIA
// =============================================================================

/**
 * Mapeia cada uma das 53 categorias para sua família de custo.
 * Usado para inferir defaults quando dados específicos não estão disponíveis.
 */
export const CATEGORY_TO_FAMILY: Record<FipeEletroCategory, CostFamily> = {
    // ─── Tier 1: Alto Volume, Alto Ticket ───────────────────────────────────────
    'tv': 'tech-display',
    'smartphone': 'tech-mobile',
    'geladeira': 'appliance-cooling',
    'notebook': 'tech-display',
    'ar-condicionado': 'appliance-climate',
    'lavadora-roupas': 'appliance-washing',
    'lava-seca': 'appliance-washing',
    'fogao': 'appliance-cooking',
    'cooktop': 'appliance-cooking',
    'micro-ondas': 'appliance-cooking',
    'freezer': 'appliance-cooling',
    'lava-loucas': 'appliance-washing',
    'monitor': 'tech-display',
    'console': 'tech-gaming',
    'robo-aspirador': 'appliance-portable',

    // ─── Tier 2: Alto Impacto, Pareto-Friendly ──────────────────────────────────
    'soundbar': 'tech-audio',
    'fone-tws': 'tech-mobile',
    'headset-gamer': 'tech-audio',
    'caixa-som-bluetooth': 'tech-audio',
    'tablet': 'tech-display',
    'smartwatch': 'tech-mobile',
    'roteador-mesh': 'home-network',
    'impressora': 'home-network',
    'cadeira-gamer': 'tech-gaming',
    'gpu': 'tech-computing',
    'ssd': 'tech-computing',
    'nobreak': 'home-network',
    'projetor': 'tech-display',
    'camera': 'home-security',
    'camera-seguranca': 'home-security',

    // ─── Tier 3: Bons de Venda, Recorrência ─────────────────────────────────────
    'fechadura-digital': 'home-security',
    'streaming-device': 'tech-gaming',
    'frigobar': 'appliance-cooling',
    'adega-climatizada': 'appliance-cooling',
    'purificador-agua': 'appliance-portable',
    'forno-embutir': 'appliance-cooking',
    'coifa-depurador': 'appliance-cooking',
    'aspirador-vertical': 'appliance-portable',
    'air-fryer': 'appliance-portable',
    'cafeteira-espresso': 'appliance-portable',
    'processador-mixer': 'appliance-portable',
    'placa-mae': 'tech-computing',
    'processador-cpu': 'tech-computing',
    'memoria-ram': 'tech-computing',
    'fonte-pc': 'tech-computing',
    'gabinete-pc': 'tech-computing',
    'controle-acessorio-console': 'tech-gaming',
    'estabilizador': 'home-network',

    // ─── Opcionais (eletro/tech alternativo) ────────────────────────────────────
    'ventilador-premium': 'appliance-climate',
    'climatizador': 'appliance-climate',
    'lavadora-pressao': 'appliance-portable',
    'ferramenta-eletrica': 'appliance-portable',

    // ─── Automotivo (opcional) ──────────────────────────────────────────────────
    'pneu': 'automotive',
    'bateria-automotiva': 'automotive',
};

// =============================================================================
// DEFAULTS POR FAMÍLIA
// =============================================================================

/**
 * Configuração padrão por família de custo.
 *
 * Baseado no Relatório Técnico:
 * - δ (Delta): Taxa de depreciação anual
 * - Vida útil: Anos esperados de funcionamento
 * - Pesos de qualidade: Perfil de avaliação para usados
 * - Curva de falha: Probabilidades típicas por idade
 */
export interface FamilyDefaults {
    /** Taxa δ de depreciação anual (ex: 0.12 = 12%) */
    deltaRate: number;

    /** Vida útil média esperada em anos */
    expectedLifespanYears: number;

    /** Pesos de qualidade para avaliação de usados */
    qualityWeights: QualityScoringProfile;

    /** Curva de falha padrão (Curva da Banheira) */
    failureCurve: FailureProbabilityPoint[];

    /** Falhas típicas mais comuns */
    typicalFailures: string[];

    /** Consumíveis típicos */
    commonConsumables: string[];

    /** Foco principal na análise de energia */
    energyFocus: string;

    /** Notas sobre depreciação */
    depreciationNotes: string;

    /** Custo médio de instalação (R$) */
    avgInstallationCost: number;

    /** Fator K_marca médio (1.0 = neutro) */
    avgKBrand: number;

    /** Fator K_tech médio (1.0 = tecnologia atual) */
    avgKTech: number;
}

/**
 * Defaults completos por família de custo.
 * Fonte: Adaptado para 53 categorias Tech + Appliances + Automotive.
 */
export const FAMILY_DEFAULTS: Record<CostFamily, FamilyDefaults> = {
    // ═══════════════════════════════════════════════════════════════════════════
    // TECH-DISPLAY: TVs, Monitores, Notebooks, Tablets, Projetores
    // ═══════════════════════════════════════════════════════════════════════════
    'tech-display': {
        deltaRate: 0.20, // 18-22% ao ano (obsolescência rápida)
        expectedLifespanYears: 6, // 5-8 anos

        qualityWeights: {
            aestheticWeight: 0.20,
            functionalWeight: 0.25,
            technologicalWeight: 0.35, // 4K, OLED, refresh rate
            noiseWeight: 0.05,
            accessoriesWeight: 0.15,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 2, probability: 0.03 },
            { year: 3, probability: 0.05 },
            { year: 5, probability: 0.10 },
            { year: 7, probability: 0.20 },
        ],

        typicalFailures: ['Backlight/LEDs', 'Painel LCD/OLED', 'Placa principal', 'Fonte de alimentação', 'Conectores HDMI'],
        commonConsumables: ['Suporte de parede', 'Cabos HDMI/DisplayPort'],
        energyFocus: 'Consumo em uso ativo. OLED geralmente mais eficiente.',
        depreciationNotes: 'Obsolescência por resolução/tecnologia. 4K domina, 8K ainda nicho.',
        avgInstallationCost: 150,
        avgKBrand: 1.05,
        avgKTech: 0.85,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TECH-MOBILE: Smartphones, Smartwatches, Fones TWS
    // ═══════════════════════════════════════════════════════════════════════════
    'tech-mobile': {
        deltaRate: 0.22, // 20-25% ao ano
        expectedLifespanYears: 4, // 3-5 anos

        qualityWeights: {
            aestheticWeight: 0.25,
            functionalWeight: 0.20,
            technologicalWeight: 0.35,
            noiseWeight: 0.05,
            accessoriesWeight: 0.15,
        },

        failureCurve: [
            { year: 1, probability: 0.03 },
            { year: 2, probability: 0.08 },
            { year: 3, probability: 0.15 },
            { year: 4, probability: 0.25 },
            { year: 5, probability: 0.40 },
        ],

        typicalFailures: ['Bateria degradada', 'Tela danificada', 'Botões/conectores', 'Placa principal', 'Câmera'],
        commonConsumables: ['Película/capinha', 'Carregador', 'Bateria de reposição'],
        energyFocus: 'Ciclos de carga da bateria. Carregamento rápido acelera degradação.',
        depreciationNotes: 'Ciclo de atualização ~2-3 anos. iPhones retêm mais valor.',
        avgInstallationCost: 0,
        avgKBrand: 1.10, // Apple/Samsung premium
        avgKTech: 0.80,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TECH-COMPUTING: GPUs, SSDs, RAM, CPUs, Placas-mãe, Fontes, Gabinetes
    // ═══════════════════════════════════════════════════════════════════════════
    'tech-computing': {
        deltaRate: 0.18, // 15-20% ao ano
        expectedLifespanYears: 5, // 4-7 anos

        qualityWeights: {
            aestheticWeight: 0.10,
            functionalWeight: 0.35,
            technologicalWeight: 0.40,
            noiseWeight: 0.10,
            accessoriesWeight: 0.05,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 2, probability: 0.03 },
            { year: 3, probability: 0.05 },
            { year: 5, probability: 0.10 },
            { year: 7, probability: 0.18 },
        ],

        typicalFailures: ['Ventoinhas', 'VRMs (placa-mãe)', 'Capacitores (fonte)', 'Controladora (SSD)', 'VRAM (GPU)'],
        commonConsumables: ['Pasta térmica', 'Ventoinhas', 'Cabos SATA/PCIe'],
        energyFocus: 'TDP em carga. GPUs podem consumir 200-400W.',
        depreciationNotes: 'Novas gerações a cada 12-18 meses. Mineração destrói GPUs.',
        avgInstallationCost: 0,
        avgKBrand: 1.05,
        avgKTech: 0.85,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TECH-AUDIO: Soundbars, Headsets, Caixas de Som Bluetooth
    // ═══════════════════════════════════════════════════════════════════════════
    'tech-audio': {
        deltaRate: 0.14, // 12-15% ao ano
        expectedLifespanYears: 7, // 5-10 anos

        qualityWeights: {
            aestheticWeight: 0.15,
            functionalWeight: 0.40,
            technologicalWeight: 0.20,
            noiseWeight: 0.05,
            accessoriesWeight: 0.20,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 2, probability: 0.04 },
            { year: 3, probability: 0.06 },
            { year: 5, probability: 0.10 },
            { year: 7, probability: 0.15 },
        ],

        typicalFailures: ['Alto-falantes', 'Bluetooth/conectividade', 'Bateria interna', 'Amplificador', 'Entrada de áudio'],
        commonConsumables: ['Espumas de headset', 'Cabos de áudio'],
        energyFocus: 'Autonomia de bateria. Modos ANC consomem mais.',
        depreciationNotes: 'Durabilidade varia muito. Espumas desgastam rápido.',
        avgInstallationCost: 0,
        avgKBrand: 1.08,
        avgKTech: 0.95,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TECH-GAMING: Consoles, Cadeiras Gamer, Controles, Streaming Devices
    // ═══════════════════════════════════════════════════════════════════════════
    'tech-gaming': {
        deltaRate: 0.16, // 15-18% ao ano
        expectedLifespanYears: 6, // 5-8 anos (ciclo de consoles ~7 anos)

        qualityWeights: {
            aestheticWeight: 0.15,
            functionalWeight: 0.35,
            technologicalWeight: 0.30,
            noiseWeight: 0.10,
            accessoriesWeight: 0.10,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 2, probability: 0.04 },
            { year: 3, probability: 0.06 },
            { year: 5, probability: 0.12 },
            { year: 7, probability: 0.20 },
        ],

        typicalFailures: ['Disco/SSD interno', 'Drive de Blu-ray', 'Ventilador', 'Analógicos (drift)', 'Estofado (cadeiras)'],
        commonConsumables: ['Controles adicionais', 'Headset', 'SSD externo'],
        energyFocus: 'Consumo em jogo vs standby. PS5/Xbox Series ~100-200W.',
        depreciationNotes: 'Ciclo longo de consoles. Cadeiras desgastam estofado.',
        avgInstallationCost: 0,
        avgKBrand: 1.05,
        avgKTech: 0.90,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // APPLIANCE-COOLING: Geladeiras, Freezers, Frigobares, Adegas
    // ═══════════════════════════════════════════════════════════════════════════
    'appliance-cooling': {
        deltaRate: 0.11, // 10-12% ao ano
        expectedLifespanYears: 12, // 10-15 anos

        qualityWeights: {
            aestheticWeight: 0.25,
            functionalWeight: 0.35,
            technologicalWeight: 0.15,
            noiseWeight: 0.15,
            accessoriesWeight: 0.10,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 3, probability: 0.04 },
            { year: 5, probability: 0.06 },
            { year: 7, probability: 0.10 },
            { year: 10, probability: 0.15 },
            { year: 12, probability: 0.22 },
        ],

        typicalFailures: ['Compressor', 'Placa inversora', 'Termostato', 'Vedação (gaxeta)', 'Motor do ventilador'],
        commonConsumables: ['Filtro de água', 'Borracha de vedação', 'Lâmpada LED'],
        energyFocus: 'Consumo 24/7, principal driver de Opex. Inverter economiza 30%.',
        depreciationNotes: 'Depreciação lenta. French Door retém mais valor.',
        avgInstallationCost: 0,
        avgKBrand: 1.0,
        avgKTech: 1.0,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // APPLIANCE-WASHING: Lavadoras, Lava-Secas, Lava-louças
    // ═══════════════════════════════════════════════════════════════════════════
    'appliance-washing': {
        deltaRate: 0.13, // 12-15% ao ano
        expectedLifespanYears: 10, // 8-12 anos

        qualityWeights: {
            aestheticWeight: 0.10,
            functionalWeight: 0.45,
            technologicalWeight: 0.15,
            noiseWeight: 0.20,
            accessoriesWeight: 0.10,
        },

        failureCurve: [
            { year: 1, probability: 0.03 },
            { year: 3, probability: 0.06 },
            { year: 5, probability: 0.10 },
            { year: 7, probability: 0.18 },
            { year: 10, probability: 0.28 },
        ],

        typicalFailures: ['Rolamento do tambor', 'Bomba de drenagem', 'Placa eletrônica', 'Correia', 'Amortecedores'],
        commonConsumables: ['Filtro de fiapos', 'Mangueira', 'Limpador de tambor'],
        energyFocus: 'Consumo por ciclo. Incluir custo de água (R$/m³).',
        depreciationNotes: 'Alta depreciação inicial. Ruído indica desgaste.',
        avgInstallationCost: 100,
        avgKBrand: 1.0,
        avgKTech: 1.0,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // APPLIANCE-CLIMATE: Ar-condicionado, Ventiladores, Climatizadores
    // ═══════════════════════════════════════════════════════════════════════════
    'appliance-climate': {
        deltaRate: 0.12, // 10-15% ao ano
        expectedLifespanYears: 12, // 10-15 anos

        qualityWeights: {
            aestheticWeight: 0.10,
            functionalWeight: 0.30,
            technologicalWeight: 0.25,
            noiseWeight: 0.30,
            accessoriesWeight: 0.05,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 3, probability: 0.04 },
            { year: 5, probability: 0.08 },
            { year: 7, probability: 0.12 },
            { year: 10, probability: 0.18 },
            { year: 12, probability: 0.25 },
        ],

        typicalFailures: ['Compressor', 'Placa condensadora', 'Sensor de temp.', 'Motor do ventilador', 'Vazamento de gás'],
        commonConsumables: ['Filtro de ar', 'Gás refrigerante'],
        energyFocus: 'SEER/SCOP. Consumo sazonal intenso. Inverter economiza 40%.',
        depreciationNotes: 'Custo de instalação (R$300-600) afeta liquidez.',
        avgInstallationCost: 450,
        avgKBrand: 1.0,
        avgKTech: 0.95,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // APPLIANCE-COOKING: Fogões, Cooktops, Micro-ondas, Fornos, Coifas
    // ═══════════════════════════════════════════════════════════════════════════
    'appliance-cooking': {
        deltaRate: 0.10, // 8-12% ao ano
        expectedLifespanYears: 15, // 12-20 anos

        qualityWeights: {
            aestheticWeight: 0.35,
            functionalWeight: 0.30,
            technologicalWeight: 0.10,
            noiseWeight: 0.05,
            accessoriesWeight: 0.20,
        },

        failureCurve: [
            { year: 1, probability: 0.01 },
            { year: 3, probability: 0.03 },
            { year: 5, probability: 0.05 },
            { year: 10, probability: 0.10 },
            { year: 15, probability: 0.18 },
        ],

        typicalFailures: ['Válvula de gás', 'Acendedor piezo', 'Resistência', 'Termostato', 'Vidro trincado'],
        commonConsumables: ['Grelhas', 'Vedação da porta', 'Lâmpada do forno'],
        energyFocus: 'Gás (GLP/GN) ou eletricidade. Indução mais eficiente.',
        depreciationNotes: 'Estética dominante. Gordura acumulada destrói valor.',
        avgInstallationCost: 150,
        avgKBrand: 1.0,
        avgKTech: 1.0,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // APPLIANCE-PORTABLE: Robôs aspiradores, Air fryers, Cafeteiras, Aspiradores
    // ═══════════════════════════════════════════════════════════════════════════
    'appliance-portable': {
        deltaRate: 0.17, // 15-20% ao ano
        expectedLifespanYears: 5, // 3-7 anos

        qualityWeights: {
            aestheticWeight: 0.15,
            functionalWeight: 0.30,
            technologicalWeight: 0.30,
            noiseWeight: 0.10,
            accessoriesWeight: 0.15,
        },

        failureCurve: [
            { year: 1, probability: 0.05 },
            { year: 2, probability: 0.10 },
            { year: 3, probability: 0.15 },
            { year: 5, probability: 0.25 },
            { year: 7, probability: 0.40 },
        ],

        typicalFailures: ['Bateria', 'Motor principal', 'Placa de controle', 'Resistência', 'Sensores'],
        commonConsumables: ['Filtro HEPA', 'Escovas', 'Bateria de reposição', 'Cápsulas/refis'],
        energyFocus: 'Autonomia de bateria. Consumo por ciclo.',
        depreciationNotes: 'Obsolescência rápida. Mercado vibrante com novidades.',
        avgInstallationCost: 0,
        avgKBrand: 1.05,
        avgKTech: 0.90,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HOME-SECURITY: Câmeras, Fechaduras Digitais
    // ═══════════════════════════════════════════════════════════════════════════
    'home-security': {
        deltaRate: 0.16, // 15-18% ao ano
        expectedLifespanYears: 6, // 5-8 anos

        qualityWeights: {
            aestheticWeight: 0.10,
            functionalWeight: 0.40,
            technologicalWeight: 0.35,
            noiseWeight: 0.05,
            accessoriesWeight: 0.10,
        },

        failureCurve: [
            { year: 1, probability: 0.03 },
            { year: 2, probability: 0.05 },
            { year: 3, probability: 0.08 },
            { year: 5, probability: 0.15 },
            { year: 7, probability: 0.25 },
        ],

        typicalFailures: ['Motor (fechaduras)', 'Sensor de movimento', 'Conectividade WiFi', 'Bateria/pilhas', 'Impermeabilização'],
        commonConsumables: ['Pilhas/baterias', 'Cartão SD', 'Biometria recadastro'],
        energyFocus: 'Consumo standby. Gravação contínua aumenta uso.',
        depreciationNotes: 'Segurança valorizada. Tecnologia evolui rápido (IA, 4K).',
        avgInstallationCost: 200,
        avgKBrand: 1.05,
        avgKTech: 0.85,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HOME-NETWORK: Roteadores, Nobreaks, Impressoras, Estabilizadores
    // ═══════════════════════════════════════════════════════════════════════════
    'home-network': {
        deltaRate: 0.14, // 12-15% ao ano
        expectedLifespanYears: 7, // 5-10 anos

        qualityWeights: {
            aestheticWeight: 0.05,
            functionalWeight: 0.45,
            technologicalWeight: 0.30,
            noiseWeight: 0.10,
            accessoriesWeight: 0.10,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 2, probability: 0.04 },
            { year: 3, probability: 0.06 },
            { year: 5, probability: 0.12 },
            { year: 7, probability: 0.20 },
        ],

        typicalFailures: ['Bateria (nobreak)', 'WiFi/antenas', 'Cabeça de impressão', 'Capacitores', 'Fonte interna'],
        commonConsumables: ['Bateria de nobreak', 'Cartuchos/toners', 'Papel'],
        energyFocus: 'Standby 24/7 (roteadores). Nobreaks consomem 3-5%.',
        depreciationNotes: 'WiFi 6/6E substitui gerações anteriores rapidamente.',
        avgInstallationCost: 0,
        avgKBrand: 1.0,
        avgKTech: 0.90,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // AUTOMOTIVE: Pneus, Baterias Automotivas
    // ═══════════════════════════════════════════════════════════════════════════
    'automotive': {
        deltaRate: 0.20, // Varia muito (uso/clima)
        expectedLifespanYears: 4, // 3-5 anos (pneus: km; baterias: anos)

        qualityWeights: {
            aestheticWeight: 0.05,
            functionalWeight: 0.60,
            technologicalWeight: 0.10,
            noiseWeight: 0.15,
            accessoriesWeight: 0.10,
        },

        failureCurve: [
            { year: 1, probability: 0.02 },
            { year: 2, probability: 0.05 },
            { year: 3, probability: 0.12 },
            { year: 4, probability: 0.20 },
            { year: 5, probability: 0.35 },
        ],

        typicalFailures: ['Desgaste de banda', 'Sulfatação (bateria)', 'Danos estruturais', 'Perda de carga', 'Válvula de pressão'],
        commonConsumables: ['Água destilada (bateria)', 'Nitrogênio (pneus)'],
        energyFocus: 'N/A - produtos mecânicos/químicos.',
        depreciationNotes: 'Pneus: depende de km. Baterias: clima quente acelera desgaste.',
        avgInstallationCost: 50,
        avgKBrand: 1.10, // Moura/Michelin premium
        avgKTech: 1.0,
    },
};

// =============================================================================
// FUNÇÕES HELPER
// =============================================================================

/**
 * Retorna a família de custo para uma categoria.
 */
export function getFamilyForCategory(category: FipeEletroCategory): CostFamily {
    return CATEGORY_TO_FAMILY[category] ?? 'portateis';
}

/**
 * Retorna os defaults para uma categoria (via sua família).
 */
export function getDefaultsForCategory(category: FipeEletroCategory): FamilyDefaults {
    const family = getFamilyForCategory(category);
    return FAMILY_DEFAULTS[family];
}

/**
 * Retorna a taxa δ (delta) de depreciação para uma categoria.
 */
export function getDeltaRateForCategory(category: FipeEletroCategory): number {
    return getDefaultsForCategory(category).deltaRate;
}

/**
 * Retorna a vida útil esperada para uma categoria.
 */
export function getExpectedLifespanForCategory(category: FipeEletroCategory): number {
    return getDefaultsForCategory(category).expectedLifespanYears;
}

/**
 * Retorna os pesos de qualidade para uma categoria.
 */
export function getQualityWeightsForCategory(category: FipeEletroCategory): QualityScoringProfile {
    return getDefaultsForCategory(category).qualityWeights;
}

/**
 * Retorna a curva de falha padrão para uma categoria.
 */
export function getFailureCurveForCategory(category: FipeEletroCategory): FailureProbabilityPoint[] {
    return getDefaultsForCategory(category).failureCurve;
}

/**
 * Gera contexto de prompt para uma categoria.
 * Usado pelo generateDeepResearchPrompt quando não há contexto específico.
 */
export function getPromptContextForCategory(category: FipeEletroCategory): {
    typicalFailures: string[];
    commonConsumables: string[];
    energyTestFocus: string;
    depreciationNotes: string;
} {
    const defaults = getDefaultsForCategory(category);
    return {
        typicalFailures: defaults.typicalFailures,
        commonConsumables: defaults.commonConsumables,
        energyTestFocus: defaults.energyFocus,
        depreciationNotes: defaults.depreciationNotes,
    };
}

// =============================================================================
// CONSTANTES MACROECONÔMICAS PADRÃO (Brasil 2026)
// =============================================================================

/**
 * Valores macroeconômicos de referência.
 * Devem ser atualizados periodicamente ou obtidos de API.
 */
export const DEFAULT_MACRO_CONSTANTS = {
    /** Taxa Selic atual (% a.a.) */
    selicRate: 0.1175,

    /** IPCA 12 meses (% a.a.) */
    ipcaRate: 0.045,

    /** Taxa de desconto real = (1 + Selic) / (1 + IPCA) - 1 */
    discountRate: 0.07, // ~7% real

    /** Inflação energética projetada (% a.a.) */
    energyInflationRate: 0.06,

    /** Inflação de consumíveis (geralmente > IPCA) */
    consumablesInflationRate: 0.05, // IPCA × 1.1 aprox.

    /** Tarifa média de energia (R$/kWh) com impostos */
    avgEnergyTariff: 0.85,

    /** Câmbio USD/BRL */
    exchangeRateUsdBrl: 5.85,

    /** Custo do botijão de gás GLP 13kg (R$) */
    glpPrice: 110,

    /** Tarifa média de água + esgoto (R$/m³) */
    avgWaterTariff: 12.50,
};

// =============================================================================
// ITEM 3: MULTIPLICADORES REGIONAIS DE MÃO DE OBRA
// =============================================================================

/**
 * Multiplicadores regionais de custo de mão de obra técnica.
 * Baseado no custo de vida e disponibilidade de técnicos por região.
 *
 * Fonte: Relatório Técnico FIPE-Eletro, Seção 6.1
 */
export const REGIONAL_LABOR_MULTIPLIERS: Record<string, number> = {
    // ─── Capitais com alto custo ──────────────────────────────────────────────
    'SP': 1.30,        // São Paulo capital
    'RJ': 1.25,        // Rio de Janeiro
    'DF': 1.20,        // Brasília
    'RS': 1.15,        // Porto Alegre

    // ─── Capitais com custo médio-alto ────────────────────────────────────────
    'PR': 1.10,        // Curitiba
    'SC': 1.10,        // Florianópolis
    'MG': 1.05,        // Belo Horizonte
    'ES': 1.05,        // Vitória

    // ─── Capitais com custo médio ─────────────────────────────────────────────
    'BA': 1.00,        // Salvador
    'PE': 1.00,        // Recife
    'CE': 0.95,        // Fortaleza
    'GO': 1.00,        // Goiânia

    // ─── Capitais com custo menor ─────────────────────────────────────────────
    'PA': 0.90,        // Belém
    'AM': 0.95,        // Manaus (logística encarece peças)
    'MA': 0.85,        // São Luís
    'PI': 0.85,        // Teresina
    'RN': 0.90,        // Natal
    'PB': 0.85,        // João Pessoa
    'AL': 0.85,        // Maceió
    'SE': 0.85,        // Aracaju

    // ─── Região Norte ─────────────────────────────────────────────────────────
    'AC': 0.90,
    'AP': 0.90,
    'RO': 0.90,
    'RR': 0.90,
    'TO': 0.90,

    // ─── Centro-Oeste ─────────────────────────────────────────────────────────
    'MT': 0.95,
    'MS': 0.95,

    // ─── Interior (default para cidades não-capitais) ─────────────────────────
    'INTERIOR_SUL': 0.95,
    'INTERIOR_SUDESTE': 0.90,
    'INTERIOR_NORDESTE': 0.80,
    'INTERIOR_NORTE': 0.85,
    'INTERIOR_CENTRO_OESTE': 0.90,

    // ─── Default nacional ─────────────────────────────────────────────────────
    'DEFAULT': 1.00,
};

/**
 * Retorna o multiplicador regional de mão de obra.
 * @param region - Sigla do estado (UF) ou região
 */
export function getRegionalLaborMultiplier(region: string): number {
    const normalized = region.toUpperCase().trim();
    return REGIONAL_LABOR_MULTIPLIERS[normalized] ?? REGIONAL_LABOR_MULTIPLIERS['DEFAULT'];
}

// =============================================================================
// ITEM 2: K_TECH AUTOMÁTICO POR TECNOLOGIA
// =============================================================================

/**
 * Tecnologias e seus fatores K_tech.
 * Tecnologias obsoletas perdem valor no mercado de usados.
 */
export type TechnologyType =
    | 'inverter'           // AC, geladeiras - atual
    | 'on-off'             // AC - obsoleto
    | 'frost-free'         // Geladeiras - atual
    | 'cycle-defrost'      // Geladeiras - obsoleto
    | 'degelo-manual'      // Geladeiras - muito obsoleto
    | 'front-load'         // Lavadoras - premium
    | 'top-load'           // Lavadoras - padrão
    | 'inducao'            // Cooktops - premium
    | 'gas'                // Cooktops/Fogões - padrão
    | 'lidar'              // Robôs - premium
    | 'gyroscope'          // Robôs - básico
    | 'camera'             // Robôs - intermediário
    | 'manual'             // Aspiradores - básico
    | 'smart-wifi'         // Conectividade - premium
    | 'sem-wifi'           // Sem conectividade - padrão
    | 'padrao';            // Tecnologia padrão

/**
 * Fatores K_tech por tipo de tecnologia.
 * 1.0 = tecnologia atual/padrão
 * < 1.0 = tecnologia obsoleta
 * > 1.0 = tecnologia premium
 */
export const TECHNOLOGY_K_FACTORS: Record<TechnologyType, number> = {
    // Climatização
    'inverter': 1.00,
    'on-off': 0.80,

    // Refrigeração
    'frost-free': 1.00,
    'cycle-defrost': 0.85,
    'degelo-manual': 0.70,

    // Lavanderia
    'front-load': 1.05,
    'top-load': 1.00,

    // Cocção
    'inducao': 1.05,
    'gas': 1.00,

    // Robôs Aspiradores
    'lidar': 1.05,
    'camera': 0.95,
    'gyroscope': 0.85,

    // Geral
    'manual': 0.90,
    'smart-wifi': 1.05,
    'sem-wifi': 0.95,
    'padrao': 1.00,
};

/**
 * Calcula o fator K_tech baseado na tecnologia do produto.
 * @param technology - Tipo de tecnologia do produto
 */
export function calculateKTechnology(technology: TechnologyType): number {
    return TECHNOLOGY_K_FACTORS[technology] ?? 1.0;
}

/**
 * Infere K_tech a partir da categoria (quando tecnologia não especificada).
 * Para as novas 53 categorias, a maioria assume tecnologia atual (1.0).
 * Exceções são tratadas individualmente durante a pesquisa.
 */
export function inferKTechFromCategory(category: FipeEletroCategory): number {
    // Categorias com tecnologia tipicamente mais antiga (fallback)
    const olderTechCategories: Partial<Record<FipeEletroCategory, number>> = {
        'estabilizador': 0.95,       // Tecnologia madura, sem grandes inovações
        'climatizador': 0.90,        // Menos eficiente que ar-condicionado
        'ferramenta-eletrica': 0.95, // Tecnologia consolidada
    };

    return olderTechCategories[category] ?? 1.0;
}

// =============================================================================
// ITEM 1: CÁLCULO DE K_CONDITION A PARTIR DE SCORES
// =============================================================================

/**
 * Scores individuais de qualidade para avaliação de usados.
 * Cada campo vai de 0 a 100.
 */
export interface QualityScores {
    /** Estado estético: riscos, amassados, manchas, descoloração */
    aestheticScore: number;
    /** Estado funcional: operação correta, potência, eficiência */
    functionalScore: number;
    /** Atualização tecnológica: conectividade, recursos modernos */
    technologicalScore: number;
    /** Nível de ruído: dentro do esperado para a categoria */
    noiseScore: number;
    /** Acessórios: completude, estado dos itens inclusos */
    accessoriesScore: number;
}

/**
 * Calcula K_condition (fator de estado) a partir dos scores de qualidade.
 * Usa os pesos específicos da família para ponderação.
 *
 * @param scores - Scores individuais (0-100)
 * @param category - Categoria do produto (para obter pesos)
 * @returns K_condition entre 0.5 e 1.0
 */
export function calculateKConditionFromScores(
    scores: QualityScores,
    category: FipeEletroCategory
): number {
    const weights = getQualityWeightsForCategory(category);

    // Média ponderada dos scores
    const weightedScore =
        scores.aestheticScore * weights.aestheticWeight +
        scores.functionalScore * weights.functionalWeight +
        scores.technologicalScore * weights.technologicalWeight +
        scores.noiseScore * weights.noiseWeight +
        scores.accessoriesScore * weights.accessoriesWeight;

    // Converter score (0-100) para K_condition (0.5-1.0)
    // Score 0 → K = 0.5 (ruim)
    // Score 100 → K = 1.0 (excelente)
    const kCondition = 0.5 + (weightedScore / 100) * 0.5;

    return Math.max(0.5, Math.min(1.0, kCondition));
}

/**
 * Converte um ConditionGrade textual para scores aproximados.
 */
export function conditionGradeToScores(
    grade: 'excelente' | 'bom' | 'regular' | 'ruim'
): QualityScores {
    const gradeToScore: Record<string, number> = {
        excelente: 95,
        bom: 75,
        regular: 50,
        ruim: 25,
    };

    const score = gradeToScore[grade] ?? 50;

    return {
        aestheticScore: score,
        functionalScore: score,
        technologicalScore: score,
        noiseScore: score,
        accessoriesScore: score,
    };
}

// =============================================================================
// ITEM 5: TARIFAS DE ÁGUA PROGRESSIVAS
// =============================================================================

/**
 * Faixa de tarifa de água progressiva.
 */
export interface WaterTariffBracket {
    /** Limite superior em m³/mês (null = ilimitado) */
    upToM3: number | null;
    /** Tarifa por m³ nesta faixa (R$) */
    tariffPerM3: number;
}

/**
 * Tarifas de água + esgoto por região (exemplos).
 * Na prática, cada concessionária tem sua tabela.
 */
export const WATER_TARIFF_BRACKETS: Record<string, WaterTariffBracket[]> = {
    'SP': [
        { upToM3: 10, tariffPerM3: 8.50 },
        { upToM3: 20, tariffPerM3: 12.80 },
        { upToM3: 50, tariffPerM3: 18.50 },
        { upToM3: null, tariffPerM3: 25.00 },
    ],
    'RJ': [
        { upToM3: 15, tariffPerM3: 7.80 },
        { upToM3: 30, tariffPerM3: 14.50 },
        { upToM3: null, tariffPerM3: 22.00 },
    ],
    'DEFAULT': [
        { upToM3: 10, tariffPerM3: 8.00 },
        { upToM3: 20, tariffPerM3: 12.00 },
        { upToM3: null, tariffPerM3: 18.00 },
    ],
};

/**
 * Calcula o custo de água com tarifas progressivas.
 *
 * @param consumptionM3 - Consumo mensal em m³
 * @param region - Região para tabela de tarifas
 * @returns Custo mensal em R$
 */
export function calculateWaterCostProgressive(
    consumptionM3: number,
    region: string = 'DEFAULT'
): number {
    const brackets = WATER_TARIFF_BRACKETS[region.toUpperCase()] ?? WATER_TARIFF_BRACKETS['DEFAULT'];
    let totalCost = 0;
    let remainingConsumption = consumptionM3;
    let previousLimit = 0;

    for (const bracket of brackets) {
        const bracketLimit = bracket.upToM3 ?? Infinity;
        const bracketSize = bracketLimit - previousLimit;
        const consumedInBracket = Math.min(remainingConsumption, bracketSize);

        if (consumedInBracket <= 0) break;

        totalCost += consumedInBracket * bracket.tariffPerM3;
        remainingConsumption -= consumedInBracket;
        previousLimit = bracketLimit;
    }

    return totalCost;
}

// =============================================================================
// ITEM 4: CONVERSÃO CICLOS → MESES
// =============================================================================

/**
 * Perfis de uso para conversão de ciclos em meses.
 */
export interface UsageProfile {
    /** Nome do perfil */
    name: string;
    /** Ciclos de lavadora por mês */
    washerCyclesPerMonth: number;
    /** Litros de água filtrada por mês */
    filteredWaterLitersPerMonth: number;
    /** Ciclos de robô aspirador por mês (limpezas completas) */
    robotCyclesPerMonth: number;
    /** Cafés por mês (cápsulas/doses) */
    coffeeDosesPerMonth: number;
}

/**
 * Perfis de uso predefinidos.
 */
export const USAGE_PROFILES: Record<'solteiro' | 'casal' | 'familia-pequena' | 'familia-grande', UsageProfile> = {
    solteiro: {
        name: 'Solteiro',
        washerCyclesPerMonth: 8,
        filteredWaterLitersPerMonth: 60,       // 2L/dia
        robotCyclesPerMonth: 12,               // 3x/semana
        coffeeDosesPerMonth: 30,               // 1/dia
    },
    casal: {
        name: 'Casal',
        washerCyclesPerMonth: 12,
        filteredWaterLitersPerMonth: 120,      // 4L/dia
        robotCyclesPerMonth: 16,               // 4x/semana
        coffeeDosesPerMonth: 60,               // 2/dia
    },
    'familia-pequena': {
        name: 'Família Pequena (3-4 pessoas)',
        washerCyclesPerMonth: 20,
        filteredWaterLitersPerMonth: 240,      // 8L/dia
        robotCyclesPerMonth: 20,               // 5x/semana
        coffeeDosesPerMonth: 90,               // 3/dia
    },
    'familia-grande': {
        name: 'Família Grande (5+ pessoas)',
        washerCyclesPerMonth: 30,
        filteredWaterLitersPerMonth: 450,      // 15L/dia
        robotCyclesPerMonth: 30,               // diário
        coffeeDosesPerMonth: 150,              // 5/dia
    },
};

/**
 * Converte frequência em ciclos para frequência em meses.
 *
 * @param cyclesPerReplacement - Quantos ciclos até troca do consumível
 * @param cyclesPerMonthForProfile - Ciclos por mês no perfil de uso
 * @returns Frequência de troca em meses
 */
export function convertCyclesToMonths(
    cyclesPerReplacement: number,
    cyclesPerMonthForProfile: number
): number {
    if (cyclesPerMonthForProfile <= 0) return 12; // Fallback: 1 ano
    return cyclesPerReplacement / cyclesPerMonthForProfile;
}

/**
 * Calcula frequência de troca de filtro de água em meses.
 *
 * @param litersCapacity - Capacidade do filtro em litros
 * @param profileKey - Chave do perfil de uso
 */
export function calculateWaterFilterReplacementMonths(
    litersCapacity: number,
    profileKey: keyof typeof USAGE_PROFILES = 'familia-pequena'
): number {
    const profile = USAGE_PROFILES[profileKey];
    return litersCapacity / profile.filteredWaterLitersPerMonth;
}

