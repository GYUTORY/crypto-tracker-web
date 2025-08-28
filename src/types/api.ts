/**
 * API 응답의 기본 구조
 * 모든 API 응답은 이 구조를 따릅니다
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

/**
 * API 에러 응답 구조
 * 에러가 발생했을 때의 응답 형태
 */
export interface ApiErrorResponse {
  success: false
  message: string
  error: {
    code: string
    details?: string
    timestamp: string
  }
}

/**
 * API 성공 응답 구조
 * 성공적인 응답의 형태
 */
export interface ApiSuccessResponse<T> {
  success: true
  message: string
  result_data: T
}

/**
 * API 응답 래퍼 타입
 * 성공 또는 실패를 구분할 수 있는 유니온 타입
 */
export type ApiResponseWrapper<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 실시간 가격 데이터 구조
 * 바이낸스 API에서 제공하는 실시간 가격 정보
 */
export interface PriceData {
  symbol: string;           // 코인 심볼 (예: 'BTCUSDT')
  price: string;            // 현재 가격 (문자열 형태)
  change?: string;          // 24시간 변동률 (문자열: "+2.45%")
  changePercent?: number;   // 24시간 변동률 (숫자: 2.45)
  volume24h?: string;       // 24시간 거래량 ("2.1B")
  high24h?: string;         // 24시간 고가
  low24h?: string;          // 24시간 저가
  marketCap?: string;       // 시가총액
  timestamp: number;        // 타임스탬프 (밀리초)
  source?: string;          // 데이터 소스
}

/**
 * 차트 데이터 포인트 구조
 * OHLCV (Open, High, Low, Close, Volume) 데이터
 */
export interface ChartDataPoint {
  timestamp: number;        // 타임스탬프 (밀리초)
  price: string;            // 가격
  volume: string;           // 거래량
  high: string;             // 고가
  low: string;              // 저가
}

/**
 * 차트 데이터 구조
 * 특정 코인의 차트 데이터를 포함합니다
 */
export interface ChartData {
  symbol: string;           // 코인 심볼
  timeframe: string;        // 시간 간격 (예: '1h', '4h', '1d')
  data: ChartDataPoint[];   // 차트 데이터 포인트 배열
}

/**
 * 시장 통계 데이터 구조
 * 전체 암호화폐 시장의 통계 정보
 */
export interface MarketStats {
  totalMarketCap: string;   // 전체 시가총액
  totalVolume24h: string;   // 24시간 총 거래량
  btcDominance: string;     // BTC 지배율 (%)
  activeCoins: number;      // 활성 코인 수
  marketChange24h: string;  // 24시간 시장 변동률
  fearGreedIndex: number;   // 공포탐욕 지수 (0-100)
  timestamp: number;        // 데이터 생성 시간
}

/**
 * AI 기술적 분석 결과 구조
 * Google Gemini AI가 제공하는 기술적 분석 정보
 */
export interface TechnicalAnalysis {
  rsi: {
    value: number;          // RSI 값 (0-100)
    signal: 'oversold' | 'overbought' | 'neutral';  // RSI 신호
    explanation: string;    // RSI 분석 설명
  };
  macd: {
    value: number;          // MACD 값
    signal: 'neutral' | 'bullish' | 'bearish';      // MACD 신호
    explanation: string;    // MACD 분석 설명
  };
  bollinger: {
    position: 'upper' | 'middle' | 'lower';         // 볼린저 밴드 위치
    signal: 'neutral' | 'bullish' | 'bearish';      // 볼린저 밴드 신호
    explanation: string;    // 볼린저 밴드 분석 설명
  };
  movingAverages: {
    signal: 'bullish' | 'bearish' | 'neutral';      // 이동평균선 신호
    explanation: string;    // 이동평균선 분석 설명
  };
  overallSignal: 'bullish' | 'bearish' | 'neutral'; // 종합 신호
  confidence: number;       // 신뢰도 (0-100)
  simpleAdvice: string;     // 간단한 투자 조언
  riskLevel: 'low' | 'medium' | 'high';             // 위험도
  riskExplanation: string;  // 위험도 설명
}

/**
 * 시간대별 예측 정보 구조
 * 특정 시간대의 가격 예측 결과
 */
export interface TimeframePrediction {
  timeframe: string;        // 예측 시간대 (예: '1h', '4h', '24h')
  predictedPrice: string;   // 예측 가격
  confidence: number;       // 예측 신뢰도 (0-100)
  changePercent: number;    // 예상 변동률 (%)
  trend: string;            // 예상 트렌드 (상승/하락/보합)
  explanation: string;      // 예측 근거 설명
}

/**
 * 가격 예측 결과 구조
 * AI가 제공하는 종합적인 가격 예측 정보
 */
export interface PricePrediction {
  symbol: string;           // 코인 심볼
  currentPrice: string;     // 현재 가격
  predictions: TimeframePrediction[];  // 시간대별 예측 배열
  supportLevels: string[];  // 지지선 배열
  resistanceLevels: string[]; // 저항선 배열
  confidence: number;       // 전체 예측 신뢰도
  analysis: {
    marketSentiment: string;    // 시장 심리 분석
    keyFactors: string[];       // 주요 영향 요인
    riskFactors: string[];      // 위험 요인
    recommendation: string;     // 투자 추천
    disclaimer: string;         // 면책 조항
  };
}

/**
 * 거래 가능한 코인 정보 구조
 * 거래소에서 지원하는 코인 목록
 */
export interface TradingSymbols {
  symbols: string[];        // 코인 심볼 배열
  total: number;            // 전체 코인 수
  categories?: string[];    // 코인 카테고리 (선택사항)
}

/**
 * 인기 코인 목록 구조
 * 인기 코인 목록 API 응답
 */
export interface PopularSymbols {
  popularSymbols: string[]; // 인기 코인 심볼 배열
  total: number;            // 전체 인기 코인 수
}

/**
 * 뉴스 아이템 구조
 * 암호화폐 관련 뉴스 정보
 */
export interface NewsItem {
  id: string;               // 뉴스 ID
  title: string;            // 뉴스 제목
  description: string;      // 뉴스 요약
  url: string;              // 뉴스 링크
  source: string;           // 뉴스 출처
  publishedAt: string;      // 발행 시간
  imageUrl?: string;        // 뉴스 이미지 (선택사항)
  sentiment?: 'positive' | 'negative' | 'neutral'; // 감정 분석 (선택사항)
}

/**
 * 뉴스 응답 구조
 * 뉴스 API의 기본 응답 형태
 */
export interface NewsResponse {
  articles: NewsItem[];     // 뉴스 기사 배열
  total: number;            // 전체 뉴스 수
}

/**
 * 뉴스 페이지네이션 응답 구조
 * 페이지네이션이 포함된 뉴스 응답
 */
export interface NewsPaginationResponse {
  articles: NewsItem[];     // 뉴스 기사 배열
  total: number;            // 전체 뉴스 수
  page: number;             // 현재 페이지
  limit: number;            // 페이지당 뉴스 수
  totalPages: number;       // 전체 페이지 수
}

/**
 * 뉴스 검색 파라미터 구조
 * 뉴스 검색 시 사용되는 파라미터
 */
export interface NewsSearchParams {
  q: string;                // 검색어
  limit?: number;           // 검색 결과 수 제한
  page?: number;            // 페이지 번호
}

/**
 * 뉴스 조회 파라미터 구조
 * 뉴스 목록 조회 시 사용되는 파라미터
 */
export interface NewsQueryParams {
  limit?: number;           // 조회할 뉴스 수
  page?: number;            // 페이지 번호
  source?: string;          // 뉴스 소스 필터
}

/**
 * 기술적 분석 요청 파라미터 구조
 * AI 기술적 분석 요청 시 사용되는 파라미터
 */
export interface TechnicalAnalysisParams {
  symbol: string;           // 코인 심볼
  price?: string;           // 현재 가격
  technicalData?: {
    rsi: number;
    macd: number;
    macdSignal: number;
    bollingerUpper: string;
    bollingerLower: string;
    ma20: string;
    ma50: string;
    volume: string;
    volumeChange: string;
  };
}

/**
 * 가격 예측 생성 파라미터 구조
 * 새로운 가격 예측 생성 시 사용되는 파라미터
 */
export interface PredictionCreateParams {
  symbol: string;           // 코인 심볼
  timeframes?: string[];    // 예측할 시간대 배열
  forceRefresh?: boolean;   // 강제 새로고침 여부
}

/**
 * 코인 심볼 조회 파라미터 구조
 * 코인 목록 조회 시 사용되는 파라미터
 */
export interface SymbolsQueryParams {
  filter?: string;          // 필터링 조건
  limit?: number;           // 조회할 코인 수 제한
}
