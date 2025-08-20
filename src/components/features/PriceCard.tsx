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
  
  const getCoinIcon = (symbol: string) => {
    const coin = symbol.replace('USDT', '');
    switch (coin) {
      case 'BTC':
        return '₿';
      case 'ETH':
        return 'Ξ';
      case 'BNB':
        return 'B';
      case 'ADA':
        return 'A';
      case 'SOL':
        return '◎';
      case 'SHIB':
        return '🐕';
      case 'DOT':
        return '●';
      case 'LINK':
        return '🔗';
      case 'UNI':
        return '🦄';
      case 'MATIC':
        return 'M';
      default:
        return coin.slice(0, 1);
    }
  };

  const getCoinName = (symbol: string) => {
    const coin = symbol.replace('USDT', '');
    switch (coin) {
      case 'BTC':
        return 'Bitcoin';
      case 'ETH':
        return 'Ethereum';
      case 'BNB':
        return 'Binance Coin';
      case 'ADA':
        return 'Cardano';
      case 'SOL':
        return 'Solana';
      case 'SHIB':
        return 'Shiba Inu';
      case 'DOT':
        return 'Polkadot';
      case 'LINK':
        return 'Chainlink';
      case 'UNI':
        return 'Uniswap';
      case 'MATIC':
        return 'Polygon';
      default:
        return coin;
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '로딩 중...';
    
    if (numPrice >= 1000) {
      return `$${numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (numPrice >= 1) {
      return `$${numPrice.toFixed(2)}`;
    } else {
      return `$${numPrice.toFixed(4)}`;
    }
  };

  return (
    <div className="group">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {getCoinIcon(symbol)}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{getCoinName(symbol)}</h3>
              <p className="text-gray-400 text-sm">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white mb-1">
              {formatPrice(price)}
            </div>
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${
              isPositive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : isNegative 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {isPositive ? '↗' : isNegative ? '↘' : '→'} {change}
            </div>
          </div>
        </div>
        
        {/* 미니 차트 영역 */}
        <div className="h-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 flex items-center justify-center">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-1 h-12 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-1 h-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-1 h-10 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-1 h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-1 h-14 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-1 h-9 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
        
        {/* 추가 정보 */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>24h Volume</span>
          <span className="text-purple-300">$1.2B</span>
        </div>
      </div>
    </div>
  );
}
