/**
 * @file route.ts
 * @description API endpoint para receber Web Vitals
 * 
 * POST /api/vitals
 * Body: { name, value, rating, path, timestamp }
 * 
 * Loga em arquivo local (dev) ou pode ser estendido para Supabase.
 */

import { NextRequest, NextResponse } from 'next/server';

interface VitalsPayload {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    path: string;
    timestamp: number;
}

export async function POST(request: NextRequest) {
    try {
        const data: VitalsPayload = await request.json();

        // Validar campos obrigatórios
        if (!data.name || typeof data.value !== 'number' || !data.path) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Log para console (em prod, poderia ir para Supabase/arquivo)
        console.log('[API/vitals]', {
            metric: data.name,
            value: data.value,
            rating: data.rating,
            path: data.path,
            time: new Date(data.timestamp).toISOString(),
        });

        // TODO: Persistir em Supabase se necessário
        // await supabase.from('web_vitals').insert(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API/vitals] Error:', error);
        return NextResponse.json(
            { error: 'Internal error' },
            { status: 500 }
        );
    }
}

// Desabilitar cache para este endpoint
export const dynamic = 'force-dynamic';
