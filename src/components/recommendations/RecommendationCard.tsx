import React from 'react';

interface RecommendationData {
  symbol: string;
  confidence: number;
  recommendation: string;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  timeHorizon: string;
}

interface RecommendationCardProps {
  data: RecommendationData;
  onClick?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ data, onClick }) => {
  const { symbol, confidence, recommendation, reasoning, riskLevel, expectedReturn, timeHorizon } = data;

  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'low':
        return '#10b981'; // 녹색 (안전)
      case 'medium':
        return '#f59e0b'; // 노란색 (보통)
      case 'high':
        return '#ef4444'; // 빨간색 (위험)
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      transition: 'all 0.3s ease',
      cursor: onClick ? 'pointer' : 'default'
    }} onClick={onClick}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            margin: '0 0 0.25rem 0'
          }}>
            {symbol}
          </h3>
          <span style={{
            background: 'rgba(139, 92, 246, 0.2)',
            color: 'var(--text-accent)',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {timeHorizon}
          </span>
        </div>
        
        {/* 신뢰도 */}
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--text-accent)'
          }}>
            {confidence}%
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)'
          }}>
            신뢰도
          </div>
        </div>
      </div>

      {/* 추천 정보 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: '1rem'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: expectedReturn >= 0 ? '#10b981' : '#ef4444'
          }}>
            {expectedReturn >= 0 ? '+' : ''}{expectedReturn}%
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)'
          }}>
            예상 수익률
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: '1rem'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: getRiskColor(riskLevel)
          }}>
            {riskLevel.toUpperCase()}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)'
          }}>
            위험도
          </div>
        </div>
      </div>

      {/* 추천 내용 */}
      <div style={{
        marginBottom: '1.5rem'
      }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          AI 추천
        </h4>
        <p style={{
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          margin: 0
        }}>
          {recommendation}
        </p>
      </div>

      {/* 추천 근거 */}
      <div>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          추천 근거
        </h4>
        <p style={{
          color: 'var(--text-tertiary)',
          lineHeight: '1.6',
          margin: 0,
          fontSize: '0.875rem'
        }}>
          {reasoning}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;
