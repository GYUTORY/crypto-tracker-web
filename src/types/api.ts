// 공통 응답 타입
export interface ApiResponse<T = any> {
  result: boolean;
  msg: string;
  result_data: T;
  code: string;
}

// 가격 데이터 타입
export interface PriceData {
  symbol: string;
  price: string;
  timestamp: number;
}

// AI 분석 타입
export interface TechnicalAnalysis {
  rsi: {
    value: number;
    signal: 'oversold' | 'overbought' | 'neutral';
    explanation: string;
  };
  macd: {
    value: number;
    signal: 'neutral' | 'bullish' | 'bearish';
    explanation: string;
  };
  bollinger: {
    position: 'upper' | 'middle' | 'lower';
    signal: 'neutral' | 'bullish' | 'bearish';
    explanation: string;
  };
  movingAverages: {
    signal: 'bullish' | 'bearish' | 'neutral';
    explanation: string;
  };
  overallSignal: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  simpleAdvice: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskExplanation: string;
}

// 가격 예측 타입
export interface PricePrediction {
  symbol: string;
  currentPrice: string;
  predictions: TimeframePrediction[];
  supportLevels: string[];
  resistanceLevels: string[];
  confidence: number;
  analysis: {
    marketSentiment: string;
    keyFactors: string[];
    riskFactors: string[];
    recommendation: string;
    disclaimer: string;
  };
}

export interface TimeframePrediction {
  timeframe: string;
  predictedPrice: string;
  confidence: number;
  changePercent: number;
  trend: string;
  explanation: string;
}

// 코인 목록 타입
export interface TradingSymbols {
  symbols: string[];
  totalCount: number;
  filteredCount: number;
  categories: {
    usdt: string[];
    btc: string[];
    eth: string[];
    krw: string[];
    others: string[];
  };
  popularSymbols: string[];
  symbolNames: { [symbol: string]: string };
  symbolPrices: { [symbol: string]: { price: string; timestamp: number } };
}

// WebSocket 스트림 상태 타입
export interface StreamStatus {
  isConnected: boolean;
  url: string;
  subscriptions: string[];
  lastUpdate: string;
}

// TCP 상태 타입
export interface TcpStatus {
  connection: {
    isConnected: boolean;
    url: string;
    lastUpdate: string;
  };
  memory: {
    priceCount: number;
    symbols: string[];
    validityDuration: number;
  };
  timestamp: string;
}
