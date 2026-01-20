/**
 * @file route.ts
 * @description API de redirecionamento inteligente para afiliados
 * 
 * Implementa verificação de status em tempo real para Mercado Livre
 * e fallback para busca quando produto não está disponível.
 * 
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    generateSafeLink,
    generateMercadoLivreSearchLink,
    generateMercadoLivreDirectLink,
} from '../../../lib/safe-links';

// ============================================================================
// TIPOS
// ============================================================================

interface MLItemResponse {
    id: string;
    status: 'active' | 'paused' | 'closed' | 'under_review';
    title: string;
}

// ============================================================================
// VERIFICAÇÃO DE STATUS - MERCADO LIVRE
// ============================================================================

/**
 * Verifica o status de um item no Mercado Livre via API pública
 * 
 * A API do ML permite consulta sem autenticação de usuário (apenas app token).
 * Latência típica: <200ms
 * 
 * @param mlbId - ID do produto (ex: 'MLB1234567890')
 * @returns Status do produto ou null se erro
 */
async function checkMLItemStatus(mlbId: string): Promise<'active' | 'unavailable' | 'error'> {
    try {
        const response = await fetch(
            `https://api.mercadolibre.com/items/${mlbId}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // Timeout de 2 segundos para não bloquear o usuário
                signal: AbortSignal.timeout(2000),
            }
        );

        if (!response.ok) {
            // Produto não encontrado ou deletado
            return 'unavailable';
        }

        const data: MLItemResponse = await response.json();

        // Apenas 'active' significa que está disponível para compra
        return data.status === 'active' ? 'active' : 'unavailable';

    } catch (error) {
        // Em caso de timeout ou erro de rede, não bloquear o usuário
        // Fallback para link direto (ainda planta cookie)
        console.error('[ML Status Check] Error:', error);
        return 'error';
    }
}

// ============================================================================
// HANDLER
// ============================================================================

/**
 * GET /api/affiliate-redirect
 * 
 * Query params:
 * - platform: 'amazon' | 'mercadolivre' | 'shopee' | 'magalu'
 * - id: ASIN, MLB ID, ou ID do produto
 * - fallback: Keyword de fallback para busca
 * 
 * Comportamento:
 * - Amazon/Shopee/Magalu: Redireciona direto (sem verificação)
 * - Mercado Livre: Verifica status via API e redireciona condicionalmente
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const platform = searchParams.get('platform') as 'amazon' | 'mercadolivre' | 'shopee' | 'magalu' | null;
    const id = searchParams.get('id');
    const fallback = searchParams.get('fallback');
    const affiliateTag = searchParams.get('tag') || undefined;

    // Validação
    if (!platform || !id) {
        return NextResponse.json(
            { error: 'Missing required params: platform, id' },
            { status: 400 }
        );
    }

    // Mercado Livre: Verificação em tempo real
    if (platform === 'mercadolivre' && id.toUpperCase().startsWith('MLB')) {
        const status = await checkMLItemStatus(id.toUpperCase());

        if (status === 'active') {
            // Produto disponível → Deep Link direto
            const url = generateMercadoLivreDirectLink(id, affiliateTag);
            return NextResponse.redirect(url);
        } else if (status === 'unavailable' && fallback) {
            // Produto indisponível → Busca filtrada
            const url = generateMercadoLivreSearchLink(fallback, affiliateTag);
            return NextResponse.redirect(url);
        } else {
            // Erro ou sem fallback → Tenta link direto mesmo assim
            // (Soft 404 ainda planta cookie)
            const url = generateMercadoLivreDirectLink(id, affiliateTag);
            return NextResponse.redirect(url);
        }
    }

    // Outras plataformas: Redirecionamento direto (sem verificação)
    const url = generateSafeLink(platform, id, fallback || undefined, affiliateTag);
    return NextResponse.redirect(url);
}

// ============================================================================
// METADATA
// ============================================================================

export const runtime = 'edge'; // Usar Edge Runtime para menor latência
