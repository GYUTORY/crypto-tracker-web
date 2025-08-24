import { useState, useEffect, useCallback } from 'react'
import { useChartAPI } from './useChartAPI'

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

export const useChartData = (symbol: string, interval: TimeInterval = '1h') => {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { getOHLCVData, initSampleData } = useChartAPI()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const chartData = await getOHLCVData(symbol, interval, 100)
      console.log('useChartData - received data:', chartData) // 디버깅용 로그
      if (chartData) {
        setData(chartData)
      } else {
        setError('데이터를 불러올 수 없습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [symbol, interval, getOHLCVData])

  const generateSampleData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const success = await initSampleData(symbol, interval, 100)
      if (success) {
        // 샘플 데이터 생성 후 자동으로 데이터 조회
        await fetchData()
      } else {
        setError('샘플 데이터 생성에 실패했습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '샘플 데이터 생성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [symbol, interval, initSampleData, fetchData])

  // 심볼이나 간격이 변경될 때 데이터 다시 조회
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    generateSampleData,
    clearError: () => setError(null)
  }
}
