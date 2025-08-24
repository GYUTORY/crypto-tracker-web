import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

const navItems = [
  { path: '/', label: '대시보드', icon: '🏠' },
  { path: '/prices', label: '가격 조회', icon: '💰' },
  { path: '/charts', label: '차트', icon: '📈' },
  { path: '/analysis', label: 'AI 분석', icon: '🤖' },
  { path: '/prediction', label: '예측', icon: '🔮' },
  { path: '/news', label: '뉴스', icon: '📰' }
];

export function Header() {
  const location = useLocation();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-primary)',
      padding: '1rem 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          {/* 로고 */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'var(--gradient-secondary)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₿</span>
            </div>
            <div style={{ display: 'block' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                Crypto Tracker Pro
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>실시간 암호화폐 트래커</p>
            </div>
          </Link>

          {/* 네비게이션 */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.75rem',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div style={{ display: 'none' }}>
            <button style={{
              padding: '0.5rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* 우측 액션 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* 테마 토글 버튼 */}
            <ThemeToggle />
            
            <button style={{
              padding: '0.5rem 1rem',
              background: 'var(--gradient-secondary)',
              color: 'var(--text-inverse)',
              borderRadius: '0.75rem',
              fontWeight: '500',
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer'
            }}>
              시작하기
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
