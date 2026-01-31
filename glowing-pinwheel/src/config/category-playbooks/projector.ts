/**
 * @file projector.ts
 * @description Playbook de critérios para Projetores
 * Pesos: 25+15+15+10+8+8+5+5+5+4 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const PROJECTOR_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'projector',
    displayName: 'Projetores',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Brilho Real (ANSI Lúmens)', weight: 0.25, painTriggers: ['"Lúmens de Marketing" (ex: 9.000 Lúmens que são 300 ANSI)', 'Imagem invisível com qualquer luz ambiente', 'Fraude de especificação'], pleasureTriggers: ['ANSI Lúmens certificado (Medição ISO)', 'Brilho suficiente para sala com luz indireta (>2.000 ANSI)', 'Transparência técnica'], implementationNotes: 'Ignorar "Lúmens LED/Fonte". Usar apenas ANSI. Se < 500 ANSI, classificar como "Brinquedo".' },
        { scoreKey: 'c2', label: 'Ótica e Foco (Nitidez)', weight: 0.15, painTriggers: ['Cantos borrados (Lente Fresnel barata)', 'Focus Drift (Perde foco quando esquenta)', 'Resolução "Suportada" (Aceita 4K mas projeta 480p)'], pleasureTriggers: ['Lentes de Vidro (Estabilidade térmica)', 'Foco uniforme centro-borda', 'Resolução Nativa 1080p ou 4K real'], implementationNotes: 'Lente de plástico dilata e perde foco. Vidro é mandatório para Tier A.' },
        { scoreKey: 'c3', label: 'Durabilidade (Mancha Marrom)', weight: 0.15, painTriggers: ['"Mancha Marrom/Amarela" no centro (LCD queimado)', 'Motor ótico aberto (Entra poeira na lente)', 'Ventilação insuficiente para o calor brasileiro'], pleasureTriggers: ['Motor Ótico Selado (IP5X - Anti-poeira)', 'Dissipação térmica eficiente (Heat pipes)', 'Filtro HEPA acessível (Epson)'], implementationNotes: 'Projetor barato "cozinha" o LCD em meses.' },
        { scoreKey: 'c4', label: 'Software e DRM (Widevine)', weight: 0.10, painTriggers: ['Netflix não funciona ou exige mouse (Sem licença)', 'Widevine L3 (Streaming limitado a 480p/SD)', 'Android "Gambiarrado" de tablet'], pleasureTriggers: ['Google TV / Android TV Oficial Certificado', 'Widevine L1 (Streaming em HD/4K)', 'Netflix Nativo funcionando'], implementationNotes: 'Sem Widevine L1 = Imagem pixelada.' },
        { scoreKey: 'c5', label: 'Contraste Real (Nível de Preto)', weight: 0.08, painTriggers: ['Preto "Cinza leitoso" (Vazamento de luz)', 'Contraste FOFO inflado (1.000.000:1 falso)', 'Imagem lavada em cenas escuras'], pleasureTriggers: ['Contraste ANSI alto (Intra-cena)', 'Tecnologia DLP ou 3LCD (Melhor preto)', 'Íris dinâmica funcional'], implementationNotes: 'Ignorar contraste dinâmico de marketing.' },
        { scoreKey: 'c6', label: 'Instalação (Zoom/Keystone)', weight: 0.08, painTriggers: ['Keystone Digital que destrói a resolução', 'Borda cinza brilhante ao redor da tela', 'Throw Ratio longo (Exige sala enorme)'], pleasureTriggers: ['Zoom Ótico real (Não digital)', 'Lens Shift (Mover a lente sem distorção)', 'Short Throw (Tela grande em sala pequena)'], implementationNotes: 'Keystone digital reduz pixels efetivos. Zoom ótico preserva qualidade.' },
        { scoreKey: 'c7', label: 'Latência (Gaming)', weight: 0.05, painTriggers: ['Input Lag > 50ms (Injogável para FPS)', 'Keystone ativado que aumenta o lag', 'Taxa de atualização baixa (30/60Hz)'], pleasureTriggers: ['Input Lag < 20ms (Modo Jogo)', 'Suporte a 120Hz/240Hz', 'Processamento rápido'], implementationNotes: 'Para gamers, correção trapezoidal é inimiga.' },
        { scoreKey: 'c8', label: 'Precisão de Cor', weight: 0.05, painTriggers: ['Cores "Neon" saturadas demais', 'Efeito Arco-Íris (RBE) em DLPs lentos', 'Falta de calibração Rec.709'], pleasureTriggers: ['Cobertura Rec.709 / DCI-P3', 'Tecnologia 3LCD (Cores iguais ao branco)', 'Cores naturais de pele'], implementationNotes: '3LCD não tem arco-íris. Single LCD barato tem cor artificial.' },
        { scoreKey: 'c9', label: 'Acústica (Ruído)', weight: 0.05, painTriggers: ['Ventoinha "Turbina de Avião" (> 50dB)', 'Som integrado metálico e inútil'], pleasureTriggers: ['Operação silenciosa (< 30dB)', 'Bluetooth Bidirecional (Usar fone sem fio)', 'Som estéreo aceitável'], implementationNotes: 'Ruído alto estraga cenas silenciosas.' },
        { scoreKey: 'c10', label: 'Conectividade', weight: 0.04, painTriggers: ['Falta de HDMI ARC (Exige múltiplos controles)', 'Porta USB fraca que não alimenta Fire Stick'], pleasureTriggers: ['HDMI eARC/ARC (Integração com Soundbar)', 'USB 5V/1A estável', 'Wi-Fi 6 (Para 4K sem travar)'], implementationNotes: 'ARC é vida. Sem ele, a soundbar vira dor de cabeça.' },
    ],
};
