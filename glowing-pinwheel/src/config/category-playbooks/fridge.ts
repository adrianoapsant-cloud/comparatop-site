/**
 * @file fridge.ts
 * @description Playbook de critérios para Refrigeradores importado de "10 dores.txt"
 * 
 * Pesos normalizados proporcionalmente: Original somava 98%, ajustado para 100%
 * Fórmula: peso_normalizado = peso_original / 0.98
 */

import type { CategoryPlaybook } from './tv';

export const FRIDGE_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'fridge',
    displayName: 'Refrigeradores',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Custo Total (TCO) & Manutenção',
            weight: 0.1837, // Normalizado: 18% → 18.37%
            painTriggers: [
                'Placa Inverter queimada (R$ 800+ reparo)',
                'Peças de reposição indisponíveis (Importadas)',
                'Consumo real > 50kWh/mês (Gasto alto)',
            ],
            pleasureTriggers: [
                'Compressores com garantia de 10 anos',
                'Eficiência A+++ (Consumo < 35kWh)',
                'Peças baratas no mercado paralelo (Consul)',
            ],
            implementationNotes: 'Matemática Financeira: Somar Preço Compra + (Consumo Anual x 5 Anos). Alertar: "Risco de reparo caro em Inverter sem proteção elétrica".',
        },
        {
            scoreKey: 'c2',
            label: 'Integridade de Materiais (Ferrugem)',
            weight: 0.1531, // Normalizado: 15% → 15.31%
            painTriggers: [
                '"Evox/Platinum" descascando em 2 anos (Corrosão)',
                'Ferrugem na porta do dispenser',
                'Pintura frágil em áreas litorâneas',
            ],
            pleasureTriggers: [
                'Aço Inox Verdadeiro (Austenítico)',
                'Vidro Preto/Branco (Black Glass - Imune a ferrugem)',
                'Proteção de verniz extra',
            ],
            implementationNotes: 'Filtro Geográfico: Se Local = "Litoral" → ELIMINAR Evox/Platinum. Recomendar Inox Real ou Vidro.',
        },
        {
            scoreKey: 'c3',
            label: 'Fluxo de Ar (Gela Embaixo?)',
            weight: 0.1224, // Normalizado: 12% → 12.24%
            painTriggers: [
                'Bloqueio de gelo no duto (Freezer gela, geladeira não)',
                'Sensores de degelo falhos',
                'Dreno entupido recorrente',
            ],
            pleasureTriggers: [
                'Tecnologia Twin Cooling (Evaporadores independentes)',
                'Acesso fácil ao dreno para limpeza',
                'Histórico limpo de "bloqueio de gelo"',
            ],
            implementationNotes: 'Confiabilidade: Penalizar modelos com alto índice de "Não gela embaixo" no Reclame Aqui.',
        },
        {
            scoreKey: 'c4',
            label: 'Estabilidade Térmica & Laterais',
            weight: 0.1020, // Normalizado: 10% → 10.20%
            painTriggers: [
                'Laterais "pegando fogo" (Mal isolamento)',
                'Alimentos estragando na porta (Variação de temp)',
                'Mistura de odores entre compartimentos',
            ],
            pleasureTriggers: [
                'Tecnologia Multi Flow (Ar em todas as prateleiras)',
                'Isolamento térmico de alta densidade',
                'Aviso de porta aberta',
            ],
            implementationNotes: 'Gestão de Expectativa: Alertar: "Aquecimento lateral é normal, mas deve ser tolerável".',
        },
        {
            scoreKey: 'c5',
            label: 'Ergonomia & Resistência Interna',
            weight: 0.1020, // Normalizado: 10% → 10.20%
            painTriggers: [
                'Prateleiras de acrílico que quebram fácil',
                'Freezer de gavetas apertadas (Não cabe caixa de pizza)',
                'Prateleiras fixas (Sem ajuste de altura)',
            ],
            pleasureTriggers: [
                'Prateleiras de Vidro Temperado (Resistentes)',
                'Layout Inverse (Ergonomia para frescos)',
                'Prateleiras retráteis/dobráveis',
            ],
            implementationNotes: 'Usabilidade: Se Uso = "Família Grande" → Exigir prateleiras de vidro e espaço para panelas.',
        },
        {
            scoreKey: 'c6',
            label: 'Tecnologia de Conservação',
            weight: 0.0816, // Normalizado: 8% → 8.16%
            painTriggers: [
                'Gaveta de legumes simples (Plástico seco)',
                'Alimentos murcham em 3 dias',
            ],
            pleasureTriggers: [
                'Vitamin Power (Luz LED fotossíntese)',
                'Gaveta Hortinatura (Vedação hermética)',
                'Filtro de ar (Bem Fresh)',
            ],
            implementationNotes: 'Economia de Comida: Valorizar tecnologias que estendem a vida útil de vegetais (Panasonic/Electrolux).',
        },
        {
            scoreKey: 'c7',
            label: 'Acústica (Ruído)',
            weight: 0.0816, // Normalizado: 8% → 8.16%
            painTriggers: [
                'Zumbido agudo constante (Inverter mal isolado)',
                'Estalos de dilatação (Parece tiro)',
                'Vibração do compressor',
            ],
            pleasureTriggers: [
                'Compressor Inverter silencioso (< 40dB)',
                'Isolamento acústico do motor',
                'Modo noturno/silencioso',
            ],
            implementationNotes: 'Conforto: Avisar sobre "estalos" em modelos com isolamento de espuma expandida.',
        },
        {
            scoreKey: 'c8',
            label: 'Pós-Venda & Assistência',
            weight: 0.0714, // Normalizado: 7% → 7.14%
            painTriggers: [
                'Falta de técnicos para Inverter (Marcas asiáticas no interior)',
                'Demora de 30 dias para peça',
            ],
            pleasureTriggers: [
                'Rede autorizada capilar (Brastemp/Consul)',
                'Peças a pronta entrega',
                'Suporte técnico eficiente',
            ],
            implementationNotes: 'Segurança: Se Local = "Interior" → Priorizar marcas nacionais com peças fáceis.',
        },
        {
            scoreKey: 'c9',
            label: 'Capacidade Real (Litros)',
            weight: 0.0612, // Normalizado: 6% → 6.12%
            painTriggers: [
                'Litragem inflada por paredes finas',
                'Ice Maker que rouba metade do freezer',
                'Prateleiras estreitas',
            ],
            pleasureTriggers: [
                'Espaço útil otimizado (Paredes finas eficientes)',
                'Ice Maker na porta (SpaceMax)',
                'Profundidade para garrafas em pé',
            ],
            implementationNotes: 'Volume Útil: Comparar "Capacidade de Compras" e não apenas litros brutos.',
        },
        {
            scoreKey: 'c10',
            label: 'Inteligência & Interface',
            weight: 0.0410, // Normalizado: 4% → 4.10% (arredondado para fechar 100%)
            painTriggers: [
                'Painel touch que queima com umidade',
                'Wi-Fi inútil (Só muda temperatura)',
            ],
            pleasureTriggers: [
                'Modos Turbo/Festa úteis',
                'Painel resistente à umidade',
                'Diagnóstico de falha via App',
            ],
            implementationNotes: 'Utilidade: Priorizar funções de resfriamento rápido sobre conectividade básica.',
        },
    ],
};
