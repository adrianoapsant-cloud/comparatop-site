/**
 * @file fone-ouvido.ts
 * @description HMUM Configuration for Headphones (TWS and Over-Ear)
 * 
 * Based on psychoacoustic measurements:
 * - Sound quality is subjective but measurable (frequency response)
 * - ANC effectiveness varies significantly
 * - Comfort matters for long sessions
 * - Battery life critical for TWS
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const FONE_OUVIDO_CONFIG: CategoryHMUMConfig = {
    categoryId: 'fone-ouvido',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // SOUND QUALITY (30%)
        // ----------------------------------------
        {
            id: 'qualidade_som',
            label: 'Qualidade de Som',
            dataField: 'scores.c1',
            weightSubjective: 0.30,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // ANC EFFECTIVENESS (20%)
        // ----------------------------------------
        {
            id: 'anc',
            label: 'Cancelamento de Ruído',
            dataField: 'specs.anc_db',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',  // Not all have ANC
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.15,
                    x0: 25,  // Good ANC is 25dB+ reduction
                },
            },
        },

        // ----------------------------------------
        // BATTERY (15%)
        // ----------------------------------------
        {
            id: 'bateria',
            label: 'Autonomia',
            dataField: 'specs.bateria_horas',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 4,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.2,
                    x0: 8,  // 8 hours is good
                },
            },
        },

        // ----------------------------------------
        // COMFORT (15%)
        // ----------------------------------------
        {
            id: 'conforto',
            label: 'Conforto',
            dataField: 'scores.c4',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 6.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // MICROPHONE (10%)
        // ----------------------------------------
        {
            id: 'microfone',
            label: 'Qualidade do Microfone',
            dataField: 'scores.c3',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
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

export default FONE_OUVIDO_CONFIG;
