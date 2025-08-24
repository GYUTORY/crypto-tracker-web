// 차트 기본 타입 정의
interface OHLCVData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type ChartType = 'candlestick' | 'line' | 'bar'

// OHLCV 데이터를 TradingView 형식으로 변환
export const formatOHLCVData = (data: OHLCVData[]) => {
  return data.map(item => ({
    time: Math.floor(item.timestamp / 1000), // TradingView는 초 단위 사용, 정수로 변환
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
  }))
}

// 거래량 데이터를 TradingView 형식으로 변환
export const formatVolumeData = (data: OHLCVData[]) => {
  return data.map(item => ({
    time: Math.floor(item.timestamp / 1000),
    value: item.volume,
  }))
}

// 라인 차트용 데이터 변환 (종가 기준)
export const formatLineData = (data: OHLCVData[]) => {
  return data.map(item => ({
    time: Math.floor(item.timestamp / 1000),
    value: item.close,
  }))
}

// 차트 타입에 따른 데이터 변환
export const formatChartData = (data: OHLCVData[], chartType: ChartType) => {
  switch (chartType) {
    case 'candlestick':
      return formatOHLCVData(data)
    case 'line':
      return formatLineData(data)
    case 'bar':
      return formatVolumeData(data)
    default:
      return formatOHLCVData(data)
  }
}

// 가격 포맷팅
export const formatPrice = (price: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price)
}

// 거래량 포맷팅
export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`
  }
  return volume.toFixed(2)
}

// 시간 포맷팅
export const formatTime = (timestamp: number, interval: string): string => {
  const date = new Date(timestamp)
  
  switch (interval) {
    case '1m':
    case '5m':
    case '15m':
    case '30m':
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    case '1h':
    case '4h':
      return date.toLocaleString('ko-KR', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit' 
      })
    case '1d':
    case '1w':
    case '1M':
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    default:
      return date.toLocaleString('ko-KR')
  }
}

// 차트 색상 테마
export const getChartColors = (theme: 'dark' | 'light') => {
  if (theme === 'dark') {
    return {
      background: '#1a1a1a',
      text: '#ffffff',
      grid: '#333333',
      upColor: '#26a69a',
      downColor: '#ef5350',
      border: '#444444',
    }
  } else {
    return {
      background: '#ffffff',
      text: '#000000',
      grid: '#f0f0f0',
      upColor: '#26a69a',
      downColor: '#ef5350',
      border: '#e0e0e0',
    }
  }
}

// 차트 크기 계산
export const calculateChartSize = (containerWidth: number, containerHeight: number) => {
  return {
    width: Math.max(containerWidth, 400),
    height: Math.max(containerHeight, 300),
  }
}
