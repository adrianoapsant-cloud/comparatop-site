/**
 * @file cpu.ts
 * @description Playbook de critérios para Processadores
 * Pesos: 20+15+15+12+10+8+8+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const CPU_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'cpu',
    displayName: 'Processadores',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Ecossistema & Longevidade (Socket)', weight: 0.20, painTriggers: ['Socket "morto" (Sem upgrades futuros)', 'Plataforma que exige troca de placa-mãe a cada geração', 'Custo de entrada proibitivo'], pleasureTriggers: ['Socket de longa vida (AM4/AM5)', 'Histórico de suporte de 3+ gerações', 'Compatibilidade com DDR4 (Economia)'], implementationNotes: 'Se Socket = "Fim de Vida" (ex: LGA1700) → Alerta Amarelo.' },
        { scoreKey: 'c2', label: 'Estabilidade (1% Lows & Cache)', weight: 0.15, painTriggers: ['Travamentos (Stutters) em jogos pesados', 'FPS médio alto mas 1% Low baixo', 'Falta de Cache L3'], pleasureTriggers: ['Tecnologias de Cache Vertical (3D V-Cache)', 'Frametime consistente', '1% Low próximo da média'], implementationNotes: 'Média de FPS engana. Penalizar CPUs com quedas bruscas.' },
        { scoreKey: 'c3', label: 'Custo Total da Plataforma', weight: 0.15, painTriggers: ['CPU barata que exige placa-mãe/RAM caríssima', 'Necessidade de cooler líquido caro'], pleasureTriggers: ['Combo CPU + Placa + Cooler acessível', 'Funciona bem com Air Cooler barato', 'Reuso de memória DDR4'], implementationNotes: 'Comparar preço do "Kit Upgrade" completo, não só da CPU.' },
        { scoreKey: 'c4', label: 'Confiabilidade (Silício)', weight: 0.12, painTriggers: ['Histórico de degradação física (Oxidação/Instabilidade)', 'Necessidade de update de BIOS crítico', 'Drivers instáveis'], pleasureTriggers: ['Arquitetura madura e provada', 'Baixo índice de falha (RMA)', 'Estabilidade "Out of the Box"'], implementationNotes: 'Se a geração tem falhas crônicas (ex: Intel 13/14th) → Alerta Vermelho.' },
        { scoreKey: 'c5', label: 'Eficiência Térmica (Cooler)', weight: 0.10, painTriggers: ['Cooler Box "lixo" que deixa a CPU bater 90°C', 'Consumo de energia > 200W', 'Ruído de turbina no cooler padrão'], pleasureTriggers: ['Cooler Box eficiente incluso', 'TDP real baixo', 'Operação fria em jogos'], implementationNotes: 'Se cooler box é ruim, avisar: "Reserve orçamento para cooler extra".' },
        { scoreKey: 'c6', label: 'Equilíbrio (Gargalo)', weight: 0.08, painTriggers: ['CPU muito forte para GPU fraca (Desperdício)', 'CPU fraca que limita a GPU topo de linha'], pleasureTriggers: ['Sinergia ideal para a resolução alvo', 'Orçamento balanceado'], implementationNotes: 'Para 4K, CPU intermediária basta. Para 1080p competitivo, CPU forte é vital.' },
        { scoreKey: 'c7', label: 'Limitações de APU (Vídeo Integrado)', weight: 0.08, painTriggers: ['APU com cortes severos (Cache L3 metade/PCIe lento)', 'Desempenho ruim com GPU dedicada futura'], pleasureTriggers: ['Gráfico integrado robusto para jogar sem placa', 'Solução temporária econômica eficiente'], implementationNotes: 'Avisar que APUs (série G) são piores quando se usa placa dedicada.' },
        { scoreKey: 'c8', label: 'Arquitetura (Híbrida vs. Pura)', weight: 0.05, painTriggers: ['Jogos rodando nos "núcleos fracos" (E-Cores) por erro', 'Exigência de Windows 11 para funcionar bem'], pleasureTriggers: ['Arquitetura de núcleos puros (Simplicidade)', 'Scheduler do SO otimizado', 'Multitarefa real eficiente'], implementationNotes: 'Híbrido é ótimo para trabalho, mas pode exigir ajustes para jogos antigos.' },
        { scoreKey: 'c9', label: 'Pós-Venda & Revenda', weight: 0.05, painTriggers: ['RMA internacional burocrático', 'Desvalorização rápida do usado (Socket morto)'], pleasureTriggers: ['RMA nacional ágil', 'Alta liquidez no mercado de usados (AM4)', 'Valor residual alto'], implementationNotes: 'CPUs de plataformas longevas (AM4) vendem rápido e bem usadas.' },
        { scoreKey: 'c10', label: 'Marketing vs. Realidade', weight: 0.02, painTriggers: ['Frequência (GHz) alta que não se traduz em performance', '"IA/NPU" inútil para jogos atuais'], pleasureTriggers: ['Alto IPC (Instruções por Clock)', 'Recursos que o software realmente usa'], implementationNotes: 'Ignorar o hype de IA se não houver uso prático. Focar em FPS real.' },
    ],
};
