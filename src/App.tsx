import React, { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initPerformanceMonitoring } from './utils/performance';
import { checkMigrationStatus, monitorWebSocketHealth } from './services/api';
import './App.css';
import './styles/themes.css';

// 지연 로딩을 위한 페이지 컴포넌트들
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Prices = lazy(() => import('./pages/Prices'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Prediction = lazy(() => import('./pages/Prediction'));
const News = lazy(() => import('./pages/News'));
const Charts = lazy(() => import('./pages/Charts'));
const AIRecommendations = lazy(() => import('./pages/AIRecommendations'));

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    background: 'var(--gradient-primary)',
    color: 'var(--text-primary)'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        border: '3px solid var(--border-accent)',
        borderTop: '3px solid var(--text-accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>페이지 로딩 중...</p>
    </div>
  </div>
);

/**
 * React Query 클라이언트 설정
 * 
 * 설정 내용:
 * - queries: 쿼리 기본 설정 (재시도, 캐시 시간 등)
 * - mutations: 뮤테이션 기본 설정 (재시도, 지연 시간 등)
 * 
 * 특징:
 * - 2회 재시도, 1초 간격 (성능 최적화)
 * - 3분간 stale time, 10분간 garbage collection
 * - 윈도우 포커스 시 자동 재검증 비활성화
 * - 백그라운드에서 불필요한 API 호출 방지
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // 실패 시 1회 재시도 (성능 최적화)
      retryDelay: 1000,            // 재시도 간격 1초
      staleTime: 5 * 60 * 1000,    // 5분간 데이터를 fresh로 유지
      gcTime: 15 * 60 * 1000,      // 15분간 캐시 유지
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재검증 비활성화
      refetchOnReconnect: false,   // 네트워크 재연결 시 재검증 비활성화
      refetchOnMount: false,       // 컴포넌트 마운트 시 재검증 비활성화
    },
    mutations: {
      retry: 1,                    // 뮤테이션 실패 시 1회 재시도
      retryDelay: 2000,            // 재시도 간격 2초
    },
  },
});

/**
 * 메인 애플리케이션 컴포넌트
 * 
 * 구성 요소:
 * - QueryClientProvider: React Query 상태 관리
 * - ThemeProvider: 다크/라이트 테마 관리
 * - BrowserRouter: 클라이언트 사이드 라우팅
 * - Header: 네비게이션 헤더
 * - Routes: 페이지 라우팅
 * - Toaster: 토스트 알림 시스템
 * 
 * 라우팅 구조:
 * - /: 대시보드 (메인 페이지)
 * - /prices: 가격 조회 페이지
 * - /analysis: AI 분석 페이지
 * - /prediction: 가격 예측 페이지
 * - /news: 뉴스 페이지
 * - /charts: 차트 페이지
 * - /ai-recommendations: AI 추천 페이지
 */
function App() {
  // 성능 모니터링 초기화
  useEffect(() => {
    initPerformanceMonitoring();
    
    // 마이그레이션 상태 확인
    checkMigrationStatus().then((status) => {
      console.log('🚀 앱 시작 - 마이그레이션 상태:', status);
      
      if (!status.javaServer) {
        console.warn('⚠️ Java 서버가 응답하지 않습니다. 일부 기능이 제한될 수 있습니다.');
      }
      
      if (!status.nodeServer) {
        console.warn('⚠️ Node.js 서버가 응답하지 않습니다. 일부 기능이 제한될 수 있습니다.');
      }
    });
    
    // WebSocket 상태 모니터링 시작
    const stopMonitoring = monitorWebSocketHealth(30000); // 30초마다 체크
    
    // 컴포넌트 언마운트 시 모니터링 중지
    return () => {
      stopMonitoring();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div style={{
              minHeight: '100vh',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family)'
            }}>
              <ErrorBoundary>
                <Header />
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/prices" element={<Prices />} />
                    <Route path="/charts" element={<Charts />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/prediction" element={<Prediction />} />
                    <Route path="/ai-recommendations" element={<AIRecommendations />} />
                  </Routes>
                </Suspense>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    },
                  }}
                />
              </ErrorBoundary>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
