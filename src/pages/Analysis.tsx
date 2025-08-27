import { useState, useEffect, useRef } from 'react';
import { useTechnicalAnalysis, usePopularSymbols } from '../hooks/useApi';
import { getKoreanCoinName } from '../utils/coinNames';
import toast from 'react-hot-toast';

function Analysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedSymbol, setSearchedSymbol] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // AI 분석 데이터
  const { data: analysisData, isLoading, error } = useTechnicalAnalysis(searchedSymbol);

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

  // 분석 데이터 추출
  const analysis = analysisData?.analysis || analysisData;
  const price = analysisData?.price || 'N/A';
  const symbol = analysisData?.symbol || searchedSymbol;

  // 신호 색상 결정
  const getSignalColor = (signal: string) => {
    if (!signal) return 'var(--text-muted)';
    const lowerSignal = signal.toLowerCase();
    if (lowerSignal.includes('매수') || lowerSignal.includes('강세') || lowerSignal.includes('buy')) return 'var(--status-success)';
    if (lowerSignal.includes('매도') || lowerSignal.includes('약세') || lowerSignal.includes('sell')) return 'var(--status-error)';
    if (lowerSignal.includes('중립') || lowerSignal.includes('neutral')) return 'var(--status-warning)';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ 
      position: 'relative', 
      overflow: 'hidden',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
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
              background: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '500' }}>AI 분석 시스템 활성화</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            AI 기술적 분석
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '48rem',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            최첨단 AI가 제공하는 실시간 암호화폐 기술적 분석으로 <span style={{ color: '#6366f1', fontWeight: '600' }}>스마트한 투자 결정</span>을 도와드립니다
          </p>
        </div>

        {/* 코인 선택 및 분석 섹션 */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🤖</span>
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>코인 선택 및 분석</h2>
              <p style={{ color: '#64748b', margin: 0 }}>기술적 분석 및 매매 신호</p>
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
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '1rem',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    color: searchTerm ? 'var(--text-primary)' : 'var(--text-tertiary)',
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
                    border: '2px solid rgba(139, 92, 246, 0.3)',
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
                      borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                      background: 'rgba(139, 92, 246, 0.05)'
                    }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: 'var(--text-primary)',
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
                              background: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              borderRadius: '0.5rem',
                              fontSize: '0.85rem',
                              color: 'var(--text-primary)',
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
                            background: 'var(--gradient-purple)',
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
                            color: 'var(--text-secondary)',
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
                onClick={handleAnalysis}
                disabled={isLoading}
                style={{ 
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
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
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
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
                    분석 중...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.2rem' }}>🤖</span>
                    분석 시작
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 분석 결과 */}
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
                    border: '4px solid rgba(139, 92, 246, 0.3)',
                    borderTop: '4px solid #6366f1',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 2rem'
                  }} />
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    AI 분석 중...
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
                    최첨단 AI가 {symbol}의 기술적 지표를 분석하고 있습니다
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
                    분석 오류
                  </h3>
                  <p style={{ color: '#fca5a5', fontSize: '1.125rem' }}>
                    코인 심볼을 확인하거나 잠시 후 다시 시도해주세요
                  </p>
                </div>
              )}
              
              {analysis && !isLoading && (
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
                        background: 'linear-gradient(135deg, #10b981, #059669)',
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
                        ${price}
                      </div>
                      <p style={{ color: '#64748b', fontSize: '1rem' }}>실시간 업데이트</p>
                    </div>
                  </div>

                  {/* AI 추천 카드 */}
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
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}>
                        <span style={{ fontSize: '2rem' }}>🤖</span>
                      </div>
                      <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                        AI 추천
                      </h3>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.75rem',
                        color: getSignalColor(analysis?.simpleAdvice)
                      }}>
                        {analysis?.simpleAdvice || 'N/A'}
                      </div>
                      <p style={{ color: '#64748b', fontSize: '1rem' }}>AI 분석 결과</p>
                    </div>
                  </div>

                  {/* 신뢰도 카드 */}
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
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
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
                        분석 신뢰도
                      </h3>
                      <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '900', 
                        marginBottom: '0.75rem',
                        color: analysis?.confidence >= 80 ? '#10b981' : analysis?.confidence >= 60 ? '#f59e0b' : '#ef4444'
                      }}>
                        {analysis?.confidence || 'N/A'}%
                      </div>
                      <p style={{ color: '#64748b', fontSize: '1rem' }}>분석 정확도</p>
                    </div>
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

export default Analysis;
