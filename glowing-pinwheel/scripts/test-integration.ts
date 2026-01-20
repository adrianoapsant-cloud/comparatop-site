/**
 * @file test-integration.ts
 * @description Test HMUM integration with getBaseScore
 * 
 * Run with: npx tsx scripts/test-integration.ts
 */

import { getBaseScore, getScoreLabel } from '../src/lib/getBaseScore';
import { getHMUMBreakdown, hasHMUMSupport } from '../src/lib/getHMUMBreakdown';

// Mock products simulating Gemini-populated data
const mockProducts = [
    {
        id: 'samsung-qn90c-65',
        categoryId: 'smart-tv',  // Has HMUM config
        name: 'Samsung QN90C 65"',
        brand: 'Samsung',
        model: 'QN90C',
        price: 6499,
        scores: {
            c1: 9.0,   // Qualidade de Imagem
            c2: 8.5,   // HDR
            c3: 8.0,   // Smart Platform
            c4: 7.0,   // Build Quality
            c5: 9.5,   // Gaming
            c6: 7.5,   // Sound
            c7: 8.0,   // Construção
            c10: 8.0,  // Custo-Benefício
        },
        specs: {
            sistema_operacional: 'Tizen',
        },
    },
    {
        id: 'roborock-s8-pro',
        categoryId: 'robo-aspirador',  // Has HMUM config
        name: 'Roborock S8 Pro Ultra',
        brand: 'Roborock',
        model: 'S8 Pro Ultra',
        price: 5999,
        scores: {},
        specs: {
            navegacao_tech: 'LiDAR',
            succao_pa: 6000,
            bateria_min: 180,
            ruido_db: 67,
            base_features: 'Auto-Esvaziamento + Auto-Limpeza',
        },
    },
    {
        id: 'electrolux-df56',
        categoryId: 'fridge',  // Maps to 'geladeira' - Has HMUM config
        name: 'Electrolux DF56',
        brand: 'Electrolux',
        model: 'DF56',
        price: 3299,
        scores: {
            c7: 7.5,  // Construção
            c8: 6.0,  // Recursos
            c10: 8.0, // Custo-Benefício
        },
        specs: {
            selo_procel: 'A',
            capacidade_litros: 474,
            ruido_db: 38,
            tecnologia_compressor: 'Frost Free',
        },
    },
    {
        id: 'generic-blender',
        categoryId: 'liquidificador',  // NO HMUM config - uses fallback
        name: 'Generic Blender',
        brand: 'Generic',
        model: 'BL-100',
        price: 199,
        scores: {
            c1: 7.0,
            c2: 6.5,
            c3: 7.5,
        },
        header: {
            overallScore: 7.2,
            scoreLabel: 'Bom',
        },
    },
];

console.log('='.repeat(70));
console.log('HMUM Integration Test');
console.log('='.repeat(70));
console.log();

for (const product of mockProducts) {
    const hasSupport = hasHMUMSupport(product as any);
    const score = getBaseScore(product as any);
    const label = getScoreLabel(product as any);

    console.log(`📦 ${product.name}`);
    console.log(`   Category: ${product.categoryId}`);
    console.log(`   HMUM Support: ${hasSupport ? '✅ Yes' : '❌ No (fallback)'}`);
    console.log(`   Score: ${score.toFixed(2)} (${label})`);

    if (hasSupport) {
        const breakdown = getHMUMBreakdown(product as any);
        if (breakdown) {
            console.log(`   Breakdown:`);
            breakdown.breakdown.forEach(item => {
                const flags = item.flags.length > 0 ? ` [${item.flags.join(', ')}]` : '';
                console.log(`     - ${item.label}: ${item.normalizedValue} → ${item.contribution.toFixed(4)}${flags}`);
            });
            if (breakdown.warnings.length > 0) {
                console.log(`   ⚠️ Warnings: ${breakdown.warnings.join('; ')}`);
            }
        }
    }

    console.log();
}

console.log('='.repeat(70));
console.log('Summary:');
console.log(`  Products with HMUM: ${mockProducts.filter(p => hasHMUMSupport(p as any)).length}`);
console.log(`  Products with fallback: ${mockProducts.filter(p => !hasHMUMSupport(p as any)).length}`);
console.log('='.repeat(70));
