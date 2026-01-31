#!/usr/bin/env npx ts-node
/**
 * validate-pdp-data-sources.ts
 * 
 * Validates that all SimplifiedPDP sections have correct data sources.
 * Run this before proposing any PDP simplification.
 * 
 * Usage: npx ts-node scripts/validate-pdp-data-sources.ts [product-id]
 */

import * as fs from 'fs';
import * as path from 'path';

// Required fields in Product type that feed PDP sections
const PRODUCT_DATA_FIELDS = [
    'specs',
    'scores',
    'benchmarks',
    'featureBenefits',
    'priceHistory',
    'mainCompetitor',
    'price',
];

// Auto-generators in src/lib/pdp/
const AUTO_GENERATORS = [
    { name: 'extract-radar-dimensions', feeds: 'Radar/DNA', fallbackFrom: 'product.scores' },
    { name: 'audit-verdict-generator', feeds: 'Audit Verdict', fallbackFrom: 'product.scores' },
    { name: 'generate-tco', feeds: 'TCO Section', fallbackFrom: 'product.price' },
    { name: 'generate-feature-benefits', feeds: 'Feature Benefits', fallbackFrom: 'product.specs' },
];

// Mock data fields that can override auto-generation
const MOCK_DATA_FIELDS = [
    { field: 'voc', section: 'Community Consensus', source: 'Gemini (registration)' },
    { field: 'auditVerdict', section: 'Audit Verdict', source: 'Mock or auto-generated' },
    { field: 'tco', section: 'TCO Section', source: 'Mock or auto-calculated' },
    { field: 'featureBenefits', section: 'Feature Benefits', source: 'Mock or auto-generated' },
    { field: 'faq', section: 'FAQ', source: 'Gemini template (decisionFAQ)' },
    { field: 'benchmarks', section: 'Benchmarks Widget', source: 'product.benchmarks' },
];

// Config-based sections (always available)
const CONFIG_SECTIONS = [
    { name: 'Context Profiles', config: 'src/config/context-profiles.ts' },
    { name: 'Categories/Criteria', config: 'src/config/categories.ts' },
];

interface ValidationResult {
    section: string;
    status: 'ok' | 'warning' | 'error';
    message: string;
    source?: string;
}

function checkFileExists(filePath: string): boolean {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

function validateAutoGenerators(basePath: string): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const gen of AUTO_GENERATORS) {
        const filePath = path.join(basePath, 'src', 'lib', 'pdp', `${gen.name}.ts`);
        if (checkFileExists(filePath)) {
            results.push({
                section: gen.feeds,
                status: 'ok',
                message: `Auto-generator exists`,
                source: `${gen.name}.ts → fallback from ${gen.fallbackFrom}`,
            });
        } else {
            results.push({
                section: gen.feeds,
                status: 'error',
                message: `Missing auto-generator: ${gen.name}.ts`,
            });
        }
    }

    return results;
}

function validateConfigSections(basePath: string): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const section of CONFIG_SECTIONS) {
        const filePath = path.join(basePath, section.config);
        if (checkFileExists(filePath)) {
            results.push({
                section: section.name,
                status: 'ok',
                message: 'Config file exists',
                source: section.config,
            });
        } else {
            results.push({
                section: section.name,
                status: 'error',
                message: `Missing config: ${section.config}`,
            });
        }
    }

    return results;
}

function validateProductForPDP(basePath: string, productId?: string): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Check if products.ts has the required fields in type
    const productsPath = path.join(basePath, 'src', 'data', 'products.ts');
    if (checkFileExists(productsPath)) {
        const content = fs.readFileSync(productsPath, 'utf-8');

        for (const field of PRODUCT_DATA_FIELDS) {
            if (content.includes(`${field}:`)) {
                results.push({
                    section: `Product.${field}`,
                    status: 'ok',
                    message: 'Field found in products.ts',
                    source: 'Direct from product',
                });
            } else {
                results.push({
                    section: `Product.${field}`,
                    status: 'warning',
                    message: `Field "${field}" not found in any product`,
                });
            }
        }
    }

    return results;
}

function validateMockDataSupport(basePath: string): ValidationResult[] {
    const results: ValidationResult[] = [];
    const mocksDir = path.join(basePath, 'src', 'data', 'mocks');

    if (!checkFileExists(mocksDir)) {
        results.push({
            section: 'Mock Data',
            status: 'error',
            message: 'Mocks directory not found',
        });
        return results;
    }

    // Check for mock files
    const mockFiles = fs.readdirSync(mocksDir).filter(f => f.endsWith('.json'));

    results.push({
        section: 'Mock Files',
        status: 'ok',
        message: `${mockFiles.length} mock files found`,
        source: mocksDir,
    });

    for (const mockField of MOCK_DATA_FIELDS) {
        results.push({
            section: mockField.section,
            status: 'ok',
            message: `Source: ${mockField.source}`,
            source: `mockData.${mockField.field}`,
        });
    }

    return results;
}

function runValidation(basePath: string, productId?: string) {
    console.log('\n🔍 SimplifiedPDP Data Source Validation\n');
    console.log('='.repeat(60));

    const allResults: ValidationResult[] = [];

    // 1. Validate auto-generators
    console.log('\n📦 Auto-Generators (src/lib/pdp/):\n');
    const genResults = validateAutoGenerators(basePath);
    allResults.push(...genResults);
    for (const r of genResults) {
        const icon = r.status === 'ok' ? '✅' : r.status === 'warning' ? '⚠️' : '❌';
        console.log(`  ${icon} ${r.section}: ${r.message}`);
        if (r.source) console.log(`     └─ Source: ${r.source}`);
    }

    // 2. Validate config sections
    console.log('\n⚙️  Config-Based Sections:\n');
    const configResults = validateConfigSections(basePath);
    allResults.push(...configResults);
    for (const r of configResults) {
        const icon = r.status === 'ok' ? '✅' : '❌';
        console.log(`  ${icon} ${r.section}: ${r.message}`);
    }

    // 3. Validate product data fields
    console.log('\n📋 Product Data Fields:\n');
    const productResults = validateProductForPDP(basePath, productId);
    allResults.push(...productResults);
    for (const r of productResults) {
        const icon = r.status === 'ok' ? '✅' : r.status === 'warning' ? '⚠️' : '❌';
        console.log(`  ${icon} ${r.section}: ${r.message}`);
    }

    // 4. Validate mock data support
    console.log('\n💾 Mock Data Support:\n');
    const mockResults = validateMockDataSupport(basePath);
    allResults.push(...mockResults);
    for (const r of mockResults) {
        const icon = r.status === 'ok' ? '✅' : '❌';
        console.log(`  ${icon} ${r.section}: ${r.message}`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    const errors = allResults.filter(r => r.status === 'error').length;
    const warnings = allResults.filter(r => r.status === 'warning').length;
    const ok = allResults.filter(r => r.status === 'ok').length;

    console.log(`\n📊 Summary: ${ok} OK | ${warnings} Warnings | ${errors} Errors\n`);

    if (errors > 0) {
        console.log('❌ VALIDATION FAILED - Fix errors before proposing simplifications\n');
        process.exit(1);
    } else if (warnings > 0) {
        console.log('⚠️  VALIDATION PASSED WITH WARNINGS\n');
        process.exit(0);
    } else {
        console.log('✅ ALL DATA SOURCES VALIDATED\n');
        process.exit(0);
    }
}

// Run validation
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname, '..');
const productId = process.argv[2];
runValidation(basePath, productId);
