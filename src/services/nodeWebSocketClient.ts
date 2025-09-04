/**
 * Node.js WebSocket 클라이언트
 * 실시간 가격 데이터, 차트 데이터, 알림 등을 처리
 */

export interface WebSocketMessage {
  type: string;
  channel?: string;
  symbols?: string[];
  symbol?: string;
  timeframe?: string;
  data?: any;
}

export interface PriceUpdate {
  type: 'price_update';
  data: {
    symbol: string;
    price: string;
    change24h: string;
    timestamp: number;
  };
}

export interface ChartUpdate {
  type: 'chart_update';
  data: {
    symbol: string;
    timeframe: string;
    candle: {
      timestamp: number;
      open: string;
      high: string;
      low: string;
      close: string;
      volume: string;
    };
  };
}

export interface NotificationUpdate {
  type: 'notification';
  data: {
    id: string;
    type: 'price' | 'news' | 'system';
    title: string;
    message: string;
    timestamp: number;
  };
}

export type WebSocketData = PriceUpdate | ChartUpdate | NotificationUpdate;

class NodeWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private subscriptions = new Set<string>();
  private messageHandlers = new Map<string, (data: any) => void>();
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000/ws';
  }

  /**
   * WebSocket 연결
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('이미 연결 중입니다'));
        return;
      }

      this.isConnecting = true;
      console.log('🔌 WebSocket 연결 시도:', this.baseUrl);

      try {
        this.ws = new WebSocket(this.baseUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket 연결 성공');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // 이전 구독 복원
          this.restoreSubscriptions();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketData = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('❌ WebSocket 메시지 파싱 실패:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket 연결 종료:', event.code, event.reason);
          this.isConnecting = false;
          
          if (!event.wasClean) {
            this.handleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket 에러:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    if (this.ws) {
      console.log('🔌 WebSocket 연결 해제');
      this.ws.close(1000, '사용자 요청');
      this.ws = null;
    }
  }

  /**
   * 가격 데이터 구독
   */
  subscribeToPrice(symbols: string[]): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket이 연결되지 않았습니다');
      return;
    }

    const message: WebSocketMessage = {
      type: 'subscribe',
      channel: 'price',
      symbols
    };

    this.ws.send(JSON.stringify(message));
    
    // 구독 상태 저장
    symbols.forEach(symbol => {
      this.subscriptions.add(`price:${symbol}`);
    });

    console.log('📊 가격 데이터 구독:', symbols);
  }

  /**
   * 차트 데이터 구독
   */
  subscribeToChart(symbol: string, timeframe: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket이 연결되지 않았습니다');
      return;
    }

    const message: WebSocketMessage = {
      type: 'subscribe',
      channel: 'chart',
      symbol,
      timeframe
    };

    this.ws.send(JSON.stringify(message));
    
    // 구독 상태 저장
    this.subscriptions.add(`chart:${symbol}:${timeframe}`);
    console.log('📈 차트 데이터 구독:', symbol, timeframe);
  }

  /**
   * 알림 구독
   */
  subscribeToNotifications(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket이 연결되지 않았습니다');
      return;
    }

    const message: WebSocketMessage = {
      type: 'subscribe',
      channel: 'notifications'
    };

    this.ws.send(JSON.stringify(message));
    
    // 구독 상태 저장
    this.subscriptions.add('notifications');
    console.log('🔔 알림 구독');
  }

  /**
   * 구독 해제
   */
  unsubscribe(channel: string, symbol?: string, timeframe?: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: WebSocketMessage = {
      type: 'unsubscribe',
      channel,
      symbol,
      timeframe
    };

    this.ws.send(JSON.stringify(message));
    
    // 구독 상태 제거
    if (channel === 'price' && symbol) {
      this.subscriptions.delete(`price:${symbol}`);
    } else if (channel === 'chart' && symbol && timeframe) {
      this.subscriptions.delete(`chart:${symbol}:${timeframe}`);
    } else if (channel === 'notifications') {
      this.subscriptions.delete('notifications');
    }

    console.log('❌ 구독 해제:', channel, symbol, timeframe);
  }

  /**
   * 메시지 핸들러 등록
   */
  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * 메시지 핸들러 제거
   */
  offMessage(type: string): void {
    this.messageHandlers.delete(type);
  }

  /**
   * 메시지 처리
   */
  private handleMessage(message: WebSocketData): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data);
    } else {
      console.log('📨 수신된 메시지:', message);
    }
  }

  /**
   * 재연결 처리
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ 최대 재연결 시도 횟수 초과');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 ${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('❌ 재연결 실패:', error);
      });
    }, delay);
  }

  /**
   * 구독 복원
   */
  private restoreSubscriptions(): void {
    if (this.subscriptions.size === 0) return;

    console.log('🔄 구독 복원 중...');
    
    this.subscriptions.forEach(subscription => {
      const [channel, symbol, timeframe] = subscription.split(':');
      
      if (channel === 'price') {
        this.subscribeToPrice([symbol]);
      } else if (channel === 'chart') {
        this.subscribeToChart(symbol, timeframe);
      } else if (channel === 'notifications') {
        this.subscribeToNotifications();
      }
    });
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 구독 상태 확인
   */
  isSubscribed(channel: string, symbol?: string, timeframe?: string): boolean {
    if (channel === 'price' && symbol) {
      return this.subscriptions.has(`price:${symbol}`);
    } else if (channel === 'chart' && symbol && timeframe) {
      return this.subscriptions.has(`chart:${symbol}:${timeframe}`);
    } else if (channel === 'notifications') {
      return this.subscriptions.has('notifications');
    }
    return false;
  }

  /**
   * 구독 목록 조회
   */
  getSubscriptions(): string[] {
    return Array.from(this.subscriptions);
  }
}

// 싱글톤 인스턴스 생성
export default new NodeWebSocketClient();

