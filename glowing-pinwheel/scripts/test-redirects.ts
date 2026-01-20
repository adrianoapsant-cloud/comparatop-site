/**
 * @file test-redirects.ts
 * @description Testa se os redirects canônicos estão funcionando corretamente
 * 
 * Roda: npx tsx scripts/test-redirects.ts
 * Requer: servidor rodando (npm run dev ou npm run start)
 */

import { PRODUCT_REDIRECTS, CATEGORY_REDIRECTS } from '../src/config/redirects';

const BASE_URL = process.env.INTEGRITY_BASE_URL || 'http://localhost:3000';

interface RedirectTestResult {
    oldUrl: string;
    expectedNewUrl: string;
    actualStatus: number;
    actualLocation: string | null;
    pass: boolean;
    reason?: string;
}

async function testRedirect(
    oldPath: string,
    expectedNewPath: string
): Promise<RedirectTestResult> {
    const oldUrl = `${BASE_URL}${oldPath}`;
    const expectedNewUrl = `${BASE_URL}${expectedNewPath}`;

    try {
        const response = await fetch(oldUrl, {
            method: 'HEAD',
            redirect: 'manual', // Don't follow redirects automatically
        });

        const actualStatus = response.status;
        const actualLocation = response.headers.get('location');

        // Check if it's a redirect (301 or 308)
        const isRedirect = actualStatus === 301 || actualStatus === 308;

        // Check if location matches expected
        const locationMatches = actualLocation?.endsWith(expectedNewPath) ||
            actualLocation === expectedNewUrl;

        const pass = isRedirect && locationMatches;

        return {
            oldUrl,
            expectedNewUrl,
            actualStatus,
            actualLocation,
            pass,
            reason: !pass
                ? (isRedirect
                    ? `Location mismatch: expected ${expectedNewPath}, got ${actualLocation}`
                    : `Expected 301/308, got ${actualStatus}`)
                : undefined,
        };
    } catch (error) {
        return {
            oldUrl,
            expectedNewUrl,
            actualStatus: 0,
            actualLocation: null,
            pass: false,
            reason: `Fetch error: ${(error as Error).message}`,
        };
    }
}

async function runTests() {
    console.log('\n🔀 REDIRECT TESTS');
    console.log('='.repeat(50));
    console.log(`BASE_URL: ${BASE_URL}\n`);

    const results: RedirectTestResult[] = [];

    // Test product redirects
    const productRedirects = Object.entries(PRODUCT_REDIRECTS);
    if (productRedirects.length > 0) {
        console.log('📦 Product Redirects:');
        for (const [oldSlug, newSlug] of productRedirects) {
            const result = await testRedirect(
                `/produto/${oldSlug}`,
                `/produto/${newSlug}`
            );
            results.push(result);
            console.log(`  ${result.pass ? '✅' : '❌'} /produto/${oldSlug} → /produto/${newSlug}`);
            if (!result.pass && result.reason) {
                console.log(`     ↳ ${result.reason}`);
            }
        }
    } else {
        console.log('📦 Product Redirects: (nenhum configurado)');
    }

    // Test category redirects
    const categoryRedirects = Object.entries(CATEGORY_REDIRECTS);
    if (categoryRedirects.length > 0) {
        console.log('\n📂 Category Redirects:');
        for (const [oldSlug, newSlug] of categoryRedirects) {
            const result = await testRedirect(
                `/categorias/${oldSlug}`,
                `/categorias/${newSlug}`
            );
            results.push(result);
            console.log(`  ${result.pass ? '✅' : '❌'} /categorias/${oldSlug} → /categorias/${newSlug}`);
            if (!result.pass && result.reason) {
                console.log(`     ↳ ${result.reason}`);
            }
        }
    } else {
        console.log('\n📂 Category Redirects: (nenhum configurado)');
    }

    // Summary
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    const total = results.length;

    console.log('\n' + '='.repeat(50));
    console.log(`Total: ${total} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
    console.log('='.repeat(50));

    if (total === 0) {
        console.log('\n⚠️ Nenhum redirect configurado para testar.');
        console.log('   Adicione entries em src/config/redirects.ts');
        process.exit(0);
    }

    if (failed > 0) {
        console.log('\n❌ ALGUNS REDIRECTS FALHARAM');
        console.log('   Verifique se o servidor está rodando e rebuild o projeto.');
        process.exit(1);
    } else {
        console.log('\n✅ TODOS OS REDIRECTS OK!');
        process.exit(0);
    }
}

runTests().catch(err => {
    console.error('Erro:', err.message);
    console.log('\n⚠️ Certifique-se de que o servidor está rodando: npm run dev');
    process.exit(1);
});
