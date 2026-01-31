/**
 * @file laptop.ts
 * @description Scaffold spec para Laptop/Notebook
 */

import type { CategoryScaffoldSpec } from './types';

export const LAPTOP_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'laptop',
    energy: {
        baseline: {
            defaultKwhMonth: 10,  // ~45W × 7h/dia
            lifespanYears: 5,
            maintenanceRate: 0.02,
        },
        consumptionPriority: ['wattsUsage', 'baseline'],
        bounds: {
            hardMin: 0,
            hardMax: 50,
            softMin: 5,
            softMax: 30,
        },
    },
    specs: {
        ram: {
            hardMin: 4,
            hardMax: 128,
            softMin: 8,
            softMax: 64,
        },
        storage: {
            hardMin: 128,
            hardMax: 8000,
            softMin: 256,
            softMax: 2000,
        },
    },
    defaultScores: {
        c1: 7.0,  // Desempenho
        c2: 7.0,  // Portabilidade
        c3: 7.0,  // Tela
        c4: 7.0,  // Bateria
        c5: 7.0,  // Teclado
        c6: 7.0,  // Construção
        c7: 7.0,  // Custo-Benefício
        c8: 7.0,  // Conectividade
        c9: 7.0,  // Armazenamento
        c10: 7.0, // Suporte
    },
    deterministicRules: [
        {
            id: 'ssd-storage-bonus',
            description: 'SSD >= 512GB melhora armazenamento (c9) em +0.5',
            condition: (specs) => (specs.storage as number) >= 512,
            modifier: { scoreKey: 'c9', delta: 0.5 },
        },
        {
            id: 'ram-16gb-bonus',
            description: 'RAM >= 16GB melhora desempenho (c1) em +0.5',
            condition: (specs) => (specs.ram as number) >= 16,
            modifier: { scoreKey: 'c1', delta: 0.5 },
        },
        {
            id: 'lightweight-bonus',
            description: 'Peso <= 1.5kg melhora portabilidade (c2) em +1.0',
            condition: (specs) => (specs.weightKg as number) <= 1.5,
            modifier: { scoreKey: 'c2', delta: 1.0 },
        },
    ],
};
