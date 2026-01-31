/**
 * @file tv.ts
 * @description Scaffold spec para Smart TV
 */

import type { CategoryScaffoldSpec } from './types';

export const TV_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'tv',
    energy: {
        baseline: {
            defaultKwhMonth: 15.0,  // ~100W x 5h/dia
            lifespanYears: 8,
            maintenanceRate: 0.02,  // 2% ao ano (baixa manutenção)
        },
        consumptionPriority: ['inmetro', 'label', 'wattsUsage', 'baseline'],
        bounds: {
            hardMin: 2,
            hardMax: 100,
            softMin: 5,
            softMax: 50,
        },
    },
    specs: {
        screenSize: {
            hardMin: 32,
            hardMax: 100,
            softMin: 43,
            softMax: 85,
        },
        brightness: {
            hardMin: 100,
            hardMax: 5000,
            softMin: 300,
            softMax: 2000,
        },
        refreshRate: {
            hardMin: 50,
            hardMax: 240,
            softMin: 60,
            softMax: 144,
        },
    },
    defaultScores: {
        c1: 7.0,  // Qualidade de Imagem
        c2: 7.0,  // Processamento
        c3: 7.0,  // Confiabilidade
        c4: 7.0,  // Sistema
        c5: 6.0,  // Gaming
        c6: 7.0,  // Brilho
        c7: 7.0,  // Custo-Benefício
        c8: 6.0,  // Áudio
        c9: 7.0,  // Conectividade
        c10: 7.0, // Suporte
    },
    deterministicRules: [
        {
            id: 'oled-image-quality',
            description: 'OLED melhora imagem (c1) em +1.0',
            condition: (specs) => {
                const panel = String(specs.panelType || '').toLowerCase();
                return panel.includes('oled');
            },
            modifier: { scoreKey: 'c1', delta: 1.0 },
        },
        {
            id: 'hdmi21-gaming-bonus',
            description: 'HDMI 2.1 (>=2 portas) melhora gaming (c5) em +1.0',
            condition: (specs) => {
                const hdmi21 = Number(specs.hdmi21Ports);
                return !isNaN(hdmi21) && hdmi21 >= 2;
            },
            modifier: { scoreKey: 'c5', delta: 1.0 },
        },
        {
            id: '120hz-gaming-bonus',
            description: '120Hz+ melhora gaming (c5) em +0.5',
            condition: (specs) => {
                const refresh = Number(specs.refreshRate);
                return !isNaN(refresh) && refresh >= 120;
            },
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
        {
            id: 'vrr-allm-bonus',
            description: 'VRR + ALLM melhora gaming (c5) em +0.5',
            condition: (specs) => {
                return specs.hasVRR === true && specs.hasALLM === true;
            },
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
    ],
};
