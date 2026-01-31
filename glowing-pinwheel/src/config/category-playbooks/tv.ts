/**
 * @file tv.ts
 * @description Playbook de critérios para Smart TVs importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+5+10+5+5+5 = 100% ✓
 */

export interface CriterionPlaybook {
    scoreKey: string;
    label: string;
    weight: number;
    painTriggers: string[];
    pleasureTriggers: string[];
    implementationNotes: string;
}

export interface CategoryPlaybook {
    categoryId: string;
    displayName: string;
    market: string;
    criteria: CriterionPlaybook[];
}

export const TV_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'tv',
    displayName: 'Smart TVs',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Confiabilidade & Longevidade',
            weight: 0.20,
            painTriggers: [
                'Histórico de "Vício Oculto" (Loop infinito/Tela Preta após 1 ano)',
                'Custo de reparo > 60% do valor da TV',
                'Controle remoto que para de carregar (Solar)',
            ],
            pleasureTriggers: [
                'Reputação de "Tanque de Guerra" (LG IPS antigas)',
                'Garantia estendida promocional inclusa',
                'Baixo índice de defeito recorrente no Reclame Aqui',
            ],
            implementationNotes: 'Índice de Sobrevivência: Se Modelo = "Sucessor de Linha Problemática" (Ex: Crystal TU/AU) → Alerta Amarelo. Penalizar modelos com falhas sistêmicas conhecidas.',
        },
        {
            scoreKey: 'c2',
            label: 'Contraste & Pretos',
            weight: 0.15,
            painTriggers: [
                'Preto acinzentado em sala escura (Painel IPS/ADS básico)',
                'Vazamento de luz (Light Bleed) nas bordas',
                'Blooming excessivo em legendas',
            ],
            pleasureTriggers: [
                'OLED (Preto Infinito)',
                'Mini LED com alto número de zonas',
                'Painel VA com Local Dimming eficaz',
            ],
            implementationNotes: 'Filtro de Ambiente: Se Sala = "Escura/Cinema" → Exigir VA, Mini LED ou OLED. IPS só é aceitável para ângulos largos em salas claras.',
        },
        {
            scoreKey: 'c3',
            label: 'Custo-Benefício Real',
            weight: 0.15,
            painTriggers: [
                'TV de entrada com preço de intermediária',
                '"Imposto de Marca" (Pagar caro só pelo logo)',
                'Obsolescência programada percebida',
            ],
            pleasureTriggers: [
                'Specs de topo de linha por preço médio (Ex: TCL C655/C755)',
                'QLED ao preço de LED comum',
            ],
            implementationNotes: 'Matemática da Compra: Calcular Pontos Técnicos / Preço Atual. Destacar "Melhor Compra" para modelos disruptivos.',
        },
        {
            scoreKey: 'c4',
            label: 'Desempenho em Sala Clara',
            weight: 0.10,
            painTriggers: [
                'Brilho baixo (< 300 nits) que vira espelho de dia',
                'Tela reflexiva sem tratamento',
            ],
            pleasureTriggers: [
                'Brilho alto (> 800 nits - Mini LED/Neo QLED)',
                'Tratamento antirreflexo eficaz',
            ],
            implementationNotes: 'Filtro Diurno: Se Uso = "TV Aberta de dia" → Recomendar Mini LED/QLED de alto brilho. Alertar sobre brilho limitado de OLEDs de entrada.',
        },
        {
            scoreKey: 'c5',
            label: 'Sistema & Fluidez',
            weight: 0.10,
            painTriggers: [
                'Interface lenta e travada (Hardware fraco para Google TV)',
                'Loja de apps limitada (Sistemas proprietários obscuros)',
                'Bugs constantes pós-update',
            ],
            pleasureTriggers: [
                'Sistema fluido e rápido (Processador Quad-Core real)',
                'Google TV em hardware robusto (Liberdade)',
                'Integração Casa Inteligente (Alexa/Google Home)',
            ],
            implementationNotes: 'Experiência de Uso: Penalizar TV lenta. O sistema é a alma da TV. Diferenciar Google TV "Lento" de Google TV "Rápido".',
        },
        {
            scoreKey: 'c6',
            label: 'Fluidez de Movimento (Gamer)',
            weight: 0.05,
            painTriggers: [
                '60Hz em TV cara',
                '"Motion Blur" excessivo',
                'VRR com flicker (cintilação) em jogos escuros',
            ],
            pleasureTriggers: [
                'Painel 120Hz/144Hz nativo',
                'HDMI 2.1 completo (4K@120Hz)',
                'Game Bar e Baixo Input Lag',
            ],
            implementationNotes: 'Segmentação Gamer: Se Uso = "PS5/Xbox Series" → Exigir 120Hz e HDMI 2.1. Bonificar 144Hz para PC Gamers.',
        },
        {
            scoreKey: 'c7',
            label: 'Suporte Pós-Venda',
            weight: 0.10,
            painTriggers: [
                'Recusa de garantia por "mau uso" sem prova',
                'Falta de peças de reposição',
                'Atendimento inexistente',
            ],
            pleasureTriggers: [
                'Nota alta no Reclame Aqui',
                'Rede de assistência capilar',
                'Suporte remoto eficiente',
            ],
            implementationNotes: 'Segurança: Valorizar marcas que resolvem problemas fora da garantia (Cortesia).',
        },
        {
            scoreKey: 'c8',
            label: 'Áudio & Integração',
            weight: 0.05,
            painTriggers: [
                'Som "de lata" (sem graves)',
                'Distorção em volume médio',
                'Diálogos inaudíveis',
            ],
            pleasureTriggers: [
                'Subwoofer integrado (2.1)',
                'Suporte a Dolby Atmos real',
                'Integração com Soundbar (Q-Symphony)',
            ],
            implementationNotes: 'Imersão: Se Áudio TV = Ruim → Recomendar Soundbar no pacote. Bonificar TVs que melhoram o som sozinhas.',
        },
        {
            scoreKey: 'c9',
            label: 'Upscaling (TV Aberta)',
            weight: 0.05,
            painTriggers: [
                'Imagem pixelada/borrada em canais HD/SD',
                'Artefatos de compressão visíveis',
            ],
            pleasureTriggers: [
                'Processador com IA (Upscaling nítido)',
                'Suavização de gradiente (Color Banding)',
            ],
            implementationNotes: 'Realidade Brasileira: A maioria vê conteúdo não-4K. O upscaling é vital para TV a cabo/aberta.',
        },
        {
            scoreKey: 'c10',
            label: 'Design & Construção',
            weight: 0.05,
            painTriggers: [
                'Construção de plástico frágil',
                'Pés instáveis',
                'Espessura que impede instalação rente',
            ],
            pleasureTriggers: [
                'Design AirSlim (Fino e elegante)',
                'Acabamento em metal',
                'Gestão de cabos inteligente',
            ],
            implementationNotes: 'Estética: Valorizar design funcional que facilita a instalação e organiza o ambiente.',
        },
    ],
};
