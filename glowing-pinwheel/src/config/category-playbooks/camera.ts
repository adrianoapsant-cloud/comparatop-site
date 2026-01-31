/**
 * @file camera.ts
 * @description Playbook de critérios para Câmeras Digitais importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+10+5+5+5+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const CAMERA_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'camera',
    displayName: 'Câmeras Digitais',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Gestão Térmica (Vídeo)',
            weight: 0.20,
            painTriggers: [
                'Desligamento por calor em < 45 min (4K)',
                'Limite de software arbitrário (Ex: Canon R50 com 30 min)',
                'Dependência de "hacks" (abrir porta da bateria)',
            ],
            pleasureTriggers: [
                'Ventoinha ativa integrada (Ex: FX30, R5C)',
                'Gravação ilimitada real em 4K 60p',
                'Dissipação passiva robusta (corpo de magnésio)',
            ],
            implementationNotes: 'Teste de Estresse: Se Uso = "Vídeo/Streaming" → ELIMINAR modelos de plástico sem dissipação. Alertar: "Risco de superaquecimento em lives longas".',
        },
        {
            scoreKey: 'c2',
            label: 'Suporte & Garantia Brasil',
            weight: 0.15,
            painTriggers: [
                'Marca sem representação oficial (Nikon no Brasil)',
                'Dependência exclusiva de "Mercado Cinza"',
                'Falta de peças de reposição locais',
            ],
            pleasureTriggers: [
                'Presença Oficial (Canon/Sony Brasil)',
                'Rede de assistência técnica autorizada',
                'Garantia válida em território nacional',
            ],
            implementationNotes: 'Filtro Geoeconômico: Se Local = "Brasil" e Uso = "Profissional" → Penalizar Nikon severamente (Risco de ficar sem ferramenta de trabalho).',
        },
        {
            scoreKey: 'c3',
            label: 'Ecossistema de Lentes (TCO)',
            weight: 0.15,
            painTriggers: [
                'Mount fechado/restritivo (Canon RF APS-C até 2023)',
                'Lentes de kit escuras sem opção de upgrade barato',
                'Ausência de marcas terceiras (Sigma/Tamron)',
            ],
            pleasureTriggers: [
                'Mount Aberto (Sony E-Mount)',
                'Disponibilidade de "Trio de Primes" barato (Sigma/Viltrox)',
                'Mercado de usados líquido',
            ],
            implementationNotes: 'Cálculo de Custo Real: Custo Total = Corpo + Lente Prime f/1.4. Bonificar sistemas onde a lente é barata e de alta qualidade.',
        },
        {
            scoreKey: 'c4',
            label: 'Sensor: Rolling Shutter',
            weight: 0.10,
            painTriggers: [
                'Efeito "Gelatina" severo em 4K (Leitura > 25ms)',
                'Inviável para panning/esportes no modo eletrônico',
            ],
            pleasureTriggers: [
                'Sensor Stacked (Leitura < 5ms)',
                'Recorte (Crop) que melhora a leitura',
                'Obturador Mecânico robusto como backup',
            ],
            implementationNotes: 'Análise de Movimento: Se Uso = "Esporte/Ação" → Exigir Sensor Rápido ou Obturador Mecânico. Penalizar câmeras lentas para vídeo dinâmico.',
        },
        {
            scoreKey: 'c5',
            label: 'Autofoco (Rastreamento)',
            weight: 0.10,
            painTriggers: [
                'Foco por contraste apenas (Pulsante)',
                'Perda de rastreamento em vídeo (Hunt)',
                'Detecção de olhos falha em perfis de lado',
            ],
            pleasureTriggers: [
                'Real-time Tracking (Sony) / Dual Pixel II (Canon)',
                'Detecção de sujeitos IA (Animais/Veículos)',
                'Confiança "Sticky" em vídeo',
            ],
            implementationNotes: 'Nível de Confiança: Para iniciantes/vloggers, o AF perfeito é mandatório. Penalizar sistemas antigos que exigem foco manual.',
        },
        {
            scoreKey: 'c6',
            label: 'Ergonomia & Interface',
            weight: 0.10,
            painTriggers: [
                'Grip inexistente (fadiga com lentes grandes)',
                'Menu confuso sem touch (Sony antigo)',
                'Falta de botões customizáveis',
            ],
            pleasureTriggers: [
                'Menu Tátil Intuitivo (Canon)',
                'Joystick de foco dedicado',
                'Empunhadura profunda e confortável',
            ],
            implementationNotes: 'Teste de Usabilidade: Avaliar a "Carga Cognitiva" para mudar ISO/Obturador. Bonificar interfaces amigáveis para iniciantes.',
        },
        {
            scoreKey: 'c7',
            label: 'Conectividade (Streaming)',
            weight: 0.05,
            painTriggers: [
                'Webcam USB limitada a 720p ou com delay',
                'App móvel instável que não conecta',
                'Saída HDMI Micro (frágil)',
            ],
            pleasureTriggers: [
                'Webcam 4K via USB-C (UVC/UAC) Plug & Play',
                'App estável para transferência rápida',
                'HDMI Full Size (Tipo A)',
            ],
            implementationNotes: 'Integração Digital: Se Uso = "Live/Webcam", a qualidade USB é crítica. Penalizar portas frágeis que quebram fácil.',
        },
        {
            scoreKey: 'c8',
            label: 'Ciência de Cor (SOOC)',
            weight: 0.05,
            painTriggers: [
                'Tons de pele artificiais em JPEG direto da câmera',
                'Falta de perfis Log (10-bit) para vídeo',
            ],
            pleasureTriggers: [
                'Simulação de Filme (Fujifilm)',
                'Perfis Log robustos (S-Log3 / C-Log3)',
                'Cores agradáveis sem edição',
            ],
            implementationNotes: 'Fluxo de Trabalho: Se Usuário = "Não edita" → Recomendar Fujifilm/Canon. Se Usuário = "Colorista" → Exigir 10-bit 4:2:2.',
        },
        {
            scoreKey: 'c9',
            label: 'Controle de Qualidade',
            weight: 0.05,
            painTriggers: [
                'Hot Pixels em vídeo (sem pixel mapping)',
                'Vedação precária (poeira no sensor)',
                'Variação de montagem (desalinhamento)',
            ],
            pleasureTriggers: [
                'Pixel Mapping eficaz via software',
                'Construção Weather Sealed real',
            ],
            implementationNotes: 'Risco de Limão: Alertar sobre a necessidade de verificar o sensor em câmeras usadas.',
        },
        {
            scoreKey: 'c10',
            label: 'Liquidez & Revenda',
            weight: 0.05,
            painTriggers: [
                'Sistema de nicho (M4/3, Pentax) com baixa procura',
                'Desvalorização acelerada',
            ],
            pleasureTriggers: [
                'Alta Liquidez (Sony/Canon Full Frame)',
                'Mercado de usados ativo e valorizado',
            ],
            implementationNotes: 'Estratégia Financeira: Recomendar marcas líderes para quem planeja upgrade futuro.',
        },
    ],
};
