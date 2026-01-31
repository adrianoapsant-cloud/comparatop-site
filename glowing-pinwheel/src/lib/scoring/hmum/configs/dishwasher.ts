/**
 * @file dishwasher.ts
 * @description HMUM Configuration for Dishwashers (Lava-Louças)
 * 
 * P18 Batch 02 - Converted from "10 dores.txt"
 * Source: "Diretrizes do Algoritmo de Comparação de Lava-Louças (Mercado Brasileiro)"
 * 
 * Key focus areas:
 * - Real capacity (Brazilian pots test)
 * - Cleaning performance
 * - Plastic drying (auto-open door)
 * - Rack rust integrity
 * 
 * Weights: 20+15+15+10+10+10+5+5+5+5 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const DISHWASHER_CONFIG: CategoryHMUMConfig = {
    categoryId: 'dishwasher',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // C1: CAPACIDADE REAL (PANELAS) - 20%
        {
            id: 'capacidade_real',
            label: 'Capacidade Real (Panelas)',
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

        // C2: PERFORMANCE DE LIMPEZA - 15%
        {
            id: 'performance_limpeza',
            label: 'Performance de Limpeza',
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

        // C3: SECAGEM (PLÁSTICOS) - 15%
        {
            id: 'secagem',
            label: 'Secagem (Plásticos)',
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

        // C4: INTEGRIDADE (FERRUGEM) - 10%
        {
            id: 'integridade',
            label: 'Integridade (Ferrugem)',
            dataField: 'scores.c4',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 3.0,  // Cesto enferrujando rápido é crítico
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C5: INSTALAÇÃO (INFRAESTRUTURA) - 10%
        {
            id: 'instalacao',
            label: 'Instalação (Infraestrutura)',
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

        // C6: ACÚSTICA (RUÍDO) - 10%
        {
            id: 'acustica',
            label: 'Acústica (Ruído)',
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

        // C7: ERGONOMIA (3º CESTO) - 5%
        {
            id: 'ergonomia',
            label: 'Ergonomia (3º Cesto)',
            dataField: 'scores.c7',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C8: TCO (ECONOMIA) - 5%
        {
            id: 'tco_economia',
            label: 'TCO (Economia)',
            dataField: 'scores.c8',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C9: MANUTENIBILIDADE - 5%
        {
            id: 'manutenibilidade',
            label: 'Manutenibilidade',
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

        // C10: CONECTIVIDADE - 5%
        {
            id: 'conectividade',
            label: 'Conectividade',
            dataField: 'scores.c10',
            weightSubjective: 0.05,
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

export default DISHWASHER_CONFIG;
