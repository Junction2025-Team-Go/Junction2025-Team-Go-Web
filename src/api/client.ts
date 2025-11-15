/**
 * Axios API 클라이언트
 * 모든 API 요청에 자동으로 JWT 토큰을 헤더에 추가
 */

import axios from 'axios'
import { config } from '../config'
import { tokenStorage } from '../utils/token'

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken()

    if (token) {
      // JWT 토큰을 Authorization 헤더에 추가
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401 에러 (인증 실패) 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenStorage.getRefreshToken()

        if (refreshToken) {
          // Refresh Token으로 새 Access Token 발급 시도
          const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
            refreshToken
          })

          const { accessToken } = response.data

          // 새 토큰 저장
          tokenStorage.setToken(accessToken)

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh Token도 만료됨 → 로그아웃
        tokenStorage.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // 403 에러 (권한 없음)
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.')
    }

    // 500 에러 (서버 에러)
    if (error.response?.status === 500) {
      console.error('서버 에러가 발생했습니다.')
    }

    return Promise.reject(error)
  }
)
