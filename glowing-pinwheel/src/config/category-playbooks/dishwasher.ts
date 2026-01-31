/**
 * @file dishwasher.ts
 * @description Playbook de critérios para Lava-Louças importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+10+5+5+5+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const DISHWASHER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'dishwasher',
    displayName: 'Lava-Louças',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Capacidade Real (Panelas)',
            weight: 0.20,
            painTriggers: [
                'Modelo de 8 serviços onde não cabe panela de pressão',
                'Cesto inferior com pinos fixos (Não acomoda travessas)',
                'Cesto superior que bate em pratos grandes',
            ],
            pleasureTriggers: [
                'Capacidade de 14 serviços (Padrão Ouro)',
                'Cestos com dentes rebatíveis (Flexibilidade)',
                'Ajuste de altura do cesto superior (Rackmatic)',
            ],
            implementationNotes: 'Teste da Panela de Pressão: Se Uso = "Cozinha Diária" → Recomendar 14 Serviços. 8 Serviços é apenas para louça de mesa.',
        },
        {
            scoreKey: 'c2',
            label: 'Performance de Limpeza',
            weight: 0.15,
            painTriggers: [
                'Exige pré-lavagem na pia (Mito que a máquina não lava)',
                'Filtro de resíduos difícil de limpar',
                'Ciclos frios ineficazes',
            ],
            pleasureTriggers: [
                'Ciclo "Panelas" ou "Intenso" (70°C)',
                'Sensor de sujeira (Ajuste automático)',
                'Aspersor satélite/quadwash (Cobre cantos)',
            ],
            implementationNotes: 'Eficácia: Máquina boa não exige pré-lavagem. Penalizar modelos fracos.',
        },
        {
            scoreKey: 'c3',
            label: 'Secagem (Plásticos)',
            weight: 0.15,
            painTriggers: [
                'Potes plásticos saem molhados (Condensação simples)',
                'Cheiro de "cachorro molhado" se deixar fechada',
            ],
            pleasureTriggers: [
                'Abertura Automática da Porta (Auto-Open)',
                'Secagem ativa (Ventoinha)',
                'Função Extra Seca eficaz',
            ],
            implementationNotes: 'Diferencial: Auto-Open é o recurso mais valioso para secagem real.',
        },
        {
            scoreKey: 'c4',
            label: 'Integridade (Ferrugem)',
            weight: 0.10,
            painTriggers: [
                'Cestos que enferrujam/descascam em 2 anos',
                'Cuba de plástico (Híbrida)',
                'Haste do aspersor solta',
            ],
            pleasureTriggers: [
                'Cestos com revestimento espesso (Cinza)',
                'Cuba 100% Aço Inox',
                'Garantia estendida nos cestos',
            ],
            implementationNotes: 'Durabilidade: Monitorar relatos de "Cesto Enferrujado" no Reclame Aqui.',
        },
        {
            scoreKey: 'c5',
            label: 'Instalação (Infraestrutura)',
            weight: 0.10,
            painTriggers: [
                'Erro E4 recorrente (Vazamento por instalação errada)',
                'Mangueiras curtas demais',
                'Tomada derretida (Uso de adaptador 20A)',
            ],
            pleasureTriggers: [
                'Mangueiras longas inclusas',
                'Manual de instalação elétrica claro',
                'Tolerância a pressão de água variável',
            ],
            implementationNotes: 'Segurança: Alertar: "Verifique se a saída de esgoto tem o loop elevado".',
        },
        {
            scoreKey: 'c6',
            label: 'Acústica (Ruído)',
            weight: 0.10,
            painTriggers: [
                'Ruído > 49dB (Incomoda na sala)',
                'Som de água batendo na lata (Isolamento ruim)',
            ],
            pleasureTriggers: [
                'Ruído < 44dB (Silenciosa)',
                'Motor Inverter (Sem escovas)',
                'Isolamento acústico com manta betuminosa',
            ],
            implementationNotes: 'Conforto: Essencial para cozinhas integradas/americanas.',
        },
        {
            scoreKey: 'c7',
            label: 'Ergonomia (3º Cesto)',
            weight: 0.05,
            painTriggers: [
                'Cesto de talheres que ocupa espaço de panelas',
                'Dificuldade de carregar talheres',
            ],
            pleasureTriggers: [
                '3º Cesto (Bandeja de talheres superior)',
                'Cesto de talheres móvel/divisível',
            ],
            implementationNotes: 'Organização: 3º Cesto libera muito espaço no andar de baixo.',
        },
        {
            scoreKey: 'c8',
            label: 'TCO (Economia)',
            weight: 0.05,
            painTriggers: [
                'Consumo alto de água (> 20L/ciclo)',
                'Exige sabão tablete caro para lavar bem',
            ],
            pleasureTriggers: [
                'Consumo < 10L (Eco)',
                'Funciona bem com sabão em pó (Barato)',
                'Dosador de secante preciso',
            ],
            implementationNotes: 'Sustentabilidade: Lava-louças economiza 80% de água vs. pia. Destacar isso.',
        },
        {
            scoreKey: 'c9',
            label: 'Manutenibilidade',
            weight: 0.05,
            painTriggers: [
                'Peças de reposição indisponíveis',
                'Filtro que entope fácil',
            ],
            pleasureTriggers: [
                'Acesso fácil ao filtro e bomba',
                'Rede de assistência ampla',
                'Peças genéricas compatíveis',
            ],
            implementationNotes: 'Pós-Venda: Valorizar marcas nacionais pela facilidade de peças.',
        },
        {
            scoreKey: 'c10',
            label: 'Conectividade',
            weight: 0.05,
            painTriggers: [
                'App lento e inútil',
                'Wi-Fi cai sempre',
            ],
            pleasureTriggers: [
                'Notificação de "Fim de Ciclo" (Útil)',
                'Aviso de falta de secante no celular',
                'Download de ciclos especiais (Silencioso/Cristais)',
            ],
            implementationNotes: 'Bônus: Útil para saber quando esvaziar a máquina.',
        },
    ],
};
