/**
 * @file ups.ts
 * @description Playbook de critérios para Nobreaks (UPS) importado de "10 dores.txt"
 * 
 * Pesos: 25+20+10+10+10+8+5+5+4+3 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const UPS_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'ups',
    displayName: 'Nobreaks (UPS)',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Forma de Onda (Compatibilidade)',
            weight: 0.25,
            painTriggers: [
                'Onda Quadrada/PWM em PC Gamer com Fonte PFC Ativo (Risco de desligamento/dano)',
                'Rótulo "Gamer" em nobreak semi-senoidal',
            ],
            pleasureTriggers: [
                'Onda Senoidal Pura (Essencial para PCs modernos)',
                'Topologia Online de Dupla Conversão (Proteção total)',
            ],
            implementationNotes: 'Filtro de Segurança: Se Carga = "PC Gamer" ou "Servidor" → ELIMINAR Onda Quadrada/PWM. Alertar: "Risco de incompatibilidade com fontes PFC Ativo".',
        },
        {
            scoreKey: 'c2',
            label: 'Potência Real (Watts) & Fator de Potência',
            weight: 0.20,
            painTriggers: [
                'Fator de Potência < 0.6 (Ex: 1200VA que entrega só 600W)',
                'Sobrecarga imediata ao abrir jogo pesado',
            ],
            pleasureTriggers: [
                'Fator de Potência > 0.9 (Eficiência)',
                'Margem de segurança de 30% sobre o consumo do usuário',
            ],
            implementationNotes: 'Calculadora de Realidade: Ignorar VA. Calcular Watts Reais (VA * FP). Se Watts Reais < Consumo Estimado → Classificar como "Insuficiente".',
        },
        {
            scoreKey: 'c3',
            label: 'Manutenibilidade (Bateria)',
            weight: 0.10,
            painTriggers: [
                'Bateria interna inacessível (Exige desmontar/perder garantia)',
                'Bateria proprietária cara',
            ],
            pleasureTriggers: [
                'Compartimento de "Troca Fácil" (Acesso externo)',
                'Uso de baterias padrão de mercado (12V 7Ah/9Ah)',
            ],
            implementationNotes: 'Índice de TCO: Bonificar modelos que permitem troca de bateria pelo usuário sem ferramentas complexas. Exibir custo médio da bateria de reposição.',
        },
        {
            scoreKey: 'c4',
            label: 'Conforto Acústico (Ruído)',
            weight: 0.10,
            painTriggers: [
                'Ventoinha "Turbina" sempre ligada (Inviável para quarto)',
                'Alarme sonoro sem botão de silêncio (Mute) físico',
            ],
            pleasureTriggers: [
                'Controle inteligente de ventoinha (Só liga na bateria/carga alta)',
                'Operação silenciosa (< 40dB)',
            ],
            implementationNotes: 'Filtro de Ambiente: Se Local = "Quarto/Home Office" → Penalizar modelos ruidosos.',
        },
        {
            scoreKey: 'c5',
            label: 'Conectividade & Software',
            weight: 0.10,
            painTriggers: [
                '"Nobreak Cego" (Sem porta USB)',
                'Software incompatível com Windows 11/Linux',
                'Falta de "Graceful Shutdown" (Desligamento automático)',
            ],
            pleasureTriggers: [
                'Porta USB com suporte HID nativo (Plug & Play)',
                'Monitoramento de tensão/carga em tempo real',
            ],
            implementationNotes: 'Proteção de Dados: Para "Servidor/NAS", a porta USB é mandatória. Bonificar software que envia notificação de queda de energia.',
        },
        {
            scoreKey: 'c6',
            label: 'Autonomia & Expansibilidade',
            weight: 0.08,
            painTriggers: [
                'Autonomia < 5 min em carga média (Só dá tempo de salvar)',
                'Conector de bateria externa proprietário/caro',
            ],
            pleasureTriggers: [
                'Conector de engate rápido para módulo externo',
                'Capacidade de "Longa Duração" (> 1h com bateria extra)',
            ],
            implementationNotes: 'Resiliência: Valorizar a opção de expansão para cenários de apagões longos (Home Office/Internet).',
        },
        {
            scoreKey: 'c7',
            label: 'Proteção de Rede (Dados)',
            weight: 0.05,
            painTriggers: [
                'Porta RJ45 limitada a 10/100 Mbps (Gargalo de internet)',
                'Introdução de ruído na linha DSL',
            ],
            pleasureTriggers: [
                'Porta RJ45 Gigabit (10/100/1000) com proteção contra surto',
                'Pass-through transparente',
            ],
            implementationNotes: 'Alerta de Performance: Se Porta = 10/100 → Exibir alerta vermelho: "Limita sua internet fibra a 100 Mega".',
        },
        {
            scoreKey: 'c8',
            label: 'Ergonomia (Tomadas)',
            weight: 0.05,
            painTriggers: [
                'Tomadas muito próximas (Bloqueadas por fontes grandes)',
                'Cabo de força fixo e curto',
            ],
            pleasureTriggers: [
                'Espaçamento generoso para fontes "tijolo"',
                'Cabo de entrada removível (Padrão IEC)',
            ],
            implementationNotes: 'Usabilidade: Verificar se o design permite usar todas as tomadas simultaneamente.',
        },
        {
            scoreKey: 'c9',
            label: 'Estabilização Interna',
            weight: 0.04,
            painTriggers: [
                '"Tec-Tec" constante de relés (Histerese ruim)',
                'Faixa de entrada estreita (Entra em bateria à toa)',
            ],
            pleasureTriggers: [
                'Estabilizador silencioso ou Online (Sem tempo de transferência)',
                'Ampla faixa de tensão de entrada',
            ],
            implementationNotes: 'Qualidade Elétrica: Penalizar modelos que ficam chaveando bateria desnecessariamente, reduzindo sua vida útil.',
        },
        {
            scoreKey: 'c10',
            label: 'Suporte & Garantia',
            weight: 0.03,
            painTriggers: [
                'Garantia de bateria < 3 meses',
                'Exigência de envio por correio (Custo de frete alto)',
            ],
            pleasureTriggers: [
                'Rede de assistência técnica capilar (Presencial)',
                'Garantia de bateria estendida (1 ano)',
            ],
            implementationNotes: 'Confiança: Exibir claramente: "Garantia Bateria vs. Garantia Equipamento".',
        },
    ],
};
