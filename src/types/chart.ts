// 차트 기본 타입 정의
export interface OHLCVData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ChartData {
  symbol: string
  interval: string
  data: OHLCVData[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}

export type ChartType = 'candlestick' | 'line' | 'bar'
export type TimeInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M'



// 차트 설정 타입
export interface ChartSettings {
  theme: 'dark' | 'light'
  timezone: string
  autoSave: boolean
  chartType: ChartType
  interval: TimeInterval
}

// 차트 상태 타입
export interface ChartState {
  symbol: string
  interval: TimeInterval
  chartType: ChartType
  loading: boolean
  error: string | null
  data: ChartData | null
  settings: ChartSettings
}
