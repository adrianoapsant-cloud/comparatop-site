/**
 * @file component-engine.ts
 * @description Motor de cálculo do Sistema de Inteligência de Componentes (SIC)
 * 
 * Calcula:
 * - Vida útil estimada baseada em componentes
 * - Probabilidade de falha em 5 anos
 * - Custo de manutenção esperado
 * - Índice de reparabilidade SIC-RI
 * 
 * @version 1.0.0
 */

import type {
    ComponentDefinition,
    ComponentInstance,
    ProductComponentMapping,
    SICCalculationResult,
    RepairabilityIndexBR,
    ComponentCriticality,
    RiskFactors,
} from '@/data/components/types';
import { SIC_RI_WEIGHTS, DATA_SOURCE_CONFIDENCE } from '@/data/components/types';
import { getProductMapping } from '@/data/components/product-mappings';
import { ALL_TV_COMPONENTS, getTVComponentById } from '@/data/components/tv-components';
import { ALL_FRIDGE_COMPONENTS, getFridgeComponentById } from '@/data/components/fridge-components';
import { ALL_AC_COMPONENTS, getACComponentById } from '@/data/components/ac-components';
import { ALL_WASHER_COMPONENTS, getWasherComponentById } from '@/data/components/washer-components';
import { ALL_ROBOT_VACUUM_COMPONENTS, getRobotVacuumComponentById } from '@/data/components/robot-vacuum-components';
import { calculateQualityMultiplier, getProductQualityFactors } from '@/data/components/quality-factors';

// ============================================
// CONFIGURAÇÃO
// ============================================

interface UserEnvironment {
    /** Localização: 'coastal', 'inland', 'rural' */
    location?: 'coastal' | 'inland' | 'rural';

    /** Qualidade da energia elétrica */
    voltageStability?: 'stable' | 'unstable';

    /** Temperatura ambiente média */
    avgTemperatureCelsius?: number;

    /** Uso diário estimado em horas */
    dailyUsageHours?: number;
}

const DEFAULT_ENVIRONMENT: UserEnvironment = {
    location: 'inland',
    voltageStability: 'stable',
    avgTemperatureCelsius: 25,
    dailyUsageHours: 4,
};

// ============================================
// HELPERS
// ============================================

/**
 * Resolve um componente por ID, buscando em todas as databases
 */
function getComponentById(componentId: string): ComponentDefinition | undefined {
    // Tentar TV primeiro
    const tvComponent = getTVComponentById(componentId);
    if (tvComponent) return tvComponent;

    // Tentar Fridge
    const fridgeComponent = getFridgeComponentById(componentId);
    if (fridgeComponent) return fridgeComponent;

    // Tentar AC
    const acComponent = getACComponentById(componentId);
    if (acComponent) return acComponent;

    // Tentar Washer
    const washerComponent = getWasherComponentById(componentId);
    if (washerComponent) return washerComponent;

    // Tentar Robot Vacuum
    const robotVacuumComponent = getRobotVacuumComponentById(componentId);
    if (robotVacuumComponent) return robotVacuumComponent;

    return undefined;
}

// ============================================
// CÁLCULOS PRINCIPAIS
// ============================================

/**
 * Calcula a vida útil estimada de um componente individual
 */
function calculateComponentLifespan(
    component: ComponentDefinition,
    environment: UserEnvironment = DEFAULT_ENVIRONMENT
): number {
    // Base: vida característica Weibull (eta)
    let lifeYears = component.reliability.weibullEtaYears;

    // Aplicar fatores de risco ambientais
    const riskFactors = component.riskFactors;

    // Penalidade por localização litorânea
    if (environment.location === 'coastal') {
        lifeYears /= riskFactors.coastalPenalty;
    }

    // Penalidade por instabilidade de tensão
    if (environment.voltageStability === 'unstable') {
        lifeYears /= riskFactors.voltageInstabilityPenalty;
    }

    // Penalidade tropical (temperatura)
    if (environment.avgTemperatureCelsius && environment.avgTemperatureCelsius > 28) {
        const heatPenalty = riskFactors.heatPenalty ?? 1.0;
        // Lei de Arrhenius simplificada: cada 10°C acima de 25°C = -20% vida
        const tempExcess = (environment.avgTemperatureCelsius - 25) / 10;
        lifeYears /= Math.pow(heatPenalty, tempExcess);
    }

    // Ajustar por uso diário
    if (environment.dailyUsageHours) {
        const usageRatio = environment.dailyUsageHours / 4; // 4h é a base
        if (usageRatio > 1) {
            lifeYears /= Math.pow(usageRatio, 0.5); // Degradação sublinear
        }
    }

    // Aplicar fator de confiança dos dados
    const confidenceFactor = DATA_SOURCE_CONFIDENCE[component.dataSource];
    // Dados menos confiáveis = estimativa mais conservadora
    lifeYears *= (0.7 + 0.3 * confidenceFactor);

    return Math.round(lifeYears * 10) / 10;
}

/**
 * Calcula probabilidade de falha em N anos usando distribuição de Weibull
 */
function calculateFailureProbability(
    component: ComponentDefinition,
    years: number,
    environment: UserEnvironment = DEFAULT_ENVIRONMENT
): number {
    const beta = component.reliability.weibullBeta;
    const eta = calculateComponentLifespan(component, environment);

    // F(t) = 1 - exp(-(t/η)^β)
    const probability = 1 - Math.exp(-Math.pow(years / eta, beta));

    return Math.min(probability, 1.0);
}

/**
 * Calcula o custo de reparo total para um componente
 */
function calculateRepairCost(component: ComponentDefinition): number {
    return component.costs.partCostBRL + component.costs.laborCostBRL;
}

/**
 * Calcula o Índice de Reparabilidade Brasileiro (SIC-RI)
 */
function calculateRepairabilityIndex(
    components: Array<{ component: ComponentDefinition; instance: ComponentInstance }>
): RepairabilityIndexBR {
    // Agregar scores de todos os componentes críticos
    const criticalComponents = components.filter(
        c => c.instance.criticality === 'fatal' || c.instance.criticality === 'high'
    );

    if (criticalComponents.length === 0) {
        return {
            documentation: 5,
            disassembly: 5,
            partsAvailability: 5,
            partsPricing: 5,
            softwareReset: 5,
            finalScore: 5,
            estimatedRepairCostBRL: 0,
            classification: 'moderate',
        };
    }

    // Calcular média ponderada por criticidade
    let docSum = 0, disSum = 0, partsSum = 0, priceSum = 0, softSum = 0;
    let totalRepairCost = 0;
    let weightSum = 0;

    for (const { component, instance } of criticalComponents) {
        const weight = instance.criticality === 'fatal' ? 2 : 1;
        weightSum += weight;

        const repair = component.repairability;

        docSum += (repair.hasServiceManual ? 8 : 3) * weight;
        disSum += (repair.disassemblyScore ?? 5) * weight;

        // Disponibilidade de peças
        const availabilityScore = {
            excellent: 10,
            good: 8,
            limited: 5,
            scarce: 2,
            discontinued: 0,
        }[repair.partsAvailability];
        partsSum += availabilityScore * weight;

        // Preço das peças (relativo ao custo de reparo)
        const repairCost = calculateRepairCost(component);
        totalRepairCost += repairCost;
        // Score inverso: quanto mais barato, melhor
        const priceScore = Math.max(0, 10 - (repairCost / 200)); // R$2000+ = 0
        priceSum += priceScore * weight;

        softSum += 7 * weight; // Assume score médio para software
    }

    const documentation = docSum / weightSum;
    const disassembly = disSum / weightSum;
    const partsAvailability = partsSum / weightSum;
    const partsPricing = priceSum / weightSum;
    const softwareReset = softSum / weightSum;

    // Calcular score final ponderado
    const finalScore =
        documentation * SIC_RI_WEIGHTS.documentation +
        disassembly * SIC_RI_WEIGHTS.disassembly +
        partsAvailability * SIC_RI_WEIGHTS.partsAvailability +
        partsPricing * SIC_RI_WEIGHTS.partsPricing +
        softwareReset * SIC_RI_WEIGHTS.softwareReset;

    // Classificação
    let classification: RepairabilityIndexBR['classification'];
    if (finalScore >= 8) classification = 'excellent';
    else if (finalScore >= 6) classification = 'good';
    else if (finalScore >= 4) classification = 'moderate';
    else if (finalScore >= 2) classification = 'poor';
    else classification = 'unrepairable';

    return {
        documentation: Math.round(documentation * 10) / 10,
        disassembly: Math.round(disassembly * 10) / 10,
        partsAvailability: Math.round(partsAvailability * 10) / 10,
        partsPricing: Math.round(partsPricing * 10) / 10,
        softwareReset: Math.round(softwareReset * 10) / 10,
        finalScore: Math.round(finalScore * 10) / 10,
        estimatedRepairCostBRL: totalRepairCost,
        classification,
    };
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

/**
 * Calcula métricas SIC para um produto
 * 
 * @param productId - ID do produto (slug)
 * @param environment - Ambiente do usuário (opcional)
 * @returns Resultado do cálculo SIC ou null se produto não mapeado
 */
export function calculateSIC(
    productId: string,
    environment: UserEnvironment = DEFAULT_ENVIRONMENT
): SICCalculationResult | null {
    // Buscar mapeamento do produto
    const mapping = getProductMapping(productId);

    // DEBUG: Log para diagnóstico
    console.log(`[SIC DEBUG] productId: ${productId}`);
    console.log(`[SIC DEBUG] mapping found: ${!!mapping}`);

    if (!mapping) {
        console.log(`[SIC DEBUG] No mapping for ${productId}`);
        return null; // Produto não mapeado
    }

    // Obter quality factors do produto
    const qualityFactors = getProductQualityFactors(productId);
    const { brandFactor, techFactor, combined: qualityMultiplier } = calculateQualityMultiplier(productId);

    // Resolver componentes
    const resolvedComponents: Array<{
        component: ComponentDefinition;
        instance: ComponentInstance;
    }> = [];

    for (const instance of mapping.components) {
        const component = getComponentById(instance.componentId);
        console.log(`[SIC DEBUG] Resolving component ${instance.componentId}: ${component ? 'FOUND' : 'NOT FOUND'}`);
        if (component) {
            resolvedComponents.push({ component, instance });
        }
    }

    if (resolvedComponents.length === 0) {
        console.log(`[SIC DEBUG] No components resolved for ${productId}`);
        return null;
    }

    console.log(`[SIC DEBUG] Resolved ${resolvedComponents.length} components for ${productId}`);

    // Calcular vida útil de cada componente
    const componentBreakdown = resolvedComponents.map(({ component, instance }) => {
        const estimatedLifeYears = calculateComponentLifespan(component, environment);
        const failureProbability5Years = calculateFailureProbability(component, 5, environment);
        const repairCostBRL = calculateRepairCost(component);

        return {
            componentId: component.id,
            componentName: component.name,
            estimatedLifeYears,
            failureProbability5Years,
            repairCostBRL,
            criticality: instance.criticality,
        };
    });

    // Encontrar componente limitante (menor vida útil entre fatais/high)
    const criticalBreakdown = componentBreakdown.filter(
        c => c.criticality === 'fatal' || c.criticality === 'high'
    );

    const limitingComponent = criticalBreakdown.reduce(
        (min, curr) => (curr.estimatedLifeYears < min.estimatedLifeYears ? curr : min),
        criticalBreakdown[0]
    );

    // Vida útil do produto = vida do componente limitante × Quality Multiplier
    // VUE = VUE_Base × πMarca × πTech × πAmbiente (ambiente já aplicado no calculateComponentLifespan)
    const baseLifespan = limitingComponent.estimatedLifeYears;
    const estimatedLifespanYears = Math.round(baseLifespan * qualityMultiplier * 100) / 100;

    // Probabilidade de falha em 5 anos (sistema em série)
    // P(falha sistema) = 1 - ∏(1 - P(falha componente))
    let survivalProbability = 1;
    for (const c of criticalBreakdown) {
        survivalProbability *= (1 - c.failureProbability5Years);
    }
    const failureProbability5Years = 1 - survivalProbability;

    // Custo de manutenção esperado em 5 anos
    const expectedMaintenanceCost5Years = criticalBreakdown.reduce(
        (sum, c) => sum + (c.failureProbability5Years * c.repairCostBRL),
        0
    );

    // Índice de reparabilidade
    const repairabilityIndex = calculateRepairabilityIndex(resolvedComponents);

    // Confiança no cálculo
    const calculationConfidence = mapping.mappingConfidence * 0.8 + 0.2;

    // Warnings para diagnóstico
    const warnings: string[] = [];
    if (!qualityFactors) {
        warnings.push('Product has no explicit quality factors; using defaults (1.0)');
    }
    if (qualityMultiplier < 0.8) {
        warnings.push(`Low quality multiplier (${qualityMultiplier.toFixed(2)}) indicates budget components`);
    }
    if (qualityMultiplier > 1.1) {
        warnings.push(`High quality multiplier (${qualityMultiplier.toFixed(2)}) indicates premium components`);
    }

    return {
        estimatedLifespanYears,
        limitingComponent: {
            id: limitingComponent.componentId,
            name: limitingComponent.componentName,
            estimatedLifeYears: limitingComponent.estimatedLifeYears,
            criticality: limitingComponent.criticality,
        },
        failureProbability5Years: Math.round(failureProbability5Years * 1000) / 1000,
        expectedMaintenanceCost5Years: Math.round(expectedMaintenanceCost5Years),
        repairabilityIndex,
        componentBreakdown,
        // Include quality factor breakdown for transparency
        qualityFactors: {
            brandFactor,
            techFactor,
            combinedMultiplier: qualityMultiplier,
            brandTier: qualityFactors?.brandTier,
            displayTechnology: qualityFactors?.displayTechnology,
            compressorTechnology: qualityFactors?.compressorTechnology,
        },
        warnings: warnings.length > 0 ? warnings : undefined,
        calculationConfidence,
    };
}

/**
 * Verifica se um produto tem mapeamento de componentes
 */
export function hasComponentMapping(productId: string): boolean {
    const mapping = getProductMapping(productId);
    console.log(`[SIC hasMapping] ${productId} => ${!!mapping}`);
    return mapping !== undefined;
}

// ============================================
// CONVERSÃO PARA EXPANDED SHADOW METRICS
// ============================================

import type {
    ExpandedShadowMetrics,
    TCOBreakdown,
    LifespanExplanation,
    RepairabilityMap,
    RepairabilityComponent,
    ComponentStatus,
    PartsAvailability,
} from './types';

import { BRAZIL_AVG_ELECTRICITY_TARIFF } from './types';

/**
 * Converte SICCalculationResult para ExpandedShadowMetrics
 * 
 * @description Gera todos os breakdowns detalhados para exibição no OwnershipInsightsExpanded
 * 
 * @param productId - ID do produto
 * @param purchasePrice - Preço de compra em R$
 * @param monthlyEnergyKwh - Consumo mensal em kWh (opcional)
 * @param categoryAverageYears - Vida útil média da categoria (padrão: 8)
 * @param environment - Ambiente do usuário (opcional)
 * @returns ExpandedShadowMetrics para uso no componente
 */
export function getExpandedMetricsFromSIC(
    productId: string,
    purchasePrice: number,
    monthlyEnergyKwh: number = 10,
    categoryAverageYears: number = 8,
    environment: UserEnvironment = DEFAULT_ENVIRONMENT
): ExpandedShadowMetrics | null {
    console.log(`[getExpandedMetricsFromSIC] Called for: ${productId}`);

    const sicResult = calculateSIC(productId, environment);

    console.log(`[getExpandedMetricsFromSIC] sicResult: ${sicResult ? 'OK' : 'NULL'}`);

    if (!sicResult) {
        console.log(`[getExpandedMetricsFromSIC] Returning null - no SIC result`);
        return null;
    }

    console.log(`[getExpandedMetricsFromSIC] Proceeding with calculation...`);

    const years = 5;
    const tariff = BRAZIL_AVG_ELECTRICITY_TARIFF;

    // ========================================
    // TCO BREAKDOWN
    // ========================================
    const monthlyEnergy = monthlyEnergyKwh * tariff;
    const totalEnergyCost = monthlyEnergy * 12 * years;
    const maintenanceCost = sicResult.expectedMaintenanceCost5Years;
    const depreciationRate = 0.15;
    const resaleValue = purchasePrice * Math.pow(1 - depreciationRate, years);

    const totalTCO = purchasePrice + totalEnergyCost + maintenanceCost - resaleValue;

    const tcoBreakdown: TCOBreakdown = {
        capex: purchasePrice,
        energyCost: Math.round(totalEnergyCost),
        energyDetails: {
            monthlyKwh: monthlyEnergyKwh,
            tariffPerKwh: tariff,
            monthlyAmount: Math.round(monthlyEnergy * 100) / 100,
            totalMonths: 12 * years,
        },
        maintenanceCost: Math.round(maintenanceCost),
        maintenanceDetails: {
            annualFailureProbability: sicResult.failureProbability5Years / years,
            avgRepairCost: sicResult.repairabilityIndex.estimatedRepairCostBRL / (sicResult.componentBreakdown.length || 1),
            yearsProjected: years,
        },
        resaleValue: Math.round(resaleValue),
        depreciationRate,
    };

    // ========================================
    // LIFESPAN EXPLANATION
    // ========================================
    const dailyUsage = environment.dailyUsageHours ?? 4;
    const annualUsage = dailyUsage * 365;

    // Find limiting component details
    const limitingCompDef = getComponentById(sicResult.limitingComponent.id);

    const percentageVsAverage = ((sicResult.estimatedLifespanYears / categoryAverageYears) - 1) * 100;

    const lifespanExplanation: LifespanExplanation = {
        years: sicResult.estimatedLifespanYears,
        categoryAverageYears,
        percentageVsAverage: Math.round(percentageVsAverage),
        limitingComponent: {
            name: sicResult.limitingComponent.name,
            category: limitingCompDef?.category ?? 'general',
            l10Hours: limitingCompDef?.reliability.l10LifeHours ?? 60000,
            failureModes: limitingCompDef?.failureModes ?? ['Desgaste normal'],
        },
        usageAssumptions: {
            dailyHours: Math.round(dailyUsage * 10) / 10,
            annualHours: Math.round(annualUsage),
            source: environment.dailyUsageHours ? 'user_input' : 'category_default',
        },
        qualityMultipliers: {
            brand: {
                name: sicResult.qualityFactors?.brandTier ?? 'Premium',
                factor: sicResult.qualityFactors?.brandFactor ?? 1.0
            },
            technology: {
                name: sicResult.qualityFactors?.displayTechnology ??
                    sicResult.qualityFactors?.compressorTechnology ??
                    'Padrão',
                factor: sicResult.qualityFactors?.techFactor ?? 1.0
            },
        },
        calculationBreakdown: {
            baseLifeYears: sicResult.limitingComponent.estimatedLifeYears,
            afterBrandMultiplier: Math.round(sicResult.limitingComponent.estimatedLifeYears * (sicResult.qualityFactors?.brandFactor ?? 1) * 10) / 10,
            afterTechMultiplier: sicResult.estimatedLifespanYears,
            finalEstimate: sicResult.estimatedLifespanYears,
        },
    };

    // ========================================
    // REPAIRABILITY MAP
    // ========================================
    const getComponentStatus = (score: number): ComponentStatus => {
        if (score >= 7) return 'repairable';
        if (score >= 4) return 'moderate';
        return 'critical';
    };

    const mapPartsAvailability = (availability: string): PartsAvailability => {
        switch (availability) {
            case 'good':
            case 'excellent':
                return 'good';
            case 'limited':
                return 'limited';
            case 'scarce':
                return 'scarce';
            case 'discontinued':
                return 'discontinued';
            default:
                return 'limited';
        }
    };

    const getRecommendation = (score: number, repairCost: number): string => {
        const ratio = repairCost / purchasePrice;
        if (score < 3 || ratio > 0.5) {
            return 'Se esse componente falhar, o custo do reparo pode ser alto — depende da região e assistência';
        }
        if (score >= 7 && ratio < 0.2) {
            return 'Conserto viável e econômico';
        }
        return 'Reparo possível, avaliar custo-benefício';
    };

    const repairabilityComponents: RepairabilityComponent[] = sicResult.componentBreakdown.map((comp) => {
        const compDef = getComponentById(comp.componentId);
        const repairScore = compDef?.repairability.repairabilityScore ?? 5;

        return {
            name: comp.componentName,
            id: comp.componentId,
            category: compDef?.category ?? 'general',
            score: repairScore,
            status: getComponentStatus(repairScore),
            repairCost: comp.repairCostBRL,
            partsAvailability: mapPartsAvailability(compDef?.repairability.partsAvailability ?? 'limited'),
            symptoms: compDef?.failureSymptoms ?? ['Falha não especificada'],
            recommendation: getRecommendation(repairScore, comp.repairCostBRL),
            isLimitingComponent: comp.componentId === sicResult.limitingComponent.id,
            diyFriendly: compDef?.repairability.diyFriendly ?? false,
        };
    });

    // Sort by score (worst first for visibility)
    repairabilityComponents.sort((a, b) => a.score - b.score);

    const getRepairabilityLabel = (classification: string): 'Fácil Reparo' | 'Reparo Moderado' | 'Risco de Descarte' => {
        switch (classification) {
            case 'excellent':
            case 'good':
                return 'Fácil Reparo';
            case 'moderate':
                return 'Reparo Moderado';
            default:
                return 'Risco de Descarte';
        }
    };

    // Category average repairability by category
    const getCategoryAverageRepairability = (productId: string): number => {
        // TVs typically score low (3.5-4.0), ACs better (4.5-5.0), etc.
        const categoryAverages: Record<string, number> = {
            'tv': 3.8,
            'smart-tv': 3.8,
            'geladeira': 5.2,
            'ar-condicionado': 4.5,
            'lavadora': 5.0,
            'lava-e-seca': 4.2,
            'robot-vacuum': 6.5, // Robôs têm peças disponíveis e DIY friendly
        };
        // Detect category from productId
        if (productId.includes('samsung-qn') || productId.includes('lg-c') || productId.includes('lg-oled')) {
            return categoryAverages['tv'];
        }
        if (productId.includes('electrolux-if') || productId.includes('consul-cr') || productId.includes('brastemp')) {
            return categoryAverages['geladeira'];
        }
        if (productId.includes('split') || productId.includes('inverter')) {
            return categoryAverages['ar-condicionado'];
        }
        if (productId.includes('robot') || productId.includes('wap') || productId.includes('robo')) {
            return categoryAverages['robot-vacuum'];
        }
        return 4.0; // Default
    };

    const repairabilityMap: RepairabilityMap = {
        overallScore: sicResult.repairabilityIndex.finalScore,
        label: getRepairabilityLabel(sicResult.repairabilityIndex.classification),
        categoryAverage: getCategoryAverageRepairability(productId),
        components: repairabilityComponents,
        summary: {
            totalComponents: repairabilityComponents.length,
            repairableCount: repairabilityComponents.filter(c => c.status === 'repairable').length,
            criticalCount: repairabilityComponents.filter(c => c.status === 'critical').length,
            avgRepairCost: repairabilityComponents.length > 0
                ? Math.round(repairabilityComponents.reduce((sum, c) => sum + c.repairCost, 0) / repairabilityComponents.length)
                : 0,
        },
    };

    // ========================================
    // RETURN EXPANDED METRICS
    // ========================================
    const result = {
        estimatedLifespanYears: sicResult.estimatedLifespanYears,
        totalCostOfOwnership5Years: Math.round(totalTCO),
        maintenanceRiskScore: sicResult.repairabilityIndex.finalScore,
        monthlyCostBreakdown: {
            energy: Math.round(monthlyEnergy * 100) / 100,
            consumables: 0,
            maintenanceReserve: Math.round((maintenanceCost / 60) * 100) / 100,
        },
        computedConfidence: sicResult.calculationConfidence,
        computationWarnings: sicResult.warnings,
        tcoBreakdown,
        lifespanExplanation,
        repairabilityMap,
    };

    console.log(`[getExpandedMetricsFromSIC] SUCCESS - returning metrics for ${productId}`);
    return result;
}

