/**
 * @file monitor.ts
 * @description Scaffold spec para Monitor
 */

import type { CategoryScaffoldSpec } from './types';

export const MONITOR_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'monitor',
    energy: {
        baseline: {
            defaultKwhMonth: 8,  // ~30W × 8h/dia
            lifespanYears: 7,
            maintenanceRate: 0.01,
        },
        consumptionPriority: ['wattsUsage', 'baseline'],
        bounds: {
            hardMin: 0,
            hardMax: 30,
            softMin: 3,
            softMax: 20,
        },
    },
    specs: {
        screenSize: {
            hardMin: 19,
            hardMax: 55,
            softMin: 24,
            softMax: 34,
        },
        refreshRate: {
            hardMin: 60,
            hardMax: 500,
            softMin: 60,
            softMax: 360,
        },
    },
    defaultScores: {
        c1: 7.0,  // Qualidade de Imagem
        c2: 7.0,  // Gaming/Responsividade
        c3: 7.0,  // Ergonomia
        c4: 7.0,  // Conectividade
        c5: 7.0,  // Construção
        c6: 7.0,  // Custo-Benefício
        c7: 7.0,  // HDR
        c8: 7.0,  // Brilho
        c9: 7.0,  // Cores
        c10: 7.0, // Design
    },
    deterministicRules: [
        {
            id: '144hz-gaming-bonus',
            description: '144Hz+ melhora gaming (c2) em +0.5',
            condition: (specs) => (specs.refreshRate as number) >= 144,
            modifier: { scoreKey: 'c2', delta: 0.5 },
        },
        {
            id: '4k-image-bonus',
            description: '4K melhora qualidade de imagem (c1) em +0.5',
            condition: (specs) => String(specs.resolution).includes('3840'),
            modifier: { scoreKey: 'c1', delta: 0.5 },
        },
        {
            id: 'hdr-bonus',
            description: 'HDR melhora HDR (c7) em +1.0',
            condition: (specs) => specs.hasHdr === true,
            modifier: { scoreKey: 'c7', delta: 1.0 },
        },
    ],
};
