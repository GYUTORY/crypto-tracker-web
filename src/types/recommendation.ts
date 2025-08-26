// 추천 근거 타입
export enum RecommendationReasonType {
  TECHNICAL_BREAKOUT = 'technical_breakout',
  FUNDAMENTAL_STRENGTH = 'fundamental_strength',
  MARKET_SENTIMENT = 'market_sentiment',
  VOLUME_SPIKE = 'volume_spike',
  NEWS_POSITIVE = 'news_positive',
  INSTITUTIONAL_INTEREST = 'institutional_interest',
  ECOSYSTEM_GROWTH = 'ecosystem_growth',
  REGULATORY_CLARITY = 'regulatory_clarity'
}

// 추천 근거 데이터
export interface RecommendationReason {
  type: RecommendationReasonType;
  description: string;
  confidence: number;
  data?: string;
}

// 추천 코인 데이터
export interface RecommendedCoin {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  expectedReturn: number;
  riskScore: number;
  recommendationScore: number;
  reasons: RecommendationReason[];
  analysis: string;
  targetPrice: number;
  stopLoss: number;
}

// 단일 타임프레임 응답
export interface CoinRecommendationResponse {
  timeframe: 'short_term' | 'medium_term' | 'long_term';
  timeframeDescription: string;
  recommendations: RecommendedCoin[];
  generatedAt: string;
  modelInfo: string;
  marketAnalysis: string;
}

// 모든 타임프레임 응답
export interface AllRecommendationsResponse {
  shortTerm: CoinRecommendationResponse;
  mediumTerm: CoinRecommendationResponse;
  longTerm: CoinRecommendationResponse;
  overallMarketStatus: string;
  generatedAt: string;
}

// API 응답 래퍼
export interface ApiResponse<T> {
  result: boolean;
  msg: string;
  result_data: T;
  code: string;
}

// 모든 타입을 다시 export
export type {
  RecommendationReason,
  RecommendedCoin,
  CoinRecommendationResponse,
  AllRecommendationsResponse,
  ApiResponse
};
