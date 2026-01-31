/**
 * @file monitor.ts
 * @description Playbook de critérios para Monitores importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+8+8+8+4+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const MONITOR_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'monitor',
    displayName: 'Monitores',
    market: 'Mercado Global/Brasil',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Clareza de Movimento (Motion Clarity)',
            weight: 0.20,
            painTriggers: [
                '1ms GtG com Overshoot massivo (Rastros inversos)',
                'Black Smearing em painéis VA baratos',
                'Ghosting visível a olho nu',
            ],
            pleasureTriggers: [
                'Tempo de resposta real < 5ms sem artefatos',
                'Backlight Strobing (DyAc/ELMB) bem implementado',
                'Painel OLED (Resposta instantânea)',
            ],
            implementationNotes: 'Filtro Gamer: Se Uso = "FPS Competitivo" → ELIMINAR VA barato. Priorizar OLED ou TN/IPS rápido. Ignorar "1ms" da caixa se reviews mostrarem overshoot.',
        },
        {
            scoreKey: 'c2',
            label: 'Contraste Real & Pretos',
            weight: 0.15,
            painTriggers: [
                'IPS Glow excessivo (Preto vira cinza no escuro)',
                'Contraste < 800:1 (Imagem lavada)',
                'Vazamento de luz (Backlight Bleed)',
            ],
            pleasureTriggers: [
                'OLED (Contraste Infinito)',
                'Painel VA de qualidade (> 3000:1)',
                'Mini-LED com FALD (> 500 zonas)',
            ],
            implementationNotes: 'Filtro de Ambiente: Se Sala = "Escura" → Recomendar VA ou OLED. Se Sala = "Clara" → IPS é aceitável.',
        },
        {
            scoreKey: 'c3',
            label: 'HDR Real vs. Fake',
            weight: 0.15,
            painTriggers: [
                'HDR400 sem Local Dimming (Imagem pior que SDR)',
                'Cores lavadas ao ativar HDR',
            ],
            pleasureTriggers: [
                'HDR1000 / True Black',
                'Local Dimming FALD real',
                'Pico de brilho > 800 nits',
            ],
            implementationNotes: 'Validação: Classificar HDR400 como "SDR com brilho alto". Só pontuar HDR se houver hardware de dimming.',
        },
        {
            scoreKey: 'c4',
            label: 'Densidade de Pixels (PPI)',
            weight: 0.10,
            painTriggers: [
                '1080p em 27" ou 32" (Pixelado/Texto serrilhado)',
                'Arranjo de subpixel não-RGB (Texto ruim)',
            ],
            pleasureTriggers: [
                '1440p em 27" (Sweet Spot)',
                '4K em 32"',
                'Alta densidade para leitura (> 109 PPI)',
            ],
            implementationNotes: 'Produtividade: Se Uso = "Trabalho/Texto" → Penalizar PPI baixo. 1080p só é aceitável até 24".',
        },
        {
            scoreKey: 'c5',
            label: 'Precisão de Cor',
            weight: 0.10,
            painTriggers: [
                'Cores neon/supersaturadas sem modo sRGB clamp',
                'Delta E > 3 (Cores erradas)',
                'Banding (Faixas de cor)',
            ],
            pleasureTriggers: [
                'Calibração de fábrica (Delta E < 2)',
                'Cobertura > 95% DCI-P3 ou AdobeRGB',
                'Modo sRGB funcional',
            ],
            implementationNotes: 'Criação: Para Designers, exigir cobertura de gamut e calibração. Para Gamers, aceitar saturação.',
        },
        {
            scoreKey: 'c6',
            label: 'Ergonomia Visual (Eye Care)',
            weight: 0.08,
            painTriggers: [
                'Uso de PWM (Tela pisca para baixar brilho)',
                'Brilho mínimo muito alto (> 80 nits)',
            ],
            pleasureTriggers: [
                'Flicker-Free (DC Dimming)',
                'Filtro de Luz Azul via Hardware (Não amarela a tela)',
                'Sensor de brilho automático',
            ],
            implementationNotes: 'Saúde: PWM é eliminatório para uso prolongado (Causa dor de cabeça).',
        },
        {
            scoreKey: 'c7',
            label: 'Conectividade (Power Delivery)',
            weight: 0.08,
            painTriggers: [
                'USB-C que só carrega celular (15W)',
                'HDMI antigo que limita Hz do console',
            ],
            pleasureTriggers: [
                'USB-C com PD > 65W (Carrega notebook)',
                'KVM Switch integrado',
                'HDMI 2.1 completo (4K/120Hz)',
            ],
            implementationNotes: 'Workstation: Se Uso = "MacBook/Laptop" → Exigir USB-C > 65W. Se Uso = "PS5" → Exigir HDMI 2.1.',
        },
        {
            scoreKey: 'c8',
            label: 'Garantia (Burn-in/Pixels)',
            weight: 0.08,
            painTriggers: [
                'Política que aceita muitos dead pixels (ISO Classe II)',
                'Garantia de OLED que não cobre burn-in',
            ],
            pleasureTriggers: [
                'Garantia Zero Bright Dot',
                '3 Anos contra Burn-in (OLED)',
                'Troca expressa',
            ],
            implementationNotes: 'Segurança: Valorizar marcas que cobrem burn-in explicitamente (Dell/MSI/Corsair).',
        },
        {
            scoreKey: 'c9',
            label: 'Formato e Imersão',
            weight: 0.04,
            painTriggers: [
                'Curvatura agressiva em tela 16:9 pequena (Distorce linhas)',
                'Ultrawide sem suporte em jogos competitivos',
            ],
            pleasureTriggers: [
                'Ultrawide 21:9 / 32:9 para produtividade',
                'Curvatura útil (1500R/1800R) em telas grandes',
            ],
            implementationNotes: 'Contexto: Curva só faz sentido em telas largas ou muito grandes.',
        },
        {
            scoreKey: 'c10',
            label: 'Latência (Input Lag)',
            weight: 0.02,
            painTriggers: [
                'Lag alto em 60Hz (Ruim para console)',
                'Processamento de imagem lento',
            ],
            pleasureTriggers: [
                'Latência total < 5ms',
                'Modo "Instant Game Response"',
            ],
            implementationNotes: 'Competitivo: Critério de desempate para Pro Players.',
        },
    ],
};
