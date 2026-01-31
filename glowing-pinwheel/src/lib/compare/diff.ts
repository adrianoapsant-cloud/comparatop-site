/**
 * @file diff.ts
 * @description Comparison utilities for normalizing and comparing product values
 * 
 * Rules:
 * 1. null/undefined/""/"-"/"—" => null
 * 2. boolean: compare directly
 * 3. number: tolerance 0.0001, also parse "6,7" as 6.7
 * 4. string: trim, lowercase, normalize BRL currency, percentages, units
 * 5. arrays: JSON.stringify after normalizing items
 */

// ============================================
// Types
// ============================================

type NormalizedValue = string | number | boolean | null;

// ============================================
// Normalization
// ============================================

/**
 * Normalize a raw value to a comparable form
 */
export function normalizeComparable(raw: unknown): NormalizedValue {
    // Handle null/undefined
    if (raw === null || raw === undefined) {
        return null;
    }

    // Handle empty strings and dash placeholders
    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (trimmed === '' || trimmed === '-' || trimmed === '—' || trimmed === '–') {
            return null;
        }
        return normalizeString(trimmed);
    }

    // Handle booleans
    if (typeof raw === 'boolean') {
        return raw;
    }

    // Handle numbers
    if (typeof raw === 'number') {
        if (isNaN(raw)) return null;
        return raw;
    }

    // Handle arrays (rare case)
    if (Array.isArray(raw)) {
        const normalized = raw.map(normalizeComparable);
        return JSON.stringify(normalized);
    }

    // Handle objects (rare case - convert to JSON)
    if (typeof raw === 'object') {
        try {
            return JSON.stringify(raw);
        } catch {
            return null;
        }
    }

    // Fallback
    return String(raw);
}

/**
 * Normalize a string value for comparison
 */
function normalizeString(str: string): NormalizedValue {
    let s = str.toLowerCase().trim();

    // Remove extra whitespace
    s = s.replace(/\s+/g, ' ');

    // Try to parse as BRL currency: "R$ 3.100", "R$3100", "3.100,00"
    const currencyMatch = s.match(/^r?\$?\s*([\d.,]+)\s*$/i);
    if (currencyMatch) {
        return parseBRLNumber(currencyMatch[1]);
    }

    // Try to parse as percentage: "50%", "50 %"
    const percentMatch = s.match(/^([\d.,]+)\s*%$/);
    if (percentMatch) {
        const num = parseBRLNumber(percentMatch[1]);
        return num !== null ? num : s;
    }

    // Try to parse as number with unit: "100 w", "5,5 kg", "2000 ml"
    const unitMatch = s.match(/^([\d.,]+)\s*(w|kg|g|l|ml|m|cm|mm|hz|kwh|v|a|mah)?$/i);
    if (unitMatch) {
        const num = parseBRLNumber(unitMatch[1]);
        if (num !== null) {
            // Return number if unit is common, or normalized string
            return num;
        }
    }

    // Try to parse as plain number: "6,7", "6.7", "1000"
    const plainNum = parseBRLNumber(s);
    if (plainNum !== null) {
        return plainNum;
    }

    // Return normalized string
    return s;
}

/**
 * Parse a number in BRL format (1.000,50 or 1000.50 or 1000)
 */
function parseBRLNumber(str: string): number | null {
    if (!str) return null;

    let s = str.trim();

    // Handle BRL format: 1.234,56 (dots as thousands, comma as decimal)
    // Or standard: 1234.56 (comma as thousands, dot as decimal)

    // Count dots and commas
    const dots = (s.match(/\./g) || []).length;
    const commas = (s.match(/,/g) || []).length;

    if (commas === 1 && dots >= 0) {
        // Likely BRL format: 1.234,56 or 1234,56
        // Remove dots (thousands separator) and replace comma with dot
        s = s.replace(/\./g, '').replace(',', '.');
    } else if (dots === 1 && commas === 0) {
        // Standard format: 1234.56
        // Keep as is
    } else if (dots === 0 && commas === 0) {
        // Plain integer: 1234
        // Keep as is
    } else {
        // Unknown format
        return null;
    }

    const num = parseFloat(s);
    return isNaN(num) ? null : num;
}

// ============================================
// Equivalence
// ============================================

/**
 * Check if two raw values are equivalent after normalization
 */
export function areEquivalent(a: unknown, b: unknown): boolean {
    const normA = normalizeComparable(a);
    const normB = normalizeComparable(b);

    // Both null
    if (normA === null && normB === null) {
        return true;
    }

    // One null, one not
    if (normA === null || normB === null) {
        return false;
    }

    // Both booleans
    if (typeof normA === 'boolean' && typeof normB === 'boolean') {
        return normA === normB;
    }

    // Both numbers - use tolerance
    if (typeof normA === 'number' && typeof normB === 'number') {
        return Math.abs(normA - normB) <= 0.0001;
    }

    // Both strings
    if (typeof normA === 'string' && typeof normB === 'string') {
        return normA === normB;
    }

    // Mixed types - try to compare as strings
    return String(normA) === String(normB);
}

/**
 * Check if a comparison row shows a difference
 */
export function isDifferent(leftRaw: unknown, rightRaw: unknown): boolean {
    return !areEquivalent(leftRaw, rightRaw);
}
