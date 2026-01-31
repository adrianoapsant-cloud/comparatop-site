/**
 * @file laptop.ts
 * @description Playbook de critérios para Notebooks importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+8+7+5+5+5 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const LAPTOP_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'laptop',
    displayName: 'Notebooks',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Qualidade do Display (Tela)',
            weight: 0.20,
            painTriggers: [
                'Painel TN ("Tela lavada", inverte cores ao olhar de lado)',
                'Resolução HD (1366x768) em 15.6"',
                'Cobertura de cor < 45% NTSC (Cores mortas)',
            ],
            pleasureTriggers: [
                'Painel IPS/WVA (Ângulo de visão real)',
                '100% sRGB (Fidelidade de cor)',
                'OLED/Mini-LED (Preto absoluto)',
            ],
            implementationNotes: 'Filtro Visual: Se Preço > R$ 3.000 e Tela = TN → ELIMINAR recomendação (Inaceitável). Alertar: "Tela TN ruim para filmes/edição".',
        },
        {
            scoreKey: 'c2',
            label: 'Gestão Térmica (Throttling)',
            weight: 0.15,
            painTriggers: [
                'Thermal Throttling severo (Perda de 30% de performance em jogos)',
                'Teclado que esquenta a ponto de incomodar (WASD)',
                'Saída de ar bloqueada pela tela',
            ],
            pleasureTriggers: [
                'Sistema de resfriamento robusto (Heatpipes visíveis)',
                'Modo "Fan Boost" eficaz',
                'Temperaturas de CPU < 85°C em carga',
            ],
            implementationNotes: 'Teste de Estresse: Se Uso = "Gamer/Render", priorizar chassis mais grossos com melhor fluxo de ar sobre ultrabooks finos.',
        },
        {
            scoreKey: 'c3',
            label: 'Integridade Estrutural',
            weight: 0.15,
            painTriggers: [
                'Dobradiça que quebra a carcaça com o tempo (Vício oculto)',
                'Plástico flexível que range ao digitar',
                'Acabamento "imã de digitais"',
            ],
            pleasureTriggers: [
                'Chassi de Metal/Liga de Magnésio',
                'Dobradiça ancorada em metal',
                'Certificação Militar (MIL-STD-810H)',
            ],
            implementationNotes: 'Durabilidade: Monitorar relatos de "Dobradiça Quebrada" no Reclame Aqui.',
        },
        {
            scoreKey: 'c4',
            label: 'Memória RAM e Expansão',
            weight: 0.10,
            painTriggers: [
                '4GB Soldado sem slot extra (Lixo eletrônico em potencial)',
                'Single Channel forçado (Perda de performance gráfica)',
                'Slot inacessível (Teclado invertido)',
            ],
            pleasureTriggers: [
                'Slots SODIMM livres para upgrade',
                'Mínimo 8GB (Ideal 16GB) em Dual Channel',
                'Acesso fácil (Tampa inferior)',
            ],
            implementationNotes: 'Longevidade: Se RAM = "4GB Soldado" → Penalizar severamente (Obsolescência programada). Bonificar facilidade de upgrade.',
        },
        {
            scoreKey: 'c5',
            label: 'Ergonomia (Teclado/Touch)',
            weight: 0.10,
            painTriggers: [
                'Layout US em notebook nacional (Sem "Ç")',
                'Teclas com curso curto demais (Digitação ruim)',
                'Touchpad pequeno e impreciso',
            ],
            pleasureTriggers: [
                'Teclado ABNT2 (Nativo Brasileiro)',
                'Retroiluminação (Essencial à noite)',
                'Teclado numérico dedicado (Numpad)',
            ],
            implementationNotes: 'Produtividade: Para "Estudante/Escritório", ABNT2 é mandatório.',
        },
        {
            scoreKey: 'c6',
            label: 'Armazenamento (SSD)',
            weight: 0.08,
            painTriggers: [
                'HD Mecânico (Lentidão extrema)',
                'SSD eMMC (Soldado e lento)',
                'Slot M.2 único ocupado por SSD pequeno',
            ],
            pleasureTriggers: [
                'SSD NVMe PCIe Gen4',
                'Slot M.2 secundário livre (Para expansão)',
                'Dissipador no SSD',
            ],
            implementationNotes: 'Velocidade: Ignorar notebooks com HD principal. É tecnologia morta.',
        },
        {
            scoreKey: 'c7',
            label: 'Portabilidade Real',
            weight: 0.07,
            painTriggers: [
                'Fonte de alimentação "tijolo" pesada e proprietária',
                'Bateria que dura < 2h fora da tomada',
            ],
            pleasureTriggers: [
                'Carregamento via USB-C (Power Delivery)',
                'Peso total < 1.5kg (Ultrabooks)',
                'Carregador GaN compacto',
            ],
            implementationNotes: 'Mobilidade: Valorizar USB-C PD que permite usar o mesmo carregador do celular.',
        },
        {
            scoreKey: 'c8',
            label: 'Conectividade & Portas',
            weight: 0.05,
            painTriggers: [
                'Falta de porta HDMI padrão',
                'Apenas portas USB-C (Obriga uso de dongles)',
                'Sem porta RJ-45 (Rede cabeada) em notebooks gamer',
            ],
            pleasureTriggers: [
                'Mix de USB-A e USB-C',
                'Thunderbolt 4 (Intel)',
                'Leitor de cartão SD (Para criadores)',
            ],
            implementationNotes: 'Versatilidade: Penalizar a "Dongle Life" para usuários corporativos que usam projetores.',
        },
        {
            scoreKey: 'c9',
            label: 'Custo-Benefício',
            weight: 0.05,
            painTriggers: [
                'Preço de lançamento inflado',
                'Notebook "Gamer" com GPU integrada fraca (GTX 1650 antiga a preço de RTX)',
            ],
            pleasureTriggers: [
                'Promoções agressivas',
                'Linux (Economia na licença Windows)',
                'Melhor FPS por Real investido',
            ],
            implementationNotes: 'Economia: Identificar modelos com Linux para quem sabe formatar (mais baratos).',
        },
        {
            scoreKey: 'c10',
            label: 'Suporte Pós-Venda',
            weight: 0.05,
            painTriggers: [
                'Garantia que exige envio por correio (Demora)',
                'Falta de peças de reposição (Bateria/Teclado)',
            ],
            pleasureTriggers: [
                'Garantia On-Site (Técnico vai em casa - Dell/Lenovo)',
                'Marca com peças fáceis no mercado livre',
            ],
            implementationNotes: 'Segurança: Valorizar garantia em domicílio para profissionais que não podem parar.',
        },
    ],
};
