import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Prices } from './pages/Prices';
import { Analysis } from './pages/Analysis';
import { Prediction } from './pages/Prediction';
import { News } from './pages/News';
import { Charts } from './pages/Charts';
import AIRecommendations from './pages/AIRecommendations';
import './index.css';
import './styles/themes.css';

/**
 * React Query 클라이언트 설정
 * 
 * 설정 내용:
 * - queries: 쿼리 기본 설정 (재시도, 캐시 시간 등)
 * - mutations: 뮤테이션 기본 설정 (재시도, 지연 시간 등)
 * 
 * 특징:
 * - 3회 재시도, 2초 간격
 * - 5분간 stale time, 10분간 garbage collection
 * - 윈도우 포커스 시 자동 재검증 비활성화
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,                    // 실패 시 3회 재시도
      retryDelay: 2000,            // 재시도 간격 2초
      staleTime: 5 * 60 * 1000,    // 5분간 데이터를 fresh로 유지
      gcTime: 10 * 60 * 1000,      // 10분간 캐시 유지
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재검증 비활성화
    },
    mutations: {
      retry: 2,                    // 뮤테이션 실패 시 2회 재시도
      retryDelay: 3000,            // 재시도 간격 3초
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <div style={{
            minHeight: '100vh',
            background: 'var(--gradient-primary)',
            color: 'var(--text-primary)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {/* 네비게이션 헤더 */}
            <Header />
            
            {/* 메인 콘텐츠 영역 */}
            <main>
              <Routes>
                {/* 대시보드 - 메인 페이지 */}
                <Route path="/" element={<Dashboard />} />
                
                {/* 가격 조회 - 실시간 가격 정보 */}
                <Route path="/prices" element={<Prices />} />
                
                {/* AI 분석 - 기술적 분석 및 투자 조언 */}
                <Route path="/analysis" element={<Analysis />} />
                
                {/* 가격 예측 - AI 기반 가격 예측 */}
                <Route path="/prediction" element={<Prediction />} />
                
                {/* 뉴스 - 암호화폐 관련 뉴스 */}
                <Route path="/news" element={<News />} />
                
                {/* 차트 - 상세 차트 분석 */}
                <Route path="/charts" element={<Charts />} />
                
                {/* AI 추천 - AI 기반 투자 추천 */}
                <Route path="/ai-recommendations" element={<AIRecommendations />} />
              </Routes>
            </main>
            
            {/* 토스트 알림 시스템 */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000, // 4초간 표시
                style: {
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  color: 'var(--text-primary)',
                },
              }}
            />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
