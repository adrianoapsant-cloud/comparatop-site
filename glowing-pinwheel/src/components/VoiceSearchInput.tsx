'use client';

import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Mic, MicOff, X, Search, Loader2 } from 'lucide-react';

interface VoiceSearchInputProps {
    /** Callback quando o usuário finaliza a busca por voz */
    onSearch?: (query: string) => void;
    /** Placeholder do input de busca */
    placeholder?: string;
    /** Classes CSS adicionais para o container */
    className?: string;
    /** Valor inicial do input */
    initialValue?: string;
}

/**
 * Componente de busca por voz usando Web Speech API
 * @description Interface Voice-First para captura de intenção do usuário via microfone
 */
export function VoiceSearchInput({
    onSearch,
    placeholder = 'O que você está procurando?',
    className = '',
    initialValue = '',
}: VoiceSearchInputProps) {
    const {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition('pt-BR');

    const [inputValue, setInputValue] = useState(initialValue);
    const [hasListened, setHasListened] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sincronizar transcript com input
    useEffect(() => {
        if (transcript) {
            setInputValue(transcript);
            setHasListened(true);
        }
    }, [transcript]);

    // Focar no input quando parar de ouvir (para permitir correção)
    useEffect(() => {
        if (!isListening && hasListened && inputRef.current) {
            inputRef.current.focus();
            // Posicionar cursor no final
            inputRef.current.selectionStart = inputRef.current.value.length;
        }
    }, [isListening, hasListened]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        if (inputValue.trim() && onSearch) {
            onSearch(inputValue.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClear = () => {
        setInputValue('');
        resetTranscript();
        setHasListened(false);
        inputRef.current?.focus();
    };

    // Se o navegador não suporta Web Speech API, não renderizar
    if (!isSupported) {
        return null;
    }

    return (
        <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
            {/* Container principal */}
            <div
                className={`
                    relative flex items-center gap-2 p-2 
                    bg-white rounded-2xl shadow-lg border-2 
                    transition-all duration-300 ease-out
                    ${isListening
                        ? 'border-red-400 shadow-red-100 ring-4 ring-red-100'
                        : 'border-gray-200 hover:border-purple-300 focus-within:border-purple-400 focus-within:shadow-purple-100'
                    }
                `}
            >
                {/* Botão do Microfone */}
                <button
                    onClick={handleMicClick}
                    disabled={!!error}
                    aria-label={isListening ? 'Parar de ouvir' : 'Iniciar busca por voz'}
                    className={`
                        relative flex items-center justify-center
                        w-12 h-12 rounded-xl
                        transition-all duration-300 ease-out
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isListening
                            ? 'bg-red-500 text-white focus:ring-red-400 animate-pulse'
                            : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 focus:ring-purple-400'
                        }
                        ${error ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                >
                    {isListening ? (
                        <>
                            <Mic className="w-6 h-6" />
                            {/* Ondas de áudio animadas */}
                            <span className="absolute inset-0 rounded-xl border-2 border-red-400 animate-ping opacity-50" />
                        </>
                    ) : (
                        <Mic className="w-6 h-6" />
                    )}
                </button>

                {/* Input de busca editável */}
                <div className="flex-1 flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? 'Ouvindo...' : placeholder}
                        disabled={isListening}
                        className={`
                            flex-1 py-2 px-3 text-lg
                            bg-transparent border-none outline-none
                            placeholder-gray-400 text-gray-800
                            ${isListening ? 'animate-pulse text-red-600' : ''}
                        `}
                        aria-label="Campo de busca por voz"
                    />

                    {/* Botão Limpar */}
                    {inputValue && !isListening && (
                        <button
                            onClick={handleClear}
                            aria-label="Limpar busca"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    {/* Botão Buscar */}
                    {inputValue && !isListening && (
                        <button
                            onClick={handleSearch}
                            aria-label="Buscar"
                            className="
                                flex items-center justify-center
                                w-10 h-10 rounded-xl
                                bg-gradient-to-r from-emerald-500 to-teal-600
                                text-white
                                hover:from-emerald-600 hover:to-teal-700
                                transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
                            "
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    )}

                    {/* Indicador de carregamento durante escuta */}
                    {isListening && (
                        <div className="flex items-center gap-2 text-red-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-medium">Ouvindo...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback de status/erro */}
            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <MicOff className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Dica de uso */}
            {!isListening && !inputValue && !error && (
                <p className="mt-3 text-center text-sm text-gray-500">
                    Clique no microfone e diga o que procura, ex:
                    <span className="font-medium text-purple-600"> &quot;TV 65 polegadas para jogos&quot;</span>
                </p>
            )}

            {/* Dica de correção pós-escuta */}
            {!isListening && hasListened && inputValue && (
                <p className="mt-3 text-center text-sm text-gray-500">
                    ✏️ Você pode editar o texto acima antes de buscar
                </p>
            )}
        </div>
    );
}
