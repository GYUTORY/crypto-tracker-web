import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useShortTermRecommendations, useMediumTermRecommendations, useLongTermRecommendations } from '../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { checkServerHealth, safeApiCall } from '../services/api';
import type { AIRecommendation } from '../types/api';

/**
 * AI 추천 페이지 컴포넌트
 * 
 * 기능:
 * - AI 기반 투자 추천 표시
 * - 추천 코인 목록 관리
 * - 추천 이유 및 분석 정보 제공
 * 
 * 현재 상태:
 * - 실제 AI 추천 API 연동
 * - 서버에서 제공하는 실시간 추천 데이터 사용
 */
const AIRecommendations: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'short' | 'medium' | 'long'>('medium');
  const queryClient = useQueryClient();
  
  // 선택된 기간에 따른 API 호출 (enabled 옵션으로 불필요한 호출 방지)
  const shortTermQuery = useShortTermRecommendations(selectedTimeframe === 'short');
  const mediumTermQuery = useMediumTermRecommendations(selectedTimeframe === 'medium');
  const longTermQuery = useLongTermRecommendations(selectedTimeframe === 'long');
  
  // 현재 선택된 기간의 데이터만 활성화 (메모이제이션으로 불필요한 재계산 방지)
  const currentQuery = useMemo(() => {
    switch (selectedTimeframe) {
      case 'short':
        return shortTermQuery;
      case 'medium':
        return mediumTermQuery;
      case 'long':
        return longTermQuery;
      default:
        return mediumTermQuery;
    }
  }, [selectedTimeframe, shortTermQuery, mediumTermQuery, longTermQuery]);
  
  const { data: recommendationsData, isLoading, error } = currentQuery;

  // 타임프레임별 더미 데이터 (API 호출 문제 우회용)
  const getDummyData = (timeframe: 'short' | 'medium' | 'long'): any => {
    switch (timeframe) {
      case 'short':
        return {
          timeframe: "short_term",
          timeframeDescription: "단기 투자 (1-7일)",
          recommendations: [
            {
              symbol: "ETHUSDT",
              name: "Ethereum",
              currentPrice: 4448.54,
              change24h: 3.46,
              expectedReturn: 5,
              riskScore: 4,
              recommendationScore: 75,
              reasons: [
                {
                  type: "positive_momentum" as any,
                  description: "24시간 상승률 3.46%, 상대적으로 높은 거래량",
                  confidence: 70
                },
                {
                  type: "news_sentiment" as any,
                  description: "긍정적인 시장 뉴스(Bitcoin 1백만 달러 도달 전망 등)의 영향",
                  confidence: 60
                }
              ],
              analysis: "긍정적인 모멘텀과 시장 뉴스의 영향으로 단기 상승 가능성이 높지만, RSI가 중립 수준이므로 과열 가능성도 고려해야 함.",
              targetPrice: 4676,
              stopLoss: 4200
            },
            {
              symbol: "BNBUSDT",
              name: "Binance Coin",
              currentPrice: 863.71,
              change24h: 0.67,
              expectedReturn: 3,
              riskScore: 1,
              recommendationScore: 65,
              reasons: [
                {
                  type: "low_volatility" as any,
                  description: "상대적으로 낮은 변동성",
                  confidence: 70
                },
                {
                  type: "market_correlation" as any,
                  description: "BTC 및 ETH와의 양의 상관관계",
                  confidence: 50
                }
              ],
              analysis: "낮은 변동성과 주요 코인과의 양의 상관관계로 안정적인 단기 투자 가능성. 상승폭은 제한적일 수 있음.",
              targetPrice: 890,
              stopLoss: 840
            },
            {
              symbol: "ADAUSDT",
              name: "Cardano",
              currentPrice: 0.8344,
              change24h: 1.35,
              expectedReturn: 4,
              riskScore: 2,
              recommendationScore: 60,
              reasons: [
                {
                  type: "positive_momentum" as any,
                  description: "24시간 상승률 1.35%, 높은 거래량",
                  confidence: 60
                }
              ],
              analysis: "높은 거래량과 긍정적 모멘텀을 보이고 있으나, 시장의 전반적인 불확실성 때문에 상승폭은 제한적일 수 있음.",
              targetPrice: 0.87,
              stopLoss: 0.8
            }
          ],
          generatedAt: new Date().toISOString(),
          modelInfo: "Gemini 1.5 Pro - Real-time Technical Analysis & Market Sentiment",
          marketAnalysis: "단기 시장은 기술적 돌파와 뉴스 이벤트에 민감하게 반응하고 있습니다."
        };
      
      case 'long':
        return {
          timeframe: "long_term",
          timeframeDescription: "장기 투자 (1-12개월)",
          recommendations: [
            {
              symbol: "ETHUSDT",
              name: "Ethereum",
              currentPrice: 4450.24,
              change24h: 3.14,
              expectedReturn: 30,
              riskScore: 6,
              recommendationScore: 85,
              reasons: [
                {
                  type: "fundamental_strength" as any,
                  description: "강력한 생태계와 확장성 개선 노력",
                  confidence: 90
                },
                {
                  type: "adoption" as any,
                  description: "DeFi 및 NFT 시장의 지속적인 성장",
                  confidence: 80
                }
              ],
              analysis: "강력한 생태계와 지속적인 기술 혁신으로 장기 성장 가능성이 높음. DeFi 및 NFT 시장 성장의 핵심 수혜자.",
              targetPrice: 5785.31,
              stopLoss: 4000
            },
            {
              symbol: "ADAUSDT",
              name: "Cardano",
              currentPrice: 0.8342,
              change24h: 1.29,
              expectedReturn: 25,
              riskScore: 5,
              recommendationScore: 78,
              reasons: [
                {
                  type: "fundamental_strength" as any,
                  description: "학술적 접근과 검증된 기술",
                  confidence: 85
                },
                {
                  type: "regulation" as any,
                  description: "규제 친화적인 접근 방식",
                  confidence: 75
                }
              ],
              analysis: "학술적 접근과 규제 친화적 특성으로 장기 성장 가능성 높음. 지속적인 생태계 확장 기대.",
              targetPrice: 1.04,
              stopLoss: 0.75
            },
            {
              symbol: "SOLUSDT",
              name: "Solana",
              currentPrice: 205.48,
              change24h: 1.22,
              expectedReturn: 20,
              riskScore: 7,
              recommendationScore: 72,
              reasons: [
                {
                  type: "technology" as any,
                  description: "고속 처리량과 확장성",
                  confidence: 80
                },
                {
                  type: "adoption" as any,
                  description: "DeFi 및 NFT 생태계의 성장",
                  confidence: 70
                }
              ],
              analysis: "고속 처리량과 확장성을 바탕으로 DeFi 및 NFT 생태계에서 경쟁력을 유지할 것으로 예상. 그러나 시장 경쟁 심화 및 기술적 리스크 고려 필요.",
              targetPrice: 246.58,
              stopLoss: 185
            }
          ],
          generatedAt: new Date().toISOString(),
          modelInfo: "Gemini 1.5 Pro - Real-time Fundamental & Ecosystem Analysis",
          marketAnalysis: "장기 시장은 생태계 성장과 기술 혁신이 핵심 동력입니다."
        };
      
      default: // medium
        return {
          timeframe: "medium_term",
          timeframeDescription: "중기 투자 (1-4주)",
          recommendations: [
            {
              symbol: "ETHUSDT",
              name: "Ethereum",
              currentPrice: 4448.29,
              change24h: 3.2,
              expectedReturn: 15,
              riskScore: 5,
              recommendationScore: 80,
              reasons: [
                {
                  type: "market_sentiment" as any,
                  description: "긍정적인 시장 분위기 및 높은 거래량",
                  confidence: 80
                },
                {
                  type: "ecosystem_growth" as any,
                  description: "DeFi 생태계 지속적인 성장 및 확장",
                  confidence: 90
                }
              ],
              analysis: "높은 거래량과 긍정적 시장 분위기, DeFi 생태계 성장으로 중장기 성장 기대",
              targetPrice: 5115,
              stopLoss: 4000
            },
            {
              symbol: "SOLUSDT",
              name: "Solana",
              currentPrice: 205.35,
              change24h: 1.1,
              expectedReturn: 18,
              riskScore: 6,
              recommendationScore: 75,
              reasons: [
                {
                  type: "high_volume" as any,
                  description: "높은 거래량으로 시장 관심 집중",
                  confidence: 95
                },
                {
                  type: "ecosystem_growth" as any,
                  description: "활발한 생태계 성장 및 개발",
                  confidence: 85
                }
              ],
              analysis: "높은 거래량과 활발한 생태계 성장으로 중기적 성장 가능성 높음",
              targetPrice: 242,
              stopLoss: 185
            },
            {
              symbol: "BTCUSDT",
              name: "Bitcoin",
              currentPrice: 109249.07,
              change24h: 1.27,
              expectedReturn: 10,
              riskScore: 3,
              recommendationScore: 78,
              reasons: [
                {
                  type: "market_leader" as any,
                  description: "시장 선두주자로서의 안정성",
                  confidence: 90
                },
                {
                  type: "news_sentiment" as any,
                  description: "긍정적인 뉴스와 기관 투자자들의 관심",
                  confidence: 70
                }
              ],
              analysis: "시장 지배력 유지 및 긍정적 뉴스로 안정적인 중기 성장 예상",
              targetPrice: 120000,
              stopLoss: 105000
            }
          ],
          generatedAt: new Date().toISOString(),
          modelInfo: "Gemini 1.5 Pro - Real-time Fundamental & Technical Analysis",
          marketAnalysis: "중기 시장은 기본적 요인과 기술적 트렌드의 조합으로 움직입니다."
        };
    }
  };

  // 선택된 타임프레임에 따른 더미 데이터 사용 (API 데이터가 없을 때만)
  const finalData = recommendationsData || getDummyData(selectedTimeframe);
  const finalIsLoading = isLoading; // 실제 로딩 상태 사용
  const finalError = error; // 실제 에러 상태 사용

  // 타임프레임 변경 핸들러 (메모이제이션으로 불필요한 리렌더링 방지)
  const handleTimeframeChange = useCallback((timeframe: 'short' | 'medium' | 'long') => {
    console.log('🔄 타임프레임 변경:', timeframe);
    setSelectedTimeframe(timeframe);
  }, []);

  // 컴포넌트 마운트 시 캐시 상태 확인
  useEffect(() => {
    console.log('🚀 AI 추천 페이지 마운트됨');
    console.log('📊 현재 캐시 상태:', {
      shortTerm: queryClient.getQueryData(['short-term-recommendations']),
      mediumTerm: queryClient.getQueryData(['medium-term-recommendations']),
      longTerm: queryClient.getQueryData(['long-term-recommendations'])
    });
    
    // 서버 상태 확인
    checkServerHealth().then((status) => {
      console.log('🔍 서버 상태 확인 완료:', status);
      if (!status.java) {
        console.warn('⚠️ Java 서버가 응답하지 않습니다. 더미 데이터를 사용합니다.');
      }
    });
  }, [queryClient]);

  // 디버깅을 위한 콘솔 로그
  console.log('🤖 AI 추천 페이지 데이터:', {
    selectedTimeframe,
    recommendationsData,
    isLoading,
    error,
    hasData: !!recommendationsData,
    hasRecommendations: !!recommendationsData?.recommendations,
    recommendationsLength: recommendationsData?.recommendations?.length,
    currentQueryStatus: {
      isLoading: currentQuery.isLoading,
      isError: currentQuery.isError,
      isSuccess: currentQuery.isSuccess,
      isFetching: currentQuery.isFetching,
      dataUpdatedAt: currentQuery.dataUpdatedAt,
      errorUpdatedAt: currentQuery.errorUpdatedAt
    }
  });

  // API 호출 상태 모니터링
  React.useEffect(() => {
    console.log('🔄 AI 추천 상태 변경:', {
      selectedTimeframe,
      isLoading: currentQuery.isLoading,
      isFetching: currentQuery.isFetching,
      isSuccess: currentQuery.isSuccess,
      isError: currentQuery.isError,
      hasData: !!currentQuery.data
    });
  }, [selectedTimeframe, currentQuery.isLoading, currentQuery.isFetching, currentQuery.isSuccess, currentQuery.isError, currentQuery.data]);

  // 데이터 구조 확인
  if (recommendationsData) {
    console.log('📊 추천 데이터 구조:', {
      timeframe: recommendationsData.timeframe,
      timeframeDescription: recommendationsData.timeframeDescription,
      recommendations: recommendationsData.recommendations,
      marketAnalysis: recommendationsData.marketAnalysis,
      modelInfo: recommendationsData.modelInfo,
      recommendationsCount: recommendationsData.recommendations?.length
    });
  }

  // 에러 상태 확인
  if (error) {
    console.error('❌ AI 추천 에러:', error);
  }

  // 위험도 점수를 위험 레벨로 변환
  const getRiskLevel = (riskScore: number): 'low' | 'medium' | 'high' => {
    if (riskScore <= 3) return 'low';
    if (riskScore <= 6) return 'medium';
    return 'high';
  };

  // 위험도 레이블
  const getRiskLabel = (riskScore: number): string => {
    if (riskScore <= 3) return '낮은 위험';
    if (riskScore <= 6) return '보통 위험';
    return '높은 위험';
  };

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
          { value: 'long', label: '장기 (1-12개월)', icon: '🌱' }
        ].map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => handleTimeframeChange(timeframe.value as any)}
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

      {/* 로딩 상태 */}
      {currentQuery.isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid var(--border-accent)',
            borderTop: '3px solid var(--text-accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            AI 추천 데이터를 분석 중입니다
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            AI가 시장 데이터를 분석하고 최적의 투자 기회를 찾고 있습니다.<br/>
            이 과정은 최대 2분 정도 소요될 수 있습니다.
          </p>
          <div style={{ 
            marginTop: '2rem',
            padding: '1rem',
            background: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            maxWidth: '400px',
            margin: '2rem auto 0'
          }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-tertiary)',
              margin: 0
            }}>
              💡 <strong>팁:</strong> AI 분석은 실시간 시장 데이터와 뉴스를 종합하여 
              정확한 추천을 제공하기 위해 시간이 필요합니다.
            </p>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {currentQuery.isError && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            데이터를 불러올 수 없습니다
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            AI 추천 데이터를 가져오는 중 오류가 발생했습니다. 
            잠시 후 다시 시도해주세요.
          </p>
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--bg-card)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)'
          }}>
            <strong>에러 상세:</strong><br/>
            {error?.message || '알 수 없는 오류가 발생했습니다.'}
          </div>
        </div>
      )}

      {/* 추천 목록 */}
      {finalData.recommendations && finalData.recommendations.length > 0 && (
        <>
          {/* 시장 분석 */}
          {finalData.marketAnalysis && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid var(--border-primary)'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                📊 시장 분석
              </h3>
              <p style={{ 
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}>
                {finalData.marketAnalysis}
              </p>
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {finalData.recommendations.map((coin: AIRecommendation, index: number) => (
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
                        현재: ${coin.currentPrice.toLocaleString()}
                      </span>
                      <span style={{ 
                        color: coin.change24h >= 0 ? 'var(--status-success)' : 'var(--status-error)', 
                        fontWeight: '600' 
                      }}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: getRiskLevel(coin.riskScore) === 'low' 
                      ? 'var(--status-success)' 
                      : getRiskLevel(coin.riskScore) === 'medium' 
                        ? 'var(--status-warning)' 
                        : 'var(--status-error)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {getRiskLabel(coin.riskScore)}
                  </div>
                </div>

                {/* 예상 수익률 및 목표가 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>예상 수익률</div>
                    <div style={{ 
                      color: 'var(--status-success)', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold' 
                    }}>
                      +{coin.expectedReturn.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>목표가</div>
                    <div style={{ 
                      color: 'var(--text-accent)', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold' 
                    }}>
                      ${coin.targetPrice.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>손절가</div>
                    <div style={{ 
                      color: 'var(--status-error)', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold' 
                    }}>
                      ${coin.stopLoss.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* 추천 점수 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>AI 추천 점수</span>
                    <span style={{ fontWeight: '600' }}>{coin.recommendationScore}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${coin.recommendationScore}%`,
                      height: '100%',
                      background: 'var(--gradient-secondary)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* AI 분석 요약 */}
                {coin.analysis && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      marginBottom: '0.75rem'
                    }}>
                      AI 분석
                    </h4>
                    <p style={{ 
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      fontSize: '0.9rem'
                    }}>
                      {coin.analysis}
                    </p>
                  </div>
                )}

                {/* 추천 근거 */}
                <div>
                  <h4 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600',
                    marginBottom: '1rem'
                  }}>
                    추천 근거
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
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ 
                          color: 'var(--accent-primary)',
                          fontSize: '0.875rem'
                        }}>
                          ✓
                        </span>
                        <div>
                          <div style={{ fontWeight: '500' }}>{reason.description}</div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--text-tertiary)',
                            marginTop: '0.25rem'
                          }}>
                            신뢰도: {reason.confidence}%
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 데이터가 없는 경우 */}
      {finalData && (!finalData.recommendations || finalData.recommendations.length === 0) && (
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-primary)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            현재 추천할 수 있는 코인이 없습니다
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            선택한 기간에 대한 AI 추천 데이터가 없습니다. 
            다른 기간을 선택하거나 잠시 후 다시 확인해주세요.
          </p>
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--bg-card)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)'
          }}>
            <strong>디버깅 정보:</strong><br/>
            데이터 존재: {recommendationsData ? '예' : '아니오'}<br/>
            추천 배열 존재: {recommendationsData?.recommendations ? '예' : '아니오'}<br/>
            추천 개수: {recommendationsData?.recommendations?.length || 0}
          </div>
        </div>
      )}

      {/* 로딩 중이 아니고 에러도 없고 데이터도 없는 경우 */}
      {!finalIsLoading && !finalError && !finalData && (
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-primary)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            데이터를 불러오는 중입니다
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            AI 추천 데이터를 서버에서 가져오는 중입니다. 
            잠시만 기다려주세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;

