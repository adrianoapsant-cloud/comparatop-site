/**
 * @file psu.ts
 * @description Playbook de critérios para Fontes de Alimentação
 * Pesos: 25+20+15+10+10+8+5+3+2+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const PSU_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'psu',
    displayName: 'Fontes de Alimentação',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Topologia de Regulação', weight: 0.25, painTriggers: ['Regulação em Grupo (Tensão instável)', 'Chave Seletora de Tensão (Projeto arcaico)', 'Queda da linha 12V abaixo de 11.4V'], pleasureTriggers: ['Conversor DC-DC (Estabilidade total)', 'LLC Ressonante (Alta eficiência)', 'Regulação de carga < 2%'], implementationNotes: 'Se Topologia = "Group Regulation" → ELIMINAR para PCs modernos.' },
        { scoreKey: 'c2', label: 'Qualidade dos Componentes (Capacitores)', weight: 0.20, painTriggers: ['Capacitores Genéricos/Chineses de 85°C', '"Component Swap" silencioso', 'Solda fria'], pleasureTriggers: ['Capacitores Japoneses (Chemi-Con/Nichicon) de 105°C', 'Vida útil alta em temperatura elevada', 'Filtragem de entrada completa'], implementationNotes: 'No Brasil (país quente), capacitor de 85°C é risco. Exigir 105°C.' },
        { scoreKey: 'c3', label: 'Resposta a Transientes (ATX 3.0/3.1)', weight: 0.15, painTriggers: ['Desligamento súbito em picos de GPU', 'Incompatibilidade com excursão de potência 200%', 'Uso de adaptadores duvidosos'], pleasureTriggers: ['Padrão ATX 3.0 / 3.1 Nativo', 'Conector 12V-2x6 (H++)', 'Suporte a picos de 2x a carga nominal'], implementationNotes: 'Se GPU = "RTX 4000/RX 7000" → Recomendar ATX 3.0+.' },
        { scoreKey: 'c4', label: 'Proteções Elétricas Ativas', weight: 0.10, painTriggers: ['Proteções "Fake" (Nominais mas inativas)', 'Falta de Varistor (MOV)', 'OCP configurado alto demais'], pleasureTriggers: ['Proteções Completas (OCP, OVP, UVP, SCP, OPP, OTP)', 'Varistor robusto', 'OCP Multi-trilho ou bem calibrado'], implementationNotes: 'Falta de MOV é falha grave no Brasil (Raios/Surtos).' },
        { scoreKey: 'c5', label: 'Garantia e RMA (Brasil)', weight: 0.10, painTriggers: ['Marcas "Bomba" sem representação', 'Garantia curta (3-6 meses)', 'Falta de suporte técnico local'], pleasureTriggers: ['Garantia de 5 a 10 Anos (Corsair/MSI/XPG)', 'RMA Nacional ágil', 'Reputação sólida no Reclame Aqui'], implementationNotes: 'Fonte com 10 anos de garantia se paga no tempo.' },
        { scoreKey: 'c6', label: 'Ripple e Ruído Elétrico', weight: 0.08, painTriggers: ['Ripple > 60mV na linha 12V', 'Ruído elétrico que interfere no áudio', '"Coil Whine" crônico'], pleasureTriggers: ['Ripple < 30mV (Energia limpa)', 'Filtragem de saída robusta', 'Certificação Cybenetics (Lambda/ETA)'], implementationNotes: 'Ripple alto mata SSDs e GPUs lentamente.' },
        { scoreKey: 'c7', label: 'Eficiência (PFC Ativo)', weight: 0.05, painTriggers: ['Eficiência < 80% (Gera muito calor)', 'PFC Passivo ou Inexistente', 'Selo 80 Plus Falso'], pleasureTriggers: ['Eficiência Gold ou Platinum (Cybenetics)', 'PFC Ativo (>0.99) Full Range (90-264V)', 'Operação fria'], implementationNotes: 'PFC Ativo protege contra oscilação de tensão.' },
        { scoreKey: 'c8', label: 'Acústica e Ventoinha', weight: 0.03, painTriggers: ['Ventoinha barulhenta sempre em 100%', 'Rolamento Sleeve (Bucha) que trava com poeira', 'Curva de fan agressiva'], pleasureTriggers: ['Ventoinha FDB (Fluid Dynamic Bearing)', 'Modo Zero RPM (Híbrido) até 40% de carga', 'Operação silenciosa (< 30dB)'], implementationNotes: 'Zero RPM é diferencial de silêncio.' },
        { scoreKey: 'c9', label: 'Integridade do Cabeamento', weight: 0.02, painTriggers: ['Fios finos (20AWG) que esquentam', 'Conectores frágeis sem terminais HCS', 'Cabos curtos'], pleasureTriggers: ['Fios 16AWG ou 18AWG no mínimo', 'Terminais de Alta Corrente (HCS)', 'Cabos Flat ou Sleeved de qualidade'], implementationNotes: 'Fio fino causa queda de tensão e aquecimento.' },
        { scoreKey: 'c10', label: 'Custo-Benefício', weight: 0.02, painTriggers: ['Fonte "Gamer" barata demais (Risco de explosão)', 'Preço premium só por estética (RGB/Tela OLED)'], pleasureTriggers: ['Custo por Watt racional em Tier A/B', 'Investimento em segurança x Preço'], implementationNotes: 'Nunca economizar na fonte. O barato sai caro.' },
    ],
};
