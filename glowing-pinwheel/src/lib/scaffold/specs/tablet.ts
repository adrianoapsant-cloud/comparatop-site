/**
 * @file tablet.ts
 * @description Scaffold spec para Tablet
 */

import type { CategoryScaffoldSpec } from './types';

export const TABLET_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'tablet',
    energy: {
        baseline: {
            defaultKwhMonth: 1,  // ~3Wh/dia para carregar
            lifespanYears: 4,
            maintenanceRate: 0.01,
        },
        consumptionPriority: ['baseline'],
        bounds: {
            hardMin: 0,
            hardMax: 5,
            softMin: 0,
            softMax: 2,
        },
    },
    specs: {
        storage: {
            hardMin: 32,
            hardMax: 2000,
            softMin: 64,
            softMax: 512,
        },
        displaySize: {
            hardMin: 7,
            hardMax: 14,
            softMin: 8,
            softMax: 13,
        },
    },
    defaultScores: {
        c1: 7.0,  // Tela
        c2: 7.0,  // Desempenho
        c3: 7.0,  // Bateria
        c4: 7.0,  // Caneta/Produtividade
        c5: 7.0,  // Construção
        c6: 7.0,  // Software
        c7: 7.0,  // Custo-Benefício
        c8: 7.0,  // Ecossistema
        c9: 7.0,  // Armazenamento
        c10: 7.0, // Acessórios
    },
    deterministicRules: [
        {
            id: 'large-storage-bonus',
            description: 'Storage >= 256GB melhora armazenamento (c9) em +0.5',
            condition: (specs) => (specs.storage as number) >= 256,
            modifier: { scoreKey: 'c9', delta: 0.5 },
        },
        {
            id: 'pen-support-bonus',
            description: 'Suporte a caneta melhora produtividade (c4) em +1.0',
            condition: (specs) => specs.hasPenSupport === true,
            modifier: { scoreKey: 'c4', delta: 1.0 },
        },
        {
            id: 'lte-connectivity-bonus',
            description: 'LTE melhora conectividade (c8) em +0.5',
            condition: (specs) => specs.hasLte === true,
            modifier: { scoreKey: 'c8', delta: 0.5 },
        },
    ],
};
