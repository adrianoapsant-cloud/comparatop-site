/**
 * @file smartphone.ts
 * @description Scaffold spec para Smartphone
 */

import type { CategoryScaffoldSpec } from './types';

export const SMARTPHONE_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'smartphone',
    energy: {
        baseline: {
            // Smartphone consome pouca energia para carregamento
            defaultKwhMonth: 0.5,  // ~15Wh/dia para carregar
            lifespanYears: 4,
            maintenanceRate: 0.01,  // 1% ao ano (troca de tela eventual)
        },
        consumptionPriority: ['baseline'],  // Não usa energia INMETRO
        bounds: {
            hardMin: 0,
            hardMax: 2,
            softMin: 0,
            softMax: 1,
        },
    },
    specs: {
        storage: {
            hardMin: 32,
            hardMax: 2000,
            softMin: 64,
            softMax: 512,
        },
        ram: {
            hardMin: 2,
            hardMax: 24,
            softMin: 4,
            softMax: 16,
        },
        battery: {
            hardMin: 2000,
            hardMax: 8000,
            softMin: 3500,
            softMax: 6000,
        },
    },
    defaultScores: {
        c1: 7.0,  // Autonomia Real (IARSE)
        c2: 7.0,  // Estabilidade de Software (ESMI)
        c3: 7.0,  // Custo-Benefício & Revenda (RCBIRV)
        c4: 7.0,  // Câmera Social (QFSR)
        c5: 7.0,  // Resiliência Física (RFCT)
        c6: 7.0,  // Qualidade de Tela (QDAE)
        c7: 7.0,  // Pós-Venda & Peças (EPST)
        c8: 7.0,  // Conectividade (CPI)
        c9: 7.0,  // Armazenamento (AGD)
        c10: 7.0, // Recursos Úteis (IFM)
    },
    deterministicRules: [
        {
            id: 'amoled-display-bonus',
            description: 'AMOLED/OLED melhora qualidade de tela (c6) em +0.5',
            condition: (specs) => {
                const display = String(specs.displayType || '').toLowerCase();
                return display.includes('amoled') || display.includes('oled');
            },
            modifier: { scoreKey: 'c6', delta: 0.5 },
        },
        {
            id: '5g-connectivity-bonus',
            description: '5G melhora conectividade (c8) em +0.5',
            condition: (specs) => {
                return specs.fiveG === true;
            },
            modifier: { scoreKey: 'c8', delta: 0.5 },
        },
        {
            id: 'ip68-durability-bonus',
            description: 'IP68 melhora resiliência física (c5) em +1.0',
            condition: (specs) => {
                const cert = String(specs.certification || '').toUpperCase();
                return cert === 'IP68';
            },
            modifier: { scoreKey: 'c5', delta: 1.0 },
        },
        {
            id: 'large-battery-bonus',
            description: 'Bateria >= 5000mAh melhora autonomia (c1) em +0.5',
            condition: (specs) => {
                const battery = Number(specs.battery);
                return !isNaN(battery) && battery >= 5000;
            },
            modifier: { scoreKey: 'c1', delta: 0.5 },
        },
    ],
};
