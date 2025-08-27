import React, { useState } from 'react';

// 임시 타입 정의
enum RecommendationReasonType {
  TECHNICAL_BREAKOUT = 'technical_breakout',
  FUNDAMENTAL_STRENGTH = 'fundamental_strength',
  MARKET_SENTIMENT = 'market_sentiment',
  VOLUME_SPIKE = 'volume_spike',
  NEWS_POSITIVE = 'news_positive',
  INSTITUTIONAL_INTEREST = 'institutional_interest',
  ECOSYSTEM_GROWTH = 'ecosystem_growth',
  REGULATORY_CLARITY = 'regulatory_clarity'
}

interface RecommendationReason {
  type: RecommendationReasonType;
  description: string;
  confidence: number;
  data?: string;
}

interface RecommendedCoin {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  expectedReturn: number;
  riskScore: number;
  recommendationScore: number;
  reasons: RecommendationReason[];
  analysis: string;
  targetPrice: number;
  stopLoss: number;
}

interface RecommendationCardProps {
  coin: RecommendedCoin;
  timeframe: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ coin, timeframe }) => {
  const [showDetails, setShowDetails] = useState(false);

  // 데이터 검증
  if (!coin || typeof coin !== 'object') {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '1rem',
        border: '1px solid var(--border-primary)',
        padding: '1.5rem',
        marginBottom: '1rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        유효하지 않은 코인 데이터입니다.
      </div>
    );
  }

  // 안전한 값 가져오기 함수
  const safeNumber = (value: any, defaultValue: number = 0) => {
    if (value === null || value === undefined || isNaN(value)) {
      return defaultValue;
    }
    return Number(value);
  };

  const safeString = (value: any, defaultValue: string = 'N/A') => {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return String(value);
  };

  const safeArray = (value: any, defaultValue: any[] = []) => {
    if (!Array.isArray(value)) {
      return defaultValue;
    }
    return value;
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 3) return '#10b981'; // 녹색 (안전)
    if (riskScore <= 6) return '#f59e0b'; // 노란색 (보통)
    return '#ef4444'; // 빨간색 (위험)
  };

  const getReasonTypeLabel = (type: RecommendationReasonType) => {
    const labels = {
      [RecommendationReasonType.TECHNICAL_BREAKOUT]: '기술적 돌파',
      [RecommendationReasonType.FUNDAMENTAL_STRENGTH]: '기본적 강점',
      [RecommendationReasonType.MARKET_SENTIMENT]: '시장 심리',
      [RecommendationReasonType.VOLUME_SPIKE]: '거래량 급증',
      [RecommendationReasonType.NEWS_POSITIVE]: '긍정적 뉴스',
      [RecommendationReasonType.INSTITUTIONAL_INTEREST]: '기관 관심',
      [RecommendationReasonType.ECOSYSTEM_GROWTH]: '생태계 성장',
      [RecommendationReasonType.REGULATORY_CLARITY]: '규제 명확성'
    };
    return labels[type] || type;
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '1rem',
      border: '1px solid var(--border-primary)',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      {/* 코인 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            margin: '0 0 0.25rem 0'
          }}>
            {safeString(coin.name, 'Unknown')} ({safeString(coin.symbol, 'N/A')})
          </h3>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-primary)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem'
          }}>
            {timeframe}
          </span>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '0.25rem'
          }}>
            ${safeNumber(coin.currentPrice, 0).toLocaleString()}
          </div>
          <span style={{
            color: safeNumber(coin.change24h, 0) >= 0 ? '#10b981' : '#ef4444',
            fontWeight: '600'
          }}>
            {safeNumber(coin.change24h, 0) >= 0 ? '+' : ''}{safeNumber(coin.change24h, 0)}%
          </span>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          background: 'var(--bg-primary)',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem'
          }}>
            예상 수익률
          </div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: safeNumber(coin.expectedReturn, 0) >= 0 ? '#10b981' : '#ef4444'
          }}>
            {safeNumber(coin.expectedReturn, 0) >= 0 ? '+' : ''}{safeNumber(coin.expectedReturn, 0)}%
          </div>
        </div>

        <div style={{
          background: 'var(--bg-primary)',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem'
          }}>
            위험도
          </div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: getRiskColor(safeNumber(coin.riskScore, 5))
          }}>
            {safeNumber(coin.riskScore, 5)}/10
          </div>
        </div>
      </div>

      {/* 추천 점수 */}
      <div style={{
        background: 'var(--bg-primary)',
        padding: '1rem',
        borderRadius: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            추천 점수
          </span>
          <span style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            {safeNumber(coin.recommendationScore, 0)}/100
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--border-primary)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
                           <div style={{
                   width: `${Math.min(safeNumber(coin.recommendationScore, 0), 100)}%`,
                   height: '100%',
                   background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                   borderRadius: '4px',
                   transition: 'width 0.3s ease'
                 }} />
        </div>
      </div>

      {/* 목표가/손절가 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          background: 'var(--bg-primary)',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem'
          }}>
            목표가
          </div>
                           <div style={{
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   color: '#10b981'
                 }}>
                   ${safeNumber(coin.targetPrice, 0).toLocaleString()}
                 </div>
        </div>

        <div style={{
          background: 'var(--bg-primary)',
          padding: '1rem',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem'
          }}>
            손절가
          </div>
                           <div style={{
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   color: '#ef4444'
                 }}>
                   ${safeNumber(coin.stopLoss, 0).toLocaleString()}
                 </div>
        </div>
      </div>

      {/* 상세 정보 토글 버튼 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'var(--gradient-secondary)',
          color: 'var(--text-primary)',
          border: 'none',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          marginBottom: showDetails ? '1rem' : '0'
        }}
      >
        {showDetails ? '상세 정보 숨기기' : '상세 정보 보기'}
      </button>

      {/* 상세 정보 */}
      {showDetails && (
        <div>
          {/* 추천 근거 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              추천 근거
            </h4>
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     {safeArray(coin.reasons).map((reason, index) => (
                <div key={index} style={{
                  background: 'var(--bg-primary)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                                             <span style={{
                           fontSize: '0.875rem',
                           fontWeight: '500',
                           color: '#6366f1',
                           background: 'rgba(99, 102, 241, 0.1)',
                           padding: '0.25rem 0.5rem',
                           borderRadius: '0.5rem'
                         }}>
                           {getReasonTypeLabel(safeString(reason.type, 'unknown'))}
                         </span>
                         <span style={{
                           fontSize: '0.75rem',
                           color: 'var(--text-secondary)'
                         }}>
                           신뢰도: {safeNumber(reason.confidence, 0)}%
                         </span>
                  </div>
                                       <p style={{
                       fontSize: '0.875rem',
                       color: 'var(--text-primary)',
                       margin: '0',
                       lineHeight: '1.5'
                     }}>
                       {safeString(reason.description, '설명 없음')}
                     </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI 분석 */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              AI 분석
            </h4>
            <div style={{
              background: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-primary)'
            }}>
                                   <p style={{
                       fontSize: '0.875rem',
                       color: 'var(--text-primary)',
                       margin: '0',
                       lineHeight: '1.6'
                     }}>
                       {safeString(coin.analysis, '분석 데이터가 없습니다.')}
                     </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
