/**
 * @file sanitize-risk-copy.ts
 * @description Guard de segurança para sanitizar textos com instruções perigosas
 * 
 * Detecta e flag termos que podem representar risco jurídico:
 * - Instruções para desativar sensores de segurança
 * - Sugestões de modificações físicas perigosas
 * - Conselhos que podem causar danos
 * 
 * @version 1.0.0
 */

/**
 * Padrões de texto que representam instruções perigosas
 */
const DANGEROUS_PATTERNS: RegExp[] = [
    // Instruções para cobrir/tapar sensores
    /tape.*sensor/i,
    /cover.*sensor/i,
    /tapar.*sensor/i,
    /fita.*sensor/i,
    /cobrir.*sensor/i,
    /tape.*cliff/i,
    /cover.*cliff/i,

    // Instruções para desativar proteções
    /desativ.*proteção/i,
    /desativ.*sensor/i,
    /disable.*sensor/i,
    /disable.*protection/i,

    // Modificações físicas perigosas
    /remov.*sensor/i,
    /bloc.*sensor/i,
];

/**
 * Aviso padrão adicionado quando conteúdo perigoso é detectado
 */
const SAFETY_WARNING = ' ⚠️ Não recomendamos desativar sensores de segurança.';

/**
 * Sanitiza texto, adicionando aviso se instruções perigosas forem detectadas
 * 
 * @param text - Texto original
 * @returns Texto sanitizado (com warning se necessário)
 * 
 * @example
 * sanitizeRiskCopy("Você pode tapar o sensor com fita")
 * // → "Você pode tapar o sensor com fita ⚠️ Não recomendamos desativar sensores de segurança."
 */
export function sanitizeRiskCopy(text: string): string {
    if (!text) return text;

    for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(text)) {
            // Já tem warning? Não duplicar
            if (text.includes('⚠️') || text.includes('CUIDADO')) {
                return text;
            }
            return text + SAFETY_WARNING;
        }
    }
    return text;
}

/**
 * Verifica se texto contém instruções perigosas
 * 
 * @param text - Texto a verificar
 * @returns true se contém padrões perigosos
 */
export function containsDangerousInstructions(text: string): boolean {
    if (!text) return false;
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Retorna lista de padrões perigosos encontrados no texto
 * Útil para debugging e logging
 */
export function findDangerousPatterns(text: string): string[] {
    if (!text) return [];

    const found: string[] = [];
    for (const pattern of DANGEROUS_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            found.push(match[0]);
        }
    }
    return found;
}

export const DANGEROUS_PATTERN_LIST = DANGEROUS_PATTERNS.map(p => p.source);
