import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';

const navItems = [
  { path: '/', label: '대시보드', icon: '🏠' },
  { path: '/prices', label: '가격 조회', icon: '💰' },
  { path: '/charts', label: '차트', icon: '📈' },
  { path: '/ai-recommendations', label: 'AI 추천', icon: '🤖' },
  { path: '/analysis', label: 'AI 분석', icon: '🔍' },
  { path: '/prediction', label: '예측', icon: '🔮' },
  { path: '/news', label: '뉴스', icon: '📰' }
];

export function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-primary)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
            {/* 로고 */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: 'white',
                letterSpacing: '0.1em'
              }}>YGBT</span>
            </Link>

            {/* 데스크톱 네비게이션 */}
            {!isMobile && (
              <nav style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem'
              }}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s ease',
                        textDecoration: 'none',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: isActive 
                          ? 'var(--bg-card)' 
                          : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* 우측 컨트롤 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem'
            }}>
              {/* 인증 상태 표시 */}
              {isAuthenticated ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '0.5rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      background: 'var(--gradient-primary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span style={{ display: isMobile ? 'none' : 'block' }}>
                      {user?.nickname || user?.name || '사용자'}
                    </span>
                  </button>

                  {/* 사용자 메뉴 */}
                  {showUserMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '0.5rem',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '200px',
                      zIndex: 100
                    }}>
                      <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid var(--border-primary)'
                      }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {user?.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {user?.email}
                        </div>
                      </div>
                      <div style={{ padding: '0.5rem' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'var(--status-error)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <ThemeToggle />
              )}

              {/* 모바일 메뉴 버튼 */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    padding: '0.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '0.375rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '2.5rem',
                    minHeight: '2.5rem'
                  }}
                >
                  {isMobileMenuOpen ? '✕' : '☰'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '4rem',
          left: 0,
          right: 0,
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-primary)',
          zIndex: 1000,
          maxHeight: 'calc(100vh - 4rem)',
          overflowY: 'auto',
          backdropFilter: 'blur(16px)',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <nav style={{ padding: '1rem' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg-secondary)' : 'transparent',
                    marginBottom: '0.25rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              ✕
            </button>
            <LoginForm
              onSuccess={() => setShowLoginModal(false)}
              onSwitchToRegister={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {showRegisterModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowRegisterModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                zIndex: 1
              }}
            >
              ✕
            </button>
            <RegisterForm
              onSuccess={() => setShowRegisterModal(false)}
              onSwitchToLogin={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 사용자 메뉴 외부 클릭 시 닫기 */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* 모바일 메뉴 외부 클릭 시 닫기 */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
