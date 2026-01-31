/**
 * @file wine_cooler.ts
 * @description Playbook de critérios para Adegas Climatizadas
 * Pesos: 25+15+15+10+10+10+5+5+3+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const WINE_COOLER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'wine_cooler',
    displayName: 'Adegas Climatizadas',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Tecnologia de Refrigeração', weight: 0.25, painTriggers: ['Termoelétrica (Peltier) em regiões quentes', 'Delta T oculto', 'Ventoinha que nunca desliga'], pleasureTriggers: ['Compressor (Gás R134a/R600a)', 'Compressor Inverter', 'Capacidade de atingir 5°C mesmo no verão'], implementationNotes: 'Se Local = "Norte/Nordeste/Centro-Oeste" → ELIMINAR Termoelétricas.' },
        { scoreKey: 'c2', label: 'Isolamento e Condensação', weight: 0.15, painTriggers: ['Porta de vidro simples', 'Formação de mofo', 'Perda de frio rápida'], pleasureTriggers: ['Vidro Duplo/Triplo com Gás Argônio', 'Resistência anti-suor na porta', 'Vedação magnética robusta'], implementationNotes: 'Se Piso = "Madeira" → Exigir porta anti-condensação.' },
        { scoreKey: 'c3', label: 'Capacidade Real (Ergonomia)', weight: 0.15, painTriggers: ['Prateleiras fixas onde não cabe Espumante', 'Rasgar rótulos ao puxar', 'Capacidade nominal baseada só em Bordeaux'], pleasureTriggers: ['Prateleiras com trilho telescópico', 'Espaço para garrafas bojudas', 'Capacidade Mista declarada'], implementationNotes: 'Se Coleção = Mista → Reduzir capacidade nominal em 20-30%.' },
        { scoreKey: 'c4', label: 'Confiabilidade Eletrônica', weight: 0.10, painTriggers: ['Placa que queima em 18 meses', 'Falta de peças de reposição', 'Display que apaga'], pleasureTriggers: ['Garantia estendida no compressor', 'Comunidade de reparo ativa', 'Proteção contra surto'], implementationNotes: 'Penalizar marcas com alto índice de "Placa Queimada".' },
        { scoreKey: 'c5', label: 'Gestão Acústica', weight: 0.10, painTriggers: ['Zumbido agudo constante', 'Estalo alto de relé'], pleasureTriggers: ['Compressor com coxins de borracha', 'Sistema Inverter (Sem estalos)', 'Ventoinha de baixo dBA'], implementationNotes: 'Diferenciar barulho de Compressor de barulho de Peltier.' },
        { scoreKey: 'c6', label: 'Integridade Dual Zone', weight: 0.10, painTriggers: ['Vazamento de frio entre zonas', 'Uma zona para de funcionar'], pleasureTriggers: ['Isolamento físico real entre zonas', 'Controles independentes precisos'], implementationNotes: 'Se apenas prateleira divisória → Classificar como "Pseudo Dual Zone".' },
        { scoreKey: 'c7', label: 'Proteção do Vinho (UV/Vibração)', weight: 0.05, painTriggers: ['Porta transparente sem filtro UV', 'Vibração que suspende sedimentos'], pleasureTriggers: ['Vidro com filtro UV escuro', 'Iluminação LED Fria', 'Sistema antivibração'], implementationNotes: 'Se Uso = "Envelhecimento" → Exigir Filtro UV e Antivibração.' },
        { scoreKey: 'c8', label: 'Eficiência Energética', weight: 0.05, painTriggers: ['Termoelétrica trabalhando a 100% o dia todo', 'Baixa eficiência Procel'], pleasureTriggers: ['Classificação A+++', 'Compressor Inverter'], implementationNotes: 'Esclarecer que Peltier gasta MAIS em climas quentes.' },
        { scoreKey: 'c9', label: 'Instalação (Built-in)', weight: 0.03, painTriggers: ['Embutir adega de piso (Superaquecimento)', 'Porta que não reverte'], pleasureTriggers: ['Ventilação frontal no rodapé', 'Pés ajustáveis'], implementationNotes: 'Alerta Vermelho: "Não embutir adega com ventilação lateral".' },
        { scoreKey: 'c10', label: 'UX e Interface', weight: 0.02, painTriggers: ['Painel interno', 'Luz interna que esquenta'], pleasureTriggers: ['Painel Touch externo', 'Bloqueio de painel', 'Memória de temperatura'], implementationNotes: 'Priorizar controles externos.' },
    ],
};
