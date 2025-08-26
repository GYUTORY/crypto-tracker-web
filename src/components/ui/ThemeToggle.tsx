import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-primary)',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-card-hover)';
        e.currentTarget.style.borderColor = 'var(--border-secondary)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-card)';
        e.currentTarget.style.borderColor = 'var(--border-primary)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {/* 배경 그라데이션 효과 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
          : 'linear-gradient(135deg, #1e293b, #334155)',
        opacity: theme === 'dark' ? 0.08 : 0.1,
        transition: 'opacity 0.3s ease'
      }} />
      
      {/* 아이콘 */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        fontSize: '1.25rem',
        transition: 'transform 0.3s ease'
      }}>
        {theme === 'dark' ? (
          // 라이트 모드 아이콘 (태양) - 미니멀한 디자인
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.25rem',
            height: '1.25rem',
            position: 'relative'
          }}>
            {/* 태양 중심 */}
            <div style={{
              width: '0.875rem',
              height: '0.875rem',
              borderRadius: '50%',
              background: '#f59e0b',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.3)'
            }} />
            {/* 태양 빛선들 - 더 얇고 세련되게 */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '0.375rem',
                  background: '#f59e0b',
                  borderRadius: '0.5px',
                  transform: `rotate(${i * 60}deg) translateY(-0.625rem)`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>
                 ) : (
           // 다크 모드 아이콘 (달)
           <div style={{
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             width: '1.5rem',
             height: '1.5rem',
             position: 'relative'
           }}>
             {/* 달 배경 */}
             <div style={{
               width: '1.25rem',
               height: '1.25rem',
               borderRadius: '50%',
               background: '#334155',
               boxShadow: '0 0 10px rgba(51, 65, 85, 0.5)',
               position: 'relative'
             }} />
             {/* 달의 그림자 부분 */}
             <div style={{
               position: 'absolute',
               width: '0.75rem',
               height: '0.75rem',
               borderRadius: '50%',
               background: 'var(--bg-primary)',
               top: '0.125rem',
               left: '0.125rem',
               transform: 'translateX(-0.125rem)'
             }} />
             {/* 별들 */}
             {[...Array(3)].map((_, i) => (
               <div
                 key={i}
                 style={{
                   position: 'absolute',
                   width: '2px',
                   height: '2px',
                   background: '#fbbf24',
                   borderRadius: '50%',
                   top: `${0.25 + i * 0.25}rem`,
                   left: `${0.5 + i * 0.25}rem`,
                   opacity: 0.8,
                   animation: `pulse ${1.5 + i * 0.5}s infinite`
                 }}
               />
             ))}
           </div>
         )}
      </div>
    </button>
  );
};
