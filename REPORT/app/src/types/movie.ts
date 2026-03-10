export interface KpGenre {
  name: string
}

export interface KpMovie {
  id: number
  name: string | null
  alternativeName: string | null
  description: string | null
  shortDescription: string | null
  year: number | null
  movieLength: number | null
  ageRating: number | null
  isSeries: boolean
  rating: {
    kp: number
    imdb: number
  }
  votes: {
    kp: number
    imdb: number
  }
  poster: {
    url: string
    previewUrl: string
  } | null
  backdrop: {
    url: string | null
    previewUrl: string | null
  } | null
  genres: KpGenre[]
  countries: { name: string }[]
  top250: number | null
}

export interface KpResponse {
  docs: KpMovie[]
  total: number
  limit: number
  page: number
  pages: number
}

export type SwipeDirection = 'left' | 'right'
