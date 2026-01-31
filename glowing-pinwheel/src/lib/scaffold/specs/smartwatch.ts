/**
 * @file smartwatch.ts
 * @description Scaffold spec para Smartwatch
 */

import type { CategoryScaffoldSpec } from './types';

export const SMARTWATCH_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: 'smartwatch',
    energy: {
        baseline: {
            // Smartwatch consome pouca energia, não é crítico para TCO
            defaultKwhMonth: 0.1,  // Negligível
            lifespanYears: 4,
            maintenanceRate: 0.01,  // 1% ao ano
        },
        consumptionPriority: ['baseline'],  // Não usa energia real
        bounds: {
            hardMin: 0,
            hardMax: 1,
            softMin: 0,
            softMax: 0.5,
        },
    },
    specs: {
        displaySize: {
            hardMin: 1.0,
            hardMax: 2.5,
            softMin: 1.2,
            softMax: 1.9,
        },
        batteryDays: {
            hardMin: 0.5,
            hardMax: 30,
            softMin: 1,
            softMax: 14,
        },
    },
    defaultScores: {
        c1: 7.0,  // Tela
        c2: 7.0,  // Bateria
        c3: 7.0,  // Sensores de Saúde
        c4: 7.0,  // Fitness
        c5: 7.0,  // Ecossistema
        c6: 7.0,  // Custo-Benefício
        c7: 7.0,  // Design
        c8: 7.0,  // Resistência
        c9: 7.0,  // Notificações
        c10: 7.0, // Pagamentos
    },
    deterministicRules: [
        {
            id: 'gps-fitness-bonus',
            description: 'GPS melhora fitness (c4) em +0.5',
            condition: (specs) => {
                return specs.hasGps === true;
            },
            modifier: { scoreKey: 'c4', delta: 0.5 },
        },
        {
            id: 'ecg-health-bonus',
            description: 'ECG melhora sensores de saúde (c3) em +1.0',
            condition: (specs) => {
                return specs.hasEcg === true;
            },
            modifier: { scoreKey: 'c3', delta: 1.0 },
        },
        {
            id: 'nfc-payments-bonus',
            description: 'NFC melhora pagamentos (c10) em +1.0',
            condition: (specs) => {
                return specs.hasNfc === true;
            },
            modifier: { scoreKey: 'c10', delta: 1.0 },
        },
        {
            id: 'lte-ecosystem-bonus',
            description: 'LTE melhora ecossistema (c5) em +0.5',
            condition: (specs) => {
                return specs.hasLte === true;
            },
            modifier: { scoreKey: 'c5', delta: 0.5 },
        },
    ],
};
