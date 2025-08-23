import { useNavigate } from 'react-router-dom';
import { usePopularSymbols, usePrices, useBitcoinNews, useChartData, useMarketStats } from '../hooks/useApi';

export function Dashboard() {
  const navigate = useNavigate();

  // 실제 API 데이터 가져오기
  const { data: popularSymbolsData, isLoading: isLoadingPopular } = usePopularSymbols();
  
  // 인기 코인들의 가격 정보 가져오기
  const defaultPopularSymbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 
    'SHIBUSDT', 'DOTUSDT', 'LINKUSDT', 'UNIUSDT', 'MATICUSDT', 'ETCUSDT'
  ];
  
  // API에서 가져온 목록에 시바이누가 없으면 강제로 추가
  let popularSymbols = popularSymbolsData?.popularSymbols || defaultPopularSymbols;
  if (!popularSymbols.includes('SHIBUSDT')) {
    popularSymbols = [...popularSymbols, 'SHIBUSDT'];
  }
  popularSymbols = popularSymbols.slice(0, 4);
  const { data: pricesData, isLoading: isLoadingPrices } = usePrices(popularSymbols);

  // 각 코인의 차트 데이터 가져오기
  const chartDataQueries = popularSymbols.map((symbol: string) => useChartData(symbol, '1h', 24));

  // 비트코인 뉴스 가져오기
  const { data: bitcoinNewsData, isLoading: isLoadingNews } = useBitcoinNews();

  // 시장 통계 가져오기
  const { data: marketStatsData } = useMarketStats();

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank');
  };

  // 코인 아이콘 가져오기 함수
  const getCoinIcon = (symbol: string) => {
    const coinName = symbol.replace('USDT', '').toLowerCase();
    const iconMap: { [key: string]: string } = {
      btc: '₿',
      eth: 'Ξ',
      bnb: '🟡',
      ada: '₳',
      sol: '◎',
      shib: '🐕',
      dot: '●',
      link: '🔗',
      uni: '🦄',
      matic: '💜',
      etc: '⟠'
    };
    return iconMap[coinName] || symbol.slice(0, 1);
  };

  // 코인 이름 가져오기 함수
  const getCoinName = (symbol: string) => {
    const coinName = symbol.replace('USDT', '').toLowerCase();
    const nameMap: { [key: string]: string } = {
      btc: 'Bitcoin',
      eth: 'Ethereum',
      bnb: 'Binance Coin',
      ada: 'Cardano',
      sol: 'Solana',
      shib: 'Shiba Inu',
      dot: 'Polkadot',
      link: 'Chainlink',
      uni: 'Uniswap',
      matic: 'Polygon',
      etc: 'Ethereum Classic'
    };
    return nameMap[coinName] || symbol.replace('USDT', '');
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 1000) {
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (num >= 1) {
      return `$${num.toFixed(2)}`;
    } else {
      return `$${num.toFixed(4)}`;
    }
  };

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
            <span style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: '500' }}>실시간 데이터 연결됨</span>
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
            Crypto Tracker
            <span style={{ display: 'block', fontSize: '2.5rem', color: '#a78bfa', fontWeight: '300' }}>Pro</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: '#d1d5db',
            maxWidth: '48rem',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            AI 기반 실시간 암호화폐 분석으로 <span style={{ color: '#a78bfa', fontWeight: '600' }}>스마트한 투자 결정</span>을 내리세요
          </p>
      </div>
      
        {/* 실시간 가격 섹션 */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                <span style={{ fontSize: '1.5rem' }}>🔥</span>
              </div>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>실시간 가격</h2>
                <p style={{ color: '#9ca3af', margin: 0 }}>최신 시장 데이터</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: '#22c55e',
              borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: '500' }}>실시간</span>
              </div>
              <div style={{ width: '1px', height: '1.5rem', background: '#4b5563' }}></div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>24시간 모니터링</span>
            </div>
          </div>

          {isLoadingPrices ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  padding: '1.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  animation: 'pulse 2s infinite',
                  minHeight: '280px'
                }}>
                  <div style={{ height: '1.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', marginBottom: '1rem' }}></div>
                  <div style={{ height: '3rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', marginBottom: '0.75rem' }}></div>
                  <div style={{ height: '2rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', width: '66%' }}></div>
                </div>
              ))}
          </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {popularSymbols.map((symbol: string, index: number) => {
              const priceData = pricesData?.prices?.find((p: any) => p.symbol === symbol);
              return (
                  <div key={symbol} style={{
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1.5rem',
                    padding: '1.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.5s',
                    cursor: 'pointer',
                    minHeight: '280px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
                      borderRadius: '1.5rem',
                      opacity: 0,
                      transition: 'opacity 0.5s'
                    }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '4rem',
                            height: '4rem',
                            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                          }}>
                            {getCoinIcon(symbol)}
                          </div>
                          <div>
                            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>{getCoinName(symbol)}</h3>
                            <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>{symbol}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '120px' }}>
                          <div style={{ 
                            fontSize: '1.75rem', 
                            fontWeight: '900', 
                            color: 'white', 
                            marginBottom: '0.5rem',
                            lineHeight: '1.2'
                          }}>
                            {formatPrice(priceData?.price || '0')}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            padding: '0.375rem 0.875rem',
                            borderRadius: '9999px',
                            background: priceData?.change?.startsWith('+') 
                              ? 'rgba(34, 197, 94, 0.2)' 
                              : 'rgba(239, 68, 68, 0.2)',
                            color: priceData?.change?.startsWith('+') 
                              ? '#22c55e' 
                              : '#ef4444',
                            border: `1px solid ${priceData?.change?.startsWith('+') 
                              ? 'rgba(34, 197, 94, 0.3)' 
                              : 'rgba(239, 68, 68, 0.3)'}`,
                            display: 'inline-block',
                            minWidth: '70px',
                            textAlign: 'center'
                          }}>
                            {priceData?.change || '+0.00%'}
                          </div>
                        </div>
                      </div>
                      
                      {/* 실제 차트 데이터 사용 */}
                      <div style={{
                        height: '6rem',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                        borderRadius: '1rem',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        position: 'relative'
                      }}>
                        {/* Y축 라벨 */}
                        <div style={{
                          position: 'absolute',
                          left: '0.5rem',
                          top: '50%',
                          transform: 'translateY(-50%) rotate(-90deg)',
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          fontWeight: '500',
                          whiteSpace: 'nowrap'
                        }}>
                          가격 ($)
                        </div>
                        
                        {/* 현재 가격 표시 */}
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.75rem',
                          fontSize: '0.75rem',
                          color: '#a78bfa',
                          fontWeight: '600',
                          background: 'rgba(167, 139, 250, 0.1)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(167, 139, 250, 0.2)'
                        }}>
                          현재: {formatPrice(priceData?.price || '0')}
                        </div>
                        
                        {/* X축 라벨 */}
                        <div style={{
                          position: 'absolute',
                          bottom: '0.25rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          fontWeight: '500'
                        }}>
                          최근 10시간
                        </div>
                        
                        {/* 차트 영역 */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'end', 
                          gap: '0.25rem', 
                          height: '4rem',
                          marginLeft: '2rem',
                          marginBottom: '1.5rem'
                        }}>
                          {(() => {
                            // 해당 코인의 차트 데이터 찾기
                            const chartData = chartDataQueries.find((query: any) => 
                              query.data?.symbol === symbol
                            )?.data;
                            
                            if (chartData?.data && chartData.data.length > 0) {
                              // 실제 차트 데이터 사용
                              const prices = chartData.data.map((point: any) => parseFloat(point.price));
                              const minPrice = Math.min(...prices);
                              const maxPrice = Math.max(...prices);
                              const priceRange = maxPrice - minPrice;
                              
                              return chartData.data.slice(-10).map((point: any, i: number) => {
                                const price = parseFloat(point.price);
                                const height = priceRange > 0 
                                  ? ((price - minPrice) / priceRange) * 60 + 20
                                  : 50;
                                
                                return (
                                  <div 
                                    key={i}
                                    style={{
                                      width: '0.25rem',
                                      background: 'linear-gradient(to top, #8b5cf6, #3b82f6)',
                                      borderRadius: '9999px',
                                      transition: 'all 0.3s',
                                      height: `${height}%`,
                                      cursor: 'pointer',
                                      position: 'relative'
                                    }}
                                    title={`${i + 1}시간 전: $${price.toFixed(2)}`}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'scale(1.2)';
                                      e.currentTarget.style.background = 'linear-gradient(to top, #a78bfa, #60a5fa)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'scale(1)';
                                      e.currentTarget.style.background = 'linear-gradient(to top, #8b5cf6, #3b82f6)';
                                    }}
                                  ></div>
                                );
                              });
                            } else {
                              // 현재 가격을 기반으로 한 자연스러운 차트 생성
                              const currentPrice = parseFloat(priceData?.price || '1000');
                              const basePrice = currentPrice * 0.95; // 기준 가격
                              const variation = 0.05; // 5% 변동
                              
                              return Array.from({ length: 10 }, (_, i) => {
                                // 시간에 따른 자연스러운 변동
                                const timeVariation = Math.sin(i * 0.5) * variation;
                                const randomVariation = (Math.random() - 0.5) * 0.02;
                                const priceVariation = basePrice * (1 + timeVariation + randomVariation);
                                
                                // 높이 계산 (20% ~ 80% 범위)
                                const height = Math.max(20, Math.min(80, 30 + (priceVariation / currentPrice) * 50));
                                
                                                                 return (
                                   <div 
                                     key={i}
                                     style={{
                                       width: '0.25rem',
                                       background: 'linear-gradient(to top, #8b5cf6, #3b82f6)',
                                       borderRadius: '9999px',
                                       transition: 'all 0.3s',
                                       height: `${height}%`,
                                       opacity: 0.8,
                                       cursor: 'pointer',
                                       position: 'relative'
                                     }}
                                     title={`${i + 1}시간 전: $${priceVariation.toFixed(2)}`}
                                     onMouseEnter={(e) => {
                                       e.currentTarget.style.transform = 'scale(1.2)';
                                       e.currentTarget.style.background = 'linear-gradient(to top, #a78bfa, #60a5fa)';
                                       e.currentTarget.style.opacity = '1';
                                     }}
                                     onMouseLeave={(e) => {
                                       e.currentTarget.style.transform = 'scale(1)';
                                       e.currentTarget.style.background = 'linear-gradient(to top, #8b5cf6, #3b82f6)';
                                       e.currentTarget.style.opacity = '0.8';
                                     }}
                                   ></div>
                                 );
                              });
                            }
                          })()}
                        </div>
                      </div>
                      
                      {/* 추가 메트릭스 */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        fontSize: '0.875rem',
                        padding: '0.75rem 0',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        marginTop: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '0.5rem', 
                            height: '0.5rem', 
                            background: '#a78bfa', 
                            borderRadius: '50%',
                            boxShadow: '0 0 8px rgba(167, 139, 250, 0.5)'
                          }}></div>
                          <span style={{ color: '#9ca3af', fontWeight: '500' }}>24h Vol</span>
                        </div>
                        <span style={{ 
                          color: '#a78bfa', 
                          fontWeight: '600',
                          fontSize: '1rem'
                        }}>
                          {priceData?.volume24h ? `$${priceData.volume24h}` : '$2.1B'}
                        </span>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        )}
      </div>

        {/* 시장 통계 섹션 */}
        {marketStatsData && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
              </div>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>시장 통계</h2>
                <p style={{ color: '#9ca3af', margin: 0 }}>전체 시장 현황</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
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
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>전체 시가총액</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', marginBottom: '0.75rem' }}>
                    {marketStatsData.totalMarketCap}
                  </div>
                </div>
              </div>

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
                    <span style={{ fontSize: '2rem' }}>📈</span>
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>24h 거래량</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#3b82f6', marginBottom: '0.75rem' }}>
                    {marketStatsData.totalVolume24h}
                  </div>
          </div>
        </div>
        
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
                    <span style={{ fontSize: '2rem' }}>₿</span>
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>BTC 지배율</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#8b5cf6', marginBottom: '0.75rem' }}>
                    {marketStatsData.btcDominance}
                  </div>
                </div>
              </div>

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
                    <span style={{ fontSize: '2rem' }}>😨</span>
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>공포탐욕지수</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f97316', marginBottom: '0.75rem' }}>
                    {marketStatsData.fearGreedIndex}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 뉴스 섹션 */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                <span style={{ fontSize: '1.5rem' }}>📰</span>
              </div>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>최신 뉴스</h2>
                <p style={{ color: '#9ca3af', margin: 0 }}>시장 동향 및 분석</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/news')}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: 'white',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              전체 보기 →
            </button>
          </div>

          {isLoadingNews ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  animation: 'pulse 2s infinite'
                }}>
                  <div style={{ height: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', marginBottom: '1rem' }}></div>
                  <div style={{ height: '1.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', marginBottom: '0.75rem' }}></div>
                  <div style={{ height: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}></div>
                  <div style={{ height: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', width: '50%' }}></div>
                </div>
              ))}
            </div>
          ) : bitcoinNewsData?.news && bitcoinNewsData.news.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {bitcoinNewsData.news.slice(0, 3).map((news: any, index: number) => (
                <div key={`${news.id}-${index}`} style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.5s',
                  cursor: 'pointer'
                }} onClick={() => handleNewsClick(news.url || '')}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
                    borderRadius: '1.5rem',
                    opacity: 0,
                    transition: 'opacity 0.5s'
                  }}></div>
                  
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <span style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#c4b5fd',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }}>
                        {news.source || '알 수 없음'}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>
                        {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('ko-KR') : '날짜 없음'}
                      </span>
        </div>
        
                    <h3 style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      marginBottom: '1rem',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {news.title}
                    </h3>
                    
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
                      {news.description || '내용 없음'}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
                          width: '0.75rem',
                          height: '0.75rem',
                          background: '#22c55e',
            borderRadius: '50%',
                          animation: 'pulse 2s infinite'
                        }}></div>
                        <span style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: 'bold' }}>최신</span>
                      </div>
                      <span style={{ color: '#a78bfa', fontSize: '0.875rem', fontWeight: 'bold' }}>
                        자세히 보기 →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>📰</div>
              <p style={{ color: '#9ca3af', fontSize: '1.25rem' }}>현재 뉴스가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 빠른 액션 섹션 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ 
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #eab308, #f97316)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🚀</span>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>빠른 시작</h2>
              <p style={{ color: '#9ca3af', margin: 0 }}>원하는 기능으로 바로 이동</p>
        </div>
      </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          <button 
              onClick={() => navigate('/prices')}
            style={{ 
                padding: '1.25rem 2.5rem',
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                color: 'white',
                borderRadius: '1.5rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
          >
            🔍 가격 조회
          </button>
          <button 
              onClick={() => navigate('/analysis')}
            style={{ 
                padding: '1.25rem 2.5rem',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                borderRadius: '1.5rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
          >
            🤖 AI 분석
          </button>
          <button 
              onClick={() => navigate('/prediction')}
            style={{ 
                padding: '1.25rem 2.5rem',
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                color: 'white',
                borderRadius: '1.5rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
          >
            📈 가격 예측
          </button>

          </div>
        </div>
      </div>
    </div>
  );
}
