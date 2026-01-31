/**
 * @file motherboard.ts
 * @description Playbook de critérios para Placas-Mãe
 * Pesos: 20+15+15+10+10+8+8+7+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const MOTHERBOARD_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'motherboard',
    displayName: 'Placas-Mãe',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Robustez do VRM (Fases Reais)', weight: 0.20, painTriggers: ['VRM sem dissipador (Thermal Throttling)', 'Fases falsas (Duplicadores baratos)', 'MOSFETs que operam acima de 100°C'], pleasureTriggers: ['Dissipadores de alumínio massivos', 'Dr.MOS (Power Stages eficientes)', 'Temperaturas sob carga < 80°C'], implementationNotes: 'Se CPU = "Ryzen 9 / i9" → ELIMINAR placas sem dissipador no VRM.' },
        { scoreKey: 'c2', label: 'Diagnóstico e Recuperação', weight: 0.15, painTriggers: ['Placa "morta" sem aviso (Sem Debug LEDs)', 'Brickar a BIOS sem volta', 'Falta de Clear CMOS acessível'], pleasureTriggers: ['EZ Debug LEDs', 'Botão BIOS Flashback', 'Q-Code (Display de erro numérico)'], implementationNotes: 'Debug LEDs são obrigatórios para troubleshooting rápido.' },
        { scoreKey: 'c3', label: 'Estabilidade de Boot (Memória)', weight: 0.15, painTriggers: ['Treinamento de memória lento (>60s)', 'Instabilidade com XMP/EXPO', 'Tela preta aleatória no POST'], pleasureTriggers: ['Memory Context Restore estável', 'Boot rápido (<15s)', 'Lista QVL ampla validada'], implementationNotes: 'Penalizar placas AM5/DDR5 com boot lento não corrigido.' },
        { scoreKey: 'c4', label: 'Ecossistema de Software (Bloatware)', weight: 0.10, painTriggers: ['Software obrigatório pesado', 'Instalação automática de Lixo', 'Conflitos com drivers'], pleasureTriggers: ['BIOS robusta que dispensa software', 'Compatibilidade com OpenRGB/FanControl', 'Instalação de drivers Barebones'], implementationNotes: 'Valorizar placas que permitem controle total via BIOS.' },
        { scoreKey: 'c5', label: 'Suporte e RMA (Brasil)', weight: 0.10, painTriggers: ['Garantia negada por oxidação superficial', 'RMA internacional obrigatório', 'Processo lento (>30 dias)'], pleasureTriggers: ['Garantia Nacional de 3 anos', 'RMA com representação local ágil', 'Política de tolerância à oxidação'], implementationNotes: 'Alertar sobre marcas com alto índice de rejeição de RMA.' },
        { scoreKey: 'c6', label: 'Layout e Montagem', weight: 0.08, painTriggers: ['Portas SATA bloqueadas pela GPU', 'Slot M.2 embaixo da GPU', 'Conectores de fan inacessíveis'], pleasureTriggers: ['I/O Shield Integrado', 'Conectores em ângulo de 90º', 'M.2 com dissipador'], implementationNotes: 'I/O Shield integrado evita curtos na montagem.' },
        { scoreKey: 'c7', label: 'Qualidade do PCB (Camadas)', weight: 0.08, painTriggers: ['PCB fino de 4 camadas', 'Empenamento com coolers pesados'], pleasureTriggers: ['PCB de 6 ou 8 camadas', 'Server Grade materials', 'Reforço metálico no slot PCIe'], implementationNotes: 'PCB de 6+ camadas é essencial para DDR5 de alta frequência.' },
        { scoreKey: 'c8', label: 'Expansibilidade Real', weight: 0.07, painTriggers: ['Slot x16 secundário que roda a x1', 'M.2 que desabilita portas SATA', 'Falta de USB-C frontal'], pleasureTriggers: ['Slots PCIe com velocidade real útil', 'Múltiplos M.2 sem conflito', 'Conector USB-C interno'], implementationNotes: 'Verificar o manual para "pegadinhas" de compartilhamento de pista.' },
        { scoreKey: 'c9', label: 'Áudio e Rede', weight: 0.05, painTriggers: ['Codec de áudio antigo em placa cara', 'Rede Killer instável', 'Som baixo em fones de alta impedância'], pleasureTriggers: ['Codec ALC1220/4080', 'Rede Intel/Realtek padrão', 'Wi-Fi 6E/7 Integrado'], implementationNotes: 'Rede Intel é preferível a Gamer LAN.' },
        { scoreKey: 'c10', label: 'Custo-Benefício', weight: 0.02, painTriggers: ['Placa White Label remarcada', 'Preço premium só por estética'], pleasureTriggers: ['Placa "Feia mas Ordinária"', 'Plataforma com longevidade (AM5)'], implementationNotes: 'A melhor placa é a mais barata que não explode o VRM.' },
    ],
};
