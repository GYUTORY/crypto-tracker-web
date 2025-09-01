/**
 * 알림 관리자 클래스
 * 알림 조회, 읽음 처리, 푸시 알림 구독 등을 담당
 */

import authManager from './authManager';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'PRICE_ALERT' | 'NEWS_UPDATE' | 'RECOMMENDATION' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  data: number;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class NotificationManager {
  private baseUrl: string;
  private unreadCount: number;
  private pollingInterval: NodeJS.Timeout | null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    this.unreadCount = 0;
    this.pollingInterval = null;
  }

  /**
   * 알림 목록 조회
   * @param page - 페이지 번호 (기본값: 1)
   * @param limit - 페이지당 알림 수 (기본값: 20)
   * @param isRead - 읽음 여부 필터 (선택사항)
   * @returns 알림 목록 응답
   */
  async getNotifications(
    page: number = 1, 
    limit: number = 20, 
    isRead?: boolean
  ): Promise<NotificationResponse> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (isRead !== undefined) {
        params.append('isRead', isRead.toString());
      }

      const response = await fetch(
        `${this.baseUrl}/notification?${params.toString()}`,
        { headers: authManager.getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NotificationResponse = await response.json();
      console.log('📢 알림 목록 조회:', data.data.notifications.length, '개');
      
      return data;
    } catch (error) {
      console.error('❌ 알림 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 알림 읽음 처리
   * @param notificationId - 알림 ID
   * @returns 성공 여부
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(
        `${this.baseUrl}/notification/${notificationId}/read`,
        {
          method: 'PUT',
          headers: authManager.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ 알림 읽음 처리:', notificationId);
      
      // 읽지 않은 알림 개수 업데이트
      await this.getUnreadCount();
      
      return data.success;
    } catch (error) {
      console.error('❌ 알림 읽음 처리 실패:', error);
      throw error;
    }
  }

  /**
   * 모든 알림 읽음 처리
   * @returns 성공 여부
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(
        `${this.baseUrl}/notification/read-all`,
        {
          method: 'PUT',
          headers: authManager.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ 모든 알림 읽음 처리');
      
      // 읽지 않은 알림 개수 업데이트
      await this.getUnreadCount();
      
      return data.success;
    } catch (error) {
      console.error('❌ 모든 알림 읽음 처리 실패:', error);
      throw error;
    }
  }

  /**
   * 읽지 않은 알림 개수 조회
   * @returns 읽지 않은 알림 개수
   */
  async getUnreadCount(): Promise<number> {
    try {
      if (!authManager.isAuthenticated()) {
        return 0;
      }

      const response = await fetch(
        `${this.baseUrl}/notification/unread-count`,
        { headers: authManager.getAuthHeaders() }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UnreadCountResponse = await response.json();
      this.unreadCount = data.data;
      
      console.log('📊 읽지 않은 알림:', this.unreadCount, '개');
      
      return this.unreadCount;
    } catch (error) {
      console.error('❌ 읽지 않은 알림 개수 조회 실패:', error);
      return 0;
    }
  }

  /**
   * 현재 읽지 않은 알림 개수 반환
   * @returns 읽지 않은 알림 개수
   */
  getCurrentUnreadCount(): number {
    return this.unreadCount;
  }

  /**
   * 푸시 알림 구독
   * @param subscription - 푸시 구독 정보
   * @returns 성공 여부
   */
  async subscribeToPushNotifications(subscription: PushSubscription): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(
        `${this.baseUrl}/notification/push/subscribe`,
        {
          method: 'POST',
          headers: authManager.getAuthHeaders(),
          body: JSON.stringify(subscription)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ 푸시 알림 구독 성공');
      
      return data.success;
    } catch (error) {
      console.error('❌ 푸시 알림 구독 실패:', error);
      throw error;
    }
  }

  /**
   * 푸시 알림 구독 해제
   * @returns 성공 여부
   */
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
      if (!authManager.isAuthenticated()) {
        throw new Error('인증되지 않은 사용자');
      }

      const response = await fetch(
        `${this.baseUrl}/notification/push/unsubscribe`,
        {
          method: 'DELETE',
          headers: authManager.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ 푸시 알림 구독 해제 성공');
      
      return data.success;
    } catch (error) {
      console.error('❌ 푸시 알림 구독 해제 실패:', error);
      throw error;
    }
  }

  /**
   * 알림 폴링 시작
   * @param interval - 폴링 간격 (밀리초, 기본값: 30초)
   * @param onUpdate - 업데이트 콜백 함수
   */
  startNotificationPolling(
    interval: number = 30000,
    onUpdate?: (unreadCount: number) => void
  ): void {
    if (this.pollingInterval) {
      this.stopNotificationPolling();
    }

    console.log('🔄 알림 폴링 시작 (간격:', interval, 'ms)');
    
    this.pollingInterval = setInterval(async () => {
      try {
        const unreadCount = await this.getUnreadCount();
        if (onUpdate) {
          onUpdate(unreadCount);
        }
      } catch (error) {
        console.error('❌ 알림 폴링 실패:', error);
      }
    }, interval);
  }

  /**
   * 알림 폴링 중지
   */
  stopNotificationPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('🛑 알림 폴링 중지');
    }
  }

  /**
   * 알림 타입별 아이콘 반환
   * @param type - 알림 타입
   * @returns 아이콘 문자열
   */
  getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'PRICE_ALERT':
        return '💰';
      case 'NEWS_UPDATE':
        return '📰';
      case 'RECOMMENDATION':
        return '🤖';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '📢';
    }
  }

  /**
   * 알림 우선순위별 색상 반환
   * @param priority - 알림 우선순위
   * @returns CSS 색상 값
   */
  getNotificationColor(priority: Notification['priority']): string {
    switch (priority) {
      case 'HIGH':
        return 'var(--status-error)';
      case 'MEDIUM':
        return 'var(--status-warning)';
      case 'LOW':
        return 'var(--status-success)';
      default:
        return 'var(--text-secondary)';
    }
  }

  /**
   * 알림 시간 포맷팅
   * @param createdAt - 생성 시간
   * @returns 포맷된 시간 문자열
   */
  formatNotificationTime(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}시간 전`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}일 전`;
    }
  }
}

// 싱글톤 인스턴스 생성
export default new NotificationManager();


