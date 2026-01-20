/**
 * @file logger.ts
 * @description Observability Logger - Ring buffer para eventos runtime
 * 
 * MVP de observabilidade para monitorar saúde de produtos e fallbacks.
 * Ring buffer reinicia em cold start serverless (aceitável para MVP).
 * 
 * @see docs/OBSERVABILITY.md
 */

// ============================================
// TYPES
// ============================================

export type LogLevel = 'info' | 'warn' | 'error';

export type LogCategory =
    | 'product_health'  // Produtos com WARN/FAIL
    | 'fallback'        // Slugs removidos, listas filtradas
    | 'route_error';    // 404, produtos não encontrados

export interface LogEvent {
    ts: string;
    level: LogLevel;
    category: LogCategory;
    message: string;
    route?: string;
    data?: Record<string, unknown>;
}

// ============================================
// RING BUFFER
// ============================================

const MAX_EVENTS = 300;
const DEDUPE_WINDOW_MS = 60_000; // 60 segundos

/** Ring buffer de eventos */
const eventBuffer: LogEvent[] = [];

/** Map para deduplicação: key → timestamp do último log */
const dedupeMap = new Map<string, number>();

/**
 * Gera chave de deduplicação para um evento
 */
function getDedupeKey(event: Omit<LogEvent, 'ts'>): string {
    const slugPart = (event.data as { slug?: string })?.slug || '';
    const reasonPart = Array.isArray((event.data as { reasons?: string[] })?.reasons)
        ? (event.data as { reasons: string[] }).reasons.join(',')
        : '';
    return `${event.category}:${event.route || ''}:${slugPart}:${reasonPart}:${event.message}`;
}

/**
 * Verifica se evento já foi logado recentemente (dentro da janela de dedupe)
 */
function isDuplicate(key: string): boolean {
    const lastLogged = dedupeMap.get(key);
    if (!lastLogged) return false;
    return Date.now() - lastLogged < DEDUPE_WINDOW_MS;
}

/**
 * Limpa entradas antigas do mapa de deduplicação
 */
function cleanupDedupeMap(): void {
    const now = Date.now();
    for (const [key, timestamp] of dedupeMap) {
        if (now - timestamp > DEDUPE_WINDOW_MS * 2) {
            dedupeMap.delete(key);
        }
    }
}

// ============================================
// PUBLIC API
// ============================================

export interface LogEventInput {
    level: LogLevel;
    category: LogCategory;
    message: string;
    route?: string;
    data?: Record<string, unknown>;
}

/**
 * Registra um evento no ring buffer
 * 
 * @param input - Dados do evento
 * @returns true se evento foi logado, false se deduplicado
 */
export function logEvent(input: LogEventInput): boolean {
    const dedupeKey = getDedupeKey(input);

    // Verificar deduplicação
    if (isDuplicate(dedupeKey)) {
        return false;
    }

    // Criar evento com timestamp
    const event: LogEvent = {
        ts: new Date().toISOString(),
        ...input,
    };

    // Adicionar ao buffer (circular)
    if (eventBuffer.length >= MAX_EVENTS) {
        eventBuffer.shift(); // Remove o mais antigo
    }
    eventBuffer.push(event);

    // Atualizar mapa de deduplicação
    dedupeMap.set(dedupeKey, Date.now());

    // Cleanup periódico (a cada 100 logs)
    if (eventBuffer.length % 100 === 0) {
        cleanupDedupeMap();
    }

    // Log para console em dev (opcional, pode ser removido em prod)
    if (process.env.NODE_ENV === 'development') {
        const levelEmoji = { info: 'ℹ️', warn: '⚠️', error: '❌' }[input.level];
        console.log(`${levelEmoji} [${input.category}] ${input.message}`, input.data || '');
    }

    return true;
}

export interface GetRecentEventsOptions {
    category?: LogCategory;
    level?: LogLevel;
    limit?: number;
}

/**
 * Obtém eventos recentes do ring buffer
 * 
 * @param options - Filtros opcionais
 * @returns Array de eventos (mais recentes primeiro)
 */
export function getRecentEvents(options: GetRecentEventsOptions = {}): LogEvent[] {
    const { category, level, limit = 50 } = options;

    let filtered = [...eventBuffer];

    if (category) {
        filtered = filtered.filter(e => e.category === category);
    }

    if (level) {
        filtered = filtered.filter(e => e.level === level);
    }

    // Retornar mais recentes primeiro
    return filtered.reverse().slice(0, limit);
}

/**
 * Limpa o buffer (útil para testes)
 */
export function clearEventBuffer(): void {
    eventBuffer.length = 0;
    dedupeMap.clear();
}

/**
 * Retorna estatísticas do buffer
 */
export function getBufferStats(): { total: number; byLevel: Record<LogLevel, number>; byCategory: Record<LogCategory, number> } {
    const stats = {
        total: eventBuffer.length,
        byLevel: { info: 0, warn: 0, error: 0 } as Record<LogLevel, number>,
        byCategory: { product_health: 0, fallback: 0, route_error: 0 } as Record<LogCategory, number>,
    };

    for (const event of eventBuffer) {
        stats.byLevel[event.level]++;
        stats.byCategory[event.category]++;
    }

    return stats;
}
