/**
 * @file notebook.ts
 * @description HMUM Configuration for Notebooks/Laptops
 * 
 * Based on Deep Research analysis:
 * - Thermal design is critical in Brazil's climate
 * - Battery degradation accelerated in hot environments
 * - Display quality varies significantly by segment
 * - SSD quality (QLC vs TLC) affects longevity
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const NOTEBOOK_CONFIG: CategoryHMUMConfig = {
    categoryId: 'notebook',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // PERFORMANCE (25%)
        // ----------------------------------------
        {
            id: 'performance',
            label: 'Desempenho',
            dataField: 'scores.c1',
            weightSubjective: 0.25,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // ----------------------------------------
        // DISPLAY (20%)
        // ----------------------------------------
        {
            id: 'tela',
            label: 'Qualidade da Tela',
            dataField: 'specs.tela_srgb',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 60,
            vetoThreshold: 50,  // Below 50% sRGB is unacceptable for premium
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.05,
                    x0: 90,  // Good screens are 90%+ sRGB
                },
            },
        },

        // ----------------------------------------
        // BATTERY (15%)
        // ----------------------------------------
        {
            id: 'bateria',
            label: 'Autonomia',
            dataField: 'specs.bateria_wh',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 40,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.08,
                    x0: 55,  // Midpoint at 55Wh
                },
            },
        },

        // ----------------------------------------
        // BUILD QUALITY (15%)
        // ----------------------------------------
        {
            id: 'construcao',
            label: 'Qualidade de Construção',
            dataField: 'specs.material_chassi',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Alumínio Unibody': 10.0,
                    'Alumínio': 8.5,
                    'Magnésio': 8.0,
                    'Plástico Reforçado': 6.0,
                    'Plástico': 4.0,
                },
            },
        },

        // ----------------------------------------
        // THERMAL DESIGN (10%)
        // ----------------------------------------
        {
            id: 'termico',
            label: 'Design Térmico',
            dataField: 'specs.num_ventoinhas',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Vapor Chamber + 2 Fans': 10.0,
                    '2 Ventoinhas': 8.0,
                    '1 Ventoinha': 5.0,
                    'Passivo': 3.0,
                },
            },
        },

        // ----------------------------------------
        // STORAGE (10%)
        // ----------------------------------------
        {
            id: 'armazenamento',
            label: 'Armazenamento',
            dataField: 'specs.ssd_tipo',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'NVMe TLC + DRAM': 10.0,
                    'NVMe TLC': 8.5,
                    'NVMe QLC': 6.0,
                    'SATA SSD': 5.0,
                    'eMMC': 3.0,
                    'HDD': 2.0,
                },
            },
        },

        // ----------------------------------------
        // VALUE FOR MONEY (5%)
        // ----------------------------------------
        {
            id: 'custo_beneficio',
            label: 'Custo-Benefício',
            dataField: 'scores.c10',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
    ],
};

export default NOTEBOOK_CONFIG;
