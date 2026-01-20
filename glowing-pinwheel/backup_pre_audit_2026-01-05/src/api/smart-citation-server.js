/**
 * SmartCitation Backend API
 * 
 * Arquitetura de Citação Zero-Click
 * - Proxy de metadados com proteção SSRF
 * - Blacklist anti-concorrência
 * - Cache em memória
 */

const express = require('express');
const cors = require('cors');

// Simulando metascraper (em produção: npm install metascraper metascraper-title metascraper-description metascraper-image metascraper-logo)
// const metascraper = require('metascraper')([...]);
// const got = require('got');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CONFIGURAÇÃO
// ============================================

// Lista de domínios bloqueados (concorrentes)
const COMPETITOR_DOMAINS = [
    'competitor.com',
    'rival.org',
    'zoom.com.br',
    'buscape.com.br',
    'bondfaro.com.br',
    // Adicione seus concorrentes aqui
];

// IPs/Ranges privados para proteção SSRF
const PRIVATE_IP_PATTERNS = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^localhost$/i,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
];

// Cache simples em memória (em produção: use Redis)
const metadataCache = new Map();
const CACHE_TTL = 3600000; // 1 hora em ms

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Verifica se o hostname é um IP privado (proteção SSRF)
 */
function isPrivateOrLocalhost(hostname) {
    return PRIVATE_IP_PATTERNS.some(pattern => pattern.test(hostname));
}

/**
 * Verifica se o domínio é de um concorrente
 */
function isCompetitorDomain(hostname) {
    const normalizedHost = hostname.toLowerCase().replace(/^www\./, '');
    return COMPETITOR_DOMAINS.some(comp =>
        normalizedHost === comp || normalizedHost.endsWith('.' + comp)
    );
}

/**
 * Extrai metadados de uma URL (simulado)
 * Em produção: use metascraper + got
 */
async function fetchMetadata(url) {
    // Simulação - em produção substitua por:
    // const { body: html, url: finalUrl } = await got(url);
    // const metadata = await metascraper({ html, url: finalUrl });

    const urlObj = new URL(url);

    // Mock metadata baseado no domínio
    const mockData = {
        title: `Artigo de ${urlObj.hostname}`,
        description: 'Este é um resumo automático do conteúdo da página citada. Em produção, isso seria extraído via Open Graph tags.',
        image: `https://logo.clearbit.com/${urlObj.hostname}`,
        logo: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
        domain: urlObj.hostname,
        url: url,
    };

    // Simula latência de rede
    await new Promise(resolve => setTimeout(resolve, 200));

    return mockData;
}

// ============================================
// ENDPOINT: /api/preview
// ============================================

app.get('/api/preview', async (req, res) => {
    const { url } = req.query;

    // Validação básica
    if (!url || typeof url !== 'string') {
        return res.status(400).json({
            error: 'URL is required',
            isCompetitor: false
        });
    }

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // Proteção SSRF: bloqueia IPs privados
        if (isPrivateOrLocalhost(hostname)) {
            return res.status(403).json({
                error: 'Access to private/local addresses is forbidden',
                isCompetitor: false,
                isBlocked: true
            });
        }

        // Verificação anti-concorrência
        if (isCompetitorDomain(hostname)) {
            return res.status(200).json({
                isCompetitor: true,
                isBlocked: true,
                domain: hostname,
                message: 'Este domínio foi identificado como concorrente.',
                // NÃO faz fetch dos metadados
            });
        }

        // Verifica cache
        const cacheKey = url.toLowerCase();
        const cached = metadataCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return res.status(200).json({
                ...cached.data,
                isCompetitor: false,
                isBlocked: false,
                fromCache: true,
            });
        }

        // Fetch metadados
        const metadata = await fetchMetadata(url);

        // Salva no cache
        metadataCache.set(cacheKey, {
            data: metadata,
            timestamp: Date.now(),
        });

        return res.status(200).json({
            ...metadata,
            isCompetitor: false,
            isBlocked: false,
            fromCache: false,
        });

    } catch (error) {
        console.error('Preview error:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch preview',
            message: error.message,
            isCompetitor: false
        });
    }
});

// ============================================
// ENDPOINT: Health Check
// ============================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        cacheSize: metadataCache.size,
        competitorDomainsCount: COMPETITOR_DOMAINS.length
    });
});

// ============================================
// SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🔗 SmartCitation API running on port ${PORT}`);
    console.log(`   Preview endpoint: http://localhost:${PORT}/api/preview?url=...`);
    console.log(`   Blocked competitors: ${COMPETITOR_DOMAINS.length} domains`);
});

module.exports = app;
