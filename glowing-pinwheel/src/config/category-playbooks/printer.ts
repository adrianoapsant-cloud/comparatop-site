/**
 * @file printer.ts
 * @description Playbook de critérios para Impressoras importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+10+5+5+5+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const PRINTER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'printer',
    displayName: 'Impressoras',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'TCO: Custo Real por Página',
            weight: 0.20,
            painTriggers: [
                'Cartucho de Jato de Tinta tradicional (CPP > R$ 0,50)',
                'Toner Original com rendimento < 1.000 pág e preço > R$ 300',
            ],
            pleasureTriggers: [
                'Tanque de Tinta (EcoTank/MegaTank) com CPP < R$ 0,02',
                'Laser Mono compatível com toner paralelo barato e confiável',
            ],
            implementationNotes: 'Cálculo de TCO (3 Anos): Se Volume > 100 pág/mês → REJEITAR Cartucho. Se Volume > 500 pág/mês → RECOMENDAR Tanque ou Laser.',
        },
        {
            scoreKey: 'c2',
            label: 'Conectividade & Rede',
            weight: 0.15,
            painTriggers: [
                'Incompatibilidade com 5GHz/Mesh (Falha de setup)',
                'Problema de "Deep Sleep" que não acorda (Brother)',
                'Dependência 100% de nuvem para funcionar (HP+)',
            ],
            pleasureTriggers: [
                'Suporte nativo a Dual Band (2.4/5GHz)',
                'Conexão estável em IPv6',
                'Funciona localmente sem internet (Driver Offline)',
            ],
            implementationNotes: 'Filtro de Infraestrutura: Verificar se o modelo suporta redes Mesh modernas. Penalizar modelos que exigem login em app para digitalizar.',
        },
        {
            scoreKey: 'c3',
            label: 'Durabilidade da Cabeça/Cilindro',
            weight: 0.15,
            painTriggers: [
                'Cabeça térmica fixa que queima sem tinta (Risco de perda total)',
                'Almofada de tinta (Waste Pad) sem troca fácil (Bloqueio de software)',
            ],
            pleasureTriggers: [
                'Cabeça Piezoelétrica (Epson - Longa vida)',
                'Cabeça substituível pelo usuário (Canon G-Series / HP Smart Tank)',
                'Cilindro de laser separado do toner (Brother)',
            ],
            implementationNotes: 'Índice de Reparabilidade: Bonificar modelos com "Caixa de Manutenção" substituível pelo usuário. Penalizar descarte total por almofada cheia.',
        },
        {
            scoreKey: 'c4',
            label: 'Qualidade de Texto e Cor',
            weight: 0.10,
            painTriggers: [
                'Texto borrado ou cinza em modo rascunho',
                'Banding (listras) frequente em fotos',
                'Mistura de cores em papéis comuns (sangramento)',
            ],
            pleasureTriggers: [
                'Tinta Preta Pigmentada (Texto nítido e resistente à água)',
                'Laser (Texto perfeito)',
                '6 Cores para fotos (Epson L8050)',
            ],
            implementationNotes: 'Segmentação de Uso: Perfil Documentos → Exigir Pigmento ou Laser. Perfil Fotos → Exigir Corante de alta saturação.',
        },
        {
            scoreKey: 'c5',
            label: 'Robustez Mecânica & Papel',
            weight: 0.10,
            painTriggers: [
                'Atolamentos frequentes com papel fino',
                'Incapacidade de puxar papel > 180g (Cartolina/Fotográfico)',
                'Bandejas de saída frágeis',
            ],
            pleasureTriggers: [
                'Tracionamento robusto para gramaturas altas (Canon G-Series)',
                'Caminho de papel acessível para limpeza',
            ],
            implementationNotes: 'Teste de Gramatura: Para perfil "Artesanato/Personalizados", a capacidade de puxar papel grosso é eliminatória.',
        },
        {
            scoreKey: 'c6',
            label: 'Velocidade & Fluxo de Trabalho',
            weight: 0.10,
            painTriggers: [
                'Lentidão na primeira página (> 45s de limpeza)',
                'Pausas para processamento ("thinking") em PDFs pesados',
                'Falta de ADF para digitalizar multipáginas',
            ],
            pleasureTriggers: [
                'ADF (Alimentador Automático)',
                'Duplex Automático (Frente e verso)',
                '"Instant On" da tecnologia Laser',
            ],
            implementationNotes: 'Produtividade Real: Se uso = Escritório/Advocacia → ADF e Duplex são mandatórios.',
        },
        {
            scoreKey: 'c7',
            label: 'UX e Software',
            weight: 0.05,
            painTriggers: [
                'Bloatware intrusivo (Pop-ups de venda de tinta)',
                'Drivers de 500MB+',
                'Instalação móvel falha',
            ],
            pleasureTriggers: [
                'Drivers "INF only" disponíveis (Leveza)',
                'App móvel intuitivo e rápido (Epson Smart Panel)',
            ],
            implementationNotes: 'Fricção de Uso: Avaliar a facilidade de instalar sem CD/USB. Penalizar obrigatoriedade de criação de conta.',
        },
        {
            scoreKey: 'c8',
            label: 'Suporte & Garantia',
            weight: 0.05,
            painTriggers: [
                'Garantia de 2º ano condicionada a cadastro "escondido"',
                'Falta de peças de reposição no varejo',
            ],
            pleasureTriggers: [
                'Garantia estendida clara e automática',
                'Rede de assistência técnica capilar (Interior do BR)',
            ],
            implementationNotes: 'Segurança do Investimento: Alertar usuário: "Cadastre no site em 30 dias para ganhar o 2º ano de garantia".',
        },
        {
            scoreKey: 'c9',
            label: 'Abastecimento & Risco',
            weight: 0.05,
            painTriggers: [
                'Garrafas sem chaveamento (Risco de trocar cores)',
                'Vazamento ao virar a garrafa',
            ],
            pleasureTriggers: [
                'Bocal codificado (Keyed Bottles - Só encaixa a cor certa)',
                'Sistema de válvula anti-vazamento',
            ],
            implementationNotes: 'Prevenção de Erros: Valorizar sistemas à prova de falha humana (Epson EcoFit, HP Spill-Free).',
        },
        {
            scoreKey: 'c10',
            label: 'Design & Ergonomia',
            weight: 0.05,
            painTriggers: [
                'Tanques laterais pendurados (Design antigo, ocupa espaço)',
                'Visor LCD minúsculo ou sem iluminação',
            ],
            pleasureTriggers: [
                'Tanques frontais integrados (Visualização de nível)',
                'Painel touch ou LCD informativo',
            ],
            implementationNotes: 'Modernidade: O design compacto e integrado é preferível para Home Office limitado.',
        },
    ],
};
