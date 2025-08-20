import axios from 'axios';

// 동적으로 API 주소 설정 (핸드폰 접근용)
const getApiBaseUrl = () => {
  // 환경 변수가 있으면 사용, 없으면 동적으로 설정
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  
  // 현재 호스트가 localhost가 아니면 같은 IP 사용
  const currentHost = window.location.hostname;
  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    return `http://${currentHost}:3000`;
  }
  
  // 기본값
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60초로 더 늘림
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.message);
    throw error;
  }
);

// API 함수들
export const priceApi = {
  // 특정 코인 가격 조회
  getPrice: (symbol: string) => {
    return api.get(`/price/${symbol}`);
  },
  
  // 여러 코인 가격 조회
  getPrices: (symbols: string[]) => {
    return Promise.all(
      symbols.map(symbol => api.get(`/price/${symbol}`))
    );
  },

  // 차트 데이터 조회
  getChartData: (symbol: string, timeframe: string = '1h', limit: number = 24) => {
    return api.get(`/price/${symbol}/chart?timeframe=${timeframe}&limit=${limit}`);
  },
};

export const marketApi = {
  // 시장 통계 조회
  getMarketStats: () => {
    return api.get('/market/stats');
  },
};

export const aiApi = {
  // 기술적 분석 (POST 요청, body에 데이터 포함)
  getTechnicalAnalysis: (symbol: string, price?: string, technicalData?: any) => {
    const requestBody = {
      symbol,
      price: price || "45000.00", // 기본값
      technicalData: technicalData || {
        rsi: 65,
        macd: 0.5,
        macdSignal: 0.3,
        bollingerUpper: "46000.00",
        bollingerLower: "44000.00",
        ma20: "44800.00",
        ma50: "44500.00",
        volume: "1000000",
        volumeChange: "5.2"
      }
    };
    return api.post('/ai/technical-analysis', requestBody);
  },
};

export const predictionApi = {
  // 가격 예측 조회 (GET 요청)
  getPricePrediction: (symbol: string) => {
    return api.get(`/prediction/${symbol}`);
  },
  
  // 가격 예측 생성 (POST 요청)
  createPricePrediction: (symbol: string, timeframes?: string[], forceRefresh?: boolean) => {
    const requestBody = {
      symbol,
      timeframes: timeframes || ['1h', '4h', '24h'],
      forceRefresh: forceRefresh || false
    };
    return api.post(`/prediction/${symbol}`, requestBody);
  },
};

export const streamApi = {
  // 스트림 상태 조회
  getStreamStatus: () => {
    return api.get('/stream/status');
  },
  
  // 심볼 구독
  subscribe: (symbols: string[]) => {
    return api.post('/stream/subscribe', { symbols });
  },
  
  // 심볼 구독 해제
  unsubscribe: (symbols: string[]) => {
    return api.post('/stream/unsubscribe', { symbols });
  },
  
  // 구독 목록 조회
  getStreamSubscriptions: () => {
    return api.get('/stream/subscriptions');
  },
  
  // 특정 심볼 구독 상태 조회
  getStreamSubscription: (symbol: string) => {
    return api.get(`/stream/subscription/${symbol}`);
  },
};

export const tcpApi = {
  // TCP 상태 조회
  getTcpStatus: () => {
    return api.get('/tcp/status');
  },
  
  // 메모리 가격 데이터 조회
  getTcpPrices: () => {
    return api.get('/tcp/prices');
  },
  
  // WebSocket 재연결
  reconnectTcp: () => {
    return api.get('/tcp/reconnect');
  },
};

export const symbolsApi = {
  // 전체 거래 가능한 코인 목록 조회
  getSymbols: (filter?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (limit) params.append('limit', limit.toString());
    return api.get(`/symbols?${params.toString()}`);
  },
  
  // 인기 코인 목록 조회
  getPopularSymbols: () => {
    return api.get('/symbols/popular');
  },
  
  // USDT 페어 코인 목록 조회
  getUsdtSymbols: () => {
    return api.get('/symbols/usdt');
  },
};

export const newsApi = {
  // 비트코인 뉴스 조회
  getBitcoinNews: () => {
    return api.get('/news/bitcoin');
  },
  
  // 전체 뉴스 조회
  getAllNews: (params?: { limit?: number; page?: number; source?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.source) queryParams.append('source', params.source);
    
    const queryString = queryParams.toString();
    return api.get(`/news${queryString ? `?${queryString}` : ''}`);
  },
  
  // 뉴스 검색
  searchNews: (params: { q: string; limit?: number; page?: number }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', params.q);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    return api.get(`/news/search?${queryParams.toString()}`);
  },
};
