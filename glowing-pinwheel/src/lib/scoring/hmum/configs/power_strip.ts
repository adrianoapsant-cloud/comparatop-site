/**
 * @file power_strip.ts
 * @description HMUM Configuration for Power Strips (Filtros de Linha)
 * 
 * P18 Batch 12 - Converted from src/data/categories.ts POWER_STRIP_CATEGORY
 * 
 * Weights: 22+18+18+14+10+8+6+2+1+1 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const POWER_STRIP_CONFIG: CategoryHMUMConfig = {
    categoryId: 'power_strip',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'protecao', label: 'Proteção', dataField: 'scores.c1', weightSubjective: 0.22, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'tomadas', label: 'Tomadas', dataField: 'scores.c2', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c3', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'construcao', label: 'Construção', dataField: 'scores.c4', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'usb', label: 'USB', dataField: 'scores.c5', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'cabo', label: 'Cabo', dataField: 'scores.c6', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'disjuntor', label: 'Disjuntor', dataField: 'scores.c7', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'led', label: 'LED', dataField: 'scores.c8', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'garantia', label: 'Garantia', dataField: 'scores.c9', weightSubjective: 0.01, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'base', label: 'Base', dataField: 'scores.c10', weightSubjective: 0.01, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default POWER_STRIP_CONFIG;
