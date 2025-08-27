import React, { useState } from 'react';

/**
 * AI 추천 페이지 컴포넌트
 * 
 * 기능:
 * - AI 기반 투자 추천 표시
 * - 추천 코인 목록 관리
 * - 추천 이유 및 분석 정보 제공
 * 
 * 현재 상태:
 * - 기본 구조만 구현됨
 * - 실제 AI 추천 기능은 백엔드 API 연동 필요
 */
const AIRecommendations: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'short' | 'medium' | 'long'>('medium');

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem 1rem',
      minHeight: 'calc(100vh - 80px)'
    }}>
      {/* 페이지 헤더 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          background: 'var(--gradient-text)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🤖 AI 투자 추천
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          인공지능이 분석한 최적의 투자 기회를 확인하세요
        </p>
      </div>

      {/* 타임프레임 선택 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        {[
          { value: 'short', label: '단기 (1-7일)', icon: '⚡' },
          { value: 'medium', label: '중기 (1-4주)', icon: '📈' },
          { value: 'long', label: '장기 (1-6개월)', icon: '🌱' }
        ].map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => setSelectedTimeframe(timeframe.value as any)}
            style={{
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: selectedTimeframe === timeframe.value 
                ? '2px solid var(--accent-primary)' 
                : '2px solid var(--border-primary)',
              background: selectedTimeframe === timeframe.value 
                ? 'var(--accent-primary)' 
                : 'var(--bg-card)',
              color: selectedTimeframe === timeframe.value 
                ? 'white' 
                : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{timeframe.icon}</span>
              <span>{timeframe.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 추천 목록 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {/* 추천 카드 예시 */}
        {[
          {
            symbol: 'BTCUSDT',
            name: 'Bitcoin',
            currentPrice: '$45,000',
            targetPrice: '$52,000',
            confidence: 85,
            reasons: ['강력한 기술적 지지선', '기관 투자 증가', '반감기 효과'],
            riskLevel: 'medium'
          },
          {
            symbol: 'ETHUSDT',
            name: 'Ethereum',
            currentPrice: '$2,800',
            targetPrice: '$3,200',
            confidence: 78,
            reasons: ['DeFi 생태계 성장', 'ETH 2.0 업그레이드', 'NFT 시장 확대'],
            riskLevel: 'low'
          },
          {
            symbol: 'SOLUSDT',
            name: 'Solana',
            currentPrice: '$95',
            targetPrice: '$120',
            confidence: 72,
            reasons: ['높은 TPS', '개발자 활동 증가', 'DeFi 프로젝트 확산'],
            riskLevel: 'high'
          }
        ].map((coin, index) => (
          <div
            key={coin.symbol}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-lg)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* 코인 헤더 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  {coin.name} ({coin.symbol})
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    현재: {coin.currentPrice}
                  </span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                    목표: {coin.targetPrice}
                  </span>
                </div>
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                background: coin.riskLevel === 'low' 
                  ? 'var(--success-bg)' 
                  : coin.riskLevel === 'medium' 
                    ? 'var(--warning-bg)' 
                    : 'var(--error-bg)',
                color: coin.riskLevel === 'low' 
                  ? 'var(--success-text)' 
                  : coin.riskLevel === 'medium' 
                    ? 'var(--warning-text)' 
                    : 'var(--error-text)',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {coin.riskLevel === 'low' ? '낮은 위험' : 
                 coin.riskLevel === 'medium' ? '보통 위험' : '높은 위험'}
              </div>
            </div>

            {/* 신뢰도 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>AI 신뢰도</span>
                <span style={{ fontWeight: '600' }}>{coin.confidence}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--bg-secondary)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${coin.confidence}%`,
                  height: '100%',
                  background: 'var(--gradient-secondary)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* 추천 이유 */}
            <div>
              <h4 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                추천 이유
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0
              }}>
                {coin.reasons.map((reason, reasonIndex) => (
                  <li key={reasonIndex} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ 
                      color: 'var(--accent-primary)',
                      fontSize: '0.875rem'
                    }}>
                      ✓
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 개발 중 안내 */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        padding: '2rem',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-primary)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          개발 중인 기능입니다
        </h3>
        <p style={{ 
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          AI 추천 시스템이 현재 개발 중입니다. 
          곧 실제 AI 분석 기반의 투자 추천을 제공할 예정입니다.
        </p>
      </div>
    </div>
  );
};

export default AIRecommendations;

