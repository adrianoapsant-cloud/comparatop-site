/**
 * @file drill.ts
 * @description Playbook de critérios para Parafusadeiras e Furadeiras
 * Pesos: 25+15+15+10+10+8+5+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const DRILL_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'drill',
    displayName: 'Parafusadeiras e Furadeiras',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Potência Real (Torque)', weight: 0.25, painTriggers: ['Voltagem "21V" falsa (Internamente 18V)', 'Ferramenta que para (Stall) em madeira dura', 'Torque "Hard" alto que não serve para parafusar'], pleasureTriggers: ['Torque Elástico (Soft) sustentado', 'Normalização de Voltagem (12V/18V)', 'Capacidade de usar brocas de 13mm'], implementationNotes: 'Ignorar "20V Max" na caixa. Classificar como 18V.' },
        { scoreKey: 'c2', label: 'Ecossistema de Bateria', weight: 0.15, painTriggers: ['Bateria que morre em 6 meses (BMS passivo)', 'Marca órfã sem bateria de reposição', 'Custo de bateria nova > 60% da ferramenta'], pleasureTriggers: ['BMS com monitoramento individual de células', 'Bateria compatível com 10+ ferramentas (Ecossistema)', 'Células de alta qualidade (Samsung/LG)'], implementationNotes: 'Sem bateria avulsa à venda = Produto descartável.' },
        { scoreKey: 'c3', label: 'Precisão do Mandril', weight: 0.15, painTriggers: ['Mandril descentralizado (Broca "dança")', 'Mandril que solta a broca no impacto', '"Metal" de baixa qualidade pesado e ruim'], pleasureTriggers: ['Mandril de aperto rápido de marca (Röhm/Jacobs)', 'Runout mínimo (Giro perfeito)', 'Capacidade de segurar brocas finas sem quebrar'], implementationNotes: 'Mandril torto inutiliza a furadeira.' },
        { scoreKey: 'c4', label: 'Tecnologia do Motor', weight: 0.10, painTriggers: ['Motor com escovas (Brushed) que solta faísca e cheiro', 'Aquecimento excessivo com uso contínuo', 'Manutenção frequente de carvão'], pleasureTriggers: ['Motor Brushless (Sem escovas)', 'Maior autonomia e vida útil', 'Controle eletrônico de rotação'], implementationNotes: 'Brushless é o padrão ouro. Brushed só aceitável em ferramentas muito baratas.' },
        { scoreKey: 'c5', label: 'Ergonomia e Peso', weight: 0.10, painTriggers: ['Ferramenta "cabeçuda" (Cai para frente)', 'Punho de plástico liso e duro', 'Falta de clip de cinto'], pleasureTriggers: ['Peso balanceado (Bateria na base)', 'Empunhadura emborrachada (Soft Grip)', 'Clip de cinto incluso'], implementationNotes: 'Peso mal distribuído causa lesão. Clip de cinto é essencial para trabalho em altura.' },
        { scoreKey: 'c6', label: 'Impacto (Alvenaria)', weight: 0.08, painTriggers: ['Furadeira 12V sem impacto vendida como "Furadeira de Parede"', 'Impacto fraco que apenas faz barulho', 'Broca que queima no concreto'], pleasureTriggers: ['Função Impacto (Martelete mecânico) real', 'IPM alto (> 25.000)', 'Capacidade de furar concreto vibrado'], implementationNotes: 'Se Uso = "Parede de Tijolo" → Exigir Impacto.' },
        { scoreKey: 'c7', label: 'Controle de Torque (Embreagem)', weight: 0.05, painTriggers: ['Posição 1 muito forte (Espana parafuso pequeno)', 'Anel de torque duro ou impreciso', 'Falta de Freio Motor (Gira depois de soltar)'], pleasureTriggers: ['Torque mínimo delicado (Parafusar MDF)', 'Freio Motor instantâneo', 'Gatilho VSR linear'], implementationNotes: 'Para montagem de móveis, o controle fino é vital.' },
        { scoreKey: 'c8', label: 'Qualidade do Kit', weight: 0.05, painTriggers: ['Maleta com "100 peças" de metal mole (Lixo)', 'Brocas que entortam no primeiro uso', 'Bits que espanam a cabeça do parafuso'], pleasureTriggers: ['Maleta modular resistente (Empilhável)', 'Acessórios de marcas reais (Irwin/Bosch)', 'Foco na ferramenta, não no "brinde"'], implementationNotes: 'Kit gigante de má qualidade é armadilha.' },
        { scoreKey: 'c9', label: 'Iluminação LED', weight: 0.05, painTriggers: ['LED embaixo do mandril (Sombra no furo)', 'Luz fraca ou inexistente'], pleasureTriggers: ['LED na base da bateria (Sem sombra)', 'Função "Afterglow" (Fica aceso após soltar)'], implementationNotes: 'Luz na base é design superior.' },
        { scoreKey: 'c10', label: 'Pós-Venda e Reparabilidade', weight: 0.02, painTriggers: ['Marca importada sem peça de reposição', 'Gatilho que não vende separado'], pleasureTriggers: ['Rede de assistência nacional', 'Mercado paralelo de peças (Gatilho/Motor)', 'Garantia de 1 a 3 anos'], implementationNotes: 'Ferramenta de trabalho tem que ter conserto.' },
    ],
};
