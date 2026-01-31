/**
 * @file console.ts
 * @description HMUM Configuration for Video Game Consoles
 * 
 * P18 Batch 03 - Converted from src/data/categories.ts CONSOLE_CATEGORY
 * 
 * Weights: 18+18+10+10+8+14+6+8+4+4 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const CONSOLE_CONFIG: CategoryHMUMConfig = {
    categoryId: 'console',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        {
            id: 'desempenho',
            label: 'Desempenho',
            dataField: 'scores.c1',
            weightSubjective: 0.18,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'biblioteca_jogos',
            label: 'Biblioteca de Jogos',
            dataField: 'scores.c2',
            weightSubjective: 0.18,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'armazenamento',
            label: 'Armazenamento',
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
        {
            id: 'online_services',
            label: 'Online/Services',
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
        {
            id: 'retrocompatibilidade',
            label: 'Retrocompatibilidade',
            dataField: 'scores.c5',
            weightSubjective: 0.08,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'custo_beneficio',
            label: 'Custo-Benefício',
            dataField: 'scores.c6',
            weightSubjective: 0.14,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'midia_fisica',
            label: 'Mídia Física',
            dataField: 'scores.c7',
            weightSubjective: 0.06,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'controle',
            label: 'Controle',
            dataField: 'scores.c8',
            weightSubjective: 0.08,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'ruido_consumo',
            label: 'Ruído/Consumo',
            dataField: 'scores.c9',
            weightSubjective: 0.04,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'portabilidade',
            label: 'Portabilidade',
            dataField: 'scores.c10',
            weightSubjective: 0.04,
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

export default CONSOLE_CONFIG;
