/**
 * @file washer.ts
 * @description Playbook de critérios para Máquinas de Lavar importado de "10 dores.txt"
 * 
 * Pesos: 15+15+12+10+10+10+8+8+7+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const WASHER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'washer',
    displayName: 'Máquinas de Lavar',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Integridade Eletrônica (Placa)',
            weight: 0.15,
            painTriggers: [
                'Placa eletrônica sem resina (Queima com umidade)',
                'Custo de reparo > 50% do valor da máquina',
                'Histórico de falha logo após a garantia (Obsolescência)',
            ],
            pleasureTriggers: [
                'Placa resinada/protegida (Tropicalização)',
                'Painel mecânico robusto (Tanquinho/Colormaq)',
                'Garantia estendida na placa',
            ],
            implementationNotes: 'Filtro de Sobrevivência: Se Local = "Área Externa/Úmida" → ELIMINAR modelos com histórico de queima de placa. Alertar: "Proteja sua máquina da chuva/umidade".',
        },
        {
            scoreKey: 'c2',
            label: 'Eficiência Mecânica (Lavagem)',
            weight: 0.15,
            painTriggers: [
                'Agitador agressivo (Rasga roupa/Bolinhas)',
                'Roupa sai suja em ciclo normal',
                'Manchas de sabão não diluído',
            ],
            pleasureTriggers: [
                'Sistema Ciclone (Panasonic - Sem agitador)',
                'Tombamento (Front Load - Suave e eficiente)',
                'Diluição inteligente de sabão',
            ],
            implementationNotes: 'Preservação: Diferenciar "Força Bruta" (Agitador) de "Eficiência" (Tombamento/Ciclone). Valorizar sistemas que lavam bem a frio.',
        },
        {
            scoreKey: 'c3',
            label: 'Termodinâmica de Secagem',
            weight: 0.12,
            painTriggers: [
                'Roupa sai quente mas úmida (Duto entupido)',
                'Capacidade de secagem < 60% da lavagem',
                'Cheiro de queimado/borracha',
            ],
            pleasureTriggers: [
                'Secagem por condensação eficiente',
                'Ciclo de autolimpeza de dutos',
                'Capacidade real equilibrada (ex: 12kg/8kg)',
            ],
            implementationNotes: 'Alerta Híbrido: Avisar que Lava e Seca exige manutenção de dutos. Penalizar modelos com baixa capacidade de secagem.',
        },
        {
            scoreKey: 'c4',
            label: 'Gestão de Fiapos',
            weight: 0.10,
            painTriggers: [
                'Filtro passivo que não pega nada (Roupa preta sai branca)',
                'Filtro inacessível (Entope bomba)',
            ],
            pleasureTriggers: [
                'Filtro ativo com recirculação de água',
                'Acesso fácil (Porta moeda frontal)',
                'Filtro flutuante eficaz',
            ],
            implementationNotes: 'Teste do Pelo: Se Usuário = "Dono de Pet" → Exigir filtro ativo ou sistema de tombamento.',
        },
        {
            scoreKey: 'c5',
            label: 'Ergonomia & Espaço',
            weight: 0.10,
            painTriggers: [
                'Cesto fundo demais (Difícil pegar roupa)',
                'Porta que não abre 180 graus',
                'Ocupa muito espaço para pouca capacidade',
            ],
            pleasureTriggers: [
                'Porta AddWash (Adicionar roupa)',
                'Design empilhável (Stacking)',
                'Boca larga e cesto raso',
            ],
            implementationNotes: 'Usabilidade: Front Load exige agachamento (Alerta para idosos). Top Load é melhor para coluna, mas pior para roupa.',
        },
        {
            scoreKey: 'c6',
            label: 'Acústica & Vibração',
            weight: 0.10,
            painTriggers: [
                '"Máquina andante" na centrifugação',
                'Ruído de correia/motor agudo',
                'Vibração estrutural que incomoda vizinho',
            ],
            pleasureTriggers: [
                'Motor Inverter Direct Drive (Silêncio)',
                'Sistema de balanceamento automático',
                'Pés ajustáveis robustos',
            ],
            implementationNotes: 'Conforto: Recomendar Direct Drive para apartamentos. Penalizar modelos "batedeira".',
        },
        {
            scoreKey: 'c7',
            label: 'Manutenibilidade & Higiene',
            weight: 0.08,
            painTriggers: [
                'Biofilme/Mofo na borracha (Cheiro ruim)',
                'Cesto de plástico (Retém sujeira)',
                'Peças proprietárias caras',
            ],
            pleasureTriggers: [
                'Cesto 100% Aço Inox (Higiênico)',
                'Ciclo Tub Clean (Esterilização)',
                'Peças genéricas disponíveis',
            ],
            implementationNotes: 'Saúde: Valorizar cesto inox integral (Panasonic/Premium). Alertar sobre limpeza da borracha em Front Load.',
        },
        {
            scoreKey: 'c8',
            label: 'Sustentabilidade (Água)',
            weight: 0.08,
            painTriggers: [
                'Consumo > 150L por ciclo (Top Load antiga)',
                'Enxágue ineficiente (Alergia a sabão)',
            ],
            pleasureTriggers: [
                'Sensores de carga (Smartsense)',
                'Autodose (Economia de sabão)',
                'Consumo < 60L (Front Load)',
            ],
            implementationNotes: 'Economia: Front Load paga a diferença de preço na conta de água em 2-3 anos.',
        },
        {
            scoreKey: 'c9',
            label: 'Custo-Benefício (TCO)',
            weight: 0.07,
            painTriggers: [
                'Máquina barata que estraga roupa cara',
                'Peça de reposição custa 60% da máquina nova',
            ],
            pleasureTriggers: [
                'Durabilidade comprovada > 5 anos',
                'Baixo custo de manutenção',
                'Melhor eficiência por Real gasto',
            ],
            implementationNotes: 'Investimento: Tanquinho é o rei do custo, Front Load é o rei do benefício a longo prazo.',
        },
        {
            scoreKey: 'c10',
            label: 'Conectividade IoT',
            weight: 0.05,
            painTriggers: [
                'App que desconecta sempre',
                'Funções inúteis (Ligar remoto sem roupa)',
            ],
            pleasureTriggers: [
                'Notificação de fim de ciclo (Útil)',
                'Diagnóstico de erro via App (Smart Diagnosis)',
                'Integração Alexa real',
            ],
            implementationNotes: 'Utilidade: Só pontuar se o App resolver problemas reais (diagnóstico/aviso).',
        },
    ],
};
