#!/usr/bin/env npx tsx
/**
 * @file validate-score-baseline.ts
 * @description Valida que os scores após refatoração batem com o baseline.
 * 
 * Uso: npx tsx scripts/validate-score-baseline.ts
 * 
 * Exit code 0 = todos os scores dentro da tolerância
 * Exit code 1 = algum score divergiu mais que o permitido
 */

import * as fs from 'fs';
import * as path from 'path';

// Import all products
import { SAMPLE_TVS, SAMPLE_FRIDGES, SAMPLE_AIR_CONDITIONERS } from '../src/data/products';

// Import robot vacuum entries
import { liectroux_xr500_pro } from '../src/data/products.entry.liectroux-xr500-pro';
import { wkjwqwhy_a6s } from '../src/data/products.entry.wkjwqwhy-a6s';
import { xiaomi_robot_vacuum_s40c } from '../src/data/products.entry.xiaomi-robot-vacuum-s40c';
import { wap_robot_w90 } from '../src/data/products.entry.wap-robot-w90';
import { xiaomi_robot_vacuum_s20_plus_white } from '../src/data/products.entry.xiaomi-robot-vacuum-s20-plus-white';
import { samsung_vr5000rm } from '../src/data/products.entry.samsung-vr5000rm';
import { kabum_smart_700 } from '../src/data/products.entry.kabum-smart-700';
import { product as philco_pas26p } from '../src/data/products.entry.philco-pas26p';
import { wap_robot_w400 } from '../src/data/products.entry.wap-robot-w400';
import { roborock_q7_l5 } from '../src/data/products.entry.roborock-q7-l5';
import { electrolux_erb20_home_control_experience } from '../src/data/products.entry.electrolux-erb20-home-control-experience';
import { liectroux_l200_robo_aspirador_3em1_app_alexa_google } from '../src/data/products.entry.liectroux-l200-robo-aspirador-3em1-app-alexa-google';
import { xiaomi_robot_x10 } from '../src/data/products.entry.xiaomi-robot-x10';
import { ezs_e10 } from '../src/data/products.entry.ezs-e10';
import { eufy_x10_pro_omni } from '../src/data/products.entry.eufy-x10-pro-omni';
import { eufy_omni_c20 } from '../src/data/products.entry.eufy-omni-c20';
import { xiaomi_robot_vacuum_x20_pro } from '../src/data/products.entry.xiaomi-robot-vacuum-x20-pro';

// Import NEW getBaseScore (after refactoring)
import { getBaseScore } from '../src/lib/getBaseScore';

// Aggregate all robot vacuums
const ROBOT_VACUUMS = [
    liectroux_xr500_pro,
    wkjwqwhy_a6s,
    xiaomi_robot_vacuum_s40c,
    wap_robot_w90,
    xiaomi_robot_vacuum_s20_plus_white,
    samsung_vr5000rm,
    kabum_smart_700,
    philco_pas26p,
    wap_robot_w400,
    roborock_q7_l5,
    electrolux_erb20_home_control_experience,
    liectroux_l200_robo_aspirador_3em1_app_alexa_google,
    xiaomi_robot_x10,
    ezs_e10,
    eufy_x10_pro_omni,
    eufy_omni_c20,
    xiaomi_robot_vacuum_x20_pro,
];

// Combine all products
const ALL_PRODUCTS = [
    ...SAMPLE_TVS,
    ...SAMPLE_FRIDGES,
    ...SAMPLE_AIR_CONDITIONERS,
    ...ROBOT_VACUUMS,
];

// Tolerância máxima para diferença de score
const MAX_TOLERANCE = 0.01;

interface ScoreBaseline {
    generatedAt: string;
    totalProducts: number;
    products: Record<string, {
        name: string;
        categoryId: string;
        currentScore: number;
        hasScores: boolean;
    }>;
}

async function main() {
    console.log('🔍 Validando scores contra baseline...\n');

    // Load baseline
    const baselinePath = path.join(__dirname, 'qa-snapshots', 'score-baseline.json');

    if (!fs.existsSync(baselinePath)) {
        console.error('❌ Baseline não encontrado!');
        console.error('   Execute primeiro: npx tsx scripts/generate-score-baseline.ts');
        process.exit(1);
    }

    const baseline: ScoreBaseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
    console.log(`📅 Baseline de: ${baseline.generatedAt}`);
    console.log(`📦 Total produtos no baseline: ${baseline.totalProducts}\n`);

    let passed = 0;
    let failed = 0;
    const failures: { id: string; expected: number; actual: number; diff: number }[] = [];

    for (const product of ALL_PRODUCTS) {
        const baselineData = baseline.products[product.id];

        if (!baselineData) {
            console.log(`⚠️  ${product.id}: não existe no baseline (produto novo?)`);
            continue;
        }

        const newScore = getBaseScore(product as any);
        const diff = Math.abs(newScore - baselineData.currentScore);

        if (diff <= MAX_TOLERANCE) {
            passed++;
            console.log(`✅ ${product.id}: ${newScore.toFixed(2)} (baseline: ${baselineData.currentScore.toFixed(2)})`);
        } else {
            failed++;
            failures.push({
                id: product.id,
                expected: baselineData.currentScore,
                actual: newScore,
                diff,
            });
            console.log(`❌ ${product.id}: ${newScore.toFixed(2)} (baseline: ${baselineData.currentScore.toFixed(2)}, diff: ${diff.toFixed(4)})`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Resultado: ${passed} passou, ${failed} falhou`);

    if (failures.length > 0) {
        console.log('\n🚨 FALHAS DETECTADAS:');
        for (const f of failures) {
            console.log(`   ${f.id}: esperado ${f.expected.toFixed(2)}, obtido ${f.actual.toFixed(2)} (diff: ${f.diff.toFixed(4)})`);
        }
        console.log('\n❌ Validação FALHOU - scores divergiram do baseline');
        process.exit(1);
    } else {
        console.log('\n✅ Validação PASSOU - todos os scores dentro da tolerância');
        process.exit(0);
    }
}

main().catch(console.error);
