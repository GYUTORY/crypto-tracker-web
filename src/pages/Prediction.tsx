import { useState, useEffect, useRef } from 'react';
import { usePricePrediction, useCreatePrediction, usePopularSymbols } from '../hooks/useApi';
import { getKoreanCoinName } from '../utils/coinNames';
import toast from 'react-hot-toast';

export function Prediction() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedSymbol, setSearchedSymbol] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 가격 예측 데이터
  const { data: predictionData, isLoading, error } = usePricePrediction(searchedSymbol);
  
  // 인기 코인 목록
  const { data: popularSymbolsData } = usePopularSymbols();
  const defaultPopularSymbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 
    'SHIBUSDT', 'DOTUSDT', 'LINKUSDT', 'UNIUSDT', 'MATICUSDT', 'ETCUSDT'
  ];
  
  let popularSymbols = popularSymbolsData?.popularSymbols || defaultPopularSymbols;
  if (!popularSymbols.includes('SHIBUSDT')) {
    popularSymbols = [...popularSymbols, 'SHIBUSDT'];
  }
  
  // 새로운 예측 생성
  const createPredictionMutation = useCreatePrediction(searchedSymbol);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePrediction = () => {
    if (!searchTerm.trim()) {
      toast.error('코인을 선택해주세요');
      return;
    }
    
    const symbol = searchTerm.toUpperCase().trim();
    console.log('🔮 예측 요청:', symbol);
    setSearchedSymbol(symbol);
    setIsDropdownOpen(false);
    toast.success(`${getKoreanCoinName(symbol)} (${symbol}) 가격 예측을 시작합니다`);
  };

  const handleSymbolSelect = (symbol: string) => {
    setSearchTerm(symbol);
    setIsDropdownOpen(false);
  };

  const handleCreateNewPrediction = () => {
    if (!searchedSymbol) {
      toast.error('먼저 코인을 선택해주세요');
      return;
    }
    
    createPredictionMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('새로운 예측이 생성되었습니다!');
      },
      onError: () => {
        toast.error('예측 생성에 실패했습니다');
      }
    });
  };

  // 예측 데이터 추출
  const predictions = predictionData?.predictions || [];
  const currentPrice = predictionData?.currentPrice || 'N/A';
  const symbol = predictionData?.symbol || searchedSymbol;
  const confidence = predictionData?.analysis?.confidence || predictionData?.confidence || 'N/A';
  const marketSentiment = predictionData?.analysis?.marketSentiment || 'N/A';

  // 가격 포맷팅 함수
  const formatPrice = (priceStr: string) => {
    const priceNum = parseFloat(priceStr);
    if (isNaN(priceNum)) return priceStr;
    
    if (priceNum < 1) {
      return priceNum.toFixed(8).replace(/\.?0+$/, '');
    } else if (priceNum < 1000) {
      return priceNum.toFixed(2);
    } else {
      return priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  // 시간대별 예측 찾기
  const getPredictionByTimeframe = (timeframe: string) => {
    return predictions.find((p: any) => p.timeframe === timeframe);
  };

  const oneHourPrediction = getPredictionByTimeframe('1h');
  const fourHourPrediction = getPredictionByTimeframe('4h');
  const oneDayPrediction = getPredictionByTimeframe('24h');

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 배경 효과 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(120,119,198,0.1), transparent 50%)'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* 헤더 섹션 */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '0.75rem 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '0.5rem',
              height: '0.5rem',
              background: '#22c55e',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: '500' }}>AI 예측 시스템 활성화</span>
          </div>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            가격 예측
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: '#d1d5db',
            maxWidth: '48rem',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            최첨단 AI가 제공하는 실시간 암호화폐 가격 예측으로 <span style={{ color: '#a78bfa', fontWeight: '600' }}>미래 투자 전략</span>을 수립하세요
          </p>
        </div>

        {/* 코인 선택 및 예측 섹션 */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🔮</span>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>코인 선택 및 예측</h2>
              <p style={{ color: '#9ca3af', margin: 0 }}>예측하고 싶은 암호화폐를 선택하세요</p>
            </div>
          </div>

          {/* 검색 카드 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
              {/* 드롭다운 컨테이너 */}
              <div ref={dropdownRef} style={{ flex: 1, minWidth: '300px', position: 'relative', zIndex: 20 }}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    padding: '1rem 1.5rem',
                    border: '2px solid rgba(249, 115, 22, 0.3)',
                    borderRadius: '1rem',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    color: searchTerm ? '#1f2937' : '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '60px'
                  }}
                >
                  <span>{searchTerm || '코인을 선택하세요'}</span>
                  <span style={{ 
                    transition: 'transform 0.3s ease',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </div>
                
                {/* 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(249, 115, 22, 0.3)',
                    borderRadius: '0.75rem',
                    marginTop: '0.5rem',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 9999,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }}>
                    {/* 인기 코인 섹션 */}
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid rgba(249, 115, 22, 0.1)',
                      background: 'rgba(249, 115, 22, 0.05)'
                    }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#f97316',
                        marginBottom: '0.5rem'
                      }}>
                        🔥 인기 코인
                      </div>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        {popularSymbols.slice(0, 12).map((symbol: string) => (
                          <button
                            key={symbol}
                            onClick={() => handleSymbolSelect(symbol)}
                            style={{
                              padding: '0.75rem 0.5rem',
                              background: 'rgba(249, 115, 22, 0.1)',
                              border: '1px solid rgba(249, 115, 22, 0.2)',
                              borderRadius: '0.5rem',
                              fontSize: '0.85rem',
                              color: '#f97316',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontWeight: '500'
                            }}
                          >
                            {getKoreanCoinName(symbol)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* 전체 코인 목록 */}
                    <div style={{ padding: '0.5rem 0' }}>
                      {popularSymbols.map((symbol: string) => (
                        <div
                          key={symbol}
                          onClick={() => handleSymbolSelect(symbol)}
                          style={{
                            padding: '0.75rem 1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'linear-gradient(135deg, #f97316, #ef4444)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {symbol.replace('USDT', '').charAt(0)}
                          </div>
                          <span style={{ 
                            fontSize: '0.95rem', 
                            color: '#374151',
                            fontWeight: '500'
                          }}>
                            {getKoreanCoinName(symbol)} ({symbol})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handlePrediction}
                disabled={isLoading}
                style={{ 
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #f97316, #ef4444)',
                  color: 'white',
                  borderRadius: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  minWidth: '140px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    예측 중...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.2rem' }}>🔮</span>
                    예측 시작
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 예측 결과 */}
          {searchedSymbol && (
            <div style={{ position: 'relative', zIndex: 1 }}>
              {isLoading && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid rgba(249, 115, 22, 0.3)',
                    borderTop: '4px solid #f97316',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 2rem'
                  }} />
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    AI 예측 중...
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
                    최첨단 AI가 {symbol}의 가격을 예측하고 있습니다
                  </p>
                </div>
              )}
              
              {error && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem'
                  }}>
                    <span style={{ fontSize: '2rem' }}>❌</span>
                  </div>
                  <h3 style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    예측 오류
                  </h3>
                  <p style={{ color: '#fca5a5', fontSize: '1.125rem' }}>
                    코인 심볼을 확인하거나 잠시 후 다시 시도해주세요
                  </p>
                </div>
              )}
              
              {predictionData && !isLoading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  {/* 현재 가격 카드 */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.5s'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}>
                        <span style={{ fontSize: '2rem' }}>💰</span>
                      </div>
                      <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                        {symbol} 현재 가격
                      </h3>
                      <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', marginBottom: '0.75rem' }}>
                        ${formatPrice(currentPrice)}
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '1rem' }}>실시간 업데이트</p>
                    </div>
                  </div>

                  {/* 예측 신뢰도 카드 */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.5s'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                      }}>
                        <span style={{ fontSize: '2rem' }}>🎯</span>
                      </div>
                      <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                        예측 신뢰도
                      </h3>
                      <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '900', 
                        marginBottom: '0.75rem',
                        color: confidence >= 80 ? '#10b981' : confidence >= 60 ? '#f59e0b' : '#ef4444'
                      }}>
                        {confidence}%
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '1rem' }}>AI 예측 정확도</p>
                    </div>
                  </div>

                  {/* 시장 심리 카드 */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.5s'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}>
                        <span style={{ fontSize: '2rem' }}>📊</span>
                      </div>
                      <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                        시장 심리
                      </h3>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.75rem',
                        color: marketSentiment === 'bullish' ? '#10b981' : marketSentiment === 'bearish' ? '#ef4444' : '#f59e0b'
                      }}>
                        {marketSentiment === 'bullish' ? '📈 낙관적' : marketSentiment === 'bearish' ? '📉 비관적' : '➡️ 중립적'}
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '1rem' }}>현재 시장 분위기</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 시간대별 예측 섹션 */}
              {predictionData && !isLoading && (oneHourPrediction || fourHourPrediction || oneDayPrediction) && (
                <div style={{ marginTop: '3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'linear-gradient(135deg, #f97316, #ef4444)',
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>📈</span>
                    </div>
                    <div>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>시간대별 예측</h2>
                      <p style={{ color: '#9ca3af', margin: 0 }}>AI가 분석한 가격 예측 결과</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {/* 1시간 예측 */}
                    {oneHourPrediction && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.5s'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '4rem',
                            height: '4rem',
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                          }}>
                            <span style={{ fontSize: '2rem' }}>🔮</span>
                          </div>
                          <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                            1시간 예측
                          </h3>
                          <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: '900', 
                            marginBottom: '0.75rem',
                            color: '#3b82f6'
                          }}>
                            ${formatPrice(oneHourPrediction.predictedPrice)}
                          </div>
                          <div style={{ 
                            fontSize: '1rem', 
                            color: oneHourPrediction.direction === 'up' ? '#10b981' : '#ef4444',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                          }}>
                            {oneHourPrediction.direction === 'up' ? '📈 상승' : '📉 하락'}
                          </div>
                          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                            {oneHourPrediction.confidence}% 신뢰도
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* 4시간 예측 */}
                    {fourHourPrediction && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.5s'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '4rem',
                            height: '4rem',
                            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                          }}>
                            <span style={{ fontSize: '2rem' }}>📊</span>
                          </div>
                          <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                            4시간 예측
                          </h3>
                          <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: '900', 
                            marginBottom: '0.75rem',
                            color: '#8b5cf6'
                          }}>
                            ${formatPrice(fourHourPrediction.predictedPrice)}
                          </div>
                          <div style={{ 
                            fontSize: '1rem', 
                            color: fourHourPrediction.direction === 'up' ? '#10b981' : '#ef4444',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                          }}>
                            {fourHourPrediction.direction === 'up' ? '📈 상승' : '📉 하락'}
                          </div>
                          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                            {fourHourPrediction.confidence}% 신뢰도
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* 24시간 예측 */}
                    {oneDayPrediction && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.5s'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '4rem',
                            height: '4rem',
                            background: 'linear-gradient(135deg, #f97316, #ef4444)',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                          }}>
                            <span style={{ fontSize: '2rem' }}>📈</span>
                          </div>
                          <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                            24시간 예측
                          </h3>
                          <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: '900', 
                            marginBottom: '0.75rem',
                            color: '#f97316'
                          }}>
                            ${formatPrice(oneDayPrediction.predictedPrice)}
                          </div>
                          <div style={{ 
                            fontSize: '1rem', 
                            color: oneDayPrediction.direction === 'up' ? '#10b981' : '#ef4444',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                          }}>
                            {oneDayPrediction.direction === 'up' ? '📈 상승' : '📉 하락'}
                          </div>
                          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                            {oneDayPrediction.confidence}% 신뢰도
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 새 예측 생성 버튼 */}
                  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button 
                      onClick={handleCreateNewPrediction}
                      disabled={createPredictionMutation.isPending}
                      style={{ 
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        color: 'white',
                        borderRadius: '1rem',
                        fontWeight: 'bold',
                        fontSize: '1.125rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        minWidth: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        margin: '0 auto'
                      }}
                    >
                      {createPredictionMutation.isPending ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          새 예측 생성 중...
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '1.2rem' }}>🔄</span>
                          새 예측 생성
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
