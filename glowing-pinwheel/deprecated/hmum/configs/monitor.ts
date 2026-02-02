/**
 * @file monitor.ts
 * @description HMUM Configuration for Monitors
 * 
 * Based on RTINGS methodology:
 * - Response time critical for gaming
 * - Color accuracy important for professional use
 * - Resolution and size affect productivity
 * - Ergonomics matter for long sessions
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const MONITOR_CONFIG: CategoryHMUMConfig = {
    categoryId: 'monitor',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // IMAGE QUALITY (25%)
        // ----------------------------------------
        {
            id: 'qualidade_imagem',
            label: 'Qualidade de Imagem',
            dataField: 'scores.c1',
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
        // RESPONSE TIME (20%)
        // ----------------------------------------
        {
            id: 'tempo_resposta',
            label: 'Tempo de Resposta',
            dataField: 'specs.gtg_ms',
            weightSubjective: 0.20,
            direction: 'minimize',
            missingStrategy: 'impute_penalty',
            imputeValue: 8,
            vetoThreshold: 15,  // Above 15ms is unacceptable for gaming
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.8,
                    x0: 4,  // Good response is 4ms or less
                },
            },
        },

        // ----------------------------------------
        // REFRESH RATE (15%)
        // ----------------------------------------
        {
            id: 'taxa_atualizacao',
            label: 'Taxa de Atualização',
            dataField: 'specs.refresh_hz',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 60,
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    '240': 10.0,
                    '165': 9.0,
                    '144': 8.5,
                    '120': 7.5,
                    '75': 6.0,
                    '60': 5.0,
                },
            },
        },

        // ----------------------------------------
        // COLOR ACCURACY (15%)
        // ----------------------------------------
        {
            id: 'precisao_cor',
            label: 'Precisão de Cor',
            dataField: 'specs.delta_e',
            weightSubjective: 0.15,
            direction: 'minimize',  // Lower Delta E is better
            missingStrategy: 'impute_penalty',
            imputeValue: 4,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 1.5,
                    x0: 2,  // Delta E < 2 is excellent
                },
            },
        },

        // ----------------------------------------
        // PANEL TYPE (10%)
        // ----------------------------------------
        {
            id: 'tipo_painel',
            label: 'Tipo de Painel',
            dataField: 'specs.painel_tipo',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'OLED': 10.0,
                    'Mini-LED IPS': 9.5,
                    'IPS Nano': 8.5,
                    'IPS': 8.0,
                    'VA': 7.0,
                    'TN': 5.0,
                },
            },
        },

        // ----------------------------------------
        // ERGONOMICS (10%)
        // ----------------------------------------
        {
            id: 'ergonomia',
            label: 'Ergonomia',
            dataField: 'specs.ajustes',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Altura + Inclinação + Rotação + Pivot': 10.0,
                    'Altura + Inclinação + Rotação': 8.0,
                    'Altura + Inclinação': 6.0,
                    'Apenas Inclinação': 4.0,
                    'Fixo': 2.0,
                },
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

export default MONITOR_CONFIG;
