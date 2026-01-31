#!/usr/bin/env npx tsx
/**
 * @file sanity-playbook-integration.ts
 * @description P15.1: Verifica que labels/pesos de categorias com playbook estão corretos
 */

import { CATEGORIES } from '../src/data/categories';
import { PLAYBOOKS, validatePlaybookWeights } from '../src/config/category-playbooks';
import { validatePlaybookIntegration } from '../src/lib/playbook-integration';

console.log('# P15.1 Playbook Integration Sanity Check\n');

const playbookCategories = Object.keys(PLAYBOOKS);
console.log(`Categories with playbooks: ${playbookCategories.join(', ')}\n`);

let allPass = true;

for (const categoryId of playbookCategories) {
    const category = CATEGORIES[categoryId];

    if (!category) {
        console.log(`❌ ${categoryId}: Category not found in CATEGORIES`);
        allPass = false;
        continue;
    }

    const playbook = PLAYBOOKS[categoryId];
    const playbookValidation = validatePlaybookWeights(playbook);
    const integrationResult = validatePlaybookIntegration(category);

    console.log(`## ${categoryId.toUpperCase()}`);
    console.log(`Playbook weights sum: ${playbookValidation.sum}% (valid: ${playbookValidation.valid})`);
    console.log(`Integration labels match: ${integrationResult.labelsFromPlaybook ? '✅' : '❌'}`);
    console.log(`Integration weights match: ${integrationResult.weightsFromPlaybook ? '✅' : '❌'}`);
    console.log(`Category weights sum: ${integrationResult.weightSum}%`);

    // Show first 3 criteria as proof
    console.log('\nSample criteria (c1-c3):');
    for (let i = 0; i < 3; i++) {
        const criterion = category.criteria[i];
        const playbookCriterion = playbook.criteria[i];
        const labelMatch = criterion.label === playbookCriterion.label;
        const weightMatch = Math.abs(criterion.weight - playbookCriterion.weight) < 0.001;

        console.log(`  ${criterion.id}: "${criterion.label}" (${(criterion.weight * 100).toFixed(2)}%)`);
        console.log(`    Expected: "${playbookCriterion.label}" (${(playbookCriterion.weight * 100).toFixed(2)}%)`);
        console.log(`    Match: ${labelMatch && weightMatch ? '✅' : '❌'}`);
    }

    if (!integrationResult.labelsFromPlaybook || !integrationResult.weightsFromPlaybook) {
        allPass = false;
    }

    console.log('');
}

// Summary
console.log('---');
if (allPass) {
    console.log('✅ All playbook integrations PASS');
    process.exit(0);
} else {
    console.log('❌ Some playbook integrations FAIL');
    process.exit(1);
}
