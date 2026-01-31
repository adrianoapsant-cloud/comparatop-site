/**
 * @file chair.ts
 * @description HMUM Configuration for Chairs (Cadeiras)
 * 
 * P18 Batch 07 - Converted from src/data/categories.ts CHAIR_CATEGORY
 * 
 * Weights: 22+18+14+12+12+8+6+4+2+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const CHAIR_CONFIG: CategoryHMUMConfig = {
    categoryId: 'chair',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'ergonomia', label: 'Ergonomia', dataField: 'scores.c1', weightSubjective: 0.22, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'conforto', label: 'Conforto', dataField: 'scores.c2', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'construcao', label: 'Construção', dataField: 'scores.c3', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'ajustes', label: 'Ajustes', dataField: 'scores.c4', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c5', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'durabilidade', label: 'Durabilidade', dataField: 'scores.c6', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'base_rodizios', label: 'Base/Rodízios', dataField: 'scores.c7', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'design', label: 'Design', dataField: 'scores.c8', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'montagem', label: 'Montagem', dataField: 'scores.c9', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'acessorios', label: 'Acessórios', dataField: 'scores.c10', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default CHAIR_CONFIG;
