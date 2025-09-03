/**
 * Node.js WebSocket 클라이언트
 * 사용자 관련 기능 (알림, 대시보드 등)을 위한 WebSocket 연결 관리
 */

class NodeWebSocketClient {
  private baseUrl: string;
  private connections: Map<string, WebSocket>;

  constructor() {
    this.baseUrl = import.meta.env.VITE_NODE_WS_BASE_URL || 'ws://localhost:3000';
    this.connections = new Map();
  }

  /**
   * 알림 WebSocket 연결
   * @param userId - 사용자 ID
   * @returns WebSocket 인스턴스
   */
  connectToNotifications(userId: string): WebSocket {
    const url = `${this.baseUrl}/ws/notifications/${userId}`;
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('✅ Node.js 알림 WebSocket 연결됨');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleNotificationMessage(data);
      } catch (error) {
        console.error('❌ 알림 메시지 파싱 실패:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Node.js 알림 WebSocket 에러:', error);
    };
    
    ws.onclose = () => {
      console.log('🔌 Node.js 알림 WebSocket 연결 종료');
      // 재연결 로직
      setTimeout(() => this.connectToNotifications(userId), 5000);
    };
    
    this.connections.set('notifications', ws);
    return ws;
  }

  /**
   * 대시보드 업데이트 WebSocket 연결
   * @param userId - 사용자 ID
   * @returns WebSocket 인스턴스
   */
  connectToDashboard(userId: string): WebSocket {
    const url = `${this.baseUrl}/ws/dashboard/${userId}`;
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('✅ Node.js 대시보드 WebSocket 연결됨');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleDashboardMessage(data);
      } catch (error) {
        console.error('❌ 대시보드 메시지 파싱 실패:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Node.js 대시보드 WebSocket 에러:', error);
    };
    
    ws.onclose = () => {
      console.log('🔌 Node.js 대시보드 WebSocket 연결 종료');
    };
    
    this.connections.set('dashboard', ws);
    return ws;
  }

  /**
   * 알림 메시지 처리
   * @param data - 메시지 데이터
   */
  private handleNotificationMessage(data: any): void {
    switch (data.type) {
      case 'NEW_NOTIFICATION':
        console.log('📢 새 알림:', data.message);
        // 새 알림 표시 로직
        break;
      case 'PRICE_ALERT':
        console.log('💰 가격 알림:', data.message);
        // 가격 알림 표시 로직
        break;
      case 'SYSTEM_UPDATE':
        console.log('🔄 시스템 업데이트:', data.message);
        // 시스템 업데이트 처리
        break;
      default:
        console.log('❓ 알 수 없는 알림 타입:', data.type);
    }
  }

  /**
   * 대시보드 메시지 처리
   * @param data - 메시지 데이터
   */
  private handleDashboardMessage(data: any): void {
    switch (data.type) {
      case 'WATCHLIST_UPDATE':
        console.log('📊 관심목록 업데이트:', data.data);
        // 관심목록 업데이트 처리
        break;
      case 'USER_PREFERENCE_UPDATE':
        console.log('⚙️ 사용자 설정 업데이트:', data.data);
        // 사용자 설정 업데이트 처리
        break;
      case 'DASHBOARD_REFRESH':
        console.log('🔄 대시보드 새로고침 요청');
        // 대시보드 새로고침 처리
        break;
      default:
        console.log('❓ 알 수 없는 대시보드 타입:', data.type);
    }
  }

  /**
   * 특정 WebSocket 연결 해제
   * @param type - 연결 타입 ('notifications', 'dashboard')
   */
  disconnect(type: string): void {
    const connection = this.connections.get(type);
    if (connection) {
      connection.close();
      this.connections.delete(type);
      console.log(`🔌 ${type} WebSocket 연결 해제됨`);
    }
  }

  /**
   * 모든 WebSocket 연결 해제
   */
  disconnectAll(): void {
    this.connections.forEach((connection, type) => {
      connection.close();
      console.log(`🔌 ${type} WebSocket 연결 해제됨`);
    });
    this.connections.clear();
  }

  /**
   * 연결 상태 확인
   * @returns 연결 상태 객체
   */
  getConnectionStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    this.connections.forEach((connection, type) => {
      status[type] = connection.readyState === WebSocket.OPEN;
    });
    return status;
  }
}

// 싱글톤 인스턴스 생성
export default new NodeWebSocketClient();

