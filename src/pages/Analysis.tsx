import { useState } from 'react';
import { useTechnicalAnalysis, usePopularSymbols } from '../hooks/useApi';
import { getKoreanCoinName } from '../utils/coinNames';
import toast from 'react-hot-toast';

export function Analysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedSymbol, setSearchedSymbol] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // AI 분석 데이터
  const { data: analysisData, isLoading, error } = useTechnicalAnalysis(searchedSymbol);

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

  const handleAnalysis = () => {
    if (!searchTerm.trim()) {
      toast.error('코인을 선택해주세요');
      return;
    }
    
    const symbol = searchTerm.toUpperCase().trim();
    setSearchedSymbol(symbol);
    setIsDropdownOpen(false);
    toast.success(`${symbol} AI 분석을 시작합니다`);
  };

  const handleSymbolSelect = (symbol: string) => {
    setSearchTerm(symbol);
    setIsDropdownOpen(false);
  };

  // 분석 데이터 추출 (API 응답 구조에 맞게)
  const analysis = analysisData?.analysis || analysisData;
  const price = analysisData?.price || 'N/A';
  const symbol = analysisData?.symbol || searchedSymbol;

  return (
    <div className="container">
      <h1 className="page-title floating">AI 기술적 분석</h1>
      
      {/* 검색 섹션 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem' }}>🤖</span>
          AI 기술적 분석
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
            onClick={handleAnalysis}
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
              justifyContent: 'center',
              flexShrink: 0
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
                분석 중...
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🤖 분석
              </div>
            )}
          </button>
        </div>
        
        {/* 분석 결과 */}
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
              분석 결과: {symbol}
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
                <p style={{ color: '#6b7280', margin: 0 }}>AI가 기술적 분석을 수행하고 있습니다...</p>
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
                  ❌ 분석을 불러올 수 없습니다
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                  심볼을 확인하거나 잠시 후 다시 시도해주세요
                </p>
              </div>
            )}
            
            {analysis && !isLoading && (
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
                  📊 AI 기술적 분석 결과
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
                    ${price}
                  </span>
                </div>
                
                {/* 분석 지표들 */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>RSI:</strong> {analysis?.rsi?.value || 'N/A'}
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>MACD:</strong> {analysis?.macd?.signal || 'N/A'}
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>볼린저 밴드:</strong> {analysis?.bollingerBands?.signal || 'N/A'}
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>이동평균:</strong> {analysis?.movingAverages?.signal || 'N/A'}
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>전체 신호:</strong> {analysis?.overallSignal || 'N/A'}
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>신뢰도:</strong> {analysis?.confidence || 'N/A'}%
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>추천:</strong> {analysis?.simpleAdvice || 'N/A'}
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>위험도:</strong> {analysis?.riskLevel || 'N/A'}
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <strong>위험 설명:</strong> {analysis?.riskExplanation || 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
