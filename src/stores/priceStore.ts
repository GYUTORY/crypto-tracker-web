import { create } from 'zustand';
import { PriceData } from '../types/api';

/**
 * 가격 스토어 인터페이스
 * Zustand를 사용한 클라이언트 상태 관리
 * 
 * 기능:
 * - 실시간 가격 데이터 저장 및 관리
 * - 개별/일괄 가격 업데이트
 * - 가격 데이터 조회 및 삭제
 * - 메모리 최적화를 위한 데이터 정리
 */
interface PriceStore {
  // 상태
  prices: { [symbol: string]: PriceData }; // 심볼별 가격 데이터 맵
  
  // 액션
  setPrice: (priceData: PriceData) => void;           // 개별 가격 설정
  setPrices: (prices: PriceData[]) => void;           // 일괄 가격 설정
  removePrice: (symbol: string) => void;              // 특정 가격 삭제
  clearPrices: () => void;                            // 모든 가격 데이터 삭제
  getPrice: (symbol: string) => PriceData | null;     // 특정 가격 조회
  getAllPrices: () => PriceData[];                    // 모든 가격 조회
}

/**
 * 가격 스토어 생성
 * Zustand의 create 함수를 사용하여 상태와 액션을 정의합니다
 * 
 * 특징:
 * - 타입 안전성 보장
 * - 불변성 유지
 * - 성능 최적화
 * - 메모리 효율적 관리
 */
export const usePriceStore = create<PriceStore>((set, get) => ({
  // 초기 상태: 빈 가격 맵
  prices: {},
  
  /**
   * 개별 가격 데이터 설정
   * 기존 데이터를 유지하면서 새로운 가격 데이터를 추가/업데이트합니다
   * 
   * @param priceData - 설정할 가격 데이터 객체
   */
  setPrice: (priceData: PriceData) => {
    set((state) => ({
      prices: {
        ...state.prices, // 기존 가격 데이터 유지
        [priceData.symbol]: priceData, // 새로운 가격 데이터 추가/업데이트
      },
    }));
  },
  
  /**
   * 일괄 가격 데이터 설정
   * 여러 가격 데이터를 한 번에 설정합니다
   * 
   * @param prices - 설정할 가격 데이터 배열
   */
  setPrices: (prices: PriceData[]) => {
    // 배열을 맵으로 변환하여 효율적으로 처리
    const priceMap = prices.reduce((acc, price) => {
      acc[price.symbol] = price;
      return acc;
    }, {} as { [symbol: string]: PriceData });
    
    set((state) => ({
      prices: {
        ...state.prices, // 기존 가격 데이터 유지
        ...priceMap,     // 새로운 가격 데이터 추가/업데이트
      },
    }));
  },
  
  /**
   * 특정 심볼의 가격 데이터 삭제
   * 메모리 최적화를 위해 더 이상 필요하지 않은 가격 데이터를 제거합니다
   * 
   * @param symbol - 삭제할 코인 심볼
   */
  removePrice: (symbol: string) => {
    set((state) => {
      const newPrices = { ...state.prices }; // 불변성 유지를 위해 복사
      delete newPrices[symbol]; // 해당 심볼의 가격 데이터 삭제
      return { prices: newPrices };
    });
  },
  
  /**
   * 모든 가격 데이터 삭제
   * 스토어를 초기 상태로 리셋합니다
   */
  clearPrices: () => {
    set({ prices: {} });
  },
  
  /**
   * 특정 심볼의 가격 데이터 조회
   * 
   * @param symbol - 조회할 코인 심볼
   * @returns PriceData | null - 가격 데이터 또는 null (없는 경우)
   */
  getPrice: (symbol: string) => {
    return get().prices[symbol] || null;
  },
  
  /**
   * 모든 가격 데이터 조회
   * 
   * @returns PriceData[] - 모든 가격 데이터 배열
   */
  getAllPrices: () => {
    return Object.values(get().prices);
  },
}));
