/**
 * @file security_camera.ts
 * @description Playbook de critérios para Câmeras de Segurança
 * Pesos: 20+15+15+10+10+10+5+5+5+5 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const SECURITY_CAMERA_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'security_camera',
    displayName: 'Câmeras de Segurança',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Resiliência de Conectividade', weight: 0.20, painTriggers: ['Câmera que exige reinício físico após queda de Wi-Fi', 'Suporte exclusivo a 2.4GHz antigo', 'Dependência de Plugin ActiveX/IE'], pleasureTriggers: ['"Watchdog" interno (Reinício automático)', 'Dual Band (2.4/5GHz)', 'Visualização HTML5 nativa'], implementationNotes: 'Se a câmera trava quando o roteador reinicia → ELIMINAR para uso em casas de veraneio.' },
        { scoreKey: 'c2', label: 'Integridade de Armazenamento', weight: 0.15, painTriggers: ['Falha silenciosa na gravação por movimento', 'Corrupção de cartão SD após queda de energia', 'Sobrescrita burra'], pleasureTriggers: ['Redundância Híbrida (SD + FTP/NAS/Nuvem)', 'Função ANR', 'Suporte a RTSP'], implementationNotes: 'Se depende 100% de Nuvem Paga → Alertar Custo Recorrente.' },
        { scoreKey: 'c3', label: 'Precisão de Detecção (IA)', weight: 0.15, painTriggers: ['Detecção por pixel (Chuva/Inseto = Alarme Falso)', '"Fadiga de Alerta"', 'Perda de alvo rápido no Auto-Tracking'], pleasureTriggers: ['Detecção de Humano/Veículo na borda (Edge AI)', 'Linha Virtual confiável', 'Auto-Tracking com retorno preciso'], implementationNotes: 'Exigir IA para evitar alertas de insetos.' },
        { scoreKey: 'c4', label: 'Desempenho Noturno/Óptico', weight: 0.10, painTriggers: ['Zoom Digital vendido como Óptico', 'IR que atrai insetos/aranhas', 'Ghosting noturno'], pleasureTriggers: ['Zoom Óptico Real', 'Sensor Starvis/ColorVu', 'Holofote inteligente'], implementationNotes: 'Diferenciar Zoom Digital de Zoom Óptico.' },
        { scoreKey: 'c5', label: 'Robustez & IP Rating', weight: 0.10, painTriggers: ['Condensação interna', 'Engrenagens de plástico no PTZ', 'Entrada de água'], pleasureTriggers: ['Válvula de respiro (Gore)', 'PTZ com mecanismo de metal', 'Proteção IP66/67 real'], implementationNotes: 'Se Externo → Exigir IP66/67 real.' },
        { scoreKey: 'c6', label: 'Interoperabilidade (ONVIF)', weight: 0.10, painTriggers: ['Ecossistema Fechado', 'ONVIF parcial'], pleasureTriggers: ['ONVIF Profile S/T completo', 'RTSP Aberto', 'Liberdade de software (Blue Iris)'], implementationNotes: 'Penalizar marcas que bloqueiam acesso a sistemas de terceiros.' },
        { scoreKey: 'c7', label: 'Usabilidade do App (UX)', weight: 0.05, painTriggers: ['App genérico instável', 'Lentidão no P2P', 'Dificuldade de exportar vídeo'], pleasureTriggers: ['App proprietário estável', 'Carregamento instantâneo', 'Timeline fluida'], implementationNotes: 'O App É o produto.' },
        { scoreKey: 'c8', label: 'Áudio Bidirecional', weight: 0.05, painTriggers: ['Half-Duplex', 'Volume baixo inaudível', 'Ruído/Microfonia'], pleasureTriggers: ['Full-Duplex', 'Cancelamento de Eco (AEC)', 'Sirene/Voz alta'], implementationNotes: 'Full-Duplex é essencial para portaria remota.' },
        { scoreKey: 'c9', label: 'Rastreamento (Auto-Tracking)', weight: 0.05, painTriggers: ['Câmera que "se perde"', 'Rastreamento lento'], pleasureTriggers: ['Retorno automático ao Preset', 'Rastreamento tenaz'], implementationNotes: 'Só recomendar se tiver "Retorno Automático".' },
        { scoreKey: 'c10', label: 'Suporte & TCO (Custo)', weight: 0.05, painTriggers: ['Custo oculto de nuvem obrigatória', 'Marca "White Label" sem suporte'], pleasureTriggers: ['Suporte técnico nacional', 'Custo Total claro'], implementationNotes: 'Valorizar marcas com representação no Brasil.' },
    ],
};
