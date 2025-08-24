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
          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
          : 'linear-gradient(135deg, #1e293b, #334155)',
        opacity: 0.1,
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
          // 라이트 모드 아이콘 (태양)
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.5rem',
            height: '1.5rem',
            position: 'relative'
          }}>
            {/* 태양 빛 */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)',
              animation: 'pulse 2s infinite'
            }} />
            {/* 태양 중심 */}
            <div style={{
              width: '0.75rem',
              height: '0.75rem',
              borderRadius: '50%',
              background: '#fbbf24',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
            }} />
            {/* 태양 빛선들 */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: '0.5rem',
                  background: '#fbbf24',
                  borderRadius: '1px',
                  transform: `rotate(${i * 45}deg) translateY(-0.75rem)`,
                  opacity: 0.7
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
