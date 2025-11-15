/**
 * 장소 데이터 Context
 * 장소 데이터를 전역에서 관리하고 실시간 업데이트
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { locationsApi } from '../api/locations'
import { LocationInfo } from '../types'

interface LocationContextType {
  locations: LocationInfo[]
  isLoading: boolean
  refreshLocations: () => Promise<void>
  addLike: (id: string) => Promise<void>
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<LocationInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 앱 시작 시 장소 데이터 로드
  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setIsLoading(true)
      const data = await locationsApi.getAll()
      setLocations(data)
    } catch (error) {
      console.error('장소 데이터 로드 실패:', error)
      // 에러 시 빈 배열로 초기화
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  const refreshLocations = async () => {
    await loadLocations()
  }

  const addLike = async (id: string) => {
    try {
      await locationsApi.like(id)

      // 로컬 상태 즉시 업데이트 (UI 반응성)
      setLocations(prev =>
        prev.map(loc =>
          loc.id === id ? { ...loc, likes: loc.likes + 1 } : loc
        )
      )
    } catch (error) {
      console.error('좋아요 실패:', error)
      throw error
    }
  }

  const value = {
    locations,
    isLoading,
    refreshLocations,
    addLike,
  }

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

// Hook: 다른 컴포넌트에서 쉽게 사용
export function useLocations() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocations는 LocationProvider 안에서만 사용 가능합니다')
  }
  return context
}
