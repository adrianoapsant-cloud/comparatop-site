/**
 * @file validate-product.ts
 * @description CLI para validar produtos individualmente ou em lote
 * 
 * Uso:
 *   npm run validate:product -- --id=<productId>
 *   npm run validate:product -- --all
 * 
 * Exit codes:
 *   0: OK (pode ter warnings)
 *   2: ERROR em produto published ou falha de schema
 */

interface ValidationIssue {
    productId: string;
    type: 'ERROR' | 'WARN';
    code: string;
    message: string;
    status: 'draft' | 'published';
}

async function main() {
    const args = process.argv.slice(2);
    const idArg = args.find(a => a.startsWith('--id='));
    const allFlag = args.includes('--all');

    if (!idArg && !allFlag) {
        console.log('Uso:');
        console.log('  npm run validate:product -- --id=<productId>');
        console.log('  npm run validate:product -- --all');
        process.exit(0);
    }

    try {
        // Imports dinâmicos
        const { ALL_PRODUCTS } = await import('../src/data/products');
        const { validateProduct } = await import('../src/lib/schemas/product');
        const { validateCategoryAttributes } = await import('../src/lib/schemas/categories');

        const issues: ValidationIssue[] = [];
        let hasPublishedError = false;

        // Determinar quais produtos validar
        let productsToValidate = ALL_PRODUCTS;
        if (idArg) {
            const productId = idArg.replace('--id=', '');
            const found = ALL_PRODUCTS.find((p: { id?: string }) => p.id === productId);
            if (!found) {
                console.log(`❌ Produto não encontrado: ${productId}`);
                console.log(`\nProdutos disponíveis:`);
                for (const p of ALL_PRODUCTS.slice(0, 10) as { id: string }[]) {
                    console.log(`   - ${p.id}`);
                }
                if (ALL_PRODUCTS.length > 10) {
                    console.log(`   ... e mais ${ALL_PRODUCTS.length - 10} produtos`);
                }
                process.exit(2);
            }
            productsToValidate = [found];
        }

        console.log(`\n🔍 Validando ${productsToValidate.length} produto(s)...\n`);

        for (const product of productsToValidate) {
            const productId = (product as { id?: string }).id || 'unknown';
            const productStatus = (product as { status?: 'draft' | 'published' }).status || 'draft';
            const categoryId = (product as { categoryId?: string }).categoryId || '';
            const attributes = (product as { attributes?: unknown }).attributes;
            const specs = (product as { specs?: unknown }).specs;

            console.log(`📦 ${productId} (${productStatus})`);

            // 1. Validar ProductSchema
            const schemaResult = validateProduct(product);
            if (!schemaResult.success) {
                for (const err of schemaResult.errors || []) {
                    issues.push({
                        productId,
                        type: 'ERROR',
                        code: 'SCHEMA_INVALID',
                        message: err,
                        status: productStatus,
                    });
                    console.log(`   ❌ SCHEMA_INVALID: ${err}`);
                }
                if (productStatus === 'published') hasPublishedError = true;
                continue;
            }

            // 2. Validar atributos da categoria
            const attrResult = validateCategoryAttributes(categoryId, attributes, specs);

            // Processar ERRORs
            for (const err of attrResult.errors) {
                const issueType = productStatus === 'published' ? 'ERROR' : 'WARN';
                issues.push({
                    productId,
                    type: issueType,
                    code: 'CATEGORY_ATTR_MISSING',
                    message: `${err.path}: ${err.msg}`,
                    status: productStatus,
                });
                if (issueType === 'ERROR') {
                    console.log(`   ❌ ${err.path}: ${err.msg}`);
                    hasPublishedError = true;
                } else {
                    console.log(`   ⚠️  ${err.path}: ${err.msg}`);
                }
            }

            // Processar WARNs
            for (const warn of attrResult.warnings) {
                issues.push({
                    productId,
                    type: 'WARN',
                    code: 'CATEGORY_ATTR_RECOMMENDED',
                    message: `${warn.path}: ${warn.msg}`,
                    status: productStatus,
                });
                console.log(`   ⚠️  ${warn.path}: ${warn.msg}`);
            }

            const productIssues = issues.filter(i => i.productId === productId);
            if (productIssues.length === 0) {
                console.log(`   ✅ OK`);
            }
        }

        // Resumo
        console.log('\n' + '='.repeat(50));
        const errors = issues.filter(i => i.type === 'ERROR');
        const warnings = issues.filter(i => i.type === 'WARN');

        console.log(`Total: ${errors.length} ERROR(s), ${warnings.length} WARN(s)`);

        if (hasPublishedError) {
            console.log('\n❌ VALIDAÇÃO FALHOU - Produtos published com erros');
            process.exit(2);
        } else if (warnings.length > 0) {
            console.log('\n⚠️  VALIDAÇÃO OK (com warnings)');
            process.exit(0);
        } else {
            console.log('\n✅ VALIDAÇÃO OK');
            process.exit(0);
        }

    } catch (error) {
        console.error('❌ Erro ao executar validação:', error);
        process.exit(2);
    }
}

main();
