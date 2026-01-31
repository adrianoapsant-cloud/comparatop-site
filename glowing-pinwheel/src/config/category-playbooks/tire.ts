/**
 * @file tire.ts
 * @description Playbook de critérios para Pneus Automotivos
 * Pesos: 20+15+15+10+10+10+5+5+5+5 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const TIRE_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'tire',
    displayName: 'Pneus Automotivos',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Robustez Estrutural (Buracos)', weight: 0.20, painTriggers: ['Bolhas/Hérnias laterais com pouco uso', 'Pneu Run Flat que rasga ou trinca a roda no Brasil', 'Flanco frágil que não aguenta guia'], pleasureTriggers: ['Lona dupla reforçada (2-ply sidewall)', 'Protetor de Borda (Rim Protection)', 'Tecnologia anti-impacto (ex: Michelin IronFlex)'], implementationNotes: 'Se Uso = "Urbano BR" → ELIMINAR pneus com laterais finas. Run Flat é risco alto no Brasil.' },
        { scoreKey: 'c2', label: 'Segurança Molhada (Wet Grip)', weight: 0.15, painTriggers: ['Etiqueta E/F em chuva (Sabonete)', 'Aquaplanagem fácil em curvas', 'Perda de aderência súbita após meia vida'], pleasureTriggers: ['Etiqueta A/B no INMETRO', 'Sulcos largos de drenagem', 'Composto de sílica que mantém grip velho'], implementationNotes: 'Chuva tropical exige drenagem máxima. Penalizar pneus "E" severamente.' },
        { scoreKey: 'c3', label: 'Durabilidade (CPK - Custo/Km)', weight: 0.15, painTriggers: ['Treadwear baixo (< 300) que gasta em 20k km', 'Pneu barato que sai caro por km rodado', 'Desgaste irregular (Escamamento)'], pleasureTriggers: ['Treadwear > 400 realista', 'Durabilidade > 50.000 km (Uso misto)', 'Custo por Km mais baixo da categoria'], implementationNotes: 'Calcular Custo/Km. Pneu Premium que dura mais é mais barato.' },
        { scoreKey: 'c4', label: 'Uniformidade (Balanceamento)', weight: 0.10, painTriggers: ['Pneu Remold impossível de balancear (Ovo)', 'Exige muito chumbo na roda', 'Vibração no volante acima de 100km/h'], pleasureTriggers: ['Construção de fábrica Tier 1 (Michelin/Pirelli)', 'Balanceamento fácil com pouco peso', 'Circularidade perfeita'], implementationNotes: 'Remold é risco de vibração crônica.' },
        { scoreKey: 'c5', label: 'Garantia e Suporte', weight: 0.10, painTriggers: ['Garantia negada sistematicamente como "mau uso"', 'Burocracia de laudo (Semanas sem carro)', 'Marca sem representante no Brasil'], pleasureTriggers: ['Garantia contra acidentes/buracos (Tyrelife/Seguro)', 'Troca rápida em revenda oficial', 'Laudo técnico transparente'], implementationNotes: 'Valorizar marcas que dão "seguro buraco" grátis.' },
        { scoreKey: 'c6', label: 'Integridade Química', weight: 0.10, painTriggers: ['Picotamento (Chipping) da borracha em asfalto quente', 'Ressecamento precoce (Rachaduras)', 'DOT antigo (> 5 anos) vendido como novo'], pleasureTriggers: ['Composto estável UV/Ozônio', 'Resistência a abrasão tropical', 'Data de fabricação recente garantida'], implementationNotes: 'Borracha velha é vidro. Alertar sobre DOT.' },
        { scoreKey: 'c7', label: 'Estabilidade Direcional', weight: 0.05, painTriggers: ['Flanco mole que dobra em curva ("Gelatina")', 'Tramlining (Segue imperfeições da pista)', 'Resposta lenta de direção'], pleasureTriggers: ['Ombros rígidos e blocos interligados', 'Resposta de direção precisa', 'Estabilidade em alta velocidade'], implementationNotes: 'Essencial para rodovias.' },
        { scoreKey: 'c8', label: 'Conforto Acústico', weight: 0.05, painTriggers: ['Zumbido (Howling) de rolamento alto', 'Ressonância em asfalto rugoso', 'Desenho em V barulhento'], pleasureTriggers: ['Tecnologia de cancelamento de ruído (Espuma interna)', 'Blocos assimétricos de passo variável', 'Rodagem silenciosa (< 70dB)'], implementationNotes: 'Diferencial para carros médios/luxo.' },
        { scoreKey: 'c9', label: 'Eficiência (Combustível)', weight: 0.05, painTriggers: ['Resistência ao rolamento alta', 'Pneu pesado que aumenta massa não suspensa'], pleasureTriggers: ['Etiqueta A/B em Consumo', 'Composto "Verde" de baixa histerese', 'Economia de 3-5% no combustível'], implementationNotes: 'Bom para frotas/táxis. Para usuário comum, segurança vem antes.' },
        { scoreKey: 'c10', label: 'Logística de Reposição', weight: 0.05, painTriggers: ['Pneu importado "lote único" (Se rasgar, não acha outro igual)', 'Medida exótica sem estoque'], pleasureTriggers: ['Modelo de linha perene nacional', 'Disponibilidade em qualquer borracharia', 'Estoque regular no varejo'], implementationNotes: 'Nunca comprar pneu "filho único" importado.' },
    ],
};
