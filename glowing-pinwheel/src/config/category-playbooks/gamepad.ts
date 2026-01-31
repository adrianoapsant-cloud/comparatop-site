/**
 * @file gamepad.ts
 * @description Playbook de critérios para Gamepads
 * Pesos: 25+15+15+10+10+8+7+5+3+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const GAMEPAD_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'gamepad',
    displayName: 'Gamepads',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Tecnologia de Sensor (Drift)', weight: 0.25, painTriggers: ['Potenciômetro de carbono tradicional (Drift em meses)', 'Zona morta grande de fábrica', 'Erro de circularidade alto (>10%)'], pleasureTriggers: ['Sensores Hall Effect (Magnéticos, sem contato)', 'Tecnologia TMR (Nova geração)', 'Calibração "Zero Deadzone" real'], implementationNotes: 'Se Sensor = "Potenciômetro" → Alerta de Risco de Drift. Hall Effect é o padrão ouro.' },
        { scoreKey: 'c2', label: 'Latência e Conexão', weight: 0.15, painTriggers: ['Bluetooth com lag notável em PC (>10ms)', 'Polling Rate instável (Jitter)', 'Promessa de "1000Hz" que não funciona no Xbox'], pleasureTriggers: ['Conexão 2.4GHz via Dongle (Baixa latência)', 'Polling Rate real de 1000Hz (PC cabeado)', 'Chave seletora de modo (X-Input/D-Input)'], implementationNotes: 'Para FPS/Luta, Bluetooth é proibido. Exigir 2.4GHz ou Cabo.' },
        { scoreKey: 'c3', label: 'Qualidade de Construção', weight: 0.15, painTriggers: ['Botões de face de membrana "chiclete"', 'Bumpers (RB/LB) frágeis que quebram', 'Grips de borracha que descolam com calor'], pleasureTriggers: ['Switches Mecânicos (Clique tátil e durável)', 'Faceplate magnética trocável', 'Plástico texturizado a laser (Sem borracha que derrete)'], implementationNotes: 'Microswitches duram milhões de cliques. Membrana rasga.' },
        { scoreKey: 'c4', label: 'Custo-Benefício (TCO)', weight: 0.10, painTriggers: ['Controle "Pro" de R$ 1.500 que usa potenciômetro', 'Modelo barato que quebra em 3 meses', 'Custo por ano de uso alto'], pleasureTriggers: ['Mid-Range com Hall Effect (R$ 250-400)', 'Alta durabilidade pelo preço', 'Peças de reposição baratas'], implementationNotes: 'O "Budget King" (GameSir/8BitDo) bate o "Elite" em valor.' },
        { scoreKey: 'c5', label: 'Suporte e Garantia (Brasil)', weight: 0.10, painTriggers: ['Importado do AliExpress sem garantia', 'Taxação de 92% (Remessa Conforme)', 'Falta de peças de reparo'], pleasureTriggers: ['Venda Oficial no Brasil com Garantia Legal', 'Marcas com representação (Sony/Microsoft/Gamesir Oficial)', 'Peças abundantes no Mercado Livre'], implementationNotes: 'Alertar sobre risco de importação e impostos.' },
        { scoreKey: 'c6', label: 'Compatibilidade (PC/Console)', weight: 0.08, painTriggers: ['DualSense que precisa de DS4Windows', 'Controle de Switch sem gatilho analógico para corrida'], pleasureTriggers: ['Suporte Nativo a XInput (Reconhece como Xbox)', 'Licença Oficial Xbox (Plug and Play)', 'Compatibilidade Android/iOS nativa'], implementationNotes: 'Para PC, XInput é rei. DualSense exige configuração extra.' },
        { scoreKey: 'c7', label: 'Software e Personalização', weight: 0.07, painTriggers: ['Software bugado que "brica" o controle', 'App mobile obrigatório ruim', 'Risco de banimento (Macros de hardware)'], pleasureTriggers: ['Software estável para PC/Mobile', 'Mapeamento On-the-Fly (Sem software)', 'Curvas de resposta personalizáveis'], implementationNotes: 'Software instável mata o produto.' },
        { scoreKey: 'c8', label: 'Ergonomia (Tamanho/Grip)', weight: 0.05, painTriggers: ['Controle pequeno demais para mãos grandes', 'Superfície lisa que escorrega com suor', 'Gatilhos com curso curto demais'], pleasureTriggers: ['Tamanho padrão Xbox (Universal)', 'Textura antiderrapante no chassi', 'Opções de tamanho ("Mini" vs. "Pro")'], implementationNotes: 'Classificar por tamanho de mão. Grip é essencial no calor.' },
        { scoreKey: 'c9', label: 'Recursos Extras (Paddles)', weight: 0.03, painTriggers: ['Botões traseiros fáceis de apertar sem querer', 'Giroscópio ausente (Ruim para emulação Switch)'], pleasureTriggers: ['Paddles traseiros com trava mecânica', 'Giroscópio de 6 eixos funcional', 'Vibração nos gatilhos (Impulse Triggers)'], implementationNotes: 'Paddles são vitais para FPS (Pular e mirar).' },
        { scoreKey: 'c10', label: 'Áudio e Imersão', weight: 0.02, painTriggers: ['P2 que não funciona sem fio', 'Vibração fraca ou barulhenta'], pleasureTriggers: ['Vibração HD (Haptic Feedback)', 'Áudio sem fio de baixa latência', 'Mixagem de Chat/Jogo no controle'], implementationNotes: 'Critério de desempate. Áudio no controle é conveniência.' },
    ],
};
