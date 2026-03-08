/**
 * =============================================================================
 * FIPE-Eletro: Motor de Cálculo TCO (Total Cost of Ownership)
 * =============================================================================
 *
 * Implementação das fórmulas matemáticas do Relatório Técnico FIPE-Eletro.
 *
 * ## Fórmulas Implementadas:
 *
 * ### TCO Descontado (VPL):
 * ```
 * TCO = I₀ + Σ[(Cₒₚ + Cₘ + Cₓ) / (1 + r)ⁿ] - Vᵣ/(1+r)ᴺ + Cᴅ
 * ```
 *
 * ### Custo Operacional com Inflação Energética:
 * ```
 * Cₒₚ(t) = E_mensal × T_energia × (1 + π_energia)^t × 12
 * ```
 *
 * ### Depreciação Exponencial:
 * ```
 * V_fipe(t) = P_novo × (1 - δ)^t × K_estado × K_marca × K_tech
 * ```
 *
 * ### Manutenção Probabilística (Curva da Banheira):
 * ```
 * Cₘ(t) = P_falha(t) × C_reparo
 * ```
 */

import type {
    FipeEletroProduct,
    MacroeconomicContext,
    TcoBreakdown,
    FipeValuation,
    TcoCurveDataPoint,
    ProductComparison,
    FailureProbabilityPoint,
} from '@/types/fipe-eletro';

import {
    DEFAULT_MACRO_CONSTANTS,
    USAGE_PROFILES,
} from './familyDefaults';

// =============================================================================
// TIPOS INTERNOS
// =============================================================================

/**
 * Configuração de entrada para o motor TCO.
 */
export interface TcoEngineConfig {
    /** Produto a ser analisado */
    product: FipeEletroProduct;
    /** Contexto macroeconômico */
    macro: MacroeconomicContext;
    /** Horizonte de análise em anos */
    horizonYears: number;
    /** Perfil de intensidade de uso */
    usageIntensity?: 'low' | 'medium' | 'high';
}

/**
 * Resultado intermediário do cálculo Opex.
 */
interface OpexResult {
    /** Custo total de energia (PV) */
    energyCostPv: number;
    /** Custo total de água (PV) */
    waterCostPv: number;
    /** Custo total de gás (PV) */
    gasCostPv: number;
    /** Custo total de consumíveis (PV) */
    consumablesCostPv: number;
    /** Custo operacional total (PV) */
    totalOpexPv: number;
    /** Array de custos por ano (nominal) */
    yearlyBreakdown: { year: number; cost: number }[];
}

/**
 * Resultado intermediário do cálculo de manutenção.
 */
interface MaintenanceResult {
    /** Custo total esperado de manutenção (PV) */
    totalMaintenancePv: number;
    /** Probabilidade acumulada de falha */
    cumulativeFailureProbability: number;
    /** Array de custos por ano */
    yearlyBreakdown: { year: number; probability: number; expectedCost: number }[];
}

// =============================================================================
// CLASSE PRINCIPAL: TCO ENGINE
// =============================================================================

/**
 * Motor de cálculo TCO baseado nas fórmulas do Relatório Técnico FIPE-Eletro.
 *
 * Implementa matemática financeira rigorosa com fluxo de caixa descontado.
 *
 * @example
 * ```typescript
 * const engine = new TCOEngine({
 *   product: geladeiraBrastemp,
 *   macro: contextoMacro,
 *   horizonYears: 10
 * });
 *
 * const summary = engine.generateSummary();
 * console.log(`TCO Total: R$ ${summary.tco.totalTco.toFixed(2)}`);
 * console.log(`Custo Mensal Real: R$ ${summary.monthlyRealCost.toFixed(2)}`);
 * ```
 */
export class TCOEngine {
    private readonly product: FipeEletroProduct;
    private readonly macro: MacroeconomicContext;
    private readonly horizonYears: number;
    private readonly usageMultiplier: number;

    // Cache de resultados calculados
    private _opexResult: OpexResult | null = null;
    private _maintenanceResult: MaintenanceResult | null = null;
    private _resaleValue: number | null = null;

    constructor(config: TcoEngineConfig) {
        this.product = config.product;
        this.macro = config.macro;
        this.horizonYears = config.horizonYears;

        // Multiplicador de uso afeta consumo de energia/água/consumíveis
        this.usageMultiplier = this.getUsageMultiplier(config.usageIntensity ?? 'medium');
    }

    /**
     * Retorna multiplicador baseado na intensidade de uso.
     */
    private getUsageMultiplier(intensity: 'low' | 'medium' | 'high'): number {
        const multipliers = {
            low: 0.75,
            medium: 1.0,
            high: 1.35
        };
        return multipliers[intensity];
    }

    // ===========================================================================
    // 1. CÁLCULO DE OPEX (Custos Operacionais)
    // ===========================================================================

    /**
     * Calcula o Custo Operacional (Opex) descontado a Valor Presente.
     *
     * ## Fórmula de Fluxo de Caixa Descontado:
     * ```
     * Opex_PV = Σ[t=1→N] { Cₒₚ(t) / (1 + r)^t }
     * ```
     *
     * ## Custo Operacional Anual com Inflação Energética:
     * ```
     * Cₒₚ(t) = (E_mensal × T_energia × 12) × (1 + π_energia)^(t-1)
     * ```
     *
     * Onde:
     * - E_mensal: Consumo mensal em kWh (real, não nominal)
     * - T_energia: Tarifa por kWh + bandeira
     * - π_energia: Taxa de inflação energética anual
     * - r: Taxa de desconto (WACC/Selic Real)
     *
     * @param years - Número de anos para cálculo (default: horizonYears)
     * @returns Resultado detalhado do Opex
     */
    public calculateOpex(years?: number): OpexResult {
        // Usa cache se disponível
        if (this._opexResult && !years) {
            return this._opexResult;
        }

        const n = years ?? this.horizonYears;
        const opex = this.product.opex;
        const r = this.macro.discountRate;
        const energyInflation = this.macro.energyInflationRate;

        // Tarifa efetiva = tarifa base + bandeira
        const effectiveTariff = this.macro.energyTariffPerKwh + this.macro.energyFlagSurcharge;

        let energyCostPv = 0;
        let waterCostPv = 0;
        let gasCostPv = 0;
        let consumablesCostPv = 0;
        const yearlyBreakdown: { year: number; cost: number }[] = [];

        for (let t = 1; t <= n; t++) {
            // ─── Custo de Energia ───────────────────────────────────────────────
            // C_energia(t) = kWh_mensal × tarifa × 12 × (1 + π)^(t-1) × usageMultiplier
            const monthlyKwh = opex.energy.realKwhMonth * this.usageMultiplier;
            const yearlyEnergyCost =
                monthlyKwh *
                effectiveTariff *
                12 *
                Math.pow(1 + energyInflation, t - 1);

            // Desconto a valor presente: C / (1 + r)^t
            const discountFactor = Math.pow(1 + r, t);
            energyCostPv += yearlyEnergyCost / discountFactor;

            // ─── Custo de Água (se aplicável) ───────────────────────────────────
            let yearlyWaterCost = 0;
            if (opex.water) {
                const monthlyLiters = opex.water.litersPerCycle * opex.water.cyclesPerMonth * this.usageMultiplier;
                const monthlyCubicMeters = monthlyLiters / 1000;
                yearlyWaterCost = monthlyCubicMeters * opex.water.waterTariffPerCubicMeter * 12;
                // Água também sofre inflação (simplificado: mesma taxa)
                yearlyWaterCost *= Math.pow(1 + energyInflation * 0.8, t - 1);
                waterCostPv += yearlyWaterCost / discountFactor;
            }

            // ─── Custo de Gás (se aplicável) ────────────────────────────────────
            let yearlyGasCost = 0;
            if (opex.gas) {
                yearlyGasCost = opex.gas.monthlyConsumption * opex.gas.currentGasPrice * 12;
                // Gás correlacionado com câmbio e petróleo
                yearlyGasCost *= Math.pow(1 + energyInflation * 1.2, t - 1);
                gasCostPv += yearlyGasCost / discountFactor;
            }

            // ─── Custo de Consumíveis ───────────────────────────────────────────
            let yearlyConsumablesCost = 0;
            for (const consumable of opex.consumables) {
                let replacementsPerYear = 0;

                // Prioriza frequência em meses
                if (consumable.replacementFrequencyMonths > 0) {
                    replacementsPerYear = 12 / consumable.replacementFrequencyMonths;
                }
                // Fallback: conversão de ciclos para meses (Item 4)
                else if (consumable.replacementFrequencyCycles && consumable.replacementFrequencyCycles > 0) {
                    // Usa perfil família-pequena como referência
                    const profile = USAGE_PROFILES['familia-pequena'];
                    // Infere ciclos por mês baseado no tipo de consumível
                    let cyclesPerMonth = 20; // Default: lavações
                    if (consumable.type === 'filtro-agua') {
                        // Para filtros de água, ciclos = litros
                        cyclesPerMonth = profile.filteredWaterLitersPerMonth;
                    } else if (consumable.type === 'escova-lateral' || consumable.type === 'escova-central' || consumable.type === 'filtro-ar-hepa') {
                        cyclesPerMonth = profile.robotCyclesPerMonth;
                    }
                    const monthsPerReplacement = consumable.replacementFrequencyCycles / cyclesPerMonth;
                    replacementsPerYear = 12 / monthsPerReplacement;
                }

                yearlyConsumablesCost += consumable.unitPrice * replacementsPerYear;
            }
            yearlyConsumablesCost *= this.usageMultiplier;
            // Item 6: Inflação de consumíveis diferenciada (geralmente > IPCA)
            const consumablesInflation = DEFAULT_MACRO_CONSTANTS.consumablesInflationRate;
            yearlyConsumablesCost *= Math.pow(1 + consumablesInflation, t - 1);
            consumablesCostPv += yearlyConsumablesCost / discountFactor;

            // ─── Total do Ano ───────────────────────────────────────────────────
            const yearTotal = yearlyEnergyCost + yearlyWaterCost + yearlyGasCost + yearlyConsumablesCost;
            yearlyBreakdown.push({ year: t, cost: yearTotal });
        }

        const result: OpexResult = {
            energyCostPv,
            waterCostPv,
            gasCostPv,
            consumablesCostPv,
            totalOpexPv: energyCostPv + waterCostPv + gasCostPv + consumablesCostPv,
            yearlyBreakdown
        };

        // Cache para reutilização
        if (!years) {
            this._opexResult = result;
        }

        return result;
    }

    // ===========================================================================
    // 2. CÁLCULO DE MANUTENÇÃO (Curva da Banheira)
    // ===========================================================================

    /**
     * Calcula o Custo de Manutenção esperado usando a Curva da Banheira.
     *
     * ## Modelo Probabilístico:
     * ```
     * Cₘ(t) = P_falha(t) × C_reparo_total
     * ```
     *
     * ## Curva da Banheira Simplificada:
     * - Anos 1-2 (garantia): P_falha ≈ 0.02 (defeitos de fabricação cobertos)
     * - Anos 3-5 (estabilidade): P_falha ≈ 0.05-0.08
     * - Anos 6+ (desgaste): P_falha cresce exponencialmente
     *
     * ## Valor Presente do Custo Esperado:
     * ```
     * Manutenção_PV = Σ[t=1→N] { P_falha(t) × C_reparo / (1 + r)^t }
     * ```
     *
     * @param years - Número de anos para cálculo
     * @returns Resultado detalhado da manutenção
     */
    public calculateMaintenanceCurve(years?: number): MaintenanceResult {
        if (this._maintenanceResult && !years) {
            return this._maintenanceResult;
        }

        const n = years ?? this.horizonYears;
        const maintenance = this.product.maintenance;
        const r = this.macro.discountRate;

        // Custo de reparo ajustado regionalmente
        const repairCost =
            maintenance.repairCost.totalRepairCost *
            (maintenance.regionalLaborMultiplier ?? 1.0);

        let totalMaintenancePv = 0;
        let cumulativeFailureProbability = 0;
        const yearlyBreakdown: { year: number; probability: number; expectedCost: number }[] = [];

        for (let t = 1; t <= n; t++) {
            // Obtém probabilidade de falha para o ano t
            const pFalha = this.getFailureProbability(t, maintenance.failureCurve);

            // Custo esperado = P(falha) × Custo de reparo
            // Nota: Custo de reparo também sofre inflação (peças + mão de obra)
            const inflatedRepairCost = repairCost * Math.pow(1 + this.macro.ipcaRate, t - 1);
            const expectedCost = pFalha * inflatedRepairCost;

            // Desconto a valor presente
            const discountFactor = Math.pow(1 + r, t);
            totalMaintenancePv += expectedCost / discountFactor;

            // Probabilidade acumulada (para relatório)
            cumulativeFailureProbability = 1 - (1 - cumulativeFailureProbability) * (1 - pFalha);

            yearlyBreakdown.push({
                year: t,
                probability: pFalha,
                expectedCost
            });
        }

        const result: MaintenanceResult = {
            totalMaintenancePv,
            cumulativeFailureProbability,
            yearlyBreakdown
        };

        if (!years) {
            this._maintenanceResult = result;
        }

        return result;
    }

    /**
     * Interpola a probabilidade de falha para um ano específico.
     *
     * Se o ano não está na curva, faz interpolação linear ou
     * aplica modelo de crescimento exponencial para anos além do último ponto.
     */
    private getFailureProbability(
        year: number,
        curve: FailureProbabilityPoint[]
    ): number {
        if (curve.length === 0) {
            // Curva padrão simplificada (Curva da Banheira)
            return this.defaultBathtubCurve(year);
        }

        // Ordena a curva por ano
        const sortedCurve = [...curve].sort((a, b) => a.year - b.year);

        // Caso exato
        const exactPoint = sortedCurve.find(p => p.year === year);
        if (exactPoint) {
            return exactPoint.probability;
        }

        // Antes do primeiro ponto
        if (year < sortedCurve[0].year) {
            return sortedCurve[0].probability;
        }

        // Depois do último ponto: crescimento exponencial
        const lastPoint = sortedCurve[sortedCurve.length - 1];
        if (year > lastPoint.year) {
            // P(t) = P_last × e^(0.1 × (t - t_last))
            // Limitado a 0.5 (50% máximo por ano)
            const extraYears = year - lastPoint.year;
            const projected = lastPoint.probability * Math.exp(0.1 * extraYears);
            return Math.min(projected, 0.5);
        }

        // Interpolação linear entre dois pontos
        for (let i = 0; i < sortedCurve.length - 1; i++) {
            const p1 = sortedCurve[i];
            const p2 = sortedCurve[i + 1];

            if (year > p1.year && year < p2.year) {
                const ratio = (year - p1.year) / (p2.year - p1.year);
                return p1.probability + ratio * (p2.probability - p1.probability);
            }
        }

        return 0.05; // Fallback
    }

    /**
     * Curva da Banheira padrão quando não há dados específicos.
     *
     * Modelo clássico:
     * - Mortalidade infantil (ano 1): 3%
     * - Vida útil estável (anos 2-5): 5%
     * - Desgaste crescente (anos 6+): exponencial
     */
    private defaultBathtubCurve(year: number): number {
        if (year <= 1) return 0.03;       // Garantia cobre
        if (year <= 2) return 0.04;
        if (year <= 5) return 0.05;
        if (year <= 7) return 0.08;
        if (year <= 10) return 0.12;

        // Anos 10+: crescimento exponencial
        return Math.min(0.12 * Math.exp(0.15 * (year - 10)), 0.4);
    }

    // ===========================================================================
    // 3. CÁLCULO DE VALOR DE REVENDA (Depreciação Exponencial)
    // ===========================================================================

    /**
     * Calcula o Valor de Revenda (Valor FIPE) usando Depreciação Exponencial.
     *
     * ## Fórmula Principal:
     * ```
     * V_fipe(t) = P_novo × (1 - δ)^t × K_estado × K_marca × K_tech
     * ```
     *
     * Onde:
     * - P_novo: Preço de referência novo atual
     * - δ (delta): Taxa de depreciação anual da categoria
     * - t: Idade em anos
     * - K_estado: Fator de condição (0.5 a 1.0)
     * - K_marca: Fator de reputação da marca (0.7 a 1.1)
     * - K_tech: Fator de obsolescência tecnológica (0.6 a 1.0)
     *
     * ## Primeiro Ano - Perda de Status de Novo:
     * Aplica depreciação adicional de 20-30% no primeiro ano.
     *
     * ## Valor Mínimo Residual:
     * O valor não pode cair abaixo de minimumResidualPercentage × P_novo.
     *
     * @param age - Idade do equipamento em anos
     * @returns Valor de revenda estimado em R$
     */
    public calculateResaleValue(age?: number): number {
        const t = age ?? this.horizonYears;
        const depreciation = this.product.depreciation;
        const priceNew = this.product.staticData.priceNew;

        // Fórmula: V = P_novo × (1 - δ)^t × K_estado × K_marca × K_tech
        let value = priceNew;

        // Aplicar depreciação exponencial
        value *= Math.pow(1 - depreciation.deltaRate, t);

        // Aplicar fatores K
        value *= depreciation.kCondition;
        value *= depreciation.kBrand;
        value *= depreciation.kTechnology;

        // Aplicar depreciação extra do primeiro ano (se idade >= 1)
        if (t >= 1) {
            value *= (1 - depreciation.firstYearDepreciationBonus);
        }

        // Aplicar piso mínimo
        const minimumValue = priceNew * depreciation.minimumResidualPercentage;
        value = Math.max(value, minimumValue);

        // Cache se for cálculo padrão
        if (age === undefined) {
            this._resaleValue = value;
        }

        return value;
    }

    /**
     * Gera avaliação FIPE completa para um produto usado.
     */
    public generateFipeValuation(age: number): FipeValuation {
        const fipeValue = this.calculateResaleValue(age);
        const priceNew = this.product.staticData.priceNew;
        const depreciation = this.product.depreciation;

        // Calcular faixa de preço (±15% para negociação)
        const variance = 0.15;

        return {
            fipeValue,
            newReferencePrice: priceNew,
            depreciationPercentage: ((priceNew - fipeValue) / priceNew) * 100,
            ageYears: age,
            appliedFactors: {
                kCondition: depreciation.kCondition,
                kBrand: depreciation.kBrand,
                kTechnology: depreciation.kTechnology
            },
            qualityScore: this.conditionToScore(depreciation.kCondition),
            priceRange: {
                minimum: fipeValue * (1 - variance),
                suggested: fipeValue,
                maximum: fipeValue * (1 + variance)
            },
            isEconomicallyViable: this.checkEconomicViability(age),
            valuationDate: new Date().toISOString()
        };
    }

    /**
     * Converte K_condition para score 0-100.
     */
    private conditionToScore(kCondition: number): number {
        // K_condition: 0.5 (ruim) → 1.0 (excelente)
        // Score: 0 → 100
        return Math.round(((kCondition - 0.5) / 0.5) * 100);
    }

    /**
     * Verifica se o produto ainda é economicamente viável.
     *
     * Critério: Custo de reparo esperado < valor residual × threshold
     */
    private checkEconomicViability(age: number): boolean {
        const maintenance = this.product.maintenance;
        const residualValue = this.calculateResaleValue(age);
        const expectedRepairCost =
            this.getFailureProbability(age, maintenance.failureCurve) *
            maintenance.repairCost.totalRepairCost;

        return expectedRepairCost < residualValue * maintenance.economicRepairThreshold;
    }

    // ===========================================================================
    // 4. GERAÇÃO DE SUMÁRIO FINAL
    // ===========================================================================

    /**
     * Gera o sumário completo do TCO para o frontend.
     *
     * ## Fórmula TCO Total:
     * ```
     * TCO = I₀ + Opex_PV + Manutenção_PV - Vᵣ_PV + Cᴅ
     * ```
     *
     * Retorna:
     * - Breakdown detalhado de custos
     * - Custo Real Mensal (TCO / meses)
     * - Dados para gráfico de curva TCO
     * - Comparação com categoria média (se disponível)
     */
    public generateSummary(): {
        tco: TcoBreakdown;
        monthlyRealCost: number;
        yearlyRealCost: number;
        curve: TcoCurveDataPoint[];
        insights: {
            biggestCostDriver: string;
            breakEvenVsSticker: number | null;
            recommendation: string;
        };
    } {
        // ─── Calcular componentes ─────────────────────────────────────────────
        const opex = this.calculateOpex();
        const maintenance = this.calculateMaintenanceCurve();
        const residualValue = this.calculateResaleValue();

        // Investimento inicial
        const staticData = this.product.staticData;
        const initialInvestment =
            staticData.priceNew +
            staticData.installationCost +
            staticData.shippingCost;

        // Valor residual descontado a valor presente
        const r = this.macro.discountRate;
        const residualValuePv = residualValue / Math.pow(1 + r, this.horizonYears);

        // Custo de descarte (simplificado: 2% do valor novo para linha branca)
        const disposalCost = staticData.priceNew * 0.02;

        // ─── TCO Total ────────────────────────────────────────────────────────
        const totalTco =
            initialInvestment +
            opex.totalOpexPv +
            maintenance.totalMaintenancePv -
            residualValuePv +
            disposalCost;

        const totalMonths = this.horizonYears * 12;

        const tcoBreakdown: TcoBreakdown = {
            initialInvestment,
            operationalCostPv: opex.totalOpexPv,
            maintenanceCostPv: maintenance.totalMaintenancePv,
            consumablesCostPv: opex.consumablesCostPv,
            residualValuePv,
            disposalCost,
            totalTco,
            monthlyTcoAverage: totalTco / totalMonths
        };

        // ─── Gerar curva para gráfico ─────────────────────────────────────────
        const curve = this.generateTcoCurve();

        // ─── Insights ─────────────────────────────────────────────────────────
        const biggestCostDriver = this.identifyBiggestCostDriver(tcoBreakdown);
        const breakEvenVsSticker = this.calculateBreakEvenVsSticker(tcoBreakdown);

        return {
            tco: tcoBreakdown,
            monthlyRealCost: totalTco / totalMonths,
            yearlyRealCost: totalTco / this.horizonYears,
            curve,
            insights: {
                biggestCostDriver,
                breakEvenVsSticker,
                recommendation: this.generateRecommendation(tcoBreakdown)
            }
        };
    }

    /**
     * Gera dados para gráfico de curva TCO acumulado.
     */
    private generateTcoCurve(): TcoCurveDataPoint[] {
        const points: TcoCurveDataPoint[] = [];
        const staticData = this.product.staticData;
        const initialInvestment =
            staticData.priceNew +
            staticData.installationCost +
            staticData.shippingCost;

        let cumulativeTco = initialInvestment;

        for (let year = 1; year <= this.horizonYears; year++) {
            const opex = this.calculateOpex(year);
            const maintenance = this.calculateMaintenanceCurve(year);
            const residual = this.calculateResaleValue(year);

            const yearlyOperationalCost =
                opex.yearlyBreakdown.find(y => y.year === year)?.cost ?? 0;

            const yearlyMaintenanceCost =
                maintenance.yearlyBreakdown.find(y => y.year === year)?.expectedCost ?? 0;

            cumulativeTco = initialInvestment + opex.totalOpexPv + maintenance.totalMaintenancePv;

            points.push({
                year,
                cumulativeTco,
                yearlyOperationalCost,
                yearlyMaintenanceCost,
                residualValue: residual
            });
        }

        return points;
    }

    /**
     * Identifica o maior driver de custo.
     */
    private identifyBiggestCostDriver(tco: TcoBreakdown): string {
        const drivers = [
            { name: 'investimento-inicial', value: tco.initialInvestment },
            { name: 'energia', value: tco.operationalCostPv - tco.consumablesCostPv },
            { name: 'manutencao', value: tco.maintenanceCostPv },
            { name: 'consumiveis', value: tco.consumablesCostPv }
        ];

        drivers.sort((a, b) => b.value - a.value);
        return drivers[0].name;
    }

    /**
     * Calcula o ponto de break-even onde TCO > preço de etiqueta.
     *
     * Retorna o ano onde o custo acumulado (sem considerar valor residual)
     * ultrapassa o dobro do preço de compra.
     */
    private calculateBreakEvenVsSticker(tco: TcoBreakdown): number | null {
        const stickerPrice = this.product.staticData.priceNew;
        const curve = this.generateTcoCurve();

        for (const point of curve) {
            if (point.cumulativeTco >= stickerPrice * 2) {
                return point.year;
            }
        }

        return null; // TCO não atinge 2x o preço no horizonte
    }

    /**
     * Gera recomendação baseada nos dados calculados.
     */
    private generateRecommendation(tco: TcoBreakdown): string {
        const stickerPrice = this.product.staticData.priceNew;
        const realCost = tco.totalTco;
        const opexRatio = tco.operationalCostPv / tco.totalTco;

        if (opexRatio > 0.5) {
            return `Custo operacional domina (${(opexRatio * 100).toFixed(0)}% do TCO). Priorize eficiência energética na próxima compra.`;
        }

        if (tco.maintenanceCostPv > stickerPrice * 0.3) {
            return `Alto risco de manutenção. Considere garantia estendida ou modelo com melhor reparabilidade.`;
        }

        if (realCost < stickerPrice * 1.5) {
            return `Excelente custo-benefício: TCO de ${this.horizonYears} anos é apenas ${((realCost / stickerPrice - 1) * 100).toFixed(0)}% acima do preço de compra.`;
        }

        return `TCO calculado para ${this.horizonYears} anos. Valor residual estimado recupera ${((tco.residualValuePv / stickerPrice) * 100).toFixed(0)}% do investimento.`;
    }

    // ===========================================================================
    // COMPARAÇÃO ENTRE PRODUTOS
    // ===========================================================================

    /**
     * Compara dois produtos e identifica qual tem menor TCO.
     */
    public static compare(
        engineA: TCOEngine,
        engineB: TCOEngine
    ): ProductComparison {
        const summaryA = engineA.generateSummary();
        const summaryB = engineB.generateSummary();

        const tcoA = summaryA.tco.totalTco;
        const tcoB = summaryB.tco.totalTco;

        const winner = tcoA <= tcoB ? 'A' : 'B';
        const savings = Math.abs(tcoA - tcoB);

        // Encontrar break-even (onde as curvas se cruzam)
        let breakEvenYear: number | null = null;
        const curveA = summaryA.curve;
        const curveB = summaryB.curve;

        for (let i = 0; i < curveA.length; i++) {
            const diffCurrent = curveA[i].cumulativeTco - curveB[i].cumulativeTco;
            if (i > 0) {
                const diffPrev = curveA[i - 1].cumulativeTco - curveB[i - 1].cumulativeTco;
                if ((diffCurrent >= 0 && diffPrev < 0) || (diffCurrent <= 0 && diffPrev > 0)) {
                    breakEvenYear = i;
                    break;
                }
            }
        }

        const recommendation = winner === 'A'
            ? `Produto A economiza R$ ${savings.toFixed(2)} em ${engineA.horizonYears} anos.`
            : `Produto B economiza R$ ${savings.toFixed(2)} em ${engineB.horizonYears} anos.`;

        return {
            productA: {
                id: engineA.product.staticData.fipeId,
                tco: summaryA.tco
            },
            productB: {
                id: engineB.product.staticData.fipeId,
                tco: summaryB.tco
            },
            breakEvenYear,
            totalSavings: savings,
            recommendedProduct: winner,
            recommendation
        };
    }
}

// =============================================================================
// FUNÇÕES UTILITÁRIAS EXPORTADAS
// =============================================================================

/**
 * Converte ConditionGrade para K_estado.
 */
export function conditionGradeToKFactor(
    grade: 'excelente' | 'bom' | 'regular' | 'ruim'
): number {
    const mapping = {
        excelente: 1.0,
        bom: 0.85,
        regular: 0.70,
        ruim: 0.50
    };
    return mapping[grade];
}

/**
 * Calcula taxa de depreciação (δ) a partir de dados históricos.
 *
 * Fórmula inversa: δ = 1 - (V_t / V_0)^(1/t)
 */
export function calculateDeltaRate(
    priceNew: number,
    priceUsed: number,
    ageYears: number
): number {
    if (ageYears <= 0 || priceNew <= 0) return 0;
    const ratio = priceUsed / priceNew;
    return 1 - Math.pow(ratio, 1 / ageYears);
}

/**
 * Estima o ano de break-even entre dois produtos.
 *
 * Útil para comparar: "O modelo eficiente se paga em X anos".
 */
export function estimateBreakEvenYear(
    priceCheap: number,
    priceExpensive: number,
    yearlySavings: number
): number | null {
    if (yearlySavings <= 0) return null;
    const priceDiff = priceExpensive - priceCheap;
    const breakEven = priceDiff / yearlySavings;
    return breakEven > 0 ? Math.ceil(breakEven) : null;
}

export default TCOEngine;
