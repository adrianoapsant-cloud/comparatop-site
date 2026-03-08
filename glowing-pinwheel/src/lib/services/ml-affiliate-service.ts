/**
 * @file ml-affiliate-service.ts
 * @description Serviço para geração de links de afiliado do Mercado Livre (Social/Builder).
 * 
 * Implementa a estratégia "Social First" com fallback robusto para busca parametrizada
 * garantindo atribuição de cookie (Matt Tool / Matt Word).
 */

export class MercadoLivreAffiliateService {
    // ========================================================================
    // CONFIGURAÇÃO (TODO: Preencher com dados reais do App ML)
    // ========================================================================

    // Obtenha estas credenciais em: https://developers.mercadolivre.com.br/apps/home
    private static readonly CLIENT_ID = 'SEU_CLIENT_ID_AQUI';
    private static readonly CLIENT_SECRET = 'SEU_CLIENT_SECRET_AQUI';

    // Constantes do Usuário (Hardcoded conforme solicitação)
    // Etiqueta (Tracking Tag): aa20250829125621
    // Ferramenta (matt_tool): 21144041
    private static readonly MATT_TOOL = '21144041';
    private static readonly MATT_WORD = 'aa20250829125621';

    // ========================================================================
    // MÉTODO PÚBLICO PRINCIPAL
    // ========================================================================

    /**
     * Gera um link de afiliado otimizado para o Mercado Livre.
     * 
     * Prioridade:
     * 1. Tenta gerar link via API Oficial (se configurada) -> Formato Social (/social/...)
     * 2. Fallback para Link de Busca Parametrizado -> Garante cookie via Hash (#)
     * 
     * @param identifier - ID do produto (ex: 'MLB12345') ou URL completa
     * @returns Promise<string> - URL final formatada
     */
    public async generateMLAffiliateLink(identifier: string): Promise<string> {
        try {
            // 1. Extração e Validação do ID
            const mlbId = this.extractMlbId(identifier);
            if (!mlbId) {
                throw new Error(`ID inválido ou não encontrado no input: ${identifier}`);
            }

            // 2. Tentativa via API (Futuro)
            // Se tivéssemos a API de Social Link pública, chamaríamos aqui.
            const apiLink = await this.generateLinkViaApi(mlbId);
            if (apiLink) {
                return apiLink;
            }

            // 3. Fallback Robusto (Search Link Pattern)
            return this.generateFallbackLink(mlbId);

        } catch (error) {
            console.error('[ML Affiliate] Erro ao gerar link:', error);
            // Em último caso, retorna o link de busca simples para não quebrar a UI
            return `https://lista.mercadolivre.com.br/${identifier}`;
        }
    }

    // ========================================================================
    // INTERNOS E FALLBACKS
    // ========================================================================

    /**
     * Fallback Robusto: Gera url de lista com parâmetros de tracking no Hash.
     * Formato: https://lista.mercadolivre.com.br/{ID}#matt_tool=...&matt_word=...
     */
    private generateFallbackLink(mlbId: string): string {
        const baseUrl = `https://lista.mercadolivre.com.br/${mlbId}`;

        // Monta os parâmetros de tracking
        // Nota: O ML Social muitas vezes usa o Hash (#) para parâmetros client-side
        // mas também suporta Query Params (?) dependendo da landing page.
        // O formato solicitado pelo usuário usa Hash (#).
        const params = new URLSearchParams({
            'matt_tool': MercadoLivreAffiliateService.MATT_TOOL,
            'matt_word': MercadoLivreAffiliateService.MATT_WORD,
        });

        return `${baseUrl}#${params.toString()}`;
    }

    /**
     * Extrai o ID MLB de uma string (URL ou ID puro).
     */
    private extractMlbId(input: string): string | null {
        // Normaliza input
        const cleanInput = input.trim().toUpperCase();

        // Caso 1: Já é um ID (MLB123...)
        if (/^MLB\d+$/.test(cleanInput)) {
            return cleanInput;
        }

        // Caso 2: É uma URL (extrair do dash ou query)
        // Ex: .../MLB-123456... ou .../p/MLB123456
        const match = cleanInput.match(/(MLB-?\d+)/);
        if (match) {
            return match[1].replace('-', ''); // Remove traço se existir (MLB-123 -> MLB123)
        }

        return null;
    }

    // ========================================================================
    // STUBS PARA INTEGRAÇÃO FUTURA COM API
    // ========================================================================

    /**
     * Stub para geração via API Oficial.
     * Retorna null enquanto não houver credenciais válidas.
     */
    private async generateLinkViaApi(mlbId: string): Promise<string | null> {
        // Verifica se as credenciais placeholder foram substituídas
        if (MercadoLivreAffiliateService.CLIENT_ID.includes('SEU_CLIENT_ID')) {
            return null;
        }

        // TODO: Implementar fluxo real OAUTH + Call API
        // 1. Obter Token (POST /oauth/token)
        // 2. Gerar Link (POST /affiliate/link - endpoint hipotético/privado)

        console.log(`[ML API] Tentando gerar link via API para ${mlbId}...`);
        return null; // Força fallback
    }

    /**
     * Placeholder para renovação de token OAuth
     */
    private async getRefreshedToken(): Promise<string> {
        // Implementar lógica de refresh token aqui
        return 'mock_token';
    }
}
