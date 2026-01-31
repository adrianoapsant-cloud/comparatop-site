/**
 * @file fan.ts
 * @description Playbook de critérios para Ventiladores e Climatizadores
 * Pesos: 20+20+15+10+10+8+5+5+5+2 = 100% ✓
 */
import type { CategoryPlaybook } from './tv';

export const FAN_PLAYBOOK: CategoryPlaybook = {
    categoryId: 'fan',
    displayName: 'Ventiladores e Climatizadores',
    market: 'Mercado Brasileiro',
    criteria: [
        { scoreKey: 'c1', label: 'Eficiência de Vazão (Pás)', weight: 0.20, painTriggers: ['"Vento de Pancada" (Turbulência de 3 pás)', 'Modo Turbo que só faz barulho e não venta', 'Fluxo espalhado que não chega longe'], pleasureTriggers: ['Hélice de 6, 8 ou 15 pás (Fluxo laminar)', 'Grade com tecnologia "Power Zone" (Vento focado)', 'Velocidade de vento confortável (2-3 m/s)'], implementationNotes: 'Mais pás = Vento mais suave e contínuo.' },
        { scoreKey: 'c2', label: 'Psicoacústica (Sono)', weight: 0.20, painTriggers: ['Zumbido elétrico (Humming) cíclico', 'Velocidade mínima muito forte e barulhenta', 'Vibração transmitida ao piso'], pleasureTriggers: ['Ruído Branco aerodinâmico (Ajuda a dormir)', 'Velocidade Mínima "Brisa Suave" silenciosa', 'Ruído < 55dB em uso noturno'], implementationNotes: 'O teste real é a velocidade Mínima, não a Máxima.' },
        { scoreKey: 'c3', label: 'Biossegurança e Limpeza', weight: 0.15, painTriggers: ['Grade com parafuso difícil de tirar (Acumula pó)', 'Climatizador com tanque fixo (Cria limo/mofo)', 'Cheiro de "cachorro molhado"'], pleasureTriggers: ['Sistema "Clic Lav" (Desmontagem sem ferramenta)', 'Gaveta e Filtro removíveis para secagem', 'Ionizador para purificação do ar'], implementationNotes: 'Se não dá para limpar fácil, vira vetor de doença.' },
        { scoreKey: 'c4', label: 'Controle de Umidade', weight: 0.10, painTriggers: ['Uso em local úmido (Efeito estufa/Pele pegajosa)', 'Climatizador fraco que não ventila', 'Chão molhado em frente ao aparelho'], pleasureTriggers: ['Ventilação cruzada potente', 'Colmeia espessa de alta evaporação', 'Recomendação geográfica (Ideal p/ clima seco)'], implementationNotes: 'Se Local = "Litoral/Norte" → Alerta: Climatizador pode saturar o ar.' },
        { scoreKey: 'c5', label: 'Integridade Mecânica', weight: 0.10, painTriggers: ['"Ventilador Dançarino" (Base leve/instável)', 'Hélice desbalanceada (Trepidação)', 'Vazamento de água (Climatizador)'], pleasureTriggers: ['Base pesada e estável', 'Balanceamento dinâmico de fábrica', 'Bomba de água robusta e vedada'], implementationNotes: 'Vibração excessiva mata o motor.' },
        { scoreKey: 'c6', label: 'Usabilidade Noturna (LEDs)', weight: 0.08, painTriggers: ['LED azul forte que ilumina o quarto', 'Bip alto ao mudar velocidade', 'Falta de timer de desligamento'], pleasureTriggers: ['Função "Apagar Visor" ou "Sleep"', 'Modo silencioso sem bips', 'Controle remoto completo'], implementationNotes: 'Luz forte no painel atrapalha a melatonina.' },
        { scoreKey: 'c7', label: 'Eficiência Energética (Procel)', weight: 0.05, painTriggers: ['Consumo alto sem vazão (Motor ineficiente)', 'Climatizador que gasta igual a Ar-Condicionado', 'Selo Procel B ou inferior'], pleasureTriggers: ['Selo Procel A', 'Tecnologia "Eco Fresh" (Economia real)', 'Consumo < 0.1 kWh (Ventilador)'], implementationNotes: 'Ventilador é 50x mais barato que AC.' },
        { scoreKey: 'c8', label: 'Autonomia (Reservatório)', weight: 0.05, painTriggers: ['Tanque pequeno (< 4L) que seca de madrugada', 'Bomba que queima se acabar a água (Sem sensor)'], pleasureTriggers: ['Autonomia > 8h (Noite inteira)', 'Desligamento automático da bomba (Segurança)', 'Abastecimento superior fácil'], implementationNotes: 'Sensor de nível baixo é vital.' },
        { scoreKey: 'c9', label: 'Design e Espaço', weight: 0.05, painTriggers: ['"Trambolho" feio na sala', 'Torre fraca que não venta nada', 'Dificuldade de guardar no inverno'], pleasureTriggers: ['Design de Torre moderno (Economia de espaço)', 'Desmontável para armazenamento', 'Estética que combina com a mobília'], implementationNotes: 'Torre é bonita mas venta menos.' },
        { scoreKey: 'c10', label: 'Inovação (Repelente/Smart)', weight: 0.02, painTriggers: ['Funções inúteis que encarecem', 'Conectividade ruim'], pleasureTriggers: ['Repelente integrado (Dengue)', 'Compartimento para Gelo (Frescor extra)', 'Compatibilidade Alexa/Google'], implementationNotes: 'Repelente é "matador" no verão brasileiro.' },
    ],
};
