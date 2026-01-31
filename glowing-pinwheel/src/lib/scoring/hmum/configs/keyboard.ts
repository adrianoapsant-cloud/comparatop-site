/**
 * @file keyboard.ts
 * @description HMUM Configuration for Keyboards (Teclados)
 * 
 * P18 Batch 04 - Converted from src/data/categories.ts KEYBOARD_CATEGORY
 * 
 * Weights: 18+14+14+10+8+14+8+6+4+4 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const KEYBOARD_CONFIG: CategoryHMUMConfig = {
    categoryId: 'keyboard',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'switches', label: 'Switches', dataField: 'scores.c1', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'construcao', label: 'Construção', dataField: 'scores.c2', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'digitacao', label: 'Digitação', dataField: 'scores.c3', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'layout', label: 'Layout', dataField: 'scores.c4', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'iluminacao', label: 'Iluminação', dataField: 'scores.c5', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c6', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'conectividade', label: 'Conectividade', dataField: 'scores.c7', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'software', label: 'Software', dataField: 'scores.c8', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'ruido', label: 'Ruído', dataField: 'scores.c9', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'hot_swap', label: 'Hot-Swap', dataField: 'scores.c10', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default KEYBOARD_CONFIG;
