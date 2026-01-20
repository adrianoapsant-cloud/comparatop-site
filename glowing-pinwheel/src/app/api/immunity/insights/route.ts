import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================
// TYPES
// ============================================

interface ImmunityEvent {
    ts: string;
    requestId: string;
    sessionId: string;
    chat?: {
        mode: 'deterministic' | 'llm';
        userMessage: string;
        assistantText: string;
    };
    nav?: {
        type: string;
        path: string;
    };
    friction?: {
        rageClicks: number;
        confusionScrolls: number;
        score: number;
    };
    pageContext?: {
        path?: string;
        categorySlug?: string;
        section?: string;
    };
    intents?: Record<string, boolean>;
    latency?: {
        totalMs: number;
    };
    uiSnapshot?: {
        hasUi?: boolean;
        elementsCtSample?: string[];
        disabledCt?: string[];
        lastNavType?: string;
        lastNavTarget?: string;
        lastErrorsCount?: number;
    };
}

interface InsightsSummary {
    avgFriction: number;
    peakFriction: number;
    totalEvents: number;
    topPaths: Array<{ path: string; score: number; count: number }>;
    topIntents: Array<{ intent: string; avgFriction: number; count: number }>;
    topCTAs: Array<{ ct: string; rageClicks: number; confusion: number; count: number }>;
}

interface Idea {
    id: string;
    type: 'UX_FIX' | 'CONTENT_GAP' | 'CATALOG_DATA' | 'CHAT_FLOW';
    title: string;
    why: string;
    whatToDo: string[];
    confidence: 'low' | 'med' | 'high';
    related: { path?: string; intent?: string; ct?: string };
}

// ============================================
// HEURISTICS FOR IDEA GENERATION
// ============================================

function generateIdeas(events: ImmunityEvent[]): Idea[] {
    const ideas: Idea[] = [];
    let ideaCounter = 0;

    // Aggregate data
    const pathFriction = new Map<string, { total: number; count: number; errorsCount: number }>();
    const intentFriction = new Map<string, { total: number; count: number }>();
    const ctaClicks = new Map<string, { rageClicks: number; total: number }>();
    const uiHelpCount = events.filter(e => e.intents?.uiHelp).length;
    const manualCount = events.filter(e => e.intents?.manual).length;
    const detailsCount = events.filter(e => e.intents?.details).length;

    for (const event of events) {
        const path = event.pageContext?.path || 'unknown';
        const score = event.friction?.score || 0;
        const errorsCount = event.uiSnapshot?.lastErrorsCount || 0;

        // Path friction
        const pf = pathFriction.get(path) || { total: 0, count: 0, errorsCount: 0 };
        pf.total += score;
        pf.count += 1;
        pf.errorsCount += errorsCount;
        pathFriction.set(path, pf);

        // Intent friction
        if (event.intents) {
            for (const [intent, active] of Object.entries(event.intents)) {
                if (active && intent !== 'manual') {
                    const inf = intentFriction.get(intent) || { total: 0, count: 0 };
                    inf.total += score;
                    inf.count += 1;
                    intentFriction.set(intent, inf);
                }
            }
        }

        // CTA rage clicks
        if (event.uiSnapshot?.elementsCtSample && event.friction?.rageClicks) {
            for (const ct of event.uiSnapshot.elementsCtSample) {
                const cta = ctaClicks.get(ct) || { rageClicks: 0, total: 0 };
                cta.rageClicks += event.friction.rageClicks;
                cta.total += 1;
                ctaClicks.set(ct, cta);
            }
        }
    }

    // GENERATE IDEAS based on patterns

    // 1. High friction paths with JS errors
    for (const [path, data] of pathFriction.entries()) {
        if (data.errorsCount > 0 && data.count >= 2) {
            ideas.push({
                id: `idea-${++ideaCounter}`,
                type: 'UX_FIX',
                title: `Erros JS na página ${path}`,
                why: `Detectados ${data.errorsCount} erros de JavaScript em ${data.count} sessões`,
                whatToDo: [
                    'Verificar console do navegador na página',
                    'Corrigir exceções não tratadas',
                    'Adicionar error boundary nos componentes'
                ],
                confidence: data.errorsCount >= 5 ? 'high' : 'med',
                related: { path }
            });
        }
    }

    // 2. High rage clicks on specific CTA
    for (const [ct, data] of ctaClicks.entries()) {
        if (data.rageClicks >= 3) {
            ideas.push({
                id: `idea-${++ideaCounter}`,
                type: 'UX_FIX',
                title: `CTA "${ct}" não responsivo`,
                why: `${data.rageClicks} rage clicks detectados em ${data.total} interações`,
                whatToDo: [
                    `Verificar funcionamento do botão/link "${ct}"`,
                    'Aumentar área clicável se necessário',
                    'Garantir feedback visual imediato'
                ],
                confidence: data.rageClicks >= 6 ? 'high' : 'med',
                related: { ct }
            });
        }
    }

    // 3. Many MANUAL requests = Content gap
    if (manualCount >= 3) {
        ideas.push({
            id: `idea-${++ideaCounter}`,
            type: 'CONTENT_GAP',
            title: 'Falta seção de Manuais',
            why: `${manualCount} pedidos de manual detectados`,
            whatToDo: [
                'Criar banco de links para manuais por SKU',
                'Adicionar bloco "Download Manual" na PDP',
                'Incluir fonte oficial do fabricante'
            ],
            confidence: manualCount >= 5 ? 'high' : 'med',
            related: { intent: 'manual' }
        });
    }

    // 4. UI_HELP frequent = Navigation confusion
    if (uiHelpCount >= 3) {
        ideas.push({
            id: `idea-${++ideaCounter}`,
            type: 'UX_FIX',
            title: 'Usuários com dificuldade de navegação',
            why: `${uiHelpCount} pedidos de ajuda com UI detectados`,
            whatToDo: [
                'Revisar hierarquia visual dos CTAs principais',
                'Adicionar tooltips nos botões importantes',
                'Melhorar onboarding visual'
            ],
            confidence: uiHelpCount >= 5 ? 'high' : 'med',
            related: { intent: 'uiHelp' }
        });
    }

    // 5. DETAILS without catalog data completeness
    if (detailsCount >= 5) {
        ideas.push({
            id: `idea-${++ideaCounter}`,
            type: 'CATALOG_DATA',
            title: 'Melhorar dados de energia no catálogo',
            why: `${detailsCount} pedidos de detalhes técnicos/consumo`,
            whatToDo: [
                'Preencher energy_kwh_month em todos SKUs',
                'Adicionar selo Procel aos produtos',
                'Validar dados de BTU e potência'
            ],
            confidence: 'med',
            related: { intent: 'details' }
        });
    }

    // 6. High friction pages overall
    const highFrictionPaths = Array.from(pathFriction.entries())
        .filter(([_, data]) => (data.total / data.count) >= 50 && data.count >= 3)
        .sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count));

    if (highFrictionPaths.length > 0 && highFrictionPaths[0]) {
        const [topPath, data] = highFrictionPaths[0];
        const avgScore = Math.round(data.total / data.count);
        ideas.push({
            id: `idea-${++ideaCounter}`,
            type: 'UX_FIX',
            title: `Página ${topPath} com alta fricção`,
            why: `Fricção média de ${avgScore}/100 em ${data.count} sessões`,
            whatToDo: [
                'Analisar heat map de cliques',
                'Revisar layout e posicionamento de CTAs',
                'Testar performance de carregamento'
            ],
            confidence: avgScore >= 70 ? 'high' : 'med',
            related: { path: topPath }
        });
    }

    return ideas;
}

// ============================================
// HANDLER
// ============================================

export async function GET(req: NextRequest) {
    // DEV-only check
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '200', 10);

    const logPath = path.join(process.cwd(), '.immunity', 'immunity.jsonl');

    if (!fs.existsSync(logPath)) {
        return NextResponse.json({
            summary: { avgFriction: 0, peakFriction: 0, totalEvents: 0, topPaths: [], topIntents: [], topCTAs: [] },
            ideas: []
        });
    }

    // Read and parse events
    const content = fs.readFileSync(logPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    let events: ImmunityEvent[] = lines
        .map(line => {
            try { return JSON.parse(line) as ImmunityEvent; }
            catch { return null; }
        })
        .filter((e): e is ImmunityEvent => e !== null);

    // Filter by sessionId if provided
    if (sessionId) {
        events = events.filter(e => e.sessionId === sessionId);
    }

    // Take most recent
    events = events.slice(-limit);

    // Build summary
    const chatEvents = events.filter(e => e.chat);
    const frictionScores = chatEvents.map(e => e.friction?.score || 0);
    const avgFriction = frictionScores.length > 0
        ? frictionScores.reduce((a, b) => a + b, 0) / frictionScores.length
        : 0;
    const peakFriction = frictionScores.length > 0 ? Math.max(...frictionScores) : 0;

    // Top paths
    const pathMap = new Map<string, { count: number; total: number }>();
    for (const e of chatEvents) {
        const p = e.pageContext?.path || 'unknown';
        const s = e.friction?.score || 0;
        const existing = pathMap.get(p) || { count: 0, total: 0 };
        pathMap.set(p, { count: existing.count + 1, total: existing.total + s });
    }
    const topPaths = Array.from(pathMap.entries())
        .map(([path, d]) => ({ path, score: Math.round(d.total / d.count), count: d.count }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    // Top intents
    const intentMap = new Map<string, { count: number; total: number }>();
    for (const e of chatEvents) {
        const s = e.friction?.score || 0;
        if (e.intents) {
            for (const [intent, active] of Object.entries(e.intents)) {
                if (active) {
                    const existing = intentMap.get(intent) || { count: 0, total: 0 };
                    intentMap.set(intent, { count: existing.count + 1, total: existing.total + s });
                }
            }
        }
    }
    const topIntents = Array.from(intentMap.entries())
        .map(([intent, d]) => ({ intent, avgFriction: Math.round(d.total / d.count), count: d.count }))
        .sort((a, b) => b.avgFriction - a.avgFriction)
        .slice(0, 5);

    // Top CTAs (simplified)
    const topCTAs: Array<{ ct: string; rageClicks: number; confusion: number; count: number }> = [];

    const summary: InsightsSummary = {
        avgFriction: Math.round(avgFriction * 10) / 10,
        peakFriction,
        totalEvents: events.length,
        topPaths,
        topIntents,
        topCTAs
    };

    // Generate ideas
    const ideas = generateIdeas(events);

    return NextResponse.json({ summary, ideas });
}
