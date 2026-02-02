/**
 * @file robo-aspirador.ts
 * @description HMUM Configuration for Robot Vacuums
 * 
 * Based on Deep Research report analysis:
 * - Navigation is more important than raw suction power
 * - Battery/autonomy crucial for large areas
 * - Noise threshold at 80dB is deal-breaker
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const ROBO_ASPIRADOR_CONFIG: CategoryHMUMConfig = {
    categoryId: 'robo-aspirador',
    hybridAlpha: 0.6,      // 60% objective, 40% subjective
    vetoPenalty: 0.01,     // Epsilon for vetoed criteria

    criteria: [
        // ----------------------------------------
        // NAVIGATION (35% - Most Important)
        // ----------------------------------------
        {
            id: 'navegacao',
            label: 'Sistema de Navegação',
            dataField: 'specs.navegacao_tech',
            weightSubjective: 0.35,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'LiDAR': 9.5,
                    'VSLAM': 8.0,
                    'Câmera': 7.5,
                    'Giroscópio': 6.0,
                    'Gyro': 6.0,
                    'Aleatório': 2.0,
                    'Random': 2.0,
                },
            },
            // VETO: Navigation below VSLAM level is unacceptable for premium segment
            vetoThreshold: 6.0,  // After ordinal mapping
        },

        // ----------------------------------------
        // SUCTION POWER (25%)
        // ----------------------------------------
        {
            id: 'succao',
            label: 'Potência de Sucção',
            dataField: 'specs.succao_pa',
            weightSubjective: 0.25,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 2000,  // Low-end default
            vetoThreshold: 1000, // Minimum acceptable
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.0015,   // Steepness
                    x0: 4000,    // Midpoint (score = 5.0 at 4000Pa)
                },
            },
        },

        // ----------------------------------------
        // BATTERY/AUTONOMY (20%)
        // ----------------------------------------
        {
            id: 'bateria',
            label: 'Autonomia',
            dataField: 'specs.bateria_min',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'linear',
                linearRange: {
                    min: 60,    // Minimum 60 min
                    max: 240,   // Maximum 4 hours
                },
            },
        },

        // ----------------------------------------
        // NOISE (10% - Minimize)
        // ----------------------------------------
        {
            id: 'ruido',
            label: 'Nível de Ruído',
            dataField: 'specs.ruido_db',
            weightSubjective: 0.10,
            direction: 'minimize',  // Lower is better
            missingStrategy: 'impute_penalty',
            imputeValue: 75,  // Assume loud if not specified
            vetoThreshold: 80, // Above 80dB is deal-breaker
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.2,     // Steepness
                    x0: 65,     // Midpoint (quiet = 65dB)
                },
            },
        },

        // ----------------------------------------
        // BASE STATION FEATURES (10%)
        // ----------------------------------------
        {
            id: 'base',
            label: 'Recursos da Base',
            dataField: 'specs.base_features',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Auto-Esvaziamento + Auto-Limpeza': 10.0,
                    'Auto-Esvaziamento': 8.0,
                    'Auto-Recarga': 6.0,
                    'Manual': 4.0,
                    'Básica': 3.0,
                },
            },
        },
    ],
};

export default ROBO_ASPIRADOR_CONFIG;
