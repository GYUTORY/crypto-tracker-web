/**
 * Java WebSocket 클라이언트
 * 실시간 데이터 스트리밍 (가격, 티커, 캔들스틱 등)을 위한 WebSocket 연결 관리
 */

class JavaWebSocketClient {
  private baseUrl: string;
  private connections: Map<string, WebSocket>;
  private subscriptions: Set<string>;
  private listeners: Record<string, Function[]>;

  constructor() {
    this.baseUrl = import.meta.env.VITE_JAVA_WS_BASE_URL || 'ws://localhost:8080';
    this.connections = new Map();
    this.subscriptions = new Set();
    this.listeners = {};
  }

  /**
   * 실시간 가격 WebSocket 연결
   * @param symbols - 코인 심볼 배열
   * @returns WebSocket 인스턴스
   */
  connectToPriceStream(symbols: string[]): WebSocket {
    const symbolsParam = symbols.join(',');
    const url = `${this.baseUrl}/ws/price?symbols=${symbolsParam}`;
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('✅ Java 가격 WebSocket 연결됨');
      // 구독 요청
      ws.send(JSON.stringify({
        action: 'subscribe',
        symbols: symbols
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handlePriceMessage(data);
      } catch (error) {
        console.error('❌ 가격 메시지 파싱 실패:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Java 가격 WebSocket 에러:', error);
    };
    
    ws.onclose = () => {
      console.log('🔌 Java 가격 WebSocket 연결 종료');
      // 재연결 로직
      setTimeout(() => this.connectToPriceStream(Array.from(this.subscriptions)), 5000);
    };
    
    this.connections.set('price', ws);
    symbols.forEach(symbol => this.subscriptions.add(symbol));
    return ws;
  }

  /**
   * 실시간 티커 WebSocket 연결
   * @param symbols - 코인 심볼 배열
   * @returns WebSocket 인스턴스
   */
  connectToTickerStream(symbols: string[]): WebSocket {
    const symbolsParam = symbols.join(',');
    const url = `${this.baseUrl}/ws/ticker?symbols=${symbolsParam}`;
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('✅ Java 티커 WebSocket 연결됨');
      ws.send(JSON.stringify({
        action: 'subscribe',
        symbols: symbols
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleTickerMessage(data);
      } catch (error) {
        console.error('❌ 티커 메시지 파싱 실패:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Java 티커 WebSocket 에러:', error);
    };
    
    ws.onclose = () => {
      console.log('🔌 Java 티커 WebSocket 연결 종료');
    };
    
    this.connections.set('ticker', ws);
    return ws;
  }

  /**
   * 캔들스틱 WebSocket 연결
   * @param symbol - 코인 심볼
   * @param interval - 시간 간격
   * @returns WebSocket 인스턴스
   */
  connectToKlineStream(symbol: string, interval: string): WebSocket {
    const url = `${this.baseUrl}/ws/kline/${symbol}?interval=${interval}`;
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('✅ Java 캔들스틱 WebSocket 연결됨');
      ws.send(JSON.stringify({
        action: 'subscribe',
        symbol: symbol,
        interval: interval
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleKlineMessage(data);
      } catch (error) {
        console.error('❌ 캔들스틱 메시지 파싱 실패:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Java 캔들스틱 WebSocket 에러:', error);
    };
    
    ws.onclose = () => {
      console.log('🔌 Java 캔들스틱 WebSocket 연결 종료');
    };
    
    const key = `kline_${symbol}_${interval}`;
    this.connections.set(key, ws);
    return ws;
  }

  /**
   * 가격 메시지 처리
   * @param data - 메시지 데이터
   */
  private handlePriceMessage(data: any): void {
    switch (data.type) {
      case 'PRICE_UPDATE':
        console.log('💰 가격 업데이트:', data);
        this.emit('priceUpdate', data);
        break;
      case 'VOLUME_UPDATE':
        console.log('📊 거래량 업데이트:', data);
        this.emit('volumeUpdate', data);
        break;
      case 'MARKET_DATA_UPDATE':
        console.log('📈 시장 데이터 업데이트:', data);
        this.emit('marketDataUpdate', data);
        break;
      default:
        console.log('❓ 알 수 없는 가격 타입:', data.type);
    }
  }

  /**
   * 티커 메시지 처리
   * @param data - 메시지 데이터
   */
  private handleTickerMessage(data: any): void {
    switch (data.type) {
      case 'TICKER_UPDATE':
        console.log('📊 티커 업데이트:', data);
        this.emit('tickerUpdate', data);
        break;
      case 'MARKET_STATS_UPDATE':
        console.log('📈 시장 통계 업데이트:', data);
        this.emit('marketStatsUpdate', data);
        break;
      case 'TRADING_VOLUME_UPDATE':
        console.log('💹 거래량 업데이트:', data);
        this.emit('tradingVolumeUpdate', data);
        break;
      default:
        console.log('❓ 알 수 없는 티커 타입:', data.type);
    }
  }

  /**
   * 캔들스틱 메시지 처리
   * @param data - 메시지 데이터
   */
  private handleKlineMessage(data: any): void {
    switch (data.type) {
      case 'KLINE_UPDATE':
        console.log('📈 캔들스틱 업데이트:', data);
        this.emit('klineUpdate', data);
        break;
      case 'TECHNICAL_INDICATOR_UPDATE':
        console.log('🔧 기술적 지표 업데이트:', data);
        this.emit('technicalIndicatorUpdate', data);
        break;
      case 'CHART_PATTERN_UPDATE':
        console.log('📊 차트 패턴 업데이트:', data);
        this.emit('chartPatternUpdate', data);
        break;
      default:
        console.log('❓ 알 수 없는 캔들스틱 타입:', data.type);
    }
  }

  /**
   * 이벤트 리스너 등록
   * @param event - 이벤트 이름
   * @param callback - 콜백 함수
   */
  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * 이벤트 리스너 제거
   * @param event - 이벤트 이름
   * @param callback - 콜백 함수
   */
  off(event: string, callback: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * 이벤트 발생
   * @param event - 이벤트 이름
   * @param data - 이벤트 데이터
   */
  private emit(event: string, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * 코인 심볼 구독
   * @param symbol - 코인 심볼
   */
  subscribeToSymbol(symbol: string): void {
    this.subscriptions.add(symbol);
    const priceWs = this.connections.get('price');
    if (priceWs && priceWs.readyState === WebSocket.OPEN) {
      priceWs.send(JSON.stringify({
        action: 'subscribe',
        symbols: [symbol]
      }));
    }
  }

  /**
   * 코인 심볼 구독 해제
   * @param symbol - 코인 심볼
   */
  unsubscribeFromSymbol(symbol: string): void {
    this.subscriptions.delete(symbol);
    const priceWs = this.connections.get('price');
    if (priceWs && priceWs.readyState === WebSocket.OPEN) {
      priceWs.send(JSON.stringify({
        action: 'unsubscribe',
        symbols: [symbol]
      }));
    }
  }

  /**
   * 특정 WebSocket 연결 해제
   * @param type - 연결 타입
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
    this.subscriptions.clear();
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

  /**
   * 구독 중인 심볼 목록 조회
   * @returns 구독 중인 심볼 배열
   */
  getSubscriptions(): string[] {
    return Array.from(this.subscriptions);
  }
}

// 싱글톤 인스턴스 생성
export default new JavaWebSocketClient();

