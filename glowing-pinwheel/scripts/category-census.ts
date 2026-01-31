#!/usr/bin/env npx tsx
/**
 * @file category-census.ts
 * @description P7-1: Censo de categorias com canonicalização e fix de products
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');

// ============================================
// ALIASES & DEPARTMENTS
// ============================================

const CATEGORY_ID_ALIASES: Record<string, string> = {
    'smart-tv': 'tv',
    'refrigerator': 'fridge',
    'refrigeration': 'fridge',
    'air-conditioner': 'air_conditioner',
    'notebook': 'laptop',
};

const DEPARTMENT_IDS = new Set([
    'mobile', 'computing', 'components', 'gaming', 'video-audio',
    'refrigeration', 'kitchen', 'cleaning',
    'setup-gamer', 'casa-inteligente', 'home-office',
    'cozinha-pratica', 'mobilidade', 'auto-ferramentas',
]);

function canonicalize(id: string): string {
    return CATEGORY_ID_ALIASES[id] ?? id;
}

function isDepartment(id: string): boolean {
    return DEPARTMENT_IDS.has(id);
}

// ============================================
// DATA SOURCES
// ============================================

const SCAFFOLDER_CATEGORIES = [
    'robot-vacuum', 'tv', 'fridge', 'air_conditioner', 'smartwatch',
    'smartphone', 'laptop', 'washer', 'monitor', 'tablet', 'soundbar',
];

function getCategoryDefinitionsIds(): string[] {
    try {
        const filePath = path.join(PROJECT_ROOT, 'src', 'config', 'categories.ts');
        const content = fs.readFileSync(filePath, 'utf-8');
        const match = content.match(/export const CATEGORIES[^{]+{([^}]+(?:\n[^}]+)*)}/s);
        if (!match) return [];

        const ids: string[] = [];
        const lines = match[1].split('\n');
        for (const line of lines) {
            // Match: "   tv: TV_CATEGORY," or "   'robot-vacuum': ROBOT_VACUUM_CATEGORY,"
            const m = line.match(/^\s*['"]?([\w-]+)['"]?\s*:/);
            if (m && !m[1].startsWith('//') && !m[1].includes('P6')) {
                ids.push(m[1]);
            }
        }
        return ids;
    } catch {
        return [];
    }
}

function getTaxonomyCategories(): string[] {
    try {
        const filePath = path.join(PROJECT_ROOT, 'src', 'config', 'category-taxonomy.ts');
        if (!fs.existsSync(filePath)) return [];

        const content = fs.readFileSync(filePath, 'utf-8');
        const ids: string[] = [];

        // Extract category IDs from CategoryItem objects
        const matches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
        for (const m of matches) {
            ids.push(m[1]);
        }
        return [...new Set(ids)];
    } catch {
        return [];
    }
}

function getProductCategories(): string[] {
    try {
        const ids = new Set<string>();

        // Check products.ts - look for categoryId field
        const productsPath = path.join(PROJECT_ROOT, 'src', 'data', 'products.ts');
        if (fs.existsSync(productsPath)) {
            const content = fs.readFileSync(productsPath, 'utf-8');
            // Match categoryId: 'xxx' or categoryId: "xxx"
            const matches = content.matchAll(/categoryId:\s*['"]([^'"]+)['"]/g);
            for (const m of matches) {
                ids.add(m[1]);
            }
        }

        // Check generated products
        const generatedDir = path.join(PROJECT_ROOT, 'src', 'data', 'generated', 'products');
        if (fs.existsSync(generatedDir)) {
            const files = fs.readdirSync(generatedDir).filter(f => f.endsWith('.ts'));
            for (const file of files) {
                const content = fs.readFileSync(path.join(generatedDir, file), 'utf-8');
                const match = content.match(/categoryId:\s*['"]([^'"]+)['"]/);
                if (match) ids.add(match[1]);
            }
        }

        return [...ids];
    } catch {
        return [];
    }
}

// ============================================
// CENSUS
// ============================================

function generateCensus(): string {
    // Raw IDs from sources
    const scaffolderIds = new Set(SCAFFOLDER_CATEGORIES);
    const categoryDefIds = new Set(getCategoryDefinitionsIds());
    const taxonomyIdsRaw = getTaxonomyCategories();
    const productIdsRaw = getProductCategories();

    // Filter departments and canonicalize taxonomy
    const taxonomyLeaves = taxonomyIdsRaw.filter(id => !isDepartment(id));
    const taxonomyCanonical = new Set(taxonomyLeaves.map(canonicalize));
    const productIds = new Set(productIdsRaw.map(canonicalize));

    // Track aliases resolved
    const aliasesResolved: string[] = [];
    for (const id of taxonomyIdsRaw) {
        if (CATEGORY_ID_ALIASES[id]) {
            aliasesResolved.push(`${id} → ${CATEGORY_ID_ALIASES[id]}`);
        }
    }
    const departmentsFiltered = taxonomyIdsRaw.filter(id => isDepartment(id));

    // Union all (canonical)
    const allIds = new Set([...scaffolderIds, ...categoryDefIds, ...taxonomyCanonical, ...productIds]);

    // Diffs
    const fullCoverage = [...allIds].filter(id => scaffolderIds.has(id) && categoryDefIds.has(id));
    const inTaxonomyNoDefinition = [...taxonomyCanonical].filter(id => !categoryDefIds.has(id));
    const inDefinitionNoScaffolder = [...categoryDefIds].filter(id => !scaffolderIds.has(id));
    const inProductsNoDefinition = [...productIds].filter(id => !categoryDefIds.has(id));

    return `# Category Census Report (P7)

**Generated**: ${new Date().toISOString()}

## Resumo

| Fonte | Raw | Após Canonicalização |
|-------|-----|---------------------|
| Scaffolder (schemas) | ${scaffolderIds.size} | ${scaffolderIds.size} |
| CategoryDefinition | ${categoryDefIds.size} | ${categoryDefIds.size} |
| Taxonomy (leaf nodes) | ${taxonomyIdsRaw.length} | ${taxonomyCanonical.size} |
| Taxonomy (departamentos filtrados) | ${departmentsFiltered.length} | - |
| Products | ${productIdsRaw.length} | ${productIds.size} |
| **Union Total (canonical)** | - | ${allIds.size} |
| **Cobertura Completa** | - | ${fullCoverage.length} |

## Aliases Resolvidos (${aliasesResolved.length})

${aliasesResolved.length === 0 ? '_Nenhum alias aplicado._' : aliasesResolved.map(a => `- ${a}`).join('\n')}

## Departamentos Filtrados (${departmentsFiltered.length})

${departmentsFiltered.map(id => `- \`${id}\``).join('\n')}

## Cobertura Completa (Scaffolder + CategoryDefinition)

${fullCoverage.length === 0 ? '_Nenhuma categoria com cobertura completa._' : fullCoverage.map(id => `- ✅ \`${id}\``).join('\n')}

## Gaps Identificados

### 1. Em Taxonomy mas sem CategoryDefinition (${inTaxonomyNoDefinition.length})
${inTaxonomyNoDefinition.length === 0 ? '_Nenhum gap._' : inTaxonomyNoDefinition.slice(0, 20).map(id => `- ⚠️ \`${id}\``).join('\n')}
${inTaxonomyNoDefinition.length > 20 ? `\n... e mais ${inTaxonomyNoDefinition.length - 20} categorias` : ''}

### 2. Em CategoryDefinition mas sem Scaffolder (${inDefinitionNoScaffolder.length})
${inDefinitionNoScaffolder.length === 0 ? '_Nenhum gap._' : inDefinitionNoScaffolder.map(id => `- ⚠️ \`${id}\``).join('\n')}

### 3. Em Products mas sem CategoryDefinition (${inProductsNoDefinition.length})
${inProductsNoDefinition.length === 0 ? '_Nenhum gap._' : inProductsNoDefinition.map(id => `- ⚠️ \`${id}\``).join('\n')}

## Inventário Detalhado (Canonical)

| Category ID | Scaffolder | CategoryDef | Taxonomy | Products |
|-------------|------------|-------------|----------|----------|
${[...allIds].sort().map(id => `| \`${id}\` | ${scaffolderIds.has(id) ? '✅' : '❌'} | ${categoryDefIds.has(id) ? '✅' : '❌'} | ${taxonomyCanonical.has(id) ? '✅' : '❌'} | ${productIds.has(id) ? '✅' : '❌'} |`).join('\n')}
`;
}

// ============================================
// MAIN
// ============================================

const report = generateCensus();
const outputPath = path.join(PROJECT_ROOT, 'reports', 'category-census.md');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, report, 'utf-8');

console.log('✅ Category census generated:');
console.log(`   ${outputPath}\n`);
console.log(report);
