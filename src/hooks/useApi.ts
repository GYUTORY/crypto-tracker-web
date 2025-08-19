import { useQuery, useMutation } from '@tanstack/react-query';
import { priceApi, aiApi, predictionApi, symbolsApi, streamApi, tcpApi } from '../services/api';
import type { 
  ApiResponse, 
  PriceData, 
  TechnicalAnalysis, 
  PricePrediction, 
  TradingSymbols, 
  StreamStatus, 
  TcpStatus
} from '../types/api';

// 가격 관련 훅
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

// AI 분석 관련 훅
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

// 예측 관련 훅
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

// 심볼 관련 훅
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

export function useUsdtSymbols() {
  return useQuery({
    queryKey: ['usdt-symbols'],
    queryFn: async () => {
      const response: any = await symbolsApi.getUsdtSymbols();
      return response.result_data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 스트림 관련 훅
export function useStreamStatus() {
  return useQuery({
    queryKey: ['stream-status'],
    queryFn: async () => {
      const response: any = await streamApi.getStreamStatus();
      return response.result_data;
    },
    refetchInterval: 10000, // 10초마다 갱신
  });
}

export function useStreamSubscriptions() {
  return useQuery({
    queryKey: ['stream-subscriptions'],
    queryFn: async () => {
      const response: any = await streamApi.getStreamSubscriptions();
      return response.result_data;
    },
  });
}

export function useStreamSubscription(symbol: string) {
  return useQuery({
    queryKey: ['stream-subscription', symbol],
    queryFn: async () => {
      const response: any = await streamApi.getStreamSubscription(symbol);
      return response.result_data;
    },
    enabled: !!symbol,
  });
}

// TCP 관련 훅
export function useTcpStatus() {
  return useQuery({
    queryKey: ['tcp-status'],
    queryFn: async () => {
      const response: any = await tcpApi.getTcpStatus();
      return response.result_data;
    },
    refetchInterval: 10000,
  });
}

export function useTcpPrices() {
  return useQuery({
    queryKey: ['tcp-prices'],
    queryFn: async () => {
      const response: any = await tcpApi.getTcpPrices();
      return response.result_data;
    },
    refetchInterval: 5000, // 5초마다 갱신
  });
}

export function useTcpReconnect() {
  return useMutation({
    mutationFn: async () => {
      const response: any = await tcpApi.reconnectTcp();
      return response.result_data;
    },
  });
}
