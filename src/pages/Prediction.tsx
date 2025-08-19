import { useState } from 'react';
import { usePricePrediction, useCreatePrediction, usePopularSymbols } from '../hooks/useApi';
import { getKoreanCoinName } from '../utils/coinNames';
import toast from 'react-hot-toast';

export function Prediction() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedSymbol, setSearchedSymbol] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 가격 예측 데이터
  const { data: predictionData, isLoading, error } = usePricePrediction(searchedSymbol);
  
  // 인기 코인 목록
  const { data: popularSymbolsData } = usePopularSymbols();
  const defaultPopularSymbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 
    'SHIBUSDT', 'DOTUSDT', 'LINKUSDT', 'UNIUSDT', 'MATICUSDT', 'ETCUSDT'
  ];
  
  // API에서 가져온 목록에 시바이누가 없으면 강제로 추가
  let popularSymbols = popularSymbolsData?.popularSymbols || defaultPopularSymbols;
  if (!popularSymbols.includes('SHIBUSDT')) {
    popularSymbols = [...popularSymbols, 'SHIBUSDT'];
  }
  
  // 새로운 예측 생성
  const createPredictionMutation = useCreatePrediction(searchedSymbol);

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
    
    // 1달러 미만인 경우 소수점 8자리까지 표시 (시바이누 등)
    if (priceNum < 1) {
      return priceNum.toFixed(8).replace(/\.?0+$/, '');
    }
    // 1달러 이상 1000달러 미만인 경우 소수점 2자리까지 표시
    else if (priceNum < 1000) {
      return priceNum.toFixed(2);
    }
    // 1000달러 이상인 경우 천 단위 구분자와 소수점 2자리까지 표시
    else {
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
    <div className="container">
      <h1 className="page-title floating">가격 예측</h1>
      
      {/* 검색 섹션 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem' }}>📈</span>
          AI 가격 예측
        </h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {/* 드롭다운 컨테이너 */}
          <div style={{ 
            flex: 1, 
            minWidth: '300px',
            maxWidth: '100%',
            position: 'relative'
          }}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                padding: '1rem 1.5rem',
                border: '2px solid rgba(102, 126, 234, 0.2)',
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <span style={{ 
                wordBreak: 'break-word',
                lineHeight: '1.4',
                minHeight: '2.8em',
                display: 'flex',
                alignItems: 'center'
              }}>
                {searchTerm || '코인을 선택하세요'}
              </span>
              <span style={{ 
                fontSize: '1.2rem', 
                transition: 'transform 0.3s ease',
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0,
                marginLeft: '0.5rem'
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
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '0.75rem',
                marginTop: '0.5rem',
                maxHeight: '400px',
                minHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                width: '100%'
              }}>
                {/* 인기 코인 섹션 */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                  background: 'rgba(102, 126, 234, 0.05)'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#667eea',
                    marginBottom: '0.5rem'
                  }}>
                    🔥 인기 코인
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '0.5rem',
                    width: '100%'
                  }}>
                    {popularSymbols.slice(0, 12).map((symbol: string) => (
                      <button
                        key={symbol}
                        onClick={() => handleSymbolSelect(symbol)}
                        style={{
                                                      padding: '0.75rem 0.5rem',
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#667eea',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontWeight: '500',
                            minHeight: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            lineHeight: '1.2'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
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
                        gap: '0.5rem',
                        minHeight: '50px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        color: 'white',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {symbol.replace('USDT', '').charAt(0)}
                      </div>
                      <span style={{ 
                        fontSize: '0.95rem', 
                        color: '#374151',
                        fontWeight: '500',
                        wordBreak: 'break-word',
                        lineHeight: '1.3'
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
            className="btn btn-primary"
            onClick={handlePrediction}
            disabled={isLoading}
            style={{ 
              padding: 'var(--space-3) var(--space-5)',
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              minWidth: '100px',
              height: '60px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                예측 중...
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📈 예측
              </div>
            )}
          </button>
        </div>
        
        {/* 예측 결과 */}
        {searchedSymbol && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: '#374151',
              fontSize: '1.3rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>✨</span>
              예측 결과: {symbol}
            </h3>
            
            {isLoading && (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(102, 126, 234, 0.3)',
                  borderTop: '3px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                <p style={{ color: '#6b7280', margin: 0 }}>AI가 가격을 예측하고 있습니다...</p>
              </div>
            )}
            
            {error && (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                background: 'rgba(239, 68, 68, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444'
              }}>
                <p style={{ margin: 0, fontWeight: '600' }}>
                  ❌ 예측을 불러올 수 없습니다
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                  {symbol} ({getKoreanCoinName(symbol)}) - 심볼을 확인하거나 잠시 후 다시 시도해주세요
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                  에러: {error.message || '알 수 없는 오류'}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  🔄 다시 시도
                </button>
              </div>
            )}
            
            {predictionData && !isLoading && (
              <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                border: '2px solid rgba(16, 185, 129, 0.2)'
              }}>
                <h4 style={{ 
                  marginBottom: '1rem', 
                  color: '#10b981',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  📊 AI 가격 예측 결과
                </h4>
                
                {/* 현재 가격 */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>현재 가격:</strong>
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    fontSize: '1.3rem', 
                    fontWeight: '700', 
                    color: '#1f2937' 
                  }}>
                    ${formatPrice(currentPrice)}
                  </span>
                </div>
                
                {/* 예측 결과 그리드 */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {/* 1시간 예측 */}
                  {oneHourPrediction && (
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      textAlign: 'center'
                    }}>
                      <h5 style={{ 
                        color: '#10b981', 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        🔮 1시간 예측
                      </h5>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        color: '#1f2937',
                        marginBottom: '0.5rem'
                      }}>
                        ${formatPrice(oneHourPrediction.predictedPrice)}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: oneHourPrediction.direction === 'up' ? '#10b981' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {oneHourPrediction.direction === 'up' ? '📈 상승' : '📉 하락'} 
                        ({oneHourPrediction.confidence}% 신뢰도)
                      </div>
                    </div>
                  )}
                  
                  {/* 4시간 예측 */}
                  {fourHourPrediction && (
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      textAlign: 'center'
                    }}>
                      <h5 style={{ 
                        color: '#10b981', 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        📊 4시간 예측
                      </h5>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        color: '#1f2937',
                        marginBottom: '0.5rem'
                      }}>
                        ${formatPrice(fourHourPrediction.predictedPrice)}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: fourHourPrediction.direction === 'up' ? '#10b981' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {fourHourPrediction.direction === 'up' ? '📈 상승' : '📉 하락'} 
                        ({fourHourPrediction.confidence}% 신뢰도)
                      </div>
                    </div>
                  )}
                  
                  {/* 24시간 예측 */}
                  {oneDayPrediction && (
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      textAlign: 'center'
                    }}>
                      <h5 style={{ 
                        color: '#10b981', 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        📈 24시간 예측
                      </h5>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        color: '#1f2937',
                        marginBottom: '0.5rem'
                      }}>
                        ${formatPrice(oneDayPrediction.predictedPrice)}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: oneDayPrediction.direction === 'up' ? '#10b981' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {oneDayPrediction.direction === 'up' ? '📈 상승' : '📉 하락'} 
                        ({oneDayPrediction.confidence}% 신뢰도)
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 추가 정보 */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <strong>신뢰도:</strong> {confidence}%
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <strong>시장 심리:</strong> 
                    <span style={{ 
                      marginLeft: '0.5rem',
                      color: marketSentiment === 'bullish' ? '#10b981' : marketSentiment === 'bearish' ? '#ef4444' : '#6b7280'
                    }}>
                      {marketSentiment === 'bullish' ? '📈 낙관적' : marketSentiment === 'bearish' ? '📉 비관적' : '➡️ 중립적'}
                    </span>
                  </div>
                </div>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCreateNewPrediction}
                    disabled={createPredictionMutation.isPending}
                    style={{ 
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      borderRadius: '1rem',
                      boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)'
                    }}
                  >
                    {createPredictionMutation.isPending ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        새 예측 생성 중...
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🔄 새 예측 생성
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
