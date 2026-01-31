/**
 * @file case.ts
 * @description Playbook de critérios para Gabinetes
 * Pesos: 25+15+15+10+10+8+5+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const CASE_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'case',
    displayName: 'Gabinetes',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Eficiência Térmica (Airflow)', weight: 0.25, painTriggers: ['Painel frontal de vidro sólido (Sufoca fans)', 'Filtro de poeira muito denso', 'GPU montada no vidro'], pleasureTriggers: ['Painel frontal em Mesh (Malha)', 'Fluxo de ar direto sem obstrução', 'Ventoinhas de 140mm inclusas'], implementationNotes: 'Se GPU = "High-End" → ELIMINAR frente de vidro. Mesh é rei no Brasil.' },
        { scoreKey: 'c2', label: 'Compatibilidade Física (GPU/AIO)', weight: 0.15, painTriggers: ['GPU que não cabe (Comprimento < 340mm)', 'Radiador no topo que bate na RAM', 'Falta de espaço para RTX 4090'], pleasureTriggers: ['Suporte a GPUs > 400mm', 'Topo compatível com radiador 360mm/420mm', 'Espaço para Push-Pull'], implementationNotes: 'Verificar "GPU Clearance" com radiador instalado.' },
        { scoreKey: 'c3', label: 'Qualidade de Construção', weight: 0.15, painTriggers: ['Vidro temperado que explode', 'Chapa de aço fina (< 0.6mm) que vibra', 'Roscas que espanam fácil'], pleasureTriggers: ['Vidro com moldura metálica de proteção', 'Aço > 0.8mm (Estrutura rígida)', 'Pintura resistente a UV'], implementationNotes: 'Vidro parafusado direto é risco de quebra.' },
        { scoreKey: 'c4', label: 'Ergonomia de Montagem', weight: 0.10, painTriggers: ['Espaço traseiro < 20mm para cabos', 'Arestas cortantes (Sangue na montagem)', 'Ausência de grommets'], pleasureTriggers: ['Espaço generoso para gestão de cabos', 'Paineis Tool-less (Sem ferramentas)', 'Velcro e canais de roteamento'], implementationNotes: 'Para iniciantes, recomendar gestão de cabos premium.' },
        { scoreKey: 'c5', label: 'Manutenibilidade (Filtros)', weight: 0.10, painTriggers: ['Filtro inferior traseiro (Difícil acesso)', 'Filtro de espuma que esfarela', 'Ausência de filtro frontal'], pleasureTriggers: ['Filtro frontal/inferior tipo "Gaveta"', 'Malha de nylon fino (Alta captura)', 'Fácil remoção sem desmontar painel'], implementationNotes: 'Filtro difícil de limpar = PC sujo e quente.' },
        { scoreKey: 'c6', label: 'Integração de Ecossistema', weight: 0.08, painTriggers: ['Hub de ventoinha proprietário', 'Ventoinhas inclusas barulhentas/fracas', 'RGB que não sincroniza com a placa-mãe'], pleasureTriggers: ['Conectores PWM/ARGB padrão universal', 'Hub incluso de alta qualidade', 'Ventoinhas de performance real'], implementationNotes: 'Penalizar sistemas proprietários que impedem upgrades.' },
        { scoreKey: 'c7', label: 'Acústica e Silêncio', weight: 0.05, painTriggers: ['Ressonância metálica (Zumbido)', 'Ventoinhas frontais turbulentas', 'Isolamento acústico que esquenta o PC'], pleasureTriggers: ['Painéis com manta acústica (Se foco for silêncio)', 'Estrutura rígida anti-vibração', 'Ventoinhas PWM de baixa rotação'], implementationNotes: 'Gabinetes "Silent" tendem a ser mais quentes.' },
        { scoreKey: 'c8', label: 'Custo-Benefício (TCO)', weight: 0.05, painTriggers: ['Gabinete barato sem ventoinhas (Custo oculto)', 'Fonte bomba inclusa "de brinde"'], pleasureTriggers: ['Pacote completo (Gabinete + 3/4 Fans PWM)', 'Preço justo pela construção', 'Sem necessidade de compras extras imediatas'], implementationNotes: 'Gabinete de R$ 300 pelado sai mais caro que um de R$ 500 completo.' },
        { scoreKey: 'c9', label: 'Logística e Embalagem', weight: 0.05, painTriggers: ['Isopor quebradiço (EPS) que não protege o vidro', 'Alto índice de quebra no transporte'], pleasureTriggers: ['Espuma EPE de alta densidade', 'Caixa reforçada', 'RMA ágil em caso de quebra'], implementationNotes: 'Transporte nacional é agressivo. Embalagem ruim = Vidro quebrado.' },
        { scoreKey: 'c10', label: 'Tendências (BTF/Reverse)', weight: 0.02, painTriggers: ['Incompatível com placas-mãe de conector traseiro', 'Layout antigo sem USB-C frontal'], pleasureTriggers: ['Suporte a ASUS BTF / MSI Project Zero', 'USB-C no painel frontal nativo', 'Layout modular (Reverse Mode)'], implementationNotes: 'Preparado para o novo padrão de placas "sem cabos visíveis".' },
    ],
};
