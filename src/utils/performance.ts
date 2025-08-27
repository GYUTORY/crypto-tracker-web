/**
 * 성능 모니터링 유틸리티
 * 애플리케이션의 성능을 추적하고 최적화하기 위한 도구들
 */

/**
 * Web Vitals 메트릭을 추적하는 함수
 * Core Web Vitals (LCP, FID, CLS) 및 기타 성능 지표를 모니터링합니다
 */
export const trackWebVitals = () => {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        console.log('🚀 LCP:', lastEntry.startTime);
        
        // LCP가 2.5초를 초과하면 경고
        if (lastEntry.startTime > 2500) {
          console.warn('⚠️ LCP가 2.5초를 초과했습니다:', lastEntry.startTime);
        }
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // First Input Delay (FID)
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        console.log('⚡ FID:', entry.processingStart - entry.startTime);
        
        // FID가 100ms를 초과하면 경고
        if (entry.processingStart - entry.startTime > 100) {
          console.warn('⚠️ FID가 100ms를 초과했습니다:', entry.processingStart - entry.startTime);
        }
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }

  // Cumulative Layout Shift (CLS)
  if ('PerformanceObserver' in window) {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      console.log('📐 CLS:', clsValue);
      
      // CLS가 0.1을 초과하면 경고
      if (clsValue > 0.1) {
        console.warn('⚠️ CLS가 0.1을 초과했습니다:', clsValue);
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }
};

/**
 * 메모리 사용량을 모니터링하는 함수
 * 브라우저의 메모리 사용량을 추적합니다
 */
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    
    setInterval(() => {
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      
      console.log('💾 Memory Usage:', {
        used: `${usedMB}MB`,
        total: `${totalMB}MB`,
        limit: `${limitMB}MB`,
        percentage: `${Math.round((usedMB / limitMB) * 100)}%`
      });
      
      // 메모리 사용량이 80%를 초과하면 경고
      if ((usedMB / limitMB) > 0.8) {
        console.warn('⚠️ 메모리 사용량이 80%를 초과했습니다:', `${Math.round((usedMB / limitMB) * 100)}%`);
      }
    }, 30000); // 30초마다 체크
  }
};

/**
 * API 응답 시간을 추적하는 함수
 * API 호출의 성능을 모니터링합니다
 */
export const trackApiPerformance = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const startTime = performance.now();
    
    try {
      const response = await originalFetch(...args);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log('🌐 API Call:', {
        url: args[0],
        duration: `${duration.toFixed(2)}ms`,
        status: response.status
      });
      
      // API 응답 시간이 3초를 초과하면 경고
      if (duration > 3000) {
        console.warn('⚠️ API 응답 시간이 3초를 초과했습니다:', `${duration.toFixed(2)}ms`);
      }
      
      return response;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error('❌ API Error:', {
        url: args[0],
        duration: `${duration.toFixed(2)}ms`,
        error: error
      });
      
      throw error;
    }
  };
};

/**
 * 컴포넌트 렌더링 성능을 추적하는 함수
 * React 컴포넌트의 렌더링 시간을 측정합니다
 */
export const trackComponentRender = (componentName: string) => {
  return {
    start: () => {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log('⚛️ Component Render:', {
          component: componentName,
          duration: `${duration.toFixed(2)}ms`
        });
        
        // 렌더링 시간이 16ms를 초과하면 경고 (60fps 기준)
        if (duration > 16) {
          console.warn('⚠️ 컴포넌트 렌더링 시간이 16ms를 초과했습니다:', `${duration.toFixed(2)}ms`);
        }
      };
    }
  };
};

/**
 * 번들 크기를 분석하는 함수
 * 애플리케이션의 번들 크기를 추적합니다
 */
export const trackBundleSize = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      const loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
      
      console.log('📦 Bundle Performance:', {
        domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
        loadComplete: `${loadComplete.toFixed(2)}ms`,
        totalLoadTime: `${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`
      });
    }
  }
};

/**
 * 성능 모니터링을 초기화하는 함수
 * 모든 성능 추적 기능을 활성화합니다
 */
export const initPerformanceMonitoring = () => {
  console.log('🔍 성능 모니터링을 시작합니다...');
  
  trackWebVitals();
  trackMemoryUsage();
  trackApiPerformance();
  trackBundleSize();
  
  console.log('✅ 성능 모니터링이 활성화되었습니다.');
};

/**
 * 성능 데이터를 수집하는 함수
 * 모든 성능 메트릭을 수집하여 반환합니다
 */
export const collectPerformanceData = () => {
  const data: any = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };

  // 메모리 사용량
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    data.memory = {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }

  // 네트워크 정보
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    data.network = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }

  return data;
};
