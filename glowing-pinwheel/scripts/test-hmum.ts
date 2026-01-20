/**
 * @file test-hmum.ts
 * @description Test script for HMUM calculations
 * 
 * Run with: npx tsx scripts/test-hmum.ts
 */

import {
    calculateHMUMScore,
    calculateCRITICWeights,
    rankByHMUM,
} from '../src/lib/scoring/hmum/index.js';

import { ROBO_ASPIRADOR_CONFIG } from '../src/lib/scoring/hmum/configs/index.js';

// ============================================
// TEST DATA: Robot Vacuums
// ============================================

const testProducts = [
    {
        id: 'roborock-s8-pro',
        name: 'Roborock S8 Pro Ultra',
        specs: {
            navegacao_tech: 'LiDAR',
            succao_pa: 6000,
            bateria_min: 180,
            ruido_db: 67,
            base_features: 'Auto-Esvaziamento + Auto-Limpeza',
        },
    },
    {
        id: 'xiaomi-s10',
        name: 'Xiaomi Robot Vacuum S10',
        specs: {
            navegacao_tech: 'LiDAR',
            succao_pa: 4000,
            bateria_min: 130,
            ruido_db: 65,
            base_features: 'Auto-Recarga',
        },
    },
    {
        id: 'roomba-i3',
        name: 'iRobot Roomba i3+',
        specs: {
            navegacao_tech: 'VSLAM',
            succao_pa: 2000,
            bateria_min: 75,
            ruido_db: 68,
            base_features: 'Auto-Esvaziamento',
        },
    },
    {
        id: 'generic-budget',
        name: 'Generic Budget Robot',
        specs: {
            navegacao_tech: 'Giroscópio',  // VETO! Below VSLAM
            succao_pa: 2500,
            bateria_min: 90,
            ruido_db: 72,
            base_features: 'Manual',
        },
    },
    {
        id: 'loud-robot',
        name: 'Generic Loud Robot',
        specs: {
            navegacao_tech: 'VSLAM',
            succao_pa: 3000,
            bateria_min: 100,
            ruido_db: 85,  // VETO! Above 80dB
            base_features: 'Auto-Recarga',
        },
    },
];

// ============================================
// RUN TESTS
// ============================================

console.log('='.repeat(60));
console.log('HMUM Test - Robot Vacuums');
console.log('='.repeat(60));
console.log();

// Calculate CRITIC weights first (optional, for objective weighting)
const criticWeights = calculateCRITICWeights(testProducts, ROBO_ASPIRADOR_CONFIG.criteria);

console.log('📊 CRITIC Weights (Objective):');
Object.entries(criticWeights).forEach(([id, weight]) => {
    console.log(`  ${id}: ${(weight * 100).toFixed(1)}%`);
});
console.log();

// Calculate HMUM scores for each product
const results = testProducts.map(product =>
    calculateHMUMScore(product, ROBO_ASPIRADOR_CONFIG, criticWeights)
);

// Rank by score
const ranked = rankByHMUM(results);

console.log('🏆 HMUM Rankings:');
console.log('-'.repeat(60));

ranked.forEach((result, index) => {
    const product = testProducts.find(p => p.id === result.productId);
    const hasVeto = result.breakdown.some(b => b.flags.includes('VETO'));

    console.log(`${index + 1}. ${product?.name}`);
    console.log(`   Score: ${result.score.toFixed(2)}${hasVeto ? ' ⚠️ VETO' : ''}`);
    console.log(`   Breakdown:`);

    result.breakdown.forEach(b => {
        const flags = b.flags.length > 0 ? ` [${b.flags.join(', ')}]` : '';
        console.log(`     - ${b.label}: ${b.normalizedValue} (w=${(b.finalWeight * 100).toFixed(1)}%)${flags}`);
    });

    if (result.warnings.length > 0) {
        console.log(`   Warnings: ${result.warnings.join('; ')}`);
    }

    console.log();
});

// Summary
console.log('='.repeat(60));
console.log('Summary:');
console.log(`  Products tested: ${testProducts.length}`);
console.log(`  Products with VETO: ${results.filter(r => r.breakdown.some(b => b.flags.includes('VETO'))).length}`);
console.log(`  Calculation time: ${results.reduce((sum, r) => sum + r.metadata.calculationTimeMs, 0).toFixed(2)}ms total`);
console.log('='.repeat(60));
