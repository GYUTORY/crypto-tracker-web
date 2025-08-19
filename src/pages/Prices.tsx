import { useState } from 'react';
import { PriceCard } from '../components/features/PriceCard';
import { usePrice, usePopularSymbols, usePrices } from '../hooks/useApi';
import { getKoreanCoinName } from '../utils/coinNames';
import toast from 'react-hot-toast';

export function Prices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedSymbol, setSearchedSymbol] = useState('');

  // 인기 심볼 가져오기
  const { data: popularSymbolsData, isLoading: isLoadingPopular } = usePopularSymbols();
  
  // 검색된 심볼의 가격 정보
  const { data: priceData, isLoading: isLoadingPrice, error: priceError } = usePrice(searchedSymbol);

  // 인기 코인들의 가격 정보 가져오기
  const defaultPopularCoins = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 
    'SHIBUSDT', 'DOTUSDT', 'LINKUSDT', 'UNIUSDT', 'MATICUSDT', 'ETCUSDT'
  ];
  
  // API에서 가져온 목록에 시바이누가 없으면 강제로 추가
  let popularCoins = popularSymbolsData?.popularSymbols || defaultPopularCoins;
  if (!popularCoins.includes('SHIBUSDT')) {
    popularCoins = [...popularCoins, 'SHIBUSDT'];
  }
  popularCoins = popularCoins.slice(0, 9);
  const { data: popularPricesData, isLoading: isLoadingPopularPrices } = usePrices(popularCoins);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('코인 심볼을 입력해주세요');
      return;
    }
    
    const symbol = searchTerm.toUpperCase().trim();
    setSearchedSymbol(symbol);
    toast.success(`${symbol} 검색을 시작합니다`);
  };

  return (
    <div className="container">
      <h1 className="page-title floating">가격 조회</h1>
      
      {/* 검색 섹션 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem' }}>🔍</span>
          코인 가격 검색
        </h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="코인 심볼 입력 (예: BTCUSDT)"
              style={{
                flex: 1,
                minWidth: '300px',
                padding: '1rem 1.5rem',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '1rem',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
          />
          <button 
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={isLoadingPrice}
            style={{ 
              padding: 'var(--space-3) var(--space-5)',
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              minWidth: '100px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLoadingPrice ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                검색 중...
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔍 검색
              </div>
            )}
          </button>
        </div>
        
        {/* 검색 결과 */}
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
              검색 결과: {getKoreanCoinName(searchedSymbol)} ({searchedSymbol})
            </h3>
            
            {isLoadingPrice && (
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
                <p style={{ color: '#6b7280', margin: 0 }}>가격 정보를 불러오는 중...</p>
              </div>
            )}
            
            {priceError && (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                background: 'rgba(239, 68, 68, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444'
              }}>
                <p style={{ margin: 0, fontWeight: '600' }}>
                  ❌ 가격 정보를 불러올 수 없습니다
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                  심볼을 확인하거나 잠시 후 다시 시도해주세요
                </p>
              </div>
            )}
            
            {priceData && !isLoadingPrice && (
              <PriceCard 
                symbol={priceData.symbol} 
                price={priceData.price.toString()} 
                change={priceData.change || '+0.00%'}
              />
            )}
          </div>
        )}
      </div>

      {/* 인기 코인 */}
      <div className="card">
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem' }}>🔥</span>
          인기 코인
        </h2>
        {isLoadingPopularPrices ? (
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
            <p style={{ color: '#6b7280', margin: 0 }}>인기 코인 가격을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
            {popularCoins.map((symbol: string, index: number) => {
              const priceData = popularPricesData?.prices?.find((p: any) => p.symbol === symbol);
              return (
                <div key={symbol} style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}>
                  <PriceCard 
                    symbol={symbol} 
                    price={priceData?.price?.toString() || '로딩 중...'} 
                    change={priceData?.change || '+0.00%'}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 시장 통계 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
        border: '2px solid rgba(16, 185, 129, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem' }}>📊</span>
          시장 통계
        </h2>
        <div className="grid grid-cols-1 grid-cols-3">
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              📈
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontWeight: '600' }}>
              상승 코인
            </h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
              1,247개
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite 1s'
            }}>
              📉
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontWeight: '600' }}>
              하락 코인
            </h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
              753개
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite 2s'
            }}>
              💰
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontWeight: '600' }}>
              총 거래량
            </h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
              $2.1T
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
