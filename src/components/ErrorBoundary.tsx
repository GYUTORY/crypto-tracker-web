import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * 전역 에러 바운더리 컴포넌트
 * React 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착하고 처리합니다
 * 
 * 특징:
 * - 컴포넌트 렌더링 중 발생하는 에러를 포착
 * - 에러 발생 시 대체 UI를 표시
 * - 에러 정보를 콘솔에 로깅
 * - 사용자에게 친화적인 에러 메시지 제공
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 에러가 발생했을 때 상태를 업데이트하여 다음 렌더링에서 대체 UI를 표시
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 정보를 콘솔에 로깅
    console.error('Error caught by boundary:', error, errorInfo);
    
    // 에러 정보를 상태에 저장
    this.setState({
      error,
      errorInfo
    });

    // 실제 프로덕션에서는 에러 리포팅 서비스로 전송
    // 예: Sentry, LogRocket, Bugsnag 등
    if (process.env.NODE_ENV === 'production') {
      // 에러 리포팅 서비스 호출
      // reportError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // 에러 상태를 리셋하고 컴포넌트를 다시 렌더링
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    // 페이지를 새로고침
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          {/* 에러 아이콘 */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '2rem',
            animation: 'pulse 2s infinite'
          }}>
            ⚠️
          </div>

          {/* 에러 제목 */}
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'var(--status-error)'
          }}>
            오류가 발생했습니다
          </h1>

          {/* 에러 설명 */}
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '500px',
            lineHeight: '1.6'
          }}>
            예상치 못한 오류가 발생했습니다. 
            문제가 지속되면 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
          </p>

          {/* 에러 상세 정보 (개발 환경에서만 표시) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginBottom: '2rem',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '0.5rem',
              maxWidth: '600px',
              width: '100%'
            }}>
              <summary style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'var(--text-accent)',
                marginBottom: '0.5rem'
              }}>
                에러 상세 정보 (개발자용)
              </summary>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-tertiary)',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}>
                <strong>에러 메시지:</strong> {this.state.error.message}
                {this.state.errorInfo && (
                  <>
                    <br /><br />
                    <strong>스택 트레이스:</strong>
                    <br />
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </div>
            </details>
          )}

          {/* 액션 버튼들 */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--gradient-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              다시 시도
            </button>
            
            <button
              onClick={this.handleReload}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              페이지 새로고침
            </button>
          </div>

          {/* 추가 도움말 */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '0.5rem',
            maxWidth: '500px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              도움이 필요하신가요?
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              문제가 지속되면 개발팀에 문의해주세요. 
              에러 코드: {this.state.error?.name || 'UNKNOWN'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 함수형 컴포넌트용 에러 바운더리 훅
 * 함수형 컴포넌트에서 에러를 처리할 때 사용
 */
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error handled by hook:', error, errorInfo);
    
    // 에러 리포팅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo);
    }
  };

  return { handleError };
};

/**
 * 에러 메시지를 사용자 친화적으로 변환하는 유틸리티 함수
 */
export const getErrorMessage = (error: Error): string => {
  const errorMessages: Record<string, string> = {
    'Network Error': '네트워크 연결을 확인해주세요.',
    'Request timeout': '요청 시간이 초과되었습니다. 다시 시도해주세요.',
    'Failed to fetch': '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
    'TypeError': '데이터 처리 중 오류가 발생했습니다.',
    'ReferenceError': '페이지 로딩 중 오류가 발생했습니다.',
  };

  return errorMessages[error.name] || error.message || '알 수 없는 오류가 발생했습니다.';
};
