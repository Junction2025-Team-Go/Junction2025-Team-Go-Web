/**
 * JWT 토큰 관리 유틸리티
 * 로컬스토리지에 안전하게 저장/불러오기
 */

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const tokenStorage = {
  // Access Token 저장
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // Access Token 가져오기
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Refresh Token 저장
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  // Refresh Token 가져오기
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  // 모든 토큰 삭제 (로그아웃 시)
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  // 토큰 존재 여부 확인
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  }
}
