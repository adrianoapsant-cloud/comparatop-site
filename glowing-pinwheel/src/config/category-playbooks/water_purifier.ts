/**
 * @file water_purifier.ts
 * @description Playbook de critérios para Purificadores de Água importado de "10 dores.txt"
 * 
 * Pesos: 20+20+15+10+10+5+5+5+5+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const WATER_PURIFIER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'water_purifier',
    displayName: 'Purificadores de Água',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Tecnologia de Refrigeração',
            weight: 0.20,
            painTriggers: [
                'Placa Eletrônica (Peltier) em regiões quentes (água natural a 20°C)',
                'Ventoinha barulhenta por sujeira',
                'Reservatório < 800ml (1 copo gelado e acabou)',
            ],
            pleasureTriggers: [
                'Compressor (Gela rápido e constante)',
                'Reservatório > 1.5L (Jarra completa gelada)',
                'Independência da temperatura externa',
            ],
            implementationNotes: 'Fator Climático: Se Local = "Norte/Nordeste/Centro-Oeste" → ELIMINAR Peltier. Alertar: "Eletrônico não gela bem acima de 30°C".',
        },
        {
            scoreKey: 'c2',
            label: 'Eficiência de Filtragem (Inmetro)',
            weight: 0.20,
            painTriggers: [
                'Classe C (Deixa passar sedimentos finos)',
                'Sem eficiência bacteriológica (Risco de saúde)',
                'Gosto residual de cloro',
            ],
            pleasureTriggers: [
                'Classe A (Retenção máxima de partículas)',
                'Eficiência Bacteriológica Aprovada',
                'Carvão Ativado de alta densidade',
            ],
            implementationNotes: 'Segurança Sanitária: Se Preço > R$ 500 e Classe = C → Penalizar (Custo-benefício ruim). Exigir "Bacteriológico" para casas com caixa d\'água velha.',
        },
        {
            scoreKey: 'c3',
            label: 'Vazão Hidráulica',
            weight: 0.15,
            painTriggers: [
                '"Conta-gotas" (Demora 1 min para encher copo)',
                'Sensível a baixa pressão (Casa térrea)',
                'Jato fraco que respinga',
            ],
            pleasureTriggers: [
                'Vazão > 60 L/h (Enchimento rápido)',
                'Jato constante e direcionado',
                'Funciona bem com baixa pressão (3 mca)',
            ],
            implementationNotes: 'Teste de Paciência: Se Pressão da Casa = Baixa → Recomendar modelos de alta vazão (Consul/IBBL). Penalizar modelos com histórico de entupimento precoce.',
        },
        {
            scoreKey: 'c4',
            label: 'Custo Total (TCO) & Refil',
            weight: 0.10,
            painTriggers: [
                'Refil proprietário caro (> R$ 100) com vida curta',
                'Troca difícil (Exige técnico)',
                'Falta de compatíveis no mercado',
            ],
            pleasureTriggers: [
                'Refil "Troca Fácil" (Girou-Trocou)',
                'Mercado de compatíveis barato (R$ 30-40)',
                'Vida útil > 3.000 Litros',
            ],
            implementationNotes: 'Calculadora de Bolso: Exibir "Custo Anual de Manutenção" junto ao preço. Valorizar refis de longa duração (9-12 meses).',
        },
        {
            scoreKey: 'c5',
            label: 'Robustez & Manutenção',
            weight: 0.10,
            painTriggers: [
                'Queima de placa eletrônica (Surto de energia)',
                'Vazamento interno (Inundação)',
                'Peças plásticas frágeis (Torneira quebra)',
            ],
            pleasureTriggers: [
                'Compressor mecânico durável (10+ anos)',
                'Conexões seguras e acessíveis',
                'Facilidade de limpeza do reservatório',
            ],
            implementationNotes: 'Durabilidade: Penalizar modelos eletrônicos com alto índice de "Não Liga" no Reclame Aqui.',
        },
        {
            scoreKey: 'c6',
            label: 'Ergonomia (Garrafas)',
            weight: 0.05,
            painTriggers: [
                'Bica muito baixa (Não cabe garrafa térmica/Squeeze)',
                'Botão duro ou touch falho',
                'Bandeja pequena que transborda',
            ],
            pleasureTriggers: [
                'Altura livre > 25cm (Enche garrafa de pé)',
                'Bica articulada ou móvel',
                'Acionamento leve/automático',
            ],
            implementationNotes: 'Uso Diário: Se Uso = "Esporte/Academia" → Exigir altura para garrafas grandes. Penalizar designs que obrigam a segurar o copo inclinado.',
        },
        {
            scoreKey: 'c7',
            label: 'Instalação & Espaço',
            weight: 0.05,
            painTriggers: [
                'Exige ponto elétrico e hidráulico complexo',
                'Nicho sem ventilação (Sufoca o aparelho)',
                'Suporte de parede frágil',
            ],
            pleasureTriggers: [
                'Kit instalação completo incluso',
                'Compacto real (Profundidade pequena)',
                'Funciona sem energia (apenas natural)',
            ],
            implementationNotes: 'Versatilidade: Alertar sobre necessidade de ventilação para modelos de compressor.',
        },
        {
            scoreKey: 'c8',
            label: 'Acústica',
            weight: 0.05,
            painTriggers: [
                'Ventoinha com zumbido agudo (Peltier velho)',
                'Vibração excessiva do compressor',
            ],
            pleasureTriggers: [
                'Compressor silencioso com coxins',
                'Modo noturno (Desliga luzes/sons)',
            ],
            implementationNotes: 'Conforto: Diferenciar ruído de motor (grave) de ventoinha (agudo).',
        },
        {
            scoreKey: 'c9',
            label: 'Tecnologias Extras (UV/Ozônio)',
            weight: 0.05,
            painTriggers: [
                'Marketing de "Saúde" sem comprovação',
                'Ozônio com cheiro forte residual',
            ],
            pleasureTriggers: [
                'Luz UV (Esterilização real)',
                'Água Alcalina (Sabor leve)',
                'Indicador de troca de refil confiável',
            ],
            implementationNotes: 'Bônus Tecnológico: Valorizar UV como camada extra de segurança para bebês/idosos.',
        },
        {
            scoreKey: 'c10',
            label: 'Suporte & Marca',
            weight: 0.05,
            painTriggers: [
                'Marca sem refil no varejo local',
                'SAC inexistente',
            ],
            pleasureTriggers: [
                'Refil em qualquer supermercado',
                'Rede de assistência técnica ampla',
            ],
            implementationNotes: 'Conveniência: A facilidade de achar o refil é crucial a longo prazo.',
        },
    ],
};
