/**
 * 회원가입 폼 컴포넌트
 * 사용자 회원가입 기능 제공
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // 이름 검사
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다';
    }

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

    // 비밀번호 확인 검사
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 회원가입 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        toast.success('회원가입에 성공했습니다!');
        onSuccess?.();
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      toast.error('회원가입 중 오류가 발생했습니다.');
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
          회원가입
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          YGBT에 오신 것을 환영합니다
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 이름 입력 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="name" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.name ? 'var(--status-error)' : 'var(--border-primary)'}`,
              borderRadius: '8px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
            placeholder="이름을 입력하세요"
            disabled={isLoading}
          />
          {errors.name && (
            <div style={{
              color: 'var(--status-error)',
              fontSize: '0.75rem',
              marginTop: '0.25rem'
            }}>
              {errors.name}
            </div>
          )}
        </div>

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

        {/* 비밀번호 확인 입력 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="confirmPassword" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.confirmPassword ? 'var(--status-error)' : 'var(--border-primary)'}`,
              borderRadius: '8px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
            placeholder="비밀번호를 다시 입력하세요"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <div style={{
              color: 'var(--status-error)',
              fontSize: '0.75rem',
              marginTop: '0.25rem'
            }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* 회원가입 버튼 */}
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
            marginBottom: '1.5rem'
          }}
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>

        {/* 로그인 링크 */}
        {onSwitchToLogin && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>
              이미 계정이 있으신가요?
            </p>
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              로그인하기
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
