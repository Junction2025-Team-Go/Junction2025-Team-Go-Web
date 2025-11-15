export interface LocationInfo {
  id: string
  name: string
  category: string
  priceRange: string
  rating: number
  reviewCount: number
  openingTime: string
  likes: number
  comments: number
  lat: number
  lng: number
  videoUrl?: string
  imageUrl?: string
  description?: string
  youtubeVideoId?: string // 유튜브 비디오 ID
}

