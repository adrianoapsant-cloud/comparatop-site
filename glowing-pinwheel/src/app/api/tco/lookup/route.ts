/**
 * ============================================================================
 * FIPE-Eletro API: Lookup de TCO por ASIN/EAN/Nome
 * ============================================================================
 * 
 * Endpoints:
 * - GET /api/tco/lookup?asin=XXXXX
 * - GET /api/tco/lookup?ean=7899999999999
 * - GET /api/tco/lookup?q=Xiaomi+X10
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Tipos
interface TcoProduct {
    id: string;
    asin: string | null;
    ean: string | null;
    product_name: string;
    category: string;
    brand: string | null;
    model: string | null;
    amazon_url: string | null;
    image_url: string | null;
    tco_data: TcoData;
    generated_at: string;
}

interface TcoData {
    product: {
        name: string;
        brand: string;
        model: string;
        imageUrl?: string;
    };
    acquisition: {
        price: number;
        retailer: string;
        affiliateUrl: string;
    };
    tco: {
        horizonYears: number;
        acquisition: number;
        energy: number;
        consumables: number;
        maintenance: number;
        insurance?: number;
        residualValue: number;
        totalTco: number;
        monthlyAverage: number;
    };
    breakdown?: {
        energy?: { description: string; annual: number };
        consumables?: Array<{ name: string; cost: number; frequency: string }>;
        maintenance?: Array<{ component: string; cost: number; year: number; probability: number }>;
    };
    insights?: {
        limitingComponent: string;
        estimatedLifespan: number;
        recommendation: string;
    };
    identifiers?: {
        mlb_id?: string;
        magalu_id?: string;
        shopee_id?: string;
    };
    affiliate_links?: {
        mercadolivre?: string;
        magalu?: string;
        shopee?: string;
    };
}

// Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Force Rebuild 1
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const asin = searchParams.get('asin');
        const ean = searchParams.get('ean');
        const query = searchParams.get('q');
        const category = searchParams.get('category');

        // Validação: precisa de pelo menos um parâmetro de busca
        if (!asin && !ean && !query) {
            return NextResponse.json(
                { error: 'Parâmetro obrigatório: asin, ean ou q (nome do produto)' },
                { status: 400 }
            );
        }

        let result;

        // Busca por ASIN (exata)
        if (asin) {
            const { data, error } = await supabase
                .from('products_tco')
                .select('*')
                .eq('asin', asin.toUpperCase())
                .eq('is_active', true)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            result = data;
        }

        // Busca por EAN (exata)
        else if (ean) {
            const { data, error } = await supabase
                .from('products_tco')
                .select('*')
                .eq('ean', ean.replace(/\D/g, ''))
                .eq('is_active', true)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            result = data;
        }

        // Busca por nome (ILIKE - mais simples e funciona sem GIN)
        else if (query) {
            // ---------------------------------------------------------
            // MOCK OVERRIDE: Xiaomi Robot Vacuum X20 Pro (Demo)
            // ---------------------------------------------------------
            let results: TcoProduct[] = [];

            // 1. Fetch from Supabase (Real DB)
            try {
                let queryBuilder = supabase
                    .from('products_tco')
                    .select('*')
                    .eq('is_active', true)
                    .ilike('product_name', `%${query}%`)
                    .order('product_name', { ascending: true })
                    .limit(10);

                if (category) {
                    queryBuilder = queryBuilder.eq('category', category);
                }

                const { data } = await queryBuilder;
                if (data) results = [...data];
            } catch (err) {
                console.error('Error fetching from DB:', err);
                // Continue to at least show mock if applicable
            }

            // Helper to enforce safe link pattern (Guard / Trava)
            const formatMlbLink = (productName: string) => {
                const slug = productName.toLowerCase().trim().replace(/\s+/g, '-');
                // Standard: lista.mercadolivre... #D[A:slug] & tracking_id
                return `https://lista.mercadolivre.com.br/${slug}#D[A:${slug}]&tracking_id=aa20250829125621`;
            };

            // 2. Prepend Mock if matches (Demo Override)
            const MOCK_DB: TcoProduct[] = [
                {
                    id: 'mock-xiaomi-x20-pro',
                    asin: 'B0DFJGKW2L',
                    ean: '6934177700000',
                    product_name: 'Xiaomi Robot Vacuum X20 Pro',
                    category: 'Robot Vacuum',
                    brand: 'Xiaomi',
                    model: 'D102GL',
                    amazon_url: 'https://www.amazon.com.br/dp/B0DFJGKW2L?tag=aferio-20&th=1',
                    image_url: 'https://m.media-amazon.com/images/I/61y8g+dZ+OL._AC_SL1500_.jpg',
                    generated_at: new Date().toISOString(),
                    tco_data: {
                        product: {
                            name: 'Xiaomi Robot Vacuum X20 Pro',
                            brand: 'Xiaomi',
                            model: 'D102GL',
                            imageUrl: 'https://cdn.dooca.store/37626/products/robo-aspirador-de-po-inteligente-xiaomi-robot-vacuum-x20-pro-bivolt-preto-6799059f7ce3b-250x250.jpg?v=1738081735&webp=0'
                        },
                        acquisition: { price: 4299.00, retailer: 'Amazon', affiliateUrl: 'https://www.amazon.com.br/dp/B0DFJGKW2L?tag=aferio-20&th=1' },
                        tco: {
                            horizonYears: 5, acquisition: 4299.00, energy: 604.00, consumables: 3800.00, maintenance: 750.00, residualValue: 1670.00, totalTco: 0, monthlyAverage: 0
                        },
                        breakdown: {
                            energy: { description: 'Consumo anual de ~121 kWh (incluindo secagem térmica de 3h).', annual: 120.8 },
                            consumables: [
                                { name: 'Filtro HEPA (3/ano)', cost: 120.00, frequency: 'Trimestral' },
                                { name: 'Escova Lateral (3/ano)', cost: 75.00, frequency: 'Trimestral' },
                                { name: 'Escova Principal (1.5/ano)', cost: 120.00, frequency: 'Semestral' },
                                { name: 'Pano Mop (4 pares/ano)', cost: 200.00, frequency: 'Trimestral' },
                                { name: 'Saco de Pó (5 un/ano)', cost: 125.00, frequency: 'Bimestral' },
                                { name: 'Solução Limpeza (2/ano)', cost: 120.00, frequency: 'Semestral' }
                            ],
                            maintenance: [
                                { component: 'Bateria (Li-ion 5200mAh)', cost: 450.00, year: 2, probability: 1.0 },
                                { component: 'Módulo LDS', cost: 250.00, year: 3, probability: 0.7 },
                                { component: 'Manutenção Bomba Base', cost: 300.00, year: 4, probability: 0.3 }
                            ]
                        },
                        insights: { limitingComponent: 'Módulo de Navegação LDS', estimatedLifespan: 5, recommendation: 'Alto custo de consumíveis. Ideal usar modo "Padrão" para poupar bateria.' },
                        identifiers: { mlb_id: 'MLB5268307406' },
                        affiliate_links: {
                            mercadolivre: formatMlbLink('Xiaomi Robot Vacuum X20 Pro'),
                            magalu: 'https://www.magazinevoce.com.br/magazineaferio/busca/xiaomi+robot+vacuum+x20+pro/',
                            shopee: 'https://shopee.com.br/search?keyword=xiaomi%20robot%20vacuum%20x20%20pro'
                        }
                    }
                },
                {
                    id: 'electrolux-erb30',
                    asin: 'B09SVT5X8N',
                    ean: '7896347183057',
                    product_name: 'Electrolux ERB30 Home-e Power Experience',
                    category: 'Robot Vacuum',
                    brand: 'Electrolux',
                    model: 'ERB30',
                    amazon_url: 'https://www.amazon.com.br/dp/B09SVT5X8N?tag=aferio-20&th=1',
                    image_url: 'https://m.media-amazon.com/images/I/51r2Xb3+2mL._AC_SL1000_.jpg',
                    generated_at: new Date().toISOString(),
                    tco_data: {
                        product: {
                            name: 'Electrolux ERB30',
                            brand: 'Electrolux',
                            model: 'ERB30',
                            imageUrl: 'https://m.media-amazon.com/images/I/51r2Xb3+2mL._AC_SL1000_.jpg'
                        },
                        acquisition: { price: 712.00, retailer: 'Amazon', affiliateUrl: 'https://www.amazon.com.br/dp/B09SVT5X8N?tag=aferio-20&th=1' },
                        tco: {
                            horizonYears: 5, acquisition: 712.00, energy: 52.80, consumables: 1360.00, maintenance: 385.00, residualValue: 370.00, totalTco: 0, monthlyAverage: 0
                        },
                        breakdown: {
                            energy: { description: 'Consumo moderado (4 kWh/mês). Standby consome ~50% da energia.', annual: 10.56 },
                            consumables: [
                                { name: 'Kit Reposição (Filtros+Escovas)', cost: 136.00, frequency: 'Semestral (2 Kits/ano)' }
                            ],
                            maintenance: [
                                { component: 'Bateria (Li-Ion 14.4V)', cost: 385.00, year: 3, probability: 1.0 }
                            ]
                        },
                        insights: {
                            limitingComponent: 'Bateria e Navegação',
                            estimatedLifespan: 5,
                            recommendation: 'Atenção: Não possui Wi-Fi/App. TCO progressivo alto.'
                        },
                        identifiers: { mlb_id: 'MLB22852032' },
                        affiliate_links: {
                            mercadolivre: formatMlbLink('Electrolux ERB30'),
                            magalu: 'https://www.magazinevoce.com.br/magazineaferio/busca/electrolux+erb30/',
                            shopee: 'https://shopee.com.br/search?keyword=electrolux%20erb30'
                        }
                    }
                },
                {
                    id: 'wap-robot-w90',
                    asin: 'B0B9PSBNYL',
                    ean: '7899831311311',
                    product_name: 'WAP Aspirador de Pó Robô ROBOT W90 3 em 1',
                    category: 'Robot Vacuum',
                    brand: 'WAP',
                    model: 'Robot W90',
                    amazon_url: 'https://www.amazon.com.br/dp/B0B9PSBNYL?tag=aferio-20&th=1',
                    image_url: 'https://m.media-amazon.com/images/I/51pSow05M+L._AC_SL1000_.jpg',
                    generated_at: new Date().toISOString(),
                    tco_data: {
                        product: {
                            name: 'WAP Robot W90', // Shorten name for link generation safety
                            brand: 'WAP',
                            model: 'Robot W90',
                            imageUrl: 'https://m.media-amazon.com/images/I/51pSow05M+L._AC_SL1000_.jpg'
                        },
                        acquisition: { price: 429.00, retailer: 'Amazon', affiliateUrl: 'https://www.amazon.com.br/dp/B0B9PSBNYL?tag=aferio-20&th=1' },
                        tco: {
                            horizonYears: 5, acquisition: 429.00, energy: 18.00, consumables: 550.00, maintenance: 270.00, residualValue: 50.00, totalTco: 0, monthlyAverage: 0
                        },
                        breakdown: {
                            energy: { description: 'Consumo irrisório (3.5 kWh/ano). Motor de baixa potência (30W).', annual: 3.5 },
                            consumables: [
                                { name: 'Kit Reposição (Filtro+Escovas+Mop)', cost: 55.00, frequency: 'Semestral' }
                            ],
                            maintenance: [
                                { component: 'Bateria (Li-Ion 3.6V)', cost: 135.00, year: 2, probability: 1.0 },
                                { component: 'Bateria (Li-Ion 3.6V)', cost: 135.00, year: 4, probability: 1.0 }
                            ]
                        },
                        insights: {
                            limitingComponent: 'Bateria de Baixa Tensão (3.6V)',
                            estimatedLifespan: 2,
                            recommendation: 'Armadilha de Liquidez: TCO é 4x o valor do produto.'
                        },
                        identifiers: { mlb_id: 'MLBU1964754150' },
                        affiliate_links: {
                            mercadolivre: formatMlbLink('WAP Robot W90'),
                            magalu: 'https://www.magazinevoce.com.br/magazineaferio/busca/wap+robot+w90/',
                            shopee: 'https://shopee.com.br/search?keyword=wap%20robot%20w90'
                        }
                    }
                },
                {
                    id: 'wap-robot-w400',
                    asin: 'B0CGBR6QFC',
                    ean: '7899831302326',
                    product_name: 'WAP Aspirador de Pó Robô ROBOT W400 3 em 1',
                    category: 'Robot Vacuum',
                    brand: 'WAP',
                    model: 'Robot W400',
                    amazon_url: 'https://www.amazon.com.br/dp/B0CGBR6QFC?tag=aferio-20&th=1',
                    image_url: 'https://m.media-amazon.com/images/I/61y8g+dZ+OL._AC_SL1500_.jpg',
                    generated_at: new Date().toISOString(),
                    tco_data: {
                        product: {
                            name: 'WAP Robot W400',
                            brand: 'WAP',
                            model: 'Robot W400',
                            imageUrl: 'https://m.media-amazon.com/images/I/61y8g+dZ+OL._AC_SL1500_.jpg'
                        },
                        acquisition: { price: 899.00, retailer: 'Amazon', affiliateUrl: 'https://www.amazon.com.br/dp/B0CGBR6QFC?tag=aferio-20&th=1' },
                        tco: {
                            horizonYears: 5, acquisition: 899.00, energy: 160.00, consumables: 860.00, maintenance: 350.00, residualValue: 300.00, totalTco: 0, monthlyAverage: 0
                        },
                        breakdown: {
                            energy: { description: 'Consumo anual de ~26 kWh + alto custo de standby (24/7).', annual: 25.58 },
                            consumables: [
                                { name: 'Kit Filtros/Escovas (1/ano)', cost: 100.00, frequency: 'Anual' },
                                { name: 'Bateria Li-Ion (a cada 2 anos)', cost: 180.00, frequency: 'Bienal' }
                            ],
                            maintenance: [
                                { component: 'Bateria (Li-Ion 2600mAh)', cost: 180.00, year: 2, probability: 1.0 },
                                { component: 'Bateria (Li-Ion 2600mAh)', cost: 180.00, year: 4, probability: 1.0 },
                                { component: 'Manutenção Corretiva (Placa)', cost: 350.00, year: 5, probability: 0.5 }
                            ]
                        },
                        insights: {
                            limitingComponent: 'Bateria e Navegação',
                            estimatedLifespan: 5,
                            recommendation: 'Cuidado: Custo de manutenção e consumíveis triplica o valor em 5 anos.'
                        },
                        identifiers: { mlb_id: 'MLBU35074799' },
                        affiliate_links: {
                            mercadolivre: formatMlbLink('WAP Robot W400'),
                        }
                    }
                },
                {
                    id: 'electrolux-erb20',
                    asin: 'B09SVS3DZM',
                    ean: '7896347100000', // Placeholder or remove if strictly validated
                    product_name: 'Robô Aspirador Electrolux ERB20 Home-e Control',
                    category: 'Robot Vacuum',
                    brand: 'Electrolux',
                    model: 'ERB20',
                    amazon_url: 'https://www.amazon.com.br/dp/B09SVS3DZM?tag=aferio-20&th=1',
                    image_url: 'https://m.media-amazon.com/images/I/61+9X-sV-mL._AC_SL1000_.jpg',
                    generated_at: new Date().toISOString(),
                    tco_data: {
                        product: {
                            name: 'Electrolux ERB20',
                            brand: 'Electrolux',
                            model: 'ERB20',
                            imageUrl: 'https://m.media-amazon.com/images/I/61+9X-sV-mL._AC_SL1000_.jpg'
                        },
                        acquisition: { price: 699.00, retailer: 'Amazon', affiliateUrl: 'https://www.amazon.com.br/dp/B09SVS3DZM?tag=aferio-20&th=1' },
                        tco: {
                            horizonYears: 5, acquisition: 699.00, energy: 212.00, consumables: 980.00, maintenance: 150.00, residualValue: 80.00, totalTco: 0, monthlyAverage: 0
                        },
                        breakdown: {
                            energy: { description: 'Consumo anual ~38 kWh (Standby 3W pesa).', annual: 42.40 },
                            consumables: [
                                { name: 'Kit Filtros/Escovas (1/ano)', cost: 140.00, frequency: 'Anual' },
                                { name: 'Bateria Li-Ion (a cada 2 anos)', cost: 280.00, frequency: 'Bienal' }
                            ],
                            maintenance: [
                                { component: 'Bateria (Li-Ion 2600mAh)', cost: 280.00, year: 2, probability: 1.0 },
                                { component: 'Bateria (Li-Ion 2600mAh)', cost: 280.00, year: 4, probability: 1.0 },
                                { component: 'Manutenção Corretiva', cost: 150.00, year: 5, probability: 0.5 }
                            ]
                        },
                        insights: {
                            limitingComponent: 'Bateria e Filtros',
                            estimatedLifespan: 5,
                            recommendation: 'Baixo custo inicial, mas peças originais caras.'
                        },
                        identifiers: { mlb_id: 'MLBU12345678' },
                        affiliate_links: {
                            mercadolivre: formatMlbLink('Electrolux ERB20'),
                            magalu: 'https://www.magazinevoce.com.br/magazineaferio/busca/electrolux+erb20/',
                            shopee: 'https://shopee.com.br/search?keyword=electrolux%20erb20'
                        }
                    }
                },
                {
                    id: 'agratto-praticci',
                    asin: 'B0B72D88DK',
                    ean: '7898461960000', // Placeholder
                    product_name: 'Agratto Aspirador de Pó Robô Praticci (USB)',
                    category: 'Robot Vacuum',
                    brand: 'Agratto',
                    model: 'Praticci AAR01L-04',
                    amazon_url: 'https://www.amazon.com.br/dp/B0B72D88DK?tag=aferio-20&th=1',
                    image_url: 'https://m.media-amazon.com/images/I/41Kk+v3UORL._AC_.jpg',
                    generated_at: new Date().toISOString(),
                    tco_data: {
                        product: {
                            name: 'Agratto Praticci',
                            brand: 'Agratto',
                            model: 'Praticci',
                            imageUrl: 'https://m.media-amazon.com/images/I/41Kk+v3UORL._AC_.jpg'
                        },
                        acquisition: { price: 220.00, retailer: 'Amazon', affiliateUrl: 'https://www.amazon.com.br/dp/B0B72D88DK?tag=aferio-20&th=1' },
                        tco: {
                            horizonYears: 5, acquisition: 220.00, energy: 17.25, consumables: 775.00, maintenance: 150.00, residualValue: 13.50, totalTco: 0, monthlyAverage: 0
                        },
                        breakdown: {
                            energy: { description: 'Consumo irrisório (3W). Carrega via USB.', annual: 3.45 },
                            consumables: [
                                { name: 'Kits Filtros/Escovas (2/ano)', cost: 100.00, frequency: 'Semestral' },
                                { name: 'Mop Microfibra', cost: 15.00, frequency: 'Anual' }
                            ],
                            maintenance: [
                                { component: 'Bateria 18650 (3.7V)', cost: 30.00, year: 2, probability: 1.0 },
                                { component: 'Bateria 18650 (3.7V)', cost: 30.00, year: 3, probability: 1.0 },
                                { component: 'Bateria 18650 (3.7V)', cost: 30.00, year: 5, probability: 1.0 },
                                { component: 'Motor Roda (Falha)', cost: 60.00, year: 2, probability: 0.3 }
                            ]
                        },
                        insights: {
                            limitingComponent: 'Bateria e Motor (Descartável)',
                            estimatedLifespan: 2,
                            recommendation: 'Alerta: Custo de consumíveis supera o valor do robô em 17 meses.'
                        },
                        identifiers: { mlb_id: 'MLBU12345678' },
                        affiliate_links: {
                            mercadolivre: formatMlbLink('Agratto Praticci'),
                            magalu: 'https://www.magazinevoce.com.br/magazineaferio/busca/agratto+praticci/',
                            shopee: 'https://shopee.com.br/search?keyword=agratto%20praticci'
                        }
                    }
                },
                {
                    id: 'wap-robot-w100',
                    asin: 'B0849PHXW1',
                    ean: '7899831301381',
                    product_name: 'WAP Aspirador de Pó Robô ROBOT W100 3 em 1',
                    category: 'Robot Vacuum',
                    brand: 'WAP',
                    model: 'Robot W100',
                    amazon_url: 'https://www.amazon.com.br/dp/B0849PHXW1?tag=aferio-20&th=1',
                    image_url: 'https://m.media-amazon.com/images/I/61y8g+dZ+OL._AC_SL1500_.jpg',
                    generated_at: new Date().toISOString(),
                    tco_data: {
                        product: {
                            name: 'WAP Robot W100',
                            brand: 'WAP',
                            model: 'Robot W100',
                            imageUrl: 'https://m.media-amazon.com/images/I/61y8g+dZ+OL._AC_SL1500_.jpg'
                        },
                        acquisition: { price: 640.00, retailer: 'Amazon', affiliateUrl: 'https://www.amazon.com.br/dp/B0849PHXW1?tag=aferio-20&th=1' },
                        tco: {
                            horizonYears: 5, acquisition: 640.00, energy: 150.00, consumables: 1050.00, maintenance: 210.00, residualValue: 50.00, totalTco: 0, monthlyAverage: 0
                        },
                        breakdown: {
                            energy: { description: 'Alto custo STANDBY (66% da energia gasta parado).', annual: 29.38 },
                            consumables: [
                                { name: 'Kit Filtros/Escovas (2/ano)', cost: 130.00, frequency: 'Semestral' },
                                { name: 'Bateria Proprietária (Bienal)', cost: 260.00, frequency: 'A cada 2 anos' }
                            ],
                            maintenance: [
                                { component: 'Bateria Li-Ion 12.8V', cost: 260.00, year: 2, probability: 1.0 },
                                { component: 'Bateria Li-Ion 12.8V', cost: 260.00, year: 4, probability: 1.0 },
                                { component: 'Motor Roda', cost: 90.00, year: 3, probability: 0.5 }
                            ]
                        },
                        insights: {
                            limitingComponent: 'Bateria e Motores',
                            estimatedLifespan: 3,
                            recommendation: 'Economicamente inviável após 3 anos (Custo Bateria > Valor Residual).'
                        },
                        identifiers: { mlb_id: 'MLBU12345678' },
                        affiliate_links: {
                            mercadolivre: formatMlbLink('WAP Robot W100'),
                            magalu: 'https://www.magazinevoce.com.br/magazineaferio/busca/wap+robot+w100/',
                            shopee: 'https://shopee.com.br/search?keyword=wap%20robot%20w100'
                        }
                    }
                }
            ];

            // Filter mocks based on query (Improved logic)
            const matchedMocks = MOCK_DB.filter(mock => {
                const q = query.toLowerCase();
                return mock.product_name.toLowerCase().includes(q) ||
                    mock.brand?.toLowerCase().includes(q) ||
                    mock.model?.toLowerCase().includes(q);
            });

            // Add matched mocks to results (at the top)
            if (matchedMocks.length > 0) {
                results.unshift(...matchedMocks);
            }

            // 3. Smart Sorting: Prioritize "Starts With" query
            // This prevents "Eufy" (containing 'x') from appearing between "Xiaomi" products when searching "x"
            const queryLower = query.toLowerCase();
            results.sort((a, b) => {
                const nameA = a.product_name.toLowerCase();
                const nameB = b.product_name.toLowerCase();

                // Check if starts with query
                const startsA = nameA.startsWith(queryLower) || a.brand?.toLowerCase().startsWith(queryLower);
                const startsB = nameB.startsWith(queryLower) || b.brand?.toLowerCase().startsWith(queryLower);

                if (startsA && !startsB) return -1; // A comes first
                if (!startsA && startsB) return 1;  // B comes first

                // If both or neither start with query, fallback to alphabetical
                return nameA.localeCompare(nameB);
            });

            return NextResponse.json({
                success: true,
                count: results.length,
                results: results.map(formatProduct),
            });
        }

        // Produto não encontrado
        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Produto não encontrado',
                    suggestion: 'Tente buscar pelo nome com ?q=nome+do+produto'
                },
                { status: 404 }
            );
        }

        // Sucesso - retorna produto único
        return NextResponse.json({
            success: true,
            product: formatProduct(result),
        });

    } catch (error) {
        console.error('[TCO Lookup Error]', error);
        // Captura erro Supabase ou erro padrão
        const errorDetails = error instanceof Error
            ? error.message
            : typeof error === 'object'
                ? JSON.stringify(error, null, 2)
                : String(error);

        return NextResponse.json(
            {
                error: 'Erro interno ao buscar produto',
                details: errorDetails,
                supabaseUrl: supabaseUrl ? 'configured' : 'MISSING',
                supabaseKey: supabaseAnonKey ? 'configured' : 'MISSING'
            },
            { status: 500 }
        );
    }
}

/**
 * Formata o produto para resposta da API
 */
function formatProduct(row: TcoProduct) {
    const tco = row.tco_data;
    const price = tco.acquisition?.price || 0;

    // Report Logic: Opportunity Cost adjusted to Real Market Rates (Brazil)
    // Using conservative Net CDI of ~8.5% per year over the TCO horizon
    const ANNUAL_NET_CDI = 0.085; // 8.5% a.a.
    const horizonYears = tco.tco?.horizonYears || 5;

    const compoundFactor = Math.pow(1 + ANNUAL_NET_CDI, horizonYears) - 1;
    const calculatedOppCost = price * compoundFactor;

    // Recalculate Total to ensure it matches the components including OppCost
    // Formula: Acquisition + Energy + Consumables + Maintenance + OppCost - Residual
    const breakdown = tco.tco || {};
    const acquisition = breakdown.acquisition || 0;
    const energy = breakdown.energy || 0;
    const consumables = breakdown.consumables || 0;
    const maintenance = breakdown.maintenance || 0;
    const residual = breakdown.residualValue || 0;

    const recalculatedTotal = acquisition + energy + consumables + maintenance + calculatedOppCost - residual;

    return {
        id: row.id,
        identifiers: {
            asin: row.asin,
            ean: row.ean,
            mlb_id: tco.identifiers?.mlb_id,
            magalu_id: tco.identifiers?.magalu_id,
            shopee_id: tco.identifiers?.shopee_id,
        },
        product: {
            name: row.product_name,
            brand: row.brand || tco.product?.brand,
            model: row.model || tco.product?.model,
            category: row.category,
            imageUrl: row.image_url || tco.product?.imageUrl,
        },
        affiliate: {
            retailer: tco.acquisition?.retailer || 'Amazon',
            url: row.amazon_url || tco.acquisition?.affiliateUrl,
            price: price,
        },
        tco: {
            horizonYears: horizonYears,
            breakdown: {
                acquisition: acquisition,
                energy: energy,
                consumables: consumables,
                maintenance: maintenance,
                residualValue: residual,
            },
            total: recalculatedTotal,
            monthlyAverage: recalculatedTotal / (horizonYears * 12),
        },
        details: {
            ...tco.breakdown,
            opportunityCost: {
                description: `Rendimento perdido (CDI Líquido ~${(ANNUAL_NET_CDI * 100).toFixed(1)}% a.a.)`,
                cost: calculatedOppCost
            }
        },
        social_links: tco.affiliate_links || {},
        insights: tco.insights,
        metadata: {
            generatedAt: row.generated_at,
        },
    };
}
