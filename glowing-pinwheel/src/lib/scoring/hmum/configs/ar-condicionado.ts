/**
 * @file ar-condicionado.ts
 * @description HMUM Configuration for Air Conditioners (Split Inverter)
 * 
 * Based on Deep Research analysis:
 * - Energy efficiency (INMETRO) crucial for electricity costs
 * - BTU capacity must match room size
 * - Noise matters for bedrooms
 * - Compressor technology affects durability
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const AR_CONDICIONADO_CONFIG: CategoryHMUMConfig = {
    categoryId: 'ar-condicionado',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // ENERGY EFFICIENCY (30%)
        // ----------------------------------------
        {
            id: 'eficiencia',
            label: 'Eficiência Energética',
            dataField: 'specs.selo_procel',
            weightSubjective: 0.30,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 4.0,  // Below B is unacceptable in 2025
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'A': 10.0,
                    'B': 7.0,
                    'C': 4.0,
                    'D': 2.0,
                    'E': 1.0,
                },
            },
        },

        // ----------------------------------------
        // COOLING CAPACITY (20%)
        // ----------------------------------------
        {
            id: 'capacidade',
            label: 'Capacidade BTU',
            dataField: 'specs.btu',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 9000,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.0003,
                    x0: 12000,  // Midpoint at 12000 BTU
                },
            },
        },

        // ----------------------------------------
        // NOISE - INDOOR (15%)
        // ----------------------------------------
        {
            id: 'ruido_interno',
            label: 'Ruído Interno',
            dataField: 'specs.ruido_interno_db',
            weightSubjective: 0.15,
            direction: 'minimize',
            missingStrategy: 'impute_penalty',
            imputeValue: 40,
            vetoThreshold: 50,  // Above 50dB is too loud for bedroom
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.25,
                    x0: 35,
                },
            },
        },

        // ----------------------------------------
        // COMPRESSOR TECHNOLOGY (15%)
        // ----------------------------------------
        {
            id: 'compressor',
            label: 'Tecnologia Compressor',
            dataField: 'specs.compressor_tipo',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Scroll': 10.0,
                    'Landa': 9.5,
                    'GMCC Inverter': 8.5,
                    'Rotativo Inverter': 8.0,
                    'Rechi': 6.5,
                    'On/Off': 4.0,
                },
            },
        },

        // ----------------------------------------
        // COIL PROTECTION (10%)
        // ----------------------------------------
        {
            id: 'serpentina',
            label: 'Proteção Serpentina',
            dataField: 'specs.revestimento_serpentina',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Gold Fin': 10.0,
                    'Blue Fin': 7.0,
                    'Alumínio': 4.0,
                    'Sem revestimento': 2.0,
                },
            },
        },

        // ----------------------------------------
        // FEATURES (5%)
        // ----------------------------------------
        {
            id: 'recursos',
            label: 'Recursos',
            dataField: 'specs.recursos',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'WiFi + Sensor + Timer + Sleep': 10.0,
                    'WiFi + Timer': 8.0,
                    'Timer + Sleep': 6.0,
                    'Timer': 4.0,
                    'Básico': 2.0,
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

export default AR_CONDICIONADO_CONFIG;
