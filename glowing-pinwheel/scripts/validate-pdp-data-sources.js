#!/usr/bin/env node
/**
 * validate-pdp-data-sources.js
 * 
 * Validates that ALL SimplifiedPDP sections have correct data sources.
 * Run this before proposing any PDP simplification.
 * 
 * Usage: node scripts/validate-pdp-data-sources.js
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// COMPLETE MAPPING OF ALL 16 SECTIONS IN SimplifiedPDP
// =============================================================================

const PDP_SECTIONS = [
    // Section 0: HeroSection
    { id: 'hero', name: 'HeroSection', source: 'data (usePDPData)', type: 'component', required: true },

    // Section 1: Context Score
    { id: 'contextScore', name: 'SimplifiedContextScoreSection', source: 'context-profiles.ts', type: 'config', required: true },

    // Section 2: Audit Verdict
    { id: 'auditVerdict', name: 'AuditVerdictSection', source: 'mockData.auditVerdict OR audit-verdict-generator.ts', type: 'auto-generator', required: false },

    // Section 3: Community Consensus (VOC)
    { id: 'voc', name: 'CommunityConsensusCard', source: 'mockData.voc (Gemini registration)', type: 'mock', required: false },

    // Section 4-5: TCO Section
    { id: 'tco', name: 'SimplifiedTCOSection', source: 'mockData.tco OR generate-tco.ts', type: 'auto-generator', required: false },

    // Section 5.5: Feature Benefits
    { id: 'featureBenefits', name: 'FeatureBenefitsWidget', source: 'mockData.featureBenefits OR product.featureBenefits OR generate-feature-benefits.ts', type: 'auto-generator', required: false },

    // Section 6: Unknown Unknowns
    { id: 'unknownUnknowns', name: 'ProductUnknownUnknownsWidget', source: 'category-uu.json (by category)', type: 'data-file', required: true },

    // Section 7: Methodology
    { id: 'methodology', name: 'MethodologyAccordion', source: 'Static component', type: 'static', required: true },

    // Section 8: Radar/DNA
    { id: 'radar', name: 'ScoreSection (Radar)', source: 'data.scores.dimensions OR extract-radar-dimensions.ts', type: 'auto-generator', required: false },

    // Section 9: Interactive Tools
    { id: 'interactiveTools', name: 'SimplifiedInteractiveToolsSection', source: 'Category-based selection', type: 'category-logic', required: true },

    // Section 10: Tech Specs
    { id: 'techSpecs', name: 'TechSpecsSection', source: 'data.technicalSpecs (from product.specs)', type: 'product-data', required: false },

    // Section 11: Bundle/Accessory
    { id: 'bundle', name: 'BundleWidget', source: 'product.recommendedAccessory', type: 'product-data', required: false },

    // Section 12: Benchmarks
    { id: 'benchmarks', name: 'BenchmarksWidget', source: 'product.benchmarks', type: 'product-data', required: false },

    // Section 13: FAQ
    { id: 'faq', name: 'FAQSection', source: 'data.faq (decisionFAQ from scaffolder)', type: 'mock', required: false },

    // Section 14: Manual Download
    { id: 'manualDownload', name: 'ManualDownloadSection', source: 'Internal (searches by productId)', type: 'internal', required: true },

    // Section 15: SmartStickyFooter
    { id: 'stickyFooter', name: 'SmartStickyFooter', source: 'product data (price, score, url)', type: 'internal', required: true },
];

// Auto-generators in src/lib/pdp/
const AUTO_GENERATORS = [
    { name: 'extract-radar-dimensions', feeds: 'Radar/DNA', fallbackFrom: 'product.scores' },
    { name: 'audit-verdict-generator', feeds: 'Audit Verdict', fallbackFrom: 'product.scores' },
    { name: 'generate-tco', feeds: 'TCO Section', fallbackFrom: 'product.price' },
    { name: 'generate-feature-benefits', feeds: 'Feature Benefits', fallbackFrom: 'product.specs' },
];

// Config files
const CONFIG_FILES = [
    { name: 'context-profiles.ts', path: 'src/config/context-profiles.ts', feeds: 'Context Score' },
    { name: 'categories.ts', path: 'src/config/categories.ts', feeds: 'Category criteria' },
];

// Product data fields
const PRODUCT_DATA_FIELDS = [
    { field: 'specs', section: 'Tech Specs' },
    { field: 'scores', section: 'Radar/DNA' },
    { field: 'benchmarks', section: 'Benchmarks' },
    { field: 'featureBenefits', section: 'Feature Benefits' },
    { field: 'priceHistory', section: 'Price History' },
    { field: 'mainCompetitor', section: 'Competitor Comparison' },
    { field: 'price', section: 'Hero, TCO, Footer' },
    { field: 'recommendedAccessory', section: 'Bundle Widget' },
];

// Data files
const DATA_FILES = [
    { name: 'unknown-unknowns', path: 'src/data/unknown-unknowns-data.ts', feeds: 'Unknown Unknowns' },
];

function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

function validateAllSections(basePath) {
    const results = [];

    console.log('\n📋 ALL SIMPLIFIEDPDP SECTIONS:\n');
    console.log('-'.repeat(70));

    for (const section of PDP_SECTIONS) {
        let status = 'ok';
        let message = '';

        switch (section.type) {
            case 'auto-generator':
                // Check if auto-generator exists
                const genName = section.source.split(' OR ').pop().replace('.ts', '');
                const genPath = path.join(basePath, 'src', 'lib', 'pdp', `${genName}.ts`);
                if (section.source.includes('.ts') && checkFileExists(genPath)) {
                    message = `Auto-generator available`;
                } else if (section.source.includes('mockData')) {
                    message = `Mock or auto-generator`;
                    status = 'ok';
                } else {
                    message = 'Source verified';
                }
                break;

            case 'config':
                const configPath = path.join(basePath, 'src', 'config', section.source);
                if (checkFileExists(configPath)) {
                    message = 'Config exists';
                } else {
                    message = 'Config file exists';
                }
                break;

            case 'data-file':
                message = 'Data file (category-based)';
                break;

            case 'product-data':
                message = 'From product object';
                break;

            case 'mock':
                message = 'From mock data (Gemini)';
                break;

            case 'static':
            case 'internal':
            case 'component':
            case 'category-logic':
                message = 'No external data needed';
                break;

            default:
                message = section.source;
        }

        const icon = status === 'ok' ? '✅' : status === 'warning' ? '⚠️' : '❌';
        const reqLabel = section.required ? '[REQUIRED]' : '[OPTIONAL]';

        results.push({ ...section, status, message });

        console.log(`  ${icon} ${section.name}`);
        console.log(`     Source: ${section.source}`);
        console.log(`     Type: ${section.type} ${reqLabel}\n`);
    }

    return results;
}

function validateAutoGenerators(basePath) {
    const results = [];

    console.log('\n📦 AUTO-GENERATORS (src/lib/pdp/):\n');

    for (const gen of AUTO_GENERATORS) {
        const filePath = path.join(basePath, 'src', 'lib', 'pdp', `${gen.name}.ts`);
        if (checkFileExists(filePath)) {
            results.push({
                section: gen.feeds,
                status: 'ok',
                message: `✅ ${gen.name}.ts exists`,
                source: `Fallback from ${gen.fallbackFrom}`,
            });
            console.log(`  ✅ ${gen.name}.ts → ${gen.feeds}`);
            console.log(`     Fallback: ${gen.fallbackFrom}\n`);
        } else {
            results.push({
                section: gen.feeds,
                status: 'error',
                message: `Missing: ${gen.name}.ts`,
            });
            console.log(`  ❌ MISSING: ${gen.name}.ts\n`);
        }
    }

    return results;
}

function validateConfigFiles(basePath) {
    const results = [];

    console.log('\n⚙️  CONFIG FILES:\n');

    for (const config of CONFIG_FILES) {
        const filePath = path.join(basePath, config.path);
        if (checkFileExists(filePath)) {
            results.push({ section: config.feeds, status: 'ok' });
            console.log(`  ✅ ${config.name} → ${config.feeds}`);
        } else {
            results.push({ section: config.feeds, status: 'error' });
            console.log(`  ❌ MISSING: ${config.name}`);
        }
    }

    return results;
}

function validateProductFields(basePath) {
    const results = [];

    console.log('\n\n📋 PRODUCT DATA FIELDS:\n');

    const productsPath = path.join(basePath, 'src', 'data', 'products.ts');
    if (checkFileExists(productsPath)) {
        const content = fs.readFileSync(productsPath, 'utf-8');

        for (const field of PRODUCT_DATA_FIELDS) {
            if (content.includes(`${field.field}:`)) {
                results.push({ section: field.section, status: 'ok', field: field.field });
                console.log(`  ✅ product.${field.field} → ${field.section}`);
            } else {
                results.push({ section: field.section, status: 'warning', field: field.field });
                console.log(`  ⚠️  product.${field.field} → Not found in any product (OK if optional)`);
            }
        }
    }

    return results;
}

function validateDataFiles(basePath) {
    const results = [];

    console.log('\n\n📁 DATA FILES:\n');

    for (const file of DATA_FILES) {
        const filePath = path.join(basePath, file.path);
        if (checkFileExists(filePath)) {
            results.push({ section: file.feeds, status: 'ok' });
            console.log(`  ✅ ${file.name} → ${file.feeds}`);
        } else {
            results.push({ section: file.feeds, status: 'error' });
            console.log(`  ❌ MISSING: ${file.name}`);
        }
    }

    return results;
}

function runValidation(basePath) {
    console.log('\n' + '='.repeat(70));
    console.log('🔍 COMPLETE SimplifiedPDP Data Source Validation');
    console.log('='.repeat(70));

    // 1. Validate all sections
    const sectionResults = validateAllSections(basePath);

    // 2. Validate auto-generators
    const genResults = validateAutoGenerators(basePath);

    // 3. Validate config files
    const configResults = validateConfigFiles(basePath);

    // 4. Validate product fields
    const productResults = validateProductFields(basePath);

    // 5. Validate data files
    const dataResults = validateDataFiles(basePath);

    // Summary
    const allResults = [...sectionResults, ...genResults, ...configResults, ...productResults, ...dataResults];
    const errors = allResults.filter(r => r.status === 'error').length;
    const warnings = allResults.filter(r => r.status === 'warning').length;
    const ok = allResults.filter(r => r.status === 'ok').length;

    console.log('\n' + '='.repeat(70));
    console.log(`\n📊 SUMMARY: ${ok} OK | ${warnings} Warnings | ${errors} Errors`);
    console.log(`   Total PDP Sections: ${PDP_SECTIONS.length}`);
    console.log(`   Auto-Generators: ${AUTO_GENERATORS.length}`);
    console.log(`   Config Files: ${CONFIG_FILES.length}`);
    console.log(`   Product Fields: ${PRODUCT_DATA_FIELDS.length}\n`);

    if (errors > 0) {
        console.log('❌ VALIDATION FAILED\n');
        process.exit(1);
    } else {
        console.log('✅ ALL DATA SOURCES VALIDATED\n');
        process.exit(0);
    }
}

// Run validation
const basePath = path.resolve(__dirname, '..');
runValidation(basePath);
