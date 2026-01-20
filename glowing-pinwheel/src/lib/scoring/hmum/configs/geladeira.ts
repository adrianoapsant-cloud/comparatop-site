/**
 * @file geladeira.ts
 * @description HMUM Configuration for Refrigerators
 * 
 * Based on Deep Research analysis:
 * - Energy efficiency is crucial for operating costs
 * - Noise is important for open kitchens
 * - Technology (Frost Free, Inverter) affects long-term satisfaction
 * - INMETRO classification B or below is deal-breaker
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const GELADEIRA_CONFIG: CategoryHMUMConfig = {
    categoryId: 'geladeira',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // ENERGY EFFICIENCY (25%)
        // ----------------------------------------
        {
            id: 'eficiencia',
            label: 'Eficiência Energética',
            dataField: 'specs.selo_procel',
            weightSubjective: 0.25,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 4.0,  // Below B classification
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'A+++': 10.0,
                    'A++': 9.5,
                    'A+': 9.0,
                    'A': 8.0,
                    'B': 6.0,
                    'C': 4.0,
                    'D': 2.0,
                    'E': 1.0,
                },
            },
        },

        // ----------------------------------------
        // CAPACITY (20%)
        // ----------------------------------------
        {
            id: 'capacidade',
            label: 'Capacidade',
            dataField: 'specs.capacidade_litros',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 300,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.008,
                    x0: 400,  // Midpoint at 400L
                },
            },
        },

        // ----------------------------------------
        // NOISE (15%)
        // ----------------------------------------
        {
            id: 'ruido',
            label: 'Nível de Ruído',
            dataField: 'specs.ruido_db',
            weightSubjective: 0.15,
            direction: 'minimize',
            missingStrategy: 'impute_penalty',
            imputeValue: 45,
            vetoThreshold: 50,  // Above 50dB is deal-breaker
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.3,
                    x0: 40,
                },
            },
        },

        // ----------------------------------------
        // TECHNOLOGY (15%)
        // ----------------------------------------
        {
            id: 'tecnologia',
            label: 'Tecnologia',
            dataField: 'specs.tecnologia_compressor',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Inverter': 10.0,
                    'Linear Inverter': 7.0,  // Known issues with LG
                    'Frost Free': 8.0,
                    'Cycle Defrost': 5.0,
                    'Manual': 3.0,
                },
            },
        },

        // ----------------------------------------
        // BUILD QUALITY (10%)
        // ----------------------------------------
        {
            id: 'construcao',
            label: 'Qualidade de Construção',
            dataField: 'scores.c7',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 6.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // FEATURES (10%)
        // ----------------------------------------
        {
            id: 'recursos',
            label: 'Recursos Adicionais',
            dataField: 'scores.c8',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // VALUE FOR MONEY (5%)
        // ----------------------------------------
        {
            id: 'custo_beneficio',
            label: 'Custo-Benefício',
            dataField: 'scores.c10',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
    ],
};

export default GELADEIRA_CONFIG;
