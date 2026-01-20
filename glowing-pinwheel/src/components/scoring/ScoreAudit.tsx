'use client';

import React, { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import type { ScoringResult, ScoringReason, RuleSeverity } from '@/lib/scoring/types';

// ============================================
// TYPES
// ============================================

interface ScoreAuditProps {
  /** Current scoring result */
  result: ScoringResult;
  /** Previous scoring result for animation comparison */
  previousResult?: ScoringResult | null;
  /** Show detailed breakdown */
  expanded?: boolean;
  /** Compact mode for sidebar */
  compact?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Is this demo/mock data? Shows warning banner */
  isDemo?: boolean;
}

interface ReasonItemProps {
  reason: ScoringReason;
  isNew?: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSeverityColor(severity: RuleSeverity): string {
  const colors: Record<RuleSeverity, string> = {
    low: '#6c757d',
    medium: '#fd7e14',
    high: '#dc3545',
    critical: '#7b1fa2',
  };
  return colors[severity] || colors.medium;
}

function formatAdjustment(adjustment: number): string {
  if (adjustment > 0) {
    return `+${adjustment.toFixed(1)}`;
  }
  return adjustment.toFixed(1);
}

function getScoreColor(score: number): string {
  if (score >= 8) return '#28a745';      // Green - Excellent
  if (score >= 6) return '#17a2b8';      // Teal - Good
  if (score >= 4) return '#fd7e14';      // Orange - Caution
  return '#dc3545';                      // Red - Poor
}

function generateStars(score: number): string {
  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5;
  const emptyStars = 10 - fullStars - (halfStar ? 1 : 0);

  return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// ============================================
// REASON ITEM COMPONENT
// ============================================

const ReasonItem = memo(function ReasonItem({ reason, isNew }: ReasonItemProps) {
  const isPenalty = reason.type === 'penalty';
  const icon = isPenalty ? '🔴' : '🟢';
  const adjustmentClass = isPenalty ? 'reason--penalty' : 'reason--bonus';

  return (
    <div className={`reason ${adjustmentClass} ${isNew ? 'reason--new' : ''}`}>
      <span className="reason__icon">{icon}</span>
      <span className="reason__adjustment">
        {formatAdjustment(reason.adjustment)}
      </span>
      <span className="reason__label">{reason.label}</span>
      {reason.severity === 'critical' && (
        <span className="reason__badge reason__badge--critical">
          CRÍTICO
        </span>
      )}

      <style jsx>{`
        .reason {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 12px;
          background: #fff;
          border-radius: 8px;
          border-left: 3px solid transparent;
          font-size: 13px;
          transition: all 0.3s ease;
        }
        
        .reason--penalty {
          border-left-color: #dc3545;
          background: #fff5f5;
        }
        
        .reason--bonus {
          border-left-color: #28a745;
          background: #f0fff4;
        }
        
        .reason--new {
          animation: reason-enter 0.5s ease-out;
        }
        
        @keyframes reason-enter {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .reason__icon {
          font-size: 14px;
          line-height: 1;
          flex-shrink: 0;
        }
        
        .reason__adjustment {
          font-weight: 700;
          min-width: 36px;
          flex-shrink: 0;
        }
        
        .reason--penalty .reason__adjustment {
          color: #dc3545;
        }
        
        .reason--bonus .reason__adjustment {
          color: #28a745;
        }
        
        .reason__label {
          flex: 1;
          color: #495057;
          line-height: 1.4;
        }
        
        .reason__badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        
        .reason__badge--critical {
          background: #7b1fa2;
          color: white;
        }
        
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .reason {
            background: #252538;
          }
          
          .reason--penalty {
            background: #2d1f1f;
          }
          
          .reason--bonus {
            background: #1f2d1f;
          }
          
          .reason__label {
            color: #e1e1e6;
          }
        }
      `}</style>
    </div>
  );
});

// ============================================
// ANIMATED SCORE DISPLAY
// ============================================

interface AnimatedScoreProps {
  score: number;
  previousScore?: number;
}

function AnimatedScore({ score, previousScore }: AnimatedScoreProps) {
  const [displayScore, setDisplayScore] = useState(previousScore ?? score);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (previousScore !== undefined && previousScore !== score) {
      setIsAnimating(true);
      const duration = 500; // ms
      const startTime = Date.now();
      const startScore = previousScore;
      const diff = score - previousScore;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentScore = startScore + diff * eased;

        setDisplayScore(Math.round(currentScore * 10) / 10);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayScore(score);
    }
  }, [score, previousScore]);

  const scoreColor = getScoreColor(displayScore);
  const isImproving = previousScore !== undefined && score > previousScore;
  const isWorsening = previousScore !== undefined && score < previousScore;

  return (
    <div className={`animated-score ${isAnimating ? 'animated-score--animating' : ''}`}>
      <span
        className="animated-score__value"
        style={{ color: scoreColor }}
      >
        {displayScore.toFixed(1)}
      </span>
      {isAnimating && (
        <span className={`animated-score__delta ${isImproving ? 'improving' : 'worsening'}`}>
          {isImproving ? '↑' : '↓'}
        </span>
      )}

      <style jsx>{`
        .animated-score {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        .animated-score__value {
          font-size: 48px;
          font-weight: 800;
          line-height: 1;
          transition: color 0.3s ease;
        }
        
        .animated-score--animating .animated-score__value {
          animation: score-pulse 0.3s ease-in-out;
        }
        
        @keyframes score-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animated-score__delta {
          font-size: 24px;
          font-weight: 700;
          animation: delta-float 0.5s ease-out forwards;
        }
        
        .animated-score__delta.improving {
          color: #28a745;
        }
        
        .animated-score__delta.worsening {
          color: #dc3545;
        }
        
        @keyframes delta-float {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN SCORE AUDIT COMPONENT
// ============================================

export function ScoreAudit({
  result,
  previousResult,
  expanded = true,
  compact = false,
  className = '',
  isDemo = false,
}: ScoreAuditProps) {
  const penalties = result.reasons.filter(r => r.type === 'penalty');
  const bonuses = result.reasons.filter(r => r.type === 'bonus');
  const hasAdjustments = result.reasons.length > 0;

  // Track which reasons are new (for animation)
  const previousReasonIds = new Set(previousResult?.reasons.map(r => r.rule_id) ?? []);

  return (
    <div className={`score-audit ${compact ? 'score-audit--compact' : ''} ${className}`}>
      {/* Mock Data Warning */}
      {isDemo && (
        <div className="score-audit__demo-warning">
          <span>⚠️</span>
          <span>DADOS DE SIMULAÇÃO - LABORATÓRIO</span>
        </div>
      )}

      {/* Header with Contextual Score */}
      <div className="score-audit__header">
        <div className="score-audit__score-section">
          <AnimatedScore
            score={result.finalScore}
            previousScore={previousResult?.finalScore}
          />
          <div className="score-audit__stars">
            {generateStars(result.finalScore)}
          </div>
          <div className="score-audit__context-label">
            Nota Contextual
          </div>
        </div>

        {/* Base Score Reference */}
        <div className="score-audit__base">
          <span className="score-audit__base-label">Base:</span>
          <span className="score-audit__base-value">{result.baseScore.toFixed(1)}</span>
          {result.delta !== 0 && (
            <span className={`score-audit__delta ${result.delta < 0 ? 'negative' : 'positive'}`}>
              ({formatAdjustment(result.delta)})
            </span>
          )}
        </div>

        {/* Methodology Link */}
        <Link
          href="/metodologia"
          className="score-audit__help-link"
          title="Entenda como calculamos esta nota"
        >
          <span>❓</span>
          <span>Entenda como auditamos este produto →</span>
        </Link>
      </div>

      {/* Reasons Breakdown */}
      {expanded && hasAdjustments && (
        <div className="score-audit__breakdown">
          {/* Penalties Section */}
          {penalties.length > 0 && (
            <div className="score-audit__section">
              <h4 className="score-audit__section-title score-audit__section-title--penalty">
                <span>⚠️ Penalidades ({penalties.length})</span>
              </h4>
              <div className="score-audit__reasons">
                {penalties.map((reason) => (
                  <ReasonItem
                    key={reason.rule_id}
                    reason={reason}
                    isNew={!previousReasonIds.has(reason.rule_id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bonuses Section */}
          {bonuses.length > 0 && (
            <div className="score-audit__section">
              <h4 className="score-audit__section-title score-audit__section-title--bonus">
                <span>✨ Bônus ({bonuses.length})</span>
              </h4>
              <div className="score-audit__reasons">
                {bonuses.map((reason) => (
                  <ReasonItem
                    key={reason.rule_id}
                    reason={reason}
                    isNew={!previousReasonIds.has(reason.rule_id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Adjustments Message */}
      {expanded && !hasAdjustments && (
        <div className="score-audit__empty">
          <span className="score-audit__empty-icon">✅</span>
          <span className="score-audit__empty-text">
            Nenhum ajuste para este contexto. Nota base mantida.
          </span>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .score-audit {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid #e9ecef;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        
        .score-audit--compact {
          padding: 16px;
        }
        
        .score-audit__demo-warning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          margin-bottom: 16px;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .score-audit__header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px dashed #dee2e6;
        }
        
        .score-audit__score-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .score-audit__stars {
          font-size: 16px;
          letter-spacing: 2px;
          color: #ffc107;
        }
        
        .score-audit__context-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6c757d;
        }
        
        .score-audit__base {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          font-size: 14px;
          color: #6c757d;
        }
        
        .score-audit__base-label {
          font-weight: 500;
        }
        
        .score-audit__base-value {
          font-weight: 600;
          color: #495057;
        }
        
        .score-audit__delta {
          font-weight: 700;
        }
        
        .score-audit__delta.negative {
          color: #dc3545;
        }
        
        .score-audit__delta.positive {
          color: #28a745;
        }
        
        .score-audit__help-link {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 8px 16px;
          background: #f0f0ff;
          border-radius: 20px;
          font-size: 12px;
          color: #6366f1;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .score-audit__help-link:hover {
          background: #e0e0ff;
          color: #4f46e5;
        }
        
        .score-audit__breakdown {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .score-audit__section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .score-audit__section-title {
          font-size: 13px;
          font-weight: 600;
          margin: 0;
          padding: 6px 12px;
          border-radius: 6px;
        }
        
        .score-audit__section-title--penalty {
          background: #fff5f5;
          color: #dc3545;
        }
        
        .score-audit__section-title--bonus {
          background: #f0fff4;
          color: #28a745;
        }
        
        .score-audit__reasons {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .score-audit__empty {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: #f0fff4;
          border-radius: 8px;
          color: #28a745;
        }
        
        .score-audit__empty-icon {
          font-size: 20px;
        }
        
        .score-audit__empty-text {
          font-size: 14px;
          font-weight: 500;
        }
        
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .score-audit {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-color: #2d2d44;
          }
          
          .score-audit__header {
            border-bottom-color: #3d3d56;
          }
          
          .score-audit__context-label,
          .score-audit__base {
            color: #8b8b9a;
          }
          
          .score-audit__base-value {
            color: #e1e1e6;
          }
          
          .score-audit__section-title--penalty {
            background: #2d1f1f;
          }
          
          .score-audit__section-title--bonus {
            background: #1f2d1f;
          }
          
          .score-audit__empty {
            background: #1f2d1f;
          }
        }
        
        /* Responsive */
        @media (max-width: 480px) {
          .score-audit {
            padding: 16px;
            border-radius: 12px;
          }
          
          :global(.score-audit .animated-score__value) {
            font-size: 36px;
          }
          
          .score-audit__stars {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

export default ScoreAudit;
export type { ScoreAuditProps };
