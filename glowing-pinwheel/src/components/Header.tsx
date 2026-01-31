'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search, Menu, X, ChevronDown, ChevronRight,
    Tv, Refrigerator, Wind, Laptop,
    Gamepad2, Palette, Leaf, Ruler, Shield,
    Home, Grid3X3, Scale, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComparison } from '@/contexts/ComparisonContext';
import { RegionSelector } from '@/components/RegionSelector';

// ============================================
// CATEGORY DATA
// ============================================

const CATEGORIES = [
    { id: 'tv', name: 'Smart TVs', icon: Tv, slug: '/categorias/smart-tvs', count: 3 },
    { id: 'fridge', name: 'Geladeiras', icon: Refrigerator, slug: '/categorias/geladeiras', count: 5 },
    { id: 'air_conditioner', name: 'Ar Condicionado', icon: Wind, slug: '/categorias/ar-condicionados', count: 6 },
    { id: 'notebook', name: 'Notebooks', icon: Laptop, slug: '/categorias/notebooks', count: 0 },
];

// Jobs to be Done - Solutions mapping
const SOLUTIONS = [
    { id: 'gaming', name: 'Para Gamers', icon: Gamepad2, filter: 'gaming', description: 'TVs 120Hz, low input lag' },
    { id: 'design', name: 'Para Arquitetos', icon: Palette, filter: 'design', description: 'Monitores 4K, notebooks potentes' },
    { id: 'economy', name: 'Economia de Energia', icon: Leaf, filter: 'energia', description: 'Selo A++, Inverter, economizadores' },
    { id: 'small', name: 'Ambientes Pequenos', icon: Ruler, filter: 'compacto', description: '9000 BTUs, geladeiras compactas' },
    { id: 'durability', name: 'Durabilidade Extrema', icon: Shield, filter: 'durabilidade', description: 'Garantia estendida, marcas premium' },
];

// Common problems for search suggestions
const COMMON_PROBLEMS = [
    'Conta de luz muito alta',
    'Barulho do ar condicionado',
    'TV travando em apps',
    'Geladeira não gela bem',
    'Notebook esquentando muito',
];

const BUYING_GUIDES = [
    'Como escolher TV para PS5',
    'Inverter vs Convencional',
    'Geladeira Frost Free vale a pena?',
    'Melhor notebook para trabalho',
];

// ============================================
// MEGA MENU COMPONENT
// ============================================

function MegaMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
            onMouseLeave={onClose}
        >
            <div className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-2 gap-12">
                    {/* Pilar A: Categorias */}
                    <div>
                        <h3 className="font-display text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                            Navegar por Categoria
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.slug}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg',
                                        'bg-bg-ground hover:bg-brand-core/5',
                                        'border border-transparent hover:border-brand-core/20',
                                        'transition-all group'
                                    )}
                                    onClick={onClose}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-brand-core/10 flex items-center justify-center group-hover:bg-brand-core/20 transition-colors">
                                        <cat.icon size={20} className="text-brand-core" />
                                    </div>
                                    <div>
                                        <p className="font-body font-semibold text-text-primary">
                                            {cat.name}
                                        </p>
                                        {cat.count > 0 && (
                                            <p className="text-xs text-text-muted">
                                                {cat.count} produtos
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight size={16} className="ml-auto text-text-muted group-hover:text-brand-core transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Pilar B: Soluções */}
                    <div>
                        <h3 className="font-display text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                            Soluções e Usos
                        </h3>
                        <div className="space-y-2">
                            {SOLUTIONS.map((sol) => (
                                <Link
                                    key={sol.id}
                                    href={`/solucoes/${sol.id}`}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg',
                                        'hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent',
                                        'transition-all group'
                                    )}
                                    onClick={onClose}
                                >
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                                        <sol.icon size={16} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-body font-medium text-text-primary">
                                            {sol.name}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            {sol.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SEARCH BAR COMPONENT WITH PRODUCT SEARCH
// ============================================

import { ALL_PRODUCTS } from '@/data/products';
import { useRouter } from 'next/navigation';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Mic, MicOff, AlertCircle, Loader2, Brain } from 'lucide-react';
import { processVoiceInput } from '@/lib/ai/voice-navigation';
import { getActionUrl, type VoiceAction } from '@/lib/ai/voice-types';
import { useChat } from '@/contexts/ChatContext';

// Question detection patterns
const QUESTION_PATTERNS = [
    /^(qual|quais|como|porque|por que|por quê|quando|onde|quem|o que|quanto)/i,
    /\?$/,
    /melhor para/i,
    /diferença entre/i,
    /compare|comparar|comparativo/i,
    /recomend|sugest|indic/i,
    /vale a pena/i,
    /devo comprar/i,
    /preciso de/i,
    /ajuda|ajude|me ajuda/i,
    /problema|dúvida|duvida/i,
];

function isQuestion(text: string): boolean {
    return QUESTION_PATTERNS.some(pattern => pattern.test(text.trim()));
}

function SearchBar() {
    const router = useRouter();
    const { openOverlay, sendMessage } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [aiStatus, setAiStatus] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastProcessedTranscript = useRef<string>('');

    // Voice search integration
    const {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition('pt-BR');

    // Process voice input with Gemini when transcript is finalized
    useEffect(() => {
        // Debug logging
        console.log('[VoiceNav] useEffect triggered:', { transcript, isListening, lastProcessed: lastProcessedTranscript.current });

        async function processVoice() {
            // Only process if:
            // 1. We have a transcript
            // 2. Not currently listening (speech ended)
            // 3. Haven't processed this transcript already
            if (!transcript || transcript.trim().length < 2) {
                console.log('[VoiceNav] Skipping - no transcript');
                return;
            }
            if (isListening) {
                console.log('[VoiceNav] Skipping - still listening');
                return;
            }
            if (transcript === lastProcessedTranscript.current) {
                console.log('[VoiceNav] Skipping - already processed');
                return;
            }

            console.log('[VoiceNav] Processing transcript:', transcript);
            lastProcessedTranscript.current = transcript;
            setQuery(transcript);
            setIsOpen(true);
            setIsProcessing(true);
            setAiStatus('🤖 Processando com IA...');

            try {
                console.log('[VoiceNav] Calling processVoiceInput...');
                const action = await processVoiceInput(transcript);
                console.log('[VoiceNav] Action received:', action);

                const url = getActionUrl(action);
                console.log('[VoiceNav] URL to navigate:', url);

                if (url) {
                    // Build appropriate status message based on action type
                    let statusMsg = '✅ Redirecionando...';
                    if (action.type === 'NAVIGATE_PRODUCT') {
                        statusMsg = '✅ Indo para produto...';
                    } else if (action.type === 'NAVIGATE_CATEGORY') {
                        statusMsg = '✅ Abrindo categoria...';
                    } else if (action.type === 'COMPARE_PRODUCTS') {
                        statusMsg = '✅ Abrindo comparativo...';
                    } else if (action.type === 'SEARCH') {
                        statusMsg = '✅ Buscando...';
                    } else if (action.type === 'REDIRECT_TO_ASSISTANT' || action.type === 'SHOW_ASSISTANT') {
                        statusMsg = '🤖 Abrindo Assistente IA...';
                    }
                    setAiStatus(statusMsg);

                    // Small delay for user feedback then navigate
                    setTimeout(() => {
                        console.log('[VoiceNav] Navigating to:', url);
                        router.push(url);
                        setQuery('');
                        setIsOpen(false);
                        setAiStatus(null);
                        resetTranscript(); // Reset transcript for next use
                    }, 800);
                } else {
                    const msg = action.type === 'UNKNOWN' ? action.message : 'Não entendi a solicitação';
                    console.log('[VoiceNav] Unknown action:', msg);
                    setAiStatus(`⚠️ ${msg}`);
                    setTimeout(() => setAiStatus(null), 3000);
                }
            } catch (err) {
                console.error('[VoiceNav] Error calling Gemini:', err);
                setAiStatus('❌ Erro ao processar. Tente novamente.');
                setTimeout(() => setAiStatus(null), 3000);
            } finally {
                setIsProcessing(false);
            }
        }

        processVoice();
    }, [transcript, isListening, router, resetTranscript]);

    // Sync manual typing with search
    useEffect(() => {
        if (query && !isProcessing) {
            setIsOpen(true);
        }
    }, [query, isProcessing]);

    // Debug: log errors to console
    useEffect(() => {
        if (error) {
            console.warn('[VoiceSearch] Error:', error);
        }
    }, [error]);

    // Stop words to remove from voice search
    const stopWords = ['encontre', 'encontrar', 'quero', 'procuro', 'procurar', 'buscar', 'busque', 'achar', 'ache', 'mostrar', 'mostre', 'ver', 'me', 'uma', 'um', 'o', 'a', 'de', 'para'];

    // Portuguese category name to categoryId mapping
    const categoryMap: Record<string, string> = {
        'geladeira': 'fridge',
        'geladeiras': 'fridge',
        'refrigerador': 'fridge',
        'freezer': 'fridge',
        'tv': 'tv',
        'televisao': 'tv',
        'televisão': 'tv',
        'televisor': 'tv',
        'smart tv': 'tv',
        'ar condicionado': 'air_conditioner',
        'ar-condicionado': 'air_conditioner',
        'ar': 'air_conditioner',
        'split': 'air_conditioner',
    };

    // Clean and normalize search query
    const cleanSearchQuery = (rawQuery: string): string => {
        let cleaned = rawQuery.toLowerCase().trim();
        // Remove stop words
        stopWords.forEach(word => {
            cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
        });
        // Clean up multiple spaces
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        return cleaned;
    };

    // Search products by name, category, painPoints
    const searchResults = query.length >= 2
        ? ALL_PRODUCTS.filter(product => {
            const searchLower = cleanSearchQuery(query);
            if (searchLower.length < 2) return false;

            // Check for Portuguese category terms
            const searchWords = searchLower.split(' ');
            const categoryMatchPT = searchWords.some(word => {
                const mappedCategory = categoryMap[word];
                return mappedCategory && product.categoryId === mappedCategory;
            });

            const nameMatch = product.name.toLowerCase().includes(searchLower);
            const shortNameMatch = product.shortName?.toLowerCase().includes(searchLower);
            const categoryMatch = product.categoryId.toLowerCase().includes(searchLower);
            const painPointMatch = product.painPointsSolved?.some(p =>
                p.toLowerCase().includes(searchLower)
            );
            const brandMatch = product.brand?.toLowerCase().includes(searchLower);

            // Also check individual words for partial matches
            const wordMatch = searchWords.some(word =>
                word.length >= 3 && (
                    product.name.toLowerCase().includes(word) ||
                    product.shortName?.toLowerCase().includes(word) ||
                    product.brand?.toLowerCase().includes(word)
                )
            );

            return nameMatch || shortNameMatch || categoryMatch || categoryMatchPT || painPointMatch || brandMatch || wordMatch;
        }).slice(0, 5)
        : [];

    const handleProductClick = (productId: string) => {
        setQuery('');
        setIsOpen(false);
        router.push(`/produto/${productId}`);
    };

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript(); // Clear previous errors
            startListening();
        }
    };

    return (
        <div className="relative flex-1 max-w-xl">
            <div
                className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-full',
                    'bg-bg-ground border-2',
                    error ? 'border-amber-400 ring-2 ring-amber-100' :
                        isListening ? 'border-red-400 ring-2 ring-red-100' :
                            isOpen ? 'border-brand-core' : 'border-transparent',
                    'transition-all'
                )}
            >
                {/* Voice Search Button */}
                {isSupported && (
                    <button
                        onClick={handleMicClick}
                        aria-label={isListening ? 'Parar de ouvir' : 'Busca por voz'}
                        title={error || (isListening ? 'Ouvindo... clique para parar' : 'Clique para buscar por voz')}
                        className={cn(
                            'p-1.5 rounded-full transition-all flex-shrink-0',
                            error
                                ? 'bg-amber-100 text-amber-600'
                                : isListening
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        )}
                    >
                        {error ? <AlertCircle size={16} /> : <Mic size={16} />}
                    </button>
                )}

                <Search size={18} className="text-text-muted flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 300)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && query.trim().length >= 3) {
                            e.preventDefault();
                            if (isQuestion(query)) {
                                // Navigate to immersive mode and send the query
                                const encodedQuery = encodeURIComponent(query);
                                setQuery('');
                                setIsOpen(false);
                                router.push(`/chat?q=${encodedQuery}`);
                            } else if (searchResults.length > 0) {
                                // Go to first product result
                                router.push(`/produto/${searchResults[0].id}`);
                                setQuery('');
                                setIsOpen(false);
                            }
                        }
                    }}
                    placeholder={error ? error : isListening ? "🎤 Fale agora..." : "Cole um link ou descreva seu problema (ex: 'notebook que não esquenta')..."}
                    className={cn(
                        'flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted font-body min-w-[300px]',
                        isListening && 'text-red-600 placeholder:text-red-400',
                        error && 'placeholder:text-amber-600'
                    )}
                />
            </div>

            {/* Rich Dropdown with Smart Ranking */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[450px] flex flex-col overflow-hidden">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4">

                        {/* AI Status Indicator */}
                        {(isProcessing || aiStatus) && (
                            <div className={cn(
                                'flex items-center gap-3 p-3 rounded-lg mb-4',
                                isProcessing ? 'bg-purple-50 border border-purple-200' :
                                    aiStatus?.startsWith('✅') ? 'bg-green-50 border border-green-200' :
                                        aiStatus?.startsWith('⚠️') ? 'bg-amber-50 border border-amber-200' :
                                            aiStatus?.startsWith('❌') ? 'bg-red-50 border border-red-200' :
                                                'bg-gray-50 border border-gray-200'
                            )}>
                                {isProcessing && <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />}
                                <span className={cn(
                                    'text-sm font-medium',
                                    isProcessing ? 'text-purple-700' :
                                        aiStatus?.startsWith('✅') ? 'text-green-700' :
                                            aiStatus?.startsWith('⚠️') ? 'text-amber-700' :
                                                aiStatus?.startsWith('❌') ? 'text-red-700' :
                                                    'text-gray-700'
                                )}>
                                    {aiStatus || '🤖 Processando com IA...'}
                                </span>
                            </div>
                        )}

                        {/* SMART RANKING: AI Card FIRST when question detected */}
                        {query.length >= 3 && isQuestion(query) && !isProcessing && (
                            <button
                                onClick={() => {
                                    const encodedQuery = encodeURIComponent(query);
                                    setQuery('');
                                    setIsOpen(false);
                                    router.push(`/chat?q=${encodedQuery}`);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 mb-4 transition-all group shadow-lg"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Brain size={24} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-semibold text-white text-base">
                                        Analisar com Inteligência do Lab
                                    </p>
                                    <p className="text-sm text-violet-200 truncate">
                                        "{query.length > 40 ? query.substring(0, 40) + '...' : query}"
                                    </p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <ChevronRight size={24} className="text-white/80 group-hover:translate-x-1 transition-transform" />
                                    <span className="text-[10px] text-violet-200 uppercase tracking-wider">Enter</span>
                                </div>
                            </button>
                        )}

                        {/* Product Search Results */}
                        {searchResults.length > 0 && !isProcessing && (
                            <div className="mb-4">
                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                    📦 Produtos Encontrados
                                </h4>
                                <div className="space-y-1">
                                    {searchResults.map(product => (
                                        <Link
                                            key={product.id}
                                            href={`/produto/${product.id}`}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-ground transition-colors text-left"
                                            onClick={() => {
                                                setQuery('');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt=""
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                        {product.shortName?.substring(0, 2)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-text-primary truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    R$ {product.price.toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className="text-text-muted" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No results message */}
                        {query.length >= 2 && searchResults.length === 0 && !isQuestion(query) && !isProcessing && (
                            <div className="text-center py-4 text-text-muted text-sm">
                                Nenhum produto encontrado para "{query}"
                            </div>
                        )}

                        {/* Problemas Comuns (when no query) */}
                        {query.length < 2 && (
                            <>
                                <div className="mb-4">
                                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Sparkles size={12} />
                                        Problemas Comuns
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {COMMON_PROBLEMS.map((problem, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setQuery(problem);
                                                    inputRef.current?.focus();
                                                }}
                                                className="px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-full hover:bg-red-100 transition-colors"
                                            >
                                                {problem}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Guias de Compra */}
                                <div>
                                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                        📚 Guias de Compra
                                    </h4>
                                    <div className="space-y-1">
                                        {BUYING_GUIDES.map((guide, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/guias/${guide.toLowerCase().replace(/ /g, '-')}`}
                                                className="block px-3 py-2 text-sm text-text-secondary hover:bg-bg-ground rounded-lg transition-colors"
                                            >
                                                {guide}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* DISABLED: Chat temporarily hidden from site
                    {query.length >= 2 && !isQuestion(query) && !isProcessing && (
                        <div className="border-t border-gray-100 p-3 bg-gradient-to-r from-violet-50 to-purple-50">
                            <button
                                onClick={() => {
                                    const currentQuery = query;
                                    setQuery('');
                                    setIsOpen(false);
                                    openOverlay();
                                    setTimeout(() => sendMessage(currentQuery), 300);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-violet-100/50 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Brain size={16} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-violet-900">
                                        Não achou? Pergunte ao Engenheiro
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-violet-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                    */}
                </div>
            )}
        </div>
    );
}

// ============================================
// MAIN HEADER COMPONENT
// ============================================

// Import new navigation components
import { DesktopMegaMenu, MobileMenu } from '@/components/navigation';

export function Header() {
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-16 gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image
                                src="/images/logo-comparatop.svg"
                                alt="ComparaTop"
                                width={200}
                                height={50}
                                className="h-24 w-auto"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            {/* Mega Menu Trigger */}
                            <button
                                onClick={() => setMegaMenuOpen(true)}
                                onMouseEnter={() => setMegaMenuOpen(true)}
                                className={cn(
                                    'flex items-center gap-1 px-3 py-2 rounded-lg',
                                    'text-sm font-body font-medium text-text-secondary',
                                    'hover:bg-bg-ground hover:text-text-primary',
                                    'transition-colors',
                                    megaMenuOpen && 'bg-bg-ground text-text-primary'
                                )}
                            >
                                <Grid3X3 size={16} />
                                Categorias
                                <ChevronDown size={14} className={cn('transition-transform', megaMenuOpen && 'rotate-180')} />
                            </button>

                            {/* Quick Links */}
                            <Link href="/comparar" className="text-sm font-body font-medium text-text-secondary hover:text-brand-core transition-colors">
                                Comparador
                            </Link>
                            <Link href="/metodologia" className="text-sm font-body font-medium text-text-secondary hover:text-brand-core transition-colors">
                                Metodologia
                            </Link>
                            {/* DISABLED: Chat temporarily hidden from site
                            <Link
                                href="/chat"
                                className="text-sm font-body font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
                                title="Consultor Técnico AI - Modo Imersivo"
                            >
                                🧠 Engenheiro
                            </Link>
                            */}

                            {/* Region Selector for TCO calculations */}
                            <RegionSelector variant="compact" />
                        </nav>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:block">
                            <SearchBar />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-bg-ground transition-colors"
                        >
                            <Menu size={24} className="text-text-primary" />
                        </button>
                    </div>
                </div>
            </header>

            {/* New Dual-Track Mega Menu (Desktop) */}
            <DesktopMegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />

            {/* New Drill-Down Mobile Menu */}
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}

// ============================================
// MOBILE BOTTOM NAVIGATION (New Implementation)
// ============================================

import { BottomNav, MobileMenu as MobileMenuNav } from '@/components/navigation';

export function MobileBottomNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            {/* New BottomNav Component */}
            <BottomNav
                onCategoriesClick={() => setMobileMenuOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
            />

            {/* New Drill-Down Mobile Menu */}
            <MobileMenuNav
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            {/* Search Overlay (kept for now) */}
            {searchOpen && (
                <div className="fixed inset-0 z-[60] bg-white md:hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                        <button onClick={() => setSearchOpen(false)}>
                            <X size={24} className="text-text-primary" />
                        </button>
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Cole um link ou descreva seu problema..."
                                autoFocus
                                className="w-full px-4 py-3 bg-bg-ground rounded-full text-sm outline-none border-2 border-transparent focus:border-brand-core transition-colors"
                            />
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                            Problemas Comuns
                        </h4>
                        <div className="space-y-2">
                            {COMMON_PROBLEMS.map((problem, idx) => (
                                <button
                                    key={idx}
                                    className="block w-full text-left px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg"
                                >
                                    {problem}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer to prevent content from being hidden behind bottom nav */}
            <div className="h-16 md:hidden" />
        </>
    );
}

