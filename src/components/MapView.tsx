import { useCallback, useEffect, useMemo, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { LocationInfo } from '../types'
import './MapView.css'

interface MapViewProps {
  locations: LocationInfo[]
  selectedLocation: LocationInfo | null
  onLocationSelect: (location: LocationInfo) => void
}

interface UserLocation {
  lat: number
  lng: number
}

const MapView = ({ locations, selectedLocation, onLocationSelect }: MapViewProps) => {
  // 구글 맵 API 키는 환경변수로 관리해야 합니다
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.warn('위치 정보를 가져올 수 없습니다:', error)
          // 기본 위치로 설정 (Espoo, Finland)
          setUserLocation({ lat: 60.1699, lng: 24.9384 })
        }
      )
    } else {
      // 기본 위치로 설정
      setUserLocation({ lat: 60.1699, lng: 24.9384 })
    }
  }, [])

  const mapCenter = useMemo(() => {
    if (selectedLocation) {
      return { lat: selectedLocation.lat, lng: selectedLocation.lng }
    }
    if (userLocation) {
      return userLocation
    }
    // 기본 위치 (Espoo, Finland - 이미지에서 본 위치)
    return { lat: 60.1699, lng: 24.9384 }
  }, [selectedLocation, userLocation])

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  }), [])

  const onMapLoad = useCallback(() => {
    // 지도 로드 완료 시 처리
    console.log('Map loaded')
  }, [])

  const onMapError = useCallback(() => {
    console.error('Map error occurred')
  }, [])

  const handleMarkerClick = (location: LocationInfo) => {
    onLocationSelect(location)
  }

  if (loadError) {
    return (
      <div className="map-loading">
        <div className="error-message">❌ 지도를 불러올 수 없습니다</div>
        <div className="error-details">
          {loadError.message || '알 수 없는 오류가 발생했습니다.'}
        </div>
        {!GOOGLE_MAPS_API_KEY && (
          <div className="api-key-warning">
            ⚠️ Google Maps API 키가 설정되지 않았습니다.<br/>
            .env 파일에 VITE_GOOGLE_MAPS_API_KEY를 추가해주세요.
          </div>
        )}
        {GOOGLE_MAPS_API_KEY && (
          <div className="api-key-warning">
            ⚠️ API 키가 유효하지 않거나 권한이 없을 수 있습니다.<br/>
            Google Cloud Console에서 Maps JavaScript API가 활성화되어 있는지 확인해주세요.
          </div>
        )}
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="loading-spinner">🗺️</div>
        <div>지도를 불러오는 중...</div>
        {!GOOGLE_MAPS_API_KEY && (
          <div className="api-key-warning">
            ⚠️ Google Maps API 키를 설정해주세요 (VITE_GOOGLE_MAPS_API_KEY)
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={12}
        onLoad={onMapLoad}
        onError={onMapError}
        options={mapOptions}
      >
        {/* 현재 위치 마커 */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(32, 32),
            }}
            title="현재 위치"
          />
        )}
        
        {/* 장소 마커들 */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(location)}
            animation={
              selectedLocation?.id === location.id
                ? google.maps.Animation.BOUNCE
                : undefined
            }
            icon={
              selectedLocation?.id === location.id
                ? {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new google.maps.Size(40, 40),
                  }
                : {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new google.maps.Size(32, 32),
                  }
            }
          />
        ))}
      </GoogleMap>
      
      {/* 하단 로고 */}
      <div className="map-logo">
        hei!local
      </div>
    </div>
  )
}

export default MapView

