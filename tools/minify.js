#!/usr/bin/env node
/**
 * Minify CSS and JS files for production
 * 
 * Usage: node tools/minify.js
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify: terserMinify } = require('terser');

const DIST_DIR = path.join(__dirname, '..', 'dist');

// CSS files to minify
const CSS_FILES = [
    'css/main.css'
];

// JS files to minify
const JS_FILES = [
    'js/main.js',
    'js/utils.js',
    'js/router.js',
    'js/catalog.js',
    'js/ranking.js',
    'js/comparator.js',
    'js/assistant.js',
    'js/analytics.js',
    'js/analytics-events.js'
];

async function minifyCSS() {
    console.log('\n🎨 Minifying CSS...');
    const cleanCSS = new CleanCSS({
        level: 2, // Aggressive optimization
        compatibility: 'ie11'
    });

    let totalSaved = 0;

    for (const file of CSS_FILES) {
        const filePath = path.join(DIST_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.log(`  ⚠️ ${file} not found, skipping`);
            continue;
        }

        const original = fs.readFileSync(filePath, 'utf8');
        const originalSize = Buffer.byteLength(original, 'utf8');

        const result = cleanCSS.minify(original);

        if (result.errors.length > 0) {
            console.error(`  ❌ ${file}: ${result.errors.join(', ')}`);
            continue;
        }

        fs.writeFileSync(filePath, result.styles, 'utf8');
        const minifiedSize = Buffer.byteLength(result.styles, 'utf8');
        const saved = originalSize - minifiedSize;
        const percent = ((saved / originalSize) * 100).toFixed(1);

        totalSaved += saved;
        console.log(`  ✅ ${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (-${percent}%)`);
    }

    return totalSaved;
}

async function minifyJS() {
    console.log('\n⚡ Minifying JS...');

    let totalSaved = 0;

    for (const file of JS_FILES) {
        const filePath = path.join(DIST_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.log(`  ⚠️ ${file} not found, skipping`);
            continue;
        }

        const original = fs.readFileSync(filePath, 'utf8');
        const originalSize = Buffer.byteLength(original, 'utf8');

        try {
            const result = await terserMinify(original, {
                compress: {
                    drop_console: false, // Keep console.log for debugging
                    drop_debugger: true,
                    passes: 2
                },
                mangle: true,
                format: {
                    comments: false
                }
            });

            if (result.error) {
                console.error(`  ❌ ${file}: ${result.error}`);
                continue;
            }

            fs.writeFileSync(filePath, result.code, 'utf8');
            const minifiedSize = Buffer.byteLength(result.code, 'utf8');
            const saved = originalSize - minifiedSize;
            const percent = ((saved / originalSize) * 100).toFixed(1);

            totalSaved += saved;
            console.log(`  ✅ ${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (-${percent}%)`);
        } catch (err) {
            console.error(`  ❌ ${file}: ${err.message}`);
        }
    }

    return totalSaved;
}

async function main() {
    console.log('🚀 Starting minification...');

    const cssSaved = await minifyCSS();
    const jsSaved = await minifyJS();

    const totalSaved = cssSaved + jsSaved;
    console.log(`\n✅ Minification complete! Total saved: ${(totalSaved / 1024).toFixed(1)}KB`);
}

main().catch(console.error);
