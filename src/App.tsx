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
import './index.css';
import './styles/themes.css';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 2000,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
      retryDelay: 3000,
    },
  },
});

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
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/prices" element={<Prices />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/news" element={<News />} />
                <Route path="/charts" element={<Charts />} />
              </Routes>
            </main>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
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
