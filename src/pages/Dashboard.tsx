import { useNavigate } from 'react-router-dom';
import { PriceCard } from '../components/features/PriceCard';
import { usePopularSymbols, usePrices } from '../hooks/useApi';

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

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container">
      <h1 className="page-title floating">대시보드</h1>
      
      {/* 환영 메시지 */}
      <div className="card" style={{ 
        background: `linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%), url('/images/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        border: '2px solid rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
          zIndex: 0
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            🚀
          </div>
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #fff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            암호화폐 트래커 프로
          </h2>
          <p style={{ 
            fontSize: '1.4rem', 
            color: 'rgba(255, 255, 255, 0.95)',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            실시간 가격, AI 분석, 예측 기능으로 최고의 투자 결정을 내리세요
          </p>
        </div>
      </div>
      
      {/* 인기 코인 섹션 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>🔥</span>
          인기 코인
        </h2>
        {isLoadingPrices ? (
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
            <p style={{ color: '#6b7280', margin: 0 }}>실시간 가격을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-2 grid-cols-4">
            {popularSymbols.map((symbol: string, index: number) => {
              const priceData = pricesData?.prices?.find((p: any) => p.symbol === symbol);
              return (
                <PriceCard 
                  key={symbol}
                  symbol={symbol} 
                  price={priceData?.price?.toString() || '로딩 중...'} 
                  change={priceData?.change || '+0.00%'}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 grid-cols-3">
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'url("/images/crypto-pattern.png")',
            backgroundSize: 'cover',
            opacity: 0.1,
            borderRadius: '50%',
            transform: 'translate(30px, -30px)'
          }} />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: '3.5rem', 
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              📊
            </div>
            <h3 className="card-title">총 코인 수</h3>
            <p className="card-content" style={{ 
              fontSize: '2.8rem', 
              fontWeight: '800', 
              color: '#10b981',
              margin: 0
            }}>
              {popularSymbolsData?.totalSymbols || '2,000+'}
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'url("/images/crypto-pattern.png")',
            backgroundSize: 'cover',
            opacity: 0.1,
            borderRadius: '50%',
            transform: 'translate(30px, -30px)'
          }} />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: '3.5rem', 
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite 1s'
            }}>
              💰
            </div>
            <h3 className="card-title">USDT 페어</h3>
            <p className="card-content" style={{ 
              fontSize: '2.8rem', 
              fontWeight: '800', 
              color: '#3b82f6',
              margin: 0
            }}>
              {popularSymbolsData?.usdtSymbols || '1,500+'}
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          border: '2px solid rgba(168, 85, 247, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'url("/images/crypto-pattern.png")',
            backgroundSize: 'cover',
            opacity: 0.1,
            borderRadius: '50%',
            transform: 'translate(30px, -30px)'
          }} />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: '3.5rem', 
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite 2s'
            }}>
              ⚡
            </div>
            <h3 className="card-title">실시간 업데이트</h3>
            <p className="card-content" style={{ 
              fontSize: '2.8rem', 
              fontWeight: '800', 
              color: '#a855f7',
              margin: 0
            }}>
              활성
            </p>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>⚡</span>
          빠른 액션
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={() => handleQuickAction('/prices')}
            style={{ 
              padding: '1.2rem 2.5rem',
              fontSize: '1.2rem',
              borderRadius: '1.2rem',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
              fontWeight: '700'
            }}
          >
            🔍 가격 조회
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleQuickAction('/analysis')}
            style={{ 
              padding: '1.2rem 2.5rem',
              fontSize: '1.2rem',
              borderRadius: '1.2rem',
              boxShadow: '0 10px 30px rgba(240, 147, 251, 0.4)',
              fontWeight: '700'
            }}
          >
            🤖 AI 분석
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleQuickAction('/prediction')}
            style={{ 
              padding: '1.2rem 2.5rem',
              fontSize: '1.2rem',
              borderRadius: '1.2rem',
              boxShadow: '0 10px 30px rgba(240, 147, 251, 0.4)',
              fontWeight: '700'
            }}
          >
            📈 가격 예측
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleQuickAction('/symbols')}
            style={{ 
              padding: '1.2rem 2.5rem',
              fontSize: '1.2rem',
              borderRadius: '1.2rem',
              boxShadow: '0 10px 30px rgba(240, 147, 251, 0.4)',
              fontWeight: '700'
            }}
          >
            📋 코인 목록
          </button>
        </div>
      </div>
    </div>
  );
}
