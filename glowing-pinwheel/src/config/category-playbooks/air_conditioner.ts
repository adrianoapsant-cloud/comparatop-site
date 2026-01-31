/**
 * @file air_conditioner.ts
 * @description Playbook de critérios para Ar-Condicionado importado de "10 dores.txt"
 * 
 * Pesos: 25+20+15+10+8+5+5+5+5+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const AIR_CONDITIONER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'air_conditioner',
    displayName: 'Ar-Condicionado',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Integridade da Serpentina (Material)',
            weight: 0.25,
            painTriggers: [
                'Serpentina de Alumínio em unidade externa (Risco de corrosão/irreparável)',
                'Falta de proteção anticorrosiva',
            ],
            pleasureTriggers: [
                'Serpentina de Cobre 100% (Durável e soldável)',
                'Proteção Gold Fin / Blue Fin (Litoral)',
                'Tubulação ranhurada (Maior troca térmica)',
            ],
            implementationNotes: 'Filtro de Litoral: Se Local = "Litoral" → ELIMINAR Alumínio imediatamente. Alertar: "Alumínio oxida e não dá reparo".',
        },
        {
            scoreKey: 'c2',
            label: 'Eficiência Energética (IDRS/Inmetro)',
            weight: 0.20,
            painTriggers: [
                'Classificação "A" antiga (Baixo IDRS < 5.5)',
                'Compressor On/Off (Gasta 40% mais)',
                'Gás R-410A (Saindo de linha)',
            ],
            pleasureTriggers: [
                'IDRS > 7.0 (Alta eficiência)',
                'Gás R-32 (Puro, eficiente e fácil recarga)',
                'Compressor Inverter ou Dual Inverter',
            ],
            implementationNotes: 'Custo Operacional: Calcular TCO (Preço + Energia 5 anos). Bonificar R-32 por ser o futuro padrão.',
        },
        {
            scoreKey: 'c3',
            label: 'Ecossistema de Garantia',
            weight: 0.15,
            painTriggers: [
                'Garantia que exige instalador credenciado raro/caro',
                'Burocracia para peça de reposição',
                'Garantia de apenas 90 dias se instalado por autônomo',
            ],
            pleasureTriggers: [
                'Garantia incondicional (Qualquer técnico CRT)',
                '10 anos no compressor com regras claras',
                'Rede credenciada capilar',
            ],
            implementationNotes: 'Segurança: Alertar: "Garantia de 10 anos só vale com instalador da marca".',
        },
        {
            scoreKey: 'c4',
            label: 'Acústica (Ruído)',
            weight: 0.10,
            painTriggers: [
                'Unidade externa "Helicóptero" (Vibração excessiva)',
                'Estalos de plástico na unidade interna (Dilatação)',
                'Ruído > 25dB no modo Sleep',
            ],
            pleasureTriggers: [
                'Unidade Interna < 21dB (Inaudível)',
                'Compressor Twin Rotary (Baixa vibração)',
                'Ventilador Skew Fan (Fluxo suave)',
            ],
            implementationNotes: 'Conforto Noturno: Penalizar modelos com relatos de "estalos" noturnos. Valorizar silêncio para quartos.',
        },
        {
            scoreKey: 'c5',
            label: 'Conforto de Fluxo de Ar',
            weight: 0.08,
            painTriggers: [
                'Vento gelado direto nas pessoas (Sem defletor bom)',
                'Controle de aletas manual',
                'Ressecamento excessivo do ar',
            ],
            pleasureTriggers: [
                'Tecnologia WindFree (Sem vento direto)',
                'Efeito Coanda (Ar pelo teto)',
                'Controle de umidade',
            ],
            implementationNotes: 'Saúde: Se Usuário = "Sensível/Idoso" → Recomendar WindFree ou Defletor Inteligente.',
        },
        {
            scoreKey: 'c6',
            label: 'Usabilidade Noturna (Display)',
            weight: 0.05,
            painTriggers: [
                'Display que não apaga (Ilumina o quarto)',
                'Controle remoto sem luz (Backlight)',
                'Beep alto sem opção de mudo',
            ],
            pleasureTriggers: [
                'Função "Apagar Visor" no controle',
                'Controle iluminado ou fluorescente',
                'Modo Mudo',
            ],
            implementationNotes: 'Sono: Alerta para modelos que iluminam o quarto à noite.',
        },
        {
            scoreKey: 'c7',
            label: 'Conectividade & IoT',
            weight: 0.05,
            painTriggers: [
                'Wi-Fi opcional (Kit vendido à parte)',
                'App instável que perde configuração',
                'Sem integração Alexa/Google',
            ],
            pleasureTriggers: [
                'Wi-Fi Nativo Integrado',
                'App com medição de consumo (kWh/R$)',
                'Diagnóstico de erro no celular',
            ],
            implementationNotes: 'Controle: Valorizar monitoramento de energia em tempo real.',
        },
        {
            scoreKey: 'c8',
            label: 'Saúde (Qualidade do Ar)',
            weight: 0.05,
            painTriggers: [
                'Filtro de tela simples (Só pega poeira grossa)',
                'Cheiro de "pano molhado" (Mofo interno)',
            ],
            pleasureTriggers: [
                'Luz UV-C (Esterilização interna)',
                'Gerador de Íons (Vírus Doctor/Nanoe)',
                'Filtro Easy Clean (Fácil acesso superior)',
            ],
            implementationNotes: 'Higiene: Bonificar UV-C que evita formação de mofo na turbina.',
        },
        {
            scoreKey: 'c9',
            label: 'Desempenho Térmico (Capacidade)',
            weight: 0.05,
            painTriggers: [
                'Não atinge a temperatura em dias de 35°C+',
                'Capacidade real < Nominal (8500 em vez de 9000)',
                'Demora para gelar',
            ],
            pleasureTriggers: [
                'Modo Turbo/Jet eficaz',
                'Capacidade de sobrar (Overclock)',
                'Estabilidade sem oscilar',
            ],
            implementationNotes: 'Performance: Penalizar marcas "White Label" que não entregam o BTU prometido.',
        },
        {
            scoreKey: 'c10',
            label: 'Versatilidade (Quente/Frio)',
            weight: 0.02,
            painTriggers: [
                'Comprar "Só Frio" no Sul/Sudeste (Erro econômico)',
                'Aquecimento ineficiente (Resistência)',
            ],
            pleasureTriggers: [
                'Ciclo Reverso (Bomba de Calor eficiente)',
                'Desumidificação ativa no inverno',
            ],
            implementationNotes: 'Investimento: No Sul/Sudeste, recomendar Quente/Frio como padrão.',
        },
    ],
};
