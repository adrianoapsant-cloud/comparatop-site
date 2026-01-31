/**
 * @file soundbar.ts
 * @description Playbook de critérios para Soundbars importado de "10 dores.txt"
 * 
 * Pesos: 25+15+15+10+10+8+8+5+2+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const SOUNDBAR_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'soundbar',
    displayName: 'Soundbars',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Inteligibilidade de Diálogos',
            weight: 0.25,
            painTriggers: [
                'Vozes abafadas em cenas de ação (Mixagem ruim)',
                'Falta de canal central físico (Sistema 2.0/2.1)',
                'Necessidade de usar legendas para entender a fala',
            ],
            pleasureTriggers: [
                'Canal Central Dedicado (3.0+)',
                'Recursos de DSP de Voz (Active Voice Amplifier/Clear Voice)',
                'Ajuste de volume independente do canal central',
            ],
            implementationNotes: 'Filtro de Clareza: Se Uso = "Filmes/Séries" → ELIMINAR sistemas 2.0/2.1. Exigir canal central físico para diálogos.',
        },
        {
            scoreKey: 'c2',
            label: 'Estabilidade HDMI (ARC/eARC)',
            weight: 0.15,
            painTriggers: [
                'Falhas de "Handshake" (TV não reconhece a barra)',
                'Perda de som aleatória que exige reset',
                'Incompatibilidade entre marcas (ex: TV LG + Barra Samsung)',
            ],
            pleasureTriggers: [
                'Protocolo eARC (Maior estabilidade e banda)',
                'Histórico de compatibilidade agnóstica (Sonos/Bose)',
                'Cabo HDMI de alta velocidade incluso',
            ],
            implementationNotes: 'Confiabilidade: Penalizar modelos com alto índice de falha de ARC no Reclame Aqui. eARC é o padrão de estabilidade.',
        },
        {
            scoreKey: 'c3',
            label: 'Sincronia Labial (Latência)',
            weight: 0.15,
            painTriggers: [
                'Atraso perceptível entre boca e voz (>60ms)',
                'Falta de ajuste fino de delay',
                'Bluetooth com lag inutilizável para vídeo',
            ],
            pleasureTriggers: [
                'Processamento de baixa latência nativo',
                'Ajuste de Audio Sync granular (ms)',
                'Modo de Jogo Automático (ALLM)',
            ],
            implementationNotes: 'Imersão: Se há relatos de "Lip Sync" ruim → Alerta Vermelho. Bluetooth só serve para música, não para TV.',
        },
        {
            scoreKey: 'c4',
            label: 'Instalação e Fios',
            weight: 0.10,
            painTriggers: [
                '"Wireless" que exige tomadas atrás do sofá (Surpresa)',
                'Barra que bloqueia o sensor da TV',
                'Falta de suporte de parede na caixa',
            ],
            pleasureTriggers: [
                'Clareza sobre tomadas necessárias (Mapeamento)',
                'Perfil baixo (Não tapa a TV)',
                'Kit de montagem completo incluso',
            ],
            implementationNotes: 'Logística: Exibir aviso gigante: "Requer X tomadas na sala". Alertar sobre fios de energia em caixas "sem fio".',
        },
        {
            scoreKey: 'c5',
            label: 'Imersão Atmos (Real vs. Virtual)',
            weight: 0.10,
            painTriggers: [
                'Atmos "Virtual" que só alarga o som (Sem altura)',
                'Caixas traseiras com volume muito baixo',
                'Falta de calibração de sala',
            ],
            pleasureTriggers: [
                'Drivers físicos Up-firing (5.1.2+)',
                'Calibração de Sala Automática (SpaceFit/AI Room)',
                'Caixas traseiras inclusas e potentes',
            ],
            implementationNotes: 'Expectativa: Diferenciar Atmos "Virtual" (Software) de Atmos "Real" (Hardware). Hardware ganha bônus.',
        },
        {
            scoreKey: 'c6',
            label: 'Integração de Ecossistema',
            weight: 0.08,
            painTriggers: [
                'Falta de menu na TV (Ajuste "às cegas")',
                'Controle remoto da TV não controla a barra',
                'Eco ao usar som da TV + Barra',
            ],
            pleasureTriggers: [
                'Q-Symphony (Samsung) / WOW Orchestra (LG)',
                'Menu de configurações integrado na TV',
                'Controle único via HDMI-CEC perfeito',
            ],
            implementationNotes: 'Sinergia: Se o usuário tem TV Samsung/LG → Recomendar barra da mesma marca para bônus de usabilidade.',
        },
        {
            scoreKey: 'c7',
            label: 'Espectro Sonoro (Graves)',
            weight: 0.08,
            painTriggers: [
                'Som "Boomy" (Grave abafa tudo)',
                'Subwoofer pequeno (< 6") que "sopra" em vez de bater',
                'Distorção em volume alto',
            ],
            pleasureTriggers: [
                'Equilíbrio Tonal (EQ Gráfico no App)',
                'Subwoofer de 8" ou mais',
                'Graves limpos sem distorção',
            ],
            implementationNotes: 'Qualidade: Tamanho do driver importa mais que Watts PMPO. Penalizar som desequilibrado.',
        },
        {
            scoreKey: 'c8',
            label: 'Conectividade de Vídeo (Pass-Through)',
            weight: 0.05,
            painTriggers: [
                'HDMI 2.0 que bloqueia 4K 120Hz do PS5',
                'Não passa HDR/Dolby Vision para a TV',
            ],
            pleasureTriggers: [
                'HDMI 2.1 Completo (4k/120Hz)',
                'Pass-Through de VRR e HDR10+',
                'Múltiplas entradas HDMI',
            ],
            implementationNotes: 'Gamer: Para donos de PS5/Xbox, HDMI 2.1 na barra é diferencial crítico se a TV tiver poucas portas.',
        },
        {
            scoreKey: 'c9',
            label: 'Interface e UX',
            weight: 0.02,
            painTriggers: [
                'Display de LEDs indecifrável (Código Morse)',
                'App lento e difícil de parear',
            ],
            pleasureTriggers: [
                'Display de Texto Frontal (Mostra volume/modo)',
                'App estável e intuitivo',
                'Controle remoto físico dedicado',
            ],
            implementationNotes: 'Usabilidade: Display de texto é essencial para saber o que está acontecendo (Volume/Fonte).',
        },
        {
            scoreKey: 'c10',
            label: 'Suporte e Longevidade',
            weight: 0.02,
            painTriggers: [
                'Bugs de firmware nunca corrigidos',
                'Dificuldade de devolução por arrependimento',
            ],
            pleasureTriggers: [
                'Histórico de updates de firmware',
                'Rede de assistência técnica de áudio',
                'Política de devolução clara',
            ],
            implementationNotes: 'Segurança: Valorizar marcas que corrigem bugs via software pós-lançamento.',
        },
    ],
};
