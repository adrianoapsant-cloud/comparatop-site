/**
 * @file numbers.ts
 * @description P5-3: Normalização numérica (unidades, ranges, coerção)
 */

// ============================================
// NUMBER PARSING
// ============================================

/**
 * Parseia número de forma tolerante
 * Suporta: "12.000", "12,000", "12k", "12K", "12 000"
 */
export function parseNumberLoose(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;

    let str = value.trim();

    // Remover espaços como separador de milhar
    str = str.replace(/\s/g, '');

    // K/k = x1000
    if (/^\d+[kK]$/.test(str)) {
        return parseInt(str.replace(/[kK]/, ''), 10) * 1000;
    }

    // M/m = x1000000 (menos comum mas possível)
    if (/^\d+[mM]$/.test(str)) {
        return parseInt(str.replace(/[mM]/, ''), 10) * 1000000;
    }

    // Detectar formato brasileiro (12.000 ou 12.000,50)
    // vs formato americano (12,000 ou 12,000.50)
    const hasDotAndComma = /[.,]/.test(str);
    if (hasDotAndComma) {
        // Se tem vírgula como último separador decimal → brasileiro
        if (/,\d{1,2}$/.test(str)) {
            // Brasileiro: 12.000,50
            str = str.replace(/\./g, '').replace(',', '.');
        } else if (/\.\d{1,2}$/.test(str) && /,/.test(str)) {
            // Americano: 12,000.50
            str = str.replace(/,/g, '');
        } else if (/\.\d{3}/.test(str) && !/,/.test(str)) {
            // Brasileiro sem decimal: 12.000 → 12000
            str = str.replace(/\./g, '');
        } else {
            // Default: remover separadores de milhar
            str = str.replace(/[,\.]/g, (match, offset) => {
                // Último separador é decimal
                const remaining = str.substring(offset + 1);
                return remaining.length <= 2 ? '.' : '';
            });
        }
    }

    const parsed = parseFloat(str);
    return isNaN(parsed) ? null : parsed;
}

/**
 * Extrai valor e unidade de string
 * "5000mAh" → { value: 5000, unit: "mAh" }
 * "65W" → { value: 65, unit: "W" }
 */
export function parseUnit(value: unknown): { value: number; unit: string } | null {
    if (typeof value === 'number') return { value, unit: '' };
    if (typeof value !== 'string') return null;

    const match = value.trim().match(/^([\d.,\s]+)\s*([a-zA-Z]+)$/);
    if (!match) {
        // Tentar só número
        const num = parseNumberLoose(value);
        return num !== null ? { value: num, unit: '' } : null;
    }

    const numPart = parseNumberLoose(match[1]);
    if (numPart === null) return null;

    return { value: numPart, unit: match[2] };
}

// ============================================
// SPECIFIC NORMALIZERS
// ============================================

/**
 * Normaliza polegadas
 * `65"`, "65 in", "65-inch", "65''", "65pol" → 65
 */
export function normalizeInches(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;

    let str = value.trim()
        .replace(/[""'']/g, '')
        .replace(/\s*(in|inch|inches|pol|polegadas?)\s*$/i, '')
        .replace(/-/g, '');

    return parseNumberLoose(str);
}

/**
 * Normaliza voltagem para formato padrão
 * "220", "220v", "220 V", "220V" → "220V"
 * "110", "127", "bivolt" → "110V", "127V", "Bivolt"
 */
export function normalizeVoltage(value: unknown): string | null {
    if (typeof value !== 'string' && typeof value !== 'number') return null;

    const str = String(value).toLowerCase().trim();

    if (str.includes('bivolt') || str.includes('bi-volt') || str === 'dual') {
        return 'Bivolt';
    }

    // Extrair número
    const match = str.match(/(\d+)/);
    if (!match) return null;

    const voltage = parseInt(match[1], 10);
    if (voltage === 110 || voltage === 127 || voltage === 220) {
        return `${voltage}V`;
    }

    return null;
}

/**
 * Normaliza BTUs (remove separadores de milhar)
 * "12.000", "12000", "12k" → 12000
 */
export function normalizeBtus(value: unknown): number | null {
    const parsed = parseNumberLoose(value);
    if (parsed === null) return null;

    // BTUs típicos: 7000, 9000, 12000, 18000, 24000
    // Se veio muito pequeno, pode ser K (12 → 12000)
    if (parsed < 100 && parsed > 0) {
        return parsed * 1000;
    }

    return Math.round(parsed);
}

/**
 * Normaliza refresh rate
 * "120Hz", "120 hz", "120" → 120
 */
export function normalizeRefreshRate(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;

    const str = value.trim().replace(/\s*hz\s*/i, '');
    return parseNumberLoose(str);
}

/**
 * Normaliza capacidade em litros
 * "460L", "460 litros", "460" → 460
 */
export function normalizeCapacityLiters(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;

    const str = value.trim()
        .replace(/\s*(l|L|litros?)\s*$/i, '');

    return parseNumberLoose(str);
}

/**
 * Normaliza mAh (bateria)
 * "5000mAh", "5000 mah", "5k mAh" → 5000
 */
export function normalizeBatteryMah(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;

    const str = value.trim()
        .replace(/\s*mah?\s*/i, '');

    return parseNumberLoose(str);
}

/**
 * Normaliza storage/RAM em GB
 * "256GB", "256 gb", "256" → 256
 * "1TB", "1 tb" → 1024
 */
export function normalizeStorageGb(value: unknown): number | null {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return null;

    const str = value.trim().toLowerCase();

    // Checar TB
    if (str.includes('tb')) {
        const num = parseNumberLoose(str.replace(/\s*tb\s*/i, ''));
        return num !== null ? num * 1024 : null;
    }

    // GB ou sem unidade
    const cleaned = str.replace(/\s*gb?\s*/i, '');
    return parseNumberLoose(cleaned);
}

// ============================================
// CLAMP WITH WARNING
// ============================================

export interface ClampResult {
    value: number;
    clamped: boolean;
    original: number;
    reason?: string;
}

/**
 * Clamp valor dentro de limites, retornando se foi alterado
 */
export function clampRange(
    value: number,
    hardMin: number,
    hardMax: number,
    fieldName?: string
): ClampResult {
    if (value < hardMin) {
        return {
            value: hardMin,
            clamped: true,
            original: value,
            reason: `${fieldName || 'value'} ${value} < hardMin ${hardMin}, ajustado para ${hardMin}`,
        };
    }
    if (value > hardMax) {
        return {
            value: hardMax,
            clamped: true,
            original: value,
            reason: `${fieldName || 'value'} ${value} > hardMax ${hardMax}, ajustado para ${hardMax}`,
        };
    }
    return { value, clamped: false, original: value };
}
