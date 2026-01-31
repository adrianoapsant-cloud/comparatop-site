/**
 * Script para reduzir Unknown Unknowns de 10 para 5 itens por categoria
 * Prioriza: CRITICAL > WARNING > INFO
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/unknown-unknowns-data.ts');

// Read file
let content = fs.readFileSync(filePath, 'utf-8');

// Parse each category and reduce items
const severityOrder = { 'CRITICAL': 0, 'WARNING': 1, 'INFO': 2 };

// Find all const declarations with items arrays
const categoryPattern = /const (\w+_UNKNOWN_UNKNOWNS): CategoryUnknownUnknowns = \{[\s\S]*?categoryId: '([^']+)',[\s\S]*?categoryName: '([^']+)',[\s\S]*?lastUpdated: '([^']+)',[\s\S]*?items: \[([\s\S]*?)\],\s*\};/g;

let match;
const categories = [];

while ((match = categoryPattern.exec(content)) !== null) {
    const [fullMatch, constName, categoryId, categoryName, lastUpdated, itemsContent] = match;

    // Parse individual items
    const itemPattern = /\{[\s\S]*?id: '([^']+)',[\s\S]*?severity: '([^']+)',[\s\S]*?topic: '([^']+)',[\s\S]*?userQuestion: '([^']*)',[\s\S]*?technicalFact: '([^']*)',[\s\S]*?riskAnalysis: '([^']*)',[\s\S]*?mitigationStrategy: '([^']*)',[\s\S]*?fixabilityScore: (\d+),[\s\S]*?(?:affectedBrands: \[([^\]]*)\],[\s\S]*?)?(?:sources: \[([^\]]*)\],[\s\S]*?)?(?:safetyWarning: '([^']*)',[\s\S]*?)?(?:systemFlag: '([^']*)',[\s\S]*?)?\}/g;

    const items = [];
    let itemMatch;
    const itemsStr = itemsContent;

    // Simpler approach: count items by counting id: patterns
    const itemCount = (itemsStr.match(/id: '/g) || []).length;

    categories.push({
        constName,
        categoryId,
        itemCount,
        startIndex: match.index,
        endIndex: match.index + fullMatch.length
    });
}

console.log('Categories found:', categories.length);
categories.forEach(c => {
    console.log(`${c.categoryId}: ${c.itemCount} items`);
});

// Count how many need reduction
const needReduction = categories.filter(c => c.itemCount > 5);
console.log(`\nCategories needing reduction: ${needReduction.length}`);
