/**
 * Product Entry: liectroux-l200-robo-aspirador-3em1-app-alexa-google
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const liectroux_l200_robo_aspirador_3em1_app_alexa_google: Product = {
        id: 'liectroux-l200-robo-aspirador-3em1-app-alexa-google',
        categoryId: 'robot-vacuum',
        name: 'Robô Aspirador Liectroux L200 3 em 1 Aspira Varre Passa Pano Com Aplicativo Compatível Com Alexa e Google Bivolt',
        shortName: 'Liectroux L200',
        brand: 'Liectroux',
        model: 'L200',
        price: 1188.90,
        asin: 'B0CR1XQ15C',
        imageUrl: '/images/products/liectroux-l200.svg',
        status: 'published',
        benefitSubtitle: '3 em 1 com App + Alexa/Google + filtro HEPA por menos de R$ 1.200',

        // Scores calibrados via WAP W400 (navegação aleatória com Wi-Fi)
        // Liectroux L200: App + Voz OK, mas NÃO salva mapa e NÃO retoma
        scores: {
            c1: 3,  // Navegação & Mapeamento: aleatória, NÃO salva mapa, NÃO retoma
            c2: 7,  // Software & Conectividade: App + Alexa + Google (igual W400)
            c3: 5,  // Sistema de Mop: pano arrasto básico
            c4: 6,  // Engenharia de Escovas: escovas laterais + central
            c5: 9,  // Altura e Acessibilidade: 7.5cm slim (igual W400)
            c6: 5,  // Manutenibilidade: marca chinesa, menos suporte BR
            c7: 5,  // Bateria e Autonomia: 120min, SEM Recharge & Resume
            c8: 6,  // Acústica: estimado ~65dB
            c9: 5,  // Base de Carregamento: retorno automático, sem auto-esvaziar
            c10: 1, // Recursos de IA: nenhum
        },

        specs: {
            suctionPower: 1500,
            batteryCapacity: 2600,
            dustbinCapacity: 400,
            waterTankCapacity: 200,
            noiseLevel: 65,
            width: 30,
            height: 7.5,
            depth: 30,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'bristle',
        dockType: 'basic',
        obstacleDetection: 'bump-only',
        heightCm: 7.5,
        noiseDb: 65,
        runtimeMinutes: 120,
        batteryMah: 2600,
    },

        attributes: {

            brushType: 'bristle',
            navigationType: 'random',
            hasMop: true,
            mopType: 'pano-arrasto',
            hasAutoEmpty: false,
            hasMapping: false,
            hasNoGoZones: false,
            hasRechargeResume: false,
            hasAppControl: true,
            voiceAssistants: ['alexa', 'google'],
            wifiBand: '2.4ghz',
            batteryMah: 2600,
            chargingTimeHours: 4.0,
            runtimeMinutes: 120,
        },

        technicalSpecs: {
            suctionPower: 1500,
            power: 25,
            dustbinCapacity: '0.4L',
            waterTankCapacity: 200,
            mopType: 'Pano (função MOP)',
            filterType: 'HEPA',
            navigation: 'Navegação aleatória com sensores anticolisão/antiqueda',
            mapping: false,
            lidar: false,
            camera: false,
            obstacleDetection: 'Sensores anticolisão e antiqueda',
            runtime: '120 minutos',
            batteryCapacity: 2600,
            chargingTime: '4h',
            autoRecharge: true,
            rechargeResume: false,
            wifi: true,
            appControl: true,
            voiceControl: 'Alexa e Google Assistant',
            dockType: 'basic',
            autoEmpty: false,
            height: 7.5,
            diameter: 30,
            weight: 2.3,
            noiseLevel: '65 dB(A)',
            voltage: 'Bivolt',
        },

        scoreReasons: {
            c1: 'Navegação aleatória. NÃO salva mapa. NÃO retoma do ponto de interrupção.',
            c2: 'App completo + Alexa + Google Assistant. Agendamento por smartphone.',
            c3: 'Função MOP com pano arrasto. Manutenção leve, não esfrega manchas.',
            c4: 'Escovas laterais para cantos + escova central. Kit extra incluso.',
            c5: '7.5cm de altura. Passa sob móveis planejados brasileiros.',
            c6: 'Marca Liectroux (chinesa). Representante BR oficial, mas menos suporte.',
            c7: 'Autonomia de 120min. SEM Recharge & Resume — se parar, recomeça.',
            c8: 'Ruído estimado ~65dB. Motor convencional.',
            c9: 'Retorno automático à base após limpeza. Sem auto-esvaziamento.',
            c10: 'Sem recursos de IA. Apenas sensores básicos.',
        },

        painPointsSolved: [
            'Limpeza 3 em 1: aspira, varre e passa pano.',
            'Controle por app, voz (Alexa/Google) e remoto.',
            'Agendamento de limpeza pelo smartphone.',
            'Retorno automático à base.',
            'Filtro HEPA + kit extra incluso na caixa.',
        ],

        badges: ['budget-pick'],

        offers: [
            {
                store: 'Amazon.com.br',
                storeSlug: 'amazon',
                price: 1188.90,
                url: 'https://www.amazon.com.br/dp/B0CR1XQ15C',
                affiliateUrl: 'https://www.amazon.com.br/dp/B0CR1XQ15C',
                inStock: true,
                lastChecked: '2026-01-28',
            },
        ],

        lastUpdated: '2026-01-28',
        gallery: ['/images/products/liectroux-l200.svg'],

        featureBenefits: [
            { icon: 'smartphone', title: 'App + Voz', description: 'Controle via smartphone, Alexa e Google Assistant.' },
            { icon: 'sparkles', title: 'Filtro HEPA', description: 'Filtragem de 99.97% de partículas finas e alérgenos.' },
            { icon: 'battery', title: '120min autonomia', description: 'Bateria Li-ion com retorno automático à base.' },
            { icon: 'ruler', title: 'Slim 7.5cm', description: 'Passa sob sofás e camas. Kit extra incluso.' },
        ],

        mainCompetitor: {
            id: 'wap-robot-w400',
            name: 'WAP Aspirador de Pó Robô ROBOT W400 3 em 1',
            shortName: 'WAP W400',
            imageUrl: '/images/products/wap-robot-w400.svg',
            price: 1199.0,
            score: 5.35,
            keyDifferences: [
                { label: 'Filtro', current: 'HEPA', rival: 'Pano', winner: 'current' as const },
                { label: 'Suporte BR', current: 'Limitado', rival: 'Marca nacional', winner: 'rival' as const },
                { label: 'Preço', current: 'R$ 1.189', rival: 'R$ 1.199', winner: 'current' as const },
            ],
        },

        recommendedAccessory: {
            asin: 'B0CR1XQ15C-KIT',
            name: 'Kit de Reposição Liectroux L200 (Filtros HEPA + Escovas + Panos MOP)',
            shortName: 'Kit Reposição L200',
            price: 89.90,
            imageUrl: '/images/products/kit-reposicao-liectroux-l200.svg',
            reason: 'Filtros HEPA, escovas laterais e panos MOP. Troque a cada 3-6 meses.',
            affiliateUrl: 'https://www.amazon.com.br/s?k=liectroux+l200+filtro',
        },
    };
