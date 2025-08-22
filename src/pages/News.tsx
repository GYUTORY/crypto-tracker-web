import { useState } from 'react';
import { NewsCard } from '../components/features/NewsCard';
import { useAllNews, useNewsSearch } from '../hooks/useApi';
// import { NewsItem } from '../types/api';

// 임시로 타입을 직접 정의
interface NewsItem {
  id: string;
  title: string;
  description?: string;
  originalDescription?: string;
  originalTitle?: string;
  content?: string;
  url?: string;
  source?: string;
  publishedAt?: string;
  summary?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  translatedTitle?: string;
  translatedContent?: string;
}

export function News() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSource, setSelectedSource] = useState('');

  // 뉴스 데이터 가져오기
  const { data: allNewsData, isLoading: isLoadingAllNews } = useAllNews({
    limit: 12,
    page: currentPage,
    source: selectedSource || undefined
  });

  // 검색 결과 가져오기
  const { data: searchData, isLoading: isLoadingSearch } = useNewsSearch({
    q: searchQuery,
    limit: 12,
    page: currentPage
  });

  const isSearching = searchQuery.trim().length > 0;
  const newsData = isSearching ? searchData : allNewsData;
  const isLoading = isSearching ? isLoadingSearch : isLoadingAllNews;

  const handleNewsClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const pagination = newsData?.pagination;

  return (
    <div className="container">
      <h1 className="page-title floating">뉴스</h1>

      {/* 검색 및 필터 섹션 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)',
        marginBottom: '2rem'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>🔍</span>
          뉴스 검색
        </h2>
        
        {/* 검색 폼 */}
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="뉴스 검색어를 입력하세요..."
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '1rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.9)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                borderRadius: '1rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              🔍 검색
            </button>
            {isSearching && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="btn btn-secondary"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  borderRadius: '1rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                ✕ 초기화
              </button>
            )}
          </div>
        </form>

        {/* 소스 필터 */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>소스 필터:</span>
          <button
            onClick={() => handleSourceChange('')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              border: '2px solid',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              ...(selectedSource === '' ? {
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderColor: 'rgba(102, 126, 234, 0.5)',
                color: '#667eea'
              } : {
                backgroundColor: 'transparent',
                borderColor: 'rgba(102, 126, 234, 0.2)',
                color: '#6b7280'
              })
            }}
          >
            전체
          </button>
          {['CoinDesk', 'Cointelegraph', 'Bitcoin.com', 'Decrypt', 'The Block'].map((source) => (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                border: '2px solid',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                ...(selectedSource === source ? {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderColor: 'rgba(102, 126, 234, 0.5)',
                  color: '#667eea'
                } : {
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(102, 126, 234, 0.2)',
                  color: '#6b7280'
                })
              }}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h2 className="card-title">
          <span style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>📰</span>
          {isSearching ? `"${searchQuery}" 검색 결과` : '최신 뉴스'}
          {newsData && (
            <span style={{ 
              fontSize: '1rem', 
              color: '#6b7280', 
              fontWeight: '400',
              marginLeft: '1rem'
            }}>
              (총 {newsData.totalCount}개)
            </span>
          )}
        </h2>

        {isLoading ? (
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
              margin: '0 auto 1.5rem'
            }} />
            <p style={{ color: '#6b7280', margin: 0, fontSize: '1.1rem' }}>
              {isSearching ? '검색 결과를 불러오는 중...' : '뉴스를 불러오는 중...'}
            </p>
          </div>
        ) : newsData?.news && newsData.news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
              {newsData.news.map((news: NewsItem, index: number) => (
                <NewsCard 
                  key={`${news.id}-${index}`}
                  news={news}
                  onClick={() => handleNewsClick(news.url || '')}
                />
              ))}
            </div>

            {/* 페이지네이션 */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '2rem 0',
                borderTop: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    background: currentPage === 1 ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    color: currentPage === 1 ? '#9ca3af' : '#667eea',
                    fontWeight: '600',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ← 이전
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(
                    pagination.totalPages - 4,
                    currentPage - 2
                  )) + i;
                  
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        border: '2px solid',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        ...(currentPage === pageNum ? {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          borderColor: 'rgba(102, 126, 234, 0.5)',
                          color: '#667eea'
                        } : {
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(102, 126, 234, 0.2)',
                          color: '#6b7280'
                        })
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    background: currentPage === pagination.totalPages ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    color: currentPage === pagination.totalPages ? '#9ca3af' : '#667eea',
                    fontWeight: '600',
                    cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  다음 →
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '1rem',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📰</div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '1.1rem' }}>
              {isSearching ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '현재 뉴스가 없습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
