import { useState } from 'react';
import { useSymbols, useUsdtSymbols } from '../hooks/useApi';

export function Symbols() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'usdt'>('all');

  // 전체 심볼과 USDT 심볼 데이터
  const { data: allSymbolsData, isLoading: isLoadingAll, error: allError } = useSymbols();
  const { data: usdtSymbolsData, isLoading: isLoadingUsdt, error: usdtError } = useUsdtSymbols();

  // 현재 선택된 데이터
  const currentData = filterType === 'all' ? allSymbolsData : usdtSymbolsData;
  const isLoading = filterType === 'all' ? isLoadingAll : isLoadingUsdt;
  const error = filterType === 'all' ? allError : usdtError;

  // 검색 필터링
  const filteredSymbols = currentData?.symbols?.filter(symbol => 
    symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container">
      <h1 className="page-title floating">코인 목록</h1>
      
      {/* 필터 및 검색 섹션 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem' }}>📋</span>
          거래 가능한 코인
        </h2>
        
        {/* 필터 버튼 */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('all')}
            style={{ 
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '0.8rem',
              boxShadow: filterType === 'all' ? '0 6px 20px rgba(102, 126, 234, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            🌐 전체 코인
          </button>
          <button 
            className={`btn ${filterType === 'usdt' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('usdt')}
            style={{ 
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '0.8rem',
              boxShadow: filterType === 'usdt' ? '0 6px 20px rgba(102, 126, 234, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            💰 USDT 페어
          </button>
        </div>

        {/* 검색 입력 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${filterType === 'all' ? '전체' : 'USDT'} 코인 검색...`}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '1rem',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
          />
        </div>

        {/* 통계 정보 */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '0.8rem',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
              {currentData?.totalSymbols || 0}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>총 코인 수</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
              {filteredSymbols.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>검색 결과</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
              {filterType === 'usdt' ? (currentData?.usdtSymbols || 0) : 'N/A'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>USDT 페어</div>
          </div>
        </div>
      </div>

      {/* 코인 목록 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h3 className="card-title">
          <span style={{ marginRight: '0.5rem' }}>📊</span>
          {filterType === 'all' ? '전체' : 'USDT'} 코인 목록
        </h3>
        
        {isLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '1rem',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(102, 126, 234, 0.3)',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: '#6b7280', margin: 0, fontSize: '1.1rem' }}>
              {filterType === 'all' ? '전체' : 'USDT'} 코인 목록을 불러오는 중...
            </p>
          </div>
        )}
        
        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'rgba(239, 68, 68, 0.05)',
            borderRadius: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444'
          }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              ❌ 코인 목록을 불러올 수 없습니다
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
              잠시 후 다시 시도해주세요
            </p>
          </div>
        )}
        
        {!isLoading && !error && (
          <div>
            {filteredSymbols.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                background: 'rgba(156, 163, 175, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                color: '#6b7280'
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>
                  🔍 검색 결과가 없습니다
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                  다른 검색어를 시도해보세요
                </p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
                maxHeight: '600px',
                overflowY: 'auto',
                padding: '0.5rem'
              }}>
                {filteredSymbols.slice(0, 100).map((symbol, index) => (
                  <div 
                    key={symbol}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '0.8rem',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      animation: `fadeInUp 0.6s ease-out ${index * 0.02}s both`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.1)';
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: 'white',
                        fontWeight: '700'
                      }}>
                        {symbol.charAt(0)}
                      </div>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#374151',
                        fontSize: '1rem'
                      }}>
                        {symbol}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <span>💱</span>
                      {symbol.includes('USDT') ? 'USDT 페어' : '거래 가능'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredSymbols.length > 100 && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '0.8rem',
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                  📄 총 {filteredSymbols.length}개 중 상위 100개만 표시됩니다.
                  <br />
                  더 정확한 검색을 위해 검색어를 입력해주세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
