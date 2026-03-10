import axios from 'axios'
import type { TmdbMoviesResponse, TmdbGenresResponse } from '../types/movie'
import { MOCK_MOVIES, MOCK_GENRES } from '../data/mockMovies'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 5000,
  params: {
    api_key: import.meta.env.VITE_TMDB_KEY,
    language: 'ru-RU',
  },
})

export const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const getPosterUrl = (path: string | null, size = 'w500') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null

export const fetchPopularMovies = async (page = 1, genreId?: number): Promise<TmdbMoviesResponse> => {
  try {
    const response = await api.get<TmdbMoviesResponse>('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        page,
        with_genres: genreId || undefined,
        'vote_count.gte': 100,
      },
    })
    return response.data
  } catch {
    const filtered = genreId
      ? MOCK_MOVIES.filter((m) => m.genre_ids.includes(genreId))
      : MOCK_MOVIES
    const pageSize = 10
    const start = (page - 1) * pageSize
    const results = filtered.slice(start, start + pageSize)
    return {
      page,
      results,
      total_pages: Math.ceil(filtered.length / pageSize),
      total_results: filtered.length,
    }
  }
}

export const fetchGenres = async (): Promise<TmdbGenresResponse> => {
  try {
    const response = await api.get<TmdbGenresResponse>('/genre/movie/list')
    return response.data
  } catch {
    return { genres: MOCK_GENRES }
  }
}
