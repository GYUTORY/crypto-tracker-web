import React from 'react'

// 차트 기본 타입 정의
type ChartType = 'candlestick' | 'line' | 'bar'
type TimeInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M'

interface ChartControlsProps {
  symbol: string
  interval: TimeInterval
  chartType: ChartType
  onSymbolChange: (symbol: string) => void
  onIntervalChange: (interval: TimeInterval) => void
  onChartTypeChange: (chartType: ChartType) => void
}

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT']
const INTERVALS: { value: TimeInterval; label: string }[] = [
  { value: '1m', label: '1분' },
  { value: '5m', label: '5분' },
  { value: '15m', label: '15분' },
  { value: '30m', label: '30분' },
  { value: '1h', label: '1시간' },
  { value: '4h', label: '4시간' },
  { value: '1d', label: '1일' },
  { value: '1w', label: '1주' },
  { value: '1M', label: '1개월' },
]
const CHART_TYPES: { value: ChartType; label: string; icon: string }[] = [
  { value: 'candlestick', label: '캔들스틱', icon: '📊' },
  { value: 'line', label: '라인', icon: '📈' },
  { value: 'bar', label: '거래량', icon: '📊' },
]

export const ChartControls: React.FC<ChartControlsProps> = ({
  symbol,
  interval,
  chartType,
  onSymbolChange,
  onIntervalChange,
  onChartTypeChange,
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: 'var(--bg-secondary)',
      borderRadius: '0.75rem',
      border: '1px solid var(--border-primary)',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* 심볼 선택 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap'
        }}>
          심볼:
        </label>
        <select
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            minWidth: '120px'
          }}
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* 시간 간격 선택 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap'
        }}>
          간격:
        </label>
        <select
          value={interval}
          onChange={(e) => onIntervalChange(e.target.value as TimeInterval)}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            minWidth: '100px'
          }}
        >
          {INTERVALS.map((int) => (
            <option key={int.value} value={int.value}>
              {int.label}
            </option>
          ))}
        </select>
      </div>

      {/* 차트 타입 선택 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap'
        }}>
          차트:
        </label>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {CHART_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => onChartTypeChange(type.value)}
              style={{
                padding: '0.5rem 0.75rem',
                background: chartType === type.value ? 'var(--gradient-secondary)' : 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s ease',
                minWidth: '80px',
                justifyContent: 'center'
              }}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 현재 선택된 정보 표시 */}
      <div style={{
        marginLeft: 'auto',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        border: '1px solid var(--border-primary)'
      }}>
        {symbol} • {INTERVALS.find(i => i.value === interval)?.label} • {CHART_TYPES.find(t => t.value === chartType)?.label}
      </div>
    </div>
  )
}
