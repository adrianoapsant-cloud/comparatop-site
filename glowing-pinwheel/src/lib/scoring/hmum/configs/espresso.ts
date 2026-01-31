/**
 * @file espresso.ts
 * @description HMUM Configuration for Espresso Machines (Cafeteiras)
 * 
 * P18 Batch 13 - Converted from src/data/categories.ts ESPRESSO_CATEGORY
 * 
 * Weights: 20+14+12+16+10+8+8+6+4+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const ESPRESSO_CONFIG: CategoryHMUMConfig = {
    categoryId: 'espresso',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'qualidade', label: 'Qualidade', dataField: 'scores.c1', weightSubjective: 0.20, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'pressao', label: 'Pressão', dataField: 'scores.c2', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'tipo', label: 'Tipo', dataField: 'scores.c3', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c4', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'vaporizador', label: 'Vaporizador', dataField: 'scores.c5', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'reservatorio', label: 'Reservatório', dataField: 'scores.c6', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'limpeza', label: 'Limpeza', dataField: 'scores.c7', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'aquecimento', label: 'Aquecimento', dataField: 'scores.c8', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'design', label: 'Design', dataField: 'scores.c9', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_capsula', label: 'Custo Cápsula', dataField: 'scores.c10', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default ESPRESSO_CONFIG;
