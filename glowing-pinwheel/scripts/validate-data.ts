/**
 * Script de Validação de Dados - Camada 1
 * 
 * @description Valida todos os produtos, scores e dados do ComparaTop
 * @usage npx ts-node --skip-project scripts/validate-data.ts
 */

import { ALL_PRODUCTS } from '../src/data/products';
import { CATEGORIES } from '../src/config/categories';

// ============================================
// TIPOS
// ============================================

interface ValidationError {
    productId: string;
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

interface ValidationResult {
    totalProducts: number;
    errors: ValidationError[];
    warnings: ValidationError[];
    passed: boolean;
}

// ============================================
// VALIDADORES
// ============================================

function validateProducts(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    const REQUIRED_CRITERIA = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];

    ALL_PRODUCTS.forEach(product => {
        // 1. Verificar se tem todos os critérios c1-c10
        const missingCriteria = REQUIRED_CRITERIA.filter(c =>
            product.scores?.[c] === undefined || product.scores?.[c] === null
        );

        if (missingCriteria.length > 0) {
            errors.push({
                productId: product.id,
                field: 'scores',
                message: `Faltam critérios: ${missingCriteria.join(', ')}`,
                severity: 'error'
            });
        }

        // 2. Verificar range dos scores (0-10)
        if (product.scores) {
            Object.entries(product.scores).forEach(([key, value]) => {
                if (typeof value === 'number' && (value < 0 || value > 10)) {
                    errors.push({
                        productId: product.id,
                        field: `scores.${key}`,
                        message: `Score fora do range: ${value} (deve ser 0-10)`,
                        severity: 'error'
                    });
                }
            });
        }

        // 3. Verificar mainCompetitor.score
        if (product.mainCompetitor) {
            const rivalScore = product.mainCompetitor.score;
            if (rivalScore !== undefined) {
                // Verificar se tem 2 casas decimais
                const scoreStr = rivalScore.toString();
                const decimals = scoreStr.includes('.') ? scoreStr.split('.')[1]?.length || 0 : 0;

                if (decimals < 2) {
                    warnings.push({
                        productId: product.id,
                        field: 'mainCompetitor.score',
                        message: `Score do rival não tem 2 decimais: ${rivalScore}`,
                        severity: 'warning'
                    });
                }

                if (rivalScore < 0 || rivalScore > 10) {
                    errors.push({
                        productId: product.id,
                        field: 'mainCompetitor.score',
                        message: `Score do rival fora do range: ${rivalScore}`,
                        severity: 'error'
                    });
                }
            }

            // Verificar keyDifferences
            if (!product.mainCompetitor.keyDifferences || product.mainCompetitor.keyDifferences.length !== 3) {
                warnings.push({
                    productId: product.id,
                    field: 'mainCompetitor.keyDifferences',
                    message: `Deve ter exatamente 3 keyDifferences`,
                    severity: 'warning'
                });
            }
        }

        // 4. Verificar categoria existe
        const category = CATEGORIES[product.categoryId];
        if (!category) {
            errors.push({
                productId: product.id,
                field: 'categoryId',
                message: `Categoria não encontrada: ${product.categoryId}`,
                severity: 'error'
            });
        }

        // 5. Verificar campos obrigatórios
        if (!product.name) {
            errors.push({
                productId: product.id,
                field: 'name',
                message: 'Nome do produto é obrigatório',
                severity: 'error'
            });
        }

        if (!product.brand) {
            warnings.push({
                productId: product.id,
                field: 'brand',
                message: 'Marca não definida',
                severity: 'warning'
            });
        }

        if (!product.price || product.price <= 0) {
            errors.push({
                productId: product.id,
                field: 'price',
                message: `Preço inválido: ${product.price}`,
                severity: 'error'
            });
        }

        // 6. Verificar scoreReasons (opcional mas recomendado)
        if (!product.scoreReasons) {
            warnings.push({
                productId: product.id,
                field: 'scoreReasons',
                message: 'Sem justificativas de score (recomendado ter)',
                severity: 'warning'
            });
        }
    });

    return {
        totalProducts: ALL_PRODUCTS.length,
        errors,
        warnings,
        passed: errors.length === 0
    };
}

function validateCategories(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    Object.entries(CATEGORIES).forEach(([id, category]) => {
        // 1. Verificar se tem 10 critérios
        if (category.criteria.length !== 10) {
            errors.push({
                productId: id,
                field: 'criteria',
                message: `Deve ter 10 critérios, tem ${category.criteria.length}`,
                severity: 'error'
            });
        }

        // 2. Verificar se pesos somam 1.0
        const totalWeight = category.criteria.reduce((sum, c) => sum + c.weight, 0);
        if (Math.abs(totalWeight - 1.0) > 0.001) {
            errors.push({
                productId: id,
                field: 'criteria.weight',
                message: `Pesos somam ${totalWeight.toFixed(3)}, deveria ser 1.0`,
                severity: 'error'
            });
        }

        // 3. Verificar IDs únicos
        const ids = category.criteria.map(c => c.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            errors.push({
                productId: id,
                field: 'criteria.id',
                message: 'IDs de critérios duplicados',
                severity: 'error'
            });
        }

        // 4. Verificar campos obrigatórios da categoria
        if (!category.name || !category.slug) {
            errors.push({
                productId: id,
                field: 'name/slug',
                message: 'Nome ou slug não definidos',
                severity: 'error'
            });
        }
    });

    return {
        totalProducts: Object.keys(CATEGORIES).length,
        errors,
        warnings,
        passed: errors.length === 0
    };
}

// ============================================
// EXECUÇÃO
// ============================================

console.log('\n🔍 VALIDAÇÃO DE DADOS - CAMADA 1\n');
console.log('='.repeat(50));

// Validar Produtos
console.log('\n📦 PRODUTOS\n');
const productResult = validateProducts();
console.log(`Total: ${productResult.totalProducts} produtos`);
console.log(`Erros: ${productResult.errors.length}`);
console.log(`Avisos: ${productResult.warnings.length}`);

if (productResult.errors.length > 0) {
    console.log('\n❌ ERROS:');
    productResult.errors.forEach(e => {
        console.log(`  [${e.productId}] ${e.field}: ${e.message}`);
    });
}

if (productResult.warnings.length > 0) {
    console.log('\n⚠️ AVISOS:');
    productResult.warnings.forEach(w => {
        console.log(`  [${w.productId}] ${w.field}: ${w.message}`);
    });
}

// Validar Categorias
console.log('\n📁 CATEGORIAS\n');
const categoryResult = validateCategories();
console.log(`Total: ${categoryResult.totalProducts} categorias`);
console.log(`Erros: ${categoryResult.errors.length}`);
console.log(`Avisos: ${categoryResult.warnings.length}`);

if (categoryResult.errors.length > 0) {
    console.log('\n❌ ERROS:');
    categoryResult.errors.forEach(e => {
        console.log(`  [${e.productId}] ${e.field}: ${e.message}`);
    });
}

// Resumo Final
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO FINAL\n');

const totalErrors = productResult.errors.length + categoryResult.errors.length;
const totalWarnings = productResult.warnings.length + categoryResult.warnings.length;

if (totalErrors === 0) {
    console.log('✅ CAMADA 1 PASSOU - Dados válidos!');
} else {
    console.log(`❌ CAMADA 1 FALHOU - ${totalErrors} erros encontrados`);
}

console.log(`\nTotal: ${totalErrors} erros, ${totalWarnings} avisos\n`);

// Exit code para CI/CD
process.exit(totalErrors > 0 ? 1 : 0);
