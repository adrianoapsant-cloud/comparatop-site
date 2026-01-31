/**
 * @file soundbar.ts
 * @description Scaffold spec para Soundbar
 */

import type { CategoryScaffoldSpec } from './types';

export const SOUNDBAR_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'soundbar',
    energy: {
        baseline: {
            defaultKwhMonth: 3,  // ~20W × 5h/dia
            lifespanYears: 8,
            maintenanceRate: 0.01,
        },
        consumptionPriority: ['wattsUsage', 'baseline'],
        bounds: {
            hardMin: 0,
            hardMax: 20,
            softMin: 1,
            softMax: 10,
        },
    },
    specs: {
        watts: {
            hardMin: 50,
            hardMax: 1000,
            softMin: 100,
            softMax: 500,
        },
    },
    defaultScores: {
        c1: 7.0,  // Qualidade de Som
        c2: 7.0,  // Graves
        c3: 7.0,  // Diálogos
        c4: 7.0,  // Surround
        c5: 7.0,  // Conectividade
        c6: 7.0,  // Facilidade de Uso
        c7: 7.0,  // Custo-Benefício
        c8: 7.0,  // Design
        c9: 7.0,  // Potência
        c10: 7.0, // Ecossistema
    },
    deterministicRules: [
        {
            id: 'dolby-atmos-bonus',
            description: 'Dolby Atmos melhora surround (c4) em +1.5',
            condition: (specs) => specs.hasDolbyAtmos === true,
            modifier: { scoreKey: 'c4', delta: 1.5 },
        },
        {
            id: 'subwoofer-bonus',
            description: 'Subwoofer incluso melhora graves (c2) em +1.0',
            condition: (specs) => specs.hasSubwoofer === true,
            modifier: { scoreKey: 'c2', delta: 1.0 },
        },
        {
            id: 'earc-bonus',
            description: 'eARC melhora conectividade (c5) em +0.5',
            condition: (specs) => specs.hasHdmiEarc === true,
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
    ],
};
