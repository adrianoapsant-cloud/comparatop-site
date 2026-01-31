/**
 * @file tablet.ts
 * @description Playbook de critérios para Tablets importado de "10 dores.txt"
 * 
 * NORMALIZADO: Soma original 77/100 → 100% (fator 1.2987)
 * Pesos originais: 10+9.5+9+8.5+8+7.5+7+6.5+6+5 = 77
 * Pesos normalizados para somar 100%
 */

import type { CategoryPlaybook } from './tv';

export const TABLET_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'tablet',
    displayName: 'Tablets',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Desempenho Real & Longevidade',
            weight: 0.1299, // Original 10/77 → Normalizado
            painTriggers: [
                'RAM < 4GB (Travamento fatal em Android 12+)',
                'CPUs de entrada (Unisoc T6xx, Helio A22, Chips genéricos)',
                'Histórico de "morte" por atualização (Ex: Tab A7 Lite)',
            ],
            pleasureTriggers: [
                'Chips Apple Silicon (Série M)',
                'Snapdragon Série 8 (Gen 1, 2, 3)',
                'Fluidez sustentada após 2+ anos',
            ],
            implementationNotes: 'Criar "Índice de Risco de Travamento": Se RAM < 4GB e SO != Android Go → Penalidade Máxima. Alertar sobre obsolescência programada em chips de entrada.',
        },
        {
            scoreKey: 'c2',
            label: 'Custo Real do Kit',
            weight: 0.1234, // Original 9.5/77 → Normalizado
            painTriggers: [
                'Preço oculto de acessórios essenciais (Apple Pencil + Capa = +R$ 2k)',
                'Upsell forçado de armazenamento (64GB → 256GB muito caro)',
            ],
            pleasureTriggers: [
                'Proposta "All-in-One" (Caneta e Capa inclusas na caixa)',
                'Custo-benefício do pacote completo (Ex: Linha Galaxy Tab S FE/Lite)',
            ],
            implementationNotes: 'Cálculo de "Custo Produtividade": Preço Final = Tablet + Caneta Oficial + Capa Básica. Bonificar dispositivos que incluem itens na caixa.',
        },
        {
            scoreKey: 'c3',
            label: 'Experiência Visual & Tela',
            weight: 0.1169, // Original 9/77 → Normalizado
            painTriggers: [
                'Tela não laminada (Gap de ar/Som oco/Paralaxe)',
                'Alto reflexo em leitura',
                'Painéis TFT com ângulos de visão pobres',
            ],
            pleasureTriggers: [
                'Tecnologia OLED/AMOLED (Contraste infinito)',
                'Taxa de atualização de 120Hz (Fluidez)',
                'Laminação total do display',
            ],
            implementationNotes: 'Penalidade de Construção: Se Preço > R$ 2.500 e Tela Não Laminada → Reduzir nota drasticamente.',
        },
        {
            scoreKey: 'c4',
            label: 'Software & Multitarefa',
            weight: 0.1104, // Original 8.5/77 → Normalizado
            painTriggers: [
                'Apps Android esticados/não otimizados (Instagram/X)',
                'iPadOS Stage Manager (Confuso/Desperdício de espaço)',
            ],
            pleasureTriggers: [
                'Samsung DeX (Modo Desktop real, Janelas flutuantes)',
                'Apps Pro exclusivos iPad (Procreate, GoodNotes)',
                'Sideloading/Emulação livre (Android)',
            ],
            implementationNotes: 'Segmentação por Perfil: Perfil Escritório/Estudo: Priorizar Samsung DeX. Perfil Arte/Design: Priorizar iPadOS.',
        },
        {
            scoreKey: 'c5',
            label: 'Bateria & Carregamento',
            weight: 0.1039, // Original 8/77 → Normalizado
            painTriggers: [
                'Tempo de recarga > 3h (Carregador incluso fraco)',
                'Drenagem alta em Standby (Sincronização mal otimizada)',
            ],
            pleasureTriggers: [
                'Autonomia real de dia inteiro (Chips eficientes)',
                'Carregamento rápido suportado E carregador rápido na caixa',
            ],
            implementationNotes: 'Avaliação de Mobilidade: Considerar velocidade de carga COM o acessório da caixa. Se suporta 45W mas vem com 15W → Alertar custo extra.',
        },
        {
            scoreKey: 'c6',
            label: 'Caneta & Escrita',
            weight: 0.0974, // Original 7.5/77 → Normalizado
            painTriggers: [
                'Sensação de "plástico no vidro" (baixa fricção)',
                'Carregamento complexo (Apple Pencil 1ª Ger)',
                'Canetas passivas/capacitivas (sem rejeição de palma)',
            ],
            pleasureTriggers: [
                'Tecnologia Wacom EMR (S Pen: Ponta emborrachada, sem bateria)',
                'Software nativo robusto (Samsung Notes gratuito)',
            ],
            implementationNotes: 'Classificação de Stylus: 1. EMR (Melhor) 2. Ativa Bluetooth (Boa) 3. Capacitiva (Ruim).',
        },
        {
            scoreKey: 'c7',
            label: 'Armazenamento',
            weight: 0.0909, // Original 7/77 → Normalizado
            painTriggers: [
                '32GB (Inutilizável) ou 64GB (Insuficiente para longo prazo)',
                'Dados do Sistema ocupando >20% do espaço (iPadOS)',
            ],
            pleasureTriggers: [
                'Slot para Cartão MicroSD (Expansão barata)',
                'Armazenamento base de 128GB ou mais',
            ],
            implementationNotes: 'Regra de Longevidade: Definir 128GB como "Mínimo Recomendado". Bonificar slot MicroSD.',
        },
        {
            scoreKey: 'c8',
            label: 'Suporte & Garantia',
            weight: 0.0844, // Original 6.5/77 → Normalizado
            painTriggers: [
                'Recusa sistemática de garantia (Ex: Telas Samsung trincadas)',
                'Importados sem peças/assistência no Brasil',
            ],
            pleasureTriggers: [
                'Garantia nacional de 12 meses',
                'Reputação "Ótimo" no Reclame Aqui',
            ],
            implementationNotes: 'Índice de Confiabilidade: Alertar ostensivamente: "Importado = Sem Garantia Oficial".',
        },
        {
            scoreKey: 'c9',
            label: 'Áudio & Multimídia',
            weight: 0.0779, // Original 6/77 → Normalizado
            painTriggers: [
                'Som Mono ou Estéreo bloqueado pelas mãos',
                'Ausência de entrada P2 (3.5mm) em modelos gamers',
            ],
            pleasureTriggers: [
                'Quad Speakers (4 falantes com rotação estéreo)',
                'Dolby Atmos real',
            ],
            implementationNotes: 'Teste de Imersão: Diferenciar Estéreo Simples (2 falantes) de Quad Estéreo. Valorizar P2 para perfis Gamer/Audiófilo.',
        },
        {
            scoreKey: 'c10',
            label: 'Conectividade & Família',
            weight: 0.0649, // Original 5/77 → Normalizado
            painTriggers: [
                'Custo extra do 5G/LTE (pouco uso real em tablets)',
                'Falta de GPS em iPads modelo Wi-Fi (Erro comum de compra)',
                'Controle parental fácil de burlar (Screen Time)',
            ],
            pleasureTriggers: [
                'Google Family Link (Controle robusto)',
                'Desempenho estável em jogos infantis (Roblox)',
            ],
            implementationNotes: 'Adequação Familiar: Recomendar versões Wi-Fi como padrão. ALERTA CRÍTICO: "iPad Wi-Fi não serve como GPS veicular".',
        },
    ],
};
