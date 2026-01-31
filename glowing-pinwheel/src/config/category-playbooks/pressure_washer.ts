/**
 * @file pressure_washer.ts
 * @description Playbook de critérios para Lavadoras de Alta Pressão
 * Pesos: 25+15+15+10+10+8+7+5+3+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const PRESSURE_WASHER_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'pressure_washer',
    displayName: 'Lavadoras de Alta Pressão',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Tecnologia do Motor (Indução)', weight: 0.25, painTriggers: ['Motor Universal de escovas (Barulhento e frágil)', 'Ciclo de trabalho curto (< 20 min) que exige pausa', 'Cheiro de queimado/faíscas com uso contínuo'], pleasureTriggers: ['Motor de Indução (Silencioso e Durável)', 'Uso contínuo por horas sem superaquecer', 'Vida útil de milhares de horas'], implementationNotes: 'Se Uso = "Quintal Grande/Comercial" → ELIMINAR Motor Universal.' },
        { scoreKey: 'c2', label: 'Vazão Real (Litros/Hora)', weight: 0.15, painTriggers: ['Vazão baixa (< 300 L/h) que demora para limpar', 'Jato "agulha" que exige muitas passadas', 'Foco apenas em PSI alto com pouca água'], pleasureTriggers: ['Vazão > 400 L/h (Limpeza rápida por arraste)', 'Equilíbrio Pressão x Vazão (Cleaning Units)', 'Jato com leque largo e potente'], implementationNotes: 'Vazão remove a sujeira. Pressão só solta.' },
        { scoreKey: 'c3', label: 'Material do Cabeçote (Bomba)', weight: 0.15, painTriggers: ['Cabeçote de plástico que trinca com fadiga', 'Roscas de entrada de água que espanam fácil', 'Vazamentos internos precoces'], pleasureTriggers: ['Cabeçote de Latão (Brass) ou Alumínio de qualidade', 'Pistões de Inox/Cerâmica', 'Resistência a golpes de aríete'], implementationNotes: 'Plástico é descartável. Latão é profissional.' },
        { scoreKey: 'c4', label: 'Pressão de Trabalho (Real)', weight: 0.10, painTriggers: ['Pressão "Nominal" oculta pelo marketing de "Pico"', 'Gap grande (> 30%) entre Pico e Trabalho', 'Máquina que perde força durante o uso'], pleasureTriggers: ['Pressão Nominal declarada e honesta', 'Manômetro integrado para verificação', 'Pressão estável sob carga'], implementationNotes: 'Ignorar "Pressão de Pico". Usar Pressão Nominal para comparação.' },
        { scoreKey: 'c5', label: 'Qualidade da Mangueira', weight: 0.10, painTriggers: ['Mangueira curta (3m) que obriga a mover a máquina', 'Material de nylon rígido que dobra e marca', 'Conexões de plástico frágeis'], pleasureTriggers: ['Mangueira de Trama de Aço (Flexível e resistente)', 'Comprimento > 5m (Ideal 8-10m)', 'Conexões de metal robustas'], implementationNotes: 'Mangueira ruim estraga a experiência.' },
        { scoreKey: 'c6', label: 'Conectividade (Acessórios)', weight: 0.08, painTriggers: ['Conexão proprietária sem adaptadores no mercado', 'Incompatível com Snow Foam Lance profissional', 'Gatilho frágil'], pleasureTriggers: ['Padrão de engate universal (M22 ou Kärcher K)', 'Suporte nativo a canhão de espuma', 'Lança vario/turbo de qualidade'], implementationNotes: 'Para lavar carro, compatibilidade com Snow Foam é vital.' },
        { scoreKey: 'c7', label: 'Manutenibilidade (Peças)', weight: 0.07, painTriggers: ['Máquina "White Label" sem peças de reposição', 'Válvulas seladas não reparáveis', 'Rede de assistência inexistente'], pleasureTriggers: ['Peças de desgaste (O-rings, válvulas) disponíveis', 'Esquema explosivo público', 'Marca com fábrica/representação nacional'], implementationNotes: 'Valorizar marcas reparáveis (WAP/Kärcher).' },
        { scoreKey: 'c8', label: 'Ergonomia e Estabilidade', weight: 0.05, painTriggers: ['Máquina vertical instável que tomba fácil', 'Rodas pequenas que travam em piso irregular', 'Alça curta'], pleasureTriggers: ['Design horizontal (Carrinho) ou base larga', 'Rodas grandes e robustas', 'Suporte para enrolar mangueira/cabo'], implementationNotes: 'Queda da máquina é causa comum de quebra.' },
        { scoreKey: 'c9', label: 'Eficiência (TCO)', weight: 0.03, painTriggers: ['Máquina "econômica" que demora 3x mais para limpar', 'Motor ineficiente que esquenta'], pleasureTriggers: ['Motor de indução de alta eficiência', 'Limpeza rápida (Economia de energia/tempo)', 'Stop Total confiável'], implementationNotes: 'Tempo é dinheiro. Máquina rápida economiza luz e água no fim.' },
        { scoreKey: 'c10', label: 'Custo-Benefício', weight: 0.02, painTriggers: ['Preço profissional em máquina de plástico', 'Kit de acessórios inútil que encarece'], pleasureTriggers: ['Melhor conjunto Motor Indução + Cabeçote Alumínio pelo preço', 'Investimento que se paga na durabilidade'], implementationNotes: 'Fugir de máquinas caras com motor universal.' },
    ],
};
