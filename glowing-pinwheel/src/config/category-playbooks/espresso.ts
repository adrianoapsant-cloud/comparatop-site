/**
 * @file espresso.ts
 * @description Playbook de critérios para Máquinas de Café Expresso
 * Pesos: 20+15+15+12+10+8+8+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const ESPRESSO_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'espresso',
    displayName: 'Máquinas de Café Expresso',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Estabilidade Térmica (Termodinâmica)', weight: 0.20, painTriggers: ['Água fervendo que queima o café', 'Extração fria ou inconsistente', 'Falta de PID'], pleasureTriggers: ['Controle PID preciso (1°C)', 'Thermoblock rápido', 'Caldeira de latão'], implementationNotes: 'Se a máquina "espirra" vapor no café → ELIMINAR.' },
        { scoreKey: 'c2', label: 'Texturização de Leite', weight: 0.15, painTriggers: ['Reservatório de leite com tubos internos (mofo)', 'Espuma bolhosa e rígida', 'Limpeza difícil'], pleasureTriggers: ['Lança de vapor manual profissional', 'Sistema Pannarello removível', 'Microespuma sedosa real'], implementationNotes: 'Lança manual é mais segura e higiênica.' },
        { scoreKey: 'c3', label: 'Confiabilidade Eletrônica', weight: 0.15, painTriggers: ['Placa que queima com oscilação de energia', 'Sensores falsos de falta de água/grãos', 'Travamento de software'], pleasureTriggers: ['Eletrônica robusta ou Eletromecânica pura', 'Proteção contra surtos', 'Interface clara de erros'], implementationNotes: 'Penalizar máquinas sensíveis à rede elétrica brasileira.' },
        { scoreKey: 'c4', label: 'Higiene do Grupo Infusor', weight: 0.12, painTriggers: ['Grupo fixo não removível (mofo interno)', 'Dificuldade de acesso para limpeza', 'Gaveta de borra que transborda'], pleasureTriggers: ['Grupo Infusor Removível (lavável)', 'Ciclos de enxágue automático', 'Acesso frontal fácil'], implementationNotes: 'Grupo removível é mandatório para superautomáticas.' },
        { scoreKey: 'c5', label: 'Qualidade do Moinho (Integrado)', weight: 0.10, painTriggers: ['Moinho de cerâmica frágil', 'Retenção alta de pó velho', 'Moagem inconsistente'], pleasureTriggers: ['Moinho Cônico de Aço Inox', 'Ajuste micrométrico', 'Baixa retenção e ruído controlado'], implementationNotes: 'Valorizar aço sobre cerâmica para durabilidade.' },
        { scoreKey: 'c6', label: 'Manutenibilidade & Peças', weight: 0.08, painTriggers: ['Peças de reposição indisponíveis', 'Custo de reparo > 50% do valor', 'Design fechado'], pleasureTriggers: ['Peças comuns no mercado', 'Facilidade de reparo DIY', 'Rede de assistência ampla'], implementationNotes: 'Máquinas modulares (Gaggia/Rancilio) duram décadas.' },
        { scoreKey: 'c7', label: 'Versatilidade de Insumos', weight: 0.08, painTriggers: ['Filtro pressurizado fixo (falsa crema)', 'Incompatibilidade com pó pré-moído', 'Sem adaptador para cápsulas'], pleasureTriggers: ['Filtro despressurizado comercial (58mm)', 'Aceita Grãos, Pó e Cápsulas', 'Bypass doser para descafeinado'], implementationNotes: 'Permitir upgrade para filtro comercial é vital.' },
        { scoreKey: 'c8', label: 'Qualidade Construtiva', weight: 0.05, painTriggers: ['Carcaça de plástico leve (vibra)', 'Componentes quentes de plástico', 'Botões frouxos'], pleasureTriggers: ['Corpo em Aço Inox ou Metal Fundido', 'Peso elevado (Estabilidade)', 'Porta-filtro de latão cromado'], implementationNotes: 'Máquina pesada = Máquina estável e silenciosa.' },
        { scoreKey: 'c9', label: 'Interface & UX', weight: 0.05, painTriggers: ['Luzes piscantes indecifráveis', 'Botões sem feedback tátil', 'Falta de aviso de Tanque Vazio'], pleasureTriggers: ['Display de Texto/OLED claro', 'Botões físicos robustos', 'Avisos explícitos de manutenção'], implementationNotes: 'Display de texto reduz ansiedade e erros.' },
        { scoreKey: 'c10', label: 'Custo-Benefício & Revenda', weight: 0.02, painTriggers: ['Desvalorização rápida (White Label)', 'Custo por dose alto (Só cápsula)'], pleasureTriggers: ['Alta liquidez de revenda', 'ROI rápido vs. Cápsulas (1-2 anos)', 'Durabilidade > 5 anos'], implementationNotes: 'Máquinas clássicas são "cheque ao portador".' },
    ],
};
