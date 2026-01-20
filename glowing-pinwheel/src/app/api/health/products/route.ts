/**
 * @file /api/health/products/route.ts
 * @description Endpoint de saúde dos produtos
 * 
 * Retorna snapshot resumido de ProductHealth com counts e exemplos.
 * Cache em memória por 30s para evitar recálculo a cada hit.
 */

import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/services/productService';
import type { ProductVM } from '@/lib/viewmodels/productVM';

// ============================================
// CACHE
// ============================================

interface HealthSnapshot {
    timestamp: string;
    overall: 'OK' | 'WARN' | 'FAIL';
    counts: {
        published_ok: number;
        published_warn: number;
        published_fail: number;
        draft_ok: number;
        draft_warn: number;
    };
    topExamples: Array<{
        slug: string;
        category: string;
        status: 'draft' | 'published';
        health: 'WARN' | 'FAIL';
        reasons: string[];
    }>;
    notes: string;
}

let cachedSnapshot: HealthSnapshot | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 30_000; // 30 segundos

// ============================================
// HELPERS
// ============================================

function computeHealthSnapshot(): HealthSnapshot {
    const products = getAllProducts();

    const counts = {
        published_ok: 0,
        published_warn: 0,
        published_fail: 0,
        draft_ok: 0,
        draft_warn: 0,
    };

    const examples: HealthSnapshot['topExamples'] = [];

    for (const product of products) {
        const status = (product.raw as { status?: 'draft' | 'published' }).status || 'draft';
        const health = product.health;

        if (health === 'FAIL') {
            if (status === 'published') {
                counts.published_fail++;
            }
            // Adicionar exemplo
            if (examples.length < 10) {
                examples.push({
                    slug: product.slug,
                    category: product.categoryId,
                    status,
                    health: 'FAIL',
                    reasons: product.healthIssues.map(i => i.code),
                });
            }
        } else if (health === 'WARN') {
            if (status === 'published') {
                counts.published_warn++;
            } else {
                counts.draft_warn++;
            }
            // Adicionar exemplo (priorizar published)
            if (examples.length < 10 && (status === 'published' || examples.length < 5)) {
                examples.push({
                    slug: product.slug,
                    category: product.categoryId,
                    status,
                    health: 'WARN',
                    reasons: product.healthIssues.map(i => i.code),
                });
            }
        } else {
            if (status === 'published') {
                counts.published_ok++;
            } else {
                counts.draft_ok++;
            }
        }
    }

    // Determinar overall status
    let overall: 'OK' | 'WARN' | 'FAIL' = 'OK';
    if (counts.published_fail > 0) {
        overall = 'FAIL';
    } else if (counts.published_warn > 0 || counts.draft_warn > 0) {
        overall = 'WARN';
    }

    return {
        timestamp: new Date().toISOString(),
        overall,
        counts,
        topExamples: examples,
        notes: 'CI falha apenas se published_fail > 0. Drafts com warnings são permitidos.',
    };
}

function getSnapshot(): HealthSnapshot {
    const now = Date.now();

    if (!cachedSnapshot || now - cacheTimestamp > CACHE_TTL_MS) {
        cachedSnapshot = computeHealthSnapshot();
        cacheTimestamp = now;
    }

    return cachedSnapshot;
}

// ============================================
// ROUTE HANDLER
// ============================================

export async function GET() {
    try {
        const snapshot = getSnapshot();

        return NextResponse.json(snapshot, {
            status: 200,
            headers: {
                'Cache-Control': 'private, max-age=30',
            },
        });
    } catch (error) {
        console.error('[api/health/products] Error:', error);
        return NextResponse.json(
            { error: 'Failed to compute health snapshot' },
            { status: 500 }
        );
    }
}
