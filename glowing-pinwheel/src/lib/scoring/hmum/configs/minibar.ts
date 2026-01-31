/**
 * @file minibar.ts
 * @description HMUM Configuration for Minibars (Frigobares)
 * 
 * P18 Batch 11 - Converted from src/data/categories.ts MINIBAR_CATEGORY
 * 
 * Weights: 18+16+14+16+12+10+8+4+1+1 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const MINIBAR_CONFIG: CategoryHMUMConfig = {
    categoryId: 'minibar',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'capacidade', label: 'Capacidade', dataField: 'scores.c1', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'eficiencia', label: 'Eficiência', dataField: 'scores.c2', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'ruido', label: 'Ruído', dataField: 'scores.c3', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c4', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'compacto', label: 'Compacto', dataField: 'scores.c5', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'resfriamento', label: 'Resfriamento', dataField: 'scores.c6', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'design', label: 'Design', dataField: 'scores.c7', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'durabilidade', label: 'Durabilidade', dataField: 'scores.c8', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'prateleiras', label: 'Prateleiras', dataField: 'scores.c9', weightSubjective: 0.01, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'porta', label: 'Porta', dataField: 'scores.c10', weightSubjective: 0.01, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default MINIBAR_CONFIG;
