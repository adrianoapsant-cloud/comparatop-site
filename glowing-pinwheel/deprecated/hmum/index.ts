/**
 * @file index.ts
 * @description Barrel export for HMUM module
 */

// Types
export * from './types';

// Normalization
export { normalizeValue, getNested } from './normalize';
export type { NormalizeResult } from './normalize';

// Core engine
export {
    calculateHMUMScore,
    calculateHMUMBatch,
    rankByHMUM,
    getVetoedProducts,
} from './engine';

// CRITIC weights
export { calculateCRITICWeights, mean, stdDev } from './critic';

// Configs registry
export {
    HMUM_CONFIGS,
    getHMUMConfig,
    hasHMUMConfig,
    getConfiguredCategories,
    getConfigCount,
} from './configs';
