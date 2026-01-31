/**
 * @file car_battery.ts
 * @description Playbook de critérios para Baterias Automotivas
 * Pesos: 25+15+15+10+10+8+5+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const CAR_BATTERY_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'car_battery',
    displayName: 'Baterias Automotivas',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Tecnologia Adequada (Start-Stop)', weight: 0.25, painTriggers: ['Bateria SLI (Convencional) em carro Start-Stop (Morre em 3 meses)', 'Instalação de AGM no cofre do motor quente'], pleasureTriggers: ['EFB para Start-Stop básico ou carros modernos', 'AGM para carros com freio regenerativo (Longe do calor)', 'SLI apenas para carros antigos/básicos'], implementationNotes: 'Se Veículo = "Start-Stop" → ELIMINAR bateria SLI.' },
        { scoreKey: 'c2', label: 'Reserva de Capacidade (RC)', weight: 0.15, painTriggers: ['RC baixo (< 75 min) em carro com muito acessório', 'Bateria que arria em engarrafamento com ar ligado'], pleasureTriggers: ['RC > 90 minutos (Segurança no trânsito)', 'Capacidade real de sustentar eletrônica com motor em baixa'], implementationNotes: 'No trânsito urbano, RC importa mais que CCA.' },
        { scoreKey: 'c3', label: 'Custo Total (TCO/Mês)', weight: 0.15, painTriggers: ['Bateria barata que dura 12 meses (Custo/mês alto)', 'Garantia curta que não cobre a falha'], pleasureTriggers: ['Bateria Premium/Tier 2 que dura 48 meses', '"Segunda Linha" (Zetta/ACDelco) com preço justo e alta durabilidade'], implementationNotes: 'Calcular: Preço / Meses de Vida Estimada.' },
        { scoreKey: 'c4', label: 'Corrente de Partida (CCA)', weight: 0.10, painTriggers: ['CCA nominal falso (Reprovado em testes)', 'Bateria "leve" (Pouco chumbo)', 'Dificuldade de partida no frio (Sul do Brasil)'], pleasureTriggers: ['CCA real acima do rótulo (Testes independentes)', 'Placas robustas', 'Partida instantânea'], implementationNotes: 'CCA é indicador de saúde. Desconfiar de marcas genéricas.' },
        { scoreKey: 'c5', label: 'Frescor do Estoque (Data)', weight: 0.10, painTriggers: ['Bateria fabricada há > 6 meses (Sulfatada na prateleira)', 'Vendedor que esconde a data de fabricação'], pleasureTriggers: ['Estoque rotativo (< 3 meses de fabricação)', 'Código de data decifrado e visível'], implementationNotes: 'Bateria velha é bateria morta. Exigir data recente.' },
        { scoreKey: 'c6', label: 'Garantia e Assistência', weight: 0.08, painTriggers: ['Garantia de balcão (Leva e traz)', 'Burocracia que exige laudo demorado', 'Negativa por "sobrecarga" sem teste'], pleasureTriggers: ['Garantia com Socorro 24h (Heliar)', 'Rede de assistência capilar (Moura)', 'Troca simplificada'], implementationNotes: 'Para quem não tem seguro, Heliar (com guincho) é imbatível.' },
        { scoreKey: 'c7', label: 'Tier de Marca (Origem)', weight: 0.05, painTriggers: ['Marca "White Label" sem origem clara', 'Falsificações ou recondicionadas'], pleasureTriggers: ['Tier 1 (Moura/Heliar/Bosch/ACDelco)', 'Tier 2 Oficial (Zetta/Strada) - Qualidade da matriz, preço menor'], implementationNotes: 'Saber quem fabrica. Zetta é uma Moura mais barata.' },
        { scoreKey: 'c8', label: 'Vedação (Zinabre)', weight: 0.05, painTriggers: ['Vazamento de ácido pelos polos', 'Zinabre frequente que corrói cabos', 'Caixa frágil'], pleasureTriggers: ['Tecnologia de labirinto de gás eficiente', 'Polos selados e robustos', 'Livre de manutenção real'], implementationNotes: 'Zinabre é sinal de falha de vedação.' },
        { scoreKey: 'c9', label: 'Diagnóstico Real', weight: 0.05, painTriggers: ['Confiança cega no "Visor Verde" (Engana-trouxa)', 'Falta de acesso para teste de densidade'], pleasureTriggers: ['Facilidade de teste com analisador digital', 'Transparência sobre o estado de carga'], implementationNotes: 'Alertar: "Visor Verde não garante bateria boa".' },
        { scoreKey: 'c10', label: 'Logística Reversa', weight: 0.02, painTriggers: ['Descarte incorreto (Crime ambiental)', 'Preço sem a base de troca'], pleasureTriggers: ['Desconto claro na base de troca (Cashback do chumbo)', 'Coleta ambientalmente correta'], implementationNotes: 'O preço padrão deve ser sempre "a base de troca".' },
    ],
};
