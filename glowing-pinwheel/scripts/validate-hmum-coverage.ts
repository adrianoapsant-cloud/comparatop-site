/**
 * @file validate-hmum-coverage.ts
 * @description P18 Anti-regression validator for HMUM configs
 * 
 * Validates:
 * 1. All 54 RAW_CATEGORIES have HMUM config (direct or via alias)
 * 2. Weights sum to 100% (1.0 ±0.01)
 * 3. No redundant aliases (alias for id that has direct config)
 * 
 * Run: npx tsx scripts/validate-hmum-coverage.ts
 */

import { CATEGORIES, getAllCategoryIds } from '../src/data/categories';
import {
    HMUM_CONFIGS,
    HMUM_CONFIG_ALIASES,
    getHmumConfigForCategory
} from '../src/lib/scoring/hmum/configs';

interface ValidationResult {
    passed: boolean;
    categoryId: string;
    issue?: string;
    weightSum?: number;
}

const WEIGHT_TOLERANCE = 0.01;

function validateCoverage(): void {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          P18 HMUM Coverage Validation                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const canonicalIds = getAllCategoryIds();
    const results: ValidationResult[] = [];
    let passed = 0;
    let failed = 0;

    console.log(`📊 RAW_CATEGORIES: ${canonicalIds.length} categoryIds\n`);
    console.log('Validating coverage...\n');

    // 1. Check each canonical categoryId has a config
    for (const categoryId of canonicalIds) {
        const config = getHmumConfigForCategory(categoryId);

        if (!config) {
            results.push({
                passed: false,
                categoryId,
                issue: 'NO_CONFIG - Missing HMUM config'
            });
            failed++;
            continue;
        }

        // 2. Validate weights sum to 100%
        const weightSum = config.criteria.reduce((sum, c) => sum + c.weightSubjective, 0);
        const isValidWeight = Math.abs(weightSum - 1.0) <= WEIGHT_TOLERANCE;

        if (!isValidWeight) {
            results.push({
                passed: false,
                categoryId,
                issue: `INVALID_WEIGHT - Sum=${(weightSum * 100).toFixed(1)}% (expected 100%)`,
                weightSum
            });
            failed++;
            continue;
        }

        results.push({ passed: true, categoryId, weightSum });
        passed++;
    }

    // 3. Check for redundant aliases
    const redundantAliases: string[] = [];
    for (const [aliasId, targetSlug] of Object.entries(HMUM_CONFIG_ALIASES)) {
        // If the aliasId exists directly in HMUM_CONFIGS (not via the alias target)
        if (aliasId in HMUM_CONFIGS && aliasId !== targetSlug) {
            redundantAliases.push(`${aliasId} → ${targetSlug} (but ${aliasId} has direct config!)`);
        }
    }

    // Print results
    console.log('─────────────────────────────────────────────────────────────');

    const failedResults = results.filter(r => !r.passed);
    if (failedResults.length > 0) {
        console.log('❌ FAILURES:\n');
        for (const r of failedResults) {
            console.log(`  • ${r.categoryId}: ${r.issue}`);
        }
        console.log('');
    }

    if (redundantAliases.length > 0) {
        console.log('⚠️  REDUNDANT ALIASES (should be removed):\n');
        for (const alias of redundantAliases) {
            console.log(`  • ${alias}`);
        }
        console.log('');
        failed += redundantAliases.length;
    }

    // Summary
    console.log('─────────────────────────────────────────────────────────────');
    console.log('\n📈 SUMMARY\n');
    console.log(`  Total categoryIds:     ${canonicalIds.length}`);
    console.log(`  Configs found:         ${passed}`);
    console.log(`  Missing/Invalid:       ${failed}`);
    console.log(`  Aliases:               ${Object.keys(HMUM_CONFIG_ALIASES).length}`);
    console.log(`  Redundant aliases:     ${redundantAliases.length}`);
    console.log('');

    if (failed === 0 && redundantAliases.length === 0) {
        console.log('✅ ALL VALIDATIONS PASSED!\n');
        process.exit(0);
    } else {
        console.log('❌ VALIDATION FAILED\n');
        process.exit(1);
    }
}

validateCoverage();
