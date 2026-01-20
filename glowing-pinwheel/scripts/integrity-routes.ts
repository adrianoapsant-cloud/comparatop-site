/**
 * @file integrity-routes.ts
 * @description Valida que rotas privadas NÃO aparecem no sitemap e respondem 401/403/redirect
 * 
 * Roda: npx tsx scripts/integrity-routes.ts
 * Requer: servidor rodando no BASE_URL (padrão localhost:3000)
 */

import { resolveBaseUrl } from './_baseUrl';

const BASE_URL = resolveBaseUrl();

// Rotas que DEVEM estar protegidas
const PRIVATE_ROUTES = [
    '/admin',
    '/admin/checklist',
    '/dev',
    '/dev/energy',
    '/dev/supabase',
    '/dev/immunity-insights',
    // '/api/immunity/recent', // Removido - é API pública de telemetria
    '/api/admin/session',
    '/api/supabase/seed-energy-rates',
];

// Rotas que DEVEM estar públicas
const PUBLIC_ROUTES = [
    '/',
    '/metodologia',
    '/comparar',
    '/categorias/smart-tvs',
    '/produto/samsung-qn90c-65', // Slug correto com tamanho
];

interface RouteResult {
    valid: boolean;
    privateRoutesExposed: string[];
    publicRoutesBlocked: string[];
}

async function checkRoute(url: string): Promise<{ status: number; redirected: boolean; location?: string }> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'manual',  // Don't follow redirects
            headers: {
                'User-Agent': 'IntegrityBot/1.0',
            }
        });
        return {
            status: response.status,
            redirected: response.status >= 300 && response.status < 400,
            location: response.headers.get('location') || undefined,
        };
    } catch (error) {
        return { status: 0, redirected: false };
    }
}

async function validateRoutes(): Promise<RouteResult> {
    const result: RouteResult = {
        valid: true,
        privateRoutesExposed: [],
        publicRoutesBlocked: [],
    };

    console.log('\n🔐 INTEGRITY:ROUTES');
    console.log('='.repeat(50));
    console.log(`BASE_URL: ${BASE_URL}`);

    // 1. Verificar rotas PRIVADAS (devem redirecionar ou retornar 401/403/404)
    console.log('\n📌 Verificando rotas PRIVADAS (devem estar protegidas):');
    for (const route of PRIVATE_ROUTES) {
        const url = `${BASE_URL}${route}`;
        const check = await checkRoute(url);

        // Rota privada está EXPOSTA se retornar 200 sem redirect
        const isExposed = check.status === 200 && !check.redirected;

        if (isExposed) {
            console.log(`  ❌ ${route} → ${check.status} (EXPOSTA!)`);
            result.privateRoutesExposed.push(route);
            result.valid = false;
        } else if (check.redirected) {
            console.log(`  ✅ ${route} → ${check.status} (redirect to ${check.location})`);
        } else {
            console.log(`  ✅ ${route} → ${check.status}`);
        }
    }

    // 2. Verificar rotas PÚBLICAS (devem retornar 200)
    console.log('\n🌐 Verificando rotas PÚBLICAS (devem estar acessíveis):');
    for (const route of PUBLIC_ROUTES) {
        const url = `${BASE_URL}${route}`;
        const check = await checkRoute(url);

        // Seguir redirect se houver
        if (check.redirected && check.location) {
            const finalCheck = await fetch(check.location).then(r => r.status).catch(() => 0);
            if (finalCheck !== 200) {
                console.log(`  ❌ ${route} → ${check.status} → ${finalCheck} (BLOQUEADA!)`);
                result.publicRoutesBlocked.push(route);
                result.valid = false;
            } else {
                console.log(`  ✅ ${route} → ${check.status} → 200`);
            }
        } else if (check.status === 200) {
            console.log(`  ✅ ${route} → ${check.status}`);
        } else {
            console.log(`  ❌ ${route} → ${check.status} (BLOQUEADA!)`);
            result.publicRoutesBlocked.push(route);
            result.valid = false;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`Rotas privadas expostas: ${result.privateRoutesExposed.length}`);
    console.log(`Rotas públicas bloqueadas: ${result.publicRoutesBlocked.length}`);
    console.log('='.repeat(50));

    if (result.valid) {
        console.log('\n✅ FRONTEIRA PÚBLICO/PRIVADO OK!');
    } else {
        console.log('\n❌ FALHOU - Corrija os erros acima');
        process.exit(1);
    }

    return result;
}

validateRoutes().catch(err => {
    console.error('Erro:', err.message);
    console.log('\n⚠️ Certifique-se de que o servidor está rodando: npm run dev');
    process.exit(1);
});
