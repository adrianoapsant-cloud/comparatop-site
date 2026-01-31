/**
 * @file microwave.ts
 * @description Playbook de critérios para Micro-ondas importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+12+10+8+8+5+5+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const MICROWAVE_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'microwave',
    displayName: 'Micro-ondas',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Integridade da Cavidade (Pintura)',
            weight: 0.20,
            painTriggers: [
                'Pintura do teto que estufa e enferruja em 1 ano (Risco de faiscamento)',
                'Revestimento poroso que acumula gordura',
                'Histórico de corrosão no Reclame Aqui',
            ],
            pleasureTriggers: [
                'Revestimento Limpa Fácil (EasyClean/Cerâmico)',
                'Cavidade de Inox',
                'Pintura antibacteriana de alta densidade',
            ],
            implementationNotes: 'Teste de Sobrevivência: Se Histórico = "Ferrugem no Teto" → ELIMINAR recomendação (Perigo). Valorizar tecnologias que repelem gordura.',
        },
        {
            scoreKey: 'c2',
            label: 'Visibilidade Operacional',
            weight: 0.15,
            painTriggers: [
                'Porta espelhada "Blackout" (Não dá para ver a comida)',
                'Luz interna fraca (Incandescente amarela)',
                'Vidro muito escuro',
            ],
            pleasureTriggers: [
                'Porta transparente clara',
                'Iluminação LED de alto brilho',
                'Visibilidade total durante o funcionamento',
            ],
            implementationNotes: 'Usabilidade: Se a porta é espelhada e impede a visão → Penalizar (Design acima da função). Bonificar LED branco forte.',
        },
        {
            scoreKey: 'c3',
            label: 'Interface (Painel)',
            weight: 0.15,
            painTriggers: [
                'Membrana que para de funcionar (Botões duros)',
                '"Painel Louco" (Apita sozinho com umidade)',
                'Menu complexo sem botão rápido',
            ],
            pleasureTriggers: [
                'Botão "+30s" de acesso direto (One Touch)',
                'Painel Capacitivo (Vidro) ou Botão Mecânico',
                'Tecla Mudo (Silêncio)',
            ],
            implementationNotes: 'Confiabilidade: Membrana barata é falha recorrente. Valorizar vidro ou botões físicos.',
        },
        {
            scoreKey: 'c4',
            label: 'Tecnologia de Aquecimento',
            weight: 0.12,
            painTriggers: [
                'Descongelamento que cozinha as bordas e deixa o meio gelado',
                'Potência real < 700W (Demora muito)',
                'Aquecimento desigual',
            ],
            pleasureTriggers: [
                'Tecnologia Inverter (Potência constante real)',
                'Descongelamento uniforme',
                'Alta potência (> 1000W)',
            ],
            implementationNotes: 'Performance: Inverter é o padrão ouro de qualidade. Diferenciar de modelos comuns.',
        },
        {
            scoreKey: 'c5',
            label: 'Ergonomia de Limpeza',
            weight: 0.10,
            painTriggers: [
                'Grill de resistência exposta (Impossível limpar atrás)',
                'Cantos vivos que acumulam sujeira',
                'Frestas de ventilação sujas',
            ],
            pleasureTriggers: [
                'Função "Tira Odor" eficaz',
                'Grill de Quartzo embutido (Plano)',
                'Cantos arredondados',
            ],
            implementationNotes: 'Manutenção: Se tem Grill, exigir que seja embutido/quartzo para facilitar limpeza.',
        },
        {
            scoreKey: 'c6',
            label: 'Nível de Ruído',
            weight: 0.08,
            painTriggers: [
                'Ventoinha barulhenta pós-uso',
                'Vibração da carcaça (Zumbido)',
                'Bips altos sem opção de desligar',
            ],
            pleasureTriggers: [
                'Função Mudo / Silêncio',
                'Operação silenciosa (< 60dB)',
                'Inverter (Sem barulho de transformador)',
            ],
            implementationNotes: 'Conforto: Avisar se o modelo não tem opção de tirar o som dos botões.',
        },
        {
            scoreKey: 'c7',
            label: 'Capacidade Útil',
            weight: 0.08,
            painTriggers: [
                'Prato giratório pequeno (< 25cm) em modelo de 20L',
                'Prato de jantar padrão que trava ao girar',
                'Altura interna baixa',
            ],
            pleasureTriggers: [
                'Prato > 30cm (Modelos 30L+)',
                'Tecnologia Flatbed (Sem prato, base plana)',
                'Teste do Prato aprovado',
            ],
            implementationNotes: 'Realidade: Ignorar litragem bruta. Focar no diâmetro do prato.',
        },
        {
            scoreKey: 'c8',
            label: 'Mecânica da Porta',
            weight: 0.05,
            painTriggers: [
                'Botão de pressão que quebra ou afunda',
                'Porta que não abre fácil',
            ],
            pleasureTriggers: [
                'Puxador (Alça) na porta (Mais robusto)',
                'Trava de segurança para crianças fácil de ativar',
            ],
            implementationNotes: 'Durabilidade Mecânica: Botão de abrir é ponto de falha comum. Puxador é melhor.',
        },
        {
            scoreKey: 'c9',
            label: 'Versatilidade Real',
            weight: 0.05,
            painTriggers: [
                'Função "Air Fryer" que suja tudo e demora',
                'Grill fraco que só gasta luz',
            ],
            pleasureTriggers: [
                'Grill de Quartzo rápido (Gratinar)',
                'Convecção real (Assar bolo)',
                'Manter Aquecido eficiente',
            ],
            implementationNotes: 'Expectativa: Alertar que "Função Air Fryer" em micro-ondas não é igual à fritadeira dedicada.',
        },
        {
            scoreKey: 'c10',
            label: 'Recursos Supérfluos',
            weight: 0.02,
            painTriggers: [
                'Wi-Fi inútil (Mais rápido ir até o aparelho)',
                'Excesso de receitas pré-programadas (Ninguém usa)',
            ],
            pleasureTriggers: [
                'Foco no básico bem feito',
                'Design limpo',
            ],
            implementationNotes: 'Custo-Benefício: Não valorizar Wi-Fi se encarecer o produto sem benefício real.',
        },
    ],
};
