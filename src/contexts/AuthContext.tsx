/**
 * 인증 Context
 * 로그인 상태를 전역에서 관리
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, LoginRequest, GoogleLoginRequest } from '../api/auth'
import { tokenStorage } from '../utils/token'

// 사용자 타입
interface User {
  id: string
  email: string
  name: string
  profileImage?: string
}

// Context 타입
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  googleLogin: (data: GoogleLoginRequest) => Promise<void>
  logout: () => Promise<void>
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // 토큰이 있으면 사용자 정보 가져오기
      if (tokenStorage.hasToken()) {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('인증 확인 실패:', error)
      tokenStorage.clearTokens()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data)
      setUser(response.user)
    } catch (error) {
      console.error('로그인 실패:', error)
      throw error
    }
  }

  const googleLogin = async (data: GoogleLoginRequest) => {
    try {
      const response = await authApi.googleLogin(data)
      setUser(response.user)
    } catch (error) {
      console.error('구글 로그인 실패:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    googleLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook: 다른 컴포넌트에서 쉽게 사용
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용 가능합니다')
  }
  return context
}
