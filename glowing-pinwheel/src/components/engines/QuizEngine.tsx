'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, ExternalLink, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuizEngineConfig } from '@/lib/tools-config';

// ============================================
// TYPES
// ============================================

interface Answers {
    [questionId: string]: string;
}

// ============================================
// PROGRESS BAR
// ============================================

interface ProgressBarProps {
    current: number;
    total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = ((current + 1) / total) * 100;

    return (
        <div className="mb-6">
            <div className="flex justify-between text-xs text-text-muted mb-2">
                <span>Pergunta {current + 1} de {total}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// ============================================
// QUESTION CARD
// ============================================

interface QuestionCardProps {
    question: QuizEngineConfig['questions'][0];
    selectedAnswer: string | null;
    onSelect: (optionId: string) => void;
}

function QuestionCard({ question, selectedAnswer, onSelect }: QuestionCardProps) {
    return (
        <div className="space-y-4">
            {/* Question */}
            <h3 className="font-display text-xl font-bold text-text-primary text-center">
                {question.text}
            </h3>

            {question.subtitle && (
                <p className="text-sm text-text-muted text-center">{question.subtitle}</p>
            )}

            {/* Options */}
            <div className="grid gap-3 mt-6">
                {question.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={cn(
                            'p-4 rounded-xl border-2 text-left transition-all',
                            'hover:border-accent-primary/50 hover:bg-accent-primary/5',
                            selectedAnswer === option.id
                                ? 'border-accent-primary bg-accent-primary/10 ring-2 ring-accent-primary/30'
                                : 'border-gray-200 bg-white'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {option.emoji && (
                                <span className="text-2xl">{option.emoji}</span>
                            )}
                            <div>
                                <div className="font-semibold text-text-primary">{option.text}</div>
                                {option.description && (
                                    <div className="text-xs text-text-muted mt-0.5">{option.description}</div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ============================================
// RESULT CARD
// ============================================

interface ResultCardProps {
    profile: QuizEngineConfig['profiles'][0];
    score: number;
    maxScore: number;
    isWinner: boolean;
}

function ResultCard({ profile, score, maxScore, isWinner }: ResultCardProps) {
    const percentage = Math.round((score / maxScore) * 100);

    return (
        <div
            className={cn(
                'p-4 rounded-xl border-2 transition-all',
                isWinner
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50'
                    : 'border-gray-200 bg-gray-50'
            )}
        >
            <div className="flex items-center gap-3">
                {isWinner && (
                    <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                        <Trophy size={20} className="text-white" />
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{profile.emoji}</span>
                        <h4 className={cn(
                            'font-semibold',
                            isWinner ? 'text-amber-800' : 'text-text-primary'
                        )}>
                            {profile.name}
                        </h4>
                        {isWinner && (
                            <span className="text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full">
                                Seu Perfil!
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    'h-full transition-all duration-500',
                                    isWinner ? 'bg-amber-400' : 'bg-gray-400'
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="text-xs text-text-muted">{percentage}%</span>
                    </div>
                </div>
            </div>
            {isWinner && profile.description && (
                <p className="text-sm text-amber-700 mt-3 pl-13">
                    {profile.description}
                </p>
            )}
        </div>
    );
}

// ============================================
// PRODUCT RECOMMENDATION
// ============================================

interface ProductRecommendationProps {
    profile: QuizEngineConfig['profiles'][0];
}

function ProductRecommendation({ profile }: ProductRecommendationProps) {
    if (!profile.recommendedProducts || profile.recommendedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 space-y-4">
            <h4 className="font-display font-semibold text-text-primary flex items-center gap-2">
                <Star size={18} className="text-amber-500" />
                Produtos Recomendados para Você
            </h4>

            <div className="grid gap-3">
                {profile.recommendedProducts.map((product, index) => (
                    <a
                        key={index}
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-4"
                    >
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                            />
                        )}
                        <div className="flex-1">
                            <div className="font-semibold text-text-primary">{product.name}</div>
                            {product.reason && (
                                <div className="text-xs text-emerald-600 mt-0.5">✓ {product.reason}</div>
                            )}
                            {product.price && (
                                <div className="text-sm font-bold text-emerald-700 mt-1">
                                    R$ {product.price.toLocaleString('pt-BR')}
                                </div>
                            )}
                        </div>
                        <ExternalLink size={18} className="text-gray-400" />
                    </a>
                ))}
            </div>
        </div>
    );
}

// ============================================
// MAIN QUIZ ENGINE COMPONENT
// ============================================

interface QuizEngineProps {
    config: QuizEngineConfig;
    className?: string;
}

export function QuizEngine({ config, className }: QuizEngineProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [showResults, setShowResults] = useState(false);

    // Calculate scores
    const scores = useMemo(() => {
        const profileScores: Record<string, number> = {};

        // Initialize all profiles with 0
        config.profiles.forEach((profile) => {
            profileScores[profile.id] = 0;
        });

        // Add points from answers
        Object.entries(answers).forEach(([questionId, optionId]) => {
            const question = config.questions.find((q) => q.id === questionId);
            if (!question) return;

            const option = question.options.find((o) => o.id === optionId);
            if (!option || !option.points) return;

            Object.entries(option.points).forEach(([profileId, points]) => {
                profileScores[profileId] = (profileScores[profileId] || 0) + points;
            });
        });

        return profileScores;
    }, [answers, config.profiles, config.questions]);

    // Get winning profile
    const { winnerProfile, maxScore, totalPossibleScore } = useMemo(() => {
        type ProfileType = QuizEngineConfig['profiles'][number];
        let maxProfileScore = 0;
        let winner: ProfileType | null = null;

        config.profiles.forEach((profile) => {
            const score = scores[profile.id] || 0;
            if (score > maxProfileScore) {
                maxProfileScore = score;
                winner = profile;
            }
        });

        // Calculate max possible score
        let total = 0;
        config.questions.forEach((question) => {
            const maxOptionScore = Math.max(
                ...question.options.map((o) => {
                    if (!o.points) return 0;
                    return Math.max(...Object.values(o.points));
                })
            );
            total += maxOptionScore;
        });

        return {
            winnerProfile: winner as ProfileType | null,
            maxScore: maxProfileScore,
            totalPossibleScore: total,
        };
    }, [scores, config.profiles, config.questions]);

    const handleSelectAnswer = (optionId: string) => {
        const question = config.questions[currentQuestion];
        setAnswers((prev) => ({
            ...prev,
            [question.id]: optionId,
        }));
    };

    const handleNext = () => {
        if (currentQuestion < config.questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
    };

    const currentQ = config.questions[currentQuestion];
    const hasAnswer = answers[currentQ?.id];

    return (
        <div className={cn('bg-white rounded-2xl p-6 shadow-xl border border-gray-100', className)}>
            {/* Title */}
            <h2 className="font-display text-xl font-bold text-text-primary mb-2 text-center">
                {config.title}
            </h2>
            {config.description && !showResults && (
                <p className="text-sm text-text-secondary text-center mb-6">{config.description}</p>
            )}

            {!showResults ? (
                <>
                    {/* Progress */}
                    <ProgressBar current={currentQuestion} total={config.questions.length} />

                    {/* Question */}
                    <QuestionCard
                        question={currentQ}
                        selectedAnswer={answers[currentQ.id] || null}
                        onSelect={handleSelectAnswer}
                    />

                    {/* Navigation */}
                    <div className="flex gap-3 mt-6">
                        {currentQuestion > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="px-4 py-3 rounded-xl border border-gray-200 text-text-primary font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                                Voltar
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!hasAnswer}
                            className={cn(
                                'flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all',
                                hasAnswer
                                    ? 'bg-accent-primary text-white hover:bg-accent-primary/90'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            )}
                        >
                            {currentQuestion === config.questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </>
            ) : (
                /* Results */
                <div className="space-y-4">
                    <div className="text-center py-4">
                        <div className="text-4xl mb-2">🎉</div>
                        <h3 className="font-display text-2xl font-bold text-text-primary">
                            Seu Resultado
                        </h3>
                    </div>

                    {/* Profile Results */}
                    <div className="space-y-3">
                        {config.profiles
                            .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
                            .map((profile) => (
                                <ResultCard
                                    key={profile.id}
                                    profile={profile}
                                    score={scores[profile.id] || 0}
                                    maxScore={totalPossibleScore}
                                    isWinner={profile.id === winnerProfile?.id}
                                />
                            ))}
                    </div>

                    {/* Product Recommendations */}
                    {winnerProfile && <ProductRecommendation profile={winnerProfile} />}

                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="w-full mt-4 py-3 rounded-xl border border-gray-200 text-text-primary font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <RotateCcw size={18} />
                        Refazer Quiz
                    </button>
                </div>
            )}
        </div>
    );
}
