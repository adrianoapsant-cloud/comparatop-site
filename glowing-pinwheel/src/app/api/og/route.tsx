/**
 * @file route.tsx
 * @description API Route para geração de imagens Open Graph dinâmicas
 * 
 * Motor de Viralidade: Gera imagens de compartilhamento personalizadas para cada página
 * - Produtos: Mostra nome, preço, score com badge circular
 * - Comparações (VS): Layout split-screen com "Produto A vs Produto B"
 * 
 * @example Produto: /api/og?title=Samsung+QN90C&score=8.5&price=5999&badge=Melhor+Escolha
 * @example Comparação: /api/og?type=comparison&titleA=LG+C3&titleB=Samsung+QN90C&scoreA=8.7&scoreB=8.5
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

export const runtime = 'edge';

const BRAND_COLORS = {
    // ComparaTop brand palette (Indigo/Violet theme)
    primary: '#6366f1',      // Indigo-500
    primaryDark: '#4f46e5',  // Indigo-600
    accent: '#8b5cf6',       // Violet-500
    success: '#10b981',      // Emerald-500 (high scores)
    warning: '#f59e0b',      // Amber-500 (medium scores)
    danger: '#ef4444',       // Red-500 (low scores)
    dark: '#1e1b4b',         // Indigo-950
    darkAlt: '#312e81',      // Indigo-900
    text: '#ffffff',
    textMuted: '#a5b4fc',    // Indigo-300
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getScoreColor(score: number): string {
    if (score >= 8.5) return BRAND_COLORS.success;
    if (score >= 7.0) return BRAND_COLORS.primary;
    if (score >= 5.5) return BRAND_COLORS.warning;
    return BRAND_COLORS.danger;
}

// ============================================================================
// COMPONENTES DE IMAGEM - PRODUTO
// ============================================================================

interface ProductOGProps {
    title: string;
    subtitle?: string;
    price?: number;
    score?: number;
    category?: string;
    badge?: string;
}

function ProductOGImage({ title, subtitle, price, score, category, badge }: ProductOGProps) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px 60px',
                background: `linear-gradient(135deg, ${BRAND_COLORS.dark} 0%, ${BRAND_COLORS.darkAlt} 50%, ${BRAND_COLORS.primaryDark} 100%)`,
            }}
        >
            {/* Header - Logo + Category */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 800,
                        }}
                    >
                        C
                    </div>
                    <span style={{ color: 'white', fontSize: '24px', fontWeight: 600 }}>
                        ComparaTop
                    </span>
                </div>

                {/* Category badge */}
                {category && (
                    <div
                        style={{
                            padding: '8px 20px',
                            borderRadius: '9999px',
                            background: 'rgba(99, 102, 241, 0.25)',
                            color: BRAND_COLORS.textMuted,
                            fontSize: '18px',
                            fontWeight: 600,
                        }}
                    >
                        {category}
                    </div>
                )}
            </div>

            {/* Main Content - Title, Score, Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, padding: '40px 0' }}>
                {/* Left side - Title and Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                    {/* Badge (Melhor Escolha, etc.) */}
                    {badge && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                background: 'rgba(245, 158, 11, 0.25)',
                                color: '#fcd34d',
                                fontSize: '16px',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                            }}
                        >
                            ⭐ {badge}
                        </div>
                    )}

                    {/* Title */}
                    <h1
                        style={{
                            color: BRAND_COLORS.text,
                            fontSize: title.length > 25 ? '52px' : '64px',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            margin: 0,
                            maxWidth: '750px',
                        }}
                    >
                        {title}
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p
                            style={{
                                color: BRAND_COLORS.textMuted,
                                fontSize: '28px',
                                margin: 0,
                            }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Right side - Score Badge (circular) */}
                {score && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '160px',
                            height: '160px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getScoreColor(score)}, ${getScoreColor(score)}cc)`,
                            boxShadow: `0 12px 40px ${getScoreColor(score)}66`,
                        }}
                    >
                        <span style={{ fontSize: '56px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                            {score.toFixed(1)}
                        </span>
                        <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                            /10
                        </span>
                    </div>
                )}
            </div>

            {/* Footer - Price + Tagline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                {/* Price */}
                {price ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: BRAND_COLORS.textMuted, fontSize: '18px' }}>
                            a partir de
                        </span>
                        <span style={{ color: 'white', fontSize: '40px', fontWeight: 700 }}>
                            R$ {price.toLocaleString('pt-BR')}
                        </span>
                    </div>
                ) : (
                    <span style={{ color: BRAND_COLORS.textMuted, fontSize: '18px' }}>
                        🔬 Análise Técnica Independente
                    </span>
                )}

                {/* Tagline */}
                <span style={{ color: BRAND_COLORS.textMuted, fontSize: '16px' }}>
                    comparatop.com.br
                </span>
            </div>
        </div>
    );
}

// ============================================================================
// COMPONENTES DE IMAGEM - COMPARAÇÃO (VS)
// ============================================================================

interface ComparisonOGProps {
    titleA: string;
    titleB: string;
    scoreA?: number;
    scoreB?: number;
}

function ComparisonOGImage({ titleA, titleB, scoreA, scoreB }: ComparisonOGProps) {
    const winnerA = scoreA && scoreB && scoreA > scoreB;
    const winnerB = scoreA && scoreB && scoreB > scoreA;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                position: 'relative',
            }}
        >
            {/* Left Side - Product A */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${BRAND_COLORS.dark} 0%, ${BRAND_COLORS.darkAlt} 100%)`,
                    padding: '40px',
                    borderRight: '3px solid rgba(255,255,255,0.1)',
                }}
            >
                {winnerA && (
                    <div
                        style={{
                            display: 'flex',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'rgba(245, 158, 11, 0.3)',
                            color: '#fcd34d',
                            fontSize: '14px',
                            fontWeight: 700,
                            marginBottom: '16px',
                        }}
                    >
                        ⭐ VENCEDOR
                    </div>
                )}

                <h2
                    style={{
                        fontSize: titleA.length > 18 ? '28px' : '36px',
                        fontWeight: 700,
                        color: 'white',
                        textAlign: 'center',
                        margin: '0 0 24px 0',
                        lineHeight: 1.2,
                    }}
                >
                    {titleA}
                </h2>

                {scoreA && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getScoreColor(scoreA)}, ${getScoreColor(scoreA)}cc)`,
                            boxShadow: `0 8px 24px ${getScoreColor(scoreA)}55`,
                        }}
                    >
                        <span style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                            {scoreA.toFixed(1)}
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>/10</span>
                    </div>
                )}
            </div>

            {/* VS Badge - Center */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${BRAND_COLORS.accent}, ${BRAND_COLORS.primary})`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    zIndex: 10,
                }}
            >
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>VS</span>
            </div>

            {/* Right Side - Product B */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${BRAND_COLORS.darkAlt} 0%, ${BRAND_COLORS.primaryDark} 100%)`,
                    padding: '40px',
                }}
            >
                {winnerB && (
                    <div
                        style={{
                            display: 'flex',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'rgba(245, 158, 11, 0.3)',
                            color: '#fcd34d',
                            fontSize: '14px',
                            fontWeight: 700,
                            marginBottom: '16px',
                        }}
                    >
                        ⭐ VENCEDOR
                    </div>
                )}

                <h2
                    style={{
                        fontSize: titleB.length > 18 ? '28px' : '36px',
                        fontWeight: 700,
                        color: 'white',
                        textAlign: 'center',
                        margin: '0 0 24px 0',
                        lineHeight: 1.2,
                    }}
                >
                    {titleB}
                </h2>

                {scoreB && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getScoreColor(scoreB)}, ${getScoreColor(scoreB)}cc)`,
                            boxShadow: `0 8px 24px ${getScoreColor(scoreB)}55`,
                        }}
                    >
                        <span style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                            {scoreB.toFixed(1)}
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>/10</span>
                    </div>
                )}
            </div>

            {/* Top Brand Bar */}
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>C</span>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>ComparaTop</span>
            </div>

            {/* Bottom Tagline */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <span style={{ fontSize: '14px', color: BRAND_COLORS.textMuted }}>
                    Comparativo Técnico Completo • comparatop.com.br
                </span>
            </div>
        </div>
    );
}

// ============================================================================
// COMPONENTES DE IMAGEM - DEFAULT
// ============================================================================

function DefaultOGImage({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                background: `linear-gradient(135deg, ${BRAND_COLORS.dark} 0%, ${BRAND_COLORS.darkAlt} 50%, ${BRAND_COLORS.primaryDark} 100%)`,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '40px',
                    fontWeight: 800,
                    marginBottom: '32px',
                }}
            >
                C
            </div>

            <h1
                style={{
                    color: BRAND_COLORS.text,
                    fontSize: '56px',
                    fontWeight: 800,
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: '16px',
                }}
            >
                {title || 'ComparaTop'}
            </h1>

            <p
                style={{
                    color: BRAND_COLORS.textMuted,
                    fontSize: '24px',
                    textAlign: 'center',
                    margin: 0,
                }}
            >
                {subtitle || 'Compare produtos e encontre o melhor para você'}
            </p>
        </div>
    );
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function GET(request: NextRequest): Promise<ImageResponse> {
    const { searchParams } = new URL(request.url);

    // Common params
    const type = searchParams.get('type') || 'product';

    // Product params
    const title = searchParams.get('title') || 'ComparaTop';
    const subtitle = searchParams.get('subtitle') || undefined;
    const price = searchParams.get('price') ? parseInt(searchParams.get('price')!) : undefined;
    const score = searchParams.get('score') ? parseFloat(searchParams.get('score')!) : undefined;
    const category = searchParams.get('category') || undefined;
    const badge = searchParams.get('badge') || undefined;

    // Comparison params
    const titleA = searchParams.get('titleA') || 'Produto A';
    const titleB = searchParams.get('titleB') || 'Produto B';
    const scoreA = searchParams.get('scoreA') ? parseFloat(searchParams.get('scoreA')!) : undefined;
    const scoreB = searchParams.get('scoreB') ? parseFloat(searchParams.get('scoreB')!) : undefined;

    try {
        // Select component based on type
        let imageContent;

        if (type === 'comparison') {
            imageContent = <ComparisonOGImage titleA={titleA} titleB={titleB} scoreA={scoreA} scoreB={scoreB} />;
        } else if (type === 'product' || score || price) {
            imageContent = <ProductOGImage title={title} subtitle={subtitle} price={price} score={score} category={category} badge={badge} />;
        } else {
            imageContent = <DefaultOGImage title={title} subtitle={subtitle} />;
        }

        return new ImageResponse(imageContent, {
            width: 1200,
            height: 630,
        });
    } catch (error) {
        console.error('OG Image generation error:', error);

        // Fallback simple image
        return new ImageResponse(
            <DefaultOGImage title="ComparaTop" subtitle="Comparativos Premium de Tecnologia" />,
            { width: 1200, height: 630 }
        );
    }
}
