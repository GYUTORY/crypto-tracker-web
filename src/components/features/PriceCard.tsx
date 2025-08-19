import React from 'react';
import { getKoreanCoinName } from '../../utils/coinNames';

interface PriceCardProps {
  symbol: string;
  price: string;
  change: string;
}

export function PriceCard({ symbol, price, change }: PriceCardProps) {
  const isPositive = change.startsWith('+');
  const isNegative = change.startsWith('-');
  const isNeutral = !isPositive && !isNegative;
  
  // 한국어 코인 이름 가져오기
  const koreanName = getKoreanCoinName(symbol);
  // 심볼에서 코인 이름 추출 (예: BTCUSDT -> BTC)
  const coinName = symbol.replace('USDT', '').replace('BTC', '').replace('ETH', '');
  
  // 가격 포맷팅 함수
  const formatPrice = (priceStr: string) => {
    const priceNum = parseFloat(priceStr);
    if (isNaN(priceNum)) return priceStr;
    
    // 1달러 미만인 경우 소수점 8자리까지 표시 (시바이누 등)
    if (priceNum < 1) {
      return priceNum.toFixed(8).replace(/\.?0+$/, '');
    }
    // 1달러 이상 1000달러 미만인 경우 소수점 2자리까지 표시
    else if (priceNum < 1000) {
      return priceNum.toFixed(2);
    }
    // 1000달러 이상인 경우 천 단위 구분자와 소수점 2자리까지 표시
    else {
      return priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  // 변동률 색상 및 스타일 결정
  const getChangeStyles = () => {
    if (isPositive) {
      return {
        color: 'var(--success-600)',
        background: 'var(--success-50)',
        borderColor: 'var(--success-500)',
        icon: '↗',
        label: '상승'
      };
    } else if (isNegative) {
      return {
        color: 'var(--error-600)',
        background: 'var(--error-50)',
        borderColor: 'var(--error-500)',
        icon: '↘',
        label: '하락'
      };
    } else {
      return {
        color: 'var(--gray-600)',
        background: 'var(--gray-100)',
        borderColor: 'var(--gray-400)',
        icon: '→',
        label: '변동없음'
      };
    }
  };

  const changeStyles = getChangeStyles();
  
  return (
    <div 
      className="card fade-in-up" 
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-6)',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        e.currentTarget.style.borderColor = 'var(--primary-300)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--gray-200)';
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = '2px solid var(--primary-500)';
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
      tabIndex={0}
      role="button"
      aria-label={`${koreanName} 가격 정보: ${formatPrice(price)} 달러, ${change}`}
    >
      {/* 상단 그라데이션 바 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--primary-500), var(--primary-600))',
        borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 코인 정보 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
          flexShrink: 0
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-2xl)',
            color: 'white',
            fontWeight: '800',
            boxShadow: 'var(--shadow-md)',
            flexShrink: 0,
            position: 'relative'
          }}>
            {coinName.charAt(0)}
            {/* 코인 아이콘 배경 효과 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: 'inherit'
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-xl)', 
              fontWeight: '700', 
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-1)',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {koreanName}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--gray-500)',
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {symbol}
            </p>
          </div>
        </div>
        
        {/* 가격 정보 */}
        <div style={{ 
          marginBottom: 'var(--space-5)',
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ width: '100%' }}>
            <p style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: '800', 
              color: 'var(--gray-900)',
              lineHeight: '1.2',
              fontFamily: 'Pretendard, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 'var(--space-1)'
            }}>
              ${formatPrice(price)}
            </p>
            <p style={{
              margin: 0,
              fontSize: 'var(--font-size-xs)',
              color: 'var(--gray-500)',
              fontWeight: '500'
            }}>
              미국 달러
            </p>
          </div>
        </div>
        
        {/* 변동률 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          flexShrink: 0
        }}>
          <span style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            color: changeStyles.color,
            padding: 'var(--space-2) var(--space-4)',
            background: changeStyles.background,
            borderRadius: 'var(--radius-lg)',
            border: `2px solid ${changeStyles.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '40px',
            position: 'relative'
          }}>
            <span style={{ 
              fontSize: 'var(--font-size-lg)', 
              flexShrink: 0,
              fontWeight: 'bold'
            }}>
              {changeStyles.icon}
            </span>
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              fontWeight: '600'
            }}>
              {change}
            </span>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              opacity: 0.8,
              marginLeft: 'auto',
              flexShrink: 0
            }}>
              {changeStyles.label}
            </span>
          </span>
        </div>
      </div>

      {/* 접근성을 위한 스크린 리더 전용 텍스트 */}
      <span style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        {koreanName} 현재 가격 {formatPrice(price)} 달러, {change} 변동
      </span>
    </div>
  );
}
