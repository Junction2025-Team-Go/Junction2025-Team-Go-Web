/**
 * 장소 데이터 API 서비스
 * Spring Boot 백엔드에서 장소 데이터 가져오기
 */

import { apiClient } from './client'
import { LocationInfo } from '../types'

export const locationsApi = {
  /**
   * 모든 장소 가져오기
   */
  getAll: async (): Promise<LocationInfo[]> => {
    const response = await apiClient.get<LocationInfo[]>('/locations')
    return response.data
  },

  /**
   * 특정 장소 상세 정보
   */
  getById: async (id: string): Promise<LocationInfo> => {
    const response = await apiClient.get<LocationInfo>(`/locations/${id}`)
    return response.data
  },

  /**
   * 위치 기반으로 주변 장소 검색
   */
  getNearby: async (lat: number, lng: number, radius: number = 5000) => {
    const response = await apiClient.get('/locations/nearby', {
      params: { lat, lng, radius }
    })
    return response.data
  },

  /**
   * 장소에 좋아요 추가
   */
  like: async (id: string) => {
    const response = await apiClient.post(`/locations/${id}/like`)
    return response.data
  },

  /**
   * 장소에 댓글 추가
   */
  addComment: async (id: string, comment: string) => {
    const response = await apiClient.post(`/locations/${id}/comments`, { comment })
    return response.data
  },
}
