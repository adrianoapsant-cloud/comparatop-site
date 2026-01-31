/**
 * @file index.ts
 * @description Registry de templates mock por categoria
 * 
 * P4-3 + P5-4: Templates estáveis (minimal versionados) - 11 categorias
 */

import * as path from 'path';
import * as fs from 'fs';

// ============================================
// TEMPLATE REGISTRY
// ============================================

/**
 * Mapeamento de categoria -> nome do arquivo de template gold
 * Templates gold estão em src/data/mocks/
 */
export const MOCK_TEMPLATE_BY_CATEGORY: Record<string, string> = {
    'robot-vacuum': 'roborock-q7-l5.json',
    'tv': 'lg-c3-65.json',
    'smartwatch': 'samsung-galaxy-watch7-44mm-lte.json',
};

/**
 * Mapeamento de categoria -> template minimal estável
 * Templates minimal estão em src/lib/scaffold/templates/minimal/
 */
export const MINIMAL_TEMPLATE_BY_CATEGORY: Record<string, string> = {
    'fridge': 'fridge.minimal.json',
    'air_conditioner': 'air_conditioner.minimal.json',
    'smartphone': 'smartphone.minimal.json',
    // P5-4: +5 categories
    'laptop': 'laptop.minimal.json',
    'washer': 'washer.minimal.json',
    'monitor': 'monitor.minimal.json',
    'tablet': 'tablet.minimal.json',
    'soundbar': 'soundbar.minimal.json',
};

// ============================================
// HELPERS
// ============================================

/**
 * Obtém o caminho absoluto do template mock para uma categoria
 * Prioriza gold template, fallback para minimal
 * @returns Caminho do template ou null se não existir
 */
export function getMockTemplatePath(categoryId: string, projectRoot?: string): string | null {
    const root = projectRoot || process.cwd();

    // Tentar template gold primeiro
    const goldTemplateName = MOCK_TEMPLATE_BY_CATEGORY[categoryId];
    if (goldTemplateName) {
        const goldPath = path.join(root, 'src', 'data', 'mocks', goldTemplateName);
        if (fs.existsSync(goldPath)) {
            return goldPath;
        }
    }

    // Fallback para template minimal
    const minimalTemplateName = MINIMAL_TEMPLATE_BY_CATEGORY[categoryId];
    if (minimalTemplateName) {
        const minimalPath = path.join(root, 'src', 'lib', 'scaffold', 'templates', 'minimal', minimalTemplateName);
        if (fs.existsSync(minimalPath)) {
            return minimalPath;
        }
    }

    return null;
}

/**
 * Verifica se uma categoria tem template gold disponível
 */
export function hasGoldTemplate(categoryId: string): boolean {
    return categoryId in MOCK_TEMPLATE_BY_CATEGORY;
}

/**
 * Verifica se uma categoria tem template minimal disponível
 */
export function hasMinimalTemplate(categoryId: string): boolean {
    return categoryId in MINIMAL_TEMPLATE_BY_CATEGORY;
}

/**
 * Verifica se uma categoria tem qualquer template (gold ou minimal)
 */
export function hasAnyTemplate(categoryId: string): boolean {
    return hasGoldTemplate(categoryId) || hasMinimalTemplate(categoryId);
}

/**
 * Lista todos os templates disponíveis
 */
export function listAvailableMockTemplates(): Array<{ categoryId: string; templateName: string; type: 'gold' | 'minimal' }> {
    const results: Array<{ categoryId: string; templateName: string; type: 'gold' | 'minimal' }> = [];

    for (const [categoryId, templateName] of Object.entries(MOCK_TEMPLATE_BY_CATEGORY)) {
        results.push({ categoryId, templateName, type: 'gold' });
    }

    for (const [categoryId, templateName] of Object.entries(MINIMAL_TEMPLATE_BY_CATEGORY)) {
        results.push({ categoryId, templateName, type: 'minimal' });
    }

    return results;
}

/**
 * Carrega e retorna o template JSON para uma categoria
 */
export function loadMockTemplate(categoryId: string, projectRoot?: string): Record<string, unknown> | null {
    const templatePath = getMockTemplatePath(categoryId, projectRoot);
    if (!templatePath) {
        return null;
    }

    try {
        const content = fs.readFileSync(templatePath, 'utf-8');
        return JSON.parse(content);
    } catch {
        return null;
    }
}
