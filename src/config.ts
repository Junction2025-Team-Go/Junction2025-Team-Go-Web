/**
 * 환경 변수 설정
 * .env 파일에서 값을 가져옴
 */

export const config = {
  // Google Maps API Key
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',

  // Google OAuth Client ID
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // Backend API URL (Spring Boot)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',

  // 앱 이름
  appName: import.meta.env.VITE_APP_NAME || 'hei!local',

  // 개발 모드 여부
  isDevelopment: import.meta.env.DEV,

  // 프로덕션 모드 여부
  isProduction: import.meta.env.PROD,
} as const

// 개발 환경에서만 환경 변수 로깅
if (config.isDevelopment) {
  console.log('🔧 Config loaded:', {
    apiBaseUrl: config.apiBaseUrl,
    hasGoogleMapsKey: !!config.googleMapsApiKey,
    hasGoogleClientId: !!config.googleClientId,
  })
}
