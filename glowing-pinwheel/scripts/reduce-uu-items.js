/**
 * Reduce Unknown Unknowns from 10 to 5 items per category
 * Keeps: CRITICAL items first, then WARNING, then INFO
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/unknown-unknowns-data.ts');

// Read file
let content = fs.readFileSync(filePath, 'utf-8');

const severityOrder = { 'CRITICAL': 0, 'WARNING': 1, 'INFO': 2 };

// Find items blocks and reduce them
// Pattern to match an items array with its contents
const itemsArrayPattern = /items: \[\s*((?:\{[\s\S]*?\},?\s*)+)\]/g;

function parseItems(itemsString) {
    const items = [];
    // Match each item object
    const itemRegex = /\{\s*id:\s*'([^']+)',\s*severity:\s*'([^']+)',[\s\S]*?\}/g;
    let match;
    let lastIndex = 0;

    while ((match = itemRegex.exec(itemsString)) !== null) {
        // Find the full item including all properties
        const startIdx = itemsString.indexOf('{', lastIndex);
        let braceCount = 0;
        let endIdx = startIdx;

        for (let i = startIdx; i < itemsString.length; i++) {
            if (itemsString[i] === '{') braceCount++;
            else if (itemsString[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIdx = i + 1;
                    break;
                }
            }
        }

        const fullItem = itemsString.slice(startIdx, endIdx);
        items.push({
            id: match[1],
            severity: match[2],
            fullText: fullItem,
            order: severityOrder[match[2]] || 99
        });

        lastIndex = endIdx;
        itemRegex.lastIndex = lastIndex;
    }

    return items;
}

function processContent(content) {
    let result = content;
    let replacements = 0;

    // Find each items array
    const itemsArrayRegex = /items:\s*\[\s*([\s\S]*?)\s*\],\s*\};/g;

    result = result.replace(itemsArrayRegex, (match, itemsContent) => {
        // Parse items
        const items = [];
        const singleItemRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
        let itemMatch;

        while ((itemMatch = singleItemRegex.exec(itemsContent)) !== null) {
            const itemText = itemMatch[0];
            const idMatch = itemText.match(/id:\s*'([^']+)'/);
            const severityMatch = itemText.match(/severity:\s*'([^']+)'/);

            if (idMatch && severityMatch) {
                items.push({
                    id: idMatch[1],
                    severity: severityMatch[1],
                    fullText: itemText,
                    order: severityOrder[severityMatch[1]] || 99
                });
            }
        }

        // If already 5 or fewer, keep as is
        if (items.length <= 5) {
            return match;
        }

        // Sort by severity and keep top 5
        items.sort((a, b) => a.order - b.order);
        const kept = items.slice(0, 5);

        replacements++;
        console.log(`Reduced category (${items[0]?.id?.split('-')[0]}): ${items.length} -> 5`);

        // Rebuild items array
        const newItemsContent = kept.map(item => '        ' + item.fullText.trim().replace(/,\s*$/, '')).join(',\n');

        return `items: [\n${newItemsContent},\n    ],\n};`;
    });

    console.log(`\nTotal categories reduced: ${replacements}`);
    return result;
}

// Process
const newContent = processContent(content);

// Write back
fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('File updated successfully!');

// Verify
const verifyContent = fs.readFileSync(filePath, 'utf-8');
const itemCounts = (verifyContent.match(/id:\s*'/g) || []).length;
console.log(`Total items after reduction: ${itemCounts}`);
