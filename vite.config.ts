import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 번들 분석 플러그인 (빌드 시에만 활성화)
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // 번들 크기 최적화
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 프로덕션에서 console.log 제거
        drop_debugger: true,
      },
    },
    // 코드 분할 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리들을 별도 청크로 분리
          'react-vendor': ['react', 'react-dom'],
          // 차트 라이브러리들을 별도 청크로 분리
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts', 'lightweight-charts'],
          // UI 라이브러리들을 별도 청크로 분리
          'ui-vendor': ['@headlessui/react', '@heroicons/react', 'framer-motion'],
          // 상태 관리 라이브러리들을 별도 청크로 분리
          'state-vendor': ['@tanstack/react-query', 'zustand'],
        },
      },
    },
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 1000,
  },
  // 개발 서버 최적화
  server: {
    port: 5173,
    host: true,
    // HMR 최적화
    hmr: {
      overlay: false,
    },
  },
  // 의존성 최적화
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
    ],
  },
  // CSS 최적화
  css: {
    devSourcemap: true,
  },
  // 환경 변수 처리
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})
