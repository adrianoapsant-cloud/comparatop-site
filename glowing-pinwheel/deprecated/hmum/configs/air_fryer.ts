/**
 * @file air_fryer.ts
 * @description HMUM Configuration for Air Fryers (Fritadeiras)
 * 
 * P18 Batch 02 - Converted from "10 dores.txt"
 * Source: "Diretrizes do Algoritmo de Comparação de Air Fryers (Mercado Brasileiro)"
 * 
 * NOTE: Original TXT weights summed to 103%. Normalized proportionally to 100%.
 * Original: 20+15+15+10+10+8+8+7+5+5 = 103
 * Normalized: 19+15+15+10+10+8+8+7+5+3 = 100
 * 
 * Key focus areas:
 * - Non-stick coating integrity (rust prevention)
 * - Material safety (chemical odor)
 * - Crispiness performance
 * - Resistance cleaning access
 * 
 * Weights: 19+15+15+10+10+8+8+7+5+3 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const AIR_FRYER_CONFIG: CategoryHMUMConfig = {
    categoryId: 'air_fryer',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // C1: INTEGRIDADE DO ANTIADERENTE - 19% (normalized from 20%)
        {
            id: 'integridade_antiaderente',
            label: 'Integridade do Antiaderente',
            dataField: 'scores.c1',
            weightSubjective: 0.19,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 2.0,  // Ferrugem/descascamento é eliminatório
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C2: SEGURANÇA DE MATERIAIS (ODOR) - 15%
        {
            id: 'seguranca_materiais',
            label: 'Segurança de Materiais (Odor)',
            dataField: 'scores.c2',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 2.0,  // Cheiro de plástico persistente é eliminatório
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C3: PERFORMANCE (CROCÂNCIA) - 15%
        {
            id: 'performance_crocancia',
            label: 'Performance (Crocância)',
            dataField: 'scores.c3',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C4: HIGIENIZAÇÃO (RESISTÊNCIA) - 10%
        {
            id: 'higienizacao',
            label: 'Higienização (Resistência)',
            dataField: 'scores.c4',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C5: ROBUSTEZ ELETRÔNICA - 10%
        {
            id: 'robustez_eletronica',
            label: 'Robustez Eletrônica',
            dataField: 'scores.c5',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C6: ACÚSTICA (RUÍDO) - 8%
        {
            id: 'acustica',
            label: 'Acústica (Ruído)',
            dataField: 'scores.c6',
            weightSubjective: 0.08,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C7: EFICIÊNCIA VOLUMÉTRICA - 8%
        {
            id: 'eficiencia_volumetrica',
            label: 'Eficiência Volumétrica',
            dataField: 'scores.c7',
            weightSubjective: 0.08,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C8: USABILIDADE & IoT - 7%
        {
            id: 'usabilidade_iot',
            label: 'Usabilidade & IoT',
            dataField: 'scores.c8',
            weightSubjective: 0.07,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C9: CUSTO & SEGURANÇA ELÉTRICA - 5%
        {
            id: 'custo_seguranca_eletrica',
            label: 'Custo & Segurança Elétrica',
            dataField: 'scores.c9',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C10: PÓS-VENDA & PEÇAS - 3% (normalized from 5% to balance 103→100)
        {
            id: 'pos_venda_pecas',
            label: 'Pós-Venda & Peças',
            dataField: 'scores.c10',
            weightSubjective: 0.03,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
    ],
};

export default AIR_FRYER_CONFIG;
