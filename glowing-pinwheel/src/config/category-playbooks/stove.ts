/**
 * @file stove.ts
 * @description Playbook de critérios para Fogões e Cooktops importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+12+10+8+8+5+5+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const STOVE_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'stove',
    displayName: 'Fogões e Cooktops',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Segurança da Mesa (Estilhaço)',
            weight: 0.20,
            painTriggers: [
                'Vidro < 6mm sem bordas (Estouro espontâneo)',
                'Histórico de recall por vidro quebrado',
                'Mesa "Borderless" sem proteção de canto',
            ],
            pleasureTriggers: [
                'Mesa de Inox (Segurança total)',
                'Vidro com película de segurança',
                'Moldura de proteção nas bordas',
            ],
            implementationNotes: 'Filtro de Risco: Se Mesa = "Vidro" e Preço < R$ 500 (Cooktop) → Alerta Amarelo. Monitorar relatos de "Estouro" no Reclame Aqui.',
        },
        {
            scoreKey: 'c2',
            label: 'Estabilidade das Trempes (Grades)',
            weight: 0.15,
            painTriggers: [
                'Grades individuais de 4 pontos (Panelas tombam)',
                'Ferro fundido liso (Efeito sabão)',
                'Arame fino que deforma',
            ],
            pleasureTriggers: [
                'Grades de 6 pontos ou conjugadas (Mesa plana)',
                'Textura rugosa antiderrapante',
                'Pés de silicone na base da grade',
            ],
            implementationNotes: 'Teste da Leiteira: Se Grade = "4 pontas com vão grande" → Penalizar severamente (Risco de queimadura).',
        },
        {
            scoreKey: 'c3',
            label: 'Segurança de Gás (Válvulas)',
            weight: 0.15,
            painTriggers: [
                'Demora > 15s para segurar o forno aceso',
                'Falta de válvula corta-gás na mesa (Cooktops antigos)',
            ],
            pleasureTriggers: [
                'Sensor Stop (Corta gás em todas as bocas)',
                'Acendimento super rápido (< 5s)',
                'Termopar blindado contra sujeira',
            ],
            implementationNotes: 'Norma Inmetro: Exigir válvula no forno. Bonificar válvula na mesa (Mesa-Block).',
        },
        {
            scoreKey: 'c4',
            label: 'Desempenho dos Queimadores',
            weight: 0.12,
            painTriggers: [
                'Apenas queimadores médios (Sem potência)',
                'Mega Chama que queima o centro e deixa borda fria',
                'Chama amarela (Má mistura ar/gás)',
            ],
            pleasureTriggers: [
                'Tripla/Quadri Chama (Calor uniforme)',
                'Queimador Auxiliar (Simmer) para molhos',
                'Queimadores selados italianos (SABAF)',
            ],
            implementationNotes: 'Eficiência Culinária: Diferenciar "Mega Chama" (anel único) de "Tripla Chama" (três anéis). A Tripla é superior.',
        },
        {
            scoreKey: 'c5',
            label: 'Isolamento do Forno',
            weight: 0.10,
            painTriggers: [
                'Porta que esquenta muito (Risco para crianças)',
                'Assados desiguais (Bolo torto)',
                'Isolamento de lã de vidro fina',
            ],
            pleasureTriggers: [
                'Vidro Triplo ou Duplo com arrefecimento',
                'Lã de Basalto (Isolamento premium)',
                'Convecção (Ventoinha)',
            ],
            implementationNotes: 'Segurança Térmica: Se Uso = "Crianças em casa" → Exigir porta fria/vidro duplo.',
        },
        {
            scoreKey: 'c6',
            label: 'Durabilidade (Materiais)',
            weight: 0.08,
            painTriggers: [
                'Inox 430 sem proteção (Mancha/Oxida fácil)',
                'Serigrafia pintada que apaga',
                'Puxadores de plástico que derretem',
            ],
            pleasureTriggers: [
                'Mesa de Vidro (Não oxida)',
                'Inox 304 ou com verniz',
                'Serigrafia a laser ou underglass',
            ],
            implementationNotes: 'Estética: No litoral, recomendar Vidro ou Inox envernizado.',
        },
        {
            scoreKey: 'c7',
            label: 'Facilidade de Limpeza',
            weight: 0.08,
            painTriggers: [
                'Forno Autolimpante poroso (Acumula cheiro)',
                'Vidro da porta fixo (Sujeira entra e não sai)',
                'Botões fixos que acumulam gordura',
            ],
            pleasureTriggers: [
                'Forno Limpa Fácil / Easy Clean (Liso)',
                'Vidro interno removível (One-Click)',
                'Mesa compartimentada (Retém líquidos)',
            ],
            implementationNotes: 'Higiene: Autolimpante é tecnologia velha. Easy Clean é o novo padrão.',
        },
        {
            scoreKey: 'c8',
            label: 'Ergonomia (Botões)',
            weight: 0.05,
            painTriggers: [
                'Botões que esquentam (Perto da saída do forno)',
                'Top Control que rouba espaço de panela',
                'Gráficos difíceis de ler',
            ],
            pleasureTriggers: [
                'Botões removíveis e frios (Baquelite)',
                'Painel inclinado (Fácil leitura)',
                'Distância segura dos queimadores',
            ],
            implementationNotes: 'Conforto: Verificar se botões Top Control não queimam a mão em panelas grandes.',
        },
        {
            scoreKey: 'c9',
            label: 'Tecnologia (Timer/Grill)',
            weight: 0.05,
            painTriggers: [
                'Timer sonoro baixo',
                'Luz do forno não inclusa',
            ],
            pleasureTriggers: [
                'Timer Corta-Gás (Desliga a chama sozinho)',
                'Grill Elétrico (Dourar)',
                'Termômetro de carne (Meat Probe)',
            ],
            implementationNotes: 'Inovação: O Timer Corta-Gás é o maior diferencial de segurança moderna.',
        },
        {
            scoreKey: 'c10',
            label: 'Eficiência Energética (Gás/Luz)',
            weight: 0.02,
            painTriggers: [
                'Classificação C ou D',
                'Grill que gasta muita luz',
            ],
            pleasureTriggers: [
                'Selo CONPET A',
                'Isolamento térmico eficiente',
            ],
            implementationNotes: 'Economia: Focar na eficiência do gás, já que é o custo recorrente maior.',
        },
    ],
};
