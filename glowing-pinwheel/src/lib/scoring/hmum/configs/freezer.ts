/**
 * @file freezer.ts
 * @description HMUM Configuration for Freezers
 * 
 * P18 Batch 02 - Converted from "10 dores.txt"
 * Source: "Diretrizes do Algoritmo de Comparação de Freezers (Mercado Brasileiro)"
 * 
 * Key focus areas:
 * - Defrost technology (convenience vs efficiency)
 * - Energy efficiency (TCO)
 * - Thermal retention during power outage
 * - Real capacity and structural integrity
 * 
 * Weights: 20+20+15+10+10+8+7+5+3+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const FREEZER_CONFIG: CategoryHMUMConfig = {
    categoryId: 'freezer',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // C1: TECNOLOGIA DE DEGELO - 20%
        {
            id: 'tecnologia_degelo',
            label: 'Tecnologia de Degelo',
            dataField: 'scores.c1',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C2: EFICIÊNCIA ENERGÉTICA (TCO) - 20%
        {
            id: 'eficiencia_energetica',
            label: 'Eficiência Energética (TCO)',
            dataField: 'scores.c2',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C3: RETENÇÃO TÉRMICA (APAGÃO) - 15%
        {
            id: 'retencao_termica',
            label: 'Retenção Térmica (Apagão)',
            dataField: 'scores.c3',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 3.0,  // Perda rápida de frio é crítico
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C4: CAPACIDADE REAL (LITROS) - 10%
        {
            id: 'capacidade_real',
            label: 'Capacidade Real (Litros)',
            dataField: 'scores.c4',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C5: INTEGRIDADE ESTRUTURAL - 10%
        {
            id: 'integridade_estrutural',
            label: 'Integridade Estrutural',
            dataField: 'scores.c5',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C6: VERSATILIDADE (DUAL FUNCTION) - 8%
        {
            id: 'versatilidade',
            label: 'Versatilidade (Dual Function)',
            dataField: 'scores.c6',
            weightSubjective: 0.08,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C7: ERGONOMIA E ACESSO - 7%
        {
            id: 'ergonomia_acesso',
            label: 'Ergonomia e Acesso',
            dataField: 'scores.c7',
            weightSubjective: 0.07,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C8: ACÚSTICA (RUÍDO) - 5%
        {
            id: 'acustica',
            label: 'Acústica (Ruído)',
            dataField: 'scores.c8',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C9: LIMPEZA E DRENO - 3%
        {
            id: 'limpeza_dreno',
            label: 'Limpeza e Dreno',
            dataField: 'scores.c9',
            weightSubjective: 0.03,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C10: INTERFACE E SEGURANÇA - 2%
        {
            id: 'interface_seguranca',
            label: 'Interface e Segurança',
            dataField: 'scores.c10',
            weightSubjective: 0.02,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },
    ],
};

export default FREEZER_CONFIG;
