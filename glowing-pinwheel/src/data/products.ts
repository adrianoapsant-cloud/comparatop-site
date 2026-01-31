/**
 * Sample Product Data - For Development/Testing
 * 
 * @description Example products with scores matching category criteria IDs.
 * In production, this would come from a CMS or database.
 */

import type { Product, MainCompetitor } from '@/types/category';

// ============================================
// ROBOT VACUUM IMPORTS (modular architecture)
// ============================================
// Existing entry files
import { liectroux_xr500_pro } from './products.entry.liectroux-xr500-pro';
import { wkjwqwhy_a6s } from './products.entry.wkjwqwhy-a6s';
import { xiaomi_robot_vacuum_s40c } from './products.entry.xiaomi-robot-vacuum-s40c';
import { wap_robot_w90 } from './products.entry.wap-robot-w90';
import { xiaomi_robot_vacuum_s20_plus_white } from './products.entry.xiaomi-robot-vacuum-s20-plus-white';
import { samsung_vr5000rm } from './products.entry.samsung-vr5000rm';
import { kabum_smart_700 } from './products.entry.kabum-smart-700';
import { product as philco_pas26p } from './products.entry.philco-pas26p';

// Newly extracted entry files (from products.ts inline)
import { wap_robot_w400 } from './products.entry.wap-robot-w400';
import { roborock_q7_l5 } from './products.entry.roborock-q7-l5';
import { electrolux_erb20_home_control_experience } from './products.entry.electrolux-erb20-home-control-experience';
import { liectroux_l200_robo_aspirador_3em1_app_alexa_google } from './products.entry.liectroux-l200-robo-aspirador-3em1-app-alexa-google';
import { xiaomi_robot_x10 } from './products.entry.xiaomi-robot-x10';
import { ezs_e10 } from './products.entry.ezs-e10';
import { eufy_x10_pro_omni } from './products.entry.eufy-x10-pro-omni';
import { eufy_omni_c20 } from './products.entry.eufy-omni-c20';
import { xiaomi_robot_vacuum_x20_pro } from './products.entry.xiaomi-robot-vacuum-x20-pro';

// ============================================
// SMART TVs - Scores match TV_CATEGORY criteria
// ============================================

export const SAMPLE_TVS: Product[] = [
    {
        id: 'samsung-qn90c-65',
        categoryId: 'tv',
        name: 'Samsung QN90C Neo QLED 65"',
        shortName: 'Samsung QN90C',
        brand: 'Samsung',
        model: 'QN90C',
        price: 4200,
        imageUrl: '/images/products/samsung-qn90c.svg',
        status: 'published',
        scores: {
            c1: 8.0,  // Custo-Benefício - Preço competitivo para gaming premium
            c2: 9.0,  // Processamento - Neural Quantum excelente
            c3: 8.0,  // Confiabilidade - Maioria funciona bem
            c4: 8.5,  // Sistema - Tizen elogiado como fluido
            c5: 9.5,  // Gaming - Referência absoluta
            c6: 8.5,  // Brilho - Ótimo para salas claras
            c7: 7.0,  // Pós-Venda - Samsung estrutura nacional
            c8: 8.0,  // Som - 60W elogiado nos reviews BR
            c9: 9.0,  // Conectividade - 4x HDMI 2.1 destaque
            c10: 8.5, // Design - Premium
            gaming: 9.5,
            imageQuality: 9.0,
            connectivity: 9.0,
        },
        specs: {
            screenSize: 65,
            resolution: '4K',
            panelType: 'Neo QLED',
            refreshRate: 120,
            hdrFormats: 'HDR10+, HLG',
            hdmiPorts: 4,
            releaseYear: 2023,
            // Physical dimensions (cm)
            width: 145,
            height: 83,
            depth: 3,
        },
        attributes: {
            hdmi21: true,
            hdmi21Ports: 4,
            brightness: 1500,
            contrastRatio: '1000000:1',
            responseTime: 1,
            vrr: true,
            allm: true,
            dolbyVision: false,
            hdr10Plus: true,
            speakers: '2.2ch 60W',
            smartPlatform: 'Tizen',
            voiceAssistants: ['Bixby', 'Alexa', 'Google'],
        },
        scoreReasons: {
            c1: 'Excelente custo-benefício para gamers. Sempre teste nos primeiros 7 dias por segurança.',
            c3: 'Tecnologia robusta. Como toda TV, verificar pixels na entrega é boa prática.',
            c5: 'Referência absoluta para PS5/Xbox: 5.8ms, VRR, 4x HDMI 2.1. Compra certa para gamers.',
            c6: 'Brilho de 1500 nits ideal para salas claras. Blooming mínimo em cenas escuras.',
            c7: 'Samsung tem rede nacional de suporte. Guarde nota fiscal para garantia.',
        },
        badges: ['editors-choice'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 4199,
                url: 'https://www.amazon.com.br/dp/B0C1J5VKXK',
                affiliateUrl: 'https://amzn.to/samsung-qn90c-65',
                inStock: true,
                lastChecked: '2026-01-17'
            },
            {
                store: 'Magazine Luiza',
                storeSlug: 'magalu',
                price: 4299,
                url: 'https://www.magazineluiza.com.br/samsung-qn90c-65',
                inStock: true,
                lastChecked: '2026-01-17'
            }
        ],
        lastUpdated: '2026-01-17',
        // PDP Fields
        benefitSubtitle: 'A TV gamer mais completa do mercado brasileiro',
        lifestyleImage: '/images/lifestyle/samsung-qn90c-living-room.jpg',
        gallery: ['/images/products/samsung-qn90c.svg', '/images/products/samsung-qn90c-side.svg'],
        featureBenefits: [
            { icon: 'Gamepad2', title: 'Input Lag 5.8ms', description: 'Reação instantânea para jogos competitivos. Você vê antes do adversário.' },
            { icon: 'Sun', title: '1500 nits de Brilho', description: 'Perfeita para salas claras. O HDR aparece mesmo com sol entrando.' },
            { icon: 'Zap', title: '4x HDMI 2.1', description: 'Conecte PS5, Xbox e PC ao mesmo tempo sem desconectar nada.' },
            { icon: 'Eye', title: 'Anti-Reflexo', description: 'Tecnologia Matte Display elimina reflexos de janelas e lâmpadas.' },
        ],
        benchmarks: [
            { label: 'Brilho Máximo', productValue: 1500, categoryAverage: 800, unit: 'nits', higherIsBetter: true },
            { label: 'Input Lag', productValue: 5.8, categoryAverage: 12, unit: 'ms', higherIsBetter: false },
            { label: 'Refresh Rate', productValue: 120, categoryAverage: 60, unit: 'Hz', higherIsBetter: true },
        ],
        priceHistory: [
            { date: '2025-12-01', price: 4800 },
            { date: '2025-12-15', price: 4500 },
            { date: '2025-12-25', price: 4200 },
            { date: '2026-01-01', price: 4400 },
            { date: '2026-01-04', price: 4200 },
        ],
        // On-Page Comparison: Direct Rival
        mainCompetitor: {
            id: 'lg-c3-65',
            name: 'LG C3 OLED 65"',
            shortName: 'LG C3',
            imageUrl: '/images/products/lg-c3.svg',
            price: 5500,
            keyDifferences: [
                { label: 'Brilho de Pico', current: '2000 nits', rival: '800 nits', winner: 'current' },
                { label: 'Contraste', current: 'Alto (Mini LED)', rival: 'Infinito (OLED)', winner: 'rival' },
                { label: 'Risco de Burn-in', current: 'Nenhum', rival: 'Baixo', winner: 'current' },
            ],
        },
    },
    {
        id: 'lg-c3-65',
        categoryId: 'tv',
        name: 'LG OLED C3 65"',
        shortName: 'LG C3 OLED',
        brand: 'LG',
        model: 'OLED65C3',
        price: 5500,
        imageUrl: '/images/products/lg-c3.svg',
        scores: {
            c1: 7.5,  // Custo-Benefício - Premium mas entrega qualidade OLED
            c2: 9.5,  // Processamento - α9 Gen6 imbatível
            c3: 9.0,  // Confiabilidade - OLED comprovado, LG garantia forte
            c4: 9.0,  // Sistema - webOS excelente
            c5: 9.8,  // Gaming - Melhor do mercado
            c6: 7.5,  // Brilho - Ideal para salas escuras
            c7: 8.5,  // Pós-Venda - LG tem RA1000 e suporte nacional
            c8: 7.5,  // Som - 40W Dolby Atmos satisfatório
            c9: 9.0,  // Conectividade - 4x HDMI 2.1
            c10: 9.5, // Design - OLED ultrafino
            gaming: 9.8,
            imageQuality: 9.5,
            connectivity: 9.0,
        },
        specs: {
            screenSize: 65,
            resolution: '4K',
            panelType: 'OLED',
            refreshRate: 120,
            hdrFormats: 'Dolby Vision, HDR10, HLG',
            hdmiPorts: 4,
            releaseYear: 2023,
            // Physical dimensions (cm)
            width: 145,
            height: 83,
            depth: 5,
        },
        attributes: {
            hdmi21: true,
            hdmi21Ports: 4,
            brightness: 850,
            contrastRatio: 'Infinito',
            responseTime: 0.1,
            vrr: true,
            allm: true,
            dolbyVision: true,
            hdr10Plus: false,
            speakers: '2.2ch 40W',
            smartPlatform: 'webOS 23',
            voiceAssistants: ['ThinQ', 'Alexa', 'Google'],
        },
        scoreReasons: {
            c2: 'Processador α9 Gen6 é o melhor do mercado em cores e upscaling. Imagem de cinema.',
            c3: 'OLED dura anos para uso normal como TV. Evite uso prolongado como monitor de trabalho.',
            c5: 'A melhor TV para gaming: 0.1ms, G-Sync/FreeSync, Dolby Vision. Perfeita para PS5.',
            c6: 'OLED brilha ~850 nits. Ideal para salas escuras ou controladas.',
            c7: 'LG Brasil tem selo RA1000. Garantia estendida é investimento inteligente (R$200-400).',
        },
        badges: ['premium-pick'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 5399,
                url: 'https://www.amazon.com.br/dp/B0BVXF72HV',
                affiliateUrl: 'https://amzn.to/lg-c3-65',
                inStock: true,
                lastChecked: '2026-01-17'
            },
            {
                store: 'Casas Bahia',
                storeSlug: 'casasbahia',
                price: 5599,
                url: 'https://www.casasbahia.com.br/lg-c3-oled-65',
                inStock: true,
                lastChecked: '2026-01-17'
            }
        ],
        lastUpdated: '2026-01-17',
        mainCompetitor: {
            id: 'samsung-qn90c-65',
            name: 'Samsung QN90C Neo QLED 65"',
            shortName: 'Samsung QN90C',
            imageUrl: '/images/products/samsung-qn90c.svg',
            price: 4200,
            score: 8.37,
            keyDifferences: [
                { label: 'Tecnologia', current: 'OLED', rival: 'Mini LED', winner: 'current' },
                { label: 'Brilho', current: '800 nits', rival: '2000 nits', winner: 'rival' },
                { label: 'Burn-in', current: 'Possível', rival: 'Sem risco', winner: 'rival' },
            ],
        },
    },
    {
        id: 'tcl-c735-65',
        categoryId: 'tv',
        name: 'TCL C735 QLED 65"',
        shortName: 'TCL C735',
        brand: 'TCL',
        model: 'C735',
        price: 2800,
        imageUrl: '/images/products/tcl-c735.svg',
        scores: {
            c1: 9.0,  // Custo-Benefício - Imbatível na faixa
            c2: 7.0,  // Processamento - Bom para o preço
            c3: 7.5,  // Confiabilidade - Normal para categoria
            c4: 7.5,  // Sistema - Google TV funciona bem
            c5: 7.5,  // Gaming - Sem HDMI 2.1 real limita consoles
            c6: 7.0,  // Brilho - 330 nits é limitante
            c7: 8.5,  // Pós-Venda - TCL Semp tem RA1000 e nota 8.3!
            c8: 7.0,  // Som - Onkyo satisfatório
            c9: 7.5,  // Conectividade - Adequado
            c10: 7.5, // Design - Clean
            gaming: 7.5,
            imageQuality: 7.0,
            connectivity: 7.5,
        },
        specs: {
            screenSize: 65,
            resolution: '4K',
            panelType: 'QLED',
            refreshRate: 120,
            hdrFormats: 'HDR10, HLG',
            hdmiPorts: 3,
            releaseYear: 2023,
            // Physical dimensions (cm)
            width: 145,
            height: 84,
            depth: 7,
        },
        // Enhanced attributes for comparison
        attributes: {
            hdmi21: false,
            hdmi21Ports: 0,
            brightness: 600,
            contrastRatio: '5000:1',
            responseTime: 6,
            vrr: true,
            allm: true,
            dolbyVision: false,
            hdr10Plus: false,
            speakers: '2.0ch 20W',
            smartPlatform: 'Google TV',
            voiceAssistants: ['Google'],
        },
        badges: ['best-value', 'budget-pick'],
        scoreReasons: {
            c1: 'Imbatível até R$3.000. Entrega 70-80% da experiência premium por metade do preço.',
            c3: 'Boa qualidade para a faixa de preço. Verifique uniformidade na entrega, prática comum.',
            c4: 'Google TV fluido para streaming. Atualizações frequentes melhoram a experiência.',
            c5: '144Hz nativo é ótimo para PC gaming. Para consoles, sem HDMI 2.1 real.',
            c7: 'Destaque: TCL Semp tem selo RA1000 e nota 8.3 no Reclame Aqui. Suporte confiável.',
        },
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 2799,
                url: 'https://www.amazon.com.br/dp/B0C3K5MXQY',
                affiliateUrl: 'https://amzn.to/tcl-c735-65',
                inStock: true,
                lastChecked: '2026-01-17'
            }
        ],
        lastUpdated: '2026-01-17',
        mainCompetitor: {
            id: 'lg-c3-65',
            name: 'LG OLED C3 65"',
            shortName: 'LG C3 OLED',
            imageUrl: '/images/products/lg-c3.svg',
            price: 5500,
            score: 8.62,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.800', rival: 'R$ 5.500', winner: 'current' },
                { label: 'Qualidade de Imagem', current: 'QLED 600nits', rival: 'OLED Infinito', winner: 'rival' },
                { label: 'Pós-Venda Brasil', current: 'RA1000 8.3', rival: 'RA1000', winner: 'draw' },
            ],
        },
    },

];

// ============================================
// GELADEIRAS - Scores match FRIDGE_CATEGORY criteria
// ============================================

export const SAMPLE_FRIDGES: Product[] = [
    {
        id: 'samsung-rf23-family-hub',
        categoryId: 'fridge',
        name: 'Samsung RF23A9771SR Family Hub',
        shortName: 'Samsung Family Hub',
        brand: 'Samsung',
        model: 'RF23A9771SR',
        price: 18999,
        specs: {
            capacity: 614,
            // Physical dimensions (cm)
            width: 91,
            height: 178,
            depth: 72,
        },
        scores: {
            c1: 6.5,  // Custo-Benefício Real (VS)
            c2: 8.0,  // Eficiência Energética (QS)
            c3: 9.5,  // Capacidade e Espaço (QS)
            c4: 9.2,  // Sistema de Refrigeração (QS)
            c5: 9.0,  // Confiabilidade (GS)
            c6: 7.5,  // Nível de Ruído (QS)
            c7: 8.5,  // Pós-Venda e Suporte (GS)
            c8: 9.8,  // Recursos Smart (QS)
            c9: 9.5,  // Design e Acabamento (GS)
            c10: 9.5, // Funcionalidades Extras (GS)
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'panasonic-bb71-black',
            name: 'Panasonic BB71 Inverter Black Glass',
            shortName: 'Panasonic BB71',
            imageUrl: '/images/products/panasonic-bb71.svg',
            price: 5200,
            score: 8.61,
            keyDifferences: [
                { label: 'Capacidade', current: '614L', rival: '480L', winner: 'current' },
                { label: 'Recursos Smart', current: 'Family Hub', rival: 'Econavi', winner: 'current' },
                { label: 'Preço', current: 'R$ 18.999', rival: 'R$ 5.200', winner: 'rival' },
            ],
        },
    },
    {
        id: 'brastemp-inverse-460',
        categoryId: 'fridge',
        name: 'Brastemp Inverse BRE59AK 460L',
        shortName: 'Brastemp Inverse',
        brand: 'Brastemp',
        model: 'BRE59AK',
        price: 4599,
        specs: {
            capacity: 460,
            width: 70,
            height: 186,
            depth: 72,
        },
        scores: {
            c1: 8.5,  // Custo-Benefício Real (VS)
            c2: 8.5,  // Eficiência Energética (QS)
            c3: 8.0,  // Capacidade e Espaço (QS)
            c4: 8.5,  // Sistema de Refrigeração (QS)
            c5: 8.5,  // Confiabilidade (GS)
            c6: 8.0,  // Nível de Ruído (QS)
            c7: 9.0,  // Pós-Venda e Suporte (GS)
            c8: 5.0,  // Recursos Smart (QS)
            c9: 8.0,  // Design e Acabamento (GS)
            c10: 7.5, // Funcionalidades Extras (GS)
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-rt53-evolution',
            name: 'Samsung Evolution RT53 com POWERvolt',
            shortName: 'Samsung RT53',
            imageUrl: '/images/products/samsung-rt53.svg',
            price: 4300,
            score: 8.24,
            keyDifferences: [
                { label: 'Pós-Venda', current: 'Excelente', rival: 'Bom', winner: 'current' },
                { label: 'Capacidade', current: '460L', rival: '518L', winner: 'rival' },
                { label: 'Proteção Elétrica', current: 'Não', rival: 'POWERvolt', winner: 'rival' },
            ],
        },
    },
    {
        id: 'consul-crm50-410',
        categoryId: 'fridge',
        name: 'Consul CRM50 Frost Free 410L',
        shortName: 'Consul CRM50',
        brand: 'Consul',
        model: 'CRM50',
        price: 2299,
        specs: {
            capacity: 410,
            width: 68,
            height: 176,
            depth: 65,
        },
        scores: {
            c1: 9.5,  // Custo-Benefício Real (VS) - Best value!
            c2: 9.0,  // Eficiência Energética (QS)
            c3: 7.0,  // Capacidade e Espaço (QS)
            c4: 7.5,  // Sistema de Refrigeração (QS)
            c5: 8.0,  // Confiabilidade (GS)
            c6: 7.5,  // Nível de Ruído (QS)
            c7: 8.5,  // Pós-Venda e Suporte (GS)
            c8: 3.0,  // Recursos Smart (QS)
            c9: 6.5,  // Design e Acabamento (GS)
            c10: 5.5, // Funcionalidades Extras (GS)
        },
        badges: ['best-value', 'budget-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'brastemp-inverse-460',
            name: 'Brastemp Inverse BRE59AK 460L',
            shortName: 'Brastemp Inverse',
            imageUrl: '/images/products/brastemp-inverse.svg',
            price: 4599,
            score: 7.95,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.299', rival: 'R$ 4.599', winner: 'current' },
                { label: 'Capacidade', current: '410L', rival: '460L', winner: 'rival' },
                { label: 'Sistema Frost Free', current: 'Sim', rival: 'Sim', winner: 'draw' },
            ],
        },
    },
    // NEW: User provided seed data
    {
        id: 'panasonic-bb71-black',
        categoryId: 'fridge',
        name: 'Panasonic BB71 Inverter Black Glass',
        shortName: 'Panasonic BB71',
        brand: 'Panasonic',
        model: 'BB71',
        price: 5200,
        scores: {
            c1: 8.5,  // Custo-Benefício
            c2: 9.2,  // Eficiência Energética A+++
            c3: 8.8,  // Capacidade 480L
            c4: 9.0,  // Tecnologia Econavi
            c5: 9.0,  // Confiabilidade
            c6: 8.5,  // Nível de Ruído
            c7: 8.0,  // Pós-Venda
            c8: 7.0,  // Recursos Smart
            c9: 9.0,  // Design Premium Black Glass
            c10: 8.5, // Funcionalidades (FreshZone LED)
        },
        technicalSpecs: {
            capacityLitres: 480,
            voltage: 'Bivolt',
            technology: 'Inverter Econavi',
            finish: 'Black Glass',
            consumption: '40.9 kWh/mês',
        },
        scoreReasons: {
            c2: 'Eficiência A+++ - economia de até 40% na conta de luz',
            c9: 'Design premium Black Glass moderno e elegante',
            c10: 'Gaveta FreshZone com LED azul mantém legumes frescos por mais tempo',
        },
        painPointsSolved: ['Conta de luz alta', 'Legumes estragando'],
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-rf23-family-hub',
            name: 'Samsung RF23A9771SR Family Hub',
            shortName: 'Samsung Family Hub',
            imageUrl: '/images/products/samsung-family-hub.svg',
            price: 18999,
            score: 8.58,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 5.200', rival: 'R$ 18.999', winner: 'current' },
                { label: 'Eficiência', current: 'A+++', rival: 'A++', winner: 'current' },
                { label: 'Recursos Smart', current: 'Econavi', rival: 'Family Hub', winner: 'rival' },
            ],
        },
    },
    {
        id: 'samsung-rt53-evolution',
        categoryId: 'fridge',
        name: 'Samsung Evolution RT53 com POWERvolt',
        shortName: 'Samsung RT53',
        brand: 'Samsung',
        model: 'RT53',
        price: 4300,
        scores: {
            c1: 9.1,  // Melhor custo por litro
            c2: 8.8,  // Digital Inverter
            c3: 9.2,  // 518L SpaceMax
            c4: 8.8,  // Digital Inverter
            c5: 9.0,  // POWERvolt protege
            c6: 8.0,  // Nível de Ruído
            c7: 7.5,  // Pós-Venda
            c8: 6.0,  // Recursos Smart básicos
            c9: 7.5,  // Design Inox
            c10: 8.5, // SpaceMax
        },
        technicalSpecs: {
            capacityLitres: 518,
            voltage: 'Bivolt (90V-310V)',
            technology: 'Digital Inverter',
            finish: 'Inox',
            consumption: '42.0 kWh/mês',
        },
        scoreReasons: {
            c1: 'Melhor custo por litro do mercado: R$8,30/L',
            c3: 'Tecnologia SpaceMax: paredes finas = mais litros internos',
            c5: 'POWERvolt protege contra picos de energia (90V-310V)',
        },
        painPointsSolved: ['Risco de queimar com picos de energia', 'Espaço interno insuficiente'],
        badges: ['best-value'],
        lastUpdated: '2026-01-04',
        // On-Page Comparison: Direct Rival
        mainCompetitor: {
            id: 'brastemp-inverse-460',
            name: 'Brastemp Inverse BRE59AK 460L',
            shortName: 'Brastemp Inverse',
            imageUrl: '/images/products/brastemp-inverse.svg',
            price: 4599,
            score: 7.9,
            keyDifferences: [
                { label: 'Capacidade', current: '518L', rival: '460L', winner: 'current' },
                { label: 'Proteção POWERvolt', current: 'Sim', rival: 'Não', winner: 'current' },
                { label: 'Pós-Venda Brasil', current: 'Bom', rival: 'Excelente', winner: 'rival' },
            ],
        },
    },
    {
        id: 'electrolux-if43b',
        categoryId: 'fridge',
        name: 'Geladeira Electrolux Frost Free Inverter 390L Efficient AutoSense (IF43B)',
        shortName: 'Electrolux IF43B',
        brand: 'Electrolux',
        model: 'IF43B',
        price: 3399,
        imageUrl: '/images/products/electrolux-if43b.svg',
        asin: 'B0C6R7327B',
        specs: {
            capacity: 390,
            width: 60,
            height: 176,
            depth: 71,
            // Campos para Simuladores Inteligentes
            energyClass: 'A',
            inverter: true,
            noiseLevel: 38,
        },
        technicalSpecs: {
            capacityLitres: 390,
            voltage: '220V',
            technology: 'Frost Free Inverter',
            finish: 'Black Inox Look',
        },
        scores: {
            c1: 9.0,  // Custo-Benefício - Excelente preço para Inverter A+++
            c2: 9.2,  // Eficiência Energética - A+++, economia de 30%
            c3: 7.5,  // Capacidade - 390L, médio
            c4: 8.5,  // Refrigeração - Frost Free Inverter
            c5: 8.5,  // Confiabilidade - Electrolux boa reputação
            c6: 8.0,  // Nível de Ruído - Inverter silencioso
            c7: 7.5,  // Pós-Venda - Rede Electrolux Brasil
            c8: 8.5,  // Recursos Smart - AutoSense com IA
            c9: 8.5,  // Design - Black Inox Look premium
            c10: 8.0, // Funcionalidades - HortiNatura, MoveAdapt
        },
        scoreReasons: {
            c1: 'Melhor custo-benefício: Inverter A+++ por R$3.399',
            c2: 'Eficiência A+++ economiza até 30% na conta de luz',
            c8: 'AutoSense usa IA para controlar temperatura automaticamente',
        },
        painPointsSolved: ['Conta de luz alta', 'Alimentos estragando rápido'],
        badges: ['best-value'],
        lastUpdated: '2026-01-12',
        mainCompetitor: {
            id: 'consul-crm50-410',
            name: 'Consul CRM50 Frost Free 410L',
            shortName: 'Consul CRM50',
            imageUrl: '/images/products/consul-crm50.svg',
            price: 2299,
            score: 7.58,
            keyDifferences: [
                { label: 'Eficiência', current: 'A+++ Inverter', rival: 'A', winner: 'current' },
                { label: 'Capacidade', current: '390L', rival: '410L', winner: 'rival' },
                { label: 'AutoSense IA', current: 'Sim', rival: 'Não', winner: 'current' },
            ],
        },
    },
    {
        id: 'panasonic-bb64',
        categoryId: 'fridge',
        name: 'Geladeira Panasonic BB64 Aço Escovado Inverse Frost Free 460L Inverter A+++ (NR-BB64PV1X)',
        shortName: 'Panasonic BB64',
        brand: 'Panasonic',
        model: 'NR-BB64PV1X',
        price: 4367,
        imageUrl: '/images/products/panasonic-bb64.svg',
        asin: 'B0DGQSDTT4',
        specs: {
            capacity: 460,
            width: 70,
            height: 186,
            depth: 75,
            // Campos para Simuladores Inteligentes
            energyClass: 'A',
            inverter: true,
            noiseLevel: 36,
        },
        technicalSpecs: {
            capacityLitres: 460,
            voltage: '220V',
            technology: 'Inverse Frost Free Inverter',
            finish: 'Aço Escovado',
            energyClass: 'A+++',
        },
        scores: {
            c1: 8.5,  // Custo-Benefício
            c2: 9.5,  // Eficiência Energética A+++
            c3: 8.5,  // Capacidade 460L
            c4: 9.0,  // Refrigeração Inverter
            c5: 9.0,  // Confiabilidade Panasonic
            c6: 8.5,  // Nível de Ruído
            c7: 8.0,  // Pós-Venda
            c8: 7.0,  // Recursos Smart
            c9: 8.5,  // Design Aço Escovado
            c10: 8.0, // Funcionalidades
        },
        scoreReasons: {},
        painPointsSolved: [],
        badges: [],
        lastUpdated: '2026-01-12',
        mainCompetitor: {
            id: 'brastemp-inverse-460',
            name: 'Brastemp Inverse BRE59AK 460L',
            shortName: 'Brastemp Inverse',
            imageUrl: '/images/products/brastemp-inverse.svg',
            price: 4599,
            score: 7.95,
            keyDifferences: [
                { label: 'Eficiência', current: 'A+++ Inverter', rival: 'A++', winner: 'current' },
                { label: 'Capacidade', current: '460L', rival: '460L', winner: 'draw' },
                { label: 'Sistema', current: 'Inverse', rival: 'Inverse', winner: 'draw' },
            ],
        },
    },
    {
        id: 'hq-150rdf',
        categoryId: 'fridge',
        name: 'Geladeira Refrigerador Compacto HQ Defrost 150 Litros Preto (HQ-150RDF)',
        shortName: 'HQ Compacta 150L',
        brand: 'HQ',
        model: 'HQ-150RDF',
        price: 1489,
        imageUrl: '/images/products/hq-150rdf.svg',
        asin: 'B0G1TSGJW1',
        specs: {
            capacity: 150,
            width: 46,
            height: 129,
            depth: 49,
            // Campos para Simuladores Inteligentes
            energyClass: 'C',  // Defrost manual = menos eficiente
            inverter: false,
            noiseLevel: 42,
        },
        technicalSpecs: {
            capacityLitres: 150,
            voltage: '220V',
            technology: 'Defrost Manual',
            finish: 'Preto',
            doors: 2,
        },
        scores: {
            c1: 9.0,  // Custo-Benefício - Excelente preço para compacta
            c2: 6.5,  // Eficiência Energética - Defrost manual menos eficiente
            c3: 6.0,  // Capacidade - 150L compacta
            c4: 7.0,  // Refrigeração - Básica
            c5: 7.0,  // Confiabilidade - Marca menos conhecida
            c6: 7.5,  // Nível de Ruído - Compacta silenciosa
            c7: 5.5,  // Pós-Venda - Rede limitada
            c8: 3.0,  // Recursos Smart - Nenhum
            c9: 7.0,  // Design - Simples
            c10: 5.0, // Funcionalidades - Básica
        },
        scoreReasons: {},
        painPointsSolved: ['Espaço limitado', 'Segundo refrigerador'],
        badges: ['budget-pick'],
        lastUpdated: '2026-01-12',
        mainCompetitor: {
            id: 'consul-crm50-410',
            name: 'Consul CRM50 Frost Free 410L',
            shortName: 'Consul CRM50',
            imageUrl: '/images/products/consul-crm50.svg',
            price: 2299,
            score: 7.58,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 1.489', rival: 'R$ 2.299', winner: 'current' },
                { label: 'Capacidade', current: '150L', rival: '410L', winner: 'rival' },
                { label: 'Frost Free', current: 'Não', rival: 'Sim', winner: 'rival' },
            ],
        },
    },
];

// ============================================
// ALL PRODUCTS
// ============================================

// ============================================
// AR CONDICIONADO - Tier 1 Category
// ============================================

export const SAMPLE_AIR_CONDITIONERS: Product[] = [
    {
        id: 'lg-dual-inverter-12000',
        categoryId: 'air_conditioner',
        name: 'LG Dual Inverter Voice 12000 BTUs',
        shortName: 'LG Dual Inverter',
        brand: 'LG',
        model: 'S4-Q12JA31A',
        price: 2599,
        scores: {
            c1: 9.0, c2: 9.5, c3: 8.5, c4: 9.0, c5: 9.0,
            c6: 9.5, c7: 8.5, c8: 8.0, c9: 9.0, c10: 8.5,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'dual-inverter',
            noiseLevel: 19,
        },
        scoreReasons: {
            c2: 'Tecnologia Dual Inverter oferece até 70% de economia de energia comparado a modelos convencionais.',
            c5: 'Apenas 19dB - um dos mais silenciosos do mercado, ideal para quartos.',
        },
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-windfree-12000',
            name: 'Samsung WindFree 12000 BTUs',
            shortName: 'Samsung WindFree',
            imageUrl: '/images/products/samsung-windfree.svg',
            price: 2899,
            score: 8.80,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.599', rival: 'R$ 2.899', winner: 'current' },
                { label: 'Ruído', current: '19dB', rival: '21dB', winner: 'current' },
                { label: 'Tecnologia', current: 'Dual Inverter', rival: 'WindFree', winner: 'draw' },
            ],
        },
    },
    {
        id: 'samsung-windfree-12000',
        categoryId: 'air_conditioner',
        name: 'Samsung WindFree 12000 BTUs',
        shortName: 'Samsung WindFree',
        brand: 'Samsung',
        model: 'AR12CVFAMWK',
        price: 2899,
        scores: {
            c1: 8.5, c2: 9.5, c3: 9.0, c4: 8.5, c5: 9.5,
            c6: 9.0, c7: 8.5, c8: 8.0, c9: 9.0, c10: 9.0,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'inverter',
            noiseLevel: 21,
        },
        scoreReasons: {
            c3: 'Tecnologia WindFree distribui ar através de 23.000 micro-furos, eliminando o vento direto.',
            c9: 'Integração SmartThings com controle por voz Bixby e Google.',
        },
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'lg-dual-inverter-12000',
            name: 'LG Dual Inverter Voice 12000 BTUs',
            shortName: 'LG Dual Inverter',
            imageUrl: '/images/products/lg-dual-inverter.svg',
            price: 2599,
            score: 8.90,
            keyDifferences: [
                { label: 'Tecnologia', current: 'WindFree', rival: 'Dual Inverter', winner: 'draw' },
                { label: 'Ruído', current: '21dB', rival: '19dB', winner: 'rival' },
                { label: 'Recursos Smart', current: 'SmartThings', rival: 'ThinQ', winner: 'current' },
            ],
        },
    },
    {
        id: 'electrolux-eco-9000',
        categoryId: 'air_conditioner',
        name: 'Electrolux Eco Turbo 9000 BTUs',
        shortName: 'Electrolux Eco',
        brand: 'Electrolux',
        model: 'EI09F',
        price: 1699,
        scores: {
            c1: 9.5, c2: 8.0, c3: 7.5, c4: 7.5, c5: 7.0,
            c6: 7.0, c7: 7.5, c8: 8.5, c9: 6.0, c10: 7.5,
        },
        technicalSpecs: {
            btus: 9000,
            inverterType: 'conventional',
            noiseLevel: 38,
        },
        scoreReasons: {
            c1: 'Melhor preço do segmento de entrada. Ideal para quem busca economia inicial.',
            c5: '38dB é ruidoso - não recomendado para quartos de dormir.',
        },
        badges: ['budget-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'consul-inverter-12000',
            name: 'Consul Inverter 12000 BTUs',
            shortName: 'Consul Inverter',
            imageUrl: '/images/products/consul-inverter.svg',
            price: 2199,
            score: 8.10,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 1.699', rival: 'R$ 2.199', winner: 'current' },
                { label: 'Tecnologia', current: 'Convencional', rival: 'Inverter', winner: 'rival' },
                { label: 'Economia', current: 'Normal', rival: 'Até 60%', winner: 'rival' },
            ],
        },
    },
    {
        id: 'consul-inverter-12000',
        categoryId: 'air_conditioner',
        name: 'Consul Inverter 12000 BTUs',
        shortName: 'Consul Inverter',
        brand: 'Consul',
        model: 'CBN12CBBNA',
        price: 2199,
        scores: {
            c1: 9.0, c2: 8.5, c3: 8.0, c4: 8.0, c5: 8.0,
            c6: 8.5, c7: 8.0, c8: 8.5, c9: 7.0, c10: 7.5,
        },
        technicalSpecs: {
            btus: 12000,
            inverterType: 'inverter',
            noiseLevel: 28,
        },
        scoreReasons: {
            c1: 'Melhor custo-benefício para quem quer Inverter sem pagar premium LG/Samsung.',
        },
        badges: ['best-value'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'lg-dual-inverter-12000',
            name: 'LG Dual Inverter Voice 12000 BTUs',
            shortName: 'LG Dual Inverter',
            imageUrl: '/images/products/lg-dual-inverter.svg',
            price: 2599,
            score: 8.90,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.199', rival: 'R$ 2.599', winner: 'current' },
                { label: 'Marca', current: 'Consul', rival: 'LG', winner: 'rival' },
                { label: 'Ruído', current: '28dB', rival: '19dB', winner: 'rival' },
            ],
        },
    },
    // NEW: User provided seed data
    {
        id: 'lg-dual-inverter-voice-ai',
        categoryId: 'air_conditioner',
        name: 'LG Dual Inverter Voice + AI 12000 BTUs',
        shortName: 'LG Voice + AI',
        brand: 'LG',
        model: 'S4-Q12JA3WC',
        price: 2400,
        scores: {
            c1: 8.8,  // Custo-Benefício
            c2: 9.5,  // Eficiência IDRS 6.0 Classe A
            c3: 8.5,  // 12000 BTUs
            c4: 9.0,  // Durabilidade Dual Inverter
            c5: 9.5,  // Super Silencioso 19dB Sleep
            c6: 9.5,  // Dual Inverter
            c7: 8.5,  // Filtros
            c8: 8.0,  // Instalação
            c9: 9.0,  // WiFi + Voice
            c10: 8.0, // Design
        },
        technicalSpecs: {
            btus: 12000,
            cycle: 'Frio',
            noiseLevel: 19,
            efficiency: 'IDRS 6.0 (Classe A)',
        },
        scoreReasons: {
            c5: 'Apenas 19dB no modo Sleep - super silencioso, ideal para dormir',
            c2: 'Economia de até 70% na conta de luz com Dual Inverter',
            c6: 'Tecnologia Dual Inverter: resfria 40% mais rápido',
        },
        painPointsSolved: ['Barulho ao dormir', 'Conta de luz no verão'],
        badges: ['editors-choice'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'samsung-windfree-connect',
            name: 'Samsung WindFree Connect Sem Vento',
            shortName: 'WindFree Connect',
            imageUrl: '/images/products/samsung-windfree-connect.svg',
            price: 2600,
            score: 8.70,
            keyDifferences: [
                { label: 'Preço', current: 'R$ 2.400', rival: 'R$ 2.600', winner: 'current' },
                { label: 'Tecnologia', current: 'Dual Inverter', rival: 'WindFree', winner: 'draw' },
                { label: 'Ruído', current: '19dB', rival: '22dB', winner: 'current' },
            ],
        },
    },
    {
        id: 'samsung-windfree-connect',
        categoryId: 'air_conditioner',
        name: 'Samsung WindFree Connect Sem Vento',
        shortName: 'WindFree Connect',
        brand: 'Samsung',
        model: 'AR12CVFAMWK',
        price: 2600,
        scores: {
            c1: 8.2,  // Custo-Benefício
            c2: 9.4,  // IDRS 6.2
            c3: 8.5,  // 12000 BTUs
            c4: 9.0,  // Durabilidade
            c5: 9.0,  // 22dB
            c6: 9.0,  // Inverter
            c7: 8.5,  // Filtros
            c8: 8.0,  // Instalação
            c9: 9.5,  // SmartThings App - Fator Uau
            c10: 9.5, // Design WindFree
        },
        technicalSpecs: {
            btus: 12000,
            cycle: 'Quente/Frio',
            noiseLevel: 22,
            efficiency: 'IDRS 6.2',
        },
        scoreReasons: {
            c3: 'Modo WindFree: 23.000 micro-furos distribuem ar sem vento direto',
            c9: 'App SmartThings com controle remoto, timer e modo IA',
            c10: 'Design premiado - elimina sensação de vento gelado incomodando',
        },
        painPointsSolved: ['Vento gelado incomodando', 'Controle difícil'],
        badges: ['premium-pick'],
        lastUpdated: '2026-01-04',
        mainCompetitor: {
            id: 'lg-dual-inverter-voice-ai',
            name: 'LG Dual Inverter Voice + AI 12000 BTUs',
            shortName: 'LG Voice + AI',
            imageUrl: '/images/products/lg-dual-inverter-ai.svg',
            price: 2400,
            score: 8.80,
            keyDifferences: [
                { label: 'Design', current: 'WindFree', rival: 'Tradicional', winner: 'current' },
                { label: 'Preço', current: 'R$ 2.600', rival: 'R$ 2.400', winner: 'rival' },
                { label: 'Ruído', current: '22dB', rival: '19dB', winner: 'rival' },
            ],
        },
    },
];

// ============================================
// ROBÔS ASPIRADORES - Tier 2 Category
// ============================================

export const SAMPLE_ROBOT_VACUUMS: Product[] = [
    // Modular architecture: all products imported from entry files
    wap_robot_w400,
    roborock_q7_l5,
    electrolux_erb20_home_control_experience,
    liectroux_l200_robo_aspirador_3em1_app_alexa_google,
    xiaomi_robot_x10,
    ezs_e10,
    eufy_x10_pro_omni,
    eufy_omni_c20,
    xiaomi_robot_vacuum_x20_pro,
    // Pre-existing entry files
    liectroux_xr500_pro,
    wkjwqwhy_a6s,
    xiaomi_robot_vacuum_s40c,
    wap_robot_w90,
    xiaomi_robot_vacuum_s20_plus_white,
    samsung_vr5000rm,
    kabum_smart_700,
    philco_pas26p as unknown as Product,
];

// ============================================
// SMARTWATCHES - Nova Categoria (Cadastrado 18/01/2026)
// ============================================

export const SAMPLE_SMARTWATCHES: Product[] = [
    {
        id: 'samsung-galaxy-watch7-44mm-lte',
        categoryId: 'smartwatch',
        name: 'Samsung Galaxy Watch7 44mm LTE com Galaxy AI',
        shortName: 'Galaxy Watch7 44mm',
        brand: 'Samsung',
        model: 'SM-L315F',
        price: 2199,
        asin: 'B0D96TWWRD',
        imageUrl: '/images/products/galaxy-watch7.svg',
        status: 'published',
        benefitSubtitle: 'O smartwatch Samsung mais inteligente com Galaxy AI e processador 3nm',
        scores: {
            // Critérios de Smartwatch - Cadastrado 18/01/2026
            // c1: Tela (14%), c2: Bateria (14%), c3: Sensores Saúde (14%), c4: Fitness (12%)
            // c5: Ecossistema (10%), c6: Custo-Benefício (14%), c7: Design (8%)
            // c8: Resistência (6%), c9: Notificações (4%), c10: Pagamentos (4%)
            c1: 9.5,  // Tela - AMOLED 1.5" com cristal de safira, brilho excelente
            c2: 7.0,  // Bateria - ~30h típico com LTE, precisa carregar diário
            c3: 9.5,  // Sensores Saúde - HR, SpO2, ECG, detecção queda, sono avançado
            c4: 9.0,  // Fitness - GPS dupla frequência, 100+ modos esporte
            c5: 8.5,  // Ecossistema - Wear OS + One UI, melhor com Galaxy, funciona Android
            c6: 7.5,  // Custo-Benefício - R$ 2.199 é premium, mas entrega muito
            c7: 9.0,  // Design - Premium, pulseiras intercambiáveis, safira
            c8: 9.0,  // Resistência - 5ATM + IP68, natação OK
            c9: 9.0,  // Notificações - Resposta inteligente com Galaxy AI
            c10: 9.5, // Pagamentos - Samsung Pay + Google Wallet = completo
        },
        specs: {
            screenSize: 44,  // mm
            batteryCapacity: 425,  // mAh
            width: 44,
            height: 44,
            depth: 9.7,
        },
        attributes: {
            displayType: 'Super AMOLED',
            displayMaterial: 'Cristal de Safira',
            processor: 'Exynos W1000 (3nm)',
            connectivity: 'LTE + Bluetooth 5.3 + Wi-Fi',
            storage: '32GB',
            ram: '2GB',
            waterResistance: '5ATM + IP68',
            gps: 'Dupla Frequência',
            sensors: ['HR', 'SpO2', 'ECG', 'BIA', 'Temperatura Pele'],
            os: 'Wear OS 5 + One UI Watch 6',
            voiceAssistants: ['Bixby', 'Google'],
            nfc: true,
        },
        technicalSpecs: {
            // Display
            displaySize: '1.5"',
            displayResolution: '480x480',
            displayType: 'Super AMOLED Always On',
            displayProtection: 'Cristal de Safira',
            // Performance
            processor: 'Exynos W1000 3nm',
            ram: '2GB',
            storage: '32GB',
            // Bateria
            batteryCapacity: 425,  // mAh
            typicalBattery: '30 horas',
            chargingTime: '30 min para 45%',
            wirelessCharging: true,
            // Conectividade
            bluetooth: '5.3',
            wifi: 'b/g/n 2.4GHz',
            lte: true,
            nfc: true,
            gps: 'L1+L5 Dupla Frequência',
            // Sensores
            heartRate: true,
            spo2: true,
            ecg: true,
            bia: true,  // Composição corporal
            skinTemperature: true,
            accelerometer: true,
            gyroscope: true,
            barometer: true,
            // Resistência
            waterResistance: '5ATM + IP68',
            militaryGrade: 'MIL-STD-810H',
            // Dimensões
            diameter: 44,  // mm
            thickness: 9.7,  // mm
            weight: 33.8,  // g (sem pulseira)
        },
        scoreReasons: {
            c1: 'PREMIUM: Tela Super AMOLED 1.5" com cristal de safira (durabilidade máxima). Always On Display eficiente.',
            c2: 'ATENÇÃO: ~30h de bateria típica com LTE. Precisa carregar todo dia. Carregamento rápido ajuda.',
            c3: 'DESTAQUE: Sensores mais completos do mercado - HR, SpO2, ECG, BIA, temp de pele. Galaxy AI analisa sono.',
            c4: 'EXCELENTE: GPS dupla frequência (L1+L5) = precisão máxima. 100+ modos de esporte com detecção automática.',
            c5: 'ECOSSISTEMA: Funciona com qualquer Android, mas brilha com Galaxy. ECG/PA só com Samsung.',
            c7: 'DESIGN: Corpo em alumínio, safira e pulseiras intercambiáveis. Estilo premium.',
            c10: 'COMPLETO: Samsung Pay + Google Wallet. NFC para pagamentos por aproximação em qualquer bandeira.',
        },
        voc: {
            totalReviews: 1827,
            averageRating: 4.7,
            oneLiner: 'O smartwatch Android mais completo com Galaxy AI e sensores avançados',
            summary: 'Compradores elogiam muito a qualidade de construção, sensores de saúde completos e integração com Samsung. Principais críticas são sobre a bateria que dura ~1 dia e funcionalidades limitadas com iPhones. Ideal para donos de Samsung Galaxy.',
            pros: [
                'Galaxy AI com análise de sono e Pontuação de Energia inovadora',
                'Sensores de saúde mais completos (ECG, BIA, SpO2, temp pele)',
                'GPS dupla frequência = precisão máxima em corridas',
                'Design premium com cristal de safira',
                'Carregamento rápido (30min para 45%)',
            ],
            cons: [
                'Bateria ~30h com LTE, precisa carregar diariamente',
                'ECG e pressão arterial só funcionam com Samsung Galaxy',
                'Não compatível com iPhone',
                'Preço premium de R$ 2.199',
            ],
            sources: [
                { name: 'Amazon Brasil', url: 'https://www.amazon.com.br/dp/B0D96TWWRD', count: 1827 },
            ],
        },
        painPointsSolved: ['Monitoramento avançado de saúde', 'GPS impreciso em corridas', 'Pagamento sem celular', 'Notificações inteligentes'],
        badges: ['premium-pick', 'editors-choice'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 2199,
                url: 'https://www.amazon.com.br/dp/B0D96TWWRD',
                affiliateUrl: 'https://amzn.to/galaxy-watch7-44mm',
                inStock: true,
                lastChecked: '2026-01-18',
            },
        ],
        lastUpdated: '2026-01-18',
        gallery: ['/images/products/galaxy-watch7.svg'],
        featureBenefits: [
            { icon: 'Brain', title: 'Galaxy AI', description: 'Pontuação de Energia e análise de sono com IA. Sabe quando você precisa descansar.' },
            { icon: 'Heart', title: 'Saúde Completa', description: 'ECG, SpO2, composição corporal e temperatura de pele em um dispositivo.' },
            { icon: 'MapPin', title: 'GPS L1+L5', description: 'Dupla frequência = precisão de 1 metro. Ideal para corredores exigentes.' },
            { icon: 'CreditCard', title: 'Pagamento Total', description: 'Samsung Pay + Google Wallet. Deixe a carteira em casa.' },
        ],
        mainCompetitor: {
            id: 'apple-watch-series-9',
            name: 'Apple Watch Series 9 45mm',
            shortName: 'Apple Watch 9',
            imageUrl: '/images/products/apple-watch-9.svg',
            price: 4499,
            score: 8.8,
            keyDifferences: [
                { label: 'Compatibilidade', current: 'Android + Samsung', rival: 'Apenas iPhone', winner: 'current' },
                { label: 'Preço', current: 'R$ 2.199', rival: 'R$ 4.499', winner: 'current' },
                { label: 'Ecossistema', current: 'Wear OS', rival: 'watchOS', winner: 'rival' },
            ],
        },
    },
    {
        id: 'haylou-rt3-ls16-tactical',
        categoryId: 'smartwatch',
        name: 'Relógio Smartwatch Haylou LS16 (RT3) Tactical Bluetooth 5.2 Tela AMOLED 1,43"',
        shortName: 'Haylou RT3 (LS16) Tactical',
        brand: 'Haylou',
        model: 'LS16 (RT3)',
        price: 249, // Estimativa de mercado para smartwatch de entrada/intermediário
        imageUrl: '/images/products/haylou-rt3-ls16-tactical.svg',
        status: 'published',
        benefitSubtitle: 'Tela AMOLED 1,43", Bluetooth 5.2, bateria de até 15 dias e resistência IP68.',
        scores: {
            c1: 8.5,  // Tela - AMOLED 1.43"
            c2: 9.5,  // Bateria - 15 dias (ótimo)
            c3: 6.0,  // Sensores Saúde - Básico (HR/SpO2)
            c4: 5.0,  // Fitness - Sem GPS nativo
            c5: 6.0,  // Ecossistema - App proprietário
            c6: 9.0,  // Custo-Benefício - Alto valor pelo preço
            c7: 9.0,  // Design - Caixa em titânio
            c8: 8.5,  // Resistência - IP68
            c9: 7.0,  // Notificações - Básico
            c10: 1.0, // Pagamentos - Sem NFC
        },
        specs: {
            screenSize: 45, // mm (caixa) / 1.43" tela
            width: 45,
            height: 45,
            depth: 10.1, // Estimado
        },
        attributes: {
            displayType: 'AMOLED',
            connectivity: 'Bluetooth 5.2',
            waterResistance: 'IP68',
            sensors: ['HR', 'SpO2'],
            voiceAssistants: [],
            nfc: false,
            gps: 'Não',
            batteryLife: '15 dias',
        },
        technicalSpecs: {
            displaySize: '1.43"',
            displayType: 'AMOLED',
            bluetooth: '5.2',
            batteryLife: '15 dias',
            waterResistance: 'IP68',
            caseMaterial: 'Titânio',
        },
        scoreReasons: {
            c1: 'Tela AMOLED de 1.43" oferece cores vibrantes e boa visibilidade.',
            c2: 'Bateria de até 15 dias é um grande diferencial para a categoria.',
            c3: 'Sensores básicos de frequência cardíaca e oxigenação (SpO2).',
            c4: 'Não possui GPS integrado, dependendo do celular para rastreio preciso.',
            c5: 'Sistema proprietário da Haylou, funcional mas menos expansível que WearOS.',
            c6: 'Excelente construção em titânio e tela AMOLED por um preço acessível.',
            c7: 'Design robusto com caixa em titânio e visual tático.',
            c8: 'Classificação IP68 garante proteção contra água e poeira no uso diário.',
        },
        voc: {
            averageRating: 4.5,
            totalReviews: 150,
            oneLiner: 'Smartwatch robusto com tela premium e muita bateria',
            summary: 'Usuários elogiam a qualidade da tela AMOLED e a duração da bateria. O design em titânio também é um ponto forte. A falta de GPS integrado é a principal crítica para esportistas.',
            pros: ['Tela AMOLED', 'Bateria 15 dias', 'Design em titânio', 'Preço'],
            cons: ['Sem GPS', 'Sem NFC', 'App básico'],
            sources: [{ name: 'Amazon BR', url: '', count: 150 }],
        },
        badges: ['best-value'],
        offers: [],
        lastUpdated: '2026-01-28',
        gallery: ['/images/products/haylou-rt3-ls16-tactical.svg'],
        featureBenefits: [
            { icon: 'MonitorSmartphone', title: 'Tela AMOLED', description: 'Visor de 1.43" com alta definição e cores vivas.' },
            { icon: 'Battery', title: '15 Dias de Bateria', description: 'Esqueça o carregador com até duas semanas de uso.' },
            { icon: 'Shield', title: 'Titânio & IP68', description: 'Construção robusta resistente a água e poeira.' },
            { icon: 'Phone', title: 'Chamadas Bluetooth', description: 'Atenda ligações diretamente pelo relógio.' },
        ],
        mainCompetitor: {
            id: 'colmi-c81',
            name: 'Colmi C81',
            shortName: 'Colmi C81',
            imageUrl: '/images/products/colmi-c81.svg',
            price: 220,
            score: 7.0,
            keyDifferences: [
                { label: 'Material', current: 'Titânio', rival: 'Plástico/Metal', winner: 'current' },
                { label: 'Tela', current: 'AMOLED', rival: 'AMOLED', winner: 'current' },
                { label: 'Preço', current: 'R$ 249', rival: 'R$ 220', winner: 'rival' },
            ],
        },
    },
];

// ============================================
// SMARTPHONES - Scores match SMARTPHONE_CATEGORY criteria
// ============================================

export const SAMPLE_SMARTPHONES: Product[] = [
    {
        id: 'samsung-galaxy-a56-5g',
        categoryId: 'smartphone',
        name: 'Samsung Galaxy A56 5G 128GB',
        shortName: 'Galaxy A56',
        brand: 'Samsung',
        model: 'SM-A566E',
        price: 1845,
        imageUrl: 'https://m.media-amazon.com/images/I/51lPd9IOAVL._AC_SL1200_.jpg',
        asin: 'B0DYVPJ8KZ',
        status: 'published',
        specs: {
            // Dimensões físicas (mm)
            width: 77.2,
            height: 165.2,
            depth: 7.4,
            weight: 195,
        },
        technicalSpecs: {
            displaySize: 6.7,
            displayType: 'Super AMOLED',
            refreshRate: 120,
            processor: 'Exynos 1580',
            ram: 8,
            storage: 128,
            battery: 5000,
            chargingSpeed: 45,
            mainCamera: 50,
            certification: 'IP67',
            os: 'Android 15',
            nfc: true,
            esim: true,
            fiveG: true,
        },
        scores: {
            // Critérios 10 Dores para Smartphones
            c1: 8.5,  // Autonomia Real (IARSE) - 5000mAh, Exynos eficiente, 45W
            c2: 8.8,  // Estabilidade de Software (ESMI) - One UI 7, 6 anos updates
            c3: 8.5,  // Custo-Benefício & Revenda (RCBIRV) - Galaxy A = alta revenda
            c4: 7.5,  // Câmera Social (QFSR) - 50MP OIS, bom mas não flagship
            c5: 8.5,  // Resiliência Física (RFCT) - IP67, Gorilla Glass Victus+
            c6: 9.0,  // Qualidade de Tela (QDAE) - Super AMOLED 120Hz, Vision Booster
            c7: 9.0,  // Pós-Venda & Peças (EPST) - Samsung Brasil = RA1000, 6 anos updates
            c8: 9.0,  // Conectividade (CPI) - NFC, 5G, eSIM
            c9: 8.0,  // Armazenamento (AGD) - 128GB UFS, sem MicroSD
            c10: 8.0, // Recursos Úteis (IFM) - Galaxy AI, som estéreo, sem DeX
        },
        scoreReasons: {
            c1: 'Bateria de 5000mAh com Exynos 1580 eficiente. Carregador 45W incluso entrega 70% em 30min.',
            c2: 'One UI 7 limpo, sem bloatware. Samsung prometeu 6 anos de updates de sistema e segurança.',
            c3: 'Linha Galaxy A tem excelente retenção de valor no Brasil. Revenda facilitada.',
            c5: 'IP67 real (30min até 1m) + Gorilla Glass Victus+. Aguenta chuva e quedas leves.',
            c6: 'Super AMOLED 120Hz com Vision Booster para sol forte brasileiro. Top para tela nessa faixa.',
            c7: 'Samsung Brasil tem selo RA1000 e rede nacional de assistências autorizadas.',
        },
        voc: {
            averageRating: 4.8,
            totalReviews: 2835,
            oneLiner: 'O intermediário Samsung mais equilibrado de 2025',
            summary: 'O Galaxy A56 5G impressiona pela combinação de tela Super AMOLED de alta qualidade, bateria de longa duração e promessa de 6 anos de atualizações. Ideal para quem quer um Samsung com ótimo custo-benefício.',
            sources: [
                { name: 'Amazon BR', url: 'https://www.amazon.com.br/dp/B0DYVPJ8KZ', count: 2835 },
                { name: 'YouTube BR', url: 'https://youtube.com/results?search_query=galaxy+a56+review', count: 50 },
            ],
            pros: [
                'Tela AMOLED excelente, cores vibrantes',
                'Bateria dura o dia todo com folga',
                'Câmera noturna surpreendente',
                'Design premium, acabamento de vidro',
                'IP67 - pode usar na chuva tranquilo',
            ],
            cons: [
                'Sem carregador na caixa (cabo apenas)',
                'Exynos aquece um pouco em jogos pesados',
                'Não tem MicroSD',
            ],
        },
        badges: ['editors-choice'],
        offers: [
            {
                store: 'Amazon',
                storeSlug: 'amazon',
                price: 1845,
                url: 'https://www.amazon.com.br/dp/B0DYVPJ8KZ',
                affiliateUrl: 'https://amzn.to/galaxy-a56-5g',
                inStock: true,
                lastChecked: '2026-01-19',
            },
        ],
        lastUpdated: '2026-01-19',
        gallery: ['https://m.media-amazon.com/images/I/51lPd9IOAVL._AC_SL1200_.jpg'],
        featureBenefits: [
            { icon: 'Shield', title: 'IP67 Certificado', description: 'Resistente à água e poeira. Use na chuva sem medo.' },
            { icon: 'Battery', title: '5000mAh + 45W', description: 'Bateria que dura o dia. Carrega 70% em 30 minutos.' },
            { icon: 'Cpu', title: '6 Anos de Updates', description: 'Samsung promete atualizações até 2031. Investimento de longo prazo.' },
            { icon: 'MonitorSmartphone', title: 'Super AMOLED 120Hz', description: 'Tela vibrante visível até no sol forte brasileiro.' },
        ],
        mainCompetitor: {
            id: 'motorola-edge-50-neo',
            name: 'Motorola Edge 50 Neo',
            shortName: 'Edge 50 Neo',
            imageUrl: '/images/products/motorola-edge-50-neo.svg',
            price: 1999,
            score: 8.2,
            keyDifferences: [
                { label: 'Updates', current: '6 anos', rival: '4 anos', winner: 'current' },
                { label: 'Proteção', current: 'IP67', rival: 'IP68', winner: 'rival' },
                { label: 'Revenda', current: 'Alta (Samsung)', rival: 'Média', winner: 'current' },
            ],
        },
    },
];

// ============================================
// ALL PRODUCTS - Combined Export
// ============================================

export const ALL_PRODUCTS: Product[] = [
    ...SAMPLE_TVS,
    ...SAMPLE_FRIDGES,
    ...SAMPLE_AIR_CONDITIONERS,
    ...SAMPLE_ROBOT_VACUUMS,
    ...SAMPLE_SMARTWATCHES,
    ...SAMPLE_SMARTPHONES,
];

/**
 * Get products by category ID
 */
export function getProductsByCategory(categoryId: string): Product[] {
    return ALL_PRODUCTS.filter(p => p.categoryId === categoryId);
}

/**
 * Get a single product by ID
 */
export function getProductById(productId: string): Product | null {
    return ALL_PRODUCTS.find(p => p.id === productId) ?? null;
}
