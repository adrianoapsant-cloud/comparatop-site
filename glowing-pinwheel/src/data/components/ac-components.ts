/**
 * @file ac-components.ts
 * @description Component database for Air Conditioners (Split Inverter)
 * 
 * Based on Deep Research report: "Análise Qualidade Componentes Ar e Notebooks"
 * 
 * Key findings:
 * - GMCC compressors (Midea/Toshiba JV) are the industry standard
 * - Gree/Landa compressors offer superior thermal tolerance
 * - Gold Fin coating provides best corrosion resistance
 * - Inverter PCBs are the main failure point (4-8 years)
 * 
 * @version 1.0.0
 */

import type { ComponentDefinition } from './types';

// ============================================
// AC COMPONENT DEFINITIONS
// ============================================

export const AC_COMPONENTS: ComponentDefinition[] = [
    // ----------------------------------------
    // COMPRESSORS
    // ----------------------------------------
    {
        id: 'ac-compressor-gmcc-inverter',
        name: 'Compressor GMCC Rotativo Inverter',
        category: 'compressor',
        reliability: {
            weibullBeta: 3.5,
            weibullEtaYears: 15,
            annualFailureRate: 0.02,
        },
        costs: {
            partCostBRL: 1200,
            laborCostBRL: 800,
            repairTimeHours: 4,
        },
        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.2,
            heatPenalty: 1.15,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'excellent',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 6,
            disassemblyScore: 6,
        },
        dataSource: 'field_data',
        notes: 'Industry standard. Used by Midea, Elgin, Philco, Carrier. Requires certified HVAC tech.',
    },
    {
        id: 'ac-compressor-landa-inverter',
        name: 'Compressor Landa (Gree) Inverter',
        category: 'compressor',
        reliability: {
            weibullBeta: 4.0,
            weibullEtaYears: 18,
            annualFailureRate: 0.015,
        },
        costs: {
            partCostBRL: 1400,
            laborCostBRL: 800,
            repairTimeHours: 4,
        },
        riskFactors: {
            tropicalPenalty: 1.0,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.1,
            heatPenalty: 1.05,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 6,
            disassemblyScore: 6,
        },
        dataSource: 'field_data',
        notes: 'Premium quality. Gree exclusive. Built with superior thermal/electrical margins.',
    },
    {
        id: 'ac-compressor-rechi-inverter',
        name: 'Compressor Rechi Inverter',
        category: 'compressor',
        reliability: {
            weibullBeta: 3.0,
            weibullEtaYears: 12,
            annualFailureRate: 0.035,
        },
        costs: {
            partCostBRL: 900,
            laborCostBRL: 800,
            repairTimeHours: 4,
        },
        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 1.0,
            voltageInstabilityPenalty: 1.3,
            heatPenalty: 1.25,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 6,
            disassemblyScore: 6,
        },
        dataSource: 'field_data',
        notes: 'Budget option. Lower efficiency at partial loads. Less thermal tolerance.',
    },

    // ----------------------------------------
    // HEAT EXCHANGERS (COILS)
    // ----------------------------------------
    {
        id: 'ac-coil-copper-gold-fin',
        name: 'Serpentina Cobre com Gold Fin',
        category: 'coil',
        reliability: {
            weibullBeta: 5.0,
            weibullEtaYears: 20,
            annualFailureRate: 0.01,
        },
        costs: {
            partCostBRL: 800,
            laborCostBRL: 500,
            repairTimeHours: 6,
        },
        riskFactors: {
            tropicalPenalty: 1.0,
            coastalPenalty: 1.1,
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.0,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 5,
            disassemblyScore: 5,
        },
        dataSource: 'manufacturer',
        notes: 'Premium coil. Copper tubes with hydrophilic gold coating. Best coastal resistance.',
    },
    {
        id: 'ac-coil-aluminum-blue-fin',
        name: 'Serpentina Alumínio com Blue Fin',
        category: 'coil',
        reliability: {
            weibullBeta: 3.5,
            weibullEtaYears: 12,
            annualFailureRate: 0.025,
        },
        costs: {
            partCostBRL: 600,
            laborCostBRL: 600,
            repairTimeHours: 6,
        },
        riskFactors: {
            tropicalPenalty: 1.1,
            coastalPenalty: 1.5,
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.1,
        },
        repairability: {
            hasServiceManual: true,
            partsAvailability: 'good',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 4,
            disassemblyScore: 4,
        },
        dataSource: 'field_data',
        notes: 'Standard coil. Aluminum with epoxy coating. Susceptible to galvanic corrosion near coast.',
    },
    {
        id: 'ac-coil-aluminum-uncoated',
        name: 'Serpentina Alumínio Sem Revestimento',
        category: 'coil',
        reliability: {
            weibullBeta: 2.5,
            weibullEtaYears: 7,
            annualFailureRate: 0.06,
        },
        costs: {
            partCostBRL: 400,
            laborCostBRL: 600,
            repairTimeHours: 6,
        },
        riskFactors: {
            tropicalPenalty: 1.2,
            coastalPenalty: 2.5,
            voltageInstabilityPenalty: 1.0,
            heatPenalty: 1.15,
        },
        repairability: {
            hasServiceManual: false,
            partsAvailability: 'limited',
            diyFriendly: false,
            requiresSpecialist: true,
            repairabilityScore: 3,
            disassemblyScore: 3,
        },
        dataSource: 'field_data',
        notes: 'Budget coil. No corrosion protection. High failure risk in coastal areas.',
    },

    // ----------------------------------------
    // INVERTER PCB
    // ----------------------------------------
    {
        id: 'ac-pcb-inverter-premium',
        name: 'Placa Inverter Premium (Rubycon/Nichicon)',
        category: 'board',
        reliability: {
            weibullBeta: 1.8,
            weibullEtaYears: 10,
            annualFailureRate: 0.04,
        },
        costs: {
            partCostBRL: 800,
            laborCostBRL: 200,
            repairTimeHours: 2,
        },
        riskFactors: {
            tropicalPenalty: 1.15,
            coastalPenalty: 1.3,
            voltageInstabilityPenalty: 1.4,
            heatPenalty: 1.3,
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
        notes: 'Premium capacitors. Used by Daikin, Fujitsu, Gree premium lines.',
    },
    {
        id: 'ac-pcb-inverter-standard',
        name: 'Placa Inverter Padrão (Aishi/CapXon)',
        category: 'board',
        reliability: {
            weibullBeta: 1.5,
            weibullEtaYears: 6,
            annualFailureRate: 0.08,
        },
        costs: {
            partCostBRL: 500,
            laborCostBRL: 200,
            repairTimeHours: 2,
        },
        riskFactors: {
            tropicalPenalty: 1.25,
            coastalPenalty: 1.4,
            voltageInstabilityPenalty: 1.6,
            heatPenalty: 1.5,
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
        notes: 'Standard caps. Used by Midea, Carrier, Elgin. Main failure point of budget ACs.',
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getACComponentById(id: string): ComponentDefinition | undefined {
    return AC_COMPONENTS.find(c => c.id === id);
}

export const ALL_AC_COMPONENTS = AC_COMPONENTS;
