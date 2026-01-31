#!/usr/bin/env node
/**
 * validate-product-pdp.js
 * 
 * Validates that a SPECIFIC PRODUCT has all data required for SimplifiedPDP.
 * Run this AFTER scaffolding a product to ensure it will render correctly.
 * 
 * Usage: node scripts/validate-product-pdp.js [product-id]
 * Example: node scripts/validate-product-pdp.js roborock-q7-l5
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// REQUIRED FIELDS FOR PDP SECTIONS
// =============================================================================

const REQUIRED_PRODUCT_FIELDS = [
    { path: 'id', section: 'Hero', required: true },
    { path: 'name', section: 'Hero', required: true },
    { path: 'categoryId', section: 'All Sections', required: true },
    { path: 'price', section: 'Hero, TCO, Footer', required: true },
    { path: 'imageUrl', section: 'Hero', required: true },
    { path: 'scores', section: 'Radar/DNA, Audit Verdict', required: true },
    { path: 'scores.c1', section: 'Radar Chart', required: true },
    { path: 'specs', section: 'Tech Specs, Feature Benefits, TCO', required: true },
];

const OPTIONAL_PRODUCT_FIELDS = [
    { path: 'shortName', section: 'Various', recommended: true },
    { path: 'benchmarks', section: 'Benchmarks Widget', recommended: true },
    { path: 'featureBenefits', section: 'Feature Benefits Widget', recommended: true },
    { path: 'priceHistory', section: 'Price Chart', recommended: false },
    { path: 'mainCompetitor', section: 'VS Battle Bar', recommended: true },
    { path: 'recommendedAccessory', section: 'Bundle Widget', recommended: false },
    { path: 'voc', section: 'Community Consensus', recommended: true },
    { path: 'scoreReasons', section: 'Score Tooltips', recommended: true },
    { path: 'painPointsSolved', section: 'Audit Verdict', recommended: true },
    { path: 'offers', section: 'Marketplace Buttons', recommended: true },
];

const MOCK_FIELDS = [
    { path: 'voc', section: 'Community Consensus' },
    { path: 'auditVerdict', section: 'Audit Verdict' },
    { path: 'tco', section: 'TCO Section' },
    { path: 'faq', section: 'FAQ Section' },
    { path: 'decisionFAQ', section: 'FAQ Section (alt)' },
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

function findProductInFile(productId, filePath) {
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if product ID is in file
    if (!content.includes(`'${productId}'`) && !content.includes(`"${productId}"`)) {
        return null;
    }

    return { found: true, path: filePath };
}

function loadMockData(productId, basePath) {
    const mockPath = path.join(basePath, 'src', 'data', 'mocks', `${productId}.json`);
    const generatedMockPath = path.join(basePath, 'src', 'data', 'generated', 'mocks', `${productId}.json`);

    if (fs.existsSync(mockPath)) {
        return JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    }

    if (fs.existsSync(generatedMockPath)) {
        return JSON.parse(fs.readFileSync(generatedMockPath, 'utf-8'));
    }

    return null;
}

function checkAutoGenerator(basePath, generatorName) {
    const filePath = path.join(basePath, 'src', 'lib', 'pdp', `${generatorName}.ts`);
    return fs.existsSync(filePath);
}

function checkCategoryConfig(basePath, categoryId) {
    const contextProfilesPath = path.join(basePath, 'src', 'config', 'context-profiles.ts');
    if (!fs.existsSync(contextProfilesPath)) return false;

    const content = fs.readFileSync(contextProfilesPath, 'utf-8');
    return content.includes(`'${categoryId}'`) || content.includes(`"${categoryId}"`);
}

function checkUnknownUnknowns(basePath, categoryId) {
    const uuPath = path.join(basePath, 'src', 'data', 'unknown-unknowns-data.ts');
    if (!fs.existsSync(uuPath)) return false;

    const content = fs.readFileSync(uuPath, 'utf-8');
    return content.includes(`'${categoryId}'`) || content.includes(`"${categoryId}"`);
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateProduct(productId, basePath) {
    console.log('\n' + '='.repeat(70));
    console.log(`🔍 POST-REGISTRATION VALIDATION: ${productId}`);
    console.log('='.repeat(70));

    const results = [];
    let errors = 0;
    let warnings = 0;

    // 1. Check if product exists in products.ts
    console.log('\n📋 PRODUCT DATA:\n');

    const productsPath = path.join(basePath, 'src', 'data', 'products.ts');
    const generatedProductPath = path.join(basePath, 'src', 'data', 'generated', 'products', `${productId}.ts`);

    let productContent = null;
    let productLocation = null;

    if (fs.existsSync(productsPath)) {
        const content = fs.readFileSync(productsPath, 'utf-8');
        if (content.includes(`id: '${productId}'`)) {
            productLocation = 'products.ts';
            productContent = content;
        }
    }

    if (!productLocation && fs.existsSync(generatedProductPath)) {
        productLocation = `generated/products/${productId}.ts`;
        productContent = fs.readFileSync(generatedProductPath, 'utf-8');
    }

    if (!productLocation) {
        console.log(`  ❌ PRODUCT NOT FOUND: ${productId}`);
        console.log(`     Checked: products.ts, generated/products/${productId}.ts`);
        process.exit(2);
    }

    console.log(`  ✅ Product found in: ${productLocation}`);

    // 2. Check required fields
    console.log('\n📋 REQUIRED FIELDS:\n');

    for (const field of REQUIRED_PRODUCT_FIELDS) {
        // Simple heuristic: check if field appears in content
        const hasField = productContent.includes(`${field.path.split('.')[0]}:`);

        if (hasField) {
            console.log(`  ✅ ${field.path} → ${field.section}`);
            results.push({ field: field.path, status: 'ok' });
        } else {
            console.log(`  ❌ MISSING: ${field.path} → ${field.section}`);
            results.push({ field: field.path, status: 'error' });
            errors++;
        }
    }

    // 3. Check recommended fields
    console.log('\n📋 RECOMMENDED FIELDS:\n');

    for (const field of OPTIONAL_PRODUCT_FIELDS) {
        const hasField = productContent.includes(`${field.path.split('.')[0]}:`);

        if (hasField) {
            console.log(`  ✅ ${field.path} → ${field.section}`);
            results.push({ field: field.path, status: 'ok' });
        } else if (field.recommended) {
            console.log(`  ⚠️  RECOMMENDED: ${field.path} → ${field.section}`);
            results.push({ field: field.path, status: 'warning' });
            warnings++;
        } else {
            console.log(`  ⬜ Optional: ${field.path} → ${field.section}`);
            results.push({ field: field.path, status: 'optional' });
        }
    }

    // 4. Check mock data
    console.log('\n💾 MOCK DATA:\n');

    const mock = loadMockData(productId, basePath);

    if (mock) {
        console.log(`  ✅ Mock file found`);

        for (const field of MOCK_FIELDS) {
            const hasField = mock[field.path] !== undefined;
            if (hasField) {
                console.log(`  ✅ mockData.${field.path} → ${field.section}`);
            } else {
                console.log(`  ⬜ No mockData.${field.path} (auto-generator will be used)`);
            }
        }
    } else {
        console.log(`  ⬜ No mock file (auto-generators will be used for all sections)`);
    }

    // 5. Check auto-generators availability
    console.log('\n🤖 AUTO-GENERATORS:\n');

    const generators = [
        { name: 'extract-radar-dimensions', section: 'Radar/DNA' },
        { name: 'audit-verdict-generator', section: 'Audit Verdict' },
        { name: 'generate-tco', section: 'TCO' },
        { name: 'generate-feature-benefits', section: 'Feature Benefits' },
    ];

    for (const gen of generators) {
        if (checkAutoGenerator(basePath, gen.name)) {
            console.log(`  ✅ ${gen.name}.ts → ${gen.section}`);
        } else {
            console.log(`  ❌ MISSING: ${gen.name}.ts → ${gen.section}`);
            errors++;
        }
    }

    // 6. Check category-specific configs
    console.log('\n⚙️  CATEGORY CONFIG:\n');

    // Extract categoryId from content
    const categoryMatch = productContent.match(/categoryId:\s*['"]([^'"]+)['"]/);
    const categoryId = categoryMatch ? categoryMatch[1] : 'unknown';

    console.log(`  Category: ${categoryId}`);

    if (checkCategoryConfig(basePath, categoryId)) {
        console.log(`  ✅ Context profiles exist for ${categoryId}`);
    } else {
        console.log(`  ⚠️  No context profiles for ${categoryId} (using defaults)`);
        warnings++;
    }

    if (checkUnknownUnknowns(basePath, categoryId)) {
        console.log(`  ✅ Unknown Unknowns exist for ${categoryId}`);
    } else {
        console.log(`  ⚠️  No Unknown Unknowns for ${categoryId}`);
        warnings++;
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    const ok = results.filter(r => r.status === 'ok').length;

    console.log(`\n📊 SUMMARY: ${ok} OK | ${warnings} Warnings | ${errors} Errors\n`);

    if (errors > 0) {
        console.log('❌ VALIDATION FAILED - Product is missing critical data\n');
        process.exit(1);
    } else if (warnings > 0) {
        console.log('⚠️  VALIDATION PASSED WITH WARNINGS\n');
        console.log('   Some recommended fields are missing. The PDP will render but may lack content.\n');
        process.exit(0);
    } else {
        console.log('✅ PRODUCT READY FOR PDP\n');
        process.exit(0);
    }
}

// =============================================================================
// MAIN
// =============================================================================

const productId = process.argv[2];

if (!productId) {
    console.log('\n❌ ERROR: Product ID required');
    console.log('\nUsage: node scripts/validate-product-pdp.js [product-id]');
    console.log('Example: node scripts/validate-product-pdp.js roborock-q7-l5\n');
    process.exit(2);
}

const basePath = path.resolve(__dirname, '..');
validateProduct(productId, basePath);
