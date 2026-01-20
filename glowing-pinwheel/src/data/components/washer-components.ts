/**
 * @file washer-components.ts
 * @description Component database for Washing Machines
 * 
 * Based on Deep Research report: "Análise Crítica Componentes Lavadoras Automáticas"
 * 
 * Key findings:
 * - Direct Drive motors are more durable but expensive to repair
 * - Belt systems are simpler and cheaper to maintain
 * - Sealed drum designs make bearing replacement uneconomical
 * - Electrolux leads in Design for Repair (DfR)
 * 
 * @version 1.0.0
 */

import type { ComponentDefinition } from './types';

// ============================================
// WASHER COMPONENT DEFINITIONS
// ============================================

export const WASHER_COMPONENTS: ComponentDefinition[] = [
    // ----------------------------------------
    // MOTORS
    // ----------------------------------------
    {
        id: 'washer-motor-direct-drive-inverter',
        name: 'Motor Direct Drive Inverter (BLDC)',
        category: 'motor',
        reliability: {
            weibullBeta: 5.0,
            weibullEtaYears: 20,
            annualFailureRate: 0.01,
        },
        costs: {
            partCostBRL: 1500,
            laborCostBRL: 400,
            repairTimeHours: 3,
        },
        riskFactors: {
            tropicalPenalty: 1.05,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.2,
            heatPenalty: 1.1,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 5,
            disassemblyScore: 5,
        },
        dataSource: 'field_data',
        notes: 'LG/Samsung technology. Motor rarely fails; Hall sensors and stator are weak points.',
    },
    {
        id: 'washer-motor-belt-inverter',
        name: 'Motor Inverter com Correia',
        category: 'motor',
        reliability: {
            weibullBeta: 4.0,
            weibullEtaYears: 15,
            annualFailureRate: 0.02,
        },
        costs: {
            partCostBRL: 600,
            laborCostBRL: 250,
            repairTimeHours: 2,
        },
        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.15,
            voltageInstabilityPenalty: 1.15,
            heatPenalty: 1.15,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'excellent',
            diyFriendly: false,
            requiresSpecialist: false,
            repairabilityScore: 7,
            disassemblyScore: 7,
        },
        dataSource: 'field_data',
        notes: 'Used by Midea Storm, Electrolux Premium. Good balance of efficiency and repairability.',
    },
    {
        id: 'washer-motor-universal-belt',
        name: 'Motor Universal AC com Correia',
        category: 'motor',
        reliability: {
            weibullBeta: 3.0,
            weibullEtaYears: 12,
            annualFailureRate: 0.04,
        },
        costs: {
            partCostBRL: 300,
            laborCostBRL: 200,
            repairTimeHours: 1.5,
        },
        riskFactors: {
            tropicalPenalty: 1.15,
            coastalPenalty: 1.2,
            voltageInstabilityPenalty: 1.05,
            heatPenalty: 1.2,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'excellent',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 8,
            disassemblyScore: 8,
        },
        dataSource: 'field_data',
        notes: 'Traditional technology. Requires carbon brush replacement every 5-7 years. Very repairable.',
    },

    // ----------------------------------------
    // TRANSMISSION
    // ----------------------------------------
    {
        id: 'washer-belt-poly-v',
        name: 'Correia de Transmissão Poli-V',
        category: 'mechanical',
        reliability: {
            weibullBeta: 2.5,
            weibullEtaYears: 6,
            annualFailureRate: 0.08,
        },
        costs: {
            partCostBRL: 50,
            laborCostBRL: 100,
            repairTimeHours: 0.5,
        },
        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.3,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'excellent',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 9,
            disassemblyScore: 9,
        },
        dataSource: 'field_data',
        notes: 'Preventive maintenance item. Easy DIY replacement. Failure by drying and cracking.',
    },

    // ----------------------------------------
    // BEARINGS AND SEALS
    // ----------------------------------------
    {
        id: 'washer-bearings-sealed-drum',
        name: 'Rolamentos + Retentor (Tanque Selado)',
        category: 'mechanical',
        reliability: {
            weibullBeta: 3.0,
            weibullEtaYears: 8,
            annualFailureRate: 0.05,
        },
        costs: {
            partCostBRL: 350,
            laborCostBRL: 1200,
            repairTimeHours: 6,
        },
        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.5,
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.1,
        },
        repairability: {
            hasServiceManual: false,
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 2,
            disassemblyScore: 2,
        },
        dataSource: 'field_data',
        notes: 'CRITICAL: Repair cost often exceeds 50% of new machine. Sealed drum design.',
    },
    {
        id: 'washer-bearings-serviceable',
        name: 'Rolamentos + Retentor (Tanque Desmontável)',
        category: 'mechanical',
        reliability: {
            weibullBeta: 3.5,
            weibullEtaYears: 10,
            annualFailureRate: 0.035,
        },
        costs: {
            partCostBRL: 200,
            laborCostBRL: 400,
            repairTimeHours: 3,
        },
        riskFactors: {
            tropicalPenalty: 1.15,
            coastalPenalty: 1.4,
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.1,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'excellent',
            diyFriendly: false,
            requiresSpecialist: false,
            repairabilityScore: 6,
            disassemblyScore: 6,
        },
        dataSource: 'field_data',
        notes: 'Serviceable design. Used by Electrolux, older Brastemp. Economical repair possible.',
    },

    // ----------------------------------------
    // PUMPS
    // ----------------------------------------
    {
        id: 'washer-pump-drain',
        name: 'Eletrobomba de Drenagem',
        category: 'mechanical',
        reliability: {
            weibullBeta: 2.0,
            weibullEtaYears: 7,
            annualFailureRate: 0.06,
        },
        costs: {
            partCostBRL: 120,
            laborCostBRL: 150,
            repairTimeHours: 1,
        },
        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.1,
            heatPenalty: 1.0,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'excellent',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 8,
            disassemblyScore: 8,
        },
        dataSource: 'field_data',
        notes: 'Common failure due to foreign objects. Easy and cheap replacement.',
    },

    // ----------------------------------------
    // ELECTRONICS
    // ----------------------------------------
    {
        id: 'washer-pcb-control-potted',
        name: 'Placa Eletrônica (Potting/Resina)',
        category: 'board',
        reliability: {
            weibullBeta: 1.5,
            weibullEtaYears: 8,
            annualFailureRate: 0.05,
        },
        costs: {
            partCostBRL: 450,
            laborCostBRL: 150,
            repairTimeHours: 1.5,
        },
        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.3,
            voltageInstabilityPenalty: 1.5,
            heatPenalty: 1.3,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: false,
            repairabilityScore: 6,
            disassemblyScore: 6,
        },
        dataSource: 'field_data',
        notes: 'Potted design prevents component-level repair. Must replace entire board.',
    },
    {
        id: 'washer-pcb-control-open',
        name: 'Placa Eletrônica (Acessível)',
        category: 'board',
        reliability: {
            weibullBeta: 1.3,
            weibullEtaYears: 6,
            annualFailureRate: 0.07,
        },
        costs: {
            partCostBRL: 250,
            laborCostBRL: 100,
            repairTimeHours: 1,
        },
        riskFactors: {
            tropicalPenalty: 1.3,
            coastalPenalty: 1.5,
            voltageInstabilityPenalty: 1.4,
            heatPenalty: 1.4,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'excellent',
            diyFriendly: true,
            requiresSpecialist: false,
            repairabilityScore: 8,
            disassemblyScore: 8,
        },
        dataSource: 'field_data',
        notes: 'Open design allows component-level repair (capacitors, relays). Very cost-effective.',
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getWasherComponentById(id: string): ComponentDefinition | undefined {
    return WASHER_COMPONENTS.find(c => c.id === id);
}

export const ALL_WASHER_COMPONENTS = WASHER_COMPONENTS;
