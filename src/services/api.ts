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

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);

/**
 * Axios 인스턴스 생성
 * 기본 설정 및 인터셉터를 포함한 HTTP 클라이언트
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60초 타임아웃
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
    console.log('✅ API Response:', response.config.url, response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.message);
    throw error;
  }
);

/**
 * 가격 관련 API 함수들
 * 실시간 가격 조회 및 차트 데이터 제공
 */
export const priceApi = {
  /**
   * 특정 코인의 실시간 가격 정보를 조회합니다
   * @param symbol - 코인 심볼 (예: 'BTCUSDT')
   * @returns Promise<PriceData> - 가격 데이터 객체
   */
  getPrice: (symbol: string) => {
    return api.get(`/price/${symbol}`);
  },
  
  /**
   * 여러 코인의 실시간 가격 정보를 병렬로 조회합니다
   * @param symbols - 코인 심볼 배열 (예: ['BTCUSDT', 'ETHUSDT'])
   * @returns Promise<PriceData[]> - 가격 데이터 배열
   */
  getPrices: (symbols: string[]) => {
    return Promise.all(
      symbols.map(symbol => api.get(`/price/${symbol}`))
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
    return api.get(`/price/${symbol}/chart?timeframe=${timeframe}&limit=${limit}`);
  },
};

/**
 * 시장 통계 관련 API 함수들
 * 전체 암호화폐 시장의 통계 정보 제공
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
    return api.get('/market/stats');
  },
};

/**
 * AI 분석 관련 API 함수들
 * Google Gemini AI를 활용한 기술적 분석 제공
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
 * 암호화폐 관련 뉴스 및 시장 동향 정보 제공
 */
export const newsApi = {
  /**
   * 비트코인 관련 뉴스를 조회합니다
   * @returns Promise<NewsResponse> - 비트코인 뉴스 목록
   */
  getBitcoinNews: () => {
    return api.get('/news/bitcoin');
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
    return api.get(`/news${queryString ? `?${queryString}` : ''}`);
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
    
    return api.get(`/news/search?${queryParams.toString()}`);
  },
};
