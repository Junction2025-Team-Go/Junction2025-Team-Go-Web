/**
 * 홈 페이지
 * 비디오 플레이어 + 지도 뷰
 */

import { useState } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import MapView from '../components/MapView'
import { useLocations } from '../contexts/LocationContext'
import { useAuth } from '../contexts/AuthContext'
import { LocationInfo } from '../types'
import './HomePage.css'

export default function HomePage() {
  const { locations, isLoading } = useLocations()
  const { user, logout } = useAuth()
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const handleLocationSelect = (location: LocationInfo) => {
    setSelectedLocation(location)
  }

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await logout()
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🗺️</div>
        <p>장소 데이터를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="home-container">
      {/* 상단 헤더 */}
      <header className="home-header">
        <h1>hei!local</h1>
        <div className="user-info">
          <span>안녕하세요, {user?.name || '사용자'}님!</span>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="home-content">
        <div className="left-panel">
          <VideoPlayer
            locations={locations}
            selectedLocation={selectedLocation}
            currentIndex={currentVideoIndex}
            onIndexChange={setCurrentVideoIndex}
          />
        </div>
        <div className="right-panel">
          <MapView
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>
    </div>
  )
}
