/**
 * @file soundbar.ts
 * @description HMUM Configuration for Soundbars
 * 
 * P18 Batch 09 - Converted from src/data/categories.ts SOUNDBAR_CATEGORY
 * 
 * Weights: 20+12+12+10+10+14+8+6+4+4 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const SOUNDBAR_CONFIG: CategoryHMUMConfig = {
    categoryId: 'soundbar',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        { id: 'qualidade_audio', label: 'Qualidade de Áudio', dataField: 'scores.c1', weightSubjective: 0.20, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'potencia', label: 'Potência', dataField: 'scores.c2', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'subwoofer', label: 'Subwoofer', dataField: 'scores.c3', weightSubjective: 0.12, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'conectividade', label: 'Conectividade', dataField: 'scores.c4', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'surround_virtual', label: 'Surround Virtual', dataField: 'scores.c5', weightSubjective: 0.10, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'custo_beneficio', label: 'Custo-Benefício', dataField: 'scores.c6', weightSubjective: 0.14, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'integracao_tv', label: 'Integração TV', dataField: 'scores.c7', weightSubjective: 0.08, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'design', label: 'Design', dataField: 'scores.c8', weightSubjective: 0.06, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'pos_venda', label: 'Pós-Venda', dataField: 'scores.c9', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
        { id: 'smart_features', label: 'Smart Features', dataField: 'scores.c10', weightSubjective: 0.04, direction: 'maximize', missingStrategy: 'impute_penalty', imputeValue: 5.0, normalization: { method: 'linear', linearRange: { min: 0, max: 10 } } },
    ],
};

export default SOUNDBAR_CONFIG;
