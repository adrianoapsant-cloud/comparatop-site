/**
 * =============================================================================
 * FIPE-Eletro: Sistema de Cálculo de TCO (Total Cost of Ownership)
 * =============================================================================
 *
 * Módulo de tipos para o índice FIPE-Eletro, baseado na metodologia de
 * TCO descontado para as 53 categorias de eletrodomésticos.
 *
 * ## Fórmula Mestre do TCO Descontado:
 * ```
 * TCO = I₀ + Σ[(Cₒₚ + Cₘ + Cₓ) / (1 + r)ⁿ] - Vᵣ/(1+r)ᴺ + Cᴅ
 * ```
 *
 * Onde:
 * - I₀: Investimento Inicial (Capex) = P_compra + C_inst + C_frete
 * - Cₒₚ: Custo Operacional (Energia, Água, Gás)
 * - Cₘ: Custo de Manutenção (Probabilístico)
 * - Cₓ: Custo de Consumíveis
 * - Vᵣ: Valor Residual projetado
 * - Cᴅ: Custo de Descarte
 * - r: Taxa de Desconto (WACC/Selic Real)
 * - n: Período em anos
 *
 * ## Fórmula de Depreciação Exponencial:
 * ```
 * V_fipe = P_novo × e^(-δ × t) × K_estado × K_marca × K_tech
 * ```
 *
 * @version 1.0.0
 * @see Relatório Técnico FIPE-Eletro
 */

// =============================================================================
// ENUMS E TIPOS BASE
// =============================================================================

/**
 * Categorias FIPE-Eletro organizadas por Tier de impacto comercial.
 *
 * Tier 1: Alto volume, alto ticket (15)
 * Tier 2: Alto impacto, Pareto-friendly (15)
 * Tier 3: Bons de venda, recorrência (23)
 */
export type FipeEletroCategory =
    // ─── Tier 1: Alto Volume, Alto Ticket (15 categorias) ───────────────────
    | 'tv'
    | 'smartphone'
    | 'geladeira'
    | 'notebook'
    | 'ar-condicionado'
    | 'lavadora-roupas'
    | 'lava-seca'
    | 'fogao'
    | 'cooktop'
    | 'micro-ondas'
    | 'freezer'
    | 'lava-loucas'
    | 'monitor'
    | 'console'
    | 'robo-aspirador'
    // ─── Tier 2: Alto Impacto, Pareto-Friendly (15 categorias) ──────────────
    | 'soundbar'
    | 'fone-tws'
    | 'headset-gamer'
    | 'caixa-som-bluetooth'
    | 'tablet'
    | 'smartwatch'
    | 'roteador-mesh'
    | 'impressora'
    | 'cadeira-gamer'
    | 'gpu'
    | 'ssd'
    | 'nobreak'
    | 'projetor'
    | 'camera'
    | 'camera-seguranca'
    // ─── Tier 3: Bons de Venda, Recorrência (23 categorias) ─────────────────
    | 'fechadura-digital'
    | 'streaming-device'
    | 'frigobar'
    | 'adega-climatizada'
    | 'purificador-agua'
    | 'forno-embutir'
    | 'coifa-depurador'
    | 'aspirador-vertical'
    | 'air-fryer'
    | 'cafeteira-espresso'
    | 'processador-mixer'
    | 'placa-mae'
    | 'processador-cpu'
    | 'memoria-ram'
    | 'fonte-pc'
    | 'gabinete-pc'
    | 'controle-acessorio-console'
    | 'estabilizador'
    // Opcionais (substituem Pneus/Baterias se 100% eletro/tech)
    | 'ventilador-premium'
    | 'climatizador'
    | 'lavadora-pressao'
    | 'ferramenta-eletrica'
    // Automotivo (opcional)
    | 'pneu'
    | 'bateria-automotiva';

/**
 * Família de custo para agrupar categorias com perfis de TCO similares.
 * Cada família possui taxas de depreciação (δ) e drivers de custo específicos.
 */
export type CostFamily =
    | 'tech-display'        // TVs, Monitores, Notebooks, Tablets (δ = 18-22%)
    | 'tech-mobile'         // Smartphones, Smartwatches, Fones (δ = 20-25%)
    | 'tech-computing'      // PCs, GPUs, SSDs, RAM (δ = 15-20%)
    | 'tech-audio'          // Soundbars, Headsets, Caixas (δ = 12-15%)
    | 'tech-gaming'         // Consoles, Controles, Cadeiras (δ = 15-18%)
    | 'appliance-cooling'   // Geladeiras, Freezers, Adegas (δ = 10-12%)
    | 'appliance-washing'   // Lavadoras, Lava-louças (δ = 12-15%)
    | 'appliance-climate'   // Ar-condicionado, Climatizadores (δ = 12-15%)
    | 'appliance-cooking'   // Fogões, Cooktops, Micro-ondas (δ = 10-12%)
    | 'appliance-portable'  // Air fryers, Cafeteiras, Aspiradores (δ = 15-18%)
    | 'home-security'       // Câmeras, Fechaduras digitais (δ = 15-18%)
    | 'home-network'        // Roteadores, Nobreaks (δ = 12-15%)
    | 'automotive';         // Pneus, Baterias (δ = varies)

/**
 * Classificação energética INMETRO/Procel.
 */
export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/**
 * Estado de conservação padronizado (afeta K_estado).
 */
export type ConditionGrade = 'excelente' | 'bom' | 'regular' | 'ruim';

/**
 * Tipos de consumíveis categorizados.
 */
export type ConsumableType =
    | 'filtro-agua'
    | 'filtro-ar-hepa'
    | 'filtro-gordura'
    | 'filtro-fiapos'
    | 'escova-lateral'
    | 'escova-central'
    | 'saco-po'
    | 'gaxeta-borracha'
    | 'lampada-interna'
    | 'descalcificante'
    | 'abrilhantador'
    | 'outro';

// =============================================================================
// 1. DADOS ESTÁTICOS DO PRODUTO (Capex)
// =============================================================================

/**
 * Dados estáticos do produto para cálculo de I₀ (Investimento Inicial).
 *
 * I₀ = P_compra + C_inst + C_frete
 */
export interface ProductStaticData {
    /**
     * Identificador único FIPE-Eletro.
     * @example "geladeira-frost-free-brastemp-brm44-2024"
     */
    fipeId: string;

    /**
     * ASIN da Amazon ou código de marketplace.
     */
    asin?: string;

    /** Categoria FIPE-Eletro (53 categorias) */
    category: FipeEletroCategory;

    /** Família de custo para perfil de depreciação */
    costFamily: CostFamily;

    /**
     * Preço de referência NOVO atual (P_novo).
     * ⚠️ Usar preço atual de mercado, NÃO histórico.
     * @unit BRL (R$)
     */
    priceNew: number;

    /**
     * Custo de instalação (C_inst).
     * Crítico para: Splits (30-50%), Coifas, Embutidos.
     * @unit BRL (R$)
     */
    installationCost: number;

    /**
     * Custo de frete estimado.
     * @unit BRL (R$)
     */
    shippingCost: number;

    /**
     * Potência nominal declarada pelo fabricante.
     * @unit Watts (W)
     */
    nominalPowerWatts: number;

    /** Voltagem do produto */
    voltage: 110 | 220 | 'bivolt';

    /** Classificação energética INMETRO/Procel */
    energyRating: EnergyRating;

    /** Marca do produto (afeta K_marca) */
    brand: string;

    /** Modelo específico */
    model: string;

    /** Ano de fabricação (para cálculo de idade t) */
    yearManufactured: number;

    /** URL da ficha técnica */
    specSheetUrl?: string;
}

// =============================================================================
// 2. VARIÁVEIS DE CONSUMO (Opex)
// =============================================================================

/**
 * Consumo energético para cálculo de Cₒₚ (Custo Operacional).
 *
 * Fórmula: Cₒₚ(t) = E_mensal × T_energia × (1 + π_energia)^t × 12
 *
 * O consumo real difere do nominal por:
 * - Temperatura ambiente (+15-25% para geladeiras/ACs)
 * - Frequência de uso (+5-10%)
 * - Degradação por idade (+5%/ano após 5 anos)
 */
export interface EnergyConsumption {
    /**
     * Consumo mensal NOMINAL (etiqueta INMETRO).
     * @unit kWh/mês
     */
    nominalKwhMonth: number;

    /**
     * Consumo mensal REAL estimado.
     * realKwhMonth = nominalKwhMonth × correctionFactor
     * @unit kWh/mês
     */
    realKwhMonth: number;

    /**
     * Fator de correção aplicado.
     * Valores típicos: 1.1 a 1.3 (10-30% acima do nominal).
     */
    correctionFactor: number;

    /**
     * Horas de uso diário.
     * Geladeiras/Freezers = 24h; ACs = uso médio sazonal.
     * @unit horas/dia
     */
    dailyUsageHours: number;

    /** Mês de referência (sazonalidade) */
    referenceMonth?: number;
}

/**
 * Consumo de água (Lavadoras/Lava-louças).
 */
export interface WaterConsumption {
    /** Litros por ciclo de lavagem */
    litersPerCycle: number;

    /** Ciclos estimados por mês */
    cyclesPerMonth: number;

    /**
     * Tarifa água + esgoto (média regional).
     * @unit R$/m³
     */
    waterTariffPerCubicMeter: number;
}

/**
 * Consumo de gás (Fogões/Fornos/Aquecedores).
 */
export interface GasConsumption {
    /** Tipo de gás */
    gasType: 'GLP' | 'GN';

    /**
     * Consumo mensal estimado.
     * GLP: kg/mês (botijão 13kg referência)
     * GN: m³/mês
     */
    monthlyConsumption: number;

    /**
     * Preço atual do gás.
     * @unit BRL
     */
    currentGasPrice: number;
}

/**
 * Item consumível individual.
 *
 * Cₓ = Σ[(Preço × Frequência_anual) / (1+r)^t]
 */
export interface ConsumableItem {
    /** Tipo padronizado */
    type: ConsumableType;

    /** Nome descritivo */
    name: string;

    /**
     * Preço unitário.
     * @unit BRL (R$)
     */
    unitPrice: number;

    /**
     * Frequência de troca em meses.
     * Use 0 se baseado em ciclos.
     * @unit meses
     */
    replacementFrequencyMonths: number;

    /**
     * Frequência de troca em ciclos/unidades de uso.
     * Ex: filtro purificador = 3000 litros.
     */
    replacementFrequencyCycles?: number;

    /** Se é peça original do fabricante */
    isOriginalPart: boolean;

    /** URL para monitoramento de preço */
    priceReferenceUrl?: string;
}

/**
 * Agregador de variáveis Opex.
 */
export interface OpexVariables {
    /** Consumo de energia elétrica */
    energy: EnergyConsumption;

    /** Consumo de água (lavadoras/lava-louças) */
    water?: WaterConsumption;

    /** Consumo de gás (fogões/fornos) */
    gas?: GasConsumption;

    /** Lista de consumíveis */
    consumables: ConsumableItem[];
}

// =============================================================================
// 3. VARIÁVEIS DE MANUTENÇÃO (Probabilísticas)
// =============================================================================

/**
 * Ponto na curva de probabilidade de falha ("curva da banheira").
 *
 * Modelo: Alta falha inicial → Estabilidade → Aumento no fim da vida.
 */
export interface FailureProbabilityPoint {
    /**
     * Ano de vida do equipamento.
     * @unit anos
     */
    year: number;

    /**
     * Probabilidade de falha (0 a 1).
     * Ex: 0.05 = 5% de chance.
     */
    probability: number;
}

/**
 * Custo de reparo detalhado.
 *
 * Cₘ(t) = P_falha(t) × [C_mao_obra + C_pecas + C_logistica]
 */
export interface RepairCostBreakdown {
    /**
     * Custo médio de mão de obra.
     * ⚠️ Varia regionalmente (aplicar multiplicador).
     * @unit BRL (R$)
     */
    laborCost: number;

    /**
     * Custo médio de peças.
     * Placas eletrônicas: R$200-800.
     * @unit BRL (R$)
     */
    partsCost: number;

    /**
     * Custo de logística (visita técnica / envio).
     * @unit BRL (R$)
     */
    logisticsCost: number;

    /**
     * Custo total = labor + parts + logistics.
     * @unit BRL (R$)
     */
    totalRepairCost: number;
}

/**
 * Variáveis de manutenção probabilísticas.
 */
export interface MaintenanceVariables {
    /**
     * Curva de falha anualizada.
     * Array de (ano, probabilidade) para modelar a curva.
     *
     * Exemplo geladeira:
     * - Ano 1: 0.02 (garantia)
     * - Anos 2-5: 0.05
     * - Anos 6-8: 0.10
     * - Anos 9-10: 0.20
     */
    failureCurve: FailureProbabilityPoint[];

    /** Custo de reparo detalhado */
    repairCost: RepairCostBreakdown;

    /**
     * Índice de Reparabilidade (0-10).
     *
     * Baseado em:
     * - Disponibilidade de peças
     * - Facilidade de desmontagem
     * - Documentação técnica
     * - Rede de assistência
     */
    repairabilityIndex: number;

    /**
     * Threshold de viabilidade econômica de reparo.
     * Quando C_reparo > V_residual × threshold → descarte.
     * Típico: 0.5 (reparo > 50% do valor residual).
     */
    economicRepairThreshold: number;

    /**
     * Vida útil esperada.
     * @unit anos
     */
    expectedLifespanYears: number;

    /**
     * Multiplicador regional de mão de obra.
     * SP capital: 1.3 | Interior: 1.0 | Nordeste: 0.8
     */
    regionalLaborMultiplier?: number;
}

// =============================================================================
// 4. VARIÁVEIS MACROECONÔMICAS (Contexto)
// =============================================================================

/**
 * Contexto macroeconômico para TCO.
 *
 * Forma o "anel externo" de pressão sobre o Valor FIPE-Eletro.
 * ⚠️ Atualizar mensalmente/trimestralmente.
 */
export interface MacroeconomicContext {
    /**
     * Tarifa de energia (com impostos).
     * Inclui ICMS, PIS/COFINS.
     * @unit R$/kWh
     */
    energyTariffPerKwh: number;

    /** Bandeira tarifária vigente */
    currentEnergyFlag: 'verde' | 'amarela' | 'vermelha1' | 'vermelha2';

    /**
     * Adicional da bandeira.
     * @unit R$/kWh
     */
    energyFlagSurcharge: number;

    /**
     * Taxa de desconto (r) para VPL.
     *
     * WACC ou custo de oportunidade do consumidor.
     * r = (1 + Selic) / (1 + IPCA) - 1 (taxa real)
     *
     * Valores típicos Brasil: 5% a 12% a.a.
     */
    discountRate: number;

    /** Taxa Selic nominal (% a.a.) */
    selicRate: number;

    /** IPCA 12 meses (% a.a.) */
    ipcaRate: number;

    /**
     * Inflação energética projetada (π_energia).
     * Historicamente acima do IPCA.
     * @unit % a.a.
     */
    energyInflationRate: number;

    /** Taxa de câmbio USD/BRL (afeta peças importadas) */
    exchangeRateUsdBrl: number;

    /** Região do usuário para ajustes */
    userRegion: string;

    /**
     * Data de referência dos dados.
     * @format ISO 8601
     */
    referenceDate: string;
}

// =============================================================================
// 5. CONFIGURAÇÃO DE DEPRECIAÇÃO
// =============================================================================

/**
 * Configuração de depreciação para Valor FIPE.
 *
 * Fórmula de Depreciação Exponencial:
 * V_fipe = P_novo × e^(-δ × t) × K_estado × K_marca × K_tech
 */
export interface DepreciationConfig {
    /**
     * Taxa Delta (δ) de depreciação anual.
     *
     * Por família:
     * - Linha Branca: 0.10-0.12 (10-12%)
     * - Portáteis: 0.15-0.18 (15-18%)
     * - Eletrônicos: 0.20-0.25 (20-25%)
     */
    deltaRate: number;

    /**
     * K_estado: Fator de condição/conservação.
     *
     * Derivado do Score de Qualidade:
     * - Excelente: 1.0
     * - Bom: 0.85
     * - Regular: 0.70
     * - Ruim: 0.50
     */
    kCondition: number;

    /**
     * K_marca: Fator de reputação e liquidez.
     *
     * - Marcas premium: 1.0-1.1
     * - Marcas desconhecidas: 0.7-0.8
     */
    kBrand: number;

    /**
     * K_tech: Fator de obsolescência tecnológica.
     *
     * Penaliza modelos ultrapassados:
     * - AC On/Off vs Inverter: 0.8
     * - Fritadeira óleo vs Air Fryer: 0.6
     * - Sem Frost Free: 0.7
     *
     * Padrão (sem obsolescência): 1.0
     */
    kTechnology: number;

    /**
     * Depreciação "loss of new status".
     * Perda imediata ao sair da loja.
     * Típico: 0.20-0.30 (20-30% no 1º ano).
     */
    firstYearDepreciationBonus: number;

    /**
     * Valor mínimo residual (% do novo).
     * Abaixo = sucata.
     * Típico: 0.05-0.10 (5-10%).
     */
    minimumResidualPercentage: number;
}

/**
 * Perfil de ponderação para scoring de qualidade por família.
 *
 * Cada família tem pesos distintos.
 * Score Final = Σ(peso × nota)
 */
export interface QualityScoringProfile {
    /**
     * Peso estético (aparência externa).
     * Alto: Side-by-Side, Coifas, Adegas
     * Baixo: Lavadoras, Tanquinhos
     */
    aestheticWeight: number;

    /**
     * Peso funcional (mecânica, desempenho).
     * Alto: Lavadoras, ACs
     */
    functionalWeight: number;

    /**
     * Peso tecnológico (displays, sensores, IoT).
     * Alto: Robôs aspiradores, Smart Appliances
     */
    technologicalWeight: number;

    /**
     * Peso de ruído.
     * Crítico: ACs, Lavadoras
     */
    noiseWeight: number;

    /**
     * Peso integridade de acessórios.
     * Alto: Air Fryers, Cafeteiras
     */
    accessoriesWeight: number;
}

// =============================================================================
// OUTPUTS E RESULTADOS
// =============================================================================

/**
 * Componentes detalhados do TCO calculado.
 */
export interface TcoBreakdown {
    /**
     * Investimento Inicial (I₀).
     * = P_compra + C_inst + C_frete
     * @unit BRL (R$)
     */
    initialInvestment: number;

    /**
     * Custo Operacional total (PV).
     * Energia + Água + Gás descontados.
     * @unit BRL (R$)
     */
    operationalCostPv: number;

    /**
     * Custo de Manutenção esperado (PV).
     * Σ[P_falha(t) × C_reparo] descontado.
     * @unit BRL (R$)
     */
    maintenanceCostPv: number;

    /**
     * Custo de Consumíveis (PV).
     * @unit BRL (R$)
     */
    consumablesCostPv: number;

    /**
     * Valor Residual ao final (PV).
     * @unit BRL (R$)
     */
    residualValuePv: number;

    /**
     * Custo de Descarte.
     * Pode ser negativo (custa para descartar).
     * @unit BRL (R$)
     */
    disposalCost: number;

    /**
     * TCO Total = I₀ + Cₒₚ + Cₘ + Cₓ - Vᵣ + Cᴅ
     * @unit BRL (R$)
     */
    totalTco: number;

    /**
     * TCO mensal médio.
     * @unit BRL/mês
     */
    monthlyTcoAverage: number;

    // ─── Monetização / Afiliação ──────────────────────────────────────────────

    /**
     * Nome do varejista com melhor oferta.
     * @example "Amazon", "Mercado Livre", "Magazine Luiza"
     */
    best_retailer_name?: string;

    /**
     * URL direta para a página do produto no varejista.
     * Usado para CTA de compra/afiliação.
     */
    best_offer_url?: string;
}

/**
 * Resultado de avaliação Valor FIPE para usado.
 */
export interface FipeValuation {
    /**
     * Valor FIPE calculado (preço justo).
     * @unit BRL (R$)
     */
    fipeValue: number;

    /**
     * Preço referência novo atual.
     * @unit BRL (R$)
     */
    newReferencePrice: number;

    /** Depreciação acumulada (%) */
    depreciationPercentage: number;

    /** Idade do equipamento (anos) */
    ageYears: number;

    /** Fatores K aplicados */
    appliedFactors: {
        kCondition: number;
        kBrand: number;
        kTechnology: number;
    };

    /** Score de qualidade (0-100) */
    qualityScore: number;

    /** Faixa de preço para negociação */
    priceRange: {
        minimum: number;
        suggested: number;
        maximum: number;
    };

    /**
     * Se é economicamente viável manter/comprar.
     * false = próximo do ponto de inviabilidade.
     */
    isEconomicallyViable: boolean;

    /**
     * Data do cálculo.
     * @format ISO 8601
     */
    valuationDate: string;
}

// =============================================================================
// INTERFACE PRINCIPAL: PRODUTO FIPE-ELETRO COMPLETO
// =============================================================================

/**
 * Estrutura completa de um produto FIPE-Eletro.
 *
 * Agrega todos os dados para:
 * 1. Calcular TCO descontado
 * 2. Determinar Valor FIPE de mercado
 * 3. Comparar produtos da mesma categoria
 */
export interface FipeEletroProduct {
    /** Dados estáticos (Capex) */
    staticData: ProductStaticData;

    /** Variáveis de consumo (Opex) */
    opex: OpexVariables;

    /** Variáveis de manutenção probabilísticas */
    maintenance: MaintenanceVariables;

    /** Perfil de scoring de qualidade */
    qualityScoringProfile: QualityScoringProfile;

    /** Configuração de depreciação */
    depreciation: DepreciationConfig;

    /** Metadados de auditoria */
    metadata: {
        createdAt: string;
        updatedAt: string;
        dataSource: string;
        dataConfidence: number;
    };
}

/**
 * Contexto completo para cálculo de TCO.
 */
export interface TcoCalculationContext {
    /** Produto a analisar */
    product: FipeEletroProduct;

    /** Contexto macroeconômico */
    macroContext: MacroeconomicContext;

    /** Horizonte de análise (anos) */
    analysisHorizonYears: number;

    /** Perfil de uso do consumidor */
    usageProfile: {
        householdSize: 1 | 2 | 3 | 4 | 5 | '6+';
        usageIntensity: 'low' | 'medium' | 'high';
        climateZone: 'tropical' | 'subtropical' | 'temperate';
    };

    /** Cenário de simulação (stress test) */
    scenario?: {
        energyInflationOverride?: number;
        discountRateOverride?: number;
    };
}

// =============================================================================
// TIPOS UTILITÁRIOS
// =============================================================================

/**
 * Comparação entre dois produtos.
 */
export interface ProductComparison {
    productA: { id: string; tco: TcoBreakdown };
    productB: { id: string; tco: TcoBreakdown };
    /** Ano de break-even (curvas se cruzam) */
    breakEvenYear: number | null;
    /** Economia total no período */
    totalSavings: number;
    /** Produto recomendado */
    recommendedProduct: 'A' | 'B';
    /** Justificativa */
    recommendation: string;
}

/**
 * Dados para gráfico de curva TCO.
 */
export interface TcoCurveDataPoint {
    year: number;
    cumulativeTco: number;
    yearlyOperationalCost: number;
    yearlyMaintenanceCost: number;
    residualValue: number;
}

/**
 * Defaults por categoria.
 */
export interface CategoryDefaults {
    category: FipeEletroCategory;
    costFamily: CostFamily;
    defaultDeltaRate: number;
    defaultLifespanYears: number;
    qualityScoringProfile: QualityScoringProfile;
    typicalConsumables: ConsumableType[];
}
