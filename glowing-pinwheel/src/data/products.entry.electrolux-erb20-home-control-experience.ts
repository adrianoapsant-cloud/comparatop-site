/**
 * Product Entry: electrolux-erb20-home-control-experience
 * Extracted from products.ts for modular architecture
 */
import type { Product } from '@/types/category';

export const electrolux_erb20_home_control_experience: Product = {
        id: 'electrolux-erb20-home-control-experience',
        categoryId: 'robot-vacuum',
        name: 'Robô Aspirador de Pó Electrolux Home e Control Experience ERB20 Bivolt Preto e Cinza',
        shortName: 'Electrolux ERB20',
        brand: 'Electrolux',
        model: '3016ACG0002',
        price: 511.41,
        asin: 'B09SVS3DZM',
        imageUrl: '/images/products/electrolux-erb20.svg',
        status: 'published',
        benefitSubtitle: '3 em 1 (varre, aspira e passa pano) com controle remoto e perfil ultra slim 7cm',

        // Scores calibrados via WAP W400 (navegação aleatória budget)
        // ERB20 é MAIS limitado: SEM Wi-Fi/app (c2 muito baixo)
        scores: {
            c1: 4,  // Navegação & Mapeamento: aleatória com sensor antiqueda
            c2: 1,  // Software & Conectividade: SEM Wi-Fi/app, só controle remoto
            c3: 5,  // Sistema de Mop: pano arrasto básico
            c4: 6,  // Engenharia de Escovas: escovas laterais + central
            c5: 9,  // Altura e Acessibilidade: 7cm = melhor da categoria
            c6: 8,  // Manutenibilidade: Electrolux é marca forte no Brasil
            c7: 6,  // Bateria e Autonomia: 2.2h (132min)
            c8: 6,  // Acústica: ~70dB estimado
            c9: 4,  // Base de Carregamento: simples, sem auto-esvaziar
            c10: 1, // Recursos de IA: nenhum
        },

        specs: {
            suctionPower: 1500,
            batteryCapacity: 2600,
            dustbinCapacity: 400,
            waterTankCapacity: 0,
            noiseLevel: 70,
            width: 29,
            height: 7,
            depth: 29,
        },

    // Structured specs for scoring module
    structuredSpecs: {
        navigationType: 'random',
        mopType: 'static',
        brushType: 'suction-only',
        dockType: 'basic',
        obstacleDetection: 'bump-only',
        heightCm: 7,
        noiseDb: 70,
        runtimeMinutes: 132,
        batteryMah: 2600,
    },

        attributes: {

            brushType: 'suction-only',
            navigationType: 'random',
            hasMop: true,
            mopType: 'pano-arrasto',
            hasAutoEmpty: false,
            hasMapping: false,
            hasNoGoZones: false,
            hasRechargeResume: false,
            hasAppControl: false,
            voiceAssistants: [],
            wifiBand: 'none',
            batteryMah: 2600,
            chargingTimeHours: 4.0,
            runtimeMinutes: 132,
        },

        technicalSpecs: {
            suctionPower: 1500,
            power: 25,
            dustbinCapacity: '0.4L',
            waterTankCapacity: 0,
            mopType: 'Pano (função MOP)',
            filterType: 'Pano',
            navigation: 'Navegação aleatória com sensor antiqueda',
            mapping: false,
            lidar: false,
            camera: false,
            obstacleDetection: 'Sensor antiqueda',
            runtime: '2.2 horas',
            batteryCapacity: 2600,
            chargingTime: '4h',
            autoRecharge: true,
            rechargeResume: false,
            wifi: false,
            appControl: false,
            voiceControl: 'Não (controle remoto)',
            dockType: 'basic',
            autoEmpty: false,
            height: 7,
            diameter: 29,
            weight: 2.35,
            noiseLevel: '70 dB(A)',
            voltage: 'Bivolt (127V/220V)',
        },

        scoreReasons: {
            c1: 'Navegação aleatória sem mapeamento. Sensor antiqueda evita quedas.',
            c2: 'SEM Wi-Fi, SEM app, SEM Alexa/Google. Operação 100% via controle remoto.',
            c3: 'Função MOP com pano arrasto. Manutenção leve, não esfrega manchas.',
            c4: 'Escovas laterais para cantos + escova central de cerdas.',
            c5: '7cm de altura = melhor da categoria. Passa sob quase todos os móveis BR.',
            c6: 'Electrolux é marca forte no Brasil com rede de assistência.',
            c7: 'Autonomia de 2.2h (132min). Sem Recharge & Resume.',
            c8: 'Ruído estimado ~70dB. Motor convencional.',
            c9: 'Base de carregamento simples. Sem auto-esvaziamento.',
            c10: 'Sem recursos de IA. Apenas sensores básicos antiqueda.',
        },

        painPointsSolved: [
            'Limpeza 3 em 1: varre, aspira e passa pano.',
            'Controle remoto com modos pré-programados.',
            'Sensor antiqueda para escadas e desníveis.',
            'Perfil ultra slim (7cm) passa sob móveis baixos.',
            'Marca Electrolux com assistência técnica no Brasil.',
        ],

        badges: ['budget-pick'],

        offers: [
            {
                store: 'Amazon.com.br',
                storeSlug: 'amazon',
                price: 511.41,
                url: 'https://www.amazon.com.br/dp/B09SVS3DZM',
                affiliateUrl: 'https://www.amazon.com.br/dp/B09SVS3DZM',
                inStock: true,
                lastChecked: '2026-01-28',
            },
        ],

        lastUpdated: '2026-01-28',
        gallery: ['/images/products/electrolux-erb20.svg'],

        featureBenefits: [
            { icon: 'sparkles', title: 'Todos os tipos de piso', description: 'Limpeza em pisos frios, laminados, porcelanato e madeira.' },
            { icon: 'pawPrint', title: 'Pelos de pets', description: 'Captura pelos de animais de estimação.' },
            { icon: 'battery', title: 'Bateria de lítio', description: 'Autonomia de até 2.2 horas por carga.' },
            { icon: 'ruler', title: 'Ultra slim 7cm', description: 'O mais baixo da categoria. Passa sob móveis planejados.' },
        ],

        mainCompetitor: {
            id: 'wap-robot-w400',
            name: 'WAP Aspirador de Pó Robô ROBOT W400 3 em 1',
            shortName: 'WAP W400',
            imageUrl: '/images/products/wap-robot-w400.svg',
            price: 1199.0,
            score: 5.35,
            keyDifferences: [
                { label: 'Wi-Fi/App', current: 'Não', rival: 'Sim (Alexa/Google)', winner: 'rival' as const },
                { label: 'Altura', current: '7cm', rival: '7.5cm', winner: 'current' as const },
                { label: 'Preço', current: 'R$ 511', rival: 'R$ 1.199', winner: 'current' as const },
            ],
        },

        recommendedAccessory: {
            asin: 'B09SVS3DZM-KIT',
            name: 'Kit de Reposição Compatível Electrolux ERB20 (Escovas + Filtro + Pano)',
            shortName: 'Kit Reposição ERB20',
            price: 79.90,
            imageUrl: '/images/products/kit-reposicao-erb20.svg',
            reason: 'Escovas laterais, filtro e pano MOP. Troque a cada 3-6 meses.',
            affiliateUrl: 'https://www.amazon.com.br/s?k=kit+reposi%C3%A7%C3%A3o+electrolux+erb20',
        },
    };
