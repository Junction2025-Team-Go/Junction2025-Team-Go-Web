import { useState } from 'react'
import VideoPlayer from './components/VideoPlayer'
import MapView from './components/MapView'
import { LocationInfo } from './types'
import './App.css'

function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  // 임시 데이터 - 백엔드 연결 시 API로 대체
  // 유튜브 쇼츠 맛집 영상들
  // 실제 맛집 쇼츠 영상 ID를 넣으려면:
  // 1. 유튜브에서 맛집 쇼츠 영상을 찾습니다
  // 2. URL에서 영상 ID를 추출합니다 (예: https://www.youtube.com/shorts/VIDEO_ID)
  // 3. 아래 youtubeVideoId에 해당 ID를 넣습니다
  const locations: LocationInfo[] = [
    {
      id: '1',
      name: 'Soup+More',
      category: 'Soup restaurant',
      priceRange: '€10-15',
      rating: 4.5,
      reviewCount: 202,
      openingTime: '11:00',
      likes: 112,
      comments: 112,
      lat: 60.1699,
      lng: 24.9384,
      youtubeVideoId: 'dQw4w9WgXcQ', // 실제 맛집 쇼츠 영상 ID로 교체하세요
      description: 'Very nice Dish!'
    },
    {
      id: '2',
      name: 'Tokyo Ramen House',
      category: 'Japanese Restaurant',
      priceRange: '€12-18',
      rating: 4.8,
      reviewCount: 456,
      openingTime: '12:00',
      likes: 892,
      comments: 234,
      lat: 60.1700,
      lng: 24.9390,
      youtubeVideoId: 'jNQXAC9IVRw', // 실제 맛집 쇼츠 영상 ID로 교체하세요
      description: 'Authentic Ramen Experience!'
    },
    {
      id: '3',
      name: 'Seoul BBQ',
      category: 'Korean Restaurant',
      priceRange: '€15-25',
      rating: 4.7,
      reviewCount: 678,
      openingTime: '17:00',
      likes: 1234,
      comments: 567,
      lat: 60.1710,
      lng: 24.9400,
      youtubeVideoId: '9bZkp7q19f0', // 실제 맛집 쇼츠 영상 ID로 교체하세요
      description: 'Best Korean BBQ in Town!'
    },
    {
      id: '4',
      name: 'Pizza Napoletana',
      category: 'Italian Restaurant',
      priceRange: '€8-15',
      rating: 4.6,
      reviewCount: 345,
      openingTime: '11:30',
      likes: 678,
      comments: 189,
      lat: 60.1720,
      lng: 24.9410,
      youtubeVideoId: 'kJQP7kiw5Fk', // 실제 맛집 쇼츠 영상 ID로 교체하세요
      description: 'Wood-fired Pizza Perfection!'
    },
    {
      id: '5',
      name: 'Bangkok Street Food',
      category: 'Thai Restaurant',
      priceRange: '€10-16',
      rating: 4.9,
      reviewCount: 789,
      openingTime: '12:00',
      likes: 1456,
      comments: 432,
      lat: 60.1730,
      lng: 24.9420,
      youtubeVideoId: 'L_jWHffIx5E', // 실제 맛집 쇼츠 영상 ID로 교체하세요
      description: 'Spicy & Delicious!'
    }
  ]

  const handleLocationSelect = (location: LocationInfo) => {
    setSelectedLocation(location)
  }

  return (
    <div className="app-container">
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
  )
}

export default App

