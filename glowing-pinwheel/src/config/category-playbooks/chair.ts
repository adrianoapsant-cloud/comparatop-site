/**
 * @file chair.ts
 * @description Playbook de critérios para Cadeiras
 * Pesos: 20+15+15+10+10+8+7+5+5+5 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const CHAIR_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'chair',
    displayName: 'Cadeiras',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Engenharia da Espuma (Densidade)', weight: 0.20, painTriggers: ['Espuma Laminada (Fatiada) que deforma em 1 ano', '"Sentar na tábua" (Perda de resiliência)', 'Densidade não declarada ou baixa (< D33)'], pleasureTriggers: ['Espuma Injetada (Moldada) "Cold Cure"', 'Densidade Real D45 a D50', 'Garantia de não deformidade'], implementationNotes: 'Espuma laminada é filtro eliminatório para uso intensivo.' },
        { scoreKey: 'c2', label: 'Revestimento (Clima Tropical)', weight: 0.15, painTriggers: ['Couro Sintético (PU/PVC) que descasca (Hidrólise)', '"Efeito Estufa" (Calor/Suor acumulado)', 'Material que gruda na pele'], pleasureTriggers: ['Tecido Poliéster/Knit (Respirável)', 'Mesh (Tela) de alta qualidade', 'Durabilidade mecânica sem descascar'], implementationNotes: 'No Brasil, PU é programado para falhar (descascar).' },
        { scoreKey: 'c3', label: 'Mecanismo (Movimento)', weight: 0.15, painTriggers: ['Mecanismo Relax/Tilt (Joelho sobe ao reclinar)', 'Bloqueio da circulação sanguínea nas pernas', 'Trava apenas na posição vertical'], pleasureTriggers: ['Mecanismo Sincronizado (Proporção 2:1)', 'Pés mantidos no chão ao reclinar', 'Travamento multiponto'], implementationNotes: 'Mecanismo Relax é básico. Sincronizado é ergonômico.' },
        { scoreKey: 'c4', label: 'Suporte Lombar', weight: 0.10, painTriggers: ['Almofadas soltas com elástico (Escorregam/Duras)', 'Encosto reto sem curvatura', 'Almofada que empurra o usuário para fora'], pleasureTriggers: ['Suporte Integrado ao encosto', 'Ajuste de Altura e Profundidade', 'Curvatura natural da coluna mantida'], implementationNotes: 'Almofada solta é "remendo". Suporte integrado é engenharia.' },
        { scoreKey: 'c5', label: 'Ajustes (Braços e Assento)', weight: 0.10, painTriggers: ['Braços fixos ou de plástico duro', 'Assento fixo muito profundo (Pressão no joelho)', 'Falta de Slider de Assento'], pleasureTriggers: ['Braços 3D/4D (Altura/Rotação/Profundidade)', 'Slider de Assento (Ajuste de profundidade)', 'Superfície do braço "Soft Touch"'], implementationNotes: 'Slider de assento é vital para pessoas < 1,70m.' },
        { scoreKey: 'c6', label: 'Estrutura (Base e Pistão)', weight: 0.08, painTriggers: ['Pistão Classe 2 ou 3 (Risco de falha)', 'Base de aço com solda aparente (Oxida)', 'Rodízios de nylon que riscam o chão'], pleasureTriggers: ['Pistão Classe 4 (Segurança)', 'Base de Nylon (Engenharia) ou Alumínio', 'Rodízios de PU/Silicone (Anti-risco)'], implementationNotes: 'Pistão Classe 4 é mandatório.' },
        { scoreKey: 'c7', label: 'Design do Assento (Abas)', weight: 0.07, painTriggers: ['Assento "Concha" com abas laterais rígidas', 'Restrição de movimento ("Prende" as pernas)', 'Largura útil reduzida'], pleasureTriggers: ['Assento Plano (Flat)', 'Liberdade para abrir as pernas', 'Bordas arredondadas (Cachoeira)'], implementationNotes: 'Abas laterais "Racing" são ruins para ergonomia.' },
        { scoreKey: 'c8', label: 'Mercado (White Label)', weight: 0.05, painTriggers: ['Pagar preço "Premium" em cadeira genérica chinesa', 'Mesma cadeira vendida por 3 marcas com preços diferentes'], pleasureTriggers: ['Marca com design original/molde próprio', 'Transparência sobre a origem OEM', 'Preço justo pelo chassi oferecido'], implementationNotes: 'Identificar cadeiras iguais com etiquetas diferentes.' },
        { scoreKey: 'c9', label: 'Garantia Real (TCO)', weight: 0.05, painTriggers: ['"1 Ano" que só cobre a estrutura metálica', 'Exclusão de espuma e tecido na garantia', 'Garantia difícil de acionar'], pleasureTriggers: ['Garantia de 5 a 10 anos (Estrutura e Componentes)', 'Cobertura total (Inclusive Mesh/Tecido)', 'Custo por ano baixo'], implementationNotes: 'Cadeira de R$ 2k que dura 10 anos é mais barata que a de R$ 800 que dura 2.' },
        { scoreKey: 'c10', label: 'Certificação (Normas)', weight: 0.05, painTriggers: ['Sem certificação técnica', 'Apenas NR-17 (Mínimo dimensional)'], pleasureTriggers: ['Certificação BIFMA X5.1 (Durabilidade extrema)', 'Testes de fadiga comprovados'], implementationNotes: 'NR-17 é geometria. BIFMA é resistência.' },
    ],
};
