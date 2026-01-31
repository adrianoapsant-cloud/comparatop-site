/**
 * @file smartwatch.ts
 * @description Playbook de critérios para Smartwatches importado de "10 dores.txt"
 * 
 * Pesos: 20+15+10+10+15+10+10+5+5+0 = 100% ✓
 * Nota: c10 "Peso Variável" tratado como 0% (critério de desempate)
 */

import type { CategoryPlaybook } from './tv';

export const SMARTWATCH_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'smartwatch',
    displayName: 'Smartwatches',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Autonomia Real & Gestão Energética',
            weight: 0.20,
            painTriggers: [
                'Bateria que exige "desligar funções" para durar o dia',
                'Drenagem pós-update (Histórico Apple/Samsung)',
                'Autonomia < 18h com monitoramento ativo',
            ],
            pleasureTriggers: [
                'Autonomia de "Esquecimento" (> 10 dias reais)',
                'Carregamento ultrarrápido (salva o dia em min)',
                'Modo Ultra real (Garmin/Huawei)',
            ],
            implementationNotes: 'Classificação de Perfil: 1. High-Tech (1-2 dias) 2. Sport (5-7 dias) 3. Marathon (14+ dias). Penalizar promessa de marketing vs. realidade com sensores ligados.',
        },
        {
            scoreKey: 'c2',
            label: 'Veracidade Biométrica',
            weight: 0.15,
            painTriggers: [
                'Medidor de Pressão sem manguito (Placebo/Fraude)',
                'Rastreamento de sono impreciso (Falso despertar)',
                'Sensores sem validação clínica',
            ],
            pleasureTriggers: [
                'Pressão Arterial com Manguito (Huawei D2)',
                'Bioimpedância/ECG funcional (Samsung/Apple)',
                'Certificação ANVISA/FDA',
            ],
            implementationNotes: 'Validação de Saúde: Se promete "Pressão Arterial" e usa apenas sensor óptico → Classificar como "Estimativa Não Clínica" ou "Fake".',
        },
        {
            scoreKey: 'c3',
            label: 'Pagamentos & NFC Brasil',
            weight: 0.10,
            painTriggers: [
                'Versão "Global/Chinesa" com NFC bloqueado no Brasil',
                'Suporte proprietário restrito (poucos bancos)',
            ],
            pleasureTriggers: [
                'Google Wallet / Apple Pay nativos (Compatibilidade total)',
                'Samsung Pay (com Knox)',
            ],
            implementationNotes: 'Filtro Regional: Verificar explicitamente: "O NFC funciona em maquininhas brasileiras?". Se não funcionar → Nota Zero neste critério.',
        },
        {
            scoreKey: 'c4',
            label: 'Resistência Hídrica Real',
            weight: 0.10,
            painTriggers: [
                'IP68 morrendo em banho quente (vapor) ou mar',
                'Garantia que nega cobertura por "dano líquido"',
            ],
            pleasureTriggers: [
                'Certificação 5ATM ou 10ATM (Mergulho/Pressão)',
                'Função de expulsão de água do falante',
                'Modo Natação em Mar Aberto',
            ],
            implementationNotes: 'Educação do Usuário: Alertar: "IP68 não é à prova de vapor/sauna". Bonificar construção robusta contra corrosão.',
        },
        {
            scoreKey: 'c5',
            label: 'Software & App Companion',
            weight: 0.15,
            painTriggers: [
                'App instável (Nota < 3.0 nas lojas, ex: Haylou Fun)',
                'Desconexão constante do Bluetooth',
                'Perda de histórico de dados',
            ],
            pleasureTriggers: [
                'Integração Nativa (OneUI/WatchOS)',
                'App Zepp/Huawei Health (Estável e rico em dados)',
                'Sincronização em background invisível',
            ],
            implementationNotes: 'Fator de Estabilidade: Ponderar a nota do hardware pela nota do aplicativo. Hardware bom + App ruim = Não Recomendado.',
        },
        {
            scoreKey: 'c6',
            label: 'Independência (GPS/Music/LTE)',
            weight: 0.10,
            painTriggers: [
                'GPS demorado (>2 min para fixar sinal)',
                'Dependência do celular para música (apenas controle)',
                'Sem suporte a eSIM nacional',
            ],
            pleasureTriggers: [
                'GPS Dual-Band (Precisão em cidades)',
                'Spotify/Deezer Offline (Armazenamento interno)',
                'Suporte a LTE das operadoras BR (Claro/Vivo/Tim)',
            ],
            implementationNotes: 'Teste de "Desconexão": O usuário consegue treinar sem levar o celular? Sim (GPS+Música Offline) = Bônus Máximo.',
        },
        {
            scoreKey: 'c7',
            label: 'Interatividade (Notificações)',
            weight: 0.10,
            painTriggers: [
                '"Pager Glorificado" (Só lê, não responde)',
                'Não exibe emojis/figurinhas (Bug de WhatsApp)',
                'Notificações duplicadas ou atrasadas',
            ],
            pleasureTriggers: [
                'Resposta completa (Teclado QWERTY/Ditado)',
                'Visualização de fotos/áudio no pulso',
                'Assistente de Voz funcional (Google/Alexa)',
            ],
            implementationNotes: 'Níveis de Interação: 1. Passivo 2. Leitor 3. Ativo 4. Completo. Priorizar Nível 3+.',
        },
        {
            scoreKey: 'c8',
            label: 'Tela & Visibilidade Solar',
            weight: 0.05,
            painTriggers: [
                'Painel LCD/TFT (Lavado, baixo ângulo)',
                'Brilho < 500 nits (Invisível ao sol do meio-dia)',
                'Tela de plástico/acrílico (Risca fácil)',
            ],
            pleasureTriggers: [
                'AMOLED > 1000 nits (Legibilidade total)',
                'Vidro de Safira (Anti-risco)',
                'Sensor de luminosidade automático ágil',
            ],
            implementationNotes: 'Requisito Tropical: Penalizar severamente telas LCD em faixas de preço > R$ 300. AMOLED é o padrão mínimo aceitável.',
        },
        {
            scoreKey: 'c9',
            label: 'Suporte & Pós-Venda BR',
            weight: 0.05,
            painTriggers: [
                'Importado "Mercado Cinza" (Sem peças/reparo)',
                'Marcas com representação precária (Ex: Garmin BR)',
                'Custo de reparo > 70% do valor do produto',
            ],
            pleasureTriggers: [
                'Garantia Nacional Oficial de 1 ano',
                'Peças de reposição acessíveis (Bateria/Tela)',
                'Chat de suporte em Português',
            ],
            implementationNotes: 'Índice de Risco: Alertar sobre risco de "Lixo Eletrônico" em importados chineses baratos caso quebrem.',
        },
        {
            scoreKey: 'c10',
            label: 'Custo-Benefício Percebido',
            weight: 0.00, // Peso "Variável" no TXT - usado como critério de desempate
            painTriggers: [
                'Pagar ágio por sensores inúteis (termômetro de pele sem uso)',
                'Preço de revenda nulo (Desvalorização rápida)',
            ],
            pleasureTriggers: [
                'Linhas "FE" ou "Lite" (80% das funções por 40% do preço)',
                'Alto valor de revenda (Apple Watch)',
            ],
            implementationNotes: 'Cálculo de Valor: Comparar preço vs. features úteis reais. Critério variável usado para desempate.',
        },
    ],
};
