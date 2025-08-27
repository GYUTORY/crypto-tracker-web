import React, { memo } from 'react';
import type { PriceData } from '../../types/api';

interface PriceCardProps {
  priceData: PriceData;
  onClick?: () => void;
}

const PriceCard: React.FC<PriceCardProps> = memo(({ priceData, onClick }) => {
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 1000) {
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (num >= 1) {
      return `$${num.toFixed(2)}`;
    } else {
      return `$${num.toFixed(4)}`;
    }
  };

  const getCoinIcon = (symbol: string) => {
    const coinName = symbol.replace('USDT', '').toLowerCase();
    const iconMap: { [key: string]: string } = {
      btc: '₿',
      eth: 'Ξ',
      bnb: '🟡',
      ada: '₳',
      sol: '◎',
      shib: '🐕',
      dot: '●',
      link: '🔗',
      uni: '🦄',
      matic: '💜',
      etc: '⟠'
    };
    return iconMap[coinName] || symbol.slice(0, 1);
  };

  const getCoinName = (symbol: string) => {
    const coinName = symbol.replace('USDT', '').toLowerCase();
    const nameMap: { [key: string]: string } = {
      btc: 'Bitcoin',
      eth: 'Ethereum',
      bnb: 'Binance Coin',
      ada: 'Cardano',
      sol: 'Solana',
      shib: 'Shiba Inu',
      dot: 'Polkadot',
      link: 'Chainlink',
      uni: 'Uniswap',
      matic: 'Polygon',
      etc: 'Ethereum Classic'
    };
    return nameMap[coinName] || symbol.replace('USDT', '');
  };

  return (
    <div 
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '1.75rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.5s',
        cursor: onClick ? 'pointer' : 'default',
        minHeight: '280px'
      }}
      onClick={onClick}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
        borderRadius: '1.5rem',
        opacity: 0,
        transition: 'opacity 0.5s'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'var(--gradient-secondary)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-inverse)',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              {getCoinIcon(priceData.symbol)}
            </div>
            <div>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>
                {getCoinName(priceData.symbol)}
              </h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
                {priceData.symbol}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: '120px' }}>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: '900', 
              color: 'var(--text-primary)', 
              marginBottom: '0.5rem',
              lineHeight: '1.2'
            }}>
              {formatPrice(priceData.price)}
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              background: priceData.change?.startsWith('+') 
                ? 'rgba(34, 197, 94, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)',
              color: priceData.change?.startsWith('+') 
                ? 'var(--status-success)' 
                : 'var(--status-error)',
              border: `1px solid ${priceData.change?.startsWith('+') 
                ? 'rgba(34, 197, 94, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'inline-block',
              minWidth: '70px',
              textAlign: 'center'
            }}>
              {priceData.change || '+0.00%'}
            </div>
          </div>
        </div>
        
        {/* 추가 메트릭스 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          fontSize: '0.875rem',
          padding: '0.75rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '0.5rem', 
              height: '0.5rem', 
              background: 'var(--text-accent)', 
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(167, 139, 250, 0.5)'
            }}></div>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: '500' }}>24h Vol</span>
          </div>
          <span style={{ 
            color: 'var(--text-accent)', 
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            {priceData.volume24h ? `$${priceData.volume24h}` : '$2.1B'}
          </span>
        </div>
      </div>
    </div>
  );
});

PriceCard.displayName = 'PriceCard';

export default PriceCard;
