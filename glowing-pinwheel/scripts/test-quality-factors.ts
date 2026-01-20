/**
 * @file test-quality-factors.ts
 * @description Script de teste para verificar os Quality Factors do SIC
 * 
 * Execute com: npx ts-node scripts/test-quality-factors.ts
 */

import { calculateSIC } from '../src/lib/scoring/component-engine';
import { calculateAdjustedVUE, calculateQualityMultiplier } from '../src/data/components/quality-factors';

console.log('========================================');
console.log('SIC Quality Factors - Verification Test');
console.log('========================================\n');

// Test products with expected VUE values from the report
const testCases = [
    {
        productId: 'samsung-qn90c-65',
        name: 'Samsung QN90C 65" (Mini-LED Premium)',
        expectedVUE: 11.02,  // 10 × 1.05 × 1.05
        categoryBaseVUE: 10,
    },
    {
        productId: 'lg-c3-65',
        name: 'LG C3 OLED 65" (OLED Evo Premium)',
        expectedVUE: 12.07,  // 10 × 1.05 × 1.15
        categoryBaseVUE: 10,
    },
    {
        productId: 'tcl-c735-65',
        name: 'TCL C735 65" (QLED Budget)',
        expectedVUE: 6.8,    // 10 × 0.80 × 0.85
        categoryBaseVUE: 10,
    },
];

console.log('1. Testing Quality Multipliers:');
console.log('--------------------------------\n');

for (const test of testCases) {
    const { brandFactor, techFactor, combined } = calculateQualityMultiplier(test.productId);
    const adjustedVUE = calculateAdjustedVUE(test.categoryBaseVUE, test.productId);

    console.log(`📺 ${test.name}`);
    console.log(`   πMarca: ${brandFactor.toFixed(2)}`);
    console.log(`   πTech:  ${techFactor.toFixed(2)}`);
    console.log(`   Combined: ${combined.toFixed(2)}`);
    console.log(`   VUE Calculada: ${adjustedVUE} anos`);
    console.log(`   VUE Esperada:  ${test.expectedVUE} anos`);
    console.log(`   Status: ${Math.abs(adjustedVUE - test.expectedVUE) < 0.5 ? '✅ OK' : '❌ DIVERGÊNCIA'}`);
    console.log('');
}

console.log('\n2. Testing Full SIC Calculation:');
console.log('--------------------------------\n');

for (const test of testCases) {
    const sicResult = calculateSIC(test.productId);

    if (sicResult) {
        console.log(`📺 ${test.name}`);
        console.log(`   VUE Final: ${sicResult.estimatedLifespanYears} anos`);
        console.log(`   Componente Limitante: ${sicResult.limitingComponent.name}`);
        console.log(`   Vida Base do Componente: ${sicResult.limitingComponent.estimatedLifeYears} anos`);
        if (sicResult.qualityFactors) {
            console.log(`   Brand Factor: ${sicResult.qualityFactors.brandFactor}`);
            console.log(`   Tech Factor: ${sicResult.qualityFactors.techFactor}`);
            console.log(`   Brand Tier: ${sicResult.qualityFactors.brandTier || 'N/A'}`);
            console.log(`   Display Tech: ${sicResult.qualityFactors.displayTechnology || 'N/A'}`);
        }
        if (sicResult.warnings && sicResult.warnings.length > 0) {
            console.log(`   ⚠️ Warnings: ${sicResult.warnings.join(', ')}`);
        }
        console.log(`   Status: ${sicResult.estimatedLifespanYears >= 6 && sicResult.estimatedLifespanYears <= 13 ? '✅ Dentro do esperado' : '⚠️ Verificar'}`);
    } else {
        console.log(`📺 ${test.name}`);
        console.log(`   ❌ Produto não mapeado no SIC`);
    }
    console.log('');
}

console.log('\n========================================');
console.log('Expected Results Summary:');
console.log('========================================');
console.log('Samsung QN90C: ~11 anos (Premium × Mini-LED)');
console.log('LG C3 OLED:    ~12 anos (Premium × OLED Evo)');
console.log('TCL C735:      ~7 anos  (Budget × Edge LED)');
console.log('========================================\n');
