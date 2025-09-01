/**
 * 인증 컨텍스트
 * 전역 인증 상태 관리 및 인증 관련 함수 제공
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authManager, { UserData, LoginData, RegisterData } from '../services/authManager';

interface AuthContextType {
  // 상태
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  
  // 함수
  login: (loginData: LoginData) => Promise<boolean>;
  register: (registerData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 초기 인증 상태 확인 중...');
        
        if (authManager.isAuthenticated()) {
          // 토큰 유효성 검사
          const isValid = await authManager.validateToken();
          
          if (isValid) {
            const currentUser = authManager.getCurrentUser();
            setIsAuthenticated(true);
            setUser(currentUser);
            console.log('✅ 인증 상태 확인 완료:', currentUser?.name);
          } else {
            // 토큰이 유효하지 않으면 로그아웃
            authManager.logout();
            setIsAuthenticated(false);
            setUser(null);
            console.log('❌ 토큰이 유효하지 않음 - 로그아웃 처리');
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          console.log('❌ 인증되지 않은 상태');
        }
      } catch (error) {
        console.error('❌ 초기 인증 상태 확인 실패:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * 로그인 함수
   * @param loginData - 로그인 데이터
   * @returns 성공 여부
   */
  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authManager.login(loginData);
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        console.log('✅ 로그인 성공:', response.data.user.name);
        return true;
      } else {
        console.error('❌ 로그인 실패:', response.message);
        return false;
      }
    } catch (error) {
      console.error('❌ 로그인 요청 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 회원가입 함수
   * @param registerData - 회원가입 데이터
   * @returns 성공 여부
   */
  const register = async (registerData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authManager.register(registerData);
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        console.log('✅ 회원가입 성공:', response.data.user.name);
        return true;
      } else {
        console.error('❌ 회원가입 실패:', response.message);
        return false;
      }
    } catch (error) {
      console.error('❌ 회원가입 요청 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    authManager.logout();
    setIsAuthenticated(false);
    setUser(null);
    console.log('🚪 로그아웃 완료');
  };

  /**
   * 사용자 정보 새로고침
   */
  const refreshUser = async () => {
    try {
      if (authManager.isAuthenticated()) {
        const updatedUser = await authManager.getProfile();
        if (updatedUser) {
          setUser(updatedUser);
          console.log('✅ 사용자 정보 새로고침 완료');
        }
      }
    } catch (error) {
      console.error('❌ 사용자 정보 새로고침 실패:', error);
      // 프로필 조회 실패 시 로그아웃 처리
      logout();
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 인증 컨텍스트 사용 훅
 * @returns 인증 컨텍스트 값
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


