/**
 * @file tvbox.ts
 * @description Playbook de critérios para TV Box e Sticks
 * Pesos: 25+20+15+10+10+5+5+4+4+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const TVBOX_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'tvbox',
    displayName: 'TV Box e Sticks',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Estabilidade Térmica (Throttling)', weight: 0.25, painTriggers: ['Stick que trava após 1h de uso (Superaquecimento)', 'TV Box de plástico sem dissipador interno', 'Reinícios aleatórios no verão brasileiro'], pleasureTriggers: ['Dissipação térmica eficiente (Corpo maior ou metal)', 'Performance sustentada em 4K HDR', 'Recuperação rápida de throttling'], implementationNotes: 'Dispositivos pequenos atrás de TVs quentes morrem cedo.' },
        { scoreKey: 'c2', label: 'Certificação DRM (Widevine)', weight: 0.20, painTriggers: ['"Fake 4K" (Widevine L3) que só roda Netflix em SD (480p)', 'Imagem pixelada em TV grande', 'Apps de streaming que não abrem ou pedem mouse'], pleasureTriggers: ['Widevine L1 Certificado (HD/4K real)', 'Netflix/Prime Video nativos e licenciados', 'Suporte a Dolby Vision/Atmos real'], implementationNotes: 'Sem L1, o dispositivo é inútil para streaming oficial.' },
        { scoreKey: 'c3', label: 'Conectividade (Wi-Fi e Paredes)', weight: 0.15, painTriggers: ['Wi-Fi que cai atrás da TV (Bloqueio de sinal)', 'Falta de suporte a 5GHz', 'Antena PCB fraca em casas de alvenaria'], pleasureTriggers: ['Wi-Fi de longo alcance (MIMO)', 'Adaptador Ethernet incluso ou compatível', 'Reconexão automática rápida'], implementationNotes: 'Paredes de concreto matam o Wi-Fi.' },
        { scoreKey: 'c4', label: 'Ecossistema (IPTV/Sideload)', weight: 0.10, painTriggers: ['Sistema fechado (Roku) que bloqueia IPTV/APKs', 'Loja de apps limitada', 'Dificuldade de instalar apps externos'], pleasureTriggers: ['Android TV / Google TV / Fire OS (Permite APKs)', 'Facilidade de "Sideloading"', 'Compatibilidade com listas grandes (RAM > 2GB)'], implementationNotes: 'Se Uso = "IPTV/Apps Alternativos" → ELIMINAR Roku.' },
        { scoreKey: 'c5', label: 'Fluidez de Interface (RAM)', weight: 0.10, painTriggers: ['1GB de RAM (Lentidão extrema na navegação)', 'Travamento ao trocar de apps', 'Interface poluída com anúncios pesados'], pleasureTriggers: ['2GB de RAM ou mais (Padrão mínimo 2025)', 'Processador Quad-Core recente', 'Interface limpa ("Apps Only" mode)'], implementationNotes: '1GB de RAM é obsoleto. 2GB é o mínimo.' },
        { scoreKey: 'c6', label: 'Controle Remoto (Bluetooth)', weight: 0.05, painTriggers: ['Controle Infravermelho (Precisa apontar para a TV)', 'Falta de botões de volume/power da TV', 'Botões duros e barulhentos'], pleasureTriggers: ['Controle Bluetooth (Funciona de qualquer lugar)', 'HDMI-CEC funcional (Um controle para tudo)', 'Comandos de voz (Alexa/Google) ágeis'], implementationNotes: 'Controle IR escondido atrás da TV não funciona.' },
        { scoreKey: 'c7', label: 'Codecs Modernos (AV1)', weight: 0.05, painTriggers: ['Falta de decodificação AV1 (Gargalo no YouTube)', 'Alta carga de CPU em vídeos 4K'], pleasureTriggers: ['Decodificação AV1 via Hardware (Futuro garantido)', 'Reprodução suave de arquivos pesados (Remux)', 'Economia de dados em streaming'], implementationNotes: 'AV1 é o futuro do streaming.' },
        { scoreKey: 'c8', label: 'Armazenamento Real', weight: 0.04, painTriggers: ['"Erro de Espaço Insuficiente" constante (8GB lotado)', 'Armazenamento "Fake" (Diz 64GB, tem 4GB)', 'Impossibilidade de expandir'], pleasureTriggers: ['Armazenamento > 8GB ou expansível via OTG', 'Sistema que permite mover apps para pendrive', 'Cache de sistema otimizado'], implementationNotes: '8GB enche rápido com cache. Valorizar expansão USB.' },
        { scoreKey: 'c9', label: 'Segurança (Malware)', weight: 0.04, painTriggers: ['TV Box com Android modificado e root (Risco de botnet)', 'Apps bancários que não funcionam', 'Hardware reciclado de lixo eletrônico'], pleasureTriggers: ['Bootloader travado e seguro', 'Updates de segurança mensais', 'Marca confiável (Google/Amazon/Roku)'], implementationNotes: 'Box genérica pode roubar dados. Recomendar marcas oficiais.' },
        { scoreKey: 'c10', label: 'Custo-Benefício', weight: 0.02, painTriggers: ['TV Box pirata cara que dura 3 meses', 'Stick Premium com preço de Apple TV'], pleasureTriggers: ['Stick de entrada com Widevine L1 (Ex: Fire Stick Lite)', 'Melhor preço por ano de vida útil'], implementationNotes: 'O barato sai caro se não tiver DRM ou garantia.' },
    ],
};
