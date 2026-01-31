/**
 * @file washer_dryer.ts
 * @description Playbook de critérios para Lava e Seca importado de "10 dores.txt"
 * 
 * Pesos: 15+15+12+12+10+8+8+8+7+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const WASHER_DRYER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'washer_dryer',
    displayName: 'Lava e Seca',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Durabilidade Mecânica (Eixo Tripé)',
            weight: 0.15,
            painTriggers: [
                'Eixo Tripé de alumínio/zamac que corrói em 3-5 anos (Falha comum Samsung antiga)',
                'Custo de reparo > 50% do valor da máquina',
            ],
            pleasureTriggers: [
                'Motor Inverter Direct Drive (LG - Sem correia)',
                'Tripé reforçado ou revestido',
                'Garantia de 10 anos no motor',
            ],
            implementationNotes: 'Filtro de Sobrevivência: Se Marca = "Samsung" → Verificar se o modelo é da nova linha "T" (reforçada). Penalizar modelos com histórico de "Eixo Quebrado".',
        },
        {
            scoreKey: 'c2',
            label: 'Segurança de Secagem',
            weight: 0.15,
            painTriggers: [
                'Cheiro de "borracha queimada" persistente',
                'Histórico de Recall (Ex: Midea)',
                'Roupa sai úmida e quente (Sensor falho)',
            ],
            pleasureTriggers: [
                'Sensores de umidade precisos (Não esturrica a roupa)',
                'Ciclo de limpeza de dutos',
                'Ausência de recalls ativos',
            ],
            implementationNotes: 'Alerta de Segurança: Se Modelo = "Recall Midea" → ELIMINAR recomendação até correção comprovada. Avisar sobre "cheiro de cura" normal nas primeiras semanas.',
        },
        {
            scoreKey: 'c3',
            label: 'Reparabilidade & Peças',
            weight: 0.12,
            painTriggers: [
                'Placa eletrônica queimada sem peça de reposição',
                'Peça proprietária caríssima (R$ 1.500+)',
                'Demora de 30 dias para importar peça',
            ],
            pleasureTriggers: [
                'Peças disponíveis no Mercado Livre (Samsung/LG)',
                'Placa resinada (Proteção contra umidade)',
                'Rede técnica ampla',
            ],
            implementationNotes: 'TCO (Custo): Valorizar marcas líderes (Samsung/LG) pela facilidade de achar peças paralelas baratas.',
        },
        {
            scoreKey: 'c4',
            label: 'Capacidade Real (Regra 2/3)',
            weight: 0.12,
            painTriggers: [
                'Tentar secar edredom em máquina de 11kg (Não cabe/Não seca)',
                'Capacidade de secagem oculta ou muito baixa (<6kg)',
            ],
            pleasureTriggers: [
                'Capacidade de Secagem > 7kg',
                'Tambor volumoso para tombo da roupa',
                'Clareza: "Lava 11kg / Seca 7kg"',
            ],
            implementationNotes: 'Calculadora de Expectativa: Exibir alerta gigante: "ATENÇÃO: Seca apenas X kg". Se Uso = "Edredom King" → Exigir máquina de 13kg+ ou secadora separada.',
        },
        {
            scoreKey: 'c5',
            label: 'Acústica & Vibração',
            weight: 0.10,
            painTriggers: [
                '"Máquina andante" na centrifugação',
                'Ruído de correia agudo',
                'Vibração que incomoda vizinho em apartamento',
            ],
            pleasureTriggers: [
                'Motor Direct Drive (Silêncio absoluto)',
                'Sistema de balanceamento automático eficaz',
                'Pés ajustáveis robustos',
            ],
            implementationNotes: 'Conforto: Recomendar Direct Drive para apartamentos com cozinha integrada.',
        },
        {
            scoreKey: 'c6',
            label: 'Preservação Têxtil (Amassados)',
            weight: 0.08,
            painTriggers: [
                'Roupa "vulcanizada" (Amassada e quente)',
                'Tecido encolhido por calor excessivo',
            ],
            pleasureTriggers: [
                'Função Vapor (Steam) para desamassar',
                'Tira-Vincos (Tombo pós-secagem)',
                'Lavagem a frio eficiente (EcoBubble)',
            ],
            implementationNotes: 'Cuidado: Valorizar funções de vapor para reduzir a necessidade de passar roupa.',
        },
        {
            scoreKey: 'c7',
            label: 'Conectividade IoT',
            weight: 0.08,
            painTriggers: [
                'App instável que não conecta',
                'Funções inúteis (Ligar remoto sem roupa)',
            ],
            pleasureTriggers: [
                'Notificação de "Fim de Ciclo" (Essencial)',
                'Smart Diagnosis (Identifica erro pelo celular)',
                'Integração Alexa/Google',
            ],
            implementationNotes: 'Utilidade Real: A notificação de fim de ciclo é o "Killer Feature" para evitar cheiro de roupa esquecida.',
        },
        {
            scoreKey: 'c8',
            label: 'Eficiência (Água/Luz)',
            weight: 0.08,
            painTriggers: [
                'Consumo alto na secagem (> 5kWh/ciclo)',
                'Gasto excessivo de água na condensação',
            ],
            pleasureTriggers: [
                'Secagem por bomba de calor (Rara/Cara)',
                'Lavagem a seco (Air Wash) para economizar água',
                'Selo Procel A',
            ],
            implementationNotes: 'Economia: Lembrar que a função "Secar" gasta muito mais luz que "Lavar".',
        },
        {
            scoreKey: 'c9',
            label: 'Agilidade (Ciclos Rápidos)',
            weight: 0.07,
            painTriggers: [
                'Ciclo "Lava e Seca 1h" que não seca jeans',
                'Demora > 4h para ciclo completo padrão',
            ],
            pleasureTriggers: [
                'Ciclo Rápido 15min eficaz',
                'Lava e Seca 59min real (para pequenas cargas)',
                'Opção de "Adicionar Carga" (AddWash)',
            ],
            implementationNotes: 'Praticidade: Esclarecer que ciclos rápidos são apenas para cargas leves (até 1kg).',
        },
        {
            scoreKey: 'c10',
            label: 'Suporte Pós-Venda',
            weight: 0.05,
            painTriggers: [
                'Marca sem técnico na cidade',
                'SAC que não resolve',
            ],
            pleasureTriggers: [
                'Nota alta no Reclame Aqui',
                'Resolução rápida de garantia',
            ],
            implementationNotes: 'Confiança: Philco tem boa nota de SAC, apesar de ser marca de entrada.',
        },
    ],
};
