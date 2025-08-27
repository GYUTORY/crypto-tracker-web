import React, { useEffect, useRef, useState } from 'react'
import { useChartData } from '../../hooks/useApi'
import { useTheme } from '../../contexts/ThemeContext'
import { getChartColors } from '../../utils/chartUtils'

/**
 * 차트 컨테이너 컴포넌트
 * 
 * @param symbol - 차트에 표시할 코인 심볼 (예: 'BTCUSDT')
 * @param interval - 차트 시간 간격 (기본값: '1h')
 * @param height - 차트 높이 (기본값: 400)
 * 
 * 기능:
 * - 실시간 차트 데이터 표시
 * - 다크/라이트 테마 지원
 * - 반응형 차트 크기 조정
 * - 샘플 데이터 생성 기능
 */
interface ChartContainerProps {
  symbol: string
  interval?: string
  height?: number
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  symbol, 
  interval = '1h', 
  height = 400 
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { data, isLoading, error } = useChartData(symbol, interval, 24)

  // 차트 색상 테마 설정
  const colors = getChartColors(theme)

  useEffect(() => {
    if (data && chartRef.current) {
      // 차트 데이터 포맷팅 및 렌더링 로직
      console.log('Chart data received:', data)
      
      // 여기에 실제 차트 렌더링 로직 추가
      // (Chart.js, Recharts, 또는 다른 차트 라이브러리 사용)
    }
  }, [data, theme])

  if (isLoading) {
    return (
      <div style={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: colors.background,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ color: colors.text }}>차트 데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        height, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: colors.background,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        gap: '1rem'
      }}>
        <div style={{ color: colors.text }}>차트 데이터를 불러올 수 없습니다.</div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            background: colors.accent,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div 
      ref={chartRef}
      style={{ 
        height, 
        background: colors.background,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        padding: '1rem'
      }}
    >
      {/* 차트가 여기에 렌더링됩니다 */}
      <div style={{ color: colors.text, textAlign: 'center' }}>
        {symbol} 차트 ({interval})
      </div>
    </div>
  )
}
