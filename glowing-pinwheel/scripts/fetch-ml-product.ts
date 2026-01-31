#!/usr/bin/env npx tsx
/**
 * @file fetch-ml-product.ts
 * @description Busca dados de produto do Mercado Livre com headers HTTP reais
 */

const ML_PRODUCT_URL = 'https://www.mercadolivre.com.br/smart-tv-32-philco-ptv32k34rkgb-roku-tv-led-dolby-audio/p/MLB39456212';
const ML_API_URL = 'https://api.mercadolibre.com/items/MLB39456212';
const AFFILIATE_LINK = 'https://mercadolivre.com/sec/2of6hfR';

// Headers HTTP que simulam um navegador real (conforme especificado pelo usuário)
const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://www.mercadolivre.com.br/'
};

interface MLProductData {
    id: string;
    title: string;
    price: number;
    original_price?: number;
    currency_id: string;
    condition: string;
    thumbnail: string;
    pictures: Array<{ url: string; secure_url: string; max_size: string }>;
    attributes: Array<{ id: string; name: string; value_name: string | null }>;
}

async function fetchProductData(): Promise<void> {
    console.log('🔍 Buscando dados do produto do Mercado Livre...\n');
    console.log('URL do Produto:', ML_PRODUCT_URL);
    console.log('Link de Afiliado:', AFFILIATE_LINK);
    console.log('\n📡 Fazendo requisição com headers reais do navegador...\n');

    try {
        // Tenta primeiro pela API oficial do ML
        const response = await fetch(ML_API_URL, { headers: BROWSER_HEADERS });

        if (!response.ok) {
            console.log(`⚠️ API retornou status ${response.status}, tentando via HTML...`);
            await fetchFromHTML();
            return;
        }

        const data = await response.json() as MLProductData;

        console.log('✅ Dados obtidos com sucesso!\n');
        console.log('='.repeat(60));
        console.log('DADOS DO PRODUTO');
        console.log('='.repeat(60));

        // Dados básicos
        console.log('\n📦 INFORMAÇÕES BÁSICAS:');
        console.log(`   ID: ${data.id}`);
        console.log(`   Título: ${data.title}`);
        console.log(`   Preço: R$ ${data.price?.toFixed(2)}`);
        if (data.original_price) {
            console.log(`   Preço Original: R$ ${data.original_price.toFixed(2)}`);
        }
        console.log(`   Condição: ${data.condition}`);

        // Extrai atributos importantes
        console.log('\n📋 ATRIBUTOS:');
        const importantAttrs = ['BRAND', 'MODEL', 'DISPLAY_SIZE', 'DISPLAY_RESOLUTION_TYPE', 'DISPLAY_TECHNOLOGY'];
        for (const attr of data.attributes || []) {
            if (importantAttrs.includes(attr.id) || attr.name) {
                console.log(`   ${attr.name || attr.id}: ${attr.value_name || 'N/A'}`);
            }
        }

        // Imagens
        console.log('\n🖼️ IMAGENS DO ANÚNCIO:');
        const images = data.pictures || [];
        console.log(`   Total de imagens: ${images.length}`);

        // Converte thumbs para HD
        const hdImages = images.map((pic, idx) => {
            // Converte -O.webp ou similar para higher quality
            let hdUrl = pic.secure_url || pic.url;
            hdUrl = hdUrl.replace(/-[A-Z]\.webp$/, '-O.webp');
            hdUrl = hdUrl.replace(/-[A-Z]\.jpg$/, '-O.jpg');
            console.log(`   ${idx + 1}. ${hdUrl}`);
            return hdUrl;
        });

        // Gera output para scaffold
        console.log('\n' + '='.repeat(60));
        console.log('JSON PARA SCAFFOLD');
        console.log('='.repeat(60) + '\n');

        // Extrai dados dos atributos
        const getAttr = (id: string) => {
            const attr = data.attributes?.find(a => a.id === id);
            return attr?.value_name || null;
        };

        const brand = getAttr('BRAND') || 'Philco';
        const model = getAttr('MODEL') || 'PTV32K34RKGB';
        const screenSize = parseInt(getAttr('DISPLAY_SIZE') || '32');
        const resolution = getAttr('DISPLAY_RESOLUTION_TYPE') || 'HD';
        const panelType = getAttr('DISPLAY_TECHNOLOGY') || 'LED';

        const opusInput = {
            product: {
                name: data.title || 'Smart TV 32 Philco PTV32K34RKGB Roku TV LED Dolby Audio',
                brand,
                model,
                categoryId: 'tv'
            },
            price: {
                current: data.price,
                original: data.original_price || data.price,
                currency: 'BRL',
                lastUpdated: new Date().toISOString().split('T')[0]
            },
            sources: [
                {
                    store: 'mercadolivre',
                    url: AFFILIATE_LINK,  // Usa o link de afiliado!
                    price: data.price,
                    available: true,
                    lastChecked: new Date().toISOString().split('T')[0]
                }
            ],
            specs: {
                screenSize,
                panelType,
                resolution,
                refreshRate: 60,
                hdmiPorts: 2,
                smartPlatform: 'Roku TV',
                hasDolbyVision: false,
                hasHDR10Plus: false
            },
            images: hdImages,
            evidence: {
                'specs.screenSize': { sourceUrl: ML_PRODUCT_URL },
                'specs.panelType': { sourceUrl: ML_PRODUCT_URL },
                'specs.resolution': { sourceUrl: ML_PRODUCT_URL },
                'price.current': { sourceUrl: ML_PRODUCT_URL }
            },
            meta: {
                cadastradoPor: 'ml-fetch-script',
                cadastradoEm: new Date().toISOString()
            }
        };

        console.log(JSON.stringify(opusInput, null, 2));

    } catch (error) {
        console.error('❌ Erro ao buscar dados:', error);
        console.log('\n🔄 Tentando via scraping HTML...');
        await fetchFromHTML();
    }
}

async function fetchFromHTML(): Promise<void> {
    console.log('\n📄 Buscando página HTML do produto...\n');

    try {
        const response = await fetch(ML_PRODUCT_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://www.mercadolivre.com.br/',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            console.log(`❌ Falha ao buscar HTML: ${response.status}`);
            outputManualData();
            return;
        }

        const html = await response.text();

        // Busca JSON-LD no HTML
        const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (jsonLdMatch) {
            try {
                const jsonLd = JSON.parse(jsonLdMatch[1]);
                console.log('✅ Dados JSON-LD encontrados!');
                console.log(JSON.stringify(jsonLd, null, 2));
            } catch {
                console.log('⚠️ Não foi possível parsear JSON-LD');
            }
        }

        // Extrai imagens do HTML
        const imageMatches = html.matchAll(/https:\/\/http2\.mlstatic\.com[^"'>\s]+\.(jpg|webp|png)/gi);
        const uniqueImages = [...new Set([...imageMatches].map(m => m[0]))];

        // Converte para HD
        const hdImages = uniqueImages
            .filter(url => url.includes('D_NQ_NP') || url.includes('D_Q_NP'))
            .map(url => url.replace(/-[A-Z]\.webp$/, '-O.webp').replace(/-[A-Z]\.jpg$/, '-O.jpg'))
            .slice(0, 10);

        if (hdImages.length > 0) {
            console.log('\n🖼️ IMAGENS ENCONTRADAS (HD):');
            hdImages.forEach((img, i) => console.log(`   ${i + 1}. ${img}`));
        }

        outputManualData(hdImages);

    } catch (error) {
        console.error('❌ Erro ao fazer scraping:', error);
        outputManualData();
    }
}

function outputManualData(images: string[] = []): void {
    console.log('\n' + '='.repeat(60));
    console.log('📝 DADOS MANUAIS (das imagens fornecidas pelo usuário)');
    console.log('='.repeat(60) + '\n');

    // Dados extraídos das imagens do usuário
    const manualData = {
        product: {
            name: 'Smart TV 32 Philco PTV32K34RKGB Roku TV LED Dolby Audio',
            brand: 'Philco',
            model: 'PTV32K34RKGB',
            categoryId: 'tv'
        },
        price: {
            current: 821.75,
            original: 1175.00,
            currency: 'BRL',
            lastUpdated: '2026-01-23'
        },
        sources: [
            {
                store: 'mercadolivre',
                url: AFFILIATE_LINK,
                price: 821.75,
                available: true,
                lastChecked: '2026-01-23'
            }
        ],
        specs: {
            screenSize: 32,
            panelType: 'LED',
            resolution: 'HD',  // 1366 x 768
            resolutionMax: '1366 x 768',
            refreshRate: 60,
            hdmiPorts: 2,
            usbPorts: 2,
            smartPlatform: 'Roku TV',
            hasWifi: true,
            hasBluetooth: false,
            hasAlexa: true,
            brightness: 320,  // cd/m²
            soundMode: 'Dolby Digital',
            dimensions: '72 x 18 x 45.8 cm',
            weight: 3.88,
            voltage: '127/220V',
            color: 'Space gray (Cinza)',
            is3D: false,
            isCurved: false,
            isPortable: false,
            hasVESAMount: true,
            energyEfficiency: 'A',
            hasDolbyVision: false,
            hasHDR10Plus: false,
            apps: ['YouTube', 'Netflix', 'Globo Play', 'Apple TV', 'Disney+']
        },
        images: images.length > 0 ? images : [
            // URLs padrão de placeholder - serão substituídas pelo browser
        ],
        evidence: {
            'specs.screenSize': { sourceUrl: ML_PRODUCT_URL, note: '32 polegadas (72 x 18 x 45.8 cm)' },
            'specs.panelType': { sourceUrl: ML_PRODUCT_URL, note: 'LED' },
            'specs.resolution': { sourceUrl: ML_PRODUCT_URL, note: 'HD (1366 x 768)' },
            'specs.refreshRate': { sourceUrl: ML_PRODUCT_URL, note: '60 Hz' },
            'specs.hdmiPorts': { sourceUrl: ML_PRODUCT_URL, note: '2 portas HDMI' },
            'specs.usbPorts': { sourceUrl: ML_PRODUCT_URL, note: '2 portas USB' },
            'specs.hasAlexa': { sourceUrl: ML_PRODUCT_URL, note: 'Alexa Embutido' },
            'price.current': { sourceUrl: ML_PRODUCT_URL, note: 'R$ 821,75 (30% OFF no Pix)' }
        },
        meta: {
            cadastradoPor: 'ml-fetch-script',
            cadastradoEm: new Date().toISOString(),
            notas: 'Dados extraídos das capturas de tela do usuário'
        }
    };

    console.log(JSON.stringify(manualData, null, 2));
}

// Executa
fetchProductData();
