import { useEffect, useRef } from 'react'
import { LocationInfo } from '../types'
import './VideoPlayer.css'

interface VideoPlayerProps {
  locations: LocationInfo[]
  selectedLocation: LocationInfo | null
  currentIndex: number
  onIndexChange: (index: number) => void
}

const VideoPlayer = ({ locations, selectedLocation, currentIndex, onIndexChange }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    if (selectedLocation && containerRef.current) {
      const index = locations.findIndex(loc => loc.id === selectedLocation.id)
      if (index !== -1) {
        scrollToIndex(index)
      }
    }
  }, [selectedLocation, locations])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: number
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => {
        const scrollPosition = container.scrollTop
        const itemHeight = container.clientHeight
        const currentIndex = Math.round(scrollPosition / itemHeight)
        onIndexChange(currentIndex)
      }, 100)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [onIndexChange])

  useEffect(() => {
    // 현재 비디오만 재생
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {
            // 자동 재생 실패 시 무시
          })
        } else {
          video.pause()
        }
      }
    })
  }, [currentIndex])

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const itemHeight = containerRef.current.clientHeight
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div ref={containerRef} className="video-player-container">
      {locations.map((location, index) => (
        <div
          key={location.id}
          className="video-item"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="video-wrapper">
            {location.youtubeVideoId ? (
              <iframe
                className="youtube-video"
                src={`https://www.youtube.com/embed/${location.youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${location.youtubeVideoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1&origin=${window.location.origin}&start=0`}
                title={location.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            ) : location.videoUrl ? (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={location.videoUrl}
                className="video-element"
                loop
                muted
                playsInline
              />
            ) : (
              <div className="video-placeholder">
                <div className="placeholder-content">
                  {location.imageUrl ? (
                    <img src={location.imageUrl} alt={location.name} />
                  ) : (
                    <div className="placeholder-text">영상 준비 중</div>
                  )}
                </div>
              </div>
            )}
            
            {/* 오버레이 정보 */}
            <div className="video-overlay">
              {location.description && (
                <div className="overlay-badge">{location.description}</div>
              )}
            </div>

            {/* 하단 정보 패널 */}
            <div className="location-info-panel">
              <div className="info-category">{location.category}</div>
              <div className="info-name">{location.name}</div>
              <div className="info-details">
                <span className="info-price">{location.priceRange}</span>
                <span className="info-opening">Opens soon {location.openingTime}</span>
              </div>
              <div className="info-rating">
                {'★'.repeat(Math.floor(location.rating))}
                {'☆'.repeat(5 - Math.floor(location.rating))}
                <span className="rating-count">({location.reviewCount})</span>
              </div>
            </div>

            {/* 우측 상호작용 아이콘 */}
            <div className="interaction-icons">
              <div className="icon-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>{location.likes}</span>
              </div>
              <div className="icon-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                <span>{location.comments}</span>
              </div>
              <div className="icon-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VideoPlayer

