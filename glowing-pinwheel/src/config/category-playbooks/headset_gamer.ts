/**
 * @file headset_gamer.ts
 * @description Playbook de critérios para Headsets Gamer importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+8+8+5+5+4 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const HEADSET_GAMER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'headset_gamer',
    displayName: 'Headsets Gamer',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Assinatura Sonora (Integridade Espectral)',
            weight: 0.20,
            painTriggers: [
                '"Curva em V" excessiva (Graves abafam passos)',
                'Som "Boomy" e lamacento',
                'Mascaramento auditivo em tiroteios',
            ],
            pleasureTriggers: [
                'Perfil Neutro/Flat (Alta fidelidade)',
                'Graves rápidos e secos',
                'Separação instrumental clara',
            ],
            implementationNotes: 'Filtro Competitivo: Se Uso = "FPS Competitivo" → ELIMINAR headsets com graves excessivos. Priorizar resposta neutra para ouvir passos.',
        },
        {
            scoreKey: 'c2',
            label: 'Precisão Espacial (Imaging)',
            weight: 0.15,
            painTriggers: [
                'Dependência de 7.1 Virtual (Distorce direção)',
                'Imagem difusa ("Zonas mortas" no áudio)',
                'Palco sonoro artificialmente amplo',
            ],
            pleasureTriggers: [
                'Imaging preciso (Direção exata angular)',
                'Estéreo puro de alta qualidade',
                'Palco sonoro controlado',
            ],
            implementationNotes: 'Posicionamento: Ignorar "7.1 Surround" na caixa. Avaliar precisão em estéreo. Imaging > Soundstage para competição.',
        },
        {
            scoreKey: 'c3',
            label: 'Integridade Estrutural',
            weight: 0.15,
            painTriggers: [
                'Dobradiças de plástico fino que racham',
                'Arco que quebra ao torcer',
                'Mecanismos complexos frágeis',
            ],
            pleasureTriggers: [
                'Garfos de metal (Alumínio/Aço)',
                'Polímeros reforçados',
                'Design simples e robusto',
            ],
            implementationNotes: 'Durabilidade: Monitorar relatos de "Quebra de Arco" no uso normal. Penalizar mistura de metal e plástico fraco.',
        },
        {
            scoreKey: 'c4',
            label: 'Ergonomia (Conforto)',
            weight: 0.10,
            painTriggers: [
                'Pressão excessiva (Dor em quem usa óculos)',
                'Couro sintético que esquenta e descasca',
                'Peso mal distribuído no topo da cabeça',
            ],
            pleasureTriggers: [
                'Almofadas de Tecido/Veludo (Respiráveis)',
                'Canais de alívio para óculos',
                'Baixa força de fixação (Clamping force)',
            ],
            implementationNotes: 'Biometria: Para uso prolongado (>4h), tecido é obrigatório no Brasil (Calor).',
        },
        {
            scoreKey: 'c5',
            label: 'Qualidade do Microfone',
            weight: 0.10,
            painTriggers: [
                'Crosstalk (Vaza som do jogo para o mic)',
                'Captação de ruído ambiente (Teclado mecânico)',
                'Voz robótica por compressão',
            ],
            pleasureTriggers: [
                'Isolamento de terra perfeito (Sem vazamento)',
                'Rejeição de ruído passiva (Cardióide)',
                'Som natural e claro',
            ],
            implementationNotes: 'Comunicação: Crosstalk é falha grave de projeto (Eliminatório). Valorizar microfone que não pega o teclado.',
        },
        {
            scoreKey: 'c6',
            label: 'Conectividade & Latência',
            weight: 0.08,
            painTriggers: [
                'Bluetooth com lag (>100ms)',
                'Interferência em dongle USB',
                'Cabo fixo (Se quebrar, perde o fone)',
            ],
            pleasureTriggers: [
                'RF 2.4GHz de baixa latência (<20ms)',
                'Cabo removível (P2 ou USB-C)',
                'Conexão estável sem quedas',
            ],
            implementationNotes: 'Velocidade: Para jogos, Bluetooth é inaceitável. Exigir 2.4GHz ou Cabo. Cabo removível aumenta a vida útil.',
        },
        {
            scoreKey: 'c7',
            label: 'Isolamento Acústico',
            weight: 0.08,
            painTriggers: [
                'Vazamento de som (Bleed) para o microfone',
                'Perda de graves por má vedação',
                'Isolamento passivo fraco',
            ],
            pleasureTriggers: [
                'Selo consistente com a pele',
                'Design fechado (Closed-back) eficiente',
                'Vedação que não depende da pressão',
            ],
            implementationNotes: 'Imersão: Fones fechados são padrão para evitar vazamento. Vedação ruim mata a resposta de graves.',
        },
        {
            scoreKey: 'c8',
            label: 'Software & Drivers',
            weight: 0.05,
            painTriggers: [
                'Software obrigatório instável (Bloatware)',
                'Conflito de drivers que causa estalos',
                'Perda de configurações',
            ],
            pleasureTriggers: [
                'Memória On-Board (Salva perfil no fone)',
                'Funcionamento "Plug and Play" sem soft',
                'Software leve e opcional',
            ],
            implementationNotes: 'Estabilidade: Penalizar dependência de softwares pesados (G Hub/Synapse) se instáveis.',
        },
        {
            scoreKey: 'c9',
            label: 'Manutenibilidade',
            weight: 0.05,
            painTriggers: [
                'Earpads proprietárias coladas',
                'Peças de reposição inexistentes',
            ],
            pleasureTriggers: [
                'Earpads universais ou fáceis de achar',
                'Cabos padrão de mercado',
                'Venda de peças oficiais',
            ],
            implementationNotes: 'Longevidade: Earpads vão descascar. Se não der para trocar, é descartável.',
        },
        {
            scoreKey: 'c10',
            label: 'Suporte & RMA',
            weight: 0.04,
            painTriggers: [
                'Garantia que exige envio internacional',
                'Demora no atendimento',
            ],
            pleasureTriggers: [
                'RMA Expresso no Brasil',
                'Troca rápida de produto',
                'Canal de suporte em PT-BR',
            ],
            implementationNotes: 'Segurança: Valorizar marcas com boa reputação de troca rápida (HyperX/Redragon).',
        },
    ],
};
