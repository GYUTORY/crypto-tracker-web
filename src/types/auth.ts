/**
 * 인증 관련 타입 정의
 */

export interface UserData {
  id: string;
  email: string;
  name: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: UserData;
    token: string;
  };
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  nickname: string;
  password: string;
}
