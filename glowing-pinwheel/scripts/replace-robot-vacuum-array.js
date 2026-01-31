#!/usr/bin/env node
/**
 * Replace SAMPLE_ROBOT_VACUUMS inline array with import-based array
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.resolve(__dirname, '../src/data/products.ts');

let content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');

// Find the SAMPLE_ROBOT_VACUUMS array declaration and its content
const arrayStartPattern = /export const SAMPLE_ROBOT_VACUUMS:\s*Product\[\]\s*=\s*\[/;
const match = content.match(arrayStartPattern);

if (!match) {
    console.error('Could not find SAMPLE_ROBOT_VACUUMS array');
    process.exit(1);
}

const arrayDeclStart = match.index;
const arrayContentStart = arrayDeclStart + match[0].length;

// Find matching closing bracket by counting braces
let braceCount = 1;
let arrayEnd = arrayContentStart;
for (let i = arrayContentStart; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
        braceCount--;
        if (braceCount === 0) {
            arrayEnd = i + 1;
            break;
        }
    }
}

// Find the semicolon and any trailing comment/whitespace
let sectionEnd = arrayEnd;
while (sectionEnd < content.length && /[;\s]/.test(content[sectionEnd])) {
    sectionEnd++;
}

console.log(`Array found from char ${arrayDeclStart} to char ${sectionEnd}`);
console.log(`Array length: ${sectionEnd - arrayDeclStart} characters`);

// The new modular array
const newArray = `export const SAMPLE_ROBOT_VACUUMS: Product[] = [
    // Modular architecture: all products imported from entry files
    wap_robot_w400,
    roborock_q7_l5,
    electrolux_erb20_home_control_experience,
    liectroux_l200_robo_aspirador_3em1_app_alexa_google,
    xiaomi_robot_x10,
    ezs_e10,
    eufy_x10_pro_omni,
    eufy_omni_c20,
    xiaomi_robot_vacuum_x20_pro,
    // Pre-existing entry files
    liectroux_xr500_pro,
    wkjwqwhy_a6s,
    xiaomi_robot_vacuum_s40c,
    wap_robot_w90,
    xiaomi_robot_vacuum_s20_plus_white,
    samsung_vr5000rm,
    kabum_smart_700,
    philco_pas26p,
];`;

// Replace the old array with the new one
const before = content.substring(0, arrayDeclStart);
const after = content.substring(sectionEnd);

content = before + newArray + '\n\n' + after;

// Write back
fs.writeFileSync(PRODUCTS_FILE, content, 'utf-8');

console.log('\\n✅ Replaced SAMPLE_ROBOT_VACUUMS array with modular imports');
console.log('   17 robot vacuum products now imported from entry files');
