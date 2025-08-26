import { useQuery, useMutation } from '@tanstack/react-query';
import { priceApi, aiApi, predictionApi, symbolsApi, newsApi, marketApi } from '../services/api';
import type { 
  ApiResponse, 
  PriceData, 
  TechnicalAnalysis, 
  PricePrediction, 
  TradingSymbols, 
  NewsItem,
  NewsResponse,
  NewsPaginationResponse,
  ChartData,
  MarketStats
} from '../types/api';

/**
 * 특정 코인의 실시간 가격 정보를 조회하는 훅
 * @param symbol - 코인 심볼 (예: 'BTCUSDT')
 * @returns React Query 결과 객체 (data, isLoading, error 등)
 * 
 * 특징:
 * - 30초마다 자동으로 데이터를 갱신합니다
 * - 심볼이 유효한 경우에만 API를 호출합니다
 * - 캐시된 데이터를 우선적으로 사용합니다
 */
export function usePrice(symbol: string) {
  return useQuery({
    queryKey: ['price', symbol],
    queryFn: async () => {
      const response: any = await priceApi.getPrice(symbol);
      return response.result_data;
    },
    enabled: !!symbol,
    refetchInterval: 30000, // 30초마다 갱신
  });
}

/**
 * 여러 코인의 실시간 가격 정보를 동시에 조회하는 훅
 * @param symbols - 코인 심볼 배열 (예: ['BTCUSDT', 'ETHUSDT'])
 * @returns React Query 결과 객체 (data.prices 배열 포함)
 * 
 * 특징:
 * - 여러 API 요청을 병렬로 처리합니다
 * - 30초마다 자동으로 데이터를 갱신합니다
 * - 빈 배열인 경우 API를 호출하지 않습니다
 */
export function usePrices(symbols: string[]) {
  return useQuery({
    queryKey: ['prices', symbols],
    queryFn: async () => {
      const responses: any[] = await priceApi.getPrices(symbols);
      return {
        prices: responses.map((response: any) => response.result_data)
      };
    },
    enabled: symbols.length > 0,
    refetchInterval: 30000,
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
 * - 1분마다 자동으로 데이터를 갱신합니다
 * - 캔들스틱 차트에 필요한 OHLCV 데이터를 제공합니다
 * - 다양한 시간대별 데이터를 지원합니다
 */
export function useChartData(symbol: string, timeframe: string = '1h', limit: number = 24) {
  return useQuery({
    queryKey: ['chart-data', symbol, timeframe, limit],
    queryFn: async () => {
      const response: any = await priceApi.getChartData(symbol, timeframe, limit);
      return response.result_data;
    },
    enabled: !!symbol,
    refetchInterval: 60000, // 1분마다 갱신
  });
}

/**
 * 전체 암호화폐 시장의 통계 정보를 조회하는 훅
 * @returns React Query 결과 객체 (시장 통계 데이터 포함)
 * 
 * 특징:
 * - 5분마다 자동으로 데이터를 갱신합니다
 * - 시가총액, 거래량, BTC 지배율 등 포함
 * - 공포탐욕 지수 등 시장 심리 지표 제공
 */
export function useMarketStats() {
  return useQuery({
    queryKey: ['market-stats'],
    queryFn: async () => {
      const response: any = await marketApi.getMarketStats();
      return response.result_data;
    },
    refetchInterval: 300000, // 5분마다 갱신
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
 */
export function useTechnicalAnalysis(symbol: string) {
  return useQuery({
    queryKey: ['technical-analysis', symbol],
    queryFn: async () => {
      const response: any = await aiApi.getTechnicalAnalysis(symbol);
      return response.result_data;
    },
    enabled: !!symbol,
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
 * - 2분간 캐시되며 3회 재시도 지원
 */
export function usePricePrediction(symbol: string) {
  return useQuery({
    queryKey: ['price-prediction', symbol],
    queryFn: async () => {
      console.log('🔮 예측 API 호출:', symbol);
      const response: any = await predictionApi.getPricePrediction(symbol);
      console.log('🔮 예측 API 응답:', response);
      return response.result_data;
    },
    enabled: !!symbol,
    retry: 3, // 재시도 횟수 증가
    retryDelay: 2000, // 재시도 간격
    staleTime: 2 * 60 * 1000, // 2분간 캐시
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
    mutationFn: async () => {
      const response: any = await predictionApi.createPricePrediction(symbol);
      return response.result_data;
    },
    onSuccess: () => {
      // 성공 시 예측 목록을 다시 불러옴
    },
  });
}

/**
 * 전체 거래 가능한 코인 목록을 조회하는 훅
 * @returns React Query 결과 객체 (코인 목록 포함)
 * 
 * 특징:
 * - 5분간 캐시됩니다
 * - 거래소에서 지원하는 모든 코인 정보 제공
 * - 필터링 및 검색 기능 지원
 */
export function useSymbols() {
  return useQuery({
    queryKey: ['symbols'],
    queryFn: async () => {
      const response: any = await symbolsApi.getSymbols();
      return response.result_data;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시
  });
}

/**
 * 인기 코인 목록을 조회하는 훅
 * @returns React Query 결과 객체 (인기 코인 목록 포함)
 * 
 * 특징:
 * - 5분간 캐시됩니다
 * - 거래량, 시가총액 등을 기준으로 선별된 인기 코인
 * - 대시보드 및 메인 페이지에서 사용
 */
export function usePopularSymbols() {
  return useQuery({
    queryKey: ['popular-symbols'],
    queryFn: async () => {
      const response: any = await symbolsApi.getPopularSymbols();
      return response.result_data;
    },
    staleTime: 5 * 60 * 1000,
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
 */
export const useBitcoinNews = () => {
  return useQuery({
    queryKey: ['bitcoin-news'],
    queryFn: async () => {
      const response: any = await newsApi.getBitcoinNews();
      return response.result_data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
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
 */
export const useAllNews = (params?: { limit?: number; page?: number; source?: string }) => {
  return useQuery({
    queryKey: ['all-news', params],
    queryFn: async () => {
      const response: any = await newsApi.getAllNews(params);
      return response.result_data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
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
 */
export const useNewsSearch = (params: { q: string; limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['news-search', params],
    queryFn: async () => {
      const response: any = await newsApi.searchNews(params);
      return response.result_data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!params.q, // 검색어가 있을 때만 실행
  });
};
