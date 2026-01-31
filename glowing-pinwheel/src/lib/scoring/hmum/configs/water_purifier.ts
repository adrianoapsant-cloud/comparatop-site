/**
 * @file water_purifier.ts
 * @description HMUM Configuration for Water Purifiers (Purificadores)
 * 
 * P18 Batch 13 - Converted from src/data/categories.ts WATER_PURIFIER_CATEGORY
 * 
 * Weights: 22+16+16+12+10+10+6+4+2+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const WATER_PURIFIER_CONFIG: CategoryHMUMConfig = {
    categoryId: 'water_purifier',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'filtragem', label: 'Filtragem', dataField: 'scores.c1', weightSubjective: 0.22, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'refrigeracao', label: 'Refrigeração', dataField: 'scores.c2', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c3', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_refil', label: 'Custo Refil', dataField: 'scores.c4', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'vazao', label: 'Vazão', dataField: 'scores.c5', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'vida_filtro', label: 'Vida Filtro', dataField: 'scores.c6', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'design', label: 'Design', dataField: 'scores.c7', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'instalacao', label: 'Instalação', dataField: 'scores.c8', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'consumo', label: 'Consumo', dataField: 'scores.c9', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'bactericida', label: 'Bactericida', dataField: 'scores.c10', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default WATER_PURIFIER_CONFIG;
