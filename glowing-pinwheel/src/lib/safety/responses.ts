/**
 * Safety Responses - Respostas protetivas determinísticas
 * 
 * Mensagens empáticas para situações de risco,
 * com recursos de ajuda do Brasil.
 */

import type { SafetyReason } from './guardian';

// Recursos de ajuda no Brasil
const RESOURCES_BR = {
    cvv: {
        phone: "188",
        name: "CVV - Centro de Valorização da Vida",
        hours: "24 horas, todos os dias",
        website: "www.cvv.org.br"
    },
    caps: {
        name: "CAPS - Centro de Atenção Psicossocial",
        info: "Busque o CAPS mais próximo pelo SUS"
    },
    emergency: {
        samu: "192",
        police: "190"
    }
};

/**
 * Constrói resposta protetiva para situações de risco
 */
export function buildSafetyResponse(
    reason: SafetyReason | undefined,
    locale: string = "pt-BR"
): string {
    // Resposta padrão para autoagressão/suicídio
    if (reason === "self_harm" || reason === "self_harm_ambiguous") {
        return `Percebo que você está passando por um momento muito difícil. O que você sente é real e válido.

Eu sou apenas um assistente de comparação de produtos e não tenho capacidade de oferecer o suporte que você precisa agora.

**Por favor, entre em contato com quem pode ajudar:**

📞 **CVV - ${RESOURCES_BR.cvv.phone}** (ligação gratuita)
Disponível ${RESOURCES_BR.cvv.hours}
Chat: ${RESOURCES_BR.cvv.website}

Se você estiver em risco imediato, ligue para o **SAMU (192)** ou vá ao pronto-socorro mais próximo.

Você não precisa enfrentar isso sozinho. Há pessoas que se importam e podem ajudar.`;
    }

    // Fallback genérico
    return `Percebo que você pode estar passando por um momento difícil.

Se precisar de apoio emocional, o **CVV (188)** oferece escuta 24 horas, de forma gratuita e sigilosa.

Estou aqui para ajudar com produtos, mas para questões mais importantes, profissionais qualificados podem oferecer o suporte que você merece.`;
}

/**
 * Texto curto para badge/header quando freio ético está ativo
 */
export function getEthicalBrakeBadgeText(): string {
    return "Modo Protetivo";
}

/**
 * Texto para adicionar ao system prompt quando freio ético está ativo
 */
export function getEthicalBrakePromptAddition(): string {
    return `

## MODO PROTETIVO ATIVO
O usuário pode estar em situação de vulnerabilidade emocional ou financeira.
REGRAS OBRIGATÓRIAS:
- NÃO use urgência, escassez ou pressão ("corre", "últimas unidades", "vai acabar")
- NÃO use gatilhos emocionais para vender
- SEJA neutro, técnico e cuidadoso
- PRIORIZE clareza e calma sobre persuasão
- Se o usuário mencionar dificuldades sérias, sugira gentilmente buscar ajuda profissional
- EVITE linguagem que possa aumentar ansiedade ou pressão`;
}

/**
 * Modifica texto de resposta removendo urgência/escassez
 */
export function removeUrgencyFromText(text: string): string {
    return text
        // Remove frases de urgência
        .replace(/\b(corre|corra)\s*(que)?\s*/gi, '')
        .replace(/\b(aproveite?\s*(agora|já|logo))\b/gi, 'confira')
        .replace(/\búltimas?\s*unidades?\b/gi, 'disponível')
        .replace(/\b(vai|v[aã]o)\s*acabar\b/gi, '')
        .replace(/\b(acaba|acabando|esgotando)\s*(logo|já|hoje)?\b/gi, '')
        .replace(/\bnão\s*perca\b/gi, '')
        .replace(/\b(promoç[aã]o\s*)?limit(ada|ado)[\s!]*\b/gi, '')
        .replace(/\bsó\s*hoje\b/gi, '')
        .replace(/\boferta\s*relâmpago\b/gi, 'oferta')
        .replace(/\bgaranta\s*(já|agora|o\s*seu)?\b/gi, 'confira')
        // Limpa espaços extras
        .replace(/\s{2,}/g, ' ')
        .trim();
}
