import axios from 'axios';
import fs from 'fs';
import path from 'path';

// --- CONFIGURAÇÕES E CREDENCIAIS ---
const APP_ID = '2796008225943482';
const CLIENT_SECRET = 'QUcPyG4xpiyD8WCzB4jOaiXPZaw3pGtY';
const REDIRECT_URI = 'https://www.google.com.br';
const AFFILIATE_TAG = 'aa20250829125621'; // Minha etiqueta do programa ML Social

const TOKEN_FILE = path.join(process.cwd(), 'ml_tokens.json');

// --- INTERFACES ---
interface TokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user_id: number;
    token_type: string;
}

// --- FUNÇÕES DE AUTENTICAÇÃO ---

/**
 * 1. Gera a URL para o usuário dar permissão
 */
function getAuthorizationUrl() {
    const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}`;
    console.log('\n=== AUTENTICAÇÃO NECESSÁRIA ===');
    console.log('1. Acesse a URL abaixo no navegador:');
    console.log(url);
    console.log('2. Faça login e autorize o app.');
    console.log('3. Você será redirecionado para o Google. Copie o parâmetro "code=" da URL.');
    console.log('4. Execute este script novamente passando o código como argumento:');
    console.log('   npx tsx scripts/ml-integration.ts SEU_CODIGO_AQUI\n');
}

/**
 * 2. Troca o 'code' pelo 'access_token'
 */
async function authenticate(code: string) {
    try {
        console.log('Trocando código por token...');
        const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: APP_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });

        const tokenData: TokenData = response.data;
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
        console.log('✅ Token salvo com sucesso em ml_tokens.json!');
        return tokenData;
    } catch (error: any) {
        console.error('❌ Erro ao autenticar:', error.response?.data || error.message);
        process.exit(1);
    }
}

/**
 * Atualiza o token usando refresh_token (se necessário)
 */
async function refreshToken(refreshTokenStr: string) {
    try {
        console.log('Renovando token...');
        const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
            params: {
                grant_type: 'refresh_token',
                client_id: APP_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: refreshTokenStr,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });

        const tokenData: TokenData = response.data;
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
        console.log('✅ Token renovado com sucesso!');
        return tokenData;
    } catch (error: any) {
        console.error('❌ Erro ao renovar token:', error.response?.data || error.message);
        // Se falhar renovação, talvez precise logar de novo
        throw error;
    }
}


// --- API E LINKS ---

/**
 * 3. Consulta Detalhes do Produto
 */
async function getProductDetails(productId: string, accessToken: string) {
    try {
        // Limpa ID (remove tracking antigo se vier na URL)
        const cleanId = productId.match(/(MLB-?\d+)/)?.[1]?.replace('-', '') || productId;

        console.log(`\nConsultando API para: ${cleanId}...`);
        const response = await axios.get(`https://api.mercadolibre.com/items/${cleanId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const item = response.data;
        return {
            id: item.id,
            title: item.title,
            price: item.price,
            permalink: item.permalink,
            thumbnail: item.thumbnail
        };
    } catch (error: any) {
        console.error('❌ Erro ao buscar produto:', error.response?.data || error.message);
        return null;
    }
}

/**
 * 4. Gera Link de Afiliado (Fallback Robusto)
 * Formato: https://lista.mercadolivre.com.br/{ID}#D[A:{ID}]&tracking_id={TAG}
 * Nota: Adaptado para incluir os parametros solicitados matt_tool e matt_word se compativeis,
 * ou o formato padrao de tracking ID solicitado na tarefa.
 * 
 * A tarefa pediu: https://lista.mercadolivre.com.br/{ID}#D[A:{ID}]&tracking_id={TAG}
 * Mas também mencionou matt_tool anteriormente. Vou focar no pedido deste script específico.
 */
function generateAffiliateLink(productId: string, originalUrl: string) {
    const cleanId = productId.match(/(MLB-?\d+)/)?.[1]?.replace('-', '') || productId;

    // Fallback solicitado: Busca Parametrizada
    // Formato: https://lista.mercadolivre.com.br/{ID_DO_PRODUTO}#D[A:{ID_DO_PRODUTO}]&tracking_id={AFFILIATE_TAG}

    // Obs: Normalmente para Social usa-se matt_tool/matt_word, mas o prompt pediu este formato específico
    // Vou adicionar ambos para garantir redundância se o link suportar,
    // mas priorizando a estrutura pedida.

    const baseUrl = `https://lista.mercadolivre.com.br/${cleanId}`;
    const hashParams = `D[A:${cleanId}]&tracking_id=${AFFILIATE_TAG}`;

    return `${baseUrl}#${hashParams}`;
}

// --- EXECUÇÃO PRINCIPAL ---

async function main() {
    const args = process.argv.slice(2);
    const codeArg = args[0];

    // Verifica se tem token salvo
    let tokenData: TokenData | null = null;
    if (fs.existsSync(TOKEN_FILE)) {
        try {
            tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
        } catch (e) {
            console.log('Token file corrompido.');
        }
    }

    // --- TESTE IMEDIATO DE GERAÇÃO DE LINK (OFFLINE) ---
    console.log('\n=== TESTE DE GERAÇÃO DE LINK (OFFLINE) ===');
    const TEST_ID = 'MLB3393746381';
    const generatedLink = generateAffiliateLink(TEST_ID, `https://mercadolivre.com.br/p/${TEST_ID}`);
    console.log(`Produto Exemplo: ${TEST_ID}`);
    console.log(`Link Gerado:`);
    console.log(generatedLink);
    console.log('---------------------------------------------------\n');

    // Fluxo 1: Autenticar com Código (se passado via argumento)
    if (codeArg) {
        tokenData = await authenticate(codeArg);
    }
    // Fluxo 2: Se não tem token, pede autenticação
    else if (!tokenData) {
        getAuthorizationUrl();
        return;
    }

    // Se temos token, valida/renova e roda teste
    if (tokenData) {
        // Simples verificação de teste - na prática checaria expires_in timestamp real
        try {
            // Teste com produto exemplo
            const TEST_PRODUCT_ID = 'MLB3393746381'; // ID do Exemplo (SSD Kingston anterior, ou o que o user quiser)

            // Tenta buscar produto (se falhar 401, tenta refresh)
            let product = null;
            try {
                product = await getProductDetails(TEST_PRODUCT_ID, tokenData.access_token);
            } catch (e: any) {
                if (e.response?.status === 401) {
                    tokenData = await refreshToken(tokenData.refresh_token);
                    product = await getProductDetails(TEST_PRODUCT_ID, tokenData.access_token);
                }
            }

            if (product) {
                console.log('\n=== DADOS DO PRODUTO (API) ===');
                console.log(`Título: ${product.title}`);
                console.log(`Preço: R$ ${product.price}`);
                console.log(`Imagem: ${product.thumbnail}`);

                console.log('\n=== LINK DE AFILIADO GERADO (FALLBACK ROBUSTO) ===');
                const affiliateLink = generateAffiliateLink(product.id, product.permalink);
                console.log(affiliateLink);
                console.log('\n[Sucesso] Script finalizado.');
            }

        } catch (error: any) {
            console.error('Erro fatal no fluxo de teste:', error.message);
        }
    }
}

main();
