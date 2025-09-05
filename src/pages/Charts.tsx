import React, { useState } from 'react'
import { ChartContainer } from '../components/charts/ChartContainer'
import { ChartControls } from '../components/charts/ChartControls'

// 차트 기본 타입 정의
type ChartType = 'candlestick' | 'line' | 'bar'
type TimeInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M'

const Charts: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('BTCUSDT')
  const [interval, setInterval] = useState<TimeInterval>('1h')
  const [chartType, setChartType] = useState<ChartType>('candlestick')

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      background: 'var(--bg-primary)'
    }}>

      {/* 차트 컨트롤 */}
      <ChartControls
        symbol={symbol}
        interval={interval}
        chartType={chartType}
        onSymbolChange={setSymbol}
        onIntervalChange={setInterval}
        onChartTypeChange={setChartType}
      />

      {/* 메인 차트 */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <ChartContainer
          symbol={symbol}
          interval={interval}
          chartType={chartType}
          height={500}
        />
      </div>

      {/* 차트 정보 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* 차트 통계 */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-primary)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            📊 차트 정보
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>심볼:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{symbol}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>시간 간격:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                {interval === '1m' ? '1분' :
                 interval === '5m' ? '5분' :
                 interval === '15m' ? '15분' :
                 interval === '30m' ? '30분' :
                 interval === '1h' ? '1시간' :
                 interval === '4h' ? '4시간' :
                 interval === '1d' ? '1일' :
                 interval === '1w' ? '1주' :
                 interval === '1M' ? '1개월' : interval}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>차트 타입:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                {chartType === 'candlestick' ? '캔들스틱' :
                 chartType === 'line' ? '라인' :
                 chartType === 'bar' ? '거래량' : chartType}
              </span>
            </div>
          </div>
        </div>

        {/* 사용 가이드 */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-primary)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            💡 사용 가이드
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <div>• 심볼을 선택하여 다른 암호화폐 차트를 확인하세요</div>
            <div>• 시간 간격을 변경하여 다양한 시간대의 데이터를 분석하세요</div>
            <div>• 차트 타입을 변경하여 캔들스틱, 라인, 거래량 차트를 확인하세요</div>
            <div>• 데이터가 없는 경우 "샘플 데이터 생성" 버튼을 클릭하세요</div>
          </div>
        </div>
      </div>

      {/* 향후 기능 안내 */}
      <div style={{
        padding: '1.5rem',
        background: 'var(--bg-secondary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-primary)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          🚀 향후 추가 예정 기능
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          <div>📈 기술적 지표 (RSI, MACD, 볼린저 밴드)</div>
          <div>✏️ 드로잉 도구 (트렌드라인, 피보나치)</div>
          <div>⚡ 실시간 데이터 업데이트</div>
          <div>🎨 고급 차트 설정</div>
        </div>
      </div>
    </div>
  )
}

export default Charts;
