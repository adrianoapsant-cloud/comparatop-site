/**
 * @file fridge.ts
 * @description Scaffold spec para Geladeira
 */

import type { CategoryScaffoldSpec } from './types';

export const FRIDGE_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'fridge',
    energy: {
        baseline: {
            defaultKwhMonth: 30.0,  // Geladeira média Brasil
            lifespanYears: 12,
            maintenanceRate: 0.02,  // 2% ao ano
        },
        consumptionPriority: ['inmetro', 'label', 'wattsUsage', 'baseline'],
        bounds: {
            hardMin: 10,
            hardMax: 150,
            softMin: 20,
            softMax: 80,
        },
    },
    specs: {
        capacityLiters: {
            hardMin: 100,
            hardMax: 800,
            softMin: 200,
            softMax: 600,
        },
        noiseLevel: {
            hardMin: 25,
            hardMax: 60,
            softMin: 35,
            softMax: 45,
        },
    },
    defaultScores: {
        c1: 7.0,  // Capacidade
        c2: 7.0,  // Eficiência
        c3: 7.0,  // Qualidade de construção
        c4: 6.0,  // Ruído
        c5: 7.0,  // Praticidade
        c6: 7.0,  // Custo-Benefício
        c7: 6.0,  // Conectividade/Smart
        c8: 7.0,  // Distribuição de frio
        c9: 7.0,  // Manutenibilidade
        c10: 7.0, // Suporte/Garantia
    },
    deterministicRules: [
        {
            id: 'frost-free-praticidade',
            description: 'Frost-free melhora praticidade (c5) em +0.5',
            condition: (specs) => {
                return specs.hasFrostFree === true;
            },
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
        {
            id: 'inverter-efficiency',
            description: 'Inverter melhora eficiência (c2) em +1.0',
            condition: (specs) => {
                return specs.hasInverter === true;
            },
            modifier: { scoreKey: 'c2', delta: 1.0 },
        },
        {
            id: 'inverter-noise',
            description: 'Inverter melhora ruído (c4) em +0.5',
            condition: (specs) => {
                return specs.hasInverter === true;
            },
            modifier: { scoreKey: 'c4', delta: 0.5 },
        },
        {
            id: 'large-capacity-bonus',
            description: 'Capacidade >= 400L melhora capacidade (c1) em +0.5',
            condition: (specs) => {
                const capacity = Number(specs.capacityLiters);
                return !isNaN(capacity) && capacity >= 400;
            },
            modifier: { scoreKey: 'c1', delta: 0.5 },
        },
    ],
};
