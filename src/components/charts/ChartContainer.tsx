import React, { useEffect, useRef, useState } from 'react'
import { useChartData } from '../../hooks/useChartData'
import { useTheme } from '../../contexts/ThemeContext'
import { formatChartData, getChartColors } from '../../utils/chartUtils'

// 차트 기본 타입 정의
type ChartType = 'candlestick' | 'line' | 'bar'
type TimeInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M'

interface ChartContainerProps {
  symbol: string
  interval: TimeInterval
  chartType: ChartType
  height?: number
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  symbol,
  interval,
  chartType,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const { data, loading, error, generateSampleData } = useChartData(symbol, interval)

  // 차트 그리기
  useEffect(() => {
    if (!canvasRef.current || !data || !data.data || data.data.length === 0) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = getChartColors(theme)
    const chartData = formatChartData(data.data, chartType)
    
    // 캔버스 크기 설정
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // 배경 그리기
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    if (chartType === 'line' && chartData.length > 0) {
      // 라인 차트 그리기
      const padding = 40
      const chartWidth = canvas.width - 2 * padding
      const chartHeight = canvas.height - 2 * padding
      
      // 데이터 범위 계산
      const values = chartData.map((item: any) => item.value)
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      const valueRange = maxValue - minValue
      
      // 라인 그리기
      ctx.strokeStyle = colors.upColor
      ctx.lineWidth = 2
      ctx.beginPath()
      
      chartData.forEach((item: any, index: number) => {
        const x = padding + (index / (chartData.length - 1)) * chartWidth
        const y = padding + chartHeight - ((item.value - minValue) / valueRange) * chartHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // 축 그리기
      ctx.strokeStyle = colors.grid
      ctx.lineWidth = 1
      
      // Y축
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.stroke()
      
      // X축
      ctx.beginPath()
      ctx.moveTo(padding, canvas.height - padding)
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.stroke()
      
      // 가격 레이블
      ctx.fillStyle = colors.text
      ctx.font = '12px Arial'
      ctx.textAlign = 'right'
      ctx.fillText(maxValue.toFixed(2), padding - 5, padding + 10)
      ctx.fillText(minValue.toFixed(2), padding - 5, canvas.height - padding - 5)
    }
  }, [data, chartType, theme])

  // 로딩 상태
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>📊</div>
          <div>차트 로딩 중...</div>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-primary)',
        padding: '2rem'
      }}>
        <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>⚠️</div>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>차트 로드 실패</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{error}</div>
        </div>
        <button
          onClick={generateSampleData}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--gradient-secondary)',
            color: 'var(--text-primary)',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          샘플 데이터 생성
        </button>
      </div>
    )
  }

  // 데이터가 없는 경우
  if (!data || data.data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-primary)',
        padding: '2rem'
      }}>
        <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>📈</div>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>데이터가 없습니다</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {symbol}의 {interval} 데이터를 찾을 수 없습니다.
          </div>
        </div>
        <button
          onClick={generateSampleData}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--gradient-secondary)',
            color: 'var(--text-primary)',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          샘플 데이터 생성
        </button>
      </div>
    )
  }

  console.log('Rendering chart container with:', {
    hasData: !!data,
    dataLength: data?.data?.length,
    loading,
    error
  })

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '0.75rem',
      border: '1px solid var(--border-primary)',
      overflow: 'hidden',
      width: '100%',
      height: height,
      position: 'relative'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }} 
      />
    </div>
  )
}
