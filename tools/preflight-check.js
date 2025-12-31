#!/usr/bin/env node
/**
 * ComparaTop - Pre-Flight Check Script
 * 
 * Validates the codebase before build to ensure:
 * 1. All catalogs have required fields
 * 2. All products have required data
 * 3. No hardcoded category-specific logic (scalability)
 * 4. Assets exist for features
 * 
 * Usage: node tools/preflight-check.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
    catalogsDir: path.join(__dirname, '..', 'data', 'catalogs'),
    srcDir: path.join(__dirname, '..'),
};

let errors = [];
let warnings = [];
let info = [];

// ============================================
// CATALOG VALIDATION
// ============================================
function validateCatalogs() {
    console.log('\n📁 Validating Catalogs...\n');

    const catalogFiles = fs.readdirSync(CONFIG.catalogsDir).filter(f => f.endsWith('.json'));

    if (catalogFiles.length === 0) {
        errors.push('No catalog files found in data/catalogs/');
        return;
    }

    info.push(`Found ${catalogFiles.length} catalog(s): ${catalogFiles.join(', ')}`);

    for (const file of catalogFiles) {
        const filePath = path.join(CONFIG.catalogsDir, file);
        let data;

        try {
            data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (e) {
            errors.push(`${file}: Invalid JSON - ${e.message}`);
            continue;
        }

        // Check required category fields
        const requiredCategoryFields = ['slug', 'name', 'description', 'canonicalPath'];
        for (const field of requiredCategoryFields) {
            if (!data.category?.[field]) {
                errors.push(`${file}: Missing category.${field}`);
            }
        }

        // Check FAQ (for FAQ Schema)
        if (!data.category?.faq || data.category.faq.length === 0) {
            warnings.push(`${file}: No FAQ data - FAQ Schema won't be generated`);
        } else {
            info.push(`${file}: ${data.category.faq.length} FAQ items`);
        }

        // Check feed category fields (for shopping feeds)
        if (!data.category?.googleProductCategory) {
            warnings.push(`${file}: No googleProductCategory - feeds will use generic category`);
        }
        if (!data.category?.fbProductCategory) {
            warnings.push(`${file}: No fbProductCategory - Facebook feed will use generic category`);
        }

        // Check products
        const products = data.products || {};
        const productCount = Object.keys(products).length;

        if (productCount === 0) {
            warnings.push(`${file}: No products found`);
        } else {
            info.push(`${file}: ${productCount} products`);

            // Validate each product
            for (const [id, product] of Object.entries(products)) {
                // Required fields
                if (!product.name) errors.push(`${file}/${id}: Missing name`);
                if (!product.brand) warnings.push(`${file}/${id}: Missing brand`);
                if (!product.images || product.images.length === 0) {
                    warnings.push(`${file}/${id}: No images`);
                }
                if (!product.offers || product.offers.length === 0) {
                    warnings.push(`${file}/${id}: No offers (affiliate links)`);
                }

                // SEO fields
                if (!product.metaDescription) {
                    warnings.push(`${file}/${id}: No metaDescription (SEO)`);
                }
            }
        }
    }
}

// ============================================
// SCALABILITY CHECK
// ============================================
function checkScalability() {
    console.log('\n🔧 Checking Scalability...\n');

    // Files to check for hardcoded category names
    const filesToCheck = [
        'tools/build.js',
        'tools/generate-og-images.js',
        'tools/generate-infographics.js',
        'js/main.js'
    ];

    // Patterns that indicate hardcoding (should use dynamic values instead)
    const hardcodedPatterns = [
        { pattern: /geladeira/gi, type: 'category', message: 'Hardcoded "geladeira"' },
        { pattern: /climatiza/gi, type: 'category', message: 'Hardcoded "climatizacao"' },
        // Add more categories as they're created
    ];

    for (const file of filesToCheck) {
        const filePath = path.join(CONFIG.srcDir, file);
        if (!fs.existsSync(filePath)) continue;

        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        for (const { pattern, message } of hardcodedPatterns) {
            let lineNum = 0;
            for (const line of lines) {
                lineNum++;
                if (pattern.test(line)) {
                    // Ignore comments and allowed contexts
                    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
                    if (line.includes('catalogs.') || line.includes('category.slug')) continue;
                    if (line.includes('if (catalogs.')) continue; // Dynamic check

                    // Check if it's in a dynamic context
                    const isDynamic = line.includes('${') || line.includes('category.') ||
                        line.includes('catalog.') || line.includes('[slug]');

                    if (!isDynamic) {
                        // Only warn about non-navigation hardcodes
                        if (!line.includes('nav-') && !line.includes('sidebar')) {
                            warnings.push(`${file}:${lineNum}: ${message} - may need dynamic handling`);
                        }
                    }
                }
            }
        }
    }
}

// ============================================
// ASSET CHECK
// ============================================
function checkAssets() {
    console.log('\n📦 Checking Assets...\n');

    // PWA assets
    const pwaAssets = [
        'manifest.json',
        'sw.js',
        'assets/icons/icon-192x192.svg',
        'assets/icons/icon-512x512.svg'
    ];

    for (const asset of pwaAssets) {
        const assetPath = path.join(CONFIG.srcDir, asset);
        if (!fs.existsSync(assetPath)) {
            warnings.push(`Missing PWA asset: ${asset}`);
        } else {
            info.push(`PWA: ${asset} ✓`);
        }
    }

    // Check for robots.txt
    if (!fs.existsSync(path.join(CONFIG.srcDir, 'robots.txt'))) {
        warnings.push('Missing robots.txt');
    }
}

// ============================================
// REPORT
// ============================================
function printReport() {
    console.log('\n' + '='.repeat(50));
    console.log('📋 PRE-FLIGHT CHECK REPORT');
    console.log('='.repeat(50) + '\n');

    if (errors.length > 0) {
        console.log('❌ ERRORS (must fix before build):');
        errors.forEach(e => console.log(`   • ${e}`));
        console.log();
    }

    if (warnings.length > 0) {
        console.log('⚠️  WARNINGS (should review):');
        warnings.forEach(w => console.log(`   • ${w}`));
        console.log();
    }

    console.log('ℹ️  INFO:');
    info.forEach(i => console.log(`   • ${i}`));
    console.log();

    console.log('='.repeat(50));
    if (errors.length > 0) {
        console.log(`🔴 ${errors.length} error(s) - BUILD BLOCKED`);
        process.exit(1);
    } else if (warnings.length > 0) {
        console.log(`🟡 ${warnings.length} warning(s) - Review recommended`);
    } else {
        console.log('🟢 All checks passed!');
    }
    console.log('='.repeat(50) + '\n');
}

// ============================================
// MAIN
// ============================================
console.log('🚀 ComparaTop Pre-Flight Check\n');

validateCatalogs();
checkScalability();
checkAssets();
printReport();
