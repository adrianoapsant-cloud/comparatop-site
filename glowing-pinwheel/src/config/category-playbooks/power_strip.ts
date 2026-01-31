/**
 * @file power_strip.ts
 * @description Playbook de critérios para Filtros de Linha
 * Pesos: 25+15+10+10+10+8+7+5+5+5 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const POWER_STRIP_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'power_strip',
    displayName: 'Filtros de Linha',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Topologia Interna (Varistores)', weight: 0.25, painTriggers: ['Ausência de Varistores (MOV) - É só uma extensão', 'Fusível de vidro como única "proteção"', 'Componentes subdimensionados que explodem'], pleasureTriggers: ['Varistores de Óxido Metálico (MOV) de alto diâmetro', 'Fusível Térmico acoplado (Evita incêndio)', 'Proteção entre Fase-Neutro, Fase-Terra e Neutro-Terra'], implementationNotes: 'Se não tem MOV, classificar como "Régua de Tomada" (Risco).' },
        { scoreKey: 'c2', label: 'Mecanismo de Reset (Microdisjuntor)', weight: 0.15, painTriggers: ['Fusível de vidro que queima e exige troca manual', 'Dificuldade de abrir o compartimento do fusível'], pleasureTriggers: ['Microdisjuntor (Chave Circuit Breaker) rearmável', 'Proteção contra sobrecarga automática', 'Facilidade de religar após surto'], implementationNotes: 'Microdisjuntor elimina a manutenção. Fusível é tecnologia obsoleta.' },
        { scoreKey: 'c3', label: 'Capacidade de Absorção (Joules)', weight: 0.10, painTriggers: ['Capacidade não declarada pelo fabricante', 'Valor baixo (< 100 Joules)'], pleasureTriggers: ['Capacidade > 290 Joules (Durabilidade)', 'Corrente máxima de surto > 4.5 kA', 'Transparência técnica na ficha'], implementationNotes: 'Exigir dados claros de capacidade de absorção.' },
        { scoreKey: 'c4', label: 'Conformidade (Inmetro/Antichama)', weight: 0.10, painTriggers: ['Plástico comum que propaga fogo', 'Plugues frouxos fora do padrão NBR', 'Produto importado "Xing-ling" sem selo'], pleasureTriggers: ['Carcaça em material antichama (Auto-extinguível)', 'Selo Inmetro validado', 'Contatos de latão firmes'], implementationNotes: 'Filtro sem Inmetro é ilegal e perigoso. Penalizar severamente.' },
        { scoreKey: 'c5', label: 'Ergonomia (Espaçamento)', weight: 0.10, painTriggers: ['Tomadas 90° muito próximas (Fontes bloqueiam vizinhas)', 'Layout linear ineficiente'], pleasureTriggers: ['Tomadas diagonais (45°) ou espaçadas', 'Design que acomoda "tijolinhos" de fontes', 'Aproveitamento real de todas as saídas'], implementationNotes: 'Se o layout bloqueia tomadas, a utilidade cai pela metade.' },
        { scoreKey: 'c6', label: 'Cabo de Alimentação', weight: 0.08, painTriggers: ['Cabo curto (1m) que exige outra extensão', 'Fio rígido que levanta o filtro do chão', 'Plugue com pinos soltos'], pleasureTriggers: ['Cabo flexível de 1.5m a 3m', 'Plugue injetado robusto', 'Bitola adequada (0.75mm² ou 1.0mm²)'], implementationNotes: 'Cabo curto é a reclamação #1 de usabilidade.' },
        { scoreKey: 'c7', label: 'Conforto Visual (LEDs)', weight: 0.07, painTriggers: ['LED azul/vermelho de alto brilho (Ilumina o quarto)', 'Luz que vaza pelas frestas'], pleasureTriggers: ['LED indicador discreto ou na chave', 'Indicação clara de "Proteção Ativa" e "Terra Presente"'], implementationNotes: 'Para quarto, LED forte é "poluição luminosa".' },
        { scoreKey: 'c8', label: 'Filtragem de Ruído (EMI/RFI)', weight: 0.05, painTriggers: ['Ausência de filtragem de frequência', 'Ruído elétrico que passa para o áudio/vídeo'], pleasureTriggers: ['Capacitores X e Y + Indutores (Filtro real)', 'Atenuação de dB declarada'], implementationNotes: 'Diferencial para equipamentos de áudio e PC Gamer.' },
        { scoreKey: 'c9', label: 'Proteção de Dados (Coaxial/Rede)', weight: 0.05, painTriggers: ['Surtos que entram pelo cabo da NET/Claro', 'Queima de modem por raio na linha telefônica'], pleasureTriggers: ['Módulo de proteção para Cabo Coaxial e RJ45', 'Proteção completa (Energia + Dados)'], implementationNotes: 'Essencial para quem tem TV a Cabo ou Internet via cobre.' },
        { scoreKey: 'c10', label: 'Reputação e Garantia', weight: 0.05, painTriggers: ['Histórico de redução de qualidade ("Sacanagem")', 'Garantia difícil de acionar'], pleasureTriggers: ['Garantia de 3 Anos', 'Marca especialista em proteção (Clamper/Intelbras)', 'Suporte técnico acessível'], implementationNotes: 'Valorizar marcas que fabricam apenas proteção elétrica.' },
    ],
};
