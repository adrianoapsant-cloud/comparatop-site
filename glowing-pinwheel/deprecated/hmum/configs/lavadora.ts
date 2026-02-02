/**
 * @file lavadora.ts
 * @description HMUM Configuration for Washing Machines
 * 
 * Based on Deep Research analysis:
 * - Motor technology affects durability and repair costs
 * - Drum design (sealed vs serviceable) is critical for TCO
 * - Capacity must match household needs
 * - Energy/water efficiency matters for operating costs
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const LAVADORA_CONFIG: CategoryHMUMConfig = {
    categoryId: 'lavadora',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // ----------------------------------------
        // MOTOR TECHNOLOGY (25%)
        // ----------------------------------------
        {
            id: 'motor',
            label: 'Tecnologia do Motor',
            dataField: 'specs.motor_tipo',
            weightSubjective: 0.25,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Direct Drive Inverter': 10.0,
                    'Inverter com Correia': 8.0,
                    'Indução': 6.5,
                    'Universal AC': 5.0,
                },
            },
        },

        // ----------------------------------------
        // CAPACITY (20%)
        // ----------------------------------------
        {
            id: 'capacidade',
            label: 'Capacidade',
            dataField: 'specs.capacidade_kg',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 10,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.4,
                    x0: 12,  // Midpoint at 12kg
                },
            },
        },

        // ----------------------------------------
        // ENERGY EFFICIENCY (15%)
        // ----------------------------------------
        {
            id: 'eficiencia',
            label: 'Eficiência Energética',
            dataField: 'specs.selo_procel',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 6.0,
            vetoThreshold: 4.0,  // Below B
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'A': 10.0,
                    'B': 7.0,
                    'C': 4.0,
                    'D': 2.0,
                },
            },
        },

        // ----------------------------------------
        // REPAIRABILITY (15%)
        // ----------------------------------------
        {
            id: 'reparabilidade',
            label: 'Reparabilidade',
            dataField: 'specs.tanque_tipo',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'ignore_reweight',
            normalization: {
                method: 'ordinal',
                ordinalMap: {
                    'Desmontável': 10.0,      // Serviceable drum
                    'Semi-selado': 6.0,
                    'Selado': 3.0,            // Sealed = expensive repair
                },
            },
        },

        // ----------------------------------------
        // WASH PROGRAMS (10%)
        // ----------------------------------------
        {
            id: 'programas',
            label: 'Programas de Lavagem',
            dataField: 'specs.num_programas',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 8,
            normalization: {
                method: 'linear',
                linearRange: { min: 5, max: 20 },
            },
        },

        // ----------------------------------------
        // SPIN SPEED (10%)
        // ----------------------------------------
        {
            id: 'centrifugacao',
            label: 'Velocidade Centrifugação',
            dataField: 'specs.rpm_max',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 800,
            normalization: {
                method: 'sigmoid',
                sigmoidParams: {
                    k: 0.005,
                    x0: 1000,
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

export default LAVADORA_CONFIG;
