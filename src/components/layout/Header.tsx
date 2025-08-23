import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '대시보드', icon: '🏠' },
  { path: '/prices', label: '가격 조회', icon: '💰' },
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
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          {/* 로고 */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₿</span>
            </div>
            <div style={{ display: 'block' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ffffff, #e0e7ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                Crypto Tracker Pro
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>실시간 암호화폐 트래커</p>
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
                    color: isActive ? 'white' : '#d1d5db',
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
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              cursor: 'pointer'
            }}>
              <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* 우측 액션 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '0.75rem'
            }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                background: '#22c55e',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <span style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: '500' }}>실시간</span>
            </div>
            
            <button style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              color: 'white',
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
