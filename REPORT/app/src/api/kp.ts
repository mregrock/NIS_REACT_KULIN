import axios from 'axios'
import type { KpResponse } from '../types/movie'
import { MOCK_MOVIES } from '../data/mockMovies'

const API_KEY = import.meta.env.VITE_KP_KEY || ''

const api = axios.create({
  baseURL: 'https://api.poiskkino.dev',
  timeout: 6000,
  headers: {
    'X-API-KEY': API_KEY,
  },
})

export const GENRE_LIST = [
  'драма', 'комедия', 'боевик', 'триллер', 'фантастика',
  'мелодрама', 'ужасы', 'криминал', 'приключения', 'анимация',
  'история', 'биография', 'детектив', 'фэнтези', 'документальный',
]

export const DECADE_LIST = [
  { label: '80-е', from: 1980, to: 1989 },
  { label: '90-е', from: 1990, to: 1999 },
  { label: '2000-е', from: 2000, to: 2009 },
  { label: '2010-е', from: 2010, to: 2019 },
  { label: '2020-е', from: 2020, to: 2029 },
]

export interface FetchMoviesOptions {
  page?: number
  genre?: string
  preferredGenres?: string[]
  minRating?: number
  decade?: { from: number; to: number } | null
}

export const fetchMovies = async ({
  page = 1,
  genre,
  preferredGenres = [],
  minRating,
  decade,
}: FetchMoviesOptions = {}): Promise<KpResponse> => {
  try {
    const params: Record<string, string | number> = {
      limit: 10,
      page,
      notNullFields: 'poster.url',
      type: 'movie',
      'votes.imdb': '10000-99999999',
      movieLength: '60-300',
      sortField: 'votes.imdb',
      sortType: -1,
    }

    if (genre) {
      params['genres.name'] = genre
    } else if (preferredGenres.length > 0) {
      params['genres.name'] = preferredGenres[0]
    }

    if (minRating) {
      params['rating.imdb'] = `${minRating}-10`
    }

    if (decade) {
      params['year'] = `${decade.from}-${decade.to}`
    }

    const response = await api.get<KpResponse>('/v1.4/movie', { params })
    return response.data
  } catch {
    let filtered = genre
      ? MOCK_MOVIES.filter((m) => m.genres.some((g) => g.name === genre))
      : MOCK_MOVIES
    if (minRating) {
      filtered = filtered.filter((m) => (m.rating.imdb || m.rating.kp) >= minRating)
    }
    if (decade) {
      filtered = filtered.filter((m) => m.year && m.year >= decade.from && m.year <= decade.to)
    }
    const pageSize = 10
    const start = (page - 1) * pageSize
    return {
      docs: filtered.slice(start, start + pageSize),
      total: filtered.length,
      limit: pageSize,
      page,
      pages: Math.ceil(filtered.length / pageSize),
    }
  }
}
