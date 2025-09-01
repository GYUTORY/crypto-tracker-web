/**
 * 로그인 폼 컴포넌트
 * 사용자 로그인 기능 제공
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 폼 데이터 변경 핸들러
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * 폼 유효성 검사
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 이메일 검사
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 로그인 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const success = await login(formData);
      
      if (success) {
        toast.success('로그인에 성공했습니다!');
        onSuccess?.();
      } else {
        toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    }
  };

  /**
   * 테스트 계정으로 로그인
   */
  const handleTestLogin = async (type: 'user' | 'admin') => {
    const testAccounts = {
      user: { email: 'user@example.com', password: 'user123!' },
      admin: { email: 'admin@example.com', password: 'admin123!' }
    };

    setFormData(testAccounts[type]);
    
    try {
      const success = await login(testAccounts[type]);
      
      if (success) {
        toast.success(`${type === 'user' ? '일반' : '관리자'} 계정으로 로그인했습니다!`);
        onSuccess?.();
      } else {
        toast.error('테스트 계정 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('테스트 로그인 오류:', error);
      toast.error('테스트 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2rem',
      background: 'var(--bg-secondary)',
      borderRadius: '12px',
      border: '1px solid var(--border-primary)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)'
        }}>
          로그인
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          Crypto Tracker Pro에 오신 것을 환영합니다
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 이메일 입력 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.email ? 'var(--status-error)' : 'var(--border-primary)'}`,
              borderRadius: '8px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
            placeholder="이메일을 입력하세요"
            disabled={isLoading}
          />
          {errors.email && (
            <div style={{
              color: 'var(--status-error)',
              fontSize: '0.75rem',
              marginTop: '0.25rem'
            }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.password ? 'var(--status-error)' : 'var(--border-primary)'}`,
              borderRadius: '8px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />
          {errors.password && (
            <div style={{
              color: 'var(--status-error)',
              fontSize: '0.75rem',
              marginTop: '0.25rem'
            }}>
              {errors.password}
            </div>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            marginBottom: '1rem'
          }}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        {/* 테스트 계정 버튼들 */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => handleTestLogin('user')}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '0.5rem',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            테스트 계정
          </button>
          <button
            type="button"
            onClick={() => handleTestLogin('admin')}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '0.5rem',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            관리자 계정
          </button>
        </div>

        {/* 회원가입 링크 */}
        {onSwitchToRegister && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>
              계정이 없으신가요?
            </p>
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              회원가입하기
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;


