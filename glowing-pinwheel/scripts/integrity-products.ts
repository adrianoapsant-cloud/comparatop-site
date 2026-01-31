/**
 * @file integrity-products.ts
 * @description Valida integridade dos produtos usando ProductSchema (Zod)
 * 
 * Lógica de status:
 * - 'draft': Campos comerciais faltantes geram WARNING (não bloqueia CI)
 * - 'published': Campos comerciais faltantes geram FAIL (bloqueia CI)
 * 
 * Roda: npm run integrity:products
 */

// Para rodar via npx tsx, precisamos de imports dinâmicos
async function main() {
    console.log('\n📦 INTEGRITY:PRODUCTS - Status-Aware Validation');
    console.log('='.repeat(60));

    try {
        // Import dinâmico para evitar problemas de path
        const { ALL_PRODUCTS } = await import('../src/data/products');
        const { CATEGORIES } = await import('../src/data/categories');
        const { validateProduct } = await import('../src/lib/schemas/product');
        const { toProductVM } = await import('../src/lib/viewmodels/productVM');
        const { validateCategoryAttributes } = await import('../src/lib/schemas/categories');

        const validCategoryIds = new Set(Object.keys(CATEGORIES));
        const slugsSeen = new Set<string>();

        interface ProductIssue {
            id: string;
            type: 'error' | 'warning';
            code: string;
            message: string;
            status: 'draft' | 'published';
        }

        const issues: ProductIssue[] = [];
        let validCount = 0;

        // Contadores por status
        let draftWarnCount = 0;
        let draftOkCount = 0;
        let publishedFailCount = 0;
        let publishedWarnCount = 0;
        let publishedOkCount = 0;

        console.log(`\nValidando ${ALL_PRODUCTS.length} produtos...\n`);

        for (const product of ALL_PRODUCTS) {
            const productId = (product as { id?: string }).id || 'unknown';
            const productStatus = (product as { status?: 'draft' | 'published' }).status || 'draft';

            // 1. Validar contra schema Zod
            const validation = validateProduct(product);
            if (!validation.success) {
                issues.push({
                    id: productId,
                    type: 'error',
                    code: 'SCHEMA_INVALID',
                    message: `Schema inválido: ${validation.errors?.join(', ')}`,
                    status: productStatus,
                });
                if (productStatus === 'published') publishedFailCount++;
                continue;
            }

            // 2. Verificar slug único
            if (slugsSeen.has(productId)) {
                issues.push({
                    id: productId,
                    type: 'error',
                    code: 'DUPLICATE_SLUG',
                    message: 'Slug duplicado',
                    status: productStatus,
                });
                if (productStatus === 'published') publishedFailCount++;
                continue;
            }
            slugsSeen.add(productId);

            // 3. Verificar categoria válida
            const categoryId = (product as { categoryId?: string }).categoryId;
            if (categoryId && !validCategoryIds.has(categoryId)) {
                issues.push({
                    id: productId,
                    type: 'error',
                    code: 'INVALID_CATEGORY',
                    message: `Categoria inválida: ${categoryId}`,
                    status: productStatus,
                });
                if (productStatus === 'published') publishedFailCount++;
                continue;
            }

            // 4. Transformar em ViewModel e verificar health
            const vm = toProductVM(product);
            if (!vm) {
                issues.push({
                    id: productId,
                    type: 'error',
                    code: 'VM_TRANSFORM_FAILED',
                    message: 'Falha ao transformar em ViewModel',
                    status: productStatus,
                });
                if (productStatus === 'published') publishedFailCount++;
                continue;
            }

            // 5. Verificar ProductHealth
            if (vm.health === 'FAIL') {
                for (const issue of vm.healthIssues) {
                    issues.push({
                        id: productId,
                        type: 'error',
                        code: issue.code,
                        message: issue.message,
                        status: productStatus,
                    });
                }
                if (productStatus === 'published') publishedFailCount++;
                continue;
            }

            if (vm.health === 'WARN') {
                for (const issue of vm.healthIssues) {
                    issues.push({
                        id: productId,
                        type: 'warning',
                        code: issue.code,
                        message: issue.message,
                        status: productStatus,
                    });
                }
            }

            // 6. Verificar atributos específicos da categoria
            const categoryAttrsResult = validateCategoryAttributes(
                categoryId || '',
                (product as { attributes?: unknown }).attributes,
                (product as { specs?: unknown }).specs
            );

            let hasAttrError = false;
            let hasAttrWarn = false;

            // Processar ERRORS de atributos
            for (const err of categoryAttrsResult.errors) {
                // Se published: ERROR. Se draft: WARNING
                if (productStatus === 'published') {
                    issues.push({
                        id: productId,
                        type: 'error',
                        code: 'CATEGORY_ATTR_MISSING',
                        message: `${err.path}: ${err.msg}`,
                        status: productStatus,
                    });
                    hasAttrError = true;
                } else {
                    issues.push({
                        id: productId,
                        type: 'warning',
                        code: 'CATEGORY_ATTR_MISSING',
                        message: `${err.path}: ${err.msg}`,
                        status: productStatus,
                    });
                    hasAttrWarn = true;
                }
            }

            // Processar WARNINGS de atributos
            for (const warn of categoryAttrsResult.warnings) {
                issues.push({
                    id: productId,
                    type: 'warning',
                    code: 'CATEGORY_ATTR_RECOMMENDED',
                    message: `${warn.path}: ${warn.msg}`,
                    status: productStatus,
                });
                hasAttrWarn = true;
            }

            // Atualizar contadores
            if (hasAttrError && productStatus === 'published') {
                publishedFailCount++;
            } else if (vm.health === 'WARN' || hasAttrWarn) {
                if (productStatus === 'published') {
                    publishedWarnCount++;
                } else {
                    draftWarnCount++;
                }
            } else {
                validCount++;
                if (productStatus === 'published') {
                    publishedOkCount++;
                } else {
                    draftOkCount++;
                }
            }
        }

        // Relatório
        console.log('='.repeat(60));
        console.log('RESUMO POR STATUS');
        console.log('='.repeat(60));
        console.log(`Total de produtos: ${ALL_PRODUCTS.length}`);
        console.log('');
        console.log('📝 DRAFT (não bloqueiam CI):');
        console.log(`   ✅ OK:   ${draftOkCount}`);
        console.log(`   ⚠️  WARN: ${draftWarnCount}`);
        console.log('');
        console.log('🚀 PUBLISHED (bloqueiam CI se FAIL):');
        console.log(`   ✅ OK:   ${publishedOkCount}`);
        console.log(`   ⚠️  WARN: ${publishedWarnCount}`);
        console.log(`   ❌ FAIL: ${publishedFailCount}`);
        console.log('='.repeat(60));

        // Mostrar erros de published (críticos)
        const publishedErrors = issues.filter(i => i.type === 'error' && i.status === 'published');
        if (publishedErrors.length > 0) {
            console.log('\n❌ ERROS EM PUBLISHED (bloqueiam CI):');
            for (const error of publishedErrors.slice(0, 20)) {
                console.log(`  [${error.id}] ${error.code}: ${error.message}`);
            }
            if (publishedErrors.length > 20) {
                console.log(`  ... e mais ${publishedErrors.length - 20} erros`);
            }
        }

        // Mostrar warnings de draft (informativos)
        const draftWarnings = issues.filter(i => i.type === 'warning' && i.status === 'draft');
        if (draftWarnings.length > 0) {
            console.log('\n⚠️ WARNINGS EM DRAFTS (não bloqueiam, mas devem ser corrigidos):');
            for (const warning of draftWarnings.slice(0, 10)) {
                console.log(`  [${warning.id}] ${warning.code}: ${warning.message}`);
            }
            if (draftWarnings.length > 10) {
                console.log(`  ... e mais ${draftWarnings.length - 10} warnings`);
            }
        }

        // Resultado final - só falha se tiver PUBLISHED com FAIL
        if (publishedFailCount > 0) {
            console.log('\n❌ INTEGRITY:PRODUCTS FALHOU');
            console.log(`   ${publishedFailCount} produto(s) PUBLISHED com erros críticos`);
            console.log('   Corrija os erros ou mude status para "draft"');
            process.exit(1);
        } else if (draftWarnCount > 0) {
            console.log('\n⚠️ INTEGRITY:PRODUCTS PASSOU (drafts com warnings)');
            console.log(`   ${draftWarnCount} draft(s) com warnings (não bloqueiam CI)`);
            process.exit(0);
        } else {
            console.log('\n✅ INTEGRITY:PRODUCTS PASSOU');
            console.log('   Todos os produtos estão OK!');
            process.exit(0);
        }

    } catch (error) {
        console.error('\n❌ Erro ao executar validação:', error);
        process.exit(1);
    }
}

main();
