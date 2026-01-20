/**
 * @file types.ts
 * @description Sistema de Inteligência de Componentes (SIC) - Type Definitions
 * 
 * Este módulo define os tipos para o sistema de análise de vida útil
 * baseado em componentes reais dos produtos.
 * 
 * @version 1.0.0
 * @see Relatório: "Implementação Sistema Inteligência Componentes"
 */

// ============================================
// ENUMS E TIPOS BASE
// ============================================

/**
 * Categoria do componente (subsistema do produto)
 */
export type ComponentCategory =
    | 'panel'           // Painéis de display (OLED, LCD, etc)
    | 'backlight'       // Sistemas de retroiluminação
    | 'board'           // Placas de circuito (T-CON, Main, Inverter)
    | 'power_supply'    // Fontes de alimentação
    | 'compressor'      // Compressores (geladeira, AC)
    | 'motor'           // Motores (lavadora, ventilador)
    | 'coil'            // Serpentinas e trocadores de calor
    | 'sensor'          // Sensores (temperatura, rotação, etc)
    | 'battery'         // Baterias (notebooks, smartphones)
    | 'storage'         // Armazenamento (SSD, HDD)
    | 'mechanical'      // Componentes mecânicos (dobradiças, rolamentos)
    | 'cooling'         // Sistema de refrigeração (heat pipes, fans)
    | 'other';          // Outros componentes

/**
 * Nível de criticidade do componente para o funcionamento do produto
 */
export type ComponentCriticality =
    | 'fatal'     // Falha torna o produto irreparável/inviável
    | 'high'      // Falha compromete função principal
    | 'medium'    // Falha compromete funções secundárias
    | 'low';      // Falha causa inconveniência menor

/**
 * Disponibilidade de peças no mercado brasileiro
 */
export type PartsAvailability =
    | 'excellent'     // Disponível em várias fontes, preço competitivo
    | 'good'          // Disponível, pode exigir busca
    | 'limited'       // Difícil encontrar, poucas fontes
    | 'scarce'        // Muito raro, importação necessária
    | 'discontinued'; // Fora de linha, sem reposição

/**
 * Fonte dos dados de confiabilidade
 */
export type DataSource =
    | 'manufacturer'    // Especificação do fabricante
    | 'lab_test'        // Teste de laboratório independente
    | 'field_data'      // Dados de campo (reclame aqui, fóruns)
    | 'industry_avg'    // Média da indústria
    | 'estimated';      // Estimativa baseada em componentes similares

// ============================================
// MÉTRICAS DE CONFIABILIDADE
// ============================================

/**
 * Parâmetros de confiabilidade do componente
 */
export interface ComponentReliability {
    /** L10 Life: Horas até 10% de falhas na população */
    l10LifeHours?: number;

    /** MTBF: Mean Time Between Failures em horas */
    mtbfHours?: number;

    /** Parâmetro β (beta) de Weibull - forma da curva de falha
     * β < 1: Falhas infantis (mortalidade infantil)
     * β ≈ 1: Falhas aleatórias (vida útil)
     * β > 1: Falhas por desgaste (envelhecimento)
     */
    weibullBeta: number;

    /** Parâmetro η (eta) de Weibull - vida característica em anos
     * Tempo até 63.2% da população falhar
     */
    weibullEtaYears: number;

    /** Taxa de falha anual (0.0 a 1.0) */
    annualFailureRate: number;

    /** Ciclos de vida (para baterias, SSDs) */
    lifecycles?: number;

    /** TBW para SSDs (Terabytes Written) */
    tbw?: number;
}

/**
 * Custos de reparo no Brasil
 */
export interface ComponentCosts {
    /** Custo médio da peça (R$) */
    partCostBRL: number;

    /** Custo médio de mão de obra (R$) */
    laborCostBRL: number;

    /** Custo total de reparo estimado (R$) */
    get totalRepairCostBRL(): number;

    /** Tempo estimado de reparo (horas) */
    repairTimeHours: number;

    /** Lead time para obter a peça (dias) */
    partsLeadTimeDays?: number;
}

/**
 * Fatores de risco ambientais (Brasil)
 */
export interface RiskFactors {
    /** Penalidade para ambiente tropical (1.0 = sem penalidade, 4.0 = 400% mais falhas) */
    tropicalPenalty: number;

    /** Penalidade para região litorânea/maresia (1.0 a 2.0) */
    coastalPenalty: number;

    /** Penalidade para instabilidade de tensão (1.0 a 1.5) */
    voltageInstabilityPenalty: number;

    /** Penalidade para calor excessivo (1.0 a 2.0) */
    heatPenalty?: number;

    /** Penalidade para alta umidade (1.0 a 1.5) */
    humidityPenalty?: number;
}

/**
 * Indicadores de reparabilidade (SIC-RI)
 */
export interface ComponentRepairability {
    /** Disponibilidade de peças no mercado */
    partsAvailability: PartsAvailability;

    /** Se pode ser reparado por técnico não especializado */
    diyFriendly: boolean;

    /** Se requer técnico especializado/autorizada */
    requiresSpecialist: boolean;

    /** Score de reparabilidade (0-10, inspirado no índice francês) */
    repairabilityScore: number;

    /** Documentação técnica disponível */
    hasServiceManual: boolean;

    /** Facilidade de desmontagem (0-10) */
    disassemblyScore?: number;
}

// ============================================
// DEFINIÇÃO DE COMPONENTE
// ============================================

/**
 * Definição completa de um componente
 */
export interface ComponentDefinition {
    /** ID único do componente (ex: "panel_oled_lg_evo") */
    id: string;

    /** Nome amigável (ex: "Painel OLED LG Evo") */
    name: string;

    /** Categoria do componente */
    category: ComponentCategory;

    /** Subcategoria específica (ex: "mini_led", "inverter") */
    subcategory?: string;

    /** Fabricante do componente (ex: "LG Display", "Embraco") */
    manufacturer?: string;

    /** Tecnologia específica (ex: "WOLED", "Direct Drive") */
    technology?: string;

    /** Descrição do componente */
    description?: string;

    // ========================================
    // MÉTRICAS DE CONFIABILIDADE
    // ========================================

    /** Dados de confiabilidade */
    reliability: ComponentReliability;

    // ========================================
    // CUSTOS
    // ========================================

    /** Custos de reparo */
    costs: {
        partCostBRL: number;
        laborCostBRL: number;
        repairTimeHours: number;
        partsLeadTimeDays?: number;
    };

    // ========================================
    // FATORES DE RISCO
    // ========================================

    /** Fatores de risco ambientais */
    riskFactors: RiskFactors;

    // ========================================
    // REPARABILIDADE
    // ========================================

    /** Indicadores de reparabilidade */
    repairability: ComponentRepairability;

    // ========================================
    // METADATA
    // ========================================

    /** Modos de falha comuns */
    failureModes?: string[];

    /** Sintomas de falha visíveis ao usuário */
    failureSymptoms?: string[];

    /** Fonte dos dados */
    dataSource: DataSource;

    /** Data da última atualização */
    lastUpdated?: string;

    /** Notas adicionais */
    notes?: string;
}

// ============================================
// MAPEAMENTO PRODUTO → COMPONENTES
// ============================================

/**
 * Instância de componente em um produto específico
 */
export interface ComponentInstance {
    /** ID do componente (referência para ComponentDefinition) */
    componentId: string;

    /** Quantidade deste componente no produto */
    quantity: number;

    /** Criticidade para o funcionamento do produto */
    criticality: ComponentCriticality;

    /** Modelo específico (se conhecido) */
    specificModel?: string;

    /** Part Number (se conhecido) */
    partNumber?: string;

    /** Notas específicas para este produto */
    notes?: string;
}

/**
 * Mapeamento de componentes de um produto
 */
export interface ProductComponentMapping {
    /** ID do produto (slug) */
    productId: string;

    /** Nome do produto */
    productName: string;

    /** Categoria do produto */
    categoryId: string;

    /** Lista de componentes */
    components: ComponentInstance[];

    /** Confiança no mapeamento (0.0 a 1.0) */
    mappingConfidence: number;

    /** Fonte do mapeamento */
    mappingSource: 'service_manual' | 'teardown' | 'inferred' | 'user_report';

    /** Data da última atualização */
    lastUpdated: string;
}

// ============================================
// ÍNDICE DE REPARABILIDADE SIC-RI
// ============================================

/**
 * Índice de Reparabilidade Brasileiro (SIC-RI)
 * Adaptado do Indice de Réparabilité francês
 */
export interface RepairabilityIndexBR {
    /** Documentação técnica (10% peso) - 0 a 10 */
    documentation: number;

    /** Facilidade de desmontagem (25% peso) - 0 a 10 */
    disassembly: number;

    /** Disponibilidade de peças (30% peso) - 0 a 10 */
    partsAvailability: number;

    /** Preço das peças vs produto novo (25% peso) - 0 a 10 */
    partsPricing: number;

    /** Software e reset (10% peso) - 0 a 10 */
    softwareReset: number;

    /** Score final ponderado (0 a 10) */
    finalScore: number;

    /** Custo Total de Reparo estimado (R$) */
    estimatedRepairCostBRL: number;

    /** Classificação textual */
    classification: 'excellent' | 'good' | 'moderate' | 'poor' | 'unrepairable';
}

// ============================================
// RESULTADO DO CÁLCULO SIC
// ============================================

/**
 * Resultado do cálculo de vida útil baseado em componentes
 */
export interface SICCalculationResult {
    /** Vida útil estimada do produto (anos) */
    estimatedLifespanYears: number;

    /** Componente limitante (o que falhará primeiro) */
    limitingComponent: {
        id: string;
        name: string;
        estimatedLifeYears: number;
        criticality: ComponentCriticality;
    };

    /** Probabilidade de falha em 5 anos */
    failureProbability5Years: number;

    /** Custo de manutenção esperado em 5 anos */
    expectedMaintenanceCost5Years: number;

    /** Índice de reparabilidade SIC-RI */
    repairabilityIndex: RepairabilityIndexBR;

    /** Breakdown por componente */
    componentBreakdown: Array<{
        componentId: string;
        componentName: string;
        estimatedLifeYears: number;
        failureProbability5Years: number;
        repairCostBRL: number;
        criticality: ComponentCriticality;
    }>;

    /** Confiança no cálculo (0.0 a 1.0) */
    calculationConfidence: number;

    /** Quality factors applied (πMarca × πTech) */
    qualityFactors?: {
        brandFactor: number;
        techFactor: number;
        combinedMultiplier: number;
        brandTier?: BrandQualityTier;
        displayTechnology?: DisplayTechnology;
        compressorTechnology?: CompressorTechnology;
    };

    /** Avisos e notas */
    warnings?: string[];
}

// ============================================
// HELPERS E CONSTANTES
// ============================================

/**
 * Pesos do SIC-RI (Índice de Reparabilidade Brasileiro)
 */
export const SIC_RI_WEIGHTS = {
    documentation: 0.10,
    disassembly: 0.25,
    partsAvailability: 0.30,
    partsPricing: 0.25,
    softwareReset: 0.10,
} as const;

/**
 * Fatores de confiança por fonte de dados
 */
export const DATA_SOURCE_CONFIDENCE: Record<DataSource, number> = {
    lab_test: 1.0,
    field_data: 0.9,
    manufacturer: 0.7,
    industry_avg: 0.6,
    estimated: 0.4,
};

/**
 * Fator πTropical padrão por tipo de ambiente
 */
export const TROPICAL_FACTORS = {
    inland_urban: 1.0,      // Interior urbano, energia estável
    coastal: 1.5,           // Litoral, maresia
    coastal_humid: 2.0,     // Litoral úmido intenso
    rural_unstable: 1.3,    // Rural com energia instável
    industrial: 1.4,        // Zona industrial, poluição
} as const;

// ============================================
// QUALITY FACTORS (πMarca, πTech)
// ============================================

/**
 * Tier de qualidade da marca
 * Baseado na análise de componentes internos (capacitores, solda, QC)
 * @see Relatório "Diferenciação Qualidade Componentes por Marca"
 */
export type BrandQualityTier =
    | 'elite'       // Sony, Panasonic - Capacitores japoneses 105°C, design superdimensionado
    | 'premium'     // Samsung (High-End), LG - Mix coreano/japonês, robusto
    | 'standard'    // Samsung (Entrada), TCL (High-End) - Tier 2, margens justas
    | 'budget'      // TCL (Entrada), Hisense, Philco - Tier 3, IPB comum
    | 'generic';    // Multilaser, Britânia, HQ - Componentes sem rastreabilidade

/**
 * Fator de qualidade da marca (πMarca)
 * Multiplica a VUE_Base para ajustar pela engenharia de componentes
 */
export const BRAND_QUALITY_FACTORS: Record<BrandQualityTier, number> = {
    elite: 1.20,      // Uso exclusivo de capacitores premium, QC rigoroso
    premium: 1.05,    // Componentes de qualidade, design robusto
    standard: 0.90,   // Capacitores Tier 2, margens otimizadas
    budget: 0.80,     // Capacitores Tier 3, dissipação térmica limitada
    generic: 0.60,    // Alto risco de mortalidade infantil
} as const;

/**
 * Tipo de tecnologia de display
 */
export type DisplayTechnology =
    | 'oled_evo'      // OLED com deutério (LG C2+, G-series)
    | 'oled_standard' // WOLED sem deutério (LG B-series, A-series)
    | 'mini_led'      // Mini-LED / FALD (Samsung Neo QLED, TCL OD Zero)
    | 'edge_led'      // Edge LED (maioria dos LCDs budget)
    | 'direct_led';   // Direct LED sem local dimming

/**
 * Fator de tecnologia (πTech) para displays
 */
export const DISPLAY_TECH_FACTORS: Record<DisplayTechnology, number> = {
    oled_evo: 1.15,       // Alta resistência à degradação térmica e burn-in
    oled_standard: 0.80,  // Susceptível a degradação orgânica rápida
    mini_led: 1.05,       // Redundância de emissores, calor distribuído
    edge_led: 0.85,       // LEDs em alta corrente/temperatura
    direct_led: 0.90,     // Mais robusto que Edge, menos que Mini-LED
} as const;

/**
 * Tipo de tecnologia de compressor
 */
export type CompressorTechnology =
    | 'inverter_reciprocating'  // Embraco VEM, Panasonic
    | 'reciprocating_onoff'     // On/Off convencional (Embraco, GMCC)
    | 'linear_inverter'         // LG Linear Inverter
    | 'linear_inverter_v2';     // LG Linear Inverter pós-2022

/**
 * Fator de tecnologia (πTech) para compressores
 */
export const COMPRESSOR_TECH_FACTORS: Record<CompressorTechnology, number> = {
    inverter_reciprocating: 1.20,   // Baixo desgaste, partida suave, tecnologia madura
    reciprocating_onoff: 1.00,      // Robusto mas estressado por partidas frequentes
    linear_inverter: 0.65,          // Alto risco de fadiga mecânica (<2022)
    linear_inverter_v2: 0.90,       // Design revisado pós-2022
} as const;

/**
 * Mapeamento de marcas para seus tiers de qualidade por categoria
 */
export interface BrandQualityMapping {
    brand: string;
    categoryId: string;
    tier: BrandQualityTier;
    notes?: string;
}

/**
 * Configuração de quality factors para um produto específico
 */
export interface ProductQualityFactors {
    productId: string;
    brandTier: BrandQualityTier;
    displayTechnology?: DisplayTechnology;
    compressorTechnology?: CompressorTechnology;
    /** Override manual do fator de marca (opcional) */
    brandFactorOverride?: number;
    /** Override manual do fator de tecnologia (opcional) */
    techFactorOverride?: number;
}
