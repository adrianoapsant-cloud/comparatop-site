'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognitionInstance;
}

// Extend Window interface
declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
}

export interface UseSpeechRecognitionReturn {
    isListening: boolean;
    transcript: string;
    error: string | null;
    isSupported: boolean;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

/**
 * Hook personalizado para reconhecimento de voz usando Web Speech API
 * @param lang - Idioma para reconhecimento (default: 'pt-BR')
 * @returns Estados e funções de controle do reconhecimento de voz
 */
export function useSpeechRecognition(lang: string = 'pt-BR'): UseSpeechRecognitionReturn {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    // Verificar suporte do navegador
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            setIsSupported(!!SpeechRecognition);

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = lang;
                recognition.continuous = false; // Apenas comando inicial
                recognition.interimResults = true; // Mostrar resultados parciais
                recognition.maxAlternatives = 1;

                recognition.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const current = event.resultIndex;
                    const result = event.results[current];
                    const transcriptValue = result[0].transcript;
                    setTranscript(transcriptValue);
                };

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    setIsListening(false);

                    // Tratamento de erros comuns
                    const errorMessages: Record<string, string> = {
                        'not-allowed': 'Permissão de microfone negada. Por favor, habilite nas configurações do navegador.',
                        'no-speech': 'Nenhuma fala detectada. Tente novamente.',
                        'audio-capture': 'Nenhum microfone foi encontrado.',
                        'network': 'Erro de rede. Verifique sua conexão.',
                        'aborted': 'Reconhecimento cancelado.',
                        'language-not-supported': 'Idioma não suportado.',
                        'service-not-allowed': 'Serviço de reconhecimento não disponível.',
                    };

                    setError(errorMessages[event.error] || `Erro: ${event.error}`);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [lang]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setError(null);
            setTranscript('');
            try {
                recognitionRef.current.start();
            } catch (err) {
                // Caso já esteja ouvindo
                console.warn('SpeechRecognition already started:', err);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
}
