/**
 * 로그인 페이지
 * 일반 로그인 + 구글 로그인
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, googleLogin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 일반 로그인
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate('/') // 로그인 성공 시 홈으로
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인 실패. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // 구글 로그인 성공
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin({ credential: credentialResponse.credential })
      navigate('/')
    } catch (err: any) {
      setError('구글 로그인 실패. 다시 시도해주세요.')
    }
  }

  // 구글 로그인 실패
  const handleGoogleError = () => {
    setError('구글 로그인에 실패했습니다.')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">hei!local</h1>
        <p className="login-subtitle">로컬 맛집을 발견하세요</p>

        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}

        {/* 일반 로그인 폼 */}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="divider">
          <span>또는</span>
        </div>

        {/* 구글 로그인 */}
        <div className="google-login">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </div>
    </div>
  )
}
