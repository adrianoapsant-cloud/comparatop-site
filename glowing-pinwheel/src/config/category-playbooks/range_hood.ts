/**
 * @file range_hood.ts
 * @description Playbook de critérios para Coifas e Depuradores importado de "10 dores.txt"
 * 
 * Pesos: 20+18+15+10+10+10+7+5+3+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const RANGE_HOOD_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'range_hood',
    displayName: 'Coifas e Depuradores',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Eficiência Real de Captura',
            weight: 0.20,
            painTriggers: [
                'Falha no "Teste da Folha Sulfite" na velocidade 1',
                'Vazão nominal inflada (sem considerar filtro de carvão)',
                'Depurador Slim que "espalha" a fumaça',
            ],
            pleasureTriggers: [
                'Alta pressão estática (Segura o papel na vel. 1)',
                'Vazão > 900m³/h (Coifa Ilha)',
                'Design Piramidal (Copo de contenção de fumaça)',
            ],
            implementationNotes: 'Correção de Perda de Carga: Se Modo = "Depurador" → Reduzir Vazão Nominal em 30%. Se Fritura = "Frequente" → Exigir Vazão Corrigida > 600m³/h.',
        },
        {
            scoreKey: 'c2',
            label: 'Conforto Acústico',
            weight: 0.18,
            painTriggers: [
                'Ruído > 65dB (Inviável conversar/ver TV)',
                'Frequência aguda (Zumbido de ventoinha pequena)',
                'Vibração estrutural (Chocalho)',
            ],
            pleasureTriggers: [
                'Ruído < 55dB na velocidade de cruzeiro',
                'Duto de 150mm (Som grave de vento)',
                'Motor blindado silencioso',
            ],
            implementationNotes: 'Teste de Convivência: Se Cozinha = "Integrada/Americana" → Penalizar dB alto severamente. Diferenciar ruído de vento (aceitável) de ruído mecânico (ruim).',
        },
        {
            scoreKey: 'c3',
            label: 'Instalação & Infraestrutura',
            weight: 0.15,
            painTriggers: [
                'Coifa de Ilha fixada apenas no gesso (Balança)',
                'Exige tomada 20A sem aviso prévio',
                'Saída de ar incompatível (Redução de 150mm para 100mm)',
            ],
            pleasureTriggers: [
                'Kit de fixação robusto (Laje)',
                'Plugue padrão 10A ou aviso claro',
                'Adaptadores de duto inclusos',
            ],
            implementationNotes: 'Checklist de Obra: Alertar: "Verifique se seu teto suporta o peso". Avisar sobre diâmetro do furo na parede.',
        },
        {
            scoreKey: 'c4',
            label: 'Manutenção & Limpeza',
            weight: 0.10,
            painTriggers: [
                'Filtro de carvão proprietário difícil de achar',
                'Grade com parafusos que rasgam pano',
                'Acesso difícil à ventoinha',
            ],
            pleasureTriggers: [
                'Filtros "Dishwasher Safe" (Lava-louças)',
                'Filtro de carvão padrão universal',
                'Acabamento interno sem rebarbas cortantes',
            ],
            implementationNotes: 'TCO (Custo): Exibir preço anual dos filtros de reposição. Bonificar filtros metálicos laváveis robustos.',
        },
        {
            scoreKey: 'c5',
            label: 'Geometria & Dimensionamento',
            weight: 0.10,
            painTriggers: [
                'Coifa 60cm em Fogão 6 bocas (Fumaça escapa pelos lados)',
                'Vidro plano que não retém fumaça (Slim)',
            ],
            pleasureTriggers: [
                'Coifa mais larga que o fogão (90cm para fogão 60cm)',
                'Aba de vidro curvo (Direciona fluxo)',
                'Altura regulável da chaminé',
            ],
            implementationNotes: 'Regra da Largura: Se Fogão > Coifa → Alerta Vermelho: "Ineficiente". Recomendar Coifa = Largura Fogão + 30%.',
        },
        {
            scoreKey: 'c6',
            label: 'Segurança Material',
            weight: 0.10,
            painTriggers: [
                'Vidro que estoura com calor (Choque térmico)',
                'Acúmulo de gordura em motor aberto (Risco incêndio)',
                'Plástico perto do fogo',
            ],
            pleasureTriggers: [
                'Vidro Temperado Certificado com buchas de expansão',
                'Motor blindado e termostato de segurança',
                'Materiais ignífugos',
            ],
            implementationNotes: 'Prevenção: Monitorar relatos de "Vidro Estourado" no Reclame Aqui.',
        },
        {
            scoreKey: 'c7',
            label: 'Custo-Benefício',
            weight: 0.07,
            painTriggers: [
                'Depurador caro que funciona pior que um barato',
                'Lâmpadas halógenas (Gastam muito e esquentam)',
            ],
            pleasureTriggers: [
                'Iluminação LED eficiente',
                'Melhor vazão por Real investido',
            ],
            implementationNotes: 'Economia: Penalizar modelos com lâmpadas quentes sobre a cabeça do cozinheiro.',
        },
        {
            scoreKey: 'c8',
            label: 'Interface (HMI)',
            weight: 0.05,
            painTriggers: [
                'Touch que falha com mão engordurada/molhada',
                'Botões mecânicos frágeis (Quebram a mola)',
            ],
            pleasureTriggers: [
                'Botões físicos robustos ("Piano Keys")',
                'Touch capacitivo de alta sensibilidade',
                'Controle remoto (Acessibilidade)',
            ],
            implementationNotes: 'Usabilidade: Botão físico é mais confiável em ambiente de gordura que touch barato.',
        },
        {
            scoreKey: 'c9',
            label: 'Dualidade (Depurador)',
            weight: 0.03,
            painTriggers: [
                'Perda de vazão > 50% com filtro de carvão',
                'Retorno de odor pelas frestas da chaminé',
            ],
            pleasureTriggers: [
                'Modo Depurador eficiente projetado',
                'Saída de ar limpo direcionada longe do usuário',
            ],
            implementationNotes: 'Filtro de Uso: Só pontuar se usuário selecionar "Sem saída externa".',
        },
        {
            scoreKey: 'c10',
            label: 'Estética Funcional',
            weight: 0.02,
            painTriggers: [
                'Inox que mancha muito (Fingerprint magnet)',
                'Luz amarela que mascara ponto da carne',
            ],
            pleasureTriggers: [
                'Vidro Preto/Branco (Fácil limpeza)',
                'Luz LED neutra/fria (Mostra cor real)',
                'Design Slim real',
            ],
            implementationNotes: 'Visual: Priorizar facilidade de limpeza sobre beleza inicial.',
        },
    ],
};
