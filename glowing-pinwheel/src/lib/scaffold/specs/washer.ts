/**
 * @file washer.ts
 * @description Scaffold spec para Máquina de Lavar
 */

import type { CategoryScaffoldSpec } from './types';

export const WASHER_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'washer',
    energy: {
        baseline: {
            defaultKwhMonth: 15,  // ~4 ciclos/semana
            lifespanYears: 12,
            maintenanceRate: 0.02,
        },
        consumptionPriority: ['inmetro', 'label', 'baseline'],
        bounds: {
            hardMin: 0,
            hardMax: 50,
            softMin: 5,
            softMax: 30,
        },
    },
    specs: {
        capacityKg: {
            hardMin: 5,
            hardMax: 25,
            softMin: 8,
            softMax: 17,
        },
    },
    defaultScores: {
        c1: 7.0,  // Capacidade
        c2: 7.0,  // Eficiência Energética
        c3: 7.0,  // Qualidade de Lavagem
        c4: 7.0,  // Centrifugação
        c5: 7.0,  // Ruído
        c6: 7.0,  // Durabilidade
        c7: 7.0,  // Custo-Benefício
        c8: 7.0,  // Praticidade
        c9: 7.0,  // Conectividade
        c10: 7.0, // Suporte
    },
    deterministicRules: [
        {
            id: 'inverter-efficiency-bonus',
            description: 'Inverter melhora eficiência (c2) em +1.0',
            condition: (specs) => specs.hasInverter === true,
            modifier: { scoreKey: 'c2', delta: 1.0 },
        },
        {
            id: 'inverter-noise-bonus',
            description: 'Inverter melhora ruído (c5) em +0.5',
            condition: (specs) => specs.hasInverter === true,
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
        {
            id: 'large-capacity-bonus',
            description: 'Capacidade >= 15kg melhora capacidade (c1) em +0.5',
            condition: (specs) => (specs.capacityKg as number) >= 15,
            modifier: { scoreKey: 'c1', delta: 0.5 },
        },
    ],
};
