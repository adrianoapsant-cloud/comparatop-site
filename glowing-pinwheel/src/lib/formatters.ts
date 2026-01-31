/**
 * @file formatters.ts
 * @description Shared formatting utilities for pt-BR locale
 * 
 * These functions are pure and can be used in both server and client components.
 */

// ============================================
// Score Formatters
// ============================================

/**
 * Format a single score value (1 decimal place, pt-BR)
 */
export function formatScoreValue(value: number | null | undefined): string {
    if (value == null || typeof value !== 'number' || isNaN(value)) return '—';
    return value.toFixed(1).replace('.', ',');
}

/**
 * Format a score range as text (1 decimal place)
 */
export function formatScoreRange(range: [number, number] | null | undefined): string | null {
    if (!range) return null;
    const [min, max] = range;
    if (typeof min !== 'number' || typeof max !== 'number') return null;
    return `${min.toFixed(1).replace('.', ',')}–${max.toFixed(1).replace('.', ',')}`;
}

// ============================================
// Currency Formatters
// ============================================

/**
 * Format a single currency value (BRL, no cents)
 */
export function formatCurrencyValue(value: number | null | undefined): string {
    if (value == null || typeof value !== 'number' || isNaN(value)) return '—';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format a currency range as text (BRL)
 */
export function formatCurrencyRange(range: [number, number] | null | undefined): string | null {
    if (!range) return null;
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const [min, max] = range;
    if (typeof min !== 'number' || typeof max !== 'number') return null;
    return `${formatter.format(min)}–${formatter.format(max)}`;
}

// ============================================
// BRL Currency Helper
// ============================================

/**
 * Format value as BRL currency (legacy compatibility)
 */
export function formatBRL(value: number | null | undefined): string {
    return formatCurrencyValue(value);
}

// ============================================
// Date Formatters
// ============================================

/**
 * Format ISO date string to pt-BR format (DD/MM/YYYY)
 */
export function formatDateBR(isoString: string | null | undefined): string {
    if (!isoString || isoString === '—') return '—';
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return '—';
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return '—';
    }
}
