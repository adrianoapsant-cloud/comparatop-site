/**
 * @file car_battery.ts
 * @description HMUM Configuration for Car Batteries (Baterias Automotivas)
 * 
 * P18 Batch 14 - Converted from src/data/categories.ts CAR_BATTERY_CATEGORY
 * 
 * Weights: 20+18+16+18+12+8+4+2+1+1 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const CAR_BATTERY_CONFIG: CategoryHMUMConfig = {
    categoryId: 'car_battery',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'capacidade', label: 'Capacidade', dataField: 'scores.c1', weightSubjective: 0.20, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'cca', label: 'CCA', dataField: 'scores.c2', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'vida_util', label: 'Vida Útil', dataField: 'scores.c3', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c4', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'garantia', label: 'Garantia', dataField: 'scores.c5', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'tipo', label: 'Tipo', dataField: 'scores.c6', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'marca', label: 'Marca', dataField: 'scores.c7', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'compatibilidade', label: 'Compatibilidade', dataField: 'scores.c8', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'peso', label: 'Peso', dataField: 'scores.c9', weightSubjective: 0.01, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'amperagem', label: 'Amperagem', dataField: 'scores.c10', weightSubjective: 0.01, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default CAR_BATTERY_CONFIG;
