export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface TmdbMoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface TmdbGenresResponse {
  genres: Genre[]
}

export type SwipeDirection = 'left' | 'right'
