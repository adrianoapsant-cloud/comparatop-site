/**
 * @file cpu.ts
 * @description HMUM Configuration for CPUs (Processadores)
 * 
 * P18 Batch 09 - Converted from src/data/categories.ts CPU_CATEGORY
 * 
 * Weights: 18+16+14+12+14+8+6+6+4+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const CPU_CONFIG: CategoryHMUMConfig = {
    categoryId: 'cpu',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'performance_multi', label: 'Performance Multi', dataField: 'scores.c1', weightSubjective: 0.18, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'performance_single', label: 'Performance Single', dataField: 'scores.c2', weightSubjective: 0.16, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'gaming', label: 'Gaming', dataField: 'scores.c3', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'eficiencia', label: 'Eficiência', dataField: 'scores.c4', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c5', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'plataforma', label: 'Plataforma', dataField: 'scores.c6', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'igpu', label: 'iGPU', dataField: 'scores.c7', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'overclock', label: 'Overclock', dataField: 'scores.c8', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'temperatura', label: 'Temperatura', dataField: 'scores.c9', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'longevidade', label: 'Longevidade', dataField: 'scores.c10', weightSubjective: 0.02, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default CPU_CONFIG;
