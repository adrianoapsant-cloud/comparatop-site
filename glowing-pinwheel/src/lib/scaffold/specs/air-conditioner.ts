/**
 * @file air-conditioner.ts
 * @description Scaffold spec para Ar Condicionado
 */

import type { CategoryScaffoldSpec } from './types';

export const AIR_CONDITIONER_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'air_conditioner',
    energy: {
        baseline: {
            defaultKwhMonth: 90.0,  // AC 12000 BTU ~8h/dia
            lifespanYears: 10,
            maintenanceRate: 0.03,  // 3% ao ano (limpeza, gás)
        },
        consumptionPriority: ['inmetro', 'label', 'wattsUsage', 'baseline'],
        bounds: {
            hardMin: 20,
            hardMax: 500,
            softMin: 40,
            softMax: 200,
        },
    },
    specs: {
        btus: {
            hardMin: 7000,
            hardMax: 60000,
            softMin: 9000,
            softMax: 30000,
        },
        noiseDb: {
            hardMin: 18,
            hardMax: 60,
            softMin: 22,
            softMax: 45,
        },
        coverageArea: {
            hardMin: 10,
            hardMax: 100,
            softMin: 15,
            softMax: 60,
        },
    },
    defaultScores: {
        c1: 7.0,  // Eficiência Energética
        c2: 7.0,  // Potência de Refrigeração
        c3: 7.0,  // Ruído
        c4: 6.0,  // Qualidade do Ar
        c5: 7.0,  // Manutenibilidade
        c6: 7.0,  // Custo-Benefício
        c7: 5.0,  // Conectividade/Smart
        c8: 7.0,  // Instalação
        c9: 7.0,  // Garantia/Suporte
        c10: 7.0, // Durabilidade
    },
    deterministicRules: [
        {
            id: 'inverter-efficiency-bonus',
            description: 'Inverter melhora eficiência (c1) em +1.5',
            condition: (specs) => {
                return specs.hasInverter === true ||
                    String(specs.inverterType || '').toLowerCase().includes('inverter');
            },
            modifier: { scoreKey: 'c1', delta: 1.5 },
        },
        {
            id: 'dual-inverter-extra',
            description: 'Dual Inverter melhora eficiência (c1) em +0.5 adicional',
            condition: (specs) => {
                return String(specs.inverterType || '').toLowerCase().includes('dual');
            },
            modifier: { scoreKey: 'c1', delta: 0.5 },
        },
        {
            id: 'inverter-noise-bonus',
            description: 'Inverter melhora ruído (c3) em +0.5',
            condition: (specs) => {
                return specs.hasInverter === true ||
                    String(specs.inverterType || '').toLowerCase().includes('inverter');
            },
            modifier: { scoreKey: 'c3', delta: 0.5 },
        },
        {
            id: 'wifi-smart-bonus',
            description: 'WiFi melhora conectividade (c7) em +1.5',
            condition: (specs) => {
                return specs.hasWifi === true;
            },
            modifier: { scoreKey: 'c7', delta: 1.5 },
        },
    ],
};
