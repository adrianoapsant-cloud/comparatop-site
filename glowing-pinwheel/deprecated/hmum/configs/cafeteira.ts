/**
 * @file cafeteira.ts
 * @description HMUM Configuration for Coffee Makers
 * 
 * Based on Deep Research analysis:
 * - Water temperature is THE critical factor (94°C ideal)
 * - Pressure matters for espresso extraction
 * - Ease of cleaning affects long-term satisfaction
 * - Build quality affects durability
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const CAFETEIRA_CONFIG: CategoryHMUMConfig = {
    categoryId: 'cafeteira',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // TEMPERATURE (30%)
        // Gaussian-like scoring with ideal at 94°C
        // ----------------------------------------
        {
            id: 'temperatura',
            label: 'Temperatura da Água',
            dataField: 'specs.temp_agua_c',
            weightSubjective: 0.30,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 88,  // Most cheap ones underperform
            vetoThreshold: 85,  // Below 85°C makes bad coffee
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.5,
                    x0: 92,  // Ideal around 92-96°C
                },
            },
        },

        // ----------------------------------------
        // PRESSURE (25% - for espresso only)
        // ----------------------------------------
        {
            id: 'pressao',
            label: 'Pressão',
            dataField: 'specs.pressao_bar',
            weightSubjective: 0.25,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',  // Not applicable for drip
            vetoThreshold: 9,  // Below 9 bar = bad crema
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.8,
                    x0: 15,  // 15 bar is good, 19 is overkill
                },
            },
        },

        // ----------------------------------------
        // EASE OF USE (20%)
        // ----------------------------------------
        {
            id: 'facilidade_uso',
            label: 'Facilidade de Uso',
            dataField: 'scores.c3',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 6.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // CLEANING (15%)
        // ----------------------------------------
        {
            id: 'limpeza',
            label: 'Facilidade de Limpeza',
            dataField: 'specs.limpeza',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Automática': 10.0,
                    'Removíveis Lava-louça': 8.0,
                    'Removíveis Manual': 6.0,
                    'Parcial': 4.0,
                    'Difícil': 2.0,
                },
            },
        },

        // ----------------------------------------
        // VALUE FOR MONEY (10%)
        // ----------------------------------------
        {
            id: 'custo_beneficio',
            label: 'Custo-Benefício',
            dataField: 'scores.c10',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
    ],
};

export default CAFETEIRA_CONFIG;
