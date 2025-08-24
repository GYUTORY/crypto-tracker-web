import { useState, useCallback } from 'react'

// 차트 기본 타입 정의
interface OHLCVData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface ChartData {
  symbol: string
  interval: string
  data: OHLCVData[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}

type TimeInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M'

// 차트 API 응답 타입 정의
interface ChartApiResponse<T> {
  result: boolean
  msg: string
  code: string
  result_data: T
}

const BASE_URL = 'http://localhost:3000'

export const useChartAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OHLCV 데이터 조회
  const getOHLCVData = useCallback(async (
    symbol: string, 
    interval: TimeInterval = '1h', 
    limit: number = 100
  ): Promise<ChartData | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${BASE_URL}/chart/ohlcv/${symbol}?interval=${interval}&limit=${limit}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result: ChartApiResponse<ChartData> = await response.json()
      
      if (!result.result) {
        throw new Error(result.msg)
      }
      
      return result.result_data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // 샘플 데이터 초기화
  const initSampleData = useCallback(async (
    symbol: string, 
    interval: TimeInterval = '1h', 
    count: number = 100
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${BASE_URL}/chart/init-sample-data/${symbol}?interval=${interval}&count=${count}`,
        { method: 'POST' }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (!result.result) {
        throw new Error(result.msg)
      }
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '샘플 데이터 생성에 실패했습니다.'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    getOHLCVData,
    initSampleData,
    loading,
    error,
    clearError: () => setError(null)
  }
}
