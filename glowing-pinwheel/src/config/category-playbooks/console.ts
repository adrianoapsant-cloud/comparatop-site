/**
 * @file console.ts
 * @description Playbook de critérios para Consoles importado de "10 dores.txt"
 * 
 * Pesos: 25+20+15+10+8+7+5+5+3+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const CONSOLE_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'console',
    displayName: 'Consoles',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Custo Total (TCO) & Assinatura',
            weight: 0.25,
            painTriggers: [
                'Assinatura cara sem lançamentos "Day One" (PS Plus Premium)',
                'Custo anual de serviço > R$ 1.000 sem retorno claro',
                'Jogos avulsos R$ 350+ obrigatórios',
            ],
            pleasureTriggers: [
                'Game Pass Ultimate (Day One incluso)',
                'Possibilidade de conversão barata de assinatura',
                'Catálogo retrocompatível gratuito',
            ],
            implementationNotes: 'Economia de Guerra: Calcular "Custo 1º Ano" (Console + Assinatura + 3 Jogos). Bonificar quem oferece lançamentos na assinatura.',
        },
        {
            scoreKey: 'c2',
            label: 'Barreira de Entrada (Hardware)',
            weight: 0.20,
            painTriggers: [
                'Preço inicial > R$ 4.500 (PS5 Pro/PC High-End)',
                'Exigência de TV 4K 120Hz para notar diferença',
            ],
            pleasureTriggers: [
                'Console de entrada acessível (Series S < R$ 2.500)',
                'Bom desempenho em TVs 1080p/4K básicas',
            ],
            implementationNotes: 'Acessibilidade: Se Orçamento = "Limitado" → Recomendar Series S como campeão. Se Orçamento = "Livre" → PS5 com Disco.',
        },
        {
            scoreKey: 'c3',
            label: 'Liquidez & Mídia Física',
            weight: 0.15,
            painTriggers: [
                'Console 100% Digital (Dinheiro a fundo perdido)',
                'Jogos digitais sem reembolso/troca',
            ],
            pleasureTriggers: [
                'Leitor de Disco (Permite revenda/troca)',
                'Mercado de usados aquecido (Jogos Nintendo)',
                'Valor de revenda do console estável',
            ],
            implementationNotes: 'Proteção de Ativo: Alertar: "Console Digital impede revenda de jogos". Valorizar Nintendo pela baixa desvalorização dos cartuchos.',
        },
        {
            scoreKey: 'c4',
            label: 'Exclusivos & Relevância',
            weight: 0.10,
            painTriggers: [
                'Falta de exclusivos de peso ("System Sellers")',
                'Lançamentos bugados ou adiados',
            ],
            pleasureTriggers: [
                'Franquias Culturais (Mario, Zelda, God of War)',
                'Localização PT-BR de alta qualidade (Dublagem)',
            ],
            implementationNotes: 'Fator Emocional: Para "Famílias", Nintendo é imbatível. Para "Cinema em Casa", Sony lidera.',
        },
        {
            scoreKey: 'c5',
            label: 'Latência & Servidores BR',
            weight: 0.08,
            painTriggers: [
                'Ping > 80ms (Servidores apenas nos EUA)',
                'Roteamento ruim de operadoras locais',
            ],
            pleasureTriggers: [
                'Servidores dedicados em SP (Azure/AWS)',
                'Suporte a Cloud Gaming estável no Brasil',
            ],
            implementationNotes: 'Competitivo: Se Uso = "FPS Online" → Verificar infraestrutura local do jogo/plataforma.',
        },
        {
            scoreKey: 'c6',
            label: 'Pós-Venda & Garantia',
            weight: 0.07,
            painTriggers: [
                '"Mercado Cinza" sem garantia (Steam Deck)',
                'Drift de controle recorrente sem recall',
                'Burocracia na troca de console defeituoso',
            ],
            pleasureTriggers: [
                'Garantia Nacional Oficial (1 ano)',
                'Troca rápida de hardware (Microsoft)',
                'Assistência técnica oficial acessível',
            ],
            implementationNotes: 'Risco: Steam Deck/Rog Ally importados devem ter alerta vermelho de "Sem Garantia".',
        },
        {
            scoreKey: 'c7',
            label: 'Social & Compartilhamento',
            weight: 0.05,
            painTriggers: [
                'Dificuldade em dividir conta (Game Share bloqueado)',
                'Falta de jogos locais (Split-screen)',
            ],
            pleasureTriggers: [
                'Compartilhamento de conta fácil ("Pai e Filho")',
                'Foco em Multiplayer Local (Nintendo)',
                'Cross-play ativo',
            ],
            implementationNotes: 'Economia Compartilhada: Valorizar sistemas que permitem dividir a conta digital com um amigo.',
        },
        {
            scoreKey: 'c8',
            label: 'Expansão de Armazenamento',
            weight: 0.05,
            painTriggers: [
                'Expansão proprietária caríssima (Cartão Xbox Seagate)',
                'SSD soldado ou difícil de trocar',
            ],
            pleasureTriggers: [
                'Slot M.2 padrão PC (PS5 - barato e fácil)',
                'Suporte a HD Externo para jogos antigos',
            ],
            implementationNotes: 'Longevidade: Penalizar Xbox Series pela memória proprietária cara. Bonificar PS5 pela liberdade do M.2.',
        },
        {
            scoreKey: 'c9',
            label: 'Portabilidade Real',
            weight: 0.03,
            painTriggers: [
                '"Portátil" que depende de Wi-Fi perfeito (PS Portal)',
                'Bateria < 2h em jogos AAA',
                'Risco de roubo em transporte público (Switch)',
            ],
            pleasureTriggers: [
                'Híbrido real (Dock + Portátil)',
                'Tela OLED (Visibilidade)',
                'Modo Offline robusto',
            ],
            implementationNotes: 'Mobilidade: Diferenciar "Portátil de Casa" (Portal) de "Portátil de Rua" (Switch/Deck).',
        },
        {
            scoreKey: 'c10',
            label: 'Multimídia',
            weight: 0.02,
            painTriggers: [
                'Falta de apps de streaming nativos',
                'Sem suporte a Dolby Vision/Atmos',
            ],
            pleasureTriggers: [
                'Media Center completo (4K Blu-ray, Plex, Kodi)',
                'Integração com Smart Home',
            ],
            implementationNotes: 'Extras: Critério de desempate apenas.',
        },
    ],
};
