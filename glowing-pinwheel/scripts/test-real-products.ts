/**
 * @file test-real-products.ts
 * @description Test HMUM with REAL product data from JSON files
 * 
 * Run with: npx tsx scripts/test-real-products.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { getBaseScore, getScoreLabel } from '../src/lib/getBaseScore';
import { getHMUMBreakdown, hasHMUMSupport } from '../src/lib/getHMUMBreakdown';

// Load real product JSON
const dataPath = path.join(__dirname, '../src/data/mocks');

function loadProduct(filename: string) {
    const filePath = path.join(dataPath, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    // Transform to standard Product format
    // The mock format has nested structure with productDna.dimensions
    const product: any = {
        id: data.product?.id || filename.replace('.json', ''),
        categoryId: data.product?.category || 'smart-tv',
        name: data.product?.name || data.header?.title,
        brand: data.product?.brand,
        price: data.product?.price || 0,
        scores: {},
        specs: {},
        header: data.header,
    };

    // Extract scores from productDna.dimensions
    if (data.productDna?.dimensions) {
        for (const dim of data.productDna.dimensions) {
            product.scores[dim.id] = dim.score;
        }
    }

    return { product, originalData: data };
}

console.log('='.repeat(70));
console.log('HMUM Test with REAL Product Data');
console.log('='.repeat(70));
console.log();

// Test with LG C3
try {
    const { product, originalData } = loadProduct('lg-c3-65.json');

    console.log(`📺 ${product.name}`);
    console.log(`   Category: ${product.categoryId}`);
    console.log(`   Brand: ${product.brand}`);
    console.log();

    // Show raw scores from JSON
    console.log('   📊 Raw Scores (from Gemini/JSON):');
    Object.entries(product.scores).forEach(([id, score]) => {
        const dim = originalData.productDna?.dimensions?.find((d: any) => d.id === id);
        console.log(`      ${id}: ${score} - ${dim?.name || 'Unknown'}`);
    });
    console.log();

    // Show original overall score
    console.log(`   📋 Original Score: ${originalData.header?.overallScore} (${originalData.header?.scoreLabel})`);

    // Calculate HMUM
    const hasSupport = hasHMUMSupport(product);
    console.log(`   🔧 HMUM Support: ${hasSupport ? '✅ Yes' : '❌ No'}`);

    if (hasSupport) {
        const breakdown = getHMUMBreakdown(product);
        if (breakdown) {
            console.log(`   📈 HMUM Score: ${breakdown.score.toFixed(2)}`);
            console.log();
            console.log('   Breakdown:');
            breakdown.breakdown.forEach(item => {
                const flags = item.flags.length > 0 ? ` [${item.flags.join(', ')}]` : '';
                console.log(`      ${item.label}: raw=${item.rawValue} → norm=${item.normalizedValue} → contrib=${item.contribution.toFixed(4)}${flags}`);
            });

            if (breakdown.warnings.length > 0) {
                console.log();
                console.log('   ⚠️ Warnings:');
                breakdown.warnings.forEach(w => console.log(`      - ${w}`));
            }
        }
    }

    // Final getBaseScore result
    const finalScore = getBaseScore(product);
    const finalLabel = getScoreLabel(product);
    console.log();
    console.log(`   ✅ getBaseScore(): ${finalScore.toFixed(2)} (${finalLabel})`);
    console.log();

    // Compare
    const originalScore = originalData.header?.overallScore || 0;
    const diff = finalScore - originalScore;
    console.log(`   📊 Comparison:`);
    console.log(`      Original (Gemini): ${originalScore}`);
    console.log(`      HMUM:              ${finalScore.toFixed(2)}`);
    console.log(`      Difference:        ${diff > 0 ? '+' : ''}${diff.toFixed(2)}`);

} catch (err) {
    console.error('Error loading product:', err);
}

console.log();
console.log('='.repeat(70));
