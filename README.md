# 🚀 Crypto Tracker Pro - Frontend

Crypto Tracker Pro API를 활용한 실시간 암호화폐 가격 추적 및 AI 분석 웹 애플리케이션입니다.

## 🌟 주요 기능

- **실시간 가격 모니터링**: 바이낸스 API를 통한 실시간 암호화폐 가격 추적
- **AI 기반 기술적 분석**: Google Gemini AI를 활용한 기술적 분석 및 투자 조언
- **가격 예측**: 다양한 시간대별 가격 예측 및 지지/저항선 분석
- **코인 목록 관리**: 거래 가능한 모든 코인 목록 및 검색 기능
- **WebSocket 실시간 스트리밍**: 실시간 가격 업데이트

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Routing**: React Router
- **UI Components**: Headless UI + Heroicons
- **Charts**: Chart.js + Recharts
- **Real-time**: Socket.io-client
- **HTTP Client**: Axios

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── ui/              # 기본 UI 컴포넌트
│   ├── charts/          # 차트 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   └── features/        # 기능별 컴포넌트
├── pages/               # 페이지 컴포넌트
├── hooks/               # 커스텀 훅
├── stores/              # Zustand 스토어
├── services/            # API 서비스
├── types/               # TypeScript 타입 정의
├── utils/               # 유틸리티 함수
├── constants/           # 상수 정의
└── styles/              # 글로벌 스타일
```

## 📱 페이지 구성

### 1. 대시보드 (`/`)
- 인기 코인 실시간 가격 표시
- 전체 통계 정보
- 빠른 접근 링크

### 2. 가격 조회 (`/prices`)
- 특정 코인 가격 검색
- 실시간 가격 업데이트
- 가격 변동률 표시

### 3. AI 분석 (`/analysis`)
- 기술적 분석 요청
- RSI, MACD, 볼린저 밴드 분석
- 투자 조언 및 위험도 평가

### 4. 가격 예측 (`/prediction`)
- 시간대별 가격 예측
- 지지/저항선 분석
- 시장 심리 및 투자 조언

### 5. 코인 목록 (`/symbols`)
- 전체 거래 가능 코인 목록
- 카테고리별 필터링
- 실시간 가격 정보

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린팅
npm run lint

# 타입 체크
npm run type-check
```

## 🌐 API 연동

### 주요 API 엔드포인트

- **가격 조회**: `GET /price/{symbol}`
- **AI 분석**: `POST /ai/technical-analysis`
- **가격 예측**: `GET /prediction/{symbol}`
- **코인 목록**: `GET /symbols`
- **WebSocket 스트림**: `GET /stream/status`

### 커스텀 훅

- `usePrice()`: 특정 코인 가격 조회
- `usePrices()`: 여러 코인 가격 조회
- `useTechnicalAnalysis()`: AI 기술적 분석
- `usePricePrediction()`: 가격 예측 조회
- `useSymbols()`: 코인 목록 조회

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환
- **실시간 업데이트**: WebSocket을 통한 실시간 데이터 스트리밍
- **로딩 상태**: 사용자 친화적인 로딩 인디케이터
- **에러 처리**: 명확한 에러 메시지 및 복구 옵션

## 🔒 보안

- **환경 변수**: 민감한 정보는 환경 변수로 관리
- **API 키**: 프론트엔드에서 직접 노출되지 않음
- **CORS**: 백엔드에서 적절한 CORS 설정 필요

## 📊 성능 최적화

- **React Query**: 서버 상태 캐싱 및 자동 재검증
- **코드 스플리팅**: 라우트별 지연 로딩
- **이미지 최적화**: WebP 포맷 지원
- **번들 최적화**: Tree shaking 및 코드 분할

## 🧪 테스트

```bash
# 단위 테스트
npm test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

## 📦 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Netlify 배포

```bash
# 빌드
npm run build

# dist 폴더를 Netlify에 업로드
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

- **이슈 리포트**: GitHub Issues
- **문의**: dev@example.com

---

**Made with ❤️ by Crypto Tracker Pro Team**
