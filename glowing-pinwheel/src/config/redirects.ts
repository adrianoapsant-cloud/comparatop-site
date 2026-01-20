/**
 * @file redirects.ts
 * @description SSOT para redirects canônicos de slugs antigos
 * 
 * Para adicionar um novo redirect:
 * 1. Adicione a entrada no map apropriado (PRODUCT_REDIRECTS ou CATEGORY_REDIRECTS)
 * 2. Key = slug antigo, Value = slug canônico
 * 3. Rode `npm run build` para aplicar
 * 4. Teste com `npm run test:redirects`
 */

// ============================================
// PRODUCT REDIRECTS
// ============================================
// Map: oldSlug -> newSlug (canônico)

export const PRODUCT_REDIRECTS: Record<string, string> = {
    // Exemplo: TV antiga com nome diferente
    // 'samsung-qn90c': 'samsung-qn90c-65',

    // Geladeiras - modelo renomeado
    // 'brastemp-frost-free-460': 'brastemp-inverse-460',

    // Adicione novos redirects aqui
};

// ============================================
// CATEGORY REDIRECTS  
// ============================================
// Map: oldSlug -> newSlug (canônico)

export const CATEGORY_REDIRECTS: Record<string, string> = {
    // Categoria renomeada
    'tv': 'smart-tvs',
    'televisores': 'smart-tvs',
    'geladeira': 'geladeiras',
    'refrigeradores': 'geladeiras',
    'ar-condicionado': 'ar-condicionados',
    'climatizadores': 'ar-condicionados',

    // Adicione novos redirects aqui
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Resolve o slug canônico para um tipo de rota
 * @param type - 'product' ou 'category'
 * @param slug - slug atual
 * @returns slug canônico ou o mesmo slug se não houver redirect
 */
export function resolveCanonicalSlug(
    type: 'product' | 'category',
    slug: string
): string {
    const map = type === 'product' ? PRODUCT_REDIRECTS : CATEGORY_REDIRECTS;
    return map[slug] || slug;
}

/**
 * Verifica se um slug precisa de redirect
 */
export function needsRedirect(
    type: 'product' | 'category',
    slug: string
): boolean {
    const map = type === 'product' ? PRODUCT_REDIRECTS : CATEGORY_REDIRECTS;
    return slug in map;
}

/**
 * Gera lista de redirects para next.config.ts
 * Formato compatível com Next.js redirects()
 */
export function generateNextRedirects(): Array<{
    source: string;
    destination: string;
    permanent: boolean;
}> {
    const redirects: Array<{
        source: string;
        destination: string;
        permanent: boolean;
    }> = [];

    // Product redirects
    for (const [oldSlug, newSlug] of Object.entries(PRODUCT_REDIRECTS)) {
        if (oldSlug !== newSlug) {
            redirects.push({
                source: `/produto/${oldSlug}`,
                destination: `/produto/${newSlug}`,
                permanent: true, // 308 Permanent Redirect
            });
        }
    }

    // Category redirects
    for (const [oldSlug, newSlug] of Object.entries(CATEGORY_REDIRECTS)) {
        if (oldSlug !== newSlug) {
            redirects.push({
                source: `/categorias/${oldSlug}`,
                destination: `/categorias/${newSlug}`,
                permanent: true, // 308 Permanent Redirect
            });
        }
    }

    return redirects;
}
