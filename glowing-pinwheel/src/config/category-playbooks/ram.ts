/**
 * @file ram.ts
 * @description Playbook de critérios para Memória RAM
 * Pesos: 20+15+15+15+10+5+5+5+5+5 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const RAM_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'ram',
    displayName: 'Memória RAM',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Qualidade do Chip (Die)', weight: 0.20, painTriggers: ['Chip Micron/Samsung antigo (Instabilidade acima de 6000 MT/s)', 'Lotes mistos não identificados', 'Falta de margem para overclock'], pleasureTriggers: ['Chip SK Hynix (A-die/M-die) - Padrão Ouro DDR5', 'Samsung B-Die (DDR4)', 'Alta tolerância a voltagem'], implementationNotes: 'Para DDR5, Hynix é mandatório para estabilidade em alta frequência.' },
        { scoreKey: 'c2', label: 'Latência Real (ns)', weight: 0.15, painTriggers: ['Alta frequência com latência alta (ex: 6400 CL40 = Lento)', 'Latência absoluta > 12ns', 'Engana-trouxa de marketing'], pleasureTriggers: ['Sweet Spot (6000 MT/s CL30)', 'Latência absoluta < 10ns', 'Equilíbrio 1:1 com controlador de memória'], implementationNotes: 'Calcular: (CL * 2000) / Frequência. Menor número ganha.' },
        { scoreKey: 'c3', label: 'Gestão Térmica (PMIC)', weight: 0.15, painTriggers: ['DDR5 sem dissipador (Pente "pelado")', 'Dissipador estético sem contato', 'Temperatura > 50°C'], pleasureTriggers: ['Dissipador de alumínio massivo com contato no PMIC', 'Thermal pads de qualidade', 'Sensor de temperatura on-die'], implementationNotes: 'DDR5 esquenta muito. Penalizar severamente pentes sem dissipador.' },
        { scoreKey: 'c4', label: 'Compatibilidade (QVL/EXPO)', weight: 0.15, painTriggers: ['Kit sem perfil EXPO para Ryzen (Boot lento)', 'XMP único que não funciona em AMD', 'Falha de boot em frequências nominais'], pleasureTriggers: ['Certificação dupla (XMP + EXPO)', 'Presença na lista QVL', 'Perfil JEDEC robusto de backup'], implementationNotes: 'Se CPU = "Ryzen 7000/9000" → Exigir perfil EXPO.' },
        { scoreKey: 'c5', label: 'Garantia e RMA (Brasil)', weight: 0.10, painTriggers: ['Garantia "Vitalícia" que exige envio para Taiwan', 'Importação cinza sem nota fiscal', 'Recusa de garantia por "oxidação"'], pleasureTriggers: ['Garantia Nacional com RMA local', 'Marcas com representação oficial', 'Troca expressa'], implementationNotes: 'Garantia vitalícia internacional é inútil para a maioria.' },
        { scoreKey: 'c6', label: 'Topologia (2x vs 4x)', weight: 0.05, painTriggers: ['Kits de 4 pentes em DDR5 (Instabilidade grave)', 'Mistura de kits diferentes', 'Velocidade cai para JEDEC base com 4 pentes'], pleasureTriggers: ['Kits de 2 pentes de alta densidade (2x16GB, 2x32GB)', 'Dual Rank (Bônus de performance se estável)'], implementationNotes: 'Recomendar 2x32GB em vez de 4x16GB.' },
        { scoreKey: 'c7', label: 'Autenticidade', weight: 0.05, painTriggers: ['Memória falsificada (Rebrand de chip usado)', 'SPD reprogramado para mentir specs', 'Compra de marketplace duvidoso'], pleasureTriggers: ['Vendedor Oficial/Loja Reputável', 'Embalagem lacrada com selo', 'Verificação serial online'], implementationNotes: 'Penalizar lojas de marketplace sem reputação verificada.' },
        { scoreKey: 'c8', label: 'Integridade Elétrica (PCB)', weight: 0.05, painTriggers: ['PCB fino de qualidade baixa', 'Trilhas expostas a interferência', 'PMIC ruidoso'], pleasureTriggers: ['PCB de 10 camadas (Overclocking)', 'Trilhas blindadas', 'PMIC desbloqueado (Para entusiastas)'], implementationNotes: 'PCB multicamada é vital para sinal limpo em DDR5 > 6000.' },
        { scoreKey: 'c9', label: 'Notebooks (SODIMM)', weight: 0.05, painTriggers: ['Incompatibilidade de voltagem', 'Mistura de marcas que causa tela azul', 'Bloqueio de XMP na BIOS do laptop'], pleasureTriggers: ['Padrão JEDEC nativo (Plug and Play)', 'Baixa densidade de chip', 'Marca idêntica à original'], implementationNotes: 'Para laptops, estabilidade JEDEC > Performance XMP.' },
        { scoreKey: 'c10', label: 'Custo-Benefício', weight: 0.05, painTriggers: ['Kit Premium com ganho de 1% em FPS', 'Preço dobrado por RGB'], pleasureTriggers: ['Sweet Spot de preço/performance', 'Custo por GB racional', 'Kit "Feio mas Hynix"'], implementationNotes: 'Não pagar o dobro por 200MHz extras.' },
    ],
};
