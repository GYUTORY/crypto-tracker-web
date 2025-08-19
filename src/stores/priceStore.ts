import { create } from 'zustand';
import { PriceData } from '../types/api';

interface PriceStore {
  prices: { [symbol: string]: PriceData };
  setPrice: (priceData: PriceData) => void;
  setPrices: (prices: PriceData[]) => void;
  removePrice: (symbol: string) => void;
  clearPrices: () => void;
  getPrice: (symbol: string) => PriceData | null;
  getAllPrices: () => PriceData[];
}

export const usePriceStore = create<PriceStore>((set, get) => ({
  prices: {},
  
  setPrice: (priceData: PriceData) => {
    set((state) => ({
      prices: {
        ...state.prices,
        [priceData.symbol]: priceData,
      },
    }));
  },
  
  setPrices: (prices: PriceData[]) => {
    const priceMap = prices.reduce((acc, price) => {
      acc[price.symbol] = price;
      return acc;
    }, {} as { [symbol: string]: PriceData });
    
    set((state) => ({
      prices: {
        ...state.prices,
        ...priceMap,
      },
    }));
  },
  
  removePrice: (symbol: string) => {
    set((state) => {
      const newPrices = { ...state.prices };
      delete newPrices[symbol];
      return { prices: newPrices };
    });
  },
  
  clearPrices: () => {
    set({ prices: {} });
  },
  
  getPrice: (symbol: string) => {
    return get().prices[symbol] || null;
  },
  
  getAllPrices: () => {
    return Object.values(get().prices);
  },
}));
