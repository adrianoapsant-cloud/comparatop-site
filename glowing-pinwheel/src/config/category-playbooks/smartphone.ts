/**
 * @file smartphone.ts
 * @description Playbook de critérios para Smartphones importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+8+8+7+5+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const SMARTPHONE_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'smartphone',
    displayName: 'Smartphones',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Autonomia Real (IARSE)',
            weight: 0.20,
            painTriggers: [
                'Bateria que não dura até o final do dia (Ex: Exynos antigo)',
                'Aquecimento excessivo em uso 5G/GPS',
                'Carregamento lento (> 1h30) sem carregador na caixa',
            ],
            pleasureTriggers: [
                'Eficiência Energética (Snapdragon série 7/8 eficiente)',
                'Carregador Rápido incluso na caixa (> 30W)',
                'Autonomia > 1.5 dias de uso misto',
            ],
            implementationNotes: 'Teste de Drenagem: Ignorar mAh puros. Avaliar "Tempo de Tela". Se o aparelho aquece e drena rápido no 4G → ELIMINAR recomendação para uso na rua/trabalho.',
        },
        {
            scoreKey: 'c2',
            label: 'Estabilidade de Software (ESMI)',
            weight: 0.15,
            painTriggers: [
                'Bugs críticos pós-update (Ex: HyperOS inicial/One UI lento)',
                'Publicidade nativa no sistema (Adware)',
                'Bloatware excessivo não removível',
            ],
            pleasureTriggers: [
                'Interface Fluida (Pixel/Moto/One UI otimizada)',
                'Política de Updates clara (4 anos+)',
                'Ausência de bugs de sensor de proximidade',
            ],
            implementationNotes: 'Confiabilidade: Penalizar marcas que usam o usuário como beta tester. Bonificar sistemas limpos sem propaganda.',
        },
        {
            scoreKey: 'c3',
            label: 'Custo-Benefício & Revenda (RCBIRV)',
            weight: 0.15,
            painTriggers: [
                'Alta desvalorização em 6 meses (Flagships Android de nicho)',
                '"White Label" rebatizado (Positivo/Multilaser) sem valor de revenda',
            ],
            pleasureTriggers: [
                'Alta Retenção de Valor (iPhone/Galaxy S/A populares)',
                'Liquidez de revenda rápida',
                'Preço de lançamento justo',
            ],
            implementationNotes: 'Matemática Financeira: Calcular TCO (Preço Compra - Preço Revenda Estimado). Alertar sobre "Dinheiro Perdido" em marcas sem mercado secundário.',
        },
        {
            scoreKey: 'c4',
            label: 'Câmera Social (QFSR)',
            weight: 0.10,
            painTriggers: [
                'Qualidade ruim dentro do Instagram/TikTok (Pixelado)',
                'Inconsistência de cor entre lentes (Ultrawide vs Principal)',
                'Vídeo tremido ou sem 4K (em intermediários)',
            ],
            pleasureTriggers: [
                'Integração nativa com Apps Sociais (iOS/Samsung S)',
                'Estabilização Óptica (OIS) real',
                'Fotos noturnas rápidas (Shutter lag baixo)',
            ],
            implementationNotes: 'Teste do Story: Se o foco é Rede Social → Priorizar iPhone ou Samsung S. Penalizar câmeras de 200MP que travam ao tirar foto.',
        },
        {
            scoreKey: 'c5',
            label: 'Resiliência Física (RFCT)',
            weight: 0.10,
            painTriggers: [
                'Vidro traseiro frágil sem proteção',
                'Falta de certificação IP em aparelho caro',
                'Risca fácil',
            ],
            pleasureTriggers: [
                'Proteção IP67/IP68 (Mergulho)',
                'Acabamento em Couro Vegano/Polímero (Não quebra)',
                'Gorilla Glass Victus/5',
            ],
            implementationNotes: 'Durabilidade: Se Uso = "Desastrado/Rua" → Exigir IP67+ e indicar materiais resistentes a queda.',
        },
        {
            scoreKey: 'c6',
            label: 'Qualidade de Tela (QDAE)',
            weight: 0.08,
            painTriggers: [
                'Brilho baixo que some no sol (< 800 nits)',
                'Tela 60Hz em aparelho > R$ 1.500',
                'IPS LCD com vazamento de luz',
            ],
            pleasureTriggers: [
                'Brilho Alto (> 1000 nits HBM)',
                '120Hz OLED/AMOLED Fluido',
                'PWM Dimming (Conforto ocular)',
            ],
            implementationNotes: 'Visibilidade: Testar legibilidade sob sol forte (Brasil). Penalizar telas escuras.',
        },
        {
            scoreKey: 'c7',
            label: 'Pós-Venda & Peças (EPST)',
            weight: 0.08,
            painTriggers: [
                'Importado "Grey Market" sem garantia no Brasil',
                'Falta de peças de reposição (Tela/Bateria)',
                'Assistência técnica inexistente',
            ],
            pleasureTriggers: [
                'Garantia Nacional de 1 ano',
                'Rede de assistência capilar',
                'Facilidade de reparo em terceiros',
            ],
            implementationNotes: 'Segurança: Alerta Vermelho: "Sem garantia oficial no Brasil" para importados chineses.',
        },
        {
            scoreKey: 'c8',
            label: 'Conectividade (CPI)',
            weight: 0.07,
            painTriggers: [
                'Sem NFC (Inviável para pagamentos/transporte)',
                'Sinal fraco de 5G/4G (Modem ruim)',
                'Sem suporte a eSIM',
            ],
            pleasureTriggers: [
                'NFC incluso (Obrigatório)',
                'Modem Qualcomm/Exynos recente',
                'Suporte a eSIM (Viagens)',
            ],
            implementationNotes: 'Funcionalidade: NFC é mandatório para qualquer recomendação urbana.',
        },
        {
            scoreKey: 'c9',
            label: 'Armazenamento (AGD)',
            weight: 0.05,
            painTriggers: [
                '64GB (Obsoleto/Lota rápido)',
                'Memória lenta (eMMC) que trava o celular',
                'Sem expansão MicroSD (em intermediários)',
            ],
            pleasureTriggers: [
                'Mínimo 128GB (Ideal 256GB)',
                'Memória UFS rápida',
                'Slot MicroSD híbrido',
            ],
            implementationNotes: 'Longevidade: Não recomendar 64GB como aparelho principal. Bonificar MicroSD para backup barato de fotos.',
        },
        {
            scoreKey: 'c10',
            label: 'Recursos Úteis (IFM)',
            weight: 0.02,
            painTriggers: [
                'Câmera Macro de 2MP (Lixo eletrônico)',
                'Funções de IA que não funcionam em PT-BR',
            ],
            pleasureTriggers: [
                'IA Generativa útil (Remover objetos, Resumo)',
                'Som Estéreo de qualidade',
                'Modo Desktop (DeX/Ready For)',
            ],
            implementationNotes: 'Utilidade: Ignorar gimmicks de marketing. Focar no que resolve problemas reais.',
        },
    ],
};
