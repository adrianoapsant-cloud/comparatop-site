/**
 * @file smartphone.ts
 * @description HMUM Configuration for Smartphones
 * 
 * Based on market analysis:
 * - Camera quality is primary purchase driver
 * - Battery life critical for daily use
 * - Performance affects app experience
 * - Update policy affects longevity
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const SMARTPHONE_CONFIG: CategoryHMUMConfig = {
    categoryId: 'smartphone',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // CAMERA (25%)
        // ----------------------------------------
        {
            id: 'camera',
            label: 'Qualidade da Câmera',
            dataField: 'scores.c2',
            weightSubjective: 0.25,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // PERFORMANCE (20%)
        // ----------------------------------------
        {
            id: 'performance',
            label: 'Desempenho',
            dataField: 'scores.c1',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // BATTERY (20%)
        // ----------------------------------------
        {
            id: 'bateria',
            label: 'Bateria',
            dataField: 'specs.bateria_mah',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 4000,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.002,
                    x0: 4500,
                },
            },
        },

        // ----------------------------------------
        // DISPLAY (15%)
        // ----------------------------------------
        {
            id: 'tela',
            label: 'Qualidade da Tela',
            dataField: 'specs.tela_tipo',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 6.0,
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'LTPO AMOLED 120Hz': 10.0,
                    'AMOLED 120Hz': 9.0,
                    'AMOLED 90Hz': 8.0,
                    'AMOLED 60Hz': 7.0,
                    'IPS 120Hz': 6.5,
                    'IPS 90Hz': 5.5,
                    'IPS 60Hz': 5.0,
                    'TFT': 3.0,
                },
            },
        },

        // ----------------------------------------
        // UPDATE POLICY (10%)
        // ----------------------------------------
        {
            id: 'atualizacoes',
            label: 'Política de Atualizações',
            dataField: 'specs.anos_atualizacao',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 2,
            vetoThreshold: 2,  // Less than 2 years is deal-breaker
            normalization: {
                method: 'linear',
                linearRange: { min: 2, max: 7 },
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

export default SMARTPHONE_CONFIG;
