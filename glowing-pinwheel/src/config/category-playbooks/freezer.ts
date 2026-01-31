/**
 * @file freezer.ts
 * @description Playbook de critérios para Freezers importado de "10 dores.txt"
 * 
 * Pesos: 20+20+15+10+10+8+7+5+3+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const FREEZER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'freezer',
    displayName: 'Freezers',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Tecnologia de Degelo',
            weight: 0.20,
            painTriggers: [
                'Frost Free que desidrata alimentos sem embalagem correta (Freezer Burn)',
                'Manual que forma gelo excessivo em porta mal vedada',
            ],
            pleasureTriggers: [
                'Frost Free (Conveniência máxima)',
                'Cycle Defrost (Equilíbrio)',
                'Manual (Máxima eficiência energética e conservação)',
            ],
            implementationNotes: 'Filtro de Uso: Se Uso = "Estoque de Carne/Comércio" → Recomendar Manual (Menor oscilação). Se Uso = "Dia a Dia" → Recomendar Frost Free.',
        },
        {
            scoreKey: 'c2',
            label: 'Eficiência Energética (TCO)',
            weight: 0.20,
            painTriggers: [
                'Classificação "A" antiga ou "B" (Gasta muito)',
                'Compressor On/Off ruidoso e ineficiente',
            ],
            pleasureTriggers: [
                'Tecnologia Inverter (Economia real de 40%)',
                'Gás R600a (Isobutano)',
                'Isolamento térmico de alta densidade',
            ],
            implementationNotes: 'Custo Operacional: Calcular Custo 5 Anos (Preço + Energia). Inverter é mandatório para quem paga conta de luz alta.',
        },
        {
            scoreKey: 'c3',
            label: 'Retenção Térmica (Apagão)',
            weight: 0.15,
            painTriggers: [
                'Perda rápida de frio (Vertical com isolamento ruim)',
                'Alimentos descongelando em < 12h sem luz',
            ],
            pleasureTriggers: [
                'Horizontal (Mantém gelo por > 24h)',
                'Paredes espessas',
                'Dreno frontal com tampa rosqueável',
            ],
            implementationNotes: 'Segurança Alimentar: Se Local = "Zona Rural/Instável" → ELIMINAR Vertical Frost Free. Recomendar Horizontal.',
        },
        {
            scoreKey: 'c4',
            label: 'Capacidade Real (Litros)',
            weight: 0.10,
            painTriggers: [
                'Litragem nominal que não cabe caixa de pizza (Gavetas estreitas)',
                '"Buraco Negro" em horizontais fundos',
            ],
            pleasureTriggers: [
                'Cestos removíveis organizadores',
                'Gavetas transparentes e removíveis',
                'Relação Litro/m² eficiente',
            ],
            implementationNotes: 'Volume Útil: Vertical perde 30% do espaço em gavetas. Horizontal aproveita 100%.',
        },
        {
            scoreKey: 'c5',
            label: 'Integridade Estrutural',
            weight: 0.10,
            painTriggers: [
                'Gavetas de plástico PS que quebram no frio',
                'Puxador frágil que racha',
                'Ferrugem na base (Área de maresia)',
            ],
            pleasureTriggers: [
                'Cestos de metal aramado (Indestrutíveis)',
                'Acabamento Evox/Inox',
                'Tubulação de cobre (Comercial)',
            ],
            implementationNotes: 'Durabilidade: Penalizar modelos com histórico de "Gaveta Quebrada" no Reclame Aqui.',
        },
        {
            scoreKey: 'c6',
            label: 'Versatilidade (Dual Function)',
            weight: 0.08,
            painTriggers: [
                'Termostato impreciso (Congela cerveja no modo refrigerador)',
                'Chave seletora traseira (Difícil acesso)',
            ],
            pleasureTriggers: [
                'Modo Freezer/Refrigerador/Conservador',
                'Controle externo frontal',
                'Precisão para bebidas (-2°C a 4°C)',
            ],
            implementationNotes: 'Flexibilidade: Valorizar modelos que viram "cervejeira" para festas.',
        },
        {
            scoreKey: 'c7',
            label: 'Ergonomia e Acesso',
            weight: 0.07,
            painTriggers: [
                'Horizontal muito fundo (Difícil pegar itens no fundo)',
                'Tampa pesada sem balanceamento',
            ],
            pleasureTriggers: [
                'Tampa balanceada (Para em qualquer ângulo)',
                'Vertical (Tudo à mão)',
                'Rodízios 360º robustos',
            ],
            implementationNotes: 'Acessibilidade: Para idosos/coluna, Vertical é a única opção recomendada.',
        },
        {
            scoreKey: 'c8',
            label: 'Acústica (Ruído)',
            weight: 0.05,
            painTriggers: [
                '"Estalos" de dilatação em Frost Free (Tiro)',
                'Zumbido alto de compressor antigo',
            ],
            pleasureTriggers: [
                'Compressor Inverter silencioso',
                'Isolamento de vibração',
            ],
            implementationNotes: 'Conforto: Avisar sobre estalos noturnos em modelos verticais Frost Free.',
        },
        {
            scoreKey: 'c9',
            label: 'Limpeza e Dreno',
            weight: 0.03,
            painTriggers: [
                'Dreno traseiro ou inexistente (Tem que virar o freezer)',
                'Gaxeta fixa (Acumula mofo)',
            ],
            pleasureTriggers: [
                'Dreno frontal acessível',
                'Gaxeta removível',
                'Interior com cantos arredondados',
            ],
            implementationNotes: 'Manutenção: Dreno frontal é essencial para degelo manual sem molhadeira.',
        },
        {
            scoreKey: 'c10',
            label: 'Interface e Segurança',
            weight: 0.02,
            painTriggers: [
                'Painel digital que queima com umidade',
                'Porta aberta sem alarme',
            ],
            pleasureTriggers: [
                'Alarme de porta aberta',
                'Chave de segurança na porta',
                'Painel resistente à água',
            ],
            implementationNotes: 'Proteção: Alarme é vital para verticais (onde a porta pode ficar entreaberta).',
        },
    ],
};
