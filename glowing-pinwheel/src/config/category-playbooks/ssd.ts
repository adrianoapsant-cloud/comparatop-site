/**
 * @file ssd.ts
 * @description Playbook de critérios para SSDs importado de "10 dores.txt"
 * 
 * Pesos: 20+15+15+10+10+10+10+5+3+2 = 100% ✓
 */

import type { CategoryPlaybook } from './tv';

export const SSD_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'ssd',
    displayName: 'SSDs',
    market: 'Mercado Brasileiro',
    criteria: [
        {
            scoreKey: 'c1',
            label: 'Confiabilidade da Controladora',
            weight: 0.20,
            painTriggers: [
                'Histórico de "Morte Súbita" (Falha Satafirm S11/Phison antiga)',
                'Falhas de Firmware Catastróficas (Ex: SanDisk Extreme Pro)',
                'Controladoras genéricas sem nome',
            ],
            pleasureTriggers: [
                'Controladora Proprietária Tier 1 (Samsung/WD/Hynix)',
                'Firmware maduro e estável (Sem bugs críticos)',
                'Atualizações frequentes via software',
            ],
            implementationNotes: 'Filtro de Segurança Máxima: Se Controladora = "Histórico de Falha" → ELIMINAR recomendação para dados críticos. Penalizar marcas que trocam componentes internamente sem aviso.',
        },
        {
            scoreKey: 'c2',
            label: 'Garantia Nacional & RMA',
            weight: 0.15,
            painTriggers: [
                'Importado "Sem Garantia" (AliExpress/Shopee)',
                'Marca sem representação oficial no Brasil',
                'Custo de envio internacional para troca',
            ],
            pleasureTriggers: [
                'Garantia de 5 Anos Nacional (Linhas Pro/Black)',
                'RMA Local com logística reversa paga',
                'Conformidade com CDC (Código de Defesa do Consumidor)',
            ],
            implementationNotes: 'Custo-Benefício Ajustado ao Risco: Se Preço Importado < 30% Preço Nacional → Alertar Risco. Recomendar sempre "Vendido e Entregue por Loja Oficial".',
        },
        {
            scoreKey: 'c3',
            label: 'Cache DRAM vs. HMB',
            weight: 0.15,
            painTriggers: [
                'DRAM-less sem HMB (Lentidão extrema em multitarefa)',
                'Stuttering (engasgos) em uso como drive de sistema (OS)',
            ],
            pleasureTriggers: [
                'Chip DRAM Dedicado (Fluidez total)',
                'HMB bem implementado (Bom para jogos secundários)',
            ],
            implementationNotes: 'Segmentação de Uso: Drive Principal (Windows) → Exigir DRAM ou HMB robusto. Drive Secundário (Jogos) → DRAM-less é aceitável se barato.',
        },
        {
            scoreKey: 'c4',
            label: 'Autenticidade (Risco de Fraude)',
            weight: 0.10,
            painTriggers: [
                'Falha na verificação de software proprietário',
                'Capacidade falsa (Firmware hackeado)',
                'Embalagem suspeita em marketplace aberto',
            ],
            pleasureTriggers: [
                'Validação positiva no Samsung Magician/Kingston Manager',
                'Compra em Canal Oficial verificado',
            ],
            implementationNotes: 'Alerta de Golpe: Se Preço muito abaixo da média de mercado → Exibir alerta "Provável Falsificação". Incentivar uso de software de validação.',
        },
        {
            scoreKey: 'c5',
            label: 'Performance Sustentada (Pós-Cache)',
            weight: 0.10,
            painTriggers: [
                'Queda para < 100MB/s após encher o cache SLC (Pior que HD)',
                'Travamento do sistema durante instalação de jogos grandes',
            ],
            pleasureTriggers: [
                'Velocidade constante mesmo em transferências longas (> 1000MB/s)',
                'NAND TLC de alta qualidade',
            ],
            implementationNotes: 'Teste de Carga Real: Não usar apenas "Velocidade de Pico". Se Velocidade Sustentada for baixa → Penalizar para criadores de conteúdo/videomakers.',
        },
        {
            scoreKey: 'c6',
            label: 'Temperatura & Throttling',
            weight: 0.10,
            painTriggers: [
                'Superaquecimento que causa desligamento (PS5)',
                'Perda de performance térmica em notebooks finos',
            ],
            pleasureTriggers: [
                'Dissipador de calor eficiente incluso (Heatsink)',
                'Eficiência energética (Baixo consumo em idle)',
            ],
            implementationNotes: 'Compatibilidade Térmica: Se Destino = "PS5" → Exigir Dissipador. Se Destino = "Notebook" → Verificar altura e eficiência sem dissipador.',
        },
        {
            scoreKey: 'c7',
            label: 'Custo por GB Efetivo',
            weight: 0.10,
            painTriggers: [
                'Preço por GB alto em tecnologias antigas (SATA caro)',
                'QLC vendido a preço de TLC premium',
            ],
            pleasureTriggers: [
                'Melhor relação Preço/Confiabilidade',
                'QLC honesto (barato) para armazenamento em massa',
            ],
            implementationNotes: 'Matemática do Consumo: Calcular R$ / GB. Destacar promoções de drives de 2TB/4TB como "Melhor Compra para Jogos".',
        },
        {
            scoreKey: 'c8',
            label: 'Compatibilidade Física/Lógica',
            weight: 0.05,
            painTriggers: [
                'SSD Face Dupla em Notebook Face Única (Não cabe/Enverga)',
                'Dissipador muito alto para PS5',
            ],
            pleasureTriggers: [
                'Formato Single-Sided (Compatibilidade universal)',
                'Certificado "PS5 Ready" (Velocidade + Tamanho corretos)',
            ],
            implementationNotes: 'Filtro de Hardware: Alertar usuários de laptop sobre SSDs "Double-Sided".',
        },
        {
            scoreKey: 'c9',
            label: 'Durabilidade (TBW/NAND)',
            weight: 0.03,
            painTriggers: [
                'QLC de baixa qualidade vendido como durável',
                'TBW irrealisticamente baixo para o preço',
            ],
            pleasureTriggers: [
                'TBW alto (600TBW+ para 1TB)',
                'NAND TLC 3D de 176+ camadas',
            ],
            implementationNotes: 'Desmistificação: Informar que TBW é secundário para jogos, mas vital para Chia/Servidores/Edição 4K.',
        },
        {
            scoreKey: 'c10',
            label: 'Velocidade de Pico (Capa)',
            weight: 0.02,
            painTriggers: [
                'Marketing de "7500 MB/s" que na prática não muda loading de jogos',
                'Foco excessivo em números sintéticos',
            ],
            pleasureTriggers: [
                'Paridade de performance real (Loading de jogos igual entre Gen3/Gen4)',
            ],
            implementationNotes: 'Educação: Reduzir a importância do número "Sequencial Máximo" na nota final para usuários comuns.',
        },
    ],
};
