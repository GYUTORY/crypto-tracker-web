/**
 * 대시보드 관리자 클래스
 * 대시보드 조회, 관심목록 관리, 사용자 설정 등을 담당
 */

import authManager from './authManager';

export interface WatchlistItem {
  symbol: string;
  addedAt: string;
  currentPrice?: number;
  change24h?: number;
}

export interface NotificationSettings {
  priceAlerts: boolean;
  newsUpdates: boolean;
  recommendations: boolean;
}

export interface LayoutSettings {
  showPriceChart: boolean;
  showTechnicalIndicators: boolean;
  showNews: boolean;
  showRecommendations: boolean;
}

export interface DashboardData {
  id: string;
  userId: string;
  watchlist: WatchlistItem[];
  preferredTimeframe: string;
  theme: 'light' | 'dark' | 'auto';
  notificationSettings: NotificationSettings;
  layoutSettings: LayoutSettings;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
}

export interface WatchlistResponse {
  success: boolean;
  data: WatchlistItem[];
  message?: string;
}

export interface SettingsResponse {
  success: boolean;
  data: any;
  message?: string;
}

class DashboardManager {
  private baseUrl: string;
  private dashboard: DashboardData | null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    this.dashboard = null;
  }

  /**
   * 대시보드 조회
   * @returns 대시보드 데이터
   */
  async getDashboard(): Promise<DashboardData | null> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard`, {
        headers: authManager.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DashboardResponse = await response.json();
      
      if (data.success) {
        this.dashboard = data.data;
        console.log('📊 대시보드 조회 성공:', this.dashboard.watchlist.length, '개 관심목록');
        return this.dashboard;
      }
      
      return null;
    } catch (error) {
      console.error('❌ 대시보드 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 대시보드 데이터 반환
   * @returns 대시보드 데이터 또는 null
   */
  getCurrentDashboard(): DashboardData | null {
    return this.dashboard;
  }

  /**
   * 관심목록 조회
   * @returns 관심목록 데이터
   */
  async getWatchlist(): Promise<WatchlistItem[]> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard/watchlist`, {
        headers: authManager.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WatchlistResponse = await response.json();
      
      if (data.success) {
        console.log('📋 관심목록 조회:', data.data.length, '개');
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ 관심목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 관심목록에 추가
   * @param symbol - 코인 심볼
   * @returns 성공 여부
   */
  async addToWatchlist(symbol: string): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard/watchlist`, {
        method: 'POST',
        headers: authManager.getAuthHeaders(),
        body: JSON.stringify({ symbol })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ 관심목록 추가:', symbol);
        // 대시보드 새로고침
        await this.getDashboard();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 관심목록 추가 실패:', error);
      throw error;
    }
  }

  /**
   * 관심목록에서 제거
   * @param symbol - 코인 심볼
   * @returns 성공 여부
   */
  async removeFromWatchlist(symbol: string): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard/watchlist/${symbol}`, {
        method: 'DELETE',
        headers: authManager.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('❌ 관심목록 제거:', symbol);
        // 대시보드 새로고침
        await this.getDashboard();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 관심목록 제거 실패:', error);
      throw error;
    }
  }

  /**
   * 테마 설정 업데이트
   * @param theme - 테마 설정
   * @returns 성공 여부
   */
  async updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard/settings/theme`, {
        method: 'PUT',
        headers: authManager.getAuthHeaders(),
        body: JSON.stringify({ theme })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SettingsResponse = await response.json();
      
      if (data.success) {
        console.log('✅ 테마 설정 업데이트:', theme);
        // 대시보드 새로고침
        await this.getDashboard();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 테마 설정 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 차트 타임프레임 설정 업데이트
   * @param timeframe - 타임프레임 설정
   * @returns 성공 여부
   */
  async updateTimeframe(timeframe: string): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard/settings/timeframe`, {
        method: 'PUT',
        headers: authManager.getAuthHeaders(),
        body: JSON.stringify({ timeframe })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SettingsResponse = await response.json();
      
      if (data.success) {
        console.log('✅ 타임프레임 설정 업데이트:', timeframe);
        // 대시보드 새로고침
        await this.getDashboard();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 타임프레임 설정 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 알림 설정 업데이트
   * @param notificationSettings - 알림 설정
   * @returns 성공 여부
   */
  async updateNotificationSettings(notificationSettings: NotificationSettings): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard/settings/notifications`, {
        method: 'PUT',
        headers: authManager.getAuthHeaders(),
        body: JSON.stringify({ notificationSettings })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SettingsResponse = await response.json();
      
      if (data.success) {
        console.log('✅ 알림 설정 업데이트:', notificationSettings);
        // 대시보드 새로고침
        await this.getDashboard();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 알림 설정 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 레이아웃 설정 업데이트
   * @param layoutSettings - 레이아웃 설정
   * @returns 성공 여부
   */
  async updateLayoutSettings(layoutSettings: LayoutSettings): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(`${this.baseUrl}/dashboard/settings/layout`, {
        method: 'PUT',
        headers: authManager.getAuthHeaders(),
        body: JSON.stringify({ layoutSettings })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SettingsResponse = await response.json();
      
      if (data.success) {
        console.log('✅ 레이아웃 설정 업데이트:', layoutSettings);
        // 대시보드 새로고침
        await this.getDashboard();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 레이아웃 설정 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 관심목록에 있는지 확인
   * @param symbol - 코인 심볼
   * @returns 관심목록 포함 여부
   */
  isInWatchlist(symbol: string): boolean {
    if (!this.dashboard) {
      return false;
    }
    return this.dashboard.watchlist.some(item => item.symbol === symbol);
  }

  /**
   * 관심목록 개수 반환
   * @returns 관심목록 개수
   */
  getWatchlistCount(): number {
    return this.dashboard?.watchlist.length || 0;
  }

  /**
   * 현재 테마 반환
   * @returns 현재 테마
   */
  getCurrentTheme(): 'light' | 'dark' | 'auto' {
    return this.dashboard?.theme || 'auto';
  }

  /**
   * 현재 타임프레임 반환
   * @returns 현재 타임프레임
   */
  getCurrentTimeframe(): string {
    return this.dashboard?.preferredTimeframe || '1h';
  }

  /**
   * 현재 알림 설정 반환
   * @returns 현재 알림 설정
   */
  getCurrentNotificationSettings(): NotificationSettings {
    return this.dashboard?.notificationSettings || {
      priceAlerts: true,
      newsUpdates: true,
      recommendations: true
    };
  }

  /**
   * 현재 레이아웃 설정 반환
   * @returns 현재 레이아웃 설정
   */
  getCurrentLayoutSettings(): LayoutSettings {
    return this.dashboard?.layoutSettings || {
      showPriceChart: true,
      showTechnicalIndicators: true,
      showNews: true,
      showRecommendations: true
    };
  }
}

// 싱글톤 인스턴스 생성
export default new DashboardManager();


