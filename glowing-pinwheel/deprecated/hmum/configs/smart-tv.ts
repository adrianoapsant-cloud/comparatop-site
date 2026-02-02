/**
 * @file smart-tv.ts
 * @description HMUM Configuration for Smart TVs
 * 
 * Based on RTINGS methodology and Brazilian market analysis:
 * - Picture quality is paramount (contrast, HDR, colors)
 * - Input lag matters for gaming segment
 * - Smart platform affects long-term satisfaction
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const SMART_TV_CONFIG: CategoryHMUMConfig = {
    categoryId: 'smart-tv',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // PICTURE QUALITY (35%)
        // ----------------------------------------
        {
            id: 'qualidade_imagem',
            label: 'Qualidade de Imagem',
            dataField: 'scores.c1',
            weightSubjective: 0.35,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // HDR PERFORMANCE (15%)
        // ----------------------------------------
        {
            id: 'hdr',
            label: 'Desempenho HDR',
            dataField: 'scores.c2',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // SMART PLATFORM (15%)
        // ----------------------------------------
        {
            id: 'smart_platform',
            label: 'Sistema Smart',
            dataField: 'specs.sistema_operacional',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'webOS': 9.0,
                    'Tizen': 8.5,
                    'Google TV': 8.0,
                    'Android TV': 7.5,
                    'Roku': 7.0,
                    'Vidaa': 6.0,
                    'Linux': 4.0,
                    'Proprietário': 3.0,
                },
            },
        },

        // ----------------------------------------
        // GAMING PERFORMANCE (10%)
        // ----------------------------------------
        {
            id: 'gaming',
            label: 'Performance Gaming',
            dataField: 'scores.c5',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            vetoThreshold: 3.0,  // Bad gaming = deal-breaker for gamers
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // SOUND QUALITY (10%)
        // ----------------------------------------
        {
            id: 'som',
            label: 'Qualidade de Som',
            dataField: 'scores.c6',
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

export default SMART_TV_CONFIG;
