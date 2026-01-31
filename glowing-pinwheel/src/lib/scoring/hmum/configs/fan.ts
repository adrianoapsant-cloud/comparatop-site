/**
 * @file fan.ts
 * @description HMUM Configuration for Fans (Ventiladores)
 * 
 * P18 Batch 06 - Converted from src/data/categories.ts FAN_CATEGORY
 * 
 * Weights: 20+16+12+10+16+10+8+4+2+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const FAN_CONFIG: CategoryHMUMConfig = {
    categoryId: 'fan',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'vazao', label: 'Vazão', dataField: 'scores.c1', weightSubjective: 0.20, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'ruido', label: 'Ruído', dataField: 'scores.c2', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'velocidades', label: 'Velocidades', dataField: 'scores.c3', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'oscilacao', label: 'Oscilação', dataField: 'scores.c4', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c5', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'consumo', label: 'Consumo', dataField: 'scores.c6', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'construcao', label: 'Construção', dataField: 'scores.c7', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'controle', label: 'Controle', dataField: 'scores.c8', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'timer', label: 'Timer', dataField: 'scores.c9', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'tipo', label: 'Tipo', dataField: 'scores.c10', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default FAN_CONFIG;
