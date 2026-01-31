/**
 * @file mixer.ts
 * @description Playbook de critérios para Batedeiras e Processadores
 * Pesos: 25+15+15+10+10+8+5+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const MIXER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'mixer',
    displayName: 'Batedeiras e Processadores',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Eficiência de Transmissão (Torque)', weight: 0.25, painTriggers: ['Motor AC que geme com massa pesada', 'Watts inflados com torque baixo', 'Aquecimento excessivo em sova'], pleasureTriggers: ['Motor DC ou Direct Drive', 'Sensor de Feedback de Rotação', 'Transmissão eficiente (KitchenAid/Kenwood)'], implementationNotes: 'Se Uso = "Massa de Pão" → ELIMINAR motores AC de entrada.' },
        { scoreKey: 'c2', label: 'Integridade Estrutural (Estabilidade)', weight: 0.15, painTriggers: ['"Batedeira Andante"', 'Cabeça que salta/bate na sova', 'Ventosas que soltam'], pleasureTriggers: ['Carcaça de Metal Fundido (Die-cast)', 'Mecanismo Bowl-Lift', 'Travamento de cabeça em aço'], implementationNotes: 'Peso é qualidade. Máquinas leves são perigosas.' },
        { scoreKey: 'c3', label: 'Precisão de Corte (Processadores)', weight: 0.15, painTriggers: ['Grande espaço entre disco e tampa', 'Lâminas que transformam tudo em purê', 'Eixo central que acumula sujeira'], pleasureTriggers: ['Gap mínimo (1-2mm)', 'Lâmina em "S" no fundo', 'Motor de indução silencioso'], implementationNotes: 'Penalizar processadores que deixam pedaços grandes.' },
        { scoreKey: 'c4', label: 'Desempenho em Escala Mínima', weight: 0.10, painTriggers: ['Batedor que não alcança o fundo', 'Falta de ajuste de altura', 'Tigela com fundo plano largo demais'], pleasureTriggers: ['Parafuso de calibração acessível', 'Tigela cônica no fundo', 'Capacidade de bater 1 clara'], implementationNotes: 'A máquina grande tem que funcionar para receitas pequenas.' },
        { scoreKey: 'c5', label: 'Engenharia de Falha (Durabilidade)', weight: 0.10, painTriggers: ['Engrenagens plásticas estruturais que quebram', 'Falta de peça de reposição', 'Graxa que vaza para a comida'], pleasureTriggers: ['Engrenagem de Sacrifício (Fusível mecânico)', 'Caixa de engrenagens selada', 'Peças de reposição oficiais'], implementationNotes: 'Plástico só é bom se for "fusível". Plástico estrutural é falha.' },
        { scoreKey: 'c6', label: 'Ergonomia e Interface', weight: 0.08, painTriggers: ['Travas de tampa difíceis', 'Mixers pesados na traseira', '"Nuvem de farinha" ao ligar'], pleasureTriggers: ['Tampa com vedação de silicone', 'Soft Start (Início suave)', 'Mixers DC leves e balanceados'], implementationNotes: 'Facilidade de uso define se o produto sai do armário.' },
        { scoreKey: 'c7', label: 'Assinatura Acústica', weight: 0.05, painTriggers: ['Ruído agudo/estridente de motor universal', 'Barulho de grinding ou estalos'], pleasureTriggers: ['Motor de Indução/DC (Zumbido grave)', 'Operação silenciosa que permite conversa'], implementationNotes: 'Motores barulhentos causam fadiga em uso prolongado.' },
        { scoreKey: 'c8', label: 'Versatilidade Modular', weight: 0.05, painTriggers: ['Encaixe de acessórios proprietário', 'Acessórios frágeis de plástico'], pleasureTriggers: ['Hub de acessórios padrão (Ex: KitchenAid)', 'Acessórios de metal', 'Batedor com borda de silicone'], implementationNotes: 'Valorizar máquinas que aceitam acessórios antigos e novos.' },
        { scoreKey: 'c9', label: 'Higiene e Materiais', weight: 0.05, painTriggers: ['Acessórios de alumínio que oxidam', 'Frestas inacessíveis que acumulam comida'], pleasureTriggers: ['Acessórios em Inox ou Nylon (Lava-louças safe)', 'Lâminas e vedações totalmente desmontáveis', 'Design sem cantos vivos'], implementationNotes: 'Alumínio oxidado é tóxico. Exigir materiais seguros.' },
        { scoreKey: 'c10', label: 'Sustentabilidade Técnica (TCO)', weight: 0.02, painTriggers: ['Produto White Label sem peças', 'Obsolescência eletrônica'], pleasureTriggers: ['Disponibilidade de peças (Carvão, engrenagens)', 'Controles eletromecânicos robustos', 'Alto valor de revenda'], implementationNotes: 'Máquinas clássicas duram décadas e têm peças baratas.' },
    ],
};
