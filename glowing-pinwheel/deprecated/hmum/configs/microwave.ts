/**
 * @file microwave.ts
 * @description HMUM Configuration for Microwaves (Micro-ondas)
 * 
 * P18 Batch 01 - Converted from "10 dores.txt"
 * Source: "Diretrizes do Algoritmo de Comparação de Micro-ondas (Mercado Brasileiro)"
 * 
 * Key focus areas:
 * - Cavity integrity (rust/sparking risk)
 * - Visibility (blackout doors are bad UX)
 * - Panel interface (membrane failure is common)
 * - Inverter technology (uniform heating)
 * 
 * Weights: 20+15+15+12+10+8+8+5+5+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const MICROWAVE_CONFIG: CategoryHMUMConfig = {
    categoryId: 'microwave',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // C1: INTEGRIDADE DA CAVIDADE (PINTURA) - 20%
        {
            id: 'integridade_cavidade',
            label: 'Integridade da Cavidade (Pintura)',
            dataField: 'scores.c1',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 2.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C2: VISIBILIDADE OPERACIONAL - 15%
        {
            id: 'visibilidade',
            label: 'Visibilidade Operacional',
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

        // C3: INTERFACE (PAINEL) - 15%
        {
            id: 'interface_painel',
            label: 'Interface (Painel)',
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

        // C4: TECNOLOGIA DE AQUECIMENTO - 12%
        {
            id: 'tecnologia_aquecimento',
            label: 'Tecnologia de Aquecimento',
            dataField: 'scores.c4',
            weightSubjective: 0.12,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C5: ERGONOMIA DE LIMPEZA - 10%
        {
            id: 'ergonomia_limpeza',
            label: 'Ergonomia de Limpeza',
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

        // C6: NÍVEL DE RUÍDO - 8%
        {
            id: 'ruido',
            label: 'Nível de Ruído',
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

        // C7: CAPACIDADE ÚTIL - 8%
        {
            id: 'capacidade_util',
            label: 'Capacidade Útil',
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

        // C8: MECÂNICA DA PORTA - 5%
        {
            id: 'mecanica_porta',
            label: 'Mecânica da Porta',
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

        // C9: VERSATILIDADE REAL - 5%
        {
            id: 'versatilidade',
            label: 'Versatilidade Real',
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

        // C10: RECURSOS SUPÉRFLUOS - 2%
        {
            id: 'recursos_superfluos',
            label: 'Recursos Supérfluos',
            dataField: 'scores.c10',
            weightSubjective: 0.02,
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

export default MICROWAVE_CONFIG;
