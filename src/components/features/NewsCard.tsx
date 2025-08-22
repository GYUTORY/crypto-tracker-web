// import { NewsItem } from '../../types/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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

interface NewsCardProps {
  news: NewsItem;
  onClick?: () => void;
}

export function NewsCard({ news, onClick }: NewsCardProps) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentText = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '긍정적';
      case 'negative':
        return '부정적';
      default:
        return '중립적';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '날짜 없음';
    try {
      return format(new Date(dateString), 'MM월 dd일 HH:mm', { locale: ko });
    } catch {
      return '날짜 없음';
    }
  };

  const handleClick = () => {
    if (onClick && news.url) {
      onClick();
    } else if (news.url) {
      window.open(news.url, '_blank');
    }
  };

  return (
    <div 
      className="news-card"
      onClick={handleClick}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        border: '2px solid rgba(102, 126, 234, 0.15)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        cursor: (onClick || news.url) ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        if (onClick || news.url) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || news.url) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.15)';
        }
      }}
    >
      {/* 배경 패턴 */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: 'url("/images/crypto-pattern.png")',
        backgroundSize: 'cover',
        opacity: 0.05,
        borderRadius: '50%',
        transform: 'translate(20px, -20px)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              ...getSentimentColor(news.sentiment).split(' ').reduce((acc, className) => {
                if (className.startsWith('text-')) {
                  acc.color = className.replace('text-', '#');
                } else if (className.startsWith('bg-')) {
                  acc.backgroundColor = className.replace('bg-', '#');
                }
                return acc;
              }, {} as any)
            }}>
              {getSentimentText(news.sentiment)}
            </span>
          </div>
          <span style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {formatDate(news.publishedAt)}
          </span>
        </div>

        {/* 제목 */}
        <h3 style={{ 
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.75rem',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {news.translatedTitle || news.title}
        </h3>

        {/* 요약 */}
        <p style={{ 
          fontSize: '0.95rem',
          color: '#4b5563',
          lineHeight: '1.5',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {news.description || news.summary || news.translatedContent || news.content || '내용 없음'}
        </p>

        {/* 소스 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 'auto'
        }}>
          <span style={{ 
            fontSize: '0.875rem',
            color: '#667eea',
            fontWeight: '600',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '0.75rem'
          }}>
            📰 {news.source || '알 수 없음'}
          </span>
          
          {(onClick || news.url) && (
            <span style={{ 
              fontSize: '0.875rem',
              color: '#667eea',
              fontWeight: '600'
            }}>
              자세히 보기 →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
