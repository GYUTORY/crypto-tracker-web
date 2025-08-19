import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { path: '/', label: '대시보드' },
    { path: '/prices', label: '가격 조회' },
    { path: '/analysis', label: 'AI 분석' },
    { path: '/prediction', label: '예측' },
    { path: '/symbols', label: '코인 목록' }
  ];

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 로고 */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.8rem',
            textDecoration: 'none',
            fontSize: '1.8rem',
            fontWeight: '800',
            color: 'white',
            background: 'linear-gradient(135deg, #fff 0%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.textShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #f7931a, #ffd700)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 12px rgba(247, 147, 26, 0.4)'
          }}>
            ₿
          </div>
          <span>Crypto Tracker Pro</span>
        </Link>
        
        {/* 데스크톱 네비게이션 */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                style={{
                  color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.75rem',
                  transition: 'all 0.3s ease',
                  background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  boxShadow: location.pathname === item.path ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 모바일 메뉴 버튼 */}
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ☰
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.3s ease',
                    background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    display: 'block',
                    fontSize: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
