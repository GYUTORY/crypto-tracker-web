import { useQuery, useMutation } from '@tanstack/react-query';
import { priceApi, aiApi, predictionApi, symbolsApi, newsApi, marketApi, aiRecommendationsApi } from '../services/api';
import type { 
  ApiResponseWrapper,
  PriceData, 
  TechnicalAnalysis, 
  PricePrediction, 
  TradingSymbols, 
  PopularSymbols,
  NewsItem,
  NewsResponse,
  NewsPaginationResponse,
  NewsSearchParams,
  NewsQueryParams,
  ChartData,
  MarketStats,
  TechnicalAnalysisParams,
  PredictionCreateParams,
  SymbolsQueryParams,
  AIRecommendations,
  AIRecommendation,
  AllRecommendations
} from '../types/api';

/**
 * 동적 refetch 간격을 계산하는 유틸리티 함수
 * 페이지가 활성화되어 있을 때만 데이터를 갱신합니다
 */
const getRefetchInterval = (baseInterval: number) => {
  return document.visibilityState === 'visible' ? baseInterval : false;
};

/**
 * API 응답에서 데이터를 안전하게 추출하는 유틸리티 함수
 * @param response - API 응답
 * @returns 추출된 데이터 또는 null
 */
const extractData = <T>(response: any): T | null => {
  console.log('🔍 extractData 호출:', {
    response,
    hasResult: !!response.result,
    hasResultData: !!response.result_data,
    resultType: typeof response.result,
    resultDataType: typeof response.result_data,
    isDirectData: !response.result && !response.result_data
  });
  
  // ApiResponseWrapper 형태인 경우 (result, result_data 필드 포함)
  if (response.result && response.result_data !== undefined) {
    console.log('✅ ApiResponseWrapper 형태 데이터 추출 성공:', response.result_data);
    return response.result_data;
  }
  
  // 직접 데이터 형태인 경우 (API가 직접 데이터를 반환)
  if (!response.result && !response.result_data && response !== null) {
    console.log('✅ 직접 데이터 형태 추출 성공:', response);
    return response;
  }
  
  console.error('❌ API Error:', {
    message: response.msg || 'Unknown error',
    code: response.code || 'UNKNOWN',
    fullResponse: response
  });
  return null;
};

/**
 * 특정 코인의 실시간 가격 정보를 조회하는 훅
 * @param symbol - 코인 심볼 (예: 'BTCUSDT')
 * @returns React Query 결과 객체 (data, isLoading, error 등)
 * 
 * 특징:
 * - 페이지가 활성화되어 있을 때만 30초마다 자동으로 데이터를 갱신합니다
 * - 심볼이 유효한 경우에만 API를 호출합니다
 * - 캐시된 데이터를 우선적으로 사용합니다
 * - 성능 최적화를 위한 staleTime과 gcTime 설정
 */
export function usePrice(symbol: string) {
  return useQuery({
    queryKey: ['price', symbol],
    queryFn: async (): Promise<PriceData> => {
      const response = await priceApi.getPrice(symbol) as unknown as ApiResponseWrapper<PriceData>;
      const data = extractData(response);
      if (!data) {
        throw new Error(`Failed to fetch price for ${symbol}`);
      }
      return data;
    },
    enabled: !!symbol,
    refetchInterval: getRefetchInterval(30000), // 30초마다 갱신 (페이지 활성화 시에만)
    staleTime: 10 * 1000, // 10초간 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2, // 재시도 횟수 제한
    retryDelay: 1000, // 재시도 간격 1초
  });
}

/**
 * 여러 코인의 실시간 가격 정보를 동시에 조회하는 훅
 * @param symbols - 코인 심볼 배열 (예: ['BTCUSDT', 'ETHUSDT'])
 * @returns React Query 결과 객체 (data.prices 배열 포함)
 * 
 * 특징:
 * - 여러 API 요청을 병렬로 처리합니다
 * - 페이지가 활성화되어 있을 때만 30초마다 자동으로 데이터를 갱신합니다
 * - 빈 배열인 경우 API를 호출하지 않습니다
 * - 성능 최적화를 위한 캐시 설정
 */
export function usePrices(symbols: string[]) {
  return useQuery({
    queryKey: ['prices', symbols],
    queryFn: async (): Promise<{ prices: PriceData[] }> => {
      const responses = await priceApi.getPrices(symbols) as unknown as ApiResponseWrapper<PriceData>[];
      const prices = responses
        .map(response => extractData(response))
        .filter((data): data is PriceData => data !== null);
      
      if (prices.length === 0) {
        throw new Error('Failed to fetch any price data');
      }
      
      return { prices };
    },
    enabled: symbols.length > 0,
    refetchInterval: getRefetchInterval(30000), // 30초마다 갱신 (페이지 활성화 시에만)
    staleTime: 10 * 1000, // 10초간 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2,
    retryDelay: 1000,
  });
}

/**
 * 특정 코인의 차트 데이터를 조회하는 훅
 * @param symbol - 코인 심볼 (예: 'BTCUSDT')
 * @param timeframe - 시간 간격 (기본값: '1h')
 * @param limit - 데이터 포인트 수 (기본값: 24)
 * @returns React Query 결과 객체 (차트 데이터 포함)
 * 
 * 특징:
 * - 페이지가 활성화되어 있을 때만 2분마다 자동으로 데이터를 갱신합니다
 * - 캔들스틱 차트에 필요한 OHLCV 데이터를 제공합니다
 * - 다양한 시간대별 데이터를 지원합니다
 * - 차트 데이터는 상대적으로 안정적이므로 더 긴 캐시 시간 적용
 */
export function useChartData(symbol: string, timeframe: string = '1h', limit: number = 24) {
  return useQuery({
    queryKey: ['chart-data', symbol, timeframe, limit],
    queryFn: async (): Promise<ChartData> => {
      const response = await priceApi.getChartData(symbol, timeframe, limit) as unknown as ApiResponseWrapper<ChartData>;
      const data = extractData(response);
      if (!data) {
        throw new Error(`Failed to fetch chart data for ${symbol}`);
      }
      return data;
    },
    enabled: !!symbol,
    refetchInterval: getRefetchInterval(120000), // 2분마다 갱신 (페이지 활성화 시에만)
    staleTime: 60 * 1000, // 1분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 2,
    retryDelay: 2000,
  });
}

/**
 * 전체 암호화폐 시장의 통계 정보를 조회하는 훅
 * @returns React Query 결과 객체 (시장 통계 데이터 포함)
 * 
 * 특징:
 * - 페이지가 활성화되어 있을 때만 5분마다 자동으로 데이터를 갱신합니다
 * - 시가총액, 거래량, BTC 지배율 등 포함
 * - 공포탐욕 지수 등 시장 심리 지표 제공
 * - 시장 통계는 자주 변경되지 않으므로 긴 캐시 시간 적용
 */
export function useMarketStats() {
  return useQuery({
    queryKey: ['market-stats'],
    queryFn: async (): Promise<MarketStats> => {
      const response = await marketApi.getMarketStats() as unknown as ApiResponseWrapper<MarketStats>;
      const data = extractData(response);
      if (!data) {
        throw new Error('Failed to fetch market stats');
      }
      return data;
    },
    refetchInterval: getRefetchInterval(300000), // 5분마다 갱신 (페이지 활성화 시에만)
    staleTime: 2 * 60 * 1000, // 2분간 fresh 상태 유지
    gcTime: 15 * 60 * 1000, // 15분간 캐시 유지
    retry: 2,
    retryDelay: 3000,
  });
}

/**
 * AI 기반 기술적 분석을 요청하는 훅
 * @param symbol - 코인 심볼 (예: 'BTCUSDT')
 * @returns React Query 결과 객체 (기술적 분석 결과 포함)
 * 
 * 특징:
 * - RSI, MACD, 볼린저 밴드 등 기술적 지표 분석
 * - AI가 제공하는 투자 조언 및 위험도 평가
 * - 매수/매도/홀드 신호 제공
 * - AI 분석은 비용이 많이 드므로 긴 캐시 시간 적용
 */
export function useTechnicalAnalysis(symbol: string) {
  return useQuery({
    queryKey: ['technical-analysis', symbol],
    queryFn: async (): Promise<TechnicalAnalysis> => {
      const response = await aiApi.getTechnicalAnalysis(symbol) as unknown as ApiResponseWrapper<TechnicalAnalysis>;
      const data = extractData(response);
      if (!data) {
        throw new Error(`Failed to fetch technical analysis for ${symbol}`);
      }
      return data;
    },
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000, // 10분간 fresh 상태 유지
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
    retry: 1, // AI 분석은 재시도 횟수 제한
    retryDelay: 5000,
  });
}

/**
 * AI 기반 가격 예측을 조회하는 훅
 * @param symbol - 코인 심볼 (예: 'BTCUSDT')
 * @returns React Query 결과 객체 (가격 예측 결과 포함)
 * 
 * 특징:
 * - 다양한 시간대별 가격 예측 (1시간, 4시간, 24시간)
 * - 지지/저항선 분석
 * - 신뢰도 점수 및 시장 심리 분석
 * - 예측 데이터는 자주 변경되지 않으므로 긴 캐시 시간 적용
 */
export function usePricePrediction(symbol: string) {
  return useQuery({
    queryKey: ['price-prediction', symbol],
    queryFn: async (): Promise<PricePrediction> => {
      console.log('🔮 예측 API 호출:', symbol);
      const response = await predictionApi.getPricePrediction(symbol) as unknown as ApiResponseWrapper<PricePrediction>;
      console.log('🔮 예측 API 응답:', response);
      const data = extractData(response);
      if (!data) {
        throw new Error(`Failed to fetch price prediction for ${symbol}`);
      }
      return data;
    },
    enabled: !!symbol,
    retry: 2, // 재시도 횟수
    retryDelay: 2000, // 재시도 간격
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    gcTime: 20 * 60 * 1000, // 20분간 캐시 유지
  });
}

/**
 * 새로운 가격 예측을 생성하는 뮤테이션 훅
 * @param symbol - 코인 심볼 (예: 'BTCUSDT')
 * @returns React Query 뮤테이션 객체
 * 
 * 특징:
 * - 서버에서 새로운 예측 모델을 실행합니다
 * - 기존 캐시된 예측을 무시하고 새로 생성합니다
 * - 성공 시 예측 목록을 자동으로 갱신합니다
 */
export function useCreatePrediction(symbol: string) {
  return useMutation({
    mutationFn: async (): Promise<PricePrediction> => {
      const response = await predictionApi.createPricePrediction(symbol) as unknown as ApiResponseWrapper<PricePrediction>;
      const data = extractData(response);
      if (!data) {
        throw new Error(`Failed to create price prediction for ${symbol}`);
      }
      return data;
    },
    onSuccess: () => {
      // 성공 시 예측 목록을 다시 불러옴
    },
    retry: 1, // 뮤테이션은 재시도 횟수 제한
    retryDelay: 3000,
  });
}

/**
 * 전체 거래 가능한 코인 목록을 조회하는 훅
 * @returns React Query 결과 객체 (코인 목록 포함)
 * 
 * 특징:
 * - 10분간 캐시됩니다
 * - 거래소에서 지원하는 모든 코인 정보 제공
 * - 필터링 및 검색 기능 지원
 * - 코인 목록은 자주 변경되지 않으므로 긴 캐시 시간 적용
 */
export function useSymbols() {
  return useQuery({
    queryKey: ['symbols'],
    queryFn: async (): Promise<TradingSymbols> => {
      const response = await symbolsApi.getSymbols() as unknown as ApiResponseWrapper<TradingSymbols>;
      const data = extractData(response);
      if (!data) {
        throw new Error('Failed to fetch symbols');
      }
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10분간 캐시
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
    retry: 2,
    retryDelay: 2000,
  });
}

/**
 * 인기 코인 목록을 조회하는 훅
 * @returns React Query 결과 객체 (인기 코인 목록 포함)
 * 
 * 특징:
 * - 10분간 캐시됩니다
 * - 거래량, 시가총액 등을 기준으로 선별된 인기 코인
 * - 대시보드 및 메인 페이지에서 사용
 * - 인기 코인 목록은 상대적으로 안정적이므로 긴 캐시 시간 적용
 */
export function usePopularSymbols() {
  return useQuery({
    queryKey: ['popular-symbols'],
    queryFn: async (): Promise<PopularSymbols> => {
      const response = await symbolsApi.getPopularSymbols() as unknown as ApiResponseWrapper<PopularSymbols>;
      const data = extractData(response);
      if (!data) {
        throw new Error('Failed to fetch popular symbols');
      }
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10분간 캐시
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
    retry: 2,
    retryDelay: 2000,
  });
}

/**
 * 비트코인 관련 뉴스를 조회하는 훅
 * @returns React Query 결과 객체 (비트코인 뉴스 목록 포함)
 * 
 * 특징:
 * - 5분간 캐시됩니다
 * - 최신 비트코인 관련 뉴스 및 시장 동향
 * - 대시보드에서 실시간 뉴스 피드 제공
 * - 뉴스는 상대적으로 자주 업데이트되므로 적당한 캐시 시간 적용
 */
export const useBitcoinNews = () => {
  return useQuery({
    queryKey: ['bitcoin-news'],
    queryFn: async (): Promise<NewsResponse> => {
      console.log('📰 뉴스 API 호출 시작');
      const response = await newsApi.getBitcoinNews() as unknown as ApiResponseWrapper<NewsResponse>;
      console.log('📰 뉴스 API 응답:', response);
      const data = extractData(response);
      console.log('📰 추출된 뉴스 데이터:', data);
      if (!data) {
        throw new Error('Failed to fetch bitcoin news');
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: 2000,
  });
};

/**
 * 전체 암호화폐 뉴스를 조회하는 훅
 * @param params - 조회 파라미터 (limit, page, source)
 * @returns React Query 결과 객체 (뉴스 목록 및 페이지네이션 정보 포함)
 * 
 * 특징:
 * - 페이지네이션 지원
 * - 뉴스 소스별 필터링 가능
 * - 5분간 캐시됩니다
 * - 뉴스는 상대적으로 자주 업데이트되므로 적당한 캐시 시간 적용
 */
export const useAllNews = (params?: NewsQueryParams) => {
  return useQuery({
    queryKey: ['all-news', params],
    queryFn: async (): Promise<NewsPaginationResponse> => {
      const response = await newsApi.getAllNews(params) as unknown as ApiResponseWrapper<NewsPaginationResponse>;
      const data = extractData(response);
      if (!data) {
        throw new Error('Failed to fetch all news');
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: 2000,
  });
};

/**
 * 뉴스 검색을 수행하는 훅
 * @param params - 검색 파라미터 (q: 검색어, limit, page)
 * @returns React Query 결과 객체 (검색 결과 포함)
 * 
 * 특징:
 * - 검색어가 있을 때만 API를 호출합니다
 * - 5분간 캐시됩니다
 * - 실시간 검색 결과 제공
 * - 검색 결과는 검색어에 따라 달라지므로 적당한 캐시 시간 적용
 */
export const useNewsSearch = (params: NewsSearchParams) => {
  return useQuery({
    queryKey: ['news-search', params],
    queryFn: async (): Promise<NewsPaginationResponse> => {
      const response = await newsApi.searchNews(params) as unknown as ApiResponseWrapper<NewsPaginationResponse>;
      const data = extractData(response);
      if (!data) {
        throw new Error('Failed to search news');
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!params.q, // 검색어가 있을 때만 실행
    retry: 2,
    retryDelay: 2000,
  });
};

/**
 * 단기 AI 추천을 조회하는 훅 (1-7일)
 * @param enabled - 훅 활성화 여부 (기본값: true)
 * @returns React Query 결과 객체 (단기 추천 데이터 포함)
 * 
 * 특징:
 * - 한 번만 호출되고 캐시됨
 * - 1-7일 단기 투자를 위한 TOP 3 추천
 * - 기술적 돌파 및 단기 뉴스 이벤트 분석
 */
export const useShortTermRecommendations = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['short-term-recommendations'],
    queryFn: async (): Promise<AIRecommendations> => {
      console.log('🤖 단기 추천 API 호출');
      const response = await aiRecommendationsApi.getShortTermRecommendations();
      console.log('🤖 단기 추천 API 응답:', response);
      const data = extractData<AIRecommendations>(response);
      console.log('🤖 추출된 단기 추천 데이터:', data);
      if (!data) {
        throw new Error('Failed to fetch short-term recommendations');
      }
      return data;
    },
    enabled, // 활성화 여부 제어
    staleTime: Infinity, // 데이터를 항상 fresh로 유지 (재호출 방지)
    gcTime: Infinity, // 캐시를 영구적으로 유지
    retry: 1, // 재시도 횟수 최소화
    retryDelay: 1000, // 재시도 간격 단축
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재호출 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재호출 방지
    refetchOnReconnect: false, // 네트워크 재연결 시 재호출 방지
    refetchInterval: false, // 자동 재호출 비활성화
  });
};

/**
 * 중기 AI 추천을 조회하는 훅 (1-4주)
 * @param enabled - 훅 활성화 여부 (기본값: true)
 * @returns React Query 결과 객체 (중기 추천 데이터 포함)
 * 
 * 특징:
 * - 한 번만 호출되고 캐시됨
 * - 1-4주 중기 투자를 위한 TOP 3 추천
 * - 기본적 분석 및 시장 심리 분석
 */
export const useMediumTermRecommendations = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['medium-term-recommendations'],
    queryFn: async (): Promise<AIRecommendations> => {
      console.log('🤖 중기 추천 API 호출 시작');
      try {
        const response = await aiRecommendationsApi.getMediumTermRecommendations();
        console.log('🤖 중기 추천 API 응답:', response);
        
        const data = extractData<AIRecommendations>(response);
        console.log('🤖 추출된 중기 추천 데이터:', data);
        
        if (!data) {
          console.error('❌ 중기 추천 데이터 추출 실패');
          throw new Error('Failed to fetch medium-term recommendations');
        }
        
        console.log('✅ 중기 추천 데이터 성공적으로 추출됨');
        return data;
      } catch (error) {
        console.error('❌ 중기 추천 API 호출 중 오류:', error);
        throw error;
      }
    },
    enabled, // 활성화 여부 제어
    staleTime: Infinity, // 데이터를 항상 fresh로 유지 (재호출 방지)
    gcTime: Infinity, // 캐시를 영구적으로 유지
    retry: 1, // 재시도 횟수 최소화
    retryDelay: 1000, // 재시도 간격 단축
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재호출 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재호출 방지
    refetchOnReconnect: false, // 네트워크 재연결 시 재호출 방지
    refetchInterval: false, // 자동 재호출 비활성화
  });
};

/**
 * 장기 AI 추천을 조회하는 훅 (1-12개월)
 * @param enabled - 훅 활성화 여부 (기본값: true)
 * @returns React Query 결과 객체 (장기 추천 데이터 포함)
 * 
 * 특징:
 * - 한 번만 호출되고 캐시됨
 * - 1-12개월 장기 투자를 위한 TOP 3 추천
 * - 거시경제적 요소 및 규제 환경 분석
 */
export const useLongTermRecommendations = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['long-term-recommendations'],
    queryFn: async (): Promise<AIRecommendations> => {
      console.log('🤖 장기 추천 API 호출');
      const response = await aiRecommendationsApi.getLongTermRecommendations();
      console.log('🤖 장기 추천 API 응답:', response);
      const data = extractData<AIRecommendations>(response);
      console.log('🤖 추출된 장기 추천 데이터:', data);
      if (!data) {
        throw new Error('Failed to fetch long-term recommendations');
      }
      return data;
    },
    enabled, // 활성화 여부 제어
    staleTime: Infinity, // 데이터를 항상 fresh로 유지 (재호출 방지)
    gcTime: Infinity, // 캐시를 영구적으로 유지
    retry: 1, // 재시도 횟수 최소화
    retryDelay: 1000, // 재시도 간격 단축
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재호출 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재호출 방지
    refetchOnReconnect: false, // 네트워크 재연결 시 재호출 방지
    refetchInterval: false, // 자동 재호출 비활성화
  });
};

/**
 * 전체 AI 추천을 조회하는 훅 (단기, 중기, 장기)
 * @returns React Query 결과 객체 (전체 추천 데이터 포함)
 * 
 * 특징:
 * - 10분간 캐시됩니다
 * - 단기, 중기, 장기 추천을 모두 포함
 * - 전체 시장 상태 분석 제공
 * - 추천 데이터는 자주 변경되지 않으므로 긴 캐시 시간 적용
 */
export const useAllRecommendations = () => {
  return useQuery({
    queryKey: ['all-recommendations'],
    queryFn: async (): Promise<AllRecommendations> => {
      console.log('🤖 전체 추천 API 호출');
      const response = await aiRecommendationsApi.getAllRecommendations();
      console.log('🤖 전체 추천 API 응답:', response);
      const data = extractData<AllRecommendations>(response);
      console.log('🤖 추출된 전체 추천 데이터:', data);
      if (!data) {
        throw new Error('Failed to fetch all recommendations');
      }
      return data;
    },
    staleTime: Infinity, // 데이터를 항상 fresh로 유지 (재호출 방지)
    gcTime: Infinity, // 캐시를 영구적으로 유지
    retry: 1, // 재시도 횟수 최소화
    retryDelay: 1000, // 재시도 간격 단축
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재호출 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재호출 방지
    refetchOnReconnect: false, // 네트워크 재연결 시 재호출 방지
    refetchInterval: false, // 자동 재호출 비활성화
  });
};


