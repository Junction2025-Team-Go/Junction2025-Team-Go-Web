/**
 * 인증 API 서비스
 * Spring Boot 백엔드와 통신
 */

import { apiClient } from './client'
import { tokenStorage } from '../utils/token'

// 인증 관련 타입 정의
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    profileImage?: string
  }
}

export interface GoogleLoginRequest {
  credential: string // Google OAuth credential
}

export const authApi = {
  /**
   * 일반 로그인
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)

    // 토큰 저장
    tokenStorage.setToken(response.data.accessToken)
    tokenStorage.setRefreshToken(response.data.refreshToken)

    return response.data
  },

  /**
   * 구글 로그인
   */
  googleLogin: async (data: GoogleLoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/google', data)

    // 토큰 저장
    tokenStorage.setToken(response.data.accessToken)
    tokenStorage.setRefreshToken(response.data.refreshToken)

    return response.data
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      // 에러가 나도 로컬 토큰은 삭제
      tokenStorage.clearTokens()
    }
  },

  /**
   * 현재 로그인한 사용자 정보 가져오기
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  /**
   * 회원가입 (선택사항)
   */
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },
}
