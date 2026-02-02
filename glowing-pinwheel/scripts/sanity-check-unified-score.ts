#!/usr/bin/env npx tsx
/**
 * @file sanity-check-unified-score.ts
 * @description Micro-teste para validar getUnifiedScore.
 * 
 * Uso: npx tsx scripts/sanity-check-unified-score.ts
 * 
 * Testa 3 cenários:
 * 1. Sem scores -> 7.50
 * 2. Faltando c3 -> não quebra, usa 7.5
 * 3. Categoria alias tv -> smart-tv resolve pesos
 */

import { getUnifiedScore, normalizeCategoryId, CATEGORY_WEIGHTS } from '../src/lib/scoring/getUnifiedScore';

// ============================================
// TEST DATA
// ============================================

const productNoScores = {
    id: 'test-no-scores',
    categoryId: 'smart-tv',
    name: 'Test No Scores',
    scores: {},
};

const productMissingC3 = {
    id: 'test-missing-c3',
    categoryId: 'robot-vacuum',
    name: 'Test Missing C3',
    scores: {
        c1: 8.0,
        c2: 7.5,
        // c3 missing!
        c4: 6.5,
        c5: 7.0,
        c6: 8.0,
        c7: 7.0,
        c8: 6.0,
        c9: 7.5,
        c10: 5.0,
    },
};

const productWithAlias = {
    id: 'test-alias',
    categoryId: 'tv', // alias for 'smart-tv'
    name: 'Test Alias Resolution',
    scores: {
        c1: 8.0,
        c2: 7.0,
        c3: 7.5,
        c4: 9.0,
        c5: 6.5,
        c6: 8.5,
        c7: 7.0,
        c8: 7.0,
        c9: 6.5,
        c10: 7.0,
    },
};

// ============================================
// TEST RUNNER
// ============================================

function runTests() {
    console.log('🧪 Sanity Check: getUnifiedScore\n');
    console.log('='.repeat(50));

    let passed = 0;
    let failed = 0;

    // Test 1: Sem scores -> 7.50
    console.log('\n📌 Test 1: Produto sem scores');
    const score1 = getUnifiedScore(productNoScores as any);
    console.log(`   Score: ${score1}`);
    if (score1 === 7.50) {
        console.log('   ✅ PASSED: Retornou 7.50 como esperado');
        passed++;
    } else {
        console.log(`   ❌ FAILED: Esperado 7.50, obtido ${score1}`);
        failed++;
    }

    // Test 2: Faltando c3 -> não quebra
    console.log('\n📌 Test 2: Produto faltando c3');
    try {
        const score2 = getUnifiedScore(productMissingC3 as any);
        console.log(`   Score: ${score2}`);
        if (typeof score2 === 'number' && !isNaN(score2)) {
            console.log('   ✅ PASSED: Não quebrou, retornou número válido');
            passed++;
        } else {
            console.log(`   ❌ FAILED: Retornou valor inválido: ${score2}`);
            failed++;
        }
    } catch (error) {
        console.log(`   ❌ FAILED: Lançou exceção: ${error}`);
        failed++;
    }

    // Test 3: Alias tv -> smart-tv
    console.log('\n📌 Test 3: Alias tv -> smart-tv');
    const normalized = normalizeCategoryId('tv');
    console.log(`   normalizeCategoryId('tv') = '${normalized}'`);

    if (normalized === 'smart-tv') {
        const hasWeights = CATEGORY_WEIGHTS['smart-tv'] !== undefined;
        console.log(`   Smart-TV weights exist: ${hasWeights}`);

        const score3 = getUnifiedScore(productWithAlias as any);
        console.log(`   Score com alias: ${score3}`);

        if (normalized === 'smart-tv' && hasWeights && typeof score3 === 'number') {
            console.log('   ✅ PASSED: Alias resolvido e score calculado');
            passed++;
        } else {
            console.log('   ❌ FAILED: Problema com resolução de alias');
            failed++;
        }
    } else {
        console.log(`   ❌ FAILED: Esperado 'smart-tv', obtido '${normalized}'`);
        failed++;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Resultado: ${passed}/3 testes passaram`);

    if (failed === 0) {
        console.log('\n✅ Todos os testes passaram!');
        process.exit(0);
    } else {
        console.log(`\n❌ ${failed} teste(s) falharam`);
        process.exit(1);
    }
}

runTests();
