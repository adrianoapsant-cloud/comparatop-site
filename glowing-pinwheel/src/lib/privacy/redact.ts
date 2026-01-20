/**
 * PII Redaction - Redação de Dados Pessoais
 * 
 * Remove/substitui PII antes de enviar para logs.
 * Usado para garantir privacidade nos eventos de Immunity.
 */

// Patterns para detecção de PII
const PII_PATTERNS = {
    // Email: user@domain.com
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

    // Telefone brasileiro: (11) 99999-9999, 11999999999, +55 11 99999-9999
    phone: /(?:\+?55\s*)?(?:\(?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}/g,

    // CPF: 123.456.789-00 ou 12345678900
    cpf: /\d{3}\.?\d{3}\.?\d{3}[-.]?\d{2}/g,

    // CNPJ: 12.345.678/0001-90
    cnpj: /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}[-.]?\d{2}/g,

    // CEP: 12345-678
    cep: /\d{5}[-.]?\d{3}/g,

    // Números de cartão (parcial) - 4 grupos de 4 dígitos
    card: /\d{4}[\s.-]?\d{4}[\s.-]?\d{4}[\s.-]?\d{4}/g,
};

/**
 * Redige PII de um texto, substituindo por tokens
 */
export function redactPII(text: string): string {
    if (!text || typeof text !== 'string') {
        return text;
    }

    let redacted = text;

    // Aplicar redação em ordem específica (mais específico primeiro)
    redacted = redacted.replace(PII_PATTERNS.email, '[EMAIL]');
    redacted = redacted.replace(PII_PATTERNS.cpf, '[CPF]');
    redacted = redacted.replace(PII_PATTERNS.cnpj, '[CNPJ]');
    redacted = redacted.replace(PII_PATTERNS.card, '[CARD]');
    redacted = redacted.replace(PII_PATTERNS.phone, '[PHONE]');
    redacted = redacted.replace(PII_PATTERNS.cep, '[CEP]');

    return redacted;
}

/**
 * Verifica se texto contém PII
 */
export function containsPII(text: string): boolean {
    if (!text || typeof text !== 'string') {
        return false;
    }

    return Object.values(PII_PATTERNS).some(pattern => {
        pattern.lastIndex = 0; // Reset regex state
        return pattern.test(text);
    });
}

/**
 * Extrai tipos de PII encontrados (para log)
 */
export function detectPIITypes(text: string): string[] {
    if (!text || typeof text !== 'string') {
        return [];
    }

    const found: string[] = [];

    Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
            found.push(type);
        }
    });

    return found;
}
