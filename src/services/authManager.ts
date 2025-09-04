/**
 * 인증 관리자 클래스
 * 사용자 로그인, 로그아웃, 토큰 관리 등을 담당
 */

import type { UserData, AuthResponse, LoginData, RegisterData } from '../types/auth';

class AuthManager {
  private token: string | null;
  private user: UserData | null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    this.token = localStorage.getItem('auth_token');
    this.user = JSON.parse(localStorage.getItem('user_data') || 'null');
  }

  /**
   * 사용자 로그인
   * @param loginData - 로그인 데이터
   * @returns 인증 응답
   */
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 로그인 시도:', loginData.email);
      
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data: AuthResponse = await response.json();
      
      if (data.success) {
        this.token = data.data.token;
        this.user = data.data.user;
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));
        
        console.log('✅ 로그인 성공:', this.user.name);
      } else {
        console.error('❌ 로그인 실패:', data.message);
      }
      
      return data;
    } catch (error) {
      console.error('❌ 로그인 요청 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자 회원가입
   * @param registerData - 회원가입 데이터
   * @returns 인증 응답
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 회원가입 시도:', registerData.email);
      
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      const data: AuthResponse = await response.json();
      
      if (data.success) {
        this.token = data.data.token;
        this.user = data.data.user;
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));
        
        console.log('✅ 회원가입 성공:', this.user.name);
      } else {
        console.error('❌ 회원가입 실패:', data.message);
      }
      
      return data;
    } catch (error) {
      console.error('❌ 회원가입 요청 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자 로그아웃
   */
  logout(): void {
    console.log('🚪 로그아웃');
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  /**
   * 인증 상태 확인
   * @returns 인증 여부
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * 현재 사용자 정보 조회
   * @returns 사용자 데이터 또는 null
   */
  getCurrentUser(): UserData | null {
    return this.user;
  }

  /**
   * 인증 헤더 반환
   * @returns 인증 헤더 객체
   */
  getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * 프로필 정보 조회
   * @returns 사용자 프로필 데이터
   */
  async getProfile(): Promise<UserData | null> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('토큰이 만료되었습니다');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        this.user = data.data;
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return this.user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ 프로필 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 프로필 정보 업데이트
   * @param profileData - 업데이트할 프로필 데이터
   * @returns 업데이트된 사용자 데이터
   */
  async updateProfile(profileData: Partial<UserData>): Promise<UserData | null> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        this.user = data.data;
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return this.user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ 프로필 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 토큰 유효성 검사
   * @returns 토큰 유효성 여부
   */
  async validateToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }

      const response = await fetch(`${this.baseUrl}/auth/validate`, {
        headers: this.getAuthHeaders()
      });

      return response.ok;
    } catch (error) {
      console.error('❌ 토큰 검증 실패:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성
export default new AuthManager();

