// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// 가격 데이터 타입
export interface PriceData {
  symbol: string;
  price: string;
  change?: string;           // 24시간 변동률 (문자열: "+2.45%")
  changePercent?: number;    // 24시간 변동률 (숫자: 2.45)
  volume24h?: string;        // 24시간 거래량 ("2.1B")
  high24h?: string;          // 24시간 고가
  low24h?: string;           // 24시간 저가
  marketCap?: string;        // 시가총액
  timestamp: number;
  source?: string;
}

// 차트 데이터 타입
export interface ChartDataPoint {
  timestamp: number;
  price: string;
  volume: string;
  high: string;
  low: string;
}

export interface ChartData {
  symbol: string;
  timeframe: string;
  data: ChartDataPoint[];
}

// 시장 통계 타입
export interface MarketStats {
  totalMarketCap: string;
  totalVolume24h: string;
  btcDominance: string;
  activeCoins: number;
  marketChange24h: string;
  fearGreedIndex: number;
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

// 뉴스 관련 타입들
export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  originalDescription?: string;
  originalTitle?: string;
  content?: string;
  url?: string;
  source?: string;
  publishedAt?: string;
  summary?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  translatedTitle?: string;
  translatedContent?: string;
}

export interface NewsResponse {
  result: boolean;
  msg: string;
  result_data: {
    le: string;
    msg: string;
    result: boolean;
    lastUpdated: string;
    news: NewsItem[];
    sources: string[];
    totalCount: number;
  };
}

export interface NewsPaginationResponse {
  result: boolean;
  msg: string;
  result_data: {
    le: string;
    msg: string;
    result: boolean;
    lastUpdated: string;
    news: NewsItem[];
    sources: string[];
    totalCount: number;
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface NewsSearchParams {
  q?: string;
  limit?: number;
  page?: number;
  source?: string;
}
