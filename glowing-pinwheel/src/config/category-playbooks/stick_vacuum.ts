/**
 * @file stick_vacuum.ts
 * @description Playbook de critérios para Aspiradores Verticais
 * Pesos: 25+20+15+10+10+8+5+3+2+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const STICK_VACUUM_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'stick_vacuum',
    displayName: 'Aspiradores Verticais',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Eficiência de Sucção Real', weight: 0.25, painTriggers: ['Potência alta (Watts) mas vácuo fraco (Só faz barulho)', 'Bocal que apenas empurra a sujeira grossa', 'Perda de sucção rápida com filtro sujo'], pleasureTriggers: ['Vácuo > 100 mbar (Sucção real)', 'Tecnologia Ciclônica eficiente (Mantém força)', 'Bocal com efeito Venturi otimizado'], implementationNotes: 'Ignorar Watts nominais. Focar em "Pega arroz/areia?".' },
        { scoreKey: 'c2', label: 'Gestão de Energia (Fio/Bateria)', weight: 0.20, painTriggers: ['Cabo curto (< 4m) que exige troca de tomada constante', 'Bateria viciada em 1 ano (Obsolescência)', 'Autonomia < 15 min na potência máxima'], pleasureTriggers: ['Cabo elétrico > 5 metros', 'Bateria removível/substituível (Click-in)', 'Autonomia > 30 min (Cordless)'], implementationNotes: 'Se Fio < 5m → Penalizar severamente. Bateria fixa é risco de lixo eletrônico.' },
        { scoreKey: 'c3', label: 'Ergonomia e Peso', weight: 0.15, painTriggers: ['Peso concentrado no punho (Cansa o braço)', 'Não para em pé sozinho (Cai ao encostar)', 'Gatilho que precisa ficar apertado (Dyson style)'], pleasureTriggers: ['Centro de gravidade baixo (Motor embaixo)', 'Posição de estacionamento (Para em pé)', 'Gatilho com trava de funcionamento'], implementationNotes: 'Para limpeza pesada, peso no chão é melhor. "Stand Alone" é vital.' },
        { scoreKey: 'c4', label: 'Filtragem e Higiene (HEPA)', weight: 0.10, painTriggers: ['Filtro difícil de limpar e secar (24h parado)', 'Esvaziamento que gera nuvem de pó (Puff)', 'Cheiro de mofo se usar filtro úmido'], pleasureTriggers: ['Filtro HEPA lavável e durável', 'Esvaziamento "One-Touch" (Sem contato com pó)', 'Reservatório totalmente lavável'], implementationNotes: 'HEPA é obrigatório. Sistema de esvaziamento higiênico é diferencial.' },
        { scoreKey: 'c5', label: 'Versatilidade (2 em 1)', weight: 0.10, painTriggers: ['Difícil de destacar a unidade de mão', 'Cabeçote alto que não entra embaixo do sofá', 'Acessórios frágeis que não encaixam bem'], pleasureTriggers: ['Modo portátil fácil (2 em 1)', 'Articulação 180º (Limpa deitado no chão)', 'Bico de canto e escova inclusos e úteis'], implementationNotes: 'Teste do sofá: Se não entra embaixo, perde pontos.' },
        { scoreKey: 'c6', label: 'Performance Pet (Cabelos)', weight: 0.08, painTriggers: ['Escova que trava com cabelos enrolados (Tangling)', 'Difícil de limpar a escova (Exige tesoura)', 'Bocal que entope com pelos'], pleasureTriggers: ['Lâmina interna de corte de cabelos (BrushRollClean)', 'Escova motorizada anti-emaranhamento', 'Fácil remoção do rolo para limpeza'], implementationNotes: 'Para donos de pets, escova motorizada é essencial.' },
        { scoreKey: 'c7', label: 'Durabilidade e Construção', weight: 0.05, painTriggers: ['Travas de plástico que quebram', 'Superaquecimento e desligamento constante', 'Encaixes frouxos com o tempo'], pleasureTriggers: ['Plásticos de engenharia (ABS robusto)', 'Proteção térmica eficiente (Não desliga à toa)', 'Encaixes firmes e precisos'], implementationNotes: 'Aspirador barato quebra a trava do pó rápido.' },
        { scoreKey: 'c8', label: 'Acústica (Ruído)', weight: 0.03, painTriggers: ['Ruído agudo/estridente (> 85dB)', 'Som de "turbina" insuportável'], pleasureTriggers: ['Ruído < 80dB (Aceitável)', 'Frequência sonora grave (Menos irritante)', 'Isolamento acústico do motor'], implementationNotes: 'Aspirador é barulhento, mas agudos incomodam mais.' },
        { scoreKey: 'c9', label: 'Manutenibilidade (Peças)', weight: 0.02, painTriggers: ['Filtro de reposição caro ou inexistente', 'Bateria de reposição custa 50% do novo'], pleasureTriggers: ['Filtros e peças baratos e fáceis de achar', 'Rede de assistência técnica ampla'], implementationNotes: 'Filtro é consumível. Tem que ser barato e acessível.' },
        { scoreKey: 'c10', label: 'Custo-Benefício', weight: 0.02, painTriggers: ['Produto "Gamer" (LEDs inúteis) com preço alto', 'Aspirador robô burro vendido como vertical'], pleasureTriggers: ['Melhor conjunto Sucção/Bateria pelo preço', 'Investimento que dura anos'], implementationNotes: 'Não pagar por luzinha. Pagar por sucção e bateria.' },
    ],
};
