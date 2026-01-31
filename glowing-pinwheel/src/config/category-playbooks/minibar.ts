/**
 * @file minibar.ts
 * @description Playbook de critérios para Frigobares e Cervejeiras
 * Pesos: 25+15+15+10+10+8+5+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const MINIBAR_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'minibar',
    displayName: 'Frigobares e Cervejeiras',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Tecnologia de Resfriamento', weight: 0.25, painTriggers: ['Termoelétrico (Peltier) no verão brasileiro (Não gela)', 'Delta T fixo (Bebida a 15°C se ambiente estiver a 35°C)', 'Expectativa de "geladeira" frustrada'], pleasureTriggers: ['Compressor Hermético (Ciclo de vapor)', 'Capacidade de atingir 0°C a 4°C reais', 'Estabilidade térmica independente do calor externo'], implementationNotes: 'Se Clima = "Tropical/Verão" → ELIMINAR Peltier para bebidas.' },
        { scoreKey: 'c2', label: 'Conforto Acústico (Sono)', weight: 0.15, painTriggers: ['Estalo alto do relé ("Tec") ao ligar/desligar', 'Zumbido de vibração da grade traseira', 'Barulho intermitente que acorda'], pleasureTriggers: ['Compressor inverter ou de baixo ruído', 'Sistema Peltier (Silêncio total - Bônus apenas aqui)', 'Isolamento acústico do motor'], implementationNotes: 'Para quarto, o estalo do relé é fatal. Peltier ganha aqui.' },
        { scoreKey: 'c3', label: 'Potência de Gelo (Trincar)', weight: 0.15, painTriggers: ['Termostato que só vai até 5°C (Cerveja "choca")', 'Falta de compartimento Extra Frio', 'Formação excessiva de gelo sem gelar a bebida'], pleasureTriggers: ['Capacidade de atingir -2°C a -4°C (Véu de noiva)', 'Função Turbo ou Cervejeira dedicada', 'Estabilidade em temperatura negativa'], implementationNotes: 'Brasileiro gosta de cerveja "estupidamente gelada".' },
        { scoreKey: 'c4', label: 'Arquitetura Interna (Espaço)', weight: 0.10, painTriggers: ['Gaveta de legumes fixa que rouba espaço', 'Não cabe garrafa de 2L em pé', 'Porta-latas que não aceita "Latão" ou "Long Neck"'], pleasureTriggers: ['Prateleiras removíveis e ajustáveis', 'Espaço para Barril de Chopp (5L)', 'Fundo plano (Sem degrau excessivo do motor)'], implementationNotes: 'Se não cabe latão ou PET 2L, é inútil para festas.' },
        { scoreKey: 'c5', label: 'Design e Materiais', weight: 0.10, painTriggers: ['Porta de vidro que sua (Condensação) e molha o chão', 'Puxador de plástico cromado que descasca', 'Lateral que esquenta muito (Perigo para móveis)'], pleasureTriggers: ['Vidro triplo ou aquecido (Anti-suor)', 'Acabamento Inox ou Retrô autêntico', 'Dissipação de calor frontal ou traseira (Não lateral)'], implementationNotes: 'Porta de vidro sem aquecimento = Poça d\'água no Brasil.' },
        { scoreKey: 'c6', label: 'Eficiência Energética (TCO)', weight: 0.08, painTriggers: ['Consumo alto (> 25 kWh/mês) para pouco volume', 'Borracha de vedação que resseca rápido', 'Peltier ligado 24h sem parar'], pleasureTriggers: ['Selo Procel A', 'Custo mensal baixo (< R$ 20,00)', 'Vedação magnética de qualidade'], implementationNotes: 'Peltier gasta mais que compressor no calor.' },
        { scoreKey: 'c7', label: 'Manutenção (Degelo)', weight: 0.05, painTriggers: ['Degelo manual difícil (Molha tudo)', 'Congelador que bloqueia a porta com gelo', 'Falta de dreno'], pleasureTriggers: ['Degelo Semi-Automático (Botão)', 'Cycle Defrost ou Frost Free (Raro/Premium)', 'Bandeja coletora de fácil remoção'], implementationNotes: 'Ninguém quer descongelar frigobar todo mês.' },
        { scoreKey: 'c8', label: 'Iluminação Interna', weight: 0.05, painTriggers: ['Escuro total (Sem luz)', 'Luz que não apaga (Atrapalha o sono)', 'Lâmpada quente que esquenta a bebida'], pleasureTriggers: ['LED frio com acionamento na porta', 'Iluminação cênica (Cervejeiras)', 'Interruptor independente'], implementationNotes: 'Frigobar no quarto precisa de luz discreta.' },
        { scoreKey: 'c9', label: 'Durabilidade (Móveis)', weight: 0.05, painTriggers: ['Portinha do congelador que quebra a dobradiça', 'Pés niveladores de plástico frágil', 'Prateleiras de acrílico que trincam'], pleasureTriggers: ['Componentes robustos (Metal/Vidro temperado)', 'Pés firmes e ajustáveis', 'Garantia longa no compressor (10 anos)'], implementationNotes: 'A portinha do congelador é o ponto fraco #1.' },
        { scoreKey: 'c10', label: 'Inovação (Smart/Dual)', weight: 0.02, painTriggers: ['Termostato analógico impreciso (Rodinha atrás)', 'Falta de controle de temperatura externo'], pleasureTriggers: ['Controle digital na porta', 'Conectividade (App)', 'Dual Zone (Vinho + Cerveja)'], implementationNotes: 'Controle digital evita abrir a porta para ajustar.' },
    ],
};
