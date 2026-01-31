#!/usr/bin/env node
/**
 * Update product entries with confirmed research data
 * 
 * Data confirmed by user research on 2026-01-31:
 * - ERB20: dockType=basic, brushType=suction-only
 * - EZs E10: dockType=basic, obstacleDetection=infrared  
 * - Kabum Smart 700: dockType=basic
 * - Liectroux L200: dockType=basic, brushType=bristle
 * - Philco PAS26P: dockType=basic
 * - Roborock Q7 L5: dockType=basic
 * - Samsung VR5000RM: dockType=basic
 * - eufy Omni C20: obstacleDetection=bump-only
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../src/data');

// Updates to apply (field -> value)
const UPDATES = {
    'products.entry.electrolux-erb20-home-control-experience.ts': {
        'dockType': 'basic',
        'brushType': 'suction-only',
    },
    'products.entry.ezs-e10.ts': {
        'dockType': 'basic',
        'obstacleDetection': 'infrared',
    },
    'products.entry.kabum-smart-700.ts': {
        'dockType': 'basic',
    },
    'products.entry.liectroux-l200-robo-aspirador-3em1-app-alexa-google.ts': {
        'dockType': 'basic',
        'brushType': 'bristle',
    },
    'products.entry.philco-pas26p.ts': {
        'dockType': 'basic',
    },
    'products.entry.roborock-q7-l5.ts': {
        'dockType': 'basic',
    },
    'products.entry.samsung-vr5000rm.ts': {
        'dockType': 'basic',
    },
    'products.entry.eufy-omni-c20.ts': {
        'obstacleDetection': 'bump-only',
    },
};

function addFieldToAttributes(content, field, value) {
    // Find the attributes block and add/update the field
    const attributesMatch = content.match(/attributes:\s*\{/);
    if (!attributesMatch) {
        console.log(`  [WARN] No attributes block found`);
        return content;
    }

    // Check if field already exists in attributes
    const fieldPattern = new RegExp(`(\\s+)${field}:\\s*['"][^'"]*['"]`, 'g');
    if (fieldPattern.test(content)) {
        // Update existing field
        content = content.replace(
            new RegExp(`(${field}:\\s*)['"][^'"]*['"]`),
            `$1'${value}'`
        );
        console.log(`  [UPDATED] ${field}: '${value}'`);
    } else {
        // Add new field after attributes: {
        const insertPos = attributesMatch.index + attributesMatch[0].length;
        const indent = content.substring(insertPos + 1, insertPos + 20).match(/^\s*/)?.[0] || '            ';
        const newField = `\n${indent}${field}: '${value}',`;
        content = content.slice(0, insertPos) + newField + content.slice(insertPos);
        console.log(`  [ADDED] ${field}: '${value}'`);
    }

    return content;
}

for (const [filename, fields] of Object.entries(UPDATES)) {
    const filePath = path.join(DATA_DIR, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`[SKIP] ${filename} - file not found`);
        continue;
    }

    console.log(`\n[PROCESSING] ${filename}`);
    let content = fs.readFileSync(filePath, 'utf-8');

    for (const [field, value] of Object.entries(fields)) {
        content = addFieldToAttributes(content, field, value);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  [SAVED]`);
}

console.log('\n✅ All product entries updated with confirmed research data');
