#!/usr/bin/env npx tsx
/// <reference types="node" />
/**
 * @file validate-scores.ts
 * @description CI Script to validate scoring data integrity
 * 
 * Validates:
 * 1. All products have scores object
 * 2. All products have complete c1..c10 keys
 * 3. Each ci is a number between 0..10
 * 4. DEFAULT_WEIGHTS and CATEGORY_WEIGHTS sum to 1.00 (±0.001 tolerance)
 * 5. Each category in CATEGORY_WEIGHTS has all c1..c10 keys
 * 
 * Exit codes:
 * - 0: All validations passed
 * - 1: Validation errors found
 * 
 * Usage:
 *   npx tsx scripts/validate-scores.ts
 *   npm run validate:scores
 */

import { ALL_PRODUCTS } from '../src/data/products.index';
import {
    DEFAULT_WEIGHTS,
    CATEGORY_WEIGHTS,
    type CriteriaKey,
    type Weights
} from '../src/lib/scoring/category-weights';

// ============================================
// CONSTANTS
// ============================================

const CRITERIA_KEYS: CriteriaKey[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];
const WEIGHT_SUM_TOLERANCE = 0.001;
const MIN_SCORE = 0;
const MAX_SCORE = 10;

// ============================================
// TYPES
// ============================================

interface ValidationError {
    type: 'product' | 'weights';
    id: string;
    message: string;
    details?: string[];
}

// ============================================
// VALIDATORS
// ============================================

function validateProductScores(): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const product of ALL_PRODUCTS) {
        const productErrors: string[] = [];

        // Check 1: scores object exists
        if (!product.scores) {
            errors.push({
                type: 'product',
                id: product.id,
                message: 'Missing scores object',
            });
            continue;
        }

        // Check 2: All c1..c10 keys exist
        const missingKeys: string[] = [];
        for (const key of CRITERIA_KEYS) {
            if (!(key in product.scores)) {
                missingKeys.push(key);
            }
        }

        if (missingKeys.length > 0) {
            productErrors.push(`Missing keys: ${missingKeys.join(', ')}`);
        }

        // Check 3: Each key is a number in 0..10
        for (const key of CRITERIA_KEYS) {
            const value = product.scores[key];
            if (value !== undefined) {
                if (typeof value !== 'number') {
                    productErrors.push(`${key} is not a number (got ${typeof value})`);
                } else if (value < MIN_SCORE || value > MAX_SCORE) {
                    productErrors.push(`${key}=${value} is out of range [0..10]`);
                }
            }
        }

        if (productErrors.length > 0) {
            errors.push({
                type: 'product',
                id: product.id,
                message: `Score validation failed`,
                details: productErrors,
            });
        }
    }

    return errors;
}

function validateWeights(weights: Weights, name: string): ValidationError | null {
    const errors: string[] = [];

    // Check 1: All c1..c10 keys exist
    const missingKeys: string[] = [];
    for (const key of CRITERIA_KEYS) {
        if (!(key in weights)) {
            missingKeys.push(key);
        }
    }

    if (missingKeys.length > 0) {
        errors.push(`Missing keys: ${missingKeys.join(', ')}`);
    }

    // Check 2: All values are numbers
    for (const key of CRITERIA_KEYS) {
        const value = weights[key];
        if (value !== undefined && typeof value !== 'number') {
            errors.push(`${key} is not a number (got ${typeof value})`);
        }
    }

    // Check 3: Sum equals 1.00 (±tolerance)
    const sum = CRITERIA_KEYS.reduce((acc, key) => acc + (weights[key] ?? 0), 0);
    const diff = Math.abs(sum - 1.0);

    if (diff > WEIGHT_SUM_TOLERANCE) {
        errors.push(`Sum=${sum.toFixed(6)} differs from 1.00 by ${diff.toFixed(6)} (tolerance: ${WEIGHT_SUM_TOLERANCE})`);
    }

    if (errors.length > 0) {
        return {
            type: 'weights',
            id: name,
            message: `Weight validation failed`,
            details: errors,
        };
    }

    return null;
}

function validateAllWeights(): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate DEFAULT_WEIGHTS
    const defaultError = validateWeights(DEFAULT_WEIGHTS, 'DEFAULT_WEIGHTS');
    if (defaultError) {
        errors.push(defaultError);
    }

    // Validate each CATEGORY_WEIGHTS entry
    for (const [categoryId, weights] of Object.entries(CATEGORY_WEIGHTS)) {
        const categoryError = validateWeights(weights, `CATEGORY_WEIGHTS['${categoryId}']`);
        if (categoryError) {
            errors.push(categoryError);
        }
    }

    return errors;
}

// ============================================
// MAIN
// ============================================

function main(): void {
    console.log('🔍 Validating Scoring Data Integrity...\n');
    console.log(`📦 Products to validate: ${ALL_PRODUCTS.length}`);
    console.log(`📊 Category weights to validate: ${Object.keys(CATEGORY_WEIGHTS).length + 1} (including DEFAULT)\n`);

    const productErrors = validateProductScores();
    const weightErrors = validateAllWeights();
    const allErrors = [...productErrors, ...weightErrors];

    // Report results
    if (allErrors.length === 0) {
        console.log('✅ All validations passed!\n');
        console.log('Summary:');
        console.log(`  • ${ALL_PRODUCTS.length} products validated`);
        console.log(`  • ${Object.keys(CATEGORY_WEIGHTS).length} category weights validated`);
        console.log(`  • DEFAULT_WEIGHTS validated`);
        console.log(`  • All scores in range [0..10]`);
        console.log(`  • All weights sum to 1.00`);
        process.exit(0);
    }

    // Print errors
    console.log(`❌ Found ${allErrors.length} validation error(s):\n`);

    // Group errors by type
    const productProblems = allErrors.filter(e => e.type === 'product');
    const weightProblems = allErrors.filter(e => e.type === 'weights');

    if (productProblems.length > 0) {
        console.log('🛒 Product Errors:');
        console.log('─'.repeat(50));
        for (const error of productProblems) {
            console.log(`\n  ❌ ${error.id}`);
            console.log(`     ${error.message}`);
            if (error.details) {
                for (const detail of error.details) {
                    console.log(`       • ${detail}`);
                }
            }
        }
        console.log();
    }

    if (weightProblems.length > 0) {
        console.log('⚖️  Weight Errors:');
        console.log('─'.repeat(50));
        for (const error of weightProblems) {
            console.log(`\n  ❌ ${error.id}`);
            console.log(`     ${error.message}`);
            if (error.details) {
                for (const detail of error.details) {
                    console.log(`       • ${detail}`);
                }
            }
        }
        console.log();
    }

    // Summary
    console.log('─'.repeat(50));
    console.log(`\n📋 Summary:`);
    console.log(`   Products with errors: ${productProblems.length}/${ALL_PRODUCTS.length}`);
    console.log(`   Weight configs with errors: ${weightProblems.length}/${Object.keys(CATEGORY_WEIGHTS).length + 1}`);
    console.log(`\n💡 Fix the above errors to ensure scoring data integrity.`);
    console.log(`   Runtime will use fallback score (7.5) for invalid products.\n`);

    process.exit(1);
}

main();
