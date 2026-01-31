/**
 * @file air_fryer.ts
 * @description Playbook de critérios para Air Fryers
 * NORMALIZADO: 103% → 100% (fator 0.9709)
 */
import type { CategoryPlaybook } from './tv';

export const AIR_FRYER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'air_fryer',
    displayName: 'Air Fryers',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Integridade do Antiaderente', weight: 0.194, painTriggers: ['Ferrugem precoce no cesto', 'Revestimento que descasca em < 3 meses', 'Cesto aramado difícil de limpar'], pleasureTriggers: ['Compatibilidade real com Lava-Louças', 'Revestimento multicamada (Duraflon/Goldflon)', 'Cesto liso sem cantos vivos'], implementationNotes: 'Se Histórico = "Ferrugem" → ELIMINAR recomendação.' },
        { scoreKey: 'c2', label: 'Segurança de Materiais (Odor)', weight: 0.146, painTriggers: ['Cheiro de "plástico queimado" persistente', 'Gosto químico transferido', 'Fumaça branca excessiva'], pleasureTriggers: ['Ausência de odor após cura inicial', 'Materiais internos de metal/vidro'], implementationNotes: 'Penalizar modelos com relatos de "gosto de plástico".' },
        { scoreKey: 'c3', label: 'Performance (Crocância)', weight: 0.146, painTriggers: ['Alimento "cozido" em vez de frito', 'Necessidade de agitar constantemente', 'Aquecimento desigual'], pleasureTriggers: ['Fluxo de ar avançado (fundo estrela/vórtice)', 'Alta potência efetiva', 'Uniformidade sem intervenção'], implementationNotes: 'Diferenciar Watts nominais de fluxo de ar real.' },
        { scoreKey: 'c4', label: 'Higienização (Resistência)', weight: 0.097, painTriggers: ['Teto da câmara inacessível', 'Grade fixa que impede limpeza', 'Parafusos expostos que enferrujam'], pleasureTriggers: ['Grade de proteção removível', 'Resistência rebatível', 'Interior liso antiaderente'], implementationNotes: 'Se não limpa a resistência, vira risco de incêndio.' },
        { scoreKey: 'c5', label: 'Robustez Eletrônica', weight: 0.097, painTriggers: ['Painel digital que apaga com vapor', 'Queima recorrente de fusível', 'Botões touch que falham'], pleasureTriggers: ['Painel analógico robusto', 'Eletrônica isolada do calor/umidade', 'Proteção contra superaquecimento'], implementationNotes: 'Para uso intenso, sugerir analógico.' },
        { scoreKey: 'c6', label: 'Acústica (Ruído)', weight: 0.078, painTriggers: ['Ruído > 65dB', 'Vibração/Chocalho de peças soltas', 'Som de motor esforçado'], pleasureTriggers: ['Funcionamento silencioso (< 55dB)', 'Ventoinha balanceada e estável'], implementationNotes: 'Alertar sobre modelos ruidosos para cozinhas integradas.' },
        { scoreKey: 'c7', label: 'Eficiência Volumétrica', weight: 0.078, painTriggers: ['Litragem fake (Cesto fundo mas estreito)', 'Ocupa muito espaço para pouca comida'], pleasureTriggers: ['Cesto quadrado com grande área plana', 'Visibilidade interna (Janela + Luz)', 'Compacta por fora, grande por dentro'], implementationNotes: 'Priorizar "Área de Fundo" sobre "Volume em Litros".' },
        { scoreKey: 'c8', label: 'Usabilidade & IoT', weight: 0.068, painTriggers: ['App inútil ou difícil de parear', 'Pega da alça que esquenta', 'Botão de liberar cesto duro/frágil'], pleasureTriggers: ['Conectividade funcional', 'Receitas integradas no display', 'Ergonomia de "uma mão"'], implementationNotes: 'Só pontuar IoT se facilitar a vida.' },
        { scoreKey: 'c9', label: 'Custo & Segurança Elétrica', weight: 0.048, painTriggers: ['Cabo curto demais', 'Plugue de 20A sem aviso prévio', 'Alto consumo em standby'], pleasureTriggers: ['Cabo longo e robusto', 'Aviso claro sobre tomada 20A', 'Eficiência energética A'], implementationNotes: 'Alerta Vermelho: "Verifique se sua tomada é de 20A".' },
        { scoreKey: 'c10', label: 'Pós-Venda & Peças', weight: 0.048, painTriggers: ['Falta de cesto de reposição', 'Marca sem garantia local'], pleasureTriggers: ['Peças de reposição fáceis', 'Garantia de 2 anos', 'Marca com bom Reclame Aqui'], implementationNotes: 'Se o cesto descascar, consegue comprar outro? Se não, penalizar.' },
    ],
};
