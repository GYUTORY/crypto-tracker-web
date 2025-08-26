import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * 테마 타입 정의
 * 다크 모드와 라이트 모드를 지원합니다
 */
type Theme = 'dark' | 'light';

/**
 * 테마 컨텍스트 타입 정의
 * 테마 상태와 테마 변경 함수들을 포함합니다
 */
interface ThemeContextType {
  theme: Theme;                    // 현재 테마 상태
  toggleTheme: () => void;         // 테마 토글 함수
  setTheme: (theme: Theme) => void; // 특정 테마로 설정하는 함수
}

/**
 * 테마 컨텍스트 생성
 * 기본값은 undefined로 설정하여 Provider 외부에서 사용 시 에러를 발생시킵니다
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 테마 컨텍스트 사용을 위한 커스텀 훅
 * 
 * @returns ThemeContextType - 테마 상태와 변경 함수들
 * @throws Error - Provider 외부에서 사용 시 에러 발생
 * 
 * 사용 예시:
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * 테마 프로바이더 컴포넌트 Props 타입
 */
interface ThemeProviderProps {
  children: React.ReactNode; // 자식 컴포넌트들
}

/**
 * 테마 프로바이더 컴포넌트
 * 
 * 기능:
 * - 테마 상태 관리 (다크/라이트 모드)
 * - 로컬 스토리지에 테마 설정 저장
 * - 시스템 테마 자동 감지
 * - 테마 변경 시 DOM에 자동 적용
 * 
 * 테마 우선순위:
 * 1. 로컬 스토리지에 저장된 테마
 * 2. 시스템 테마 (prefers-color-scheme)
 * 3. 기본값 (다크 모드)
 * 
 * @param children - 테마 컨텍스트를 사용할 자식 컴포넌트들
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  /**
   * 테마 상태 초기화
   * 로컬 스토리지 → 시스템 테마 → 기본값 순으로 설정
   */
  const [theme, setThemeState] = useState<Theme>(() => {
    // 로컬 스토리지에서 테마 가져오기
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // 시스템 테마 감지 (prefers-color-scheme 미디어 쿼리 사용)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    // 기본값: 다크 모드
    return 'dark';
  });

  /**
   * 테마 설정 함수
   * 상태 업데이트, 로컬 스토리지 저장, DOM 적용을 모두 수행합니다
   * 
   * @param newTheme - 설정할 테마 ('dark' | 'light')
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  /**
   * 테마 토글 함수
   * 현재 테마를 반전시킵니다 (다크 ↔ 라이트)
   */
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  /**
   * 컴포넌트 마운트 시 초기 테마 적용 및 시스템 테마 변경 감지 설정
   */
  useEffect(() => {
    // 초기 테마를 DOM에 적용
    document.documentElement.setAttribute('data-theme', theme);
    
    // 시스템 테마 변경 감지 (사용자가 OS 테마를 변경할 때)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    /**
     * 시스템 테마 변경 핸들러
     * 로컬 스토리지에 저장된 테마가 없을 때만 시스템 테마를 따라갑니다
     */
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
