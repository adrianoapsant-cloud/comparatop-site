/**
 * @file stove.ts
 * @description HMUM Configuration for Stoves & Cooktops (Fogões e Cooktops)
 * 
 * P18 Batch 01 - Converted from "10 dores.txt"
 * Source: "Diretrizes do Algoritmo de Comparação de Fogões e Cooktops (Mercado Brasileiro)"
 * 
 * Key focus areas:
 * - Glass top safety (tempered glass explosion risk)
 * - Grate stability (pot tipping prevention)
 * - Gas safety valves
 * - Burner performance (triple flame vs mega flame)
 * 
 * Weights: 20+15+15+12+10+8+8+5+5+2 = 100%
 * 
 * @version 1.0.0
 */

import type { CategoryHMUMConfig } from '../types';

export const STOVE_CONFIG: CategoryHMUMConfig = {
    categoryId: 'stove',
    hybridAlpha: 0.6,
    vetoPenalty: 0.01,

    criteria: [
        // C1: SEGURANÇA DA MESA (ESTILHAÇO) - 20%
        {
            id: 'seguranca_mesa',
            label: 'Segurança da Mesa (Estilhaço)',
            dataField: 'scores.c1',
            weightSubjective: 0.20,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            vetoThreshold: 3.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C2: ESTABILIDADE DAS TREMPES (GRADES) - 15%
        {
            id: 'estabilidade_trempes',
            label: 'Estabilidade das Trempes (Grades)',
            dataField: 'scores.c2',
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

        // C3: SEGURANÇA DE GÁS (VÁLVULAS) - 15%
        {
            id: 'seguranca_gas',
            label: 'Segurança de Gás (Válvulas)',
            dataField: 'scores.c3',
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

        // C4: DESEMPENHO DOS QUEIMADORES - 12%
        {
            id: 'desempenho_queimadores',
            label: 'Desempenho dos Queimadores',
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

        // C5: ISOLAMENTO DO FORNO - 10%
        {
            id: 'isolamento_forno',
            label: 'Isolamento do Forno',
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

        // C6: DURABILIDADE (MATERIAIS) - 8%
        {
            id: 'durabilidade',
            label: 'Durabilidade (Materiais)',
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

        // C7: FACILIDADE DE LIMPEZA - 8%
        {
            id: 'facilidade_limpeza',
            label: 'Facilidade de Limpeza',
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

        // C8: ERGONOMIA (BOTÕES) - 5%
        {
            id: 'ergonomia_botoes',
            label: 'Ergonomia (Botões)',
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

        // C9: TECNOLOGIA (TIMER/GRILL) - 5%
        {
            id: 'tecnologia',
            label: 'Tecnologia (Timer/Grill)',
            dataField: 'scores.c9',
            weightSubjective: 0.05,
            direction: 'maximize',
            missingStrategy: 'impute_penalty',
            imputeValue: 5.0,
            normalization: {
                method: 'linear',
                linearRange: { min: 0, max: 10 },
            },
        },

        // C10: EFICIÊNCIA ENERGÉTICA (GÁS/LUZ) - 2%
        {
            id: 'eficiencia_energetica',
            label: 'Eficiência Energética (Gás/Luz)',
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

export default STOVE_CONFIG;
