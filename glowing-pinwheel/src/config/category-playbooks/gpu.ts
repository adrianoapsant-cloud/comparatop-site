/**
 * @file gpu.ts
 * @description Playbook de critérios para Placas de Vídeo
 * Pesos: 25+20+15+10+8+5+5+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const GPU_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'gpu',
    displayName: 'Placas de Vídeo',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Longevidade de VRAM (ILV)', weight: 0.25, painTriggers: ['8GB de VRAM em 2025 (Obsolescência programada)', 'Stuttering por falta de memória em 1440p', 'Barramento estreito (128-bit) em placas caras'], pleasureTriggers: ['12GB (Mínimo para 1440p) ou 16GB (Ideal)', 'Largura de banda suficiente para texturas Ultra', 'Equilíbrio Chip/Memória'], implementationNotes: 'Se Resolução > 1080p E VRAM ≤ 8GB → ELIMINAR (Risco de travamento).' },
        { scoreKey: 'c2', label: 'Custo por Frame (CF-BR)', weight: 0.20, painTriggers: ['Placa "Lançamento" com ágio de novidade', 'Modelo Intermediário com preço de High-End', 'Custo parcelado abusivo'], pleasureTriggers: ['RX 6600 (Rei do Custo-Benefício 1080p)', 'Preço à vista competitivo', 'Promoções reais abaixo do MSRP'], implementationNotes: 'Calcular R$/FPS. Penalizar novidades com preço inflado.' },
        { scoreKey: 'c3', label: 'Garantia e RMA (Risco Litoral)', weight: 0.15, painTriggers: ['Negativa de garantia por "oxidação superficial" (Comum na MSI)', 'Reembolso desvalorizado (Gigabyte)', 'Envio internacional obrigatório'], pleasureTriggers: ['Garantia Nacional de 3 Anos (Galax/Teclab)', 'Processo de RMA claro e funcional', 'Tolerância a condições climáticas brasileiras'], implementationNotes: 'Se usuário mora no litoral → ALERTA VERMELHO para marcas que rejeitam oxidação.' },
        { scoreKey: 'c4', label: 'Eficiência Térmica (Hotspot)', weight: 0.10, painTriggers: ['Hotspot atingindo 110°C (Throttling)', 'Necessidade de Undervolt para não ferver', 'Modelos "Mini" ou Dual-Fan em chips potentes'], pleasureTriggers: ['Cooler superdimensionado (Triple Fan)', 'Delta baixo entre GPU e Hotspot', 'Operação fria (< 75°C) em stock'], implementationNotes: 'Placa que bate 110°C no Hotspot tem vida útil menor.' },
        { scoreKey: 'c5', label: 'Ecossistema de Features (IA)', weight: 0.08, painTriggers: ['Dependência de upscaling (FSR) para rodar nativo', 'Drivers instáveis (Histórico de timeout)'], pleasureTriggers: ['DLSS 3/Frame Generation (Hardware dedicado)', 'Suporte a Codecs de vídeo (AV1) para streaming', 'Drivers maduros e estáveis'], implementationNotes: 'Nvidia cobra "imposto", mas entrega DLSS superior.' },
        { scoreKey: 'c6', label: 'Compatibilidade Física', weight: 0.05, painTriggers: ['Placa gigante (> 340mm) que exige serrar o gabinete', 'Conector de energia que dobra e derrete', 'Ocupa 4 slots em gabinete pequeno'], pleasureTriggers: ['Tamanho padrão (Dual slot / < 300mm)', 'Conector de energia bem posicionado', 'Suporte (sag bracket) incluso'], implementationNotes: 'Alertar: "Verifique o tamanho do seu gabinete".' },
        { scoreKey: 'c7', label: 'Acústica (Coil Whine)', weight: 0.05, painTriggers: ['Coil Whine (Zumbido) alto não coberto pela garantia', 'Ventoinhas barulhentas a 100%'], pleasureTriggers: ['Modo 0dB (Fan Stop) em repouso', 'Componentes elétricos de qualidade silenciosa', 'Construção robusta anti-vibração'], implementationNotes: 'Coil Whine é "loteria", mas marcas baratas sofrem mais.' },
        { scoreKey: 'c8', label: 'Valor de Revenda', weight: 0.05, painTriggers: ['Placa com estigma de mineração (RX 580/5700)', 'Desvalorização rápida (Modelos impopulares)'], pleasureTriggers: ['Alta liquidez no mercado de usados (Nvidia xx60/xx70)', 'Baixa depreciação histórica'], implementationNotes: 'Nvidia vende mais fácil e mais caro usada que AMD no Brasil.' },
        { scoreKey: 'c9', label: 'Modelos "OC" (Custo Premium)', weight: 0.05, painTriggers: ['Pagar 30% a mais por 2% de ganho (Versão Strix/Aorus)', 'Preço que invade a categoria superior de GPU'], pleasureTriggers: ['Modelos MSRP (Preço base) com construção honesta', 'Linhas "Galax SG" ou "Asus Dual" (Custo-benefício)'], implementationNotes: 'Não pague preço de 4070 em uma 4060 Ti "Premium".' },
        { scoreKey: 'c10', label: 'Estética ("White Tax")', weight: 0.02, painTriggers: ['Pagar ágio de R$ 500+ só pela cor branca', 'Placa bonita com construção interna ruim'], pleasureTriggers: ['Estética coerente sem ágio abusivo', 'Backplate de metal (Funcional e bonito)'], implementationNotes: 'Cor branca não dá FPS. Alerta de "Custo da Vaidade".' },
    ],
};
