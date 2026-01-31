/**
 * @file tablet.ts
 * @description HMUM Configuration for Tablets
 * 
 * P18 Batch 03 - Converted from src/data/categories.ts TABLET_CATEGORY
 * 
 * Weights: 16+14+12+12+10+12+8+6+6+4 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const TABLET_CONFIG: CategoryHMUMConfig = {
    categoryId: 'tablet',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        {
            id: 'desempenho',
            label: 'Desempenho',
            dataField: 'scores.c1',
            weightSubjective: 0.16,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
        {
            id: 'qualidade_tela',
            label: 'Qualidade de Tela',
            dataField: 'scores.c2',
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
            id: 'produtividade',
            label: 'Produtividade',
            dataField: 'scores.c3',
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
            id: 'ecossistema',
            label: 'Ecossistema',
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
            id: 'construcao',
            label: 'Construção',
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
        {
            id: 'camera',
            label: 'Câmera',
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
            id: 'pos_venda',
            label: 'Pós-Venda',
            dataField: 'scores.c9',
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
            id: 'acessorios',
            label: 'Acessórios',
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

export default TABLET_CONFIG;
