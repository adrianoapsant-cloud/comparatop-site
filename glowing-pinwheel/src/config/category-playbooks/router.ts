/**
 * @file router.ts
 * @description Playbook de critérios para Roteadores importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+10+5+5+5+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const ROUTER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'router',
    displayName: 'Roteadores',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Transposição de Alvenaria (RSSI Real)',
            weight: 0.20,
            painTriggers: [
                'Queda de sinal crítica após 2 paredes de tijolo',
                'Roteador que promete "300m²" mas falha em 70m² reais',
                'Dependência exclusiva de 2.4GHz para atravessar parede',
            ],
            pleasureTriggers: [
                'Tecnologia de reforço de sinal (Ex: Wi-Fi 6 Plus Huawei)',
                'Manutenção de >100Mbps após 2 barreiras de concreto',
                'Antenas de alto ganho real (dBi)',
            ],
            implementationNotes: 'Ignorar Marketing de Área: A métrica de "m²" é inválida no Brasil. Avaliar capacidade de perfurar concreto/tijolo.',
        },
        {
            scoreKey: 'c2',
            label: 'Estabilidade Térmica',
            weight: 0.15,
            painTriggers: [
                'Travamentos por superaquecimento (Thermal Throttling)',
                'Necessidade de reiniciar o aparelho semanalmente',
                'Carcaça pequena sem ventilação passiva adequada',
            ],
            pleasureTriggers: [
                'Dissipadores de calor robustos (Carcaça ventilada)',
                'Estabilidade sob carga máxima em ambiente de 30°C',
                '"Instalar e esquecer" (Uptime de meses)',
            ],
            implementationNotes: 'Teste Tropical: Penalizar modelos compactos com histórico de aquecimento. O hardware deve suportar o verão brasileiro sem travar.',
        },
        {
            scoreKey: 'c3',
            label: 'Mesh & Backhaul',
            weight: 0.15,
            painTriggers: [
                'Sistema Mesh sem porta Gigabit (Fast Ethernet 100Mbps)',
                'Queda de 50% na velocidade no 2º nó (Dual-band wireless)',
                'Ecossistema fechado (não aceita outros modelos da marca)',
            ],
            pleasureTriggers: [
                'Suporte a Ethernet Backhaul (Cabo entre os nós)',
                'Tri-Band (Rádio dedicado para comunicação entre nós)',
                'Flexibilidade de mixar modelos',
            ],
            implementationNotes: 'A "Bala de Prata": Se o sistema Mesh permite cabo (backhaul), bonificar ao máximo. Penalizar Mesh Dual-Band puro.',
        },
        {
            scoreKey: 'c4',
            label: 'Performance Gamer (SQM/Latência)',
            weight: 0.10,
            painTriggers: [
                'QoS genérico (apenas limita banda)',
                'Lag em jogos quando alguém assiste Netflix 4K (Bufferbloat)',
                'Pings instáveis',
            ],
            pleasureTriggers: [
                'SQM Real (Smart Queue Management - fq_codel/CAKE)',
                'QoS Adaptativo funcional (Asus)',
                'Priorização de pacotes de jogos comprovada',
            ],
            implementationNotes: 'Diferenciar Marketing de Realidade: Não aceitar "Modo Gamer" que é apenas um LED RGB. Verificar gestão de fila ativa.',
        },
        {
            scoreKey: 'c5',
            label: 'Compatibilidade ISP Brasil',
            weight: 0.10,
            painTriggers: [
                'Falta de suporte a VLAN na WAN (Ex: Vivo Fibra exige VLAN 10/600)',
                'IPv6 bugado ou inexistente',
                'Exige manter modem da operadora em modo Router (Duplo NAT)',
            ],
            pleasureTriggers: [
                'Configuração de VLAN nativa e fácil',
                'Perfis pré-configurados para ISPs brasileiros (Intelbras)',
                'Suporte robusto a IPv6 (SLAAC/DHCPv6)',
            ],
            implementationNotes: 'Filtro de Localização: Se o roteador não faz VLAN tagging na WAN, ele é incompatível com grandes operadoras sem "gambiarras".',
        },
        {
            scoreKey: 'c6',
            label: 'Custo Oculto (Paywalls)',
            weight: 0.10,
            painTriggers: [
                'Cobrança mensal para Controle Parental (Ex: TP-Link HomeShield Pro)',
                'Relatórios de uso bloqueados por assinatura',
                'Funcionalidades de segurança pagas à parte',
            ],
            pleasureTriggers: [
                'Recursos vitalícios gratuitos (Ex: Asus AiProtection)',
                'Controle Parental completo nativo sem mensalidade',
            ],
            implementationNotes: 'Cálculo de TCO: Preço Real = Hardware + (Assinatura Mensal x 24 meses). Penalizar "Hardware as a Service".',
        },
        {
            scoreKey: 'c7',
            label: 'Alta Densidade (IoT)',
            weight: 0.05,
            painTriggers: [
                'Desconexão de dispositivos inteligentes (lâmpadas/tomadas)',
                'Rede 2.4GHz instável com >20 aparelhos',
                'Baixa memória RAM (<256MB)',
            ],
            pleasureTriggers: [
                'Suporte a OFDMA real (Wi-Fi 6)',
                'Capacidade estável para >50 dispositivos IoT',
                'Processadores Multi-Core eficientes',
            ],
            implementationNotes: 'Teste de Casa Inteligente: Wi-Fi 6 é mandatório para cenários com muita IoT.',
        },
        {
            scoreKey: 'c8',
            label: 'Pós-Venda & Procedência',
            weight: 0.05,
            painTriggers: [
                'Produto "Versão Chinesa" importada (Sem garantia BR)',
                'Firmware em chinês/inglês apenas',
                'Dificuldade de RMA (Troca)',
            ],
            pleasureTriggers: [
                'Garantia oficial de 3 a 5 anos (TP-Link SMB/Asus)',
                'Suporte técnico em Português nativo',
                'Firmware Global/BR',
            ],
            implementationNotes: 'Índice de Confiança: Alertar fortemente sobre riscos do "Mercado Cinza" (Marketplace sem procedência).',
        },
        {
            scoreKey: 'c9',
            label: 'UX & Aplicativo',
            weight: 0.05,
            painTriggers: [
                'Interface Web lenta ou datada',
                'App que exige login na nuvem para funcionar localmente',
                'Configuração complexa para leigos',
            ],
            pleasureTriggers: [
                'App intuitivo (Tether/AI Life)',
                'Funções essenciais (Trocar senha, Reiniciar) em <3 toques',
                'Instalação "Plug & Play"',
            ],
            implementationNotes: 'Acessibilidade: O aplicativo é parte do produto. Se a configuração inicial é difícil, reduzir nota de UX.',
        },
        {
            scoreKey: 'c10',
            label: 'Horizonte Tecnológico',
            weight: 0.05,
            painTriggers: [
                'Portas WAN/LAN limitadas a 100 Mbps (Fast Ethernet)',
                'Padrão obsoleto (Wi-Fi 5/AC) em produtos caros',
            ],
            pleasureTriggers: [
                'Wi-Fi 6E (Banda 6GHz livre de interferência)',
                'Portas Multi-Gig (2.5GbE)',
                'Preparado para planos >1Gbps',
            ],
            implementationNotes: 'Longevidade: Wi-Fi 5 (AC) é aceitável apenas para baixo custo. Para High-End, exigir Wi-Fi 6E/7 e portas 2.5G.',
        },
    ],
};
