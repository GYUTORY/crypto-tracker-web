import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Prices } from './pages/Prices';
import { Analysis } from './pages/Analysis';
import { Prediction } from './pages/Prediction';
import { Symbols } from './pages/Symbols';
import './index.css';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 재시도 횟수 증가
      retryDelay: 2000, // 재시도 간격 증가
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    },
    mutations: {
      retry: 2, // 뮤테이션 재시도 횟수
      retryDelay: 3000, // 뮤테이션 재시도 간격
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/prices" element={<Prices />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/symbols" element={<Symbols />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
