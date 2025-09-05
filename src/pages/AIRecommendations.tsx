import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useShortTermRecommendations, useMediumTermRecommendations, useLongTermRecommendations } from '../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { checkServerHealth } from '../services/api';
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


  // API 데이터만 사용
  const finalData = recommendationsData;
  const finalIsLoading = isLoading;
  const finalError = error;

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
      if (!status.node) {
        console.warn('⚠️ Node.js 서버가 응답하지 않습니다.');
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
      padding: '1rem 0.75rem',
      minHeight: 'calc(100vh - 80px)'
    }}>

      {/* 타임프레임 선택 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem'
      }}>
        {[
          { 
            value: 'short', 
            label: '단기', 
            sublabel: '1-7일', 
            icon: '⚡',
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)'
          },
          { 
            value: 'medium', 
            label: '중기', 
            sublabel: '1-4주', 
            icon: '📈',
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)'
          },
          { 
            value: 'long', 
            label: '장기', 
            sublabel: '1-12개월', 
            icon: '🌱',
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.3)'
          }
        ].map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => handleTimeframeChange(timeframe.value as any)}
            style={{
              flex: 1,
              padding: '1.5rem 1rem',
              borderRadius: '16px',
              border: selectedTimeframe === timeframe.value 
                ? `2px solid ${timeframe.color}` 
                : `2px solid ${timeframe.borderColor}`,
              background: selectedTimeframe === timeframe.value 
                ? `linear-gradient(135deg, ${timeframe.color}, ${timeframe.color}dd)` 
                : timeframe.bgColor,
              color: selectedTimeframe === timeframe.value 
                ? 'white' 
                : timeframe.color,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '5rem',
              justifyContent: 'center',
              boxShadow: selectedTimeframe === timeframe.value 
                ? `0 8px 32px ${timeframe.color}40` 
                : '0 4px 16px rgba(0, 0, 0, 0.1)',
              transform: selectedTimeframe === timeframe.value ? 'translateY(-2px)' : 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (selectedTimeframe !== timeframe.value) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 6px 24px ${timeframe.color}30`;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTimeframe !== timeframe.value) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <div style={{ 
              fontSize: '2rem',
              filter: selectedTimeframe === timeframe.value ? 'brightness(1.2)' : 'none'
            }}>
              {timeframe.icon}
            </div>
            <div style={{ 
              fontSize: '1rem',
              fontWeight: '700',
              letterSpacing: '0.025em'
            }}>
              {timeframe.label}
            </div>
            <div style={{ 
              fontSize: '0.8rem',
              opacity: 0.8,
              fontWeight: '500'
            }}>
              {timeframe.sublabel}
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
      {!finalIsLoading && finalData && finalData.recommendations && finalData.recommendations.length > 0 && (
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {finalData.recommendations.map((coin: AIRecommendation) => (
              <div
                key={coin.symbol}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-lg)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  minHeight: 'fit-content',
                  display: 'flex',
                  flexDirection: 'column'
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
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px'
                }}>
                    <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-card)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>예상 수익률</span>
                    <span style={{ 
                      color: 'var(--status-success)', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold' 
                    }}>
                      +{coin.expectedReturn.toFixed(1)}%
                    </span>
                  </div>
                    <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-card)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>목표가</span>
                    <span style={{ 
                      color: 'var(--text-accent)', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold' 
                    }}>
                      ${coin.targetPrice.toLocaleString()}
                    </span>
                  </div>
                    <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-card)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>손절가</span>
                    <span style={{ 
                      color: 'var(--status-error)', 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold' 
                    }}>
                      ${coin.stopLoss.toLocaleString()}
                    </span>
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
                <div style={{ 
                  marginTop: 'auto',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-secondary)'
                }}>
                  <h4 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    추천 근거
                  </h4>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {coin.reasons.map((reason, reasonIndex) => (
                      <li key={reasonIndex} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-secondary)'
                      }}>
                        <span style={{ 
                          color: 'var(--accent-primary)',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          marginTop: '0.125rem',
                          flexShrink: 0
                        }}>
                          ✓
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                            lineHeight: '1.4',
                            marginBottom: '0.25rem',
                            fontSize: '0.9rem'
                          }}>
                            {reason.description}
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--text-tertiary)',
                            fontWeight: '500'
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
      {!finalIsLoading && !finalError && finalData && (!finalData.recommendations || finalData.recommendations.length === 0) && (
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

