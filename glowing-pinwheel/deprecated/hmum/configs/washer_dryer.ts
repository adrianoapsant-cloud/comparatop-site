/**
 * @file washer_dryer.ts
 * @description HMUM Configuration for Washer-Dryers (Lava e Seca)
 * 
 * P18 Batch 01 - Converted from "10 dores.txt"
 * Source: "Diretrizes do Algoritmo de Comparação de Lava e Seca (Mercado Brasileiro)"
 * 
 * Key focus areas:
 * - Mechanical durability (tripod axis failure is common)
 * - Drying safety (recalls, sensor accuracy)
 * - Repairability and parts availability
 * - Real drying capacity (rule of 2/3)
 * 
 * Weights: 15+15+12+12+10+8+8+8+7+5 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const WASHER_DRYER_CONFIG: CategoryHMUMConfig = {
    categoryId: 'washer_dryer',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // C1: DURABILIDADE MECÂNICA (EIXO TRIPÉ) - 15%
        {
            id: 'durabilidade_mecanica',
            label: 'Durabilidade Mecânica (Eixo Tripé)',
            dataField: 'scores.c1',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 3.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C2: SEGURANÇA DE SECAGEM - 15%
        {
            id: 'seguranca_secagem',
            label: 'Segurança de Secagem',
            dataField: 'scores.c2',
            weightSubjective: 0.15,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 2.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C3: REPARABILIDADE & PEÇAS - 12%
        {
            id: 'reparabilidade',
            label: 'Reparabilidade & Peças',
            dataField: 'scores.c3',
            weightSubjective: 0.12,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C4: CAPACIDADE REAL (REGRA 2/3) - 12%
        {
            id: 'capacidade_real',
            label: 'Capacidade Real (Regra 2/3)',
            dataField: 'scores.c4',
            weightSubjective: 0.12,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C5: ACÚSTICA & VIBRAÇÃO - 10%
        {
            id: 'acustica_vibracao',
            label: 'Acústica & Vibração',
            dataField: 'scores.c5',
            weightSubjective: 0.10,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 6.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C6: PRESERVAÇÃO TÊXTIL (AMASSADOS) - 8%
        {
            id: 'preservacao_textil',
            label: 'Preservação Têxtil (Amassados)',
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

        // C7: CONECTIVIDADE IoT - 8%
        {
            id: 'conectividade',
            label: 'Conectividade IoT',
            dataField: 'scores.c7',
            weightSubjective: 0.08,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C8: EFICIÊNCIA (ÁGUA/LUZ) - 8%
        {
            id: 'eficiencia',
            label: 'Eficiência (Água/Luz)',
            dataField: 'scores.c8',
            weightSubjective: 0.08,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C9: AGILIDADE (CICLOS RÁPIDOS) - 7%
        {
            id: 'agilidade',
            label: 'Agilidade (Ciclos Rápidos)',
            dataField: 'scores.c9',
            weightSubjective: 0.07,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C10: SUPORTE PÓS-VENDA - 5%
        {
            id: 'pos_venda',
            label: 'Suporte Pós-Venda',
            dataField: 'scores.c10',
            weightSubjective: 0.05,
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

export default WASHER_DRYER_CONFIG;
