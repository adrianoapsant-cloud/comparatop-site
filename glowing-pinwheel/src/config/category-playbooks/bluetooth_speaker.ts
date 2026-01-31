/**
 * @file bluetooth_speaker.ts
 * @description Playbook de critérios para Caixas de Som Bluetooth importado de "10 dores.txt"
 * 
 * NORMALIZADO: Soma original 122% → 100% (fator 0.8197)
 * Pesos originais: 25+20+15+15+15+10+7+5+5+5 = 122%
 * Pesos normalizados: 20.49+16.39+12.30+12.30+12.30+8.20+5.74+4.10+4.10+4.10 = 100%
 */

import type { CategoryPlaybook } from './tv';

export const BLUETOOTH_SPEAKER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'bluetooth_speaker',
    displayName: 'Caixas de Som Bluetooth',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Fidelidade em Volume Máximo',
            weight: 0.2049, // Original 25% → Normalizado
            painTriggers: [
                'Som "magro" acima de 70% (DSP corta graves agressivamente)',
                'Distorção audível (clipping/racha o som)',
                'Agudos estridentes em festas',
            ],
            pleasureTriggers: [
                'Assinatura "V-Shape" controlada (Harman Target)',
                'Dispersão sonora ampla (360º ou guias de onda)',
                'Graves presentes mesmo no talo',
            ],
            implementationNotes: 'Teste de Festa: Se Uso = "Festa/Churrasco" → ELIMINAR caixas que cortam grave no máximo. Priorizar JBL PartyBox ou Sony XG pela estabilidade.',
        },
        {
            scoreKey: 'c2',
            label: 'Bateria Real (Autonomia)',
            weight: 0.1639, // Original 20% → Normalizado
            painTriggers: [
                'Autonomia < 4h em volume máximo (Marketing diz 20h a 50%)',
                'Desligamento súbito com picos de grave',
                'Bateria viciada em 1 ano',
            ],
            pleasureTriggers: [
                'Autonomia > 6h no talo',
                'Função Powerbank (Carrega celular)',
                'Gestão eficiente de energia (Sony)',
            ],
            implementationNotes: 'Realidade Energética: Exibir alerta: "Duração estimada no máximo: X horas". Penalizar promessas irreais de 24h que não se cumprem na prática.',
        },
        {
            scoreKey: 'c3',
            label: 'Durabilidade Extrema (IP67)',
            weight: 0.1230, // Original 15% → Normalizado
            painTriggers: [
                'Apenas IPX4 (Não aguenta areia/poeira)',
                'Porta de carga que oxida com maresia',
                'Tecido que acumula areia difícil de limpar',
            ],
            pleasureTriggers: [
                'Classificação IP67 (Poeira + Imersão)',
                'Tampa de vedação robusta nas portas',
                'Construção selada contra areia',
            ],
            implementationNotes: 'Filtro de Praia: Se Uso = "Praia" → Exigir IP67. IPX4 é risco de morte para a caixa. Valorizar materiais fáceis de lavar.',
        },
        {
            scoreKey: 'c4',
            label: 'Conectividade & Latência',
            weight: 0.1230, // Original 15% → Normalizado
            painTriggers: [
                'Latência alta em vídeos (Boca mexe depois do som)',
                'Falta de entrada Auxiliar (P2) para DJ/PC',
                'Pareamento estéreo instável que cai',
            ],
            pleasureTriggers: [
                'Entrada Auxiliar P2 (Latência Zero)',
                'Bluetooth 5.3 com modo vídeo',
                'Alcance de pareamento > 10m (JBL PartyBoost)',
            ],
            implementationNotes: 'Versatilidade: P2 é diferencial crítico para uso misto (PC/TV). Penalizar delay alto em vídeos.',
        },
        {
            scoreKey: 'c5',
            label: 'Suporte & Pós-Venda',
            weight: 0.1230, // Original 15% → Normalizado
            painTriggers: [
                'Garantia negada por "oxidação" em produto IP67',
                'Falta de peças de reposição no mercado',
                'Falsificações difíceis de identificar',
            ],
            pleasureTriggers: [
                'Rede de assistência ampla (JBL/Sony)',
                'Facilidade de reparo fora da garantia',
                'Verificação de autenticidade via App',
            ],
            implementationNotes: 'Segurança: Valorizar marcas com peças paralelas disponíveis (baterias/drivers).',
        },
        {
            scoreKey: 'c6',
            label: 'Potência Real "Anti-Churrasco"',
            weight: 0.0820, // Original 10% → Normalizado
            painTriggers: [
                'Compressão dinâmica agressiva (Som "bombeia")',
                'Volume insuficiente para área aberta',
                'Limitador que mata a música',
            ],
            pleasureTriggers: [
                'Pressão sonora (dB) alta e limpa',
                'Graves físicos ("Soco no peito")',
                'Baixa distorção harmônica (THD)',
            ],
            implementationNotes: 'Impacto: Ignorar Watts PMPO. Focar em dB e estabilidade. O som não pode oscilar sozinho.',
        },
        {
            scoreKey: 'c7',
            label: 'Usabilidade do App',
            weight: 0.0574, // Original 7% → Normalizado
            painTriggers: [
                'App que não conecta ou perde a caixa',
                'Equalizador limitado (Apenas Bass/Treble)',
                'Atualização de firmware que piora o som',
            ],
            pleasureTriggers: [
                'App estável e rápido',
                'EQ Gráfico de 5+ bandas',
                'Ajustes salvos na memória da caixa',
            ],
            implementationNotes: 'Controle: App instável é pior que nenhum app. Valorizar EQ personalizável real.',
        },
        {
            scoreKey: 'c8',
            label: 'Conexões Físicas (Karaokê/USB)',
            weight: 0.0410, // Original 5% → Normalizado
            painTriggers: [
                'Sem entrada de microfone em caixa de festa',
                'Sem leitura de Pen Drive (USB Playback)',
                'Pré-amplificador de mic ruim (Eco fixo)',
            ],
            pleasureTriggers: [
                'Entrada Mic/Guitarra com ganho independente',
                'USB para Pen Drive (DJ raiz)',
                'Controle de Eco/Reverb',
            ],
            implementationNotes: 'Festa Brasileira: Pen Drive e Karaokê são essenciais para o público "PartyBox".',
        },
        {
            scoreKey: 'c9',
            label: 'Design & Iluminação',
            weight: 0.0410, // Original 5% → Normalizado
            painTriggers: [
                'Luzes desincronizadas (Piscam aleatoriamente)',
                'Materiais que descascam ou ficam pegajosos',
                'Botões que afundam',
            ],
            pleasureTriggers: [
                'Show de luzes rítmico e personalizável',
                'Acabamento robusto (Metal/Borracha de qualidade)',
                'Alça de transporte ergonômica',
            ],
            implementationNotes: 'Estética: Luzes devem seguir a música, não ser apenas um pisca-pisca.',
        },
        {
            scoreKey: 'c10',
            label: 'Liquidez & Revenda',
            weight: 0.0408, // Original 5% → Normalizado (ajuste para totalizar 100%)
            painTriggers: [
                'Desvalorização rápida (>50% em 1 ano)',
                'Marca desconhecida difícil de vender usada',
            ],
            pleasureTriggers: [
                '"Cheque ao Portador" (JBL vende rápido)',
                'Alta procura no mercado de usados',
                'Valor residual alto',
            ],
            implementationNotes: 'Investimento: JBL é dinheiro na mão. Marcas de nicho (Bose/HK) demoram a vender.',
        },
    ],
};
