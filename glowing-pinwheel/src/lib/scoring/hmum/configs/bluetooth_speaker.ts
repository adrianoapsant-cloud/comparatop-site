/**
 * @file bluetooth_speaker.ts
 * @description HMUM Configuration for Bluetooth Speakers (Caixas de Som)
 * 
 * P18 Batch 03 - Converted from src/data/categories.ts BLUETOOTH_SPEAKER_CATEGORY
 * 
 * Weights: 20+12+14+12+10+12+6+6+4+4 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const BLUETOOTH_SPEAKER_CONFIG: CategoryHMUMConfig = {
    categoryId: 'bluetooth_speaker',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        {
            id: 'qualidade_som',
            label: 'Qualidade de Som',
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
        {
            id: 'potencia',
            label: 'Potência',
            dataField: 'scores.c2',
            weightSubjective: 0.12,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'bateria',
            label: 'Bateria',
            dataField: 'scores.c3',
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
            id: 'resistencia',
            label: 'Resistência',
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
        {
            id: 'portabilidade',
            label: 'Portabilidade',
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
        {
            id: 'custo_beneficio',
            label: 'Custo-Benefício',
            dataField: 'scores.c6',
            weightSubjective: 0.12,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'pareamento',
            label: 'Pareamento',
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
            id: 'conectividade',
            label: 'Conectividade',
            dataField: 'scores.c8',
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
            id: 'design',
            label: 'Design',
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
            id: 'power_bank',
            label: 'Power Bank',
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

export default BLUETOOTH_SPEAKER_CONFIG;
