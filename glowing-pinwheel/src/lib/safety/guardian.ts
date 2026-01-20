/**
 * Safety Guardian - Sidecar de Segurança
 * 
 * Detecta riscos de autoagressão e vulnerabilidade emocional
 * para proteger usuários e aplicar freio ético.
 */

// Types
export type SafetyLevel = "none" | "watch" | "high";

export type SafetyReason =
    | "self_harm"
    | "self_harm_ambiguous"
    | "violence"
    | "illegal"
    | "adult"
    | "other";

export type EthicalBrake = "off" | "on";

export interface SafetyDecision {
    level: SafetyLevel;
    reason?: SafetyReason;
    ethicalBrake: EthicalBrake;
    matched?: string[]; // Para debug interno, não exibir ao usuário
}

// ============================================
// HIGH RISK PATTERNS (bloqueia e interrompe)
// ============================================
const HIGH_RISK_PATTERNS = [
    // Intenção direta de autoagressão
    /\b(me\s*matar|quero\s*morrer|vou\s*me\s*matar|matar\s*eu|acabar\s*com\s*tudo)\b/i,
    /\b(suici[dí]|suicidio|suicida)\b/i,
    /\b(me\s*cortar|auto[\s-]?mutila|cortar\s*(os\s*)?(pulsos?|bra[çc]os?))\b/i,

    // Métodos e meios
    /\b(como\s*(me\s*)?matar|modo\s*de\s*morrer|maneira\s*de\s*morrer)\b/i,
    /\b(veneno|overdose|enforca|enforcamento|pular\s*(de|da))\b/i,
    /\b(comprimidos?\s*para\s*morrer|dose\s*letal)\b/i,

    // Expressões de intenção/desejo de morte
    /\b(dormir\s*e\s*n[aã]o\s*acordar|n[aã]o\s*acordar\s*mais)\b/i,
    /\b(queria\s*sumir|quero\s*sumir|desaparecer\s*para\s*sempre)\b/i,
    /\b(n[aã]o\s*quero\s*mais\s*viver|cansei\s*de\s*viver)\b/i,
    /\b(seria\s*melhor\s*(se\s*)?eu\s*morresse|melhor\s*morto)\b/i,

    // Tentativas de disfarce
    /\b(hipotetica?mente|só\s*curiosidade|roleplay)\s*.*(matar|morrer|suic)/i,
    /\b(para\s*um\s*amigo|perguntando\s*para)\s*.*(matar|morrer|suic)/i,
];

// ============================================
// WATCH PATTERNS (freio ético, não bloqueia)
// ============================================
const WATCH_PATTERNS = [
    // Desesperança
    /\b(n[aã]o\s*aguento\s*mais|n[aã]o\s*suporto\s*mais|n[aã]o\s*consigo\s*mais)\b/i,
    /\b(minha\s*vida\s*acabou|sem\s*esperan[çc]a|sem\s*sa[ií]da)\b/i,
    /\b(estou\s*perdido|me\s*sinto\s*perdido|completamente\s*perdido)\b/i,

    // Luto e perda
    /\b(perdi\s*(meu|minha)\s*(pai|m[aã]e|filho|filha|irm[aã]o|marido|esposa))\b/i,
    /\b(luto|enlutado|de\s*luto)\b/i,
    /\b(morte\s*(do|da|de)\s*(meu|minha))\b/i,

    // Crise emocional
    /\b(depress[aã]o|deprimido|depressivo)\b/i,
    /\b(ansiedade\s*(forte|extrema|terr[ií]vel)|crise\s*de\s*ansiedade)\b/i,
    /\b(desespero|desesperado|desesperada)\b/i,
    /\b(queria\s*chorar|chorando\s*muito|n[aã]o\s*paro\s*de\s*chorar)\b/i,
    /\b(me\s*sinto\s*sozinho|completamente\s*sozinho|ningu[eé]m\s*se\s*importa)\b/i,

    // Crise financeira grave
    /\b(n[aã]o\s*tenho\s*dinheiro\s*para\s*comer|sem\s*dinheiro\s*para\s*comer)\b/i,
    /\b(estou\s*passando\s*fome|minha\s*fam[ií]lia\s*passando\s*fome)\b/i,
    /\b(perdi\s*tudo|perdi\s*minha\s*casa|vou\s*ser\s*despejado)\b/i,
    /\b(d[ií]vidas?\s*(enorme|absurda|impag[aá]vel))\b/i,
    /\b(t[oô]\s*desesperado\s*(com|por)\s*dinheiro)\b/i,

    // Isolamento social
    /\b(ningu[eé]m\s*me\s*ama|ningu[eé]m\s*liga|todo\s*mundo\s*me\s*odeia)\b/i,
    /\b(sozinho\s*no\s*mundo|completamente\s*s[oó])\b/i,
];

/**
 * Avalia texto do usuário para riscos de segurança
 */
export function evaluateSafety(userText: string): SafetyDecision {
    if (!userText || typeof userText !== 'string') {
        return { level: "none", ethicalBrake: "off" };
    }

    const text = userText.toLowerCase().trim();
    const matched: string[] = [];

    // Check HIGH risk patterns
    for (const pattern of HIGH_RISK_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            matched.push(match[0]);
        }
    }

    if (matched.length > 0) {
        return {
            level: "high",
            reason: "self_harm",
            ethicalBrake: "on",
            matched
        };
    }

    // Check WATCH patterns
    for (const pattern of WATCH_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            matched.push(match[0]);
        }
    }

    if (matched.length > 0) {
        return {
            level: "watch",
            reason: "self_harm_ambiguous",
            ethicalBrake: "on",
            matched
        };
    }

    return { level: "none", ethicalBrake: "off" };
}

/**
 * Verifica se o freio ético está ativo
 */
export function isEthicalBrakeActive(decision: SafetyDecision): boolean {
    return decision.ethicalBrake === "on";
}

/**
 * Verifica se deve bloquear a resposta
 */
export function shouldBlockResponse(decision: SafetyDecision): boolean {
    return decision.level === "high";
}
