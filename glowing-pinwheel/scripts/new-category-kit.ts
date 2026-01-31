#!/usr/bin/env npx tsx
/**
 * New Category Kit Generator
 * Creates the base structure for a new category module
 * 
 * Usage:
 *   npx tsx scripts/new-category-kit.ts --category air-fryer
 * 
 * Creates:
 *   src/categories/<slug>/
 *     spec.schema.ts
 *     tags.ts
 *     scoring.ts
 *     uiAdapters.ts (stub)
 *     index.ts
 *     QA.md
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// ARGUMENTS
// ============================================

function parseArgs(): { category: string } {
    const args = process.argv.slice(2);
    let category = '';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--category' && args[i + 1]) {
            category = args[i + 1];
            i++;
        }
    }

    if (!category) {
        console.error('Usage: npx tsx scripts/new-category-kit.ts --category <slug>');
        console.error('');
        console.error('Example:');
        console.error('  npx tsx scripts/new-category-kit.ts --category air-fryer');
        process.exit(1);
    }

    // Validate slug format
    if (!/^[a-z][a-z0-9-]*$/.test(category)) {
        console.error(`Invalid category slug: "${category}"`);
        console.error('Slug must be lowercase, start with a letter, and contain only letters, numbers, and hyphens.');
        process.exit(1);
    }

    return { category };
}

// ============================================
// HELPERS
// ============================================

function toPascalCase(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

function toCamelCase(slug: string): string {
    const pascal = toPascalCase(slug);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// ============================================
// TEMPLATES
// ============================================

function specSchemaTemplate(slug: string): string {
    const PascalName = toPascalCase(slug);
    return `/**
 * ${PascalName} Spec Schema
 * Zod schema for structured specifications
 */
import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

// Example enum - customize for your category
export const ExampleType = z.enum(['type-a', 'type-b', 'type-c']);
export type ExampleType = z.infer<typeof ExampleType>;

// ============================================
// MAIN SCHEMA
// ============================================

export const ${PascalName}SpecSchema = z.object({
    // Required fields
    exampleType: ExampleType,
    capacityLiters: z.number().positive(),
    
    // Optional fields with defaults
    wattage: z.number().positive().optional(),
    hasTimer: z.boolean().optional(),
    
    // Add more fields as needed for your category
});

export type ${PascalName}Specs = z.infer<typeof ${PascalName}SpecSchema>;
`;
}

function tagsTemplate(slug: string): string {
    const PascalName = toPascalCase(slug);
    return `/**
 * ${PascalName} Tags
 * Derives boolean tags from structured specs for chips/badges
 */
import type { ${PascalName}Specs } from './spec.schema';

/**
 * Tags derived from ${slug} specs
 * Used for filter chips and profile badges
 */
export interface ${PascalName}Tags {
    // Example tags - customize for your category
    isLargeCapacity: boolean;
    isHighPower: boolean;
    hasSmartFeatures: boolean;
}

/**
 * Derives tags from specs
 * Deterministic: same specs always produce same tags
 */
export function derive${PascalName}Tags(specs: ${PascalName}Specs): ${PascalName}Tags {
    return {
        isLargeCapacity: specs.capacityLiters >= 5,
        isHighPower: (specs.wattage ?? 0) >= 1500,
        hasSmartFeatures: specs.hasTimer === true,
    };
}
`;
}

function scoringTemplate(slug: string): string {
    const PascalName = toPascalCase(slug);
    return `/**
 * ${PascalName} Scoring
 * Computes scores from structured specs
 */
import type { ${PascalName}Specs } from './spec.schema';

// ============================================
// SCORE INTERFACE
// ============================================

export interface ${PascalName}Scores {
    c1: number; // Primary criterion (e.g., Performance)
    c2: number; // Secondary criterion (e.g., Features)
    c3: number; // Tertiary criterion (e.g., Build Quality)
}

// ============================================
// SCORING TABLES
// ============================================

const EXAMPLE_TYPE_SCORES: Record<string, number> = {
    'type-a': 6.0,
    'type-b': 7.5,
    'type-c': 9.0,
};

// ============================================
// HELPERS
// ============================================

function clamp(v: number): number {
    return Math.max(0, Math.min(10, v));
}

function scoreBands(value: number | undefined, bands: Array<{min?: number; max?: number; score: number}>, fallback: number): number {
    if (value === undefined) return fallback;
    for (const band of bands) {
        const minOk = band.min === undefined || value >= band.min;
        const maxOk = band.max === undefined || value <= band.max;
        if (minOk && maxOk) return band.score;
    }
    return fallback;
}

// ============================================
// MAIN FUNCTION
// ============================================

export function compute${PascalName}Scores(
    specs: ${PascalName}Specs,
    overrides?: Partial<${PascalName}Scores>
): ${PascalName}Scores {
    const capacityBands = [
        { max: 2, score: 5.0 },
        { min: 2.1, max: 4, score: 7.0 },
        { min: 4.1, max: 6, score: 8.0 },
        { min: 6.1, score: 9.0 },
    ];

    const computed: ${PascalName}Scores = {
        c1: clamp(EXAMPLE_TYPE_SCORES[specs.exampleType] || 6.0),
        c2: clamp(scoreBands(specs.capacityLiters, capacityBands, 6.0)),
        c3: clamp(specs.hasTimer ? 8.0 : 6.0),
    };

    // Apply overrides
    if (overrides) {
        for (const key of Object.keys(overrides) as (keyof ${PascalName}Scores)[]) {
            if (overrides[key] !== undefined) {
                computed[key] = clamp(overrides[key]!);
            }
        }
    }

    return computed;
}
`;
}

function uiAdaptersTemplate(slug: string): string {
    const PascalName = toPascalCase(slug);
    const camelName = toCamelCase(slug);
    return `/**
 * ${PascalName} UI Adapters
 * Glue code to connect scoring module to UI components
 * 
 * STRICT_SPECS mode:
 * When STRICT_SPECS=true, throws if a product uses fallback.
 */
import type { ${PascalName}Specs, ${PascalName}Tags, ${PascalName}Scores } from './index';
import { derive${PascalName}Tags, compute${PascalName}Scores, ${PascalName}SpecSchema } from './index';

// ============================================
// DERIVED DATA STRUCTURE
// ============================================

export interface ${PascalName}Derived {
    specs: ${PascalName}Specs;
    tags: ${PascalName}Tags;
    scores: ${PascalName}Scores;
    isFallback: boolean;
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Get derived data for a ${slug} product
 */
export function get${PascalName}Derived(product: unknown): ${PascalName}Derived {
    const isStrictMode = process.env.STRICT_SPECS === 'true';
    const productId = (product as { id?: string })?.id || 'unknown';
    
    // Try to get structuredSpecs from product
    const structuredSpecs = (product as { structuredSpecs?: unknown })?.structuredSpecs;
    
    if (structuredSpecs) {
        const parsed = ${PascalName}SpecSchema.safeParse(structuredSpecs);
        if (parsed.success) {
            return {
                specs: parsed.data,
                tags: derive${PascalName}Tags(parsed.data),
                scores: compute${PascalName}Scores(parsed.data),
                isFallback: false,
            };
        }
    }
    
    // STRICT MODE: Throw if fallback
    if (isStrictMode) {
        throw new Error(
            \`[STRICT_SPECS] ${slug} fallback for "\${productId}": \` +
            \`Add structuredSpecs to this product or set STRICT_SPECS=false.\`
        );
    }
    
    // Fallback to defaults (temporary)
    const defaultSpecs: ${PascalName}Specs = {
        exampleType: 'type-a',
        capacityLiters: 3,
    };
    
    if (process.env.NODE_ENV === 'development') {
        console.log(\`[${PascalName}Adapter] Fallback specs for "\${productId}"\`);
    }
    
    return {
        specs: defaultSpecs,
        tags: derive${PascalName}Tags(defaultSpecs),
        scores: compute${PascalName}Scores(defaultSpecs),
        isFallback: true,
    };
}
`;
}

function indexTemplate(slug: string): string {
    const PascalName = toPascalCase(slug);
    const camelName = toCamelCase(slug);
    return `/**
 * ${PascalName} Category Module
 * Unified scoring system for ${slug} products
 */

// Schema
export { ${PascalName}SpecSchema } from './spec.schema';
export type { ${PascalName}Specs, ExampleType } from './spec.schema';

// Tags
export { derive${PascalName}Tags } from './tags';
export type { ${PascalName}Tags } from './tags';

// Scoring
export { compute${PascalName}Scores } from './scoring';
export type { ${PascalName}Scores } from './scoring';

// UI Adapters (compat layer)
export { get${PascalName}Derived } from './uiAdapters';
export type { ${PascalName}Derived } from './uiAdapters';

// Category module implementation
import { ${PascalName}SpecSchema, type ${PascalName}Specs } from './spec.schema';
import { derive${PascalName}Tags, type ${PascalName}Tags } from './tags';
import { compute${PascalName}Scores, type ${PascalName}Scores } from './scoring';
import { get${PascalName}Derived } from './uiAdapters';
import type { CategoryModule } from '../categoryModule';

/**
 * ${PascalName} Category Module
 * Single source of truth for specs, tags, and scores
 */
export const ${camelName}Module: CategoryModule<${PascalName}Specs, ${PascalName}Tags, ${PascalName}Scores> = {
    categoryId: '${slug}',
    specSchema: ${PascalName}SpecSchema,
    deriveTags: derive${PascalName}Tags,
    computeScores: compute${PascalName}Scores,
    getDerived: get${PascalName}Derived,
};

export default ${camelName}Module;
`;
}

function qaMdTemplate(slug: string): string {
    return `# ${toPascalCase(slug)} QA Guide

Quality Assurance documentation for the ${slug} category module.

## Commands

### Validate
\`\`\`bash
npm run qa:category -- --category ${slug}
\`\`\`

### Update Snapshot
\`\`\`bash
npm run qa:category -- --category ${slug} --write-snapshot
\`\`\`

## Workflow

### Adding a New Product
1. Create \`products.entry.*.ts\` with \`structuredSpecs\`
2. Run QA (expect failure: "ADDED")
3. Update snapshot
4. Commit both files

### Changing Scoring Rules
1. Edit \`scoring.ts\` or \`tags.ts\`
2. Run QA (expect diffs)
3. Review changes
4. Update snapshot with explanation

## Snapshot Location
\`qaSnapshots/${slug}.v1.json\`

## STRICT_SPECS Mode
Set \`STRICT_SPECS=true\` in production to fail fast when products lack structured specs.
`;
}

// ============================================
// MAIN
// ============================================

async function main() {
    const { category } = parseArgs();
    const categoryDir = path.resolve(__dirname, `../src/categories/${category}`);
    const PascalName = toPascalCase(category);
    const camelName = toCamelCase(category);

    console.log('========================================');
    console.log('New Category Kit Generator');
    console.log(`Category: ${category}`);
    console.log(`Directory: ${categoryDir}`);
    console.log('========================================\n');

    // Check if directory already exists
    if (fs.existsSync(categoryDir)) {
        console.error(`❌ Directory already exists: ${categoryDir}`);
        console.error('   Remove it first or choose a different category slug.');
        process.exit(1);
    }

    // Create directory
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`✓ Created directory: ${categoryDir}\n`);

    // Create files
    const files = [
        { name: 'spec.schema.ts', content: specSchemaTemplate(category) },
        { name: 'tags.ts', content: tagsTemplate(category) },
        { name: 'scoring.ts', content: scoringTemplate(category) },
        { name: 'uiAdapters.ts', content: uiAdaptersTemplate(category) },
        { name: 'index.ts', content: indexTemplate(category) },
        { name: 'QA.md', content: qaMdTemplate(category) },
    ];

    for (const file of files) {
        const filePath = path.join(categoryDir, file.name);
        fs.writeFileSync(filePath, file.content, 'utf-8');
        console.log(`✓ Created: ${file.name}`);
    }

    console.log('\n========================================');
    console.log('✅ Category kit created successfully!');
    console.log('========================================\n');

    console.log('Next steps:\n');
    console.log('1. Customize the schema, tags, and scoring for your category:');
    console.log(`   - Edit src/categories/${category}/spec.schema.ts`);
    console.log(`   - Edit src/categories/${category}/tags.ts`);
    console.log(`   - Edit src/categories/${category}/scoring.ts\n`);

    console.log('2. Add the module to the category registry:');
    console.log('   - Edit src/categories/registry.ts');
    console.log(`   - Import: import { ${camelName}Module } from './${category}';`);
    console.log(`   - Add: '${category}': ${camelName}Module,\n`);

    console.log('3. Create products with structuredSpecs matching your schema\n');

    console.log('4. Generate the QA snapshot:');
    console.log(`   npx tsx scripts/qa-category.ts --category ${category} --write-snapshot\n`);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
