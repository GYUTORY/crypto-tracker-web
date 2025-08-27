import { useState } from 'react';
import { NewsCard } from '../components/features/NewsCard';
import { useAllNews, useNewsSearch } from '../hooks/useApi';

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

function News() {
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

  // 소스별 색상 매핑
  const getSourceColor = (source: string) => {
    const colorMap: { [key: string]: string } = {
      'CoinDesk': 'var(--source-coindesk)',
      'Cointelegraph': 'var(--source-cointelegraph)',
      'Bitcoin.com': 'var(--source-bitcoin)',
      'Decrypt': 'var(--source-decrypt)',
      'The Block': 'var(--source-block)'
    };
    return colorMap[source] || 'var(--text-muted)';
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
              background: 'var(--status-success)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ color: 'var(--status-success)', fontSize: '0.875rem', fontWeight: '500' }}>실시간 뉴스 업데이트</span>
          </div>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            암호화폐 뉴스
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: 'var(--text-tertiary)',
            maxWidth: '48rem',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            최신 암호화폐 시장 동향과 분석을 <span style={{ color: 'var(--text-accent)', fontWeight: '600' }}>실시간으로 확인</span>하세요
          </p>
        </div>

      {/* 검색 및 필터 섹션 */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'var(--gradient-secondary)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>뉴스 검색 및 필터</h2>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>원하는 뉴스를 검색하고 소스별로 필터링하세요</p>
            </div>
          </div>

          {/* 검색 카드 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem'
      }}>
        {/* 검색 폼 */}
            <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="뉴스 검색어를 입력하세요..."
              style={{
                flex: 1,
                    minWidth: '300px',
                padding: '1rem 1.5rem',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '1rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--text-primary)'
              }}
              onFocus={(e) => {
                    e.target.style.borderColor = 'var(--border-focus)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              style={{
                padding: '1rem 2rem',
                    background: 'var(--gradient-secondary)',
                    color: 'white',
                    borderRadius: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🔍</span>
                  검색
            </button>
            {isSearching && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '1rem 2rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--status-error)',
                      borderRadius: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                      border: '2px solid rgba(239, 68, 68, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>✕</span>
                    초기화
              </button>
            )}
          </div>
        </form>

        {/* 소스 필터 */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>📰</span>
                소스 필터:
              </span>
          <button
            onClick={() => handleSourceChange('')}
            style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '1rem',
              border: '2px solid',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
                  cursor: 'pointer',
              ...(selectedSource === '' ? {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    color: 'var(--text-accent)'
                  } : {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#d1d5db'
                  })
                }}
                onMouseEnter={(e) => {
                  if (selectedSource !== '') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSource !== '') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
          >
            전체
          </button>
          {['CoinDesk', 'Cointelegraph', 'Bitcoin.com', 'Decrypt', 'The Block'].map((source) => (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '1rem',
                border: '2px solid',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                    cursor: 'pointer',
                ...(selectedSource === source ? {
                      backgroundColor: `${getSourceColor(source)}20`,
                      borderColor: getSourceColor(source),
                      color: getSourceColor(source)
                    } : {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#d1d5db'
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSource !== source) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSource !== source) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
            >
              {source}
            </button>
          ))}
            </div>
        </div>
      </div>

        {/* 뉴스 목록 섹션 */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'var(--gradient-accent)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📰</span>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                {isSearching ? `"${searchQuery}" 검색 결과` : '최신 뉴스'}
        </h2>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>
                {newsData && `총 ${newsData.totalCount}개의 뉴스`}
              </p>
            </div>
          </div>

          {/* 뉴스 카드 그리드 */}
        {isLoading ? (
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
                border: '4px solid rgba(59, 130, 246, 0.3)',
                borderTop: '4px solid var(--text-accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
                margin: '0 auto 2rem'
              }} />
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                뉴스 로딩 중...
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '1.125rem' }}>
                {isSearching ? '검색 결과를 불러오는 중...' : '최신 뉴스를 불러오는 중...'}
            </p>
          </div>
        ) : newsData?.news && newsData.news.length > 0 ? (
          <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                gap: '2rem', 
                marginBottom: '3rem' 
              }}>
              {newsData.news.map((news: NewsItem, index: number) => (
                  <div
                  key={`${news.id}-${index}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '1.5rem',
                      padding: '2rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.5s',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  onClick={() => handleNewsClick(news.url || '')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    {/* 배경 그라데이션 효과 */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${getSourceColor(news.source || '')}, ${getSourceColor(news.source || '')}80)`,
                      borderRadius: '1.5rem 1.5rem 0 0'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      {/* 소스 및 날짜 */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '1rem' 
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: `${getSourceColor(news.source || '')}20`,
                          borderRadius: '0.75rem',
                          border: `1px solid ${getSourceColor(news.source || '')}40`
                        }}>
                          <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            background: getSourceColor(news.source || ''),
                            borderRadius: '50%'
                          }} />
                          <span style={{ 
                            color: getSourceColor(news.source || ''), 
                            fontSize: '0.875rem', 
                            fontWeight: '600' 
                          }}>
                            {news.source || '알 수 없음'}
                          </span>
                        </div>
                        <span style={{ 
                          color: 'var(--text-tertiary)', 
                          fontSize: '0.875rem', 
                          fontWeight: '500' 
                        }}>
                          {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('ko-KR') : '날짜 없음'}
                        </span>
                      </div>

                      {/* 제목 */}
                      <h3 style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {news.title}
                      </h3>

                      {/* 설명 */}
                      <p style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {news.description || news.summary || '내용 없음'}
                      </p>

                      {/* 자세히 보기 버튼 */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '0.75rem',
                            height: '0.75rem',
                            background: 'var(--status-success)',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                          }} />
                          <span style={{ color: 'var(--status-success)', fontSize: '0.875rem', fontWeight: 'bold' }}>최신</span>
                        </div>
                        <span style={{ 
                          color: 'var(--text-accent)', 
                          fontSize: '0.875rem', 
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          자세히 보기
                          <span style={{ fontSize: '1rem' }}>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                  gap: '0.75rem',
                  flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.75rem 1.5rem',
                      borderRadius: '1rem',
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      background: currentPage === 1 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                      color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-accent)',
                    fontWeight: '600',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                  }}
                >
                    <span>←</span>
                    이전
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
                          borderRadius: '1rem',
                        border: '2px solid',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        ...(currentPage === pageNum ? {
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            borderColor: 'rgba(59, 130, 246, 0.5)',
                            color: 'var(--text-accent)'
                          } : {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#d1d5db'
                          })
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== pageNum) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage !== pageNum) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          }
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
                      borderRadius: '1rem',
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      background: currentPage === pagination.totalPages ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                      color: currentPage === pagination.totalPages ? 'var(--text-tertiary)' : 'var(--text-accent)',
                    fontWeight: '600',
                    cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                  }}
                >
                    다음
                    <span>→</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📰</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                뉴스를 찾을 수 없습니다
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '1.125rem' }}>
              {isSearching ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '현재 뉴스가 없습니다.'}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default News;
