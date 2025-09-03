import axios from 'axios';

/**
 * 동적으로 API 기본 URL을 설정하는 함수
 * 환경 변수, 호스트 정보를 기반으로 적절한 API 주소를 반환합니다
 * 
 * @returns API 기본 URL 문자열
 * 
 * 우선순위:
 * 1. 환경 변수 VITE_API_BASE_URL
 * 2. 현재 호스트 기반 동적 설정 (모바일 접근용)
 * 3. 기본값 localhost:3000
 */
const getApiBaseUrl = () => {
  // 환경 변수가 있으면 사용, 없으면 동적으로 설정
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  
  // 현재 호스트가 localhost가 아니면 같은 IP 사용 (모바일 접근용)
  const currentHost = window.location.hostname;
  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    return `http://${currentHost}:3000`;
  }
  
  // 기본값
  return 'http://localhost:3000';
};

/**
 * Java 서버 API 기본 URL을 설정하는 함수
 * AI 추천, 기술적 지표 등 성능 중심 API용
 * 
 * @returns Java API 기본 URL 문자열
 */
const getJavaApiBaseUrl = () => {
  // 환경 변수가 있으면 사용, 없으면 동적으로 설정
  const envUrl = import.meta.env.VITE_JAVA_API_BASE_URL;
  if (envUrl) return envUrl;
  
  // 현재 호스트가 localhost가 아니면 같은 IP 사용 (모바일 접근용)
  const currentHost = window.location.hostname;
  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    return `http://${currentHost}:8080`;
  }
  
  // 기본값 (Java 서버)
  return 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();
const JAVA_API_BASE_URL = getJavaApiBaseUrl();

console.log('🔗 Node.js API Base URL:', API_BASE_URL);
console.log('🔗 Java API Base URL:', JAVA_API_BASE_URL);

/**
 * Axios 인스턴스 생성
 * 기본 설정 및 인터셉터를 포함한 HTTP 클라이언트
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120초 타임아웃 (2분)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Java 서버용 Axios 인스턴스 생성
 * AI 추천, 기술적 지표 등 성능 중심 API용
 */
export const javaApi = axios.create({
  baseURL: JAVA_API_BASE_URL,
  timeout: 120000, // 120초 타임아웃 (2분)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * 모든 API 요청에 대한 로깅 및 전처리를 수행합니다
 */
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

/**
 * 응답 인터셉터
 * 모든 API 응답에 대한 로깅 및 후처리를 수행합니다
 */
api.interceptors.response.use(
  (response) => {
    console.log('✅ Node.js API Response:', response.config.url, response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ Node.js API Error:', error.config?.url, error.message);
    throw error;
  }
);

/**
 * Java 서버 요청 인터셉터
 * 모든 Java API 요청에 대한 로깅 및 전처리를 수행합니다
 */
javaApi.interceptors.request.use(
  (config) => {
    console.log('🚀 Java API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Java Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Java 서버 응답 인터셉터
 * 모든 Java API 응답에 대한 로깅 및 후처리를 수행합니다
 */
javaApi.interceptors.response.use(
  (response) => {
    console.log('✅ Java API Response:', response.config.url, response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ Java API Error:', error.config?.url, error.message);
    throw error;
  }
);

/**
 * 가격 관련 API 함수들
 * 실시간 가격 조회 및 차트 데이터 제공 (Java 서버)
 */
export const priceApi = {
  /**
   * 특정 코인의 실시간 가격 정보를 조회합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @returns Promise<PriceData> - 가격 데이터 객체
   */
  getPrice: (symbol: string) => {
    return javaApi.get(`/api/market/price/${symbol}`);
  },
  
  /**
   * 여러 코인의 실시간 가격 정보를 병렬로 조회합니다
   * @param symbols - 코인 심볼 배열 (예: ['BTCUSDT', 'ETHUSDT'])
   * @returns Promise<PriceData[]> - 가격 데이터 배열
   */
  getPrices: (symbols: string[]) => {
    return Promise.all(
      symbols.map(symbol => javaApi.get(`/api/market/price/${symbol}`))
    );
  },

  /**
   * 특정 코인의 차트 데이터를 조회합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @param timeframe - 시간 간격 (기본값: '1h')
   * @param limit - 데이터 포인트 수 (기본값: 24)
   * @returns Promise<ChartData> - 차트 데이터 객체
   */
  getChartData: (symbol: string, timeframe: string = '1h', limit: number = 24) => {
    return javaApi.get(`/api/market/ohlcv/${symbol}?interval=${timeframe}&limit=${limit}`);
  },
};

/**
 * 시장 통계 관련 API 함수들
 * 전체 암호화폐 시장의 통계 정보 제공 (Java 서버)
 */
export const marketApi = {
  /**
   * 전체 암호화폐 시장의 통계 정보를 조회합니다
   * @returns Promise<MarketStats> - 시장 통계 데이터
   * 
   * 포함 정보:
   * - 전체 시가총액
   * - 24시간 거래량
   * - BTC 지배율
   * - 활성 코인 수
   * - 공포탐욕 지수
   */
  getMarketStats: () => {
    return javaApi.get('/api/market/stats');
  },
};

/**
 * 기술적 지표 관련 API 함수들
 * RSI, MACD, 볼린저 밴드 등 기술적 분석 지표 제공 (Java 서버)
 */
export const technicalApi = {
  /**
   * RSI (상대강도지수)를 조회합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @returns Promise<TechnicalIndicator> - RSI 데이터
   */
  getRSI: (symbol: string) => {
    return javaApi.get(`/api/technical/rsi/${symbol}`);
  },
  
  /**
   * MACD (이동평균수렴확산)를 조회합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @returns Promise<TechnicalIndicator> - MACD 데이터
   */
  getMACD: (symbol: string) => {
    return javaApi.get(`/api/technical/macd/${symbol}`);
  },
  
  /**
   * 볼린저 밴드를 조회합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @returns Promise<TechnicalIndicator> - 볼린저 밴드 데이터
   */
  getBollingerBands: (symbol: string) => {
    return javaApi.get(`/api/technical/bollinger/${symbol}`);
  },
  
  /**
   * 모든 기술적 지표를 조회합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @returns Promise<AllTechnicalIndicators> - 모든 기술적 지표 데이터
   */
  getAllIndicators: (symbol: string) => {
    return javaApi.get(`/api/technical/all/${symbol}`);
  },
};

/**
 * AI 분석 관련 API 함수들
 * Google Gemini AI를 활용한 기술적 분석 제공 (Node.js 서버 유지)
 */
export const aiApi = {
  /**
   * AI 기반 기술적 분석을 요청합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @param price - 현재 가격 (기본값: "45000.00")
   * @param technicalData - 기술적 지표 데이터 (기본값: 샘플 데이터)
   * @returns Promise<TechnicalAnalysis> - 기술적 분석 결과
   * 
   * 분석 지표:
   * - RSI (상대강도지수)
   * - MACD (이동평균수렴확산)
   * - 볼린저 밴드
   * - 이동평균선
   * - 거래량 분석
   */
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

/**
 * 가격 예측 관련 API 함수들
 * AI 기반 가격 예측 및 분석 제공
 */
export const predictionApi = {
  /**
   * 기존 가격 예측 결과를 조회합니다 (GET 요청)
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @returns Promise<PricePrediction> - 가격 예측 결과
   */
  getPricePrediction: (symbol: string) => {
    return api.get(`/prediction/${symbol}`);
  },
  
  /**
   * 새로운 가격 예측을 생성합니다 (POST 요청)
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @param timeframes - 예측할 시간대 배열 (기본값: ['1h', '4h', '24h'])
   * @param forceRefresh - 강제 새로고침 여부 (기본값: false)
   * @returns Promise<PricePrediction> - 새로 생성된 예측 결과
   */
  createPricePrediction: (symbol: string, timeframes?: string[], forceRefresh?: boolean) => {
    const requestBody = {
      symbol,
      timeframes: timeframes || ['1h', '4h', '24h'],
      forceRefresh: forceRefresh || false
    };
    return api.post(`/prediction/${symbol}`, requestBody);
  },
};

/**
 * 코인 심볼 관련 API 함수들
 * 거래 가능한 코인 목록 및 인기 코인 정보 제공
 */
export const symbolsApi = {
  /**
   * 전체 거래 가능한 코인 목록을 조회합니다
   * @param filter - 필터링 조건 (선택사항)
   * @param limit - 조회할 코인 수 제한 (선택사항)
   * @returns Promise<TradingSymbols> - 코인 목록 데이터
   */
  getSymbols: (filter?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (limit) params.append('limit', limit.toString());
    return api.get(`/symbols?${params.toString()}`);
  },
  
  /**
   * 인기 코인 목록을 조회합니다
   * @returns Promise<TradingSymbols> - 인기 코인 목록
   * 
   * 선별 기준:
   * - 거래량
   * - 시가총액
   * - 사용자 관심도
   */
  getPopularSymbols: () => {
    return api.get('/symbols/popular');
  },
};

/**
 * 뉴스 관련 API 함수들
 * 암호화폐 관련 뉴스 및 시장 동향 정보 제공 (Java 서버)
 */
export const newsApi = {
  /**
   * 비트코인 관련 뉴스를 조회합니다
   * @returns Promise<NewsResponse> - 비트코인 뉴스 목록
   */
  getBitcoinNews: () => {
    return javaApi.get('/api/news/bitcoin');
  },
  
  /**
   * 전체 암호화폐 뉴스를 조회합니다
   * @param params - 조회 파라미터 (limit, page, source)
   * @returns Promise<NewsPaginationResponse> - 뉴스 목록 및 페이지네이션 정보
   */
  getAllNews: (params?: { limit?: number; page?: number; source?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.source) queryParams.append('source', params.source);
    
    const queryString = queryParams.toString();
    return javaApi.get(`/api/news${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * 뉴스를 검색합니다
   * @param params - 검색 파라미터 (q: 검색어, limit, page)
   * @returns Promise<NewsPaginationResponse> - 검색 결과 및 페이지네이션 정보
   */
  searchNews: (params: { q: string; limit?: number; page?: number }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', params.q);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    return javaApi.get(`/api/news/search?${queryParams.toString()}`);
  },
};

/**
 * AI 추천 관련 API 함수들
 * AI 기반 투자 추천 및 분석 제공 (Java 서버)
 */
export const aiRecommendationsApi = {
  /**
   * 단기 추천을 조회합니다 (1-7일)
   * @returns Promise<AIRecommendations> - 단기 추천 데이터
   */
  getShortTermRecommendations: () => {
    return javaApi.get('/api/recommendation/short-term');
  },
  
  /**
   * 중기 추천을 조회합니다 (1-4주)
   * @returns Promise<AIRecommendations> - 중기 추천 데이터
   */
  getMediumTermRecommendations: () => {
    return javaApi.get('/api/recommendation/medium-term');
  },
  
  /**
   * 장기 추천을 조회합니다 (1-12개월)
   * @returns Promise<AIRecommendations> - 장기 추천 데이터
   */
  getLongTermRecommendations: () => {
    return javaApi.get('/api/recommendation/long-term');
  },
  
  /**
   * 전체 추천을 조회합니다 (단기, 중기, 장기)
   * @returns Promise<AllRecommendations> - 전체 추천 데이터
   */
  getAllRecommendations: () => {
    return javaApi.get('/api/recommendation/all');
  },
};

/**
 * 서버 상태 확인 함수
 * Node.js와 Java 서버의 상태를 확인합니다
 */
export const checkServerHealth = async () => {
  try {
    console.log('🔍 서버 상태 확인 중...');
    
    const nodeHealth = await fetch(`${API_BASE_URL}/health`);
    const javaHealth = await fetch(`${JAVA_API_BASE_URL}/actuator/health`);
    
    const nodeStatus = nodeHealth.ok;
    const javaStatus = javaHealth.ok;
    
    console.log('📊 서버 상태:', {
      node: nodeStatus ? '✅ 정상' : '❌ 오류',
      java: javaStatus ? '✅ 정상' : '❌ 오류'
    });
    
    return {
      node: nodeStatus,
      java: javaStatus
    };
  } catch (error) {
    console.error('❌ 서버 상태 확인 실패:', error);
    return { node: false, java: false };
  }
};

/**
 * 안전한 API 호출 함수
 * API 호출 실패 시 fallback 값을 반환합니다
 */
export const safeApiCall = async (apiCall: () => Promise<any>, fallback: any = null) => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('❌ API 호출 실패:', error);
    return fallback;
  }
};

/**
 * 마이그레이션 상태 확인 함수
 * 하이브리드 아키텍처 전환 상태를 확인합니다
 */
export const checkMigrationStatus = async () => {
  console.log('🔍 마이그레이션 상태 확인 중...');
  
  const status = {
    nodeServer: false,
    javaServer: false,
    apis: {
      price: 'java', // Java 서버로 마이그레이션 완료
      market: 'java', // Java 서버로 마이그레이션 완료
      news: 'java', // Java 서버로 마이그레이션 완료
      technical: 'java', // Java 서버로 마이그레이션 완료
      aiRecommendations: 'java', // Java 서버로 마이그레이션 완료
      aiAnalysis: 'node', // Node.js 서버 유지
      prediction: 'node', // Node.js 서버 유지
      symbols: 'node', // Node.js 서버 유지
      auth: 'node', // Node.js 서버 유지
      notifications: 'node', // Node.js 서버 유지
    },
    websockets: {
      price: 'java', // Java 서버로 마이그레이션 완료
      ticker: 'java', // Java 서버로 마이그레이션 완료
      kline: 'java', // Java 서버로 마이그레이션 완료
      notifications: 'node', // Node.js 서버 유지
      dashboard: 'node', // Node.js 서버 유지
    }
  };

  try {
    // 서버 상태 확인
    const serverHealth = await checkServerHealth();
    status.nodeServer = serverHealth.node;
    status.javaServer = serverHealth.java;

    console.log('📊 마이그레이션 상태:', status);
    return status;
  } catch (error) {
    console.error('❌ 마이그레이션 상태 확인 실패:', error);
    return status;
  }
};

/**
 * API 응답 시간 측정 함수
 * @param apiCall - API 호출 함수
 * @param apiName - API 이름
 * @returns API 호출 결과
 */
export const measureApiResponseTime = async <T>(
  apiCall: () => Promise<T>, 
  apiName: string
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    console.log(`⏱️ ${apiName} 응답 시간: ${responseTime.toFixed(2)}ms`);
    
    // 성능 경고 (1초 이상)
    if (responseTime > 1000) {
      console.warn(`⚠️ ${apiName} 응답 시간이 느림: ${responseTime.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    console.error(`❌ ${apiName} 실패 (${responseTime.toFixed(2)}ms):`, error);
    throw error;
  }
};

/**
 * WebSocket 연결 상태 모니터링 함수
 * @param interval - 체크 간격 (밀리초, 기본값: 30초)
 */
export const monitorWebSocketHealth = (interval: number = 30000) => {
  console.log('🔍 WebSocket 상태 모니터링 시작...');
  
  const checkInterval = setInterval(() => {
    try {
      // Node.js WebSocket 상태 확인
      const nodeWebSocketClient = require('./nodeWebSocketClient').default;
      const nodeStatus = nodeWebSocketClient.getConnectionStatus();
      
      // Java WebSocket 상태 확인
      const javaWebSocketClient = require('./javaWebSocketClient').default;
      const javaStatus = javaWebSocketClient.getConnectionStatus();
      
      console.log('📊 WebSocket 상태:', {
        node: nodeStatus,
        java: javaStatus
      });
      
      // 연결 상태 이상 시 경고
      Object.entries(nodeStatus).forEach(([type, isConnected]) => {
        if (!isConnected) {
          console.warn(`⚠️ Node.js ${type} WebSocket 연결 상태 이상`);
        }
      });
      
      Object.entries(javaStatus).forEach(([type, isConnected]) => {
        if (!isConnected) {
          console.warn(`⚠️ Java ${type} WebSocket 연결 상태 이상`);
        }
      });
      
    } catch (error) {
      console.error('❌ WebSocket 상태 확인 실패:', error);
    }
  }, interval);
  
  // 모니터링 중지 함수 반환
  return () => {
    clearInterval(checkInterval);
    console.log('🔍 WebSocket 상태 모니터링 중지됨');
  };
};
