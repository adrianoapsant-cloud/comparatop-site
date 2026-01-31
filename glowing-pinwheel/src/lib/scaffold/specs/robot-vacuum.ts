/**
 * @file robot-vacuum.ts
 * @description Scaffold spec para Robot Vacuum
 */

import type { CategoryScaffoldSpec } from './types';

export const ROBOT_VACUUM_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'robot-vacuum',
    energy: {
        baseline: {
            defaultKwhMonth: 3.0,  // ~30W x 3h/dia
            lifespanYears: 5,
            maintenanceRate: 0.05,  // 5% ao ano (escovas, filtros)
        },
        consumptionPriority: ['inmetro', 'label', 'wattsUsage', 'baseline'],
        bounds: {
            hardMin: 0.5,
            hardMax: 30,
            softMin: 1.5,
            softMax: 10,
        },
    },
    specs: {
        suctionPa: {
            hardMin: 500,
            hardMax: 20000,
            softMin: 1000,
            softMax: 12000,
        },
        heightCm: {
            hardMin: 5,
            hardMax: 15,
            softMin: 7,
            softMax: 11,
        },
        batteryMah: {
            hardMin: 1000,
            hardMax: 10000,
            softMin: 2000,
            softMax: 6000,
        },
    },
    defaultScores: {
        c1: 7.0,  // Navegação
        c2: 7.0,  // App/Voz
        c3: 6.0,  // Mop
        c4: 7.0,  // Escovas
        c5: 7.0,  // Altura
        c6: 6.0,  // Manutenibilidade
        c7: 7.0,  // Bateria
        c8: 7.0,  // Ruído
        c9: 5.0,  // Base
        c10: 6.0, // IA
    },
    deterministicRules: [
        {
            id: 'lidar-navigation-bonus',
            description: 'LiDAR/VSLAM melhora navegação (c1) em +1.0',
            condition: (specs) => {
                const nav = String(specs.navigationType || '').toLowerCase();
                return nav === 'lidar' || nav === 'vslam';
            },
            modifier: { scoreKey: 'c1', delta: 1.0 },
        },
        {
            id: 'auto-empty-base-bonus',
            description: 'Base auto-esvaziante melhora base (c9) em +1.5',
            condition: (specs) => {
                return specs.hasSelfEmpty === true || specs.hasAutoEmpty === true;
            },
            modifier: { scoreKey: 'c9', delta: 1.5 },
        },
        {
            id: 'ultra-slim-height-bonus',
            description: 'Altura <= 8cm melhora altura (c5) em +0.5',
            condition: (specs) => {
                const height = Number(specs.heightCm || specs.height);
                return !isNaN(height) && height <= 8;
            },
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
        {
            id: 'self-wash-mop-bonus',
            description: 'Auto-lavagem de mop melhora mop (c3) em +1.0',
            condition: (specs) => {
                return specs.hasSelfWash === true;
            },
            modifier: { scoreKey: 'c3', delta: 1.0 },
        },
    ],
};
