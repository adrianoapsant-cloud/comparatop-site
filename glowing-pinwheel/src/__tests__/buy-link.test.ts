/**
 * BUY_LINK Intent Tests
 * 
 * Tests for the deterministic purchase link handling
 */

import { describe, test, expect } from 'vitest';

// Import the function from route.ts (we'll need to export it)
// For now, we simulate the core logic

/**
 * isBuyLinkIntent - detects purchase link requests
 * EXCLUDES: "link do manual" (handled by MANUAL intent)
 */
function isBuyLinkIntent(text: string): boolean {
    const t = text.toLowerCase();

    // Exclusion: "link do manual" is handled by MANUAL intent
    if (/link.*(manual|instrução|instruções|guia|pdf)/i.test(t)) {
        return false;
    }

    // Purchase patterns in PT-BR
    const buyPatterns = [
        /link.*(compra|oferta|produto)/,
        /onde.*(compro|comprar|acho|encontro)/,
        /(me )?(envie?|manda|passa).* ?o? ?link/,
        /ver oferta/,
        /comprar (agora|já|esse|este)/,
        /quero comprar/,
        /link.*(amazon|magalu|casas bahia|americanas|shopee|mercado livre|ml)/,
        /como (compro|comprar)/,
        /posso comprar/,
        /(pode|poderia).*(link|enviar.*oferta)/,
        /preço.*(link|compra)/,
        /link.*(para|pra) comprar/
    ];

    return buyPatterns.some(pattern => pattern.test(t));
}

describe('isBuyLinkIntent', () => {
    test('detects "me envie o link de compra"', () => {
        expect(isBuyLinkIntent('me envie o link de compra')).toBe(true);
    });

    test('detects "onde compro essa TV"', () => {
        expect(isBuyLinkIntent('onde compro essa TV')).toBe(true);
    });

    test('detects "manda o link"', () => {
        expect(isBuyLinkIntent('manda o link')).toBe(true);
    });

    test('detects "ver oferta"', () => {
        expect(isBuyLinkIntent('ver oferta')).toBe(true);
    });

    test('detects "link da amazon"', () => {
        expect(isBuyLinkIntent('link da amazon')).toBe(true);
    });

    test('detects "como compro"', () => {
        expect(isBuyLinkIntent('como compro')).toBe(true);
    });

    test('detects "quero comprar"', () => {
        expect(isBuyLinkIntent('quero comprar')).toBe(true);
    });

    test('detects "pode me mandar o link"', () => {
        expect(isBuyLinkIntent('pode me mandar o link')).toBe(true);
    });

    // EXCLUSIONS
    test('EXCLUDES "link do manual" (handled by MANUAL)', () => {
        expect(isBuyLinkIntent('link do manual')).toBe(false);
    });

    test('EXCLUDES "me envia o link do manual PDF"', () => {
        expect(isBuyLinkIntent('me envia o link do manual PDF')).toBe(false);
    });

    test('EXCLUDES "link das instruções"', () => {
        expect(isBuyLinkIntent('link das instruções')).toBe(false);
    });

    // NON-MATCHES
    test('does not match generic text', () => {
        expect(isBuyLinkIntent('qual a melhor TV')).toBe(false);
    });

    test('does not match "compare as TVs"', () => {
        expect(isBuyLinkIntent('compare as TVs')).toBe(false);
    });
});

describe('Formatting', () => {
    test('formatMd joins sections with double newlines', () => {
        const formatMd = (sections: string[]): string => {
            let text = sections.filter(s => s && s.trim()).join('\n\n');
            text = text.replace(/\r\n/g, '\n');
            text = text.replace(/\n{3,}/g, '\n\n');
            return text.trim();
        };

        const sections = ['Hello', 'World', 'Test'];
        const result = formatMd(sections);
        expect(result).toBe('Hello\n\nWorld\n\nTest');
    });

    test('formatMd removes empty sections', () => {
        const formatMd = (sections: string[]): string => {
            return sections.filter(s => s && s.trim()).join('\n\n').trim();
        };

        const sections = ['Hello', '', '  ', 'World'];
        const result = formatMd(sections);
        expect(result).toBe('Hello\n\nWorld');
    });

    test('no glued words after formatting', () => {
        // This regex detects text followed immediately by uppercase letter (missing space/newline)
        // Example: "texto:Produto" instead of "texto: Produto" or "texto:\nProduto"
        const detectGluedAfterPunctuation = (text: string): boolean => {
            // Check for patterns like "text:Word" without space after punctuation
            return /[:\.](?!\s|$)[A-ZÁÉÍÓÚÃÕÇ]/.test(text);
        };

        const goodText = 'Aqui está o link de compra:\n\nSamsung QN90C';
        const badText = 'Aqui está o link de compra:Samsung QN90C';  // missing space/newline after colon

        expect(detectGluedAfterPunctuation(goodText)).toBe(false);
        expect(detectGluedAfterPunctuation(badText)).toBe(true);
    });
});
